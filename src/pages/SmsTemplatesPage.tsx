import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Pencil, Trash2 } from "lucide-react";

import { PageToolbar } from "@/components/PageToolbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { buildTabs, handleCommonTab, SMS_EXTRAS } from "@/config/toolbarTabs";
import { dummyTemplates, TEMPLATE_VARIABLES, type MessageTemplate } from "@/data/dummyTemplates";

type Category = MessageTemplate["category"];

const SMS_TABS = buildTabs(...SMS_EXTRAS);

export default function SmsTemplatesPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Category>("quotes");
  const [templates, setTemplates] = useState(dummyTemplates.filter((t) => t.channel === "sms"));
  const [editing, setEditing] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [draft, setDraft] = useState({ name: "", body: "" });

  const filtered = templates.filter((t) => t.category === activeTab);

  const resetDraft = () => { setDraft({ name: "", body: "" }); setShowNew(false); setEditing(null); };

  const saveNew = () => {
    if (!draft.name.trim()) return;
    const t: MessageTemplate = { id: `s-new-${Date.now()}`, name: draft.name, category: activeTab, channel: "sms", body: draft.body, timing: "immediately", isActive: true };
    setTemplates((prev) => [...prev, t]);
    resetDraft();
  };

  const saveEdit = (id: string) => {
    setTemplates((prev) => prev.map((t) => t.id === id ? { ...t, name: draft.name, body: draft.body } : t));
    resetDraft();
  };

  const toggleActive = (id: string) => setTemplates((prev) => prev.map((t) => t.id === id ? { ...t, isActive: !t.isActive } : t));
  const deleteTemplate = (id: string) => setTemplates((prev) => prev.filter((t) => t.id !== id));

  const startEdit = (t: MessageTemplate) => { setEditing(t.id); setDraft({ name: t.name, body: t.body }); setShowNew(false); };

  const SMS_CHAR_LIMIT = 160;

  const renderEditor = (onSave: () => void) => (
    <div className="rounded-lg border border-primary/30 bg-card p-4 space-y-3">
      <Input placeholder="Template name" value={draft.name} onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))} className="text-sm" />
      <div className="relative">
        <Textarea placeholder="SMS body" value={draft.body} onChange={(e) => setDraft((d) => ({ ...d, body: e.target.value }))} className="min-h-[80px] text-sm" />
        <span className={`absolute bottom-2 right-2 text-xs ${draft.body.length > SMS_CHAR_LIMIT ? "text-destructive" : "text-muted-foreground"}`}>
          {draft.body.length}/{SMS_CHAR_LIMIT}
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-1">
        <span className="text-xs text-muted-foreground">Variables:</span>
        {TEMPLATE_VARIABLES.map((v) => (
          <button key={v} type="button" onClick={() => setDraft((d) => ({ ...d, body: d.body + v }))} className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground hover:bg-primary/10 transition-colors">{v}</button>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <Button size="sm" onClick={onSave}>Save</Button>
        <Button size="sm" variant="outline" onClick={resetDraft}>Cancel</Button>
      </div>
    </div>
  );

  return (
    <PageToolbar
      tabs={SMS_TABS}
      activeTab={activeTab}
      onTabChange={(id) => {
        if (handleCommonTab(id, navigate)) return;
        setActiveTab(id as Category);
        resetDraft();
      }}
      pageHeading={<h2 className="text-base font-bold text-card-foreground">SMS Templates</h2>}
    >
      <div className="space-y-4">
        <div className="flex justify-end">
          <Button size="sm" onClick={() => { resetDraft(); setShowNew(true); }}><Plus className="w-4 h-4 mr-1" /> New Template</Button>
        </div>

        {showNew && renderEditor(saveNew)}

        {filtered.length === 0 && !showNew && (
          <p className="text-sm text-muted-foreground text-center py-8">No SMS templates for this category yet.</p>
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
                    <span className="text-xs text-muted-foreground">{t.body.length} chars</span>
                  </div>
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
