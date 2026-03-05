import { useState, useRef, useEffect, useCallback } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Mic, MicOff, Send, Camera, Sparkles, X, CheckCircle2 } from "lucide-react";
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
  onDone: () => void;
}) {
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
        if (content) onDelta(content);
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
        if (content) onDelta(content);
      } catch { /* ignore */ }
    }
  }

  onDone();
}

// Speech Recognition types
interface SpeechRecognitionEvent {
  results: { [index: number]: { [index: number]: { transcript: string } }; length: number };
  resultIndex: number;
}

function useSpeechRecognition() {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const startListening = useCallback((onResult: (text: string) => void) => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast({ title: "Speech not supported", description: "Your browser doesn't support voice input.", variant: "destructive" });
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-AU";

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
    };

    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }, []);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  return { isListening, startListening, stopListening };
}

interface AICloseOutFlowProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  job: JobDetail;
}

export function AICloseOutFlow({ open, onOpenChange, job }: AICloseOutFlowProps) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [photoCount, setPhotoCount] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { isListening, startListening, stopListening } = useSpeechRecognition();
  const hasInitialized = useRef(false);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Send initial context when dialog opens
  useEffect(() => {
    if (open && messages.length === 0 && !hasInitialized.current) {
      hasInitialized.current = true;
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

      sendMessage(contextMsg);
    }
  }, [open]);

  // Reset on close
  useEffect(() => {
    if (!open) {
      setMessages([]);
      setInput("");
      setIsComplete(false);
      setPhotoCount(0);
      hasInitialized.current = false;
    }
  }, [open]);

  const sendMessage = async (msg: Msg) => {
    const newMessages = [...messages, msg];
    // Only show user messages that aren't the context block
    if (!msg.content.startsWith("[JOB CONTEXT")) {
      setMessages(newMessages);
    }
    setIsLoading(true);

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
        onDone: () => {
          setIsLoading(false);
          // Check if the AI indicated completion
          if (assistantSoFar.includes("✅") && assistantSoFar.toLowerCase().includes("all done")) {
            setIsComplete(true);
          }
        },
      });
    } catch (e: any) {
      console.error("AI closeout error:", e);
      setIsLoading(false);
      toast({ title: "AI Error", description: e.message || "Something went wrong.", variant: "destructive" });
    }
  };

  const handleSend = () => {
    const text = input.trim();
    if (!text || isLoading) return;
    setInput("");
    sendMessage({ role: "user", content: text });
  };

  const handleVoice = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening((transcript) => {
        sendMessage({ role: "user", content: transcript });
      });
    }
  };

  const handlePhotoCapture = () => {
    // Simulate photo capture (in production, would use camera API)
    setPhotoCount((c) => c + 1);
    toast({ title: "📸 Photo captured", description: `${photoCount + 1} photo(s) uploaded.` });
    // Let the AI know
    sendMessage({ role: "user", content: `[Photo uploaded — total: ${photoCount + 1}]` });
  };

  const handleSubmit = () => {
    toast({ title: "✅ Job closed out!", description: `${job.jobName} has been completed.` });
    onOpenChange(false);
  };

  // Filter out context messages for display
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

        {/* Action buttons (photos) */}
        <div className="px-4 pb-2 flex gap-2 shrink-0">
          <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={handlePhotoCapture}>
            <Camera className="w-3.5 h-3.5" /> Take Photo {photoCount > 0 && `(${photoCount})`}
          </Button>
          {isComplete && (
            <Button size="sm" className="gap-1.5 text-xs ml-auto bg-green-600 hover:bg-green-700" onClick={handleSubmit}>
              <CheckCircle2 className="w-3.5 h-3.5" /> Submit Close-Out
            </Button>
          )}
        </div>

        {/* Input area */}
        <div className="px-4 pb-4 pt-2 border-t border-border shrink-0">
          <div className="flex gap-2 items-end">
            <Button
              variant={isListening ? "default" : "outline"}
              size="icon"
              className={cn("h-10 w-10 shrink-0", isListening && "bg-red-500 hover:bg-red-600 animate-pulse")}
              onClick={handleVoice}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </Button>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder={isListening ? "Listening..." : "Type or tap mic..."}
              className="min-h-[40px] max-h-[80px] resize-none text-sm"
              rows={1}
              disabled={isListening}
            />
            <Button size="icon" className="h-10 w-10 shrink-0" onClick={handleSend} disabled={!input.trim() || isLoading}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
