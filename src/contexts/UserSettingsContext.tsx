import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import type { Theme } from "@/contexts/ThemeContext";
import type { ToolbarPosition } from "@/contexts/ToolbarPositionContext";

export interface BusinessProfile {
  businessName: string;
  abnNzbn: string;
  phone: string;
  email: string;
  address: string;
  website: string;
}

export interface UserSettings {
  tutorialsEnabled: boolean;
  showTimesheetMode: boolean;
  showToolsMode: boolean;
  showEmployeeMode: boolean;
  theme: Theme;
  isDark: boolean;
  toolbarPosition: ToolbarPosition;
  businessProfile: BusinessProfile | null;
}

const DEFAULT_SETTINGS: UserSettings = {
  tutorialsEnabled: true,
  showTimesheetMode: true,
  showToolsMode: true,
  showEmployeeMode: true,
  theme: "earthy",
  isDark: true,
  toolbarPosition: "left",
  businessProfile: null,
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
        .select("tutorials_enabled, show_timesheet_mode, show_tools_mode, show_employee_mode, theme, is_dark, toolbar_position, business_profile")
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
            showEmployeeMode: data.show_employee_mode == null ? true : Boolean(data.show_employee_mode),
            theme: (data.theme as Theme) || "earthy",
            isDark: data.is_dark == null ? true : Boolean(data.is_dark),
            toolbarPosition: (data.toolbar_position as ToolbarPosition) || "left",
            businessProfile: data.business_profile ?? null,
          });
        }
        setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [user]);

  const saveSettings = async (updates: Partial<UserSettings>) => {
    const previous = settings;
    const next = { ...settings, ...updates };
    setSettings(next);
    if (!user) return;

    const { error } = await supabase.from("user_settings").upsert({
      user_id: user.id,
      tutorials_enabled: next.tutorialsEnabled,
      show_timesheet_mode: next.showTimesheetMode,
      show_tools_mode: next.showToolsMode,
      show_employee_mode: next.showEmployeeMode,
      theme: next.theme,
      is_dark: next.isDark,
      toolbar_position: next.toolbarPosition,
      business_profile: next.businessProfile,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      setSettings(previous);
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
