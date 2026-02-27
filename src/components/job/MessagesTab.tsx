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
import { Mail, MessageSquare, Send, Zap, ArrowLeft, Reply, Clock } from "lucide-react";

const STATUS_COLORS: Record<Message["status"], string> = {
  Sent: "bg-muted text-muted-foreground",
  Delivered: "bg-primary/20 text-primary",
  Opened: "bg-[hsl(var(--status-green))]/20 text-[hsl(var(--status-green))]",
  Replied: "bg-[hsl(var(--status-green))] text-white",
  Failed: "bg-destructive/20 text-destructive",
};

/* ─── Inbox List Item ─── */
function InboxItem({ msg, onClick, isActive }: { msg: Message; onClick: () => void; isActive: boolean }) {
  const isSms = msg.channel === "sms";
  const isInbound = msg.direction === "inbound";

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left p-3 rounded-lg border transition-colors",
        isActive
          ? "bg-accent border-primary/30"
          : isInbound
            ? "bg-primary/5 border-primary/20 hover:bg-primary/10 ring-1 ring-primary/10"
            : "bg-card border-border hover:bg-accent/50"
      )}
    >
      <div className="flex items-center gap-2 mb-1">
        <div className={cn(
          "w-7 h-7 rounded-full flex items-center justify-center shrink-0",
          isSms ? "bg-primary/20" : "bg-[hsl(var(--status-orange))]/20"
        )}>
          {isSms
            ? <MessageSquare className="w-3.5 h-3.5 text-primary" />
            : <Mail className="w-3.5 h-3.5 text-[hsl(var(--status-orange))]" />
          }
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-card-foreground">
              {isSms ? "SMS" : "Email"} · {isInbound ? "Received" : "Sent"}
            </span>
            <Badge className={cn("text-[9px] px-1.5 py-0 h-4 ml-auto shrink-0", STATUS_COLORS[msg.status])}>
              {msg.status}
            </Badge>
          </div>
          {msg.subject && (
            <div className="text-xs font-medium text-card-foreground truncate mt-0.5">{msg.subject}</div>
          )}
        </div>
      </div>
      <p className="text-xs text-muted-foreground line-clamp-2 pl-9">{msg.body}</p>
      <div className="flex items-center gap-1.5 pl-9 mt-1">
        <Clock className="w-3 h-3 text-muted-foreground" />
        <span className="text-[10px] text-muted-foreground">{msg.timestamp}</span>
      </div>
    </button>
  );
}

/* ─── Message Detail View ─── */
function MessageDetail({ msg, onBack, onReply }: { msg: Message; onBack: () => void; onReply: () => void }) {
  const isSms = msg.channel === "sms";
  const isInbound = msg.direction === "inbound";

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Button size="sm" variant="ghost" onClick={onBack} className="h-8 gap-1 px-2">
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>
      </div>

      <div className="rounded-lg border border-border bg-card p-4 space-y-3">
        {/* Header */}
        <div className="flex items-center gap-2">
          <div className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
            isSms ? "bg-primary/20" : "bg-[hsl(var(--status-orange))]/20"
          )}>
            {isSms
              ? <MessageSquare className="w-4 h-4 text-primary" />
              : <Mail className="w-4 h-4 text-[hsl(var(--status-orange))]" />
            }
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-card-foreground">
              {isSms ? "SMS" : "Email"} · {isInbound ? "Received" : "Sent"}
            </div>
            {msg.subject && (
              <div className="text-sm text-card-foreground font-medium">{msg.subject}</div>
            )}
          </div>
          <Badge className={cn("text-[9px] px-1.5 py-0 h-4 shrink-0", STATUS_COLORS[msg.status])}>
            {msg.status}
          </Badge>
        </div>

        <div className="text-[10px] text-muted-foreground flex items-center gap-1.5">
          <Clock className="w-3 h-3" />
          {msg.timestamp}
          <span className="ml-2">
            {isInbound ? "↙ Inbound" : "↗ Outbound"}
          </span>
        </div>

        {/* Body */}
        <div className="border-t border-border/50 pt-3">
          <p className="text-sm text-card-foreground whitespace-pre-line leading-relaxed">{msg.body}</p>
        </div>

        {/* Reply button */}
        <div className="border-t border-border/50 pt-3">
          <Button size="sm" className="gap-2" onClick={onReply}>
            <Reply className="w-4 h-4" /> Reply
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ─── Compose Panel ─── */
function ComposePanel({ defaultChannel, onClose }: { defaultChannel?: "email" | "sms"; onClose?: () => void }) {
  const [channel, setChannel] = useState<"email" | "sms">(defaultChannel || "email");
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
      onClose?.();
    }, 800);
  };

  return (
    <div className="rounded-lg border border-border bg-card p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          {channel === "email" ? "Compose Email" : "Compose SMS"}
        </span>
        <div className="flex items-center gap-2">
          <MessageSquare className={cn("w-4 h-4", channel === "sms" ? "text-primary" : "text-muted-foreground")} />
          <Switch
            checked={channel === "email"}
            onCheckedChange={(v) => { setChannel(v ? "email" : "sms"); setTemplateId(""); setBody(""); setSubject(""); }}
          />
          <Mail className={cn("w-4 h-4", channel === "email" ? "text-primary" : "text-muted-foreground")} />
        </div>
      </div>

      {channel === "email" && (
        <Input placeholder="To" value="" readOnly className="h-9 text-sm bg-muted/50" />
      )}

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
        className="min-h-[120px] text-sm"
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

      <div className="flex gap-2">
        {onClose && (
          <Button variant="outline" size="sm" onClick={onClose} className="flex-1">Cancel</Button>
        )}
        <Button
          className={cn("gap-2", onClose ? "flex-1" : "w-full")}
          onClick={handleSend}
          disabled={!body.trim() || sending}
        >
          <Send className={cn("w-4 h-4 transition-transform", sending && "translate-x-2 -translate-y-2 opacity-0")} />
          {sending ? "Sending..." : "Send"}
        </Button>
      </div>
    </div>
  );
}

/* ─── Main MessagesTab ─── */
type View = "inbox" | "detail" | "compose";

export function MessagesTab() {
  const [view, setView] = useState<View>("inbox");
  const [selectedMsg, setSelectedMsg] = useState<Message | null>(null);
  const [replyChannel, setReplyChannel] = useState<"email" | "sms">("email");

  const sorted = [...dummyMessages].sort((a, b) => b.timestamp.localeCompare(a.timestamp));

  const handleOpenMessage = (msg: Message) => {
    setSelectedMsg(msg);
    setView("detail");
  };

  const handleReply = () => {
    if (selectedMsg) {
      setReplyChannel(selectedMsg.channel);
    }
    setView("compose");
  };

  if (view === "compose") {
    return (
      <div className="space-y-3">
        <ComposePanel
          defaultChannel={replyChannel}
          onClose={() => {
            setView(selectedMsg ? "detail" : "inbox");
          }}
        />
      </div>
    );
  }

  if (view === "detail" && selectedMsg) {
    return (
      <MessageDetail
        msg={selectedMsg}
        onBack={() => { setSelectedMsg(null); setView("inbox"); }}
        onReply={handleReply}
      />
    );
  }

  // Inbox view
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          Inbox ({sorted.length})
        </span>
        <Button size="sm" className="gap-1.5 h-8" onClick={() => { setSelectedMsg(null); setView("compose"); }}>
          <Send className="w-3.5 h-3.5" /> New Message
        </Button>
      </div>
      <div className="space-y-2">
        {sorted.map((msg) => (
          <InboxItem
            key={msg.id}
            msg={msg}
            isActive={selectedMsg?.id === msg.id}
            onClick={() => handleOpenMessage(msg)}
          />
        ))}
      </div>
    </div>
  );
}
