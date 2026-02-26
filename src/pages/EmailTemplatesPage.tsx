import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Pencil, Trash2 } from "lucide-react";

import { PageToolbar } from "@/components/PageToolbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { buildTabs, handleCommonTab, EMAIL_EXTRAS } from "@/config/toolbarTabs";
import { dummyTemplates, TIMING_LABELS, TEMPLATE_VARIABLES, type MessageTemplate } from "@/data/dummyTemplates";

type Category = MessageTemplate["category"];

const EMAIL_TABS = buildTabs(...EMAIL_EXTRAS);

export default function EmailTemplatesPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Category>("quotes");
  const [templates, setTemplates] = useState(dummyTemplates.filter((t) => t.channel === "email"));
  const [editing, setEditing] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [draft, setDraft] = useState({ name: "", subject: "", body: "", timing: "immediately" as MessageTemplate["timing"] });

  const filtered = templates.filter((t) => t.category === activeTab);

  const resetDraft = () => { setDraft({ name: "", subject: "", body: "", timing: "immediately" }); setShowNew(false); setEditing(null); };

  const saveNew = () => {
    if (!draft.name.trim()) return;
    const t: MessageTemplate = { id: `e-new-${Date.now()}`, name: draft.name, category: activeTab, channel: "email", subject: draft.subject, body: draft.body, timing: draft.timing, isActive: true };
    setTemplates((prev) => [...prev, t]);
    resetDraft();
  };

  const saveEdit = (id: string) => {
    setTemplates((prev) => prev.map((t) => t.id === id ? { ...t, name: draft.name, subject: draft.subject, body: draft.body, timing: draft.timing } : t));
    resetDraft();
  };

  const toggleActive = (id: string) => setTemplates((prev) => prev.map((t) => t.id === id ? { ...t, isActive: !t.isActive } : t));
  const deleteTemplate = (id: string) => setTemplates((prev) => prev.filter((t) => t.id !== id));

  const startEdit = (t: MessageTemplate) => { setEditing(t.id); setDraft({ name: t.name, subject: t.subject || "", body: t.body, timing: t.timing }); setShowNew(false); };

  const renderEditor = (onSave: () => void) => (
    <div className="rounded-lg border border-primary/30 bg-card p-4 space-y-3">
      <Input placeholder="Template name" value={draft.name} onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))} className="text-sm" />
      <Input placeholder="Subject line" value={draft.subject} onChange={(e) => setDraft((d) => ({ ...d, subject: e.target.value }))} className="text-sm" />
      <Textarea placeholder="Email body" value={draft.body} onChange={(e) => setDraft((d) => ({ ...d, body: e.target.value }))} className="min-h-[120px] text-sm" />
      <div className="flex flex-wrap items-center gap-1">
        <span className="text-xs text-muted-foreground">Variables:</span>
        {TEMPLATE_VARIABLES.map((v) => (
          <button key={v} type="button" onClick={() => setDraft((d) => ({ ...d, body: d.body + v }))} className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground hover:bg-primary/10 transition-colors">{v}</button>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <Select value={draft.timing} onValueChange={(v) => setDraft((d) => ({ ...d, timing: v as MessageTemplate["timing"] }))}>
          <SelectTrigger className="w-44 text-sm"><SelectValue /></SelectTrigger>
          <SelectContent>{Object.entries(TIMING_LABELS).map(([k, l]) => (<SelectItem key={k} value={k}>{l}</SelectItem>))}</SelectContent>
        </Select>
        <Button size="sm" onClick={onSave}>Save</Button>
        <Button size="sm" variant="outline" onClick={resetDraft}>Cancel</Button>
      </div>
    </div>
  );

  return (
    <PageToolbar
      tabs={EMAIL_TABS}
      activeTab={activeTab}
      onTabChange={(id) => {
        if (handleCommonTab(id, navigate)) return;
        setActiveTab(id as Category);
        resetDraft();
      }}
      pageHeading={<h2 className="text-base font-bold text-card-foreground">Email Templates</h2>}
    >
      <div className="space-y-4">
        <div className="flex justify-end">
          <Button size="sm" onClick={() => { resetDraft(); setShowNew(true); }}><Plus className="w-4 h-4 mr-1" /> New Template</Button>
        </div>

        {showNew && renderEditor(saveNew)}

        {filtered.length === 0 && !showNew && (
          <p className="text-sm text-muted-foreground text-center py-8">No email templates for this category yet.</p>
        )}

        {filtered.map((t) =>
          editing === t.id ? (
            <div key={t.id}>{renderEditor(() => saveEdit(t.id))}</div>
          ) : (
            <div key={t.id} className="rounded-lg border border-border bg-card p-4 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-card-foreground">{t.name}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{TIMING_LABELS[t.timing]}</span>
                  </div>
                  {t.subject && <p className="text-xs text-muted-foreground mt-1">Subject: {t.subject}</p>}
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{t.body}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Switch checked={t.isActive} onCheckedChange={() => toggleActive(t.id)} />
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => startEdit(t)}><Pencil className="w-4 h-4" /></Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => deleteTemplate(t.id)}><Trash2 className="w-4 h-4" /></Button>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </PageToolbar>
  );
}
