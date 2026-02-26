import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { PageToolbar } from "@/components/PageToolbar";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SETTINGS_EXTRAS } from "@/config/toolbarTabs";
import { dummyTemplates } from "@/data/dummyTemplates";

type SettingsTab = "business" | "notifications" | "appearance" | "billing" | "team" | "integrations";



function SettingsContent({ tab }: { tab: SettingsTab }) {
  const sections: Record<SettingsTab, React.ReactNode> = {
    business: (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-card-foreground">Business Profile</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            ["Business Name", "Thompson Plumbing & Electrical"],
            ["ABN / NZBN", "12-345-678-901"],
            ["Phone", "0800 TOOLBELT"],
            ["Email", "admin@toolbelt.co.nz"],
            ["Address", "42 Trade Ave, Auckland 1010"],
            ["Website", "www.toolbelt.co.nz"],
          ].map(([label, value]) => (
            <div key={label} className="p-3 rounded-lg bg-card border border-border">
              <div className="text-xs text-muted-foreground">{label}</div>
              <div className="text-sm font-medium text-card-foreground mt-0.5">{value}</div>
            </div>
          ))}
        </div>
      </div>
    ),
    notifications: (
      <div className="space-y-5">
        <h2 className="text-lg font-semibold text-card-foreground">Notifications</h2>
        {["New lead received", "Quote accepted", "Job completed", "Invoice overdue", "Team member assigned"].map((item) => (
          <div key={item} className="flex items-center justify-between p-3 rounded-lg bg-card border border-border">
            <span className="text-sm text-card-foreground">{item}</span>
            <div className="w-10 h-5 rounded-full bg-primary/80 relative">
              <div className="w-4 h-4 rounded-full bg-primary-foreground absolute right-0.5 top-0.5" />
            </div>
          </div>
        ))}

        <h3 className="text-sm font-semibold text-card-foreground pt-2">Default Invoice Templates</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Email Template</label>
            <Select defaultValue="e-i-1">
              <SelectTrigger className="text-sm"><SelectValue /></SelectTrigger>
              <SelectContent>
                {dummyTemplates.filter((t) => t.channel === "email" && t.category === "invoices").map((t) => (
                  <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">SMS Template</label>
            <Select defaultValue="s-i-1">
              <SelectTrigger className="text-sm"><SelectValue /></SelectTrigger>
              <SelectContent>
                {dummyTemplates.filter((t) => t.channel === "sms" && t.category === "invoices").map((t) => (
                  <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <h3 className="text-sm font-semibold text-card-foreground pt-2">Overdue Reminder Schedule</h3>
        {[
          { label: "7-day reminder", id: "e-r-1" },
          { label: "14-day reminder", id: "e-r-2" },
          { label: "30-day reminder", id: "e-r-3" },
        ].map((r) => {
          const tpl = dummyTemplates.find((t) => t.id === r.id);
          return (
            <div key={r.id} className="flex items-center justify-between p-3 rounded-lg bg-card border border-border">
              <div>
                <span className="text-sm text-card-foreground">{r.label}</span>
                {tpl && <span className="text-xs text-muted-foreground ml-2">({tpl.name})</span>}
              </div>
              <Switch defaultChecked={tpl?.isActive} />
            </div>
          );
        })}

        <h3 className="text-sm font-semibold text-card-foreground pt-2">Review Requests</h3>
        <div className="flex items-center justify-between p-3 rounded-lg bg-card border border-border">
          <div className="space-y-1">
            <span className="text-sm text-card-foreground">Auto-send review request</span>
            <p className="text-xs text-muted-foreground">Sends 3 days after job completion</p>
          </div>
          <Switch defaultChecked />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">Review Email Template</label>
          <Select defaultValue="e-rv-1">
            <SelectTrigger className="text-sm"><SelectValue /></SelectTrigger>
            <SelectContent>
              {dummyTemplates.filter((t) => t.channel === "email" && t.category === "reviews").map((t) => (
                <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    ),
    appearance: (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-card-foreground">Appearance</h2>
        <p className="text-sm text-muted-foreground">Theme and display preferences.</p>
        <div className="p-3 rounded-lg bg-card border border-border">
          <div className="text-sm text-card-foreground">Dark Mode</div>
          <div className="text-xs text-muted-foreground mt-0.5">Toggle via the sun/moon icon in the header</div>
        </div>
      </div>
    ),
    billing: (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-card-foreground">Billing</h2>
        <div className="p-3 rounded-lg bg-card border border-border">
          <div className="text-xs text-muted-foreground">Current Plan</div>
          <div className="text-sm font-medium text-card-foreground mt-0.5">Pro — $49/mo</div>
        </div>
        <div className="p-3 rounded-lg bg-card border border-border">
          <div className="text-xs text-muted-foreground">Next Billing Date</div>
          <div className="text-sm font-medium text-card-foreground mt-0.5">1 March 2026</div>
        </div>
      </div>
    ),
    team: (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-card-foreground">Team Members</h2>
        {["Admin — You", "Tech — Josh Turner", "Tech — Maria Santos", "Apprentice — Jake Hill"].map((m) => (
          <div key={m} className="p-3 rounded-lg bg-card border border-border text-sm text-card-foreground">{m}</div>
        ))}
      </div>
    ),
    integrations: (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-card-foreground">Integrations</h2>
        {["Xero Accounting", "Stripe Payments", "Google Calendar", "SMS Gateway"].map((i) => (
          <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-card border border-border">
            <span className="text-sm text-card-foreground">{i}</span>
            <Button size="sm" variant="outline">Connect</Button>
          </div>
        ))}
      </div>
    ),
  };
  return <>{sections[tab]}</>;
}

export default function SettingsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<SettingsTab>("business");

  return (
    <>
      <PageToolbar
        tabs={SETTINGS_EXTRAS}
        activeTab={activeTab}
        onTabChange={(id) => {
          if (id === "back") { navigate("/"); return; }
          setActiveTab(id as SettingsTab);
        }}
        pageHeading={<h2 className="text-base font-bold text-card-foreground">Settings</h2>}
      >
        <SettingsContent tab={activeTab} />
      </PageToolbar>
    </>
  );
}
