import { useState, useRef, useEffect, useCallback } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Mic, MicOff, Send, Camera, Sparkles, X, CheckCircle2, Volume2, VolumeX, Keyboard } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import type { JobDetail } from "@/data/dummyJobDetails";
import ReactMarkdown from "react-markdown";

type Msg = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-closeout`;

async function streamChat({
  messages,
  onDelta,
  onDone,
}: {
  messages: Msg[];
  onDelta: (deltaText: string) => void;
  onDone: (fullText: string) => void;
}) {
  console.log("[AI CloseOut] Sending request with", messages.length, "messages");

  const resp = await fetch(CHAT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify({ messages }),
  });

  if (!resp.ok) {
    const err = await resp.json().catch(() => ({ error: "Request failed" }));
    throw new Error(err.error || `HTTP ${resp.status}`);
  }

  if (!resp.body) throw new Error("No response body");

  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let textBuffer = "";
  let fullText = "";
  let streamDone = false;

  while (!streamDone) {
    const { done, value } = await reader.read();
    if (done) break;
    textBuffer += decoder.decode(value, { stream: true });

    let newlineIndex: number;
    while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
      let line = textBuffer.slice(0, newlineIndex);
      textBuffer = textBuffer.slice(newlineIndex + 1);

      if (line.endsWith("\r")) line = line.slice(0, -1);
      if (line.startsWith(":") || line.trim() === "") continue;
      if (!line.startsWith("data: ")) continue;

      const jsonStr = line.slice(6).trim();
      if (jsonStr === "[DONE]") {
        streamDone = true;
        break;
      }

      try {
        const parsed = JSON.parse(jsonStr);
        const content = parsed.choices?.[0]?.delta?.content as string | undefined;
        if (content) {
          fullText += content;
          onDelta(content);
        }
      } catch {
        textBuffer = line + "\n" + textBuffer;
        break;
      }
    }
  }

  // Final flush
  if (textBuffer.trim()) {
    for (let raw of textBuffer.split("\n")) {
      if (!raw) continue;
      if (raw.endsWith("\r")) raw = raw.slice(0, -1);
      if (raw.startsWith(":") || raw.trim() === "") continue;
      if (!raw.startsWith("data: ")) continue;
      const jsonStr = raw.slice(6).trim();
      if (jsonStr === "[DONE]") continue;
      try {
        const parsed = JSON.parse(jsonStr);
        const content = parsed.choices?.[0]?.delta?.content as string | undefined;
        if (content) {
          fullText += content;
          onDelta(content);
        }
      } catch { /* ignore */ }
    }
  }

  console.log("[AI CloseOut] Stream complete, total length:", fullText.length);
  onDone(fullText);
}

// ── Speech Recognition hook (continuous / open-mic) ──

function useContinuousSpeech() {
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const recognitionRef = useRef<any>(null);
  const onResultRef = useRef<((text: string) => void) | null>(null);
  const shouldBeListeningRef = useRef(false);
  const isMutedRef = useRef(false);

  // Keep muted ref in sync
  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  const createRecognition = useCallback(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return null;

    const recognition = new SR();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-AU";

    recognition.onresult = (event: any) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          const transcript = event.results[i][0].transcript.trim();
          console.log("[AI CloseOut] Speech recognized:", transcript);
          if (transcript && onResultRef.current) {
            onResultRef.current(transcript);
          }
        }
      }
    };

    recognition.onend = () => {
      console.log("[AI CloseOut] Recognition onend, shouldBe:", shouldBeListeningRef.current, "muted:", isMutedRef.current);
      setIsListening(false);
      // Auto-restart if we should still be listening
      if (shouldBeListeningRef.current && !isMutedRef.current) {
        setTimeout(() => {
          if (shouldBeListeningRef.current && !isMutedRef.current) {
            try {
              if (recognitionRef.current) {
                recognitionRef.current.start();
                setIsListening(true);
                console.log("[AI CloseOut] Auto-restarted recognition");
              }
            } catch (e) {
              console.warn("[AI CloseOut] Auto-restart failed:", e);
            }
          }
        }, 300);
      }
    };

    recognition.onerror = (e: any) => {
      if (e.error === "no-speech" || e.error === "aborted") return;
      console.warn("[AI CloseOut] Speech recognition error:", e.error);
    };

    return recognition;
  }, []);

  const startListening = useCallback((onResult: (text: string) => void) => {
    console.log("[AI CloseOut] startListening called");
    onResultRef.current = onResult;
    shouldBeListeningRef.current = true;

    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch { /* */ }
    }

    const recognition = createRecognition();
    if (!recognition) {
      toast({ title: "Speech not supported", description: "Your browser doesn't support voice input.", variant: "destructive" });
      return;
    }

    recognitionRef.current = recognition;
    try {
      recognition.start();
      setIsListening(true);
      console.log("[AI CloseOut] Recognition started successfully");
    } catch (e) {
      console.warn("[AI CloseOut] Recognition start failed:", e);
    }
  }, [createRecognition]);

  const updateCallback = useCallback((onResult: (text: string) => void) => {
    onResultRef.current = onResult;
  }, []);

  const pauseListening = useCallback(() => {
    console.log("[AI CloseOut] pauseListening");
    shouldBeListeningRef.current = false;
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch { /* */ }
    }
    setIsListening(false);
  }, []);

  const resumeListening = useCallback(() => {
    if (isMutedRef.current) return;
    console.log("[AI CloseOut] resumeListening");
    shouldBeListeningRef.current = true;

    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
        console.log("[AI CloseOut] Resumed existing recognition");
      } catch {
        // Recreate if needed
        console.log("[AI CloseOut] Recreating recognition for resume");
        const recognition = createRecognition();
        if (recognition) {
          recognitionRef.current = recognition;
          recognition.start();
          setIsListening(true);
        }
      }
    } else {
      // No existing recognition — create fresh one
      console.log("[AI CloseOut] No recognition instance, creating new one for resume");
      const recognition = createRecognition();
      if (recognition) {
        recognitionRef.current = recognition;
        try {
          recognition.start();
          setIsListening(true);
        } catch (e) {
          console.warn("[AI CloseOut] Resume start failed:", e);
        }
      }
    }
  }, [createRecognition]);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      const newMuted = !prev;
      console.log("[AI CloseOut] toggleMute →", newMuted);
      if (newMuted) {
        shouldBeListeningRef.current = false;
        if (recognitionRef.current) {
          try { recognitionRef.current.stop(); } catch { /* */ }
        }
        setIsListening(false);
      }
      return newMuted;
    });
  }, []);

  const stopCompletely = useCallback(() => {
    console.log("[AI CloseOut] stopCompletely");
    shouldBeListeningRef.current = false;
    onResultRef.current = null;
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch { /* */ }
      recognitionRef.current = null;
    }
    setIsListening(false);
  }, []);

  return { isListening, isMuted, startListening, updateCallback, pauseListening, resumeListening, toggleMute, stopCompletely };
}

// ── Text-to-Speech hook ──

function useTTS() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);

  const speak = useCallback((text: string, onEnd?: () => void) => {
    if (!ttsEnabled || !window.speechSynthesis) {
      console.log("[AI CloseOut] TTS skipped (disabled or unsupported)");
      onEnd?.();
      return;
    }

    const cleanText = text
      .replace(/[#*_`~>\[\]()!]/g, "")
      .replace(/\n+/g, ". ")
      .replace(/\s+/g, " ")
      .trim();

    if (!cleanText) {
      onEnd?.();
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;
    utterance.lang = "en-AU";

    utterance.onstart = () => {
      console.log("[AI CloseOut] TTS started");
      setIsSpeaking(true);
    };
    utterance.onend = () => {
      console.log("[AI CloseOut] TTS ended");
      setIsSpeaking(false);
      onEnd?.();
    };
    utterance.onerror = () => {
      console.log("[AI CloseOut] TTS error");
      setIsSpeaking(false);
      onEnd?.();
    };

    window.speechSynthesis.speak(utterance);
  }, [ttsEnabled]);

  const stopSpeaking = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  const toggleTTS = useCallback(() => {
    setTtsEnabled(prev => {
      if (!prev === false) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      }
      return !prev;
    });
  }, []);

  return { isSpeaking, ttsEnabled, speak, stopSpeaking, toggleTTS };
}

// ── Main Component ──

interface AICloseOutFlowProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  job: JobDetail;
}

export function AICloseOutFlow({ open, onOpenChange, job }: AICloseOutFlowProps) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const messagesRef = useRef<Msg[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [photoCount, setPhotoCount] = useState(0);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef(false);

  const speech = useContinuousSpeech();
  const tts = useTTS();

  // Keep messagesRef in sync
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Stable sendMessage that reads from ref
  const sendMessage = useCallback(async (msg: Msg, isInitial = false) => {
    const currentMessages = messagesRef.current;
    const newMessages = [...currentMessages, msg];

    // Update state and ref immediately
    if (!msg.content.startsWith("[JOB CONTEXT")) {
      setMessages(newMessages);
    } else {
      // Still update ref for context messages
      messagesRef.current = newMessages;
    }

    setIsLoading(true);
    speech.pauseListening();

    console.log("[AI CloseOut] sendMessage called, history length:", newMessages.length, "isInitial:", isInitial);

    let assistantSoFar = "";
    const upsertAssistant = (nextChunk: string) => {
      assistantSoFar += nextChunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
        }
        return [...prev, { role: "assistant", content: assistantSoFar }];
      });
    };

    try {
      await streamChat({
        messages: newMessages,
        onDelta: (chunk) => upsertAssistant(chunk),
        onDone: (fullText) => {
          setIsLoading(false);
          console.log("[AI CloseOut] AI response complete, length:", fullText.length);

          if (fullText.includes("✅") && fullText.toLowerCase().includes("all done")) {
            setIsComplete(true);
          }

          // Speak the response, then resume listening
          tts.speak(fullText, () => {
            console.log("[AI CloseOut] TTS finished, resuming mic");
            if (isInitial) {
              // First time: use startListening to properly initialize
              speech.startListening((transcript: string) => {
                console.log("[AI CloseOut] Speech callback fired:", transcript);
                if (transcript.trim()) {
                  // Read latest messages from ref
                  const userMsg: Msg = { role: "user", content: transcript };
                  sendMessage(userMsg);
                }
              });
            } else {
              speech.resumeListening();
            }
          });

          // If TTS is disabled and this is initial, start mic immediately
          if (isInitial && !tts.ttsEnabled) {
            setTimeout(() => {
              speech.startListening((transcript: string) => {
                console.log("[AI CloseOut] Speech callback fired:", transcript);
                if (transcript.trim()) {
                  const userMsg: Msg = { role: "user", content: transcript };
                  sendMessage(userMsg);
                }
              });
            }, 500);
          }
        },
      });
    } catch (e: any) {
      console.error("[AI CloseOut] AI error:", e);
      setIsLoading(false);
      speech.resumeListening();
      toast({ title: "AI Error", description: e.message || "Something went wrong.", variant: "destructive" });
    }
  }, [speech, tts]);

  // Update the speech callback ref whenever sendMessage changes
  useEffect(() => {
    speech.updateCallback((transcript: string) => {
      console.log("[AI CloseOut] Updated speech callback fired:", transcript);
      if (transcript.trim()) {
        const userMsg: Msg = { role: "user", content: transcript };
        sendMessage(userMsg);
      }
    });
  }, [sendMessage, speech.updateCallback]);

  // Send initial context when dialog opens
  useEffect(() => {
    if (open && messages.length === 0 && !hasInitialized.current) {
      hasInitialized.current = true;
      console.log("[AI CloseOut] Dialog opened, sending initial context");

      const materialsText = job.materials.length > 0
        ? `Materials from quote: ${job.materials.map(m => `${m.name} (${m.quantity} ${m.unit})`).join(", ")}`
        : "No materials listed on the quote.";

      const contextMsg: Msg = {
        role: "user",
        content: `[JOB CONTEXT - do not repeat this verbatim, just use it for reference]
Job: ${job.jobName}
Customer: ${job.client}
Address: ${job.address}
Stage: ${job.stage}
${materialsText}

Start the close-out conversation now.`,
      };

      sendMessage(contextMsg, true);
    }
  }, [open]);

  // Reset on close
  useEffect(() => {
    if (!open) {
      setMessages([]);
      messagesRef.current = [];
      setInput("");
      setIsComplete(false);
      setPhotoCount(0);
      setShowKeyboard(false);
      hasInitialized.current = false;
      speech.stopCompletely();
      tts.stopSpeaking();
    }
  }, [open]);

  const handleSend = () => {
    const text = input.trim();
    if (!text || isLoading) return;
    setInput("");
    sendMessage({ role: "user", content: text });
  };

  const handlePhotoCapture = () => {
    setPhotoCount((c) => c + 1);
    toast({ title: "📸 Photo captured", description: `${photoCount + 1} photo(s) uploaded.` });
    sendMessage({ role: "user", content: `[Photo uploaded — total: ${photoCount + 1}]` });
  };

  const handleSubmit = () => {
    toast({ title: "✅ Job closed out!", description: `${job.jobName} has been completed.` });
    onOpenChange(false);
  };

  const displayMessages = messages.filter((m) => !m.content.startsWith("[JOB CONTEXT"));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg h-[85vh] flex flex-col p-0 gap-0">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border shrink-0">
          <div className="w-9 h-9 rounded-lg bg-violet-500/15 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-violet-500" />
          </div>
          <div className="flex-1 min-w-0">
            <DialogTitle className="text-sm font-bold text-card-foreground">AI Close-Out</DialogTitle>
            <p className="text-xs text-muted-foreground truncate">{job.jobName}</p>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onOpenChange(false)}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          {displayMessages.map((msg, i) => (
            <div key={i} className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}>
              <div
                className={cn(
                  "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm",
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : "bg-muted text-foreground rounded-bl-md"
                )}
              >
                {msg.role === "assistant" ? (
                  <div className="prose prose-sm dark:prose-invert max-w-none [&>p]:mb-1 [&>p:last-child]:mb-0">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                ) : (
                  msg.content.startsWith("[Photo") ? (
                    <span className="flex items-center gap-1.5">
                      <Camera className="w-4 h-4" /> {msg.content.replace(/[\[\]]/g, "")}
                    </span>
                  ) : msg.content
                )}
              </div>
            </div>
          ))}

          {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:0ms]" />
                  <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:150ms]" />
                  <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom bar */}
        <div className="px-4 pb-4 pt-2 border-t border-border shrink-0 space-y-2">
          {/* Status indicator */}
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            {tts.isSpeaking && (
              <span className="flex items-center gap-1.5 text-violet-500">
                <Volume2 className="w-3.5 h-3.5 animate-pulse" /> Speaking...
              </span>
            )}
            {speech.isListening && !tts.isSpeaking && (
              <span className="flex items-center gap-1.5 text-green-500">
                <Mic className="w-3.5 h-3.5 animate-pulse" /> Listening...
              </span>
            )}
            {speech.isMuted && !tts.isSpeaking && (
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <MicOff className="w-3.5 h-3.5" /> Mic muted
              </span>
            )}
            {isLoading && !tts.isSpeaking && (
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 animate-spin" /> Thinking...
              </span>
            )}
          </div>

          {/* Action row */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Button
                variant={speech.isMuted ? "outline" : "default"}
                size="icon"
                className={cn(
                  "h-12 w-12 rounded-full",
                  !speech.isMuted && speech.isListening && "bg-green-600 hover:bg-green-700 animate-pulse",
                  !speech.isMuted && !speech.isListening && "bg-green-600 hover:bg-green-700",
                  speech.isMuted && "border-destructive text-destructive"
                )}
                onClick={speech.toggleMute}
              >
                {speech.isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </Button>

              <Button
                variant="outline"
                size="icon"
                className={cn("h-10 w-10 rounded-full", !tts.ttsEnabled && "text-muted-foreground")}
                onClick={tts.toggleTTS}
              >
                {tts.ttsEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </Button>

              <Button variant="outline" size="icon" className="h-10 w-10 rounded-full" onClick={handlePhotoCapture}>
                <Camera className="w-4 h-4" />
              </Button>
              {photoCount > 0 && <span className="text-xs text-muted-foreground">{photoCount} 📸</span>}
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full"
                onClick={() => setShowKeyboard(!showKeyboard)}
              >
                <Keyboard className="w-4 h-4" />
              </Button>

              {isComplete && (
                <Button size="sm" className="gap-1.5 bg-green-600 hover:bg-green-700" onClick={handleSubmit}>
                  <CheckCircle2 className="w-3.5 h-3.5" /> Submit
                </Button>
              )}
            </div>
          </div>

          {showKeyboard && (
            <div className="flex gap-2 items-end pt-1">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Type a message..."
                className="min-h-[40px] max-h-[80px] resize-none text-sm"
                rows={1}
              />
              <Button size="icon" className="h-10 w-10 shrink-0" onClick={handleSend} disabled={!input.trim() || isLoading}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
