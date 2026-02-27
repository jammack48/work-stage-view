import { useState } from "react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { dummyMessages, type Message } from "@/data/dummyMessages";
import { dummyTemplates } from "@/data/dummyTemplates";
import { dummySequences } from "@/data/dummySequences";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Mail, MessageSquare, Send, Zap } from "lucide-react";

const STATUS_COLORS: Record<Message["status"], string> = {
  Sent: "bg-muted text-muted-foreground",
  Delivered: "bg-primary/20 text-primary",
  Opened: "bg-[hsl(var(--status-green))]/20 text-[hsl(var(--status-green))]",
  Replied: "bg-[hsl(var(--status-green))] text-white",
  Failed: "bg-destructive/20 text-destructive",
};

function MessageBubble({ msg }: { msg: Message }) {
  const isInbound = msg.direction === "inbound";
  const isSms = msg.channel === "sms";

  if (isSms) {
    return (
      <div className={cn("flex", isInbound ? "justify-start" : "justify-end")}>
        <div className={cn("max-w-[80%] space-y-1", isInbound ? "items-start" : "items-end")}>
          <div
            className={cn(
              "rounded-2xl px-4 py-2.5 text-sm",
              isInbound
                ? "bg-muted text-card-foreground rounded-bl-md"
                : "bg-primary text-primary-foreground rounded-br-md"
            )}
          >
            {msg.body}
          </div>
          <div className={cn("flex items-center gap-2 px-1", isInbound ? "" : "justify-end")}>
            <MessageSquare className="w-3 h-3 text-muted-foreground" />
            <span className="text-[10px] text-muted-foreground">{msg.timestamp}</span>
            <Badge className={cn("text-[9px] px-1.5 py-0 h-4", STATUS_COLORS[msg.status])}>{msg.status}</Badge>
          </div>
        </div>
      </div>
    );
  }

  // Email card
  return (
    <div className={cn("flex", isInbound ? "justify-start" : "justify-end")}>
      <div className={cn("max-w-[85%] rounded-lg border border-border bg-card p-3 space-y-2", isInbound ? "" : "")}>
        <div className="flex items-center gap-2">
          <Mail className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-xs font-semibold text-card-foreground truncate">{msg.subject}</span>
          <Badge className={cn("text-[9px] px-1.5 py-0 h-4 ml-auto shrink-0", STATUS_COLORS[msg.status])}>{msg.status}</Badge>
        </div>
        <p className="text-sm text-card-foreground whitespace-pre-line leading-relaxed">{msg.body}</p>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-muted-foreground">{msg.timestamp}</span>
          <span className={cn(
            "text-[10px] font-medium",
            isInbound ? "text-[hsl(var(--status-green))]" : "text-muted-foreground"
          )}>
            {isInbound ? "↙ Inbound" : "↗ Outbound"}
          </span>
        </div>
      </div>
    </div>
  );
}

function ComposePanel() {
  const [channel, setChannel] = useState<"email" | "sms">("email");
  const [templateId, setTemplateId] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [attachSequence, setAttachSequence] = useState(false);
  const [sequenceId, setSequenceId] = useState("");
  const [sending, setSending] = useState(false);

  const templates = dummyTemplates.filter((t) => t.channel === channel && t.isActive);

  const handleTemplateSelect = (id: string) => {
    setTemplateId(id);
    const tpl = dummyTemplates.find((t) => t.id === id);
    if (tpl) {
      setBody(tpl.body);
      if (tpl.subject) setSubject(tpl.subject);
    }
  };

  const handleSend = () => {
    setSending(true);
    setTimeout(() => {
      setSending(false);
      toast.success(`${channel === "email" ? "Email" : "SMS"} sent successfully`);
      setBody("");
      setSubject("");
      setTemplateId("");
    }, 800);
  };

  return (
    <div className="rounded-lg border border-border bg-card p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Compose</span>
        <div className="flex items-center gap-2">
          <MessageSquare className={cn("w-4 h-4", channel === "sms" ? "text-primary" : "text-muted-foreground")} />
          <Switch
            checked={channel === "email"}
            onCheckedChange={(v) => { setChannel(v ? "email" : "sms"); setTemplateId(""); setBody(""); setSubject(""); }}
          />
          <Mail className={cn("w-4 h-4", channel === "email" ? "text-primary" : "text-muted-foreground")} />
        </div>
      </div>

      <Select value={templateId} onValueChange={handleTemplateSelect}>
        <SelectTrigger className="h-9 text-sm">
          <SelectValue placeholder="Choose a template..." />
        </SelectTrigger>
        <SelectContent>
          {templates.map((t) => (
            <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {channel === "email" && (
        <Input
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="h-9 text-sm"
        />
      )}

      <Textarea
        placeholder={channel === "email" ? "Email body..." : "SMS message..."}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        className="min-h-[100px] text-sm"
      />

      <div className="flex items-center gap-2">
        <Checkbox
          id="attach-seq"
          checked={attachSequence}
          onCheckedChange={(v) => setAttachSequence(!!v)}
        />
        <label htmlFor="attach-seq" className="text-xs text-muted-foreground cursor-pointer">
          Attach follow-up sequence
        </label>
      </div>

      {attachSequence && (
        <Select value={sequenceId} onValueChange={setSequenceId}>
          <SelectTrigger className="h-9 text-sm">
            <SelectValue placeholder="Choose sequence..." />
          </SelectTrigger>
          <SelectContent>
            {dummySequences.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                <span className="flex items-center gap-1.5">
                  <Zap className="w-3 h-3" /> {s.name}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      <Button
        className="w-full gap-2"
        onClick={handleSend}
        disabled={!body.trim() || sending}
      >
        <Send className={cn("w-4 h-4 transition-transform", sending && "translate-x-2 -translate-y-2 opacity-0")} />
        {sending ? "Sending..." : "Send"}
      </Button>
    </div>
  );
}

export function MessagesTab() {
  const isMobile = useIsMobile();

  return (
    <div className={cn("gap-4", isMobile ? "flex flex-col" : "grid grid-cols-[1fr_340px]")}>
      {/* Conversation thread */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Conversation ({dummyMessages.length} messages)
          </span>
        </div>
        <div className="space-y-3">
          {dummyMessages.map((msg) => (
            <MessageBubble key={msg.id} msg={msg} />
          ))}
        </div>
      </div>

      {/* Compose panel */}
      <div className={cn(isMobile ? "" : "sticky top-4 self-start")}>
        <ComposePanel />
      </div>
    </div>
  );
}
