import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

export interface UserSettings {
  tutorialsEnabled: boolean;
  showTimesheetMode: boolean;
  showToolsMode: boolean;
}

const DEFAULT_SETTINGS: UserSettings = {
  tutorialsEnabled: true,
  showTimesheetMode: true,
  showToolsMode: true,
};

interface UserSettingsContextType {
  settings: UserSettings;
  loading: boolean;
  saveSettings: (updates: Partial<UserSettings>) => Promise<void>;
}

const UserSettingsContext = createContext<UserSettingsContextType | undefined>(undefined);

export function UserSettingsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    if (!user) {
      setSettings(DEFAULT_SETTINGS);
      setLoading(false);
      return;
    }

    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("user_settings")
        .select("tutorials_enabled, show_timesheet_mode, show_tools_mode")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!cancelled) {
        if (error || !data) {
          setSettings(DEFAULT_SETTINGS);
        } else {
          setSettings({
            tutorialsEnabled: Boolean(data.tutorials_enabled),
            showTimesheetMode: Boolean(data.show_timesheet_mode),
            showToolsMode: Boolean(data.show_tools_mode),
          });
        }
        setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [user]);

  const saveSettings = async (updates: Partial<UserSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
    if (!user) return;

    const next = { ...settings, ...updates };
    const { error } = await supabase.from("user_settings").upsert({
      user_id: user.id,
      tutorials_enabled: next.tutorialsEnabled,
      show_timesheet_mode: next.showTimesheetMode,
      show_tools_mode: next.showToolsMode,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      console.error("Failed to save user settings", error);
      throw error;
    }
  };

  const value = useMemo(() => ({ settings, loading, saveSettings }), [settings, loading]);
  return <UserSettingsContext.Provider value={value}>{children}</UserSettingsContext.Provider>;
}

export function useUserSettings() {
  const ctx = useContext(UserSettingsContext);
  if (!ctx) throw new Error("useUserSettings must be used within UserSettingsProvider");
  return ctx;
}
