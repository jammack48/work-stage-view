import { useState } from "react";
import { Star, Send, MessageSquare, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { dummyTemplates } from "@/data/dummyTemplates";
import { toast } from "sonner";

interface ReviewRequestDialogProps {
  customerName: string;
}

export function ReviewRequestDialog({ customerName }: ReviewRequestDialogProps) {
  const [open, setOpen] = useState(false);
  const [sendSms, setSendSms] = useState(true);
  const [sendEmail, setSendEmail] = useState(true);
  const [smsTemplateId, setSmsTemplateId] = useState("s-rv-1");
  const [emailTemplateId, setEmailTemplateId] = useState("e-rv-1");

  const smsTemplates = dummyTemplates.filter((t) => t.channel === "sms" && t.category === "reviews");
  const emailTemplates = dummyTemplates.filter((t) => t.channel === "email" && t.category === "reviews");

  const handleSend = () => {
    const channels: string[] = [];
    if (sendSms) channels.push("SMS");
    if (sendEmail) channels.push("Email");

    if (channels.length === 0) {
      toast.error("Select at least one channel");
      return;
    }

    toast.success(`Review request sent to ${customerName} via ${channels.join(" & ")}`);
    setOpen(false);
  };

  const getTemplate = (id: string) => dummyTemplates.find((t) => t.id === id);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="justify-start gap-2">
          <Star className="w-4 h-4" /> Review Request
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-primary" />
            Send Review Request
          </DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">
          Ask <span className="font-medium text-card-foreground">{customerName}</span> to leave a review. Pick which channels and templates to use.
        </p>

        <div className="space-y-4 pt-2">
          {/* SMS Channel */}
          <div className="rounded-lg border border-border p-3 space-y-2">
            <div className="flex items-center gap-2">
              <Checkbox id="send-sms" checked={sendSms} onCheckedChange={(v) => setSendSms(!!v)} />
              <label htmlFor="send-sms" className="flex items-center gap-1.5 text-sm font-medium cursor-pointer">
                <MessageSquare className="w-4 h-4 text-primary" /> SMS
              </label>
            </div>
            {sendSms && (
              <>
                <Select value={smsTemplateId} onValueChange={setSmsTemplateId}>
                  <SelectTrigger className="text-sm h-9">
                    <SelectValue placeholder="Select SMS template…" />
                  </SelectTrigger>
                  <SelectContent>
                    {smsTemplates.map((t) => (
                      <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {getTemplate(smsTemplateId) && (
                  <p className="text-xs text-muted-foreground bg-muted/50 rounded p-2 whitespace-pre-line">
                    {getTemplate(smsTemplateId)!.body}
                  </p>
                )}
              </>
            )}
          </div>

          {/* Email Channel */}
          <div className="rounded-lg border border-border p-3 space-y-2">
            <div className="flex items-center gap-2">
              <Checkbox id="send-email" checked={sendEmail} onCheckedChange={(v) => setSendEmail(!!v)} />
              <label htmlFor="send-email" className="flex items-center gap-1.5 text-sm font-medium cursor-pointer">
                <Mail className="w-4 h-4 text-[hsl(var(--status-orange))]" /> Email
              </label>
            </div>
            {sendEmail && (
              <>
                <Select value={emailTemplateId} onValueChange={setEmailTemplateId}>
                  <SelectTrigger className="text-sm h-9">
                    <SelectValue placeholder="Select Email template…" />
                  </SelectTrigger>
                  <SelectContent>
                    {emailTemplates.map((t) => (
                      <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {getTemplate(emailTemplateId) && (
                  <div className="text-xs text-muted-foreground bg-muted/50 rounded p-2 space-y-1">
                    <p className="font-medium text-card-foreground">{getTemplate(emailTemplateId)!.subject}</p>
                    <p className="whitespace-pre-line">{getTemplate(emailTemplateId)!.body}</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>Cancel</Button>
          <Button size="sm" className="gap-1.5" onClick={handleSend}>
            <Send className="w-3.5 h-3.5" /> Send Request
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
