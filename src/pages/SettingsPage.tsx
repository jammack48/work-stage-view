import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { PageToolbar } from "@/components/PageToolbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SETTINGS_EXTRAS } from "@/config/toolbarTabs";
import { dummyTemplates } from "@/data/dummyTemplates";
import { NotificationStyleSettings } from "@/components/NotificationStyleSettings";
import { useJobPrefix } from "@/contexts/JobPrefixContext";
import { useDemoData } from "@/contexts/DemoDataContext";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useUserSettings } from "@/contexts/UserSettingsContext";
import type { BusinessProfile } from "@/contexts/UserSettingsContext";
import type { UserSettings } from "@/contexts/UserSettingsContext";

type SettingsTab = "business" | "notifications" | "appearance" | "billing" | "team" | "integrations" | "documents";

const EMPTY_BUSINESS_PROFILE: BusinessProfile = {
  businessName: "",
  abnNzbn: "",
  gst: "",
  phone: "",
  email: "",
  address: "",
  website: "",
};


function SettingsContent({ tab }: { tab: SettingsTab }) {
  const { prefix, nextNumber, setPrefix, setNextNumber, formatJobId } = useJobPrefix();
  const { resetDemo } = useDemoData();
  const { user, isDemo } = useAuth();
  const { settings, saveSettings } = useUserSettings();
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile>(EMPTY_BUSINESS_PROFILE);

  useEffect(() => {
    setBusinessProfile({ ...EMPTY_BUSINESS_PROFILE, ...settings.businessProfile });
  }, [settings.businessProfile]);

  const saveSettingWithFeedback = async (
    updates: Partial<UserSettings>,
    options?: { successTitle?: string }
  ) => {
    if (!user) {
      toast({ title: "Sign in required", description: "Sign in to save settings to Supabase.", variant: "destructive" });
      return;
    }
    try {
      await saveSettings(updates);
      if (options?.successTitle) {
        toast({ title: options.successTitle });
      }
    } catch (error) {
      console.error("Failed to persist user setting", error);
      toast({ title: "Couldn’t save setting", description: "Please try again.", variant: "destructive" });
    }
  };

  const handleUpload = async (file: File) => {
    const text = await file.text();
    console.log(text);
  };

  const sections: Record<SettingsTab, React.ReactNode> = {
    business: (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-card-foreground">Business Profile</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            ["Business Name", "businessName"],
            ["ABN / NZBN", "abnNzbn"],
            ["GST", "gst"],
            ["Phone", "phone"],
            ["Email", "email"],
            ["Address", "address"],
            ["Website", "website"],
          ].map(([label, key]) => (
            <div key={label} className="p-3 rounded-lg bg-card border border-border space-y-2">
              <div className="text-xs text-muted-foreground">{label}</div>
              <Input
                value={businessProfile[key as keyof BusinessProfile]}
                placeholder={`Add ${label.toLowerCase()}`}
                onChange={(e) => setBusinessProfile((prev) => ({ ...prev, [key]: e.target.value }))}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-end">
          <Button
            size="sm"
            onClick={async () => {
              await saveSettingWithFeedback({ businessProfile }, { successTitle: "Business profile saved" });
            }}
            disabled={!user}
          >
            Save Business Profile
          </Button>
        </div>
        {!user && (
          <div className="p-3 rounded-lg bg-card border border-border">
            <div className="text-xs text-muted-foreground">Sign in required</div>
            <div className="text-sm text-card-foreground mt-0.5">
              Sign in to save your business profile to Supabase.
            </div>
          </div>
        )}

        <h3 className="text-sm font-semibold text-card-foreground pt-4">Job Numbering</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-card border border-border space-y-2">
            <div className="text-xs text-muted-foreground">Prefix</div>
            <Input
              value={prefix}
              onChange={(e) => setPrefix(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 5))}
              className="text-sm font-mono w-24"
              maxLength={5}
            />
          </div>
          <div className="p-3 rounded-lg bg-card border border-border space-y-2">
            <div className="text-xs text-muted-foreground">Next Number</div>
            <Input
              type="number"
              value={nextNumber}
              onChange={(e) => setNextNumber(Math.max(1, parseInt(e.target.value) || 1))}
              className="text-sm font-mono w-24"
              min={1}
            />
          </div>
        </div>
        {isDemo && (
          <div className="p-3 rounded-lg bg-card border border-border space-y-2">
            <div className="text-xs text-muted-foreground">Demo Session Data</div>
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-card-foreground">Reset demo jobs/customers for this session</p>
              <Button size="sm" variant="outline" onClick={() => { resetDemo(); toast({ title: "Demo reset", description: "Demo data was reset for this session." }); }}>
                Reset Demo
              </Button>
            </div>
          </div>
        )}
        <div className="p-3 rounded-lg bg-card border border-border space-y-3">
          <div className="text-xs text-muted-foreground">Startup Preferences</div>
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-card-foreground">Enable tutorials</p>
            <Switch
              checked={settings.tutorialsEnabled}
              disabled={!user}
              onCheckedChange={(v) => void saveSettingWithFeedback({ tutorialsEnabled: v })}
            />
          </div>
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-card-foreground">Show On the Tools mode</p>
            <Switch
              checked={settings.showToolsMode}
              disabled={!user}
              onCheckedChange={(v) => void saveSettingWithFeedback({ showToolsMode: v })}
            />
          </div>
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-card-foreground">Show Employee mode</p>
            <Switch
              checked={settings.showEmployeeMode}
              disabled={!user}
              onCheckedChange={(v) => void saveSettingWithFeedback({ showEmployeeMode: v })}
            />
          </div>
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-card-foreground">Show Timesheet mode</p>
            <Switch
              checked={settings.showTimesheetMode}
              disabled={!user}
              onCheckedChange={(v) => void saveSettingWithFeedback({ showTimesheetMode: v })}
            />
          </div>
          {!user && <p className="text-xs text-muted-foreground">Sign in to save these preferences to Supabase.</p>}
        </div>

        <div className="p-3 rounded-lg bg-card border border-border space-y-3">
          <div className="text-xs text-muted-foreground">Import Customers</div>
          <Input type="file" accept=".csv" onChange={(e) => setCsvFile(e.target.files?.[0] ?? null)} />
          {csvFile && <p className="text-xs text-card-foreground">Selected: {csvFile.name}</p>}
          <Button
            size="sm"
            onClick={async () => {
              if (!csvFile) return;
              await handleUpload(csvFile);
              toast({ title: "Upload complete", description: "CSV uploaded successfully." });
            }}
            disabled={!csvFile}
          >
            Upload CSV
          </Button>
        </div>
        <div className="p-3 rounded-lg bg-muted border border-border">
          <div className="text-xs text-muted-foreground">Preview</div>
          <div className="text-sm font-mono font-bold text-card-foreground mt-1">{formatJobId(nextNumber)}</div>
        </div>
      </div>
    ),
    notifications: (
      <div className="space-y-5">
        <h2 className="text-lg font-semibold text-card-foreground">Notifications</h2>
        
        {/* Pipeline notification style */}
        <NotificationStyleSettings onClose={() => {}} />

        {["New lead received", "Quote accepted", "Job completed", "Invoice overdue", "Team member assigned"].map((item) => (
          <div key={item} className="flex items-center justify-between p-3 rounded-lg bg-card border border-border">
            <span className="text-sm text-card-foreground">{item}</span>
            <Switch defaultChecked />
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
    documents: (
      <div className="space-y-5">
        <h2 className="text-lg font-semibold text-card-foreground">Document Settings</h2>

        {/* Quote Defaults */}
        <h3 className="text-sm font-semibold text-card-foreground">Quote Defaults</h3>
        <div className="space-y-3">
          <div className="p-3 rounded-lg bg-card border border-border space-y-2">
            <div className="text-xs text-muted-foreground">Default Cover Letter Template</div>
            <Select defaultValue="professional">
              <SelectTrigger className="text-sm"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="friendly">Friendly</SelectItem>
                <SelectItem value="minimal">Minimal</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="p-3 rounded-lg bg-card border border-border space-y-2">
            <div className="text-xs text-muted-foreground">Default Display Preset</div>
            <Select defaultValue="detailed">
              <SelectTrigger className="text-sm"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="detailed">Detailed</SelectItem>
                <SelectItem value="summary">Summary</SelectItem>
                <SelectItem value="total-only">Total Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="p-3 rounded-lg bg-card border border-border space-y-2">
            <div className="text-xs text-muted-foreground">Default Markup %</div>
            <Input type="number" defaultValue={15} min={0} className="w-24 text-sm" />
          </div>
          <div className="p-3 rounded-lg bg-card border border-border space-y-2">
            <div className="text-xs text-muted-foreground">Terms & Conditions</div>
            <textarea className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm" defaultValue="Quote valid for 30 days. 50% deposit required to commence work." />
          </div>
          <div className="p-3 rounded-lg bg-card border border-border space-y-2">
            <div className="text-xs text-muted-foreground">Company Logo</div>
            <Button size="sm" variant="outline">Upload Logo</Button>
          </div>
        </div>

        {/* Invoice Defaults */}
        <h3 className="text-sm font-semibold text-card-foreground pt-2">Invoice Defaults</h3>
        <div className="space-y-3">
          <div className="p-3 rounded-lg bg-card border border-border space-y-2">
            <div className="text-xs text-muted-foreground">Default Payment Terms</div>
            <Select defaultValue="14">
              <SelectTrigger className="text-sm"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="7">7 days</SelectItem>
                <SelectItem value="14">14 days</SelectItem>
                <SelectItem value="20">20th of the month</SelectItem>
                <SelectItem value="30">30 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="p-3 rounded-lg bg-card border border-border space-y-2">
            <div className="text-xs text-muted-foreground">Bank Details</div>
            <textarea className="w-full min-h-[60px] rounded-md border border-input bg-background px-3 py-2 text-sm" defaultValue="ANZ 06-0123-0456789-00" />
          </div>
          <div className="p-3 rounded-lg bg-card border border-border space-y-2">
            <div className="text-xs text-muted-foreground">Invoice Notes</div>
            <textarea className="w-full min-h-[60px] rounded-md border border-input bg-background px-3 py-2 text-sm" defaultValue="Thank you for your business." />
          </div>
        </div>
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
