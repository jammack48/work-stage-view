import { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Send, Hash, MessageCircle, ChevronLeft, AtSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { CHANNELS, INITIAL_MESSAGES, STAFF_LIST, type ChatMessage, type Channel } from "@/data/dummyTeamChat";
import { TutorialBanner } from "@/components/TutorialBanner";

function renderMessageText(text: string) {
  const parts = text.split(/(@\w+)/g);
  return parts.map((part, i) =>
    part.startsWith("@") ? (
      <Badge key={i} variant="secondary" className="text-[10px] px-1.5 py-0 mx-0.5 bg-primary/15 text-primary font-semibold">
        {part}
      </Badge>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

export default function WorkChat() {
  const navigate = useNavigate();
  const [activeChannel, setActiveChannel] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [compose, setCompose] = useState("");
  const [showMentions, setShowMentions] = useState(false);
  const [mentionFilter, setMentionFilter] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const channel = CHANNELS.find((c) => c.id === activeChannel);
  const channelMessages = useMemo(
    () => messages.filter((m) => m.channelId === activeChannel),
    [messages, activeChannel]
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [channelMessages.length, activeChannel]);

  const handleCompose = (value: string) => {
    setCompose(value);
    const atMatch = value.match(/@(\w*)$/);
    if (atMatch) {
      setShowMentions(true);
      setMentionFilter(atMatch[1].toLowerCase());
    } else {
      setShowMentions(false);
    }
  };

  const insertMention = (name: string) => {
    const newVal = compose.replace(/@\w*$/, `@${name} `);
    setCompose(newVal);
    setShowMentions(false);
    inputRef.current?.focus();
  };

  const handleSend = () => {
    if (!compose.trim() || !activeChannel) return;
    const mentionMatches = compose.match(/@(\w+)/g);
    const newMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      channelId: activeChannel,
      author: "You",
      avatar: "YO",
      text: compose.trim(),
      timestamp: "Just now",
      mentions: mentionMatches?.map((m) => m.slice(1)),
    };
    setMessages([...messages, newMsg]);
    setCompose("");
    setShowMentions(false);
  };

  const filteredStaff = STAFF_LIST.filter((s) =>
    s.name.toLowerCase().includes(mentionFilter)
  );

  // Channel list view
  if (!activeChannel) {
    return (
      <div className="max-w-lg mx-auto px-4 py-4">
        <TutorialBanner overrideKey="work-chat" />
        <div className="flex items-center gap-2 mb-4">
          <MessageCircle className="w-5 h-5 text-primary" />
          <h1 className="text-lg font-bold text-foreground">Team Chat</h1>
        </div>
        <div className="space-y-1">
          {CHANNELS.map((ch) => (
            <button
              key={ch.id}
              onClick={() => setActiveChannel(ch.id)}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-secondary transition-colors text-left"
            >
              <span className="text-lg">{ch.icon}</span>
              <div className="flex-1 min-w-0">
                <span className="text-sm font-medium text-foreground">{ch.name}</span>
                {ch.type === "job" && (
                  <span className="text-[10px] text-muted-foreground ml-1.5">Job</span>
                )}
              </div>
              {ch.unread > 0 && (
                <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                  {ch.unread}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Chat thread view
  return (
    <div className="max-w-lg mx-auto flex flex-col h-[calc(100vh-48px-56px)]">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-background sticky top-0 z-10">
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setActiveChannel(null)}>
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <span className="text-base">{channel?.icon}</span>
        <span className="font-semibold text-sm text-foreground">{channel?.name}</span>
        {channel?.jobId && (
          <Badge
            variant="outline"
            className="text-[10px] ml-auto cursor-pointer"
            onClick={() => navigate(`/job/${channel.jobId}`)}
          >
            View Job
          </Badge>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
        {channelMessages.map((msg) => (
          <div key={msg.id} className="flex gap-2.5">
            <Avatar className="w-8 h-8 shrink-0">
              <AvatarFallback className={cn("text-[10px] font-bold", msg.isManagement && "bg-primary text-primary-foreground")}>
                {msg.avatar}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className={cn("text-xs font-semibold", msg.isManagement ? "text-primary" : "text-foreground")}>
                  {msg.author}
                </span>
                <span className="text-[10px] text-muted-foreground">{msg.timestamp}</span>
              </div>
              <p className="text-sm text-foreground leading-relaxed">{renderMessageText(msg.text)}</p>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Compose */}
      <div className="relative border-t border-border bg-background px-4 py-3">
        {showMentions && filteredStaff.length > 0 && (
          <div className="absolute bottom-full left-4 right-4 mb-1 bg-popover border border-border rounded-lg shadow-lg max-h-40 overflow-y-auto">
            {filteredStaff.map((s) => (
              <button
                key={s.name}
                onClick={() => insertMention(s.name.split(" ")[0])}
                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-secondary text-left text-sm"
              >
                <Avatar className="w-6 h-6">
                  <AvatarFallback className="text-[9px]">{s.avatar}</AvatarFallback>
                </Avatar>
                {s.name}
              </button>
            ))}
          </div>
        )}
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" className="h-9 w-9 p-0 shrink-0" onClick={() => handleCompose(compose + "@")}>
            <AtSign className="w-4 h-4" />
          </Button>
          <Input
            ref={inputRef}
            value={compose}
            onChange={(e) => handleCompose(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type a message..."
            className="h-9 text-sm"
          />
          <Button size="sm" className="h-9 w-9 p-0 shrink-0" onClick={handleSend}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
