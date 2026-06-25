import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";

import {
  Accessibility,
  AlertTriangle,
  Bell,
  Calendar,
  Database,
  Download,
  FileDown,
  HardDriveDownload,
  History,
  KeyRound,
  Languages,
  LayoutGrid,
  LogOut,
  Mail,
  Monitor,
  Moon,
  Palette,
  Phone,
  Settings2,
  ShieldCheck,
  Smartphone,
  Stethoscope,
  Sun,
  Trash2,
  Upload,
  User,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

const API_BASE = "http://localhost:5000/api";

type ThemeMode = "light" | "dark" | "system";

interface NotificationState {
  appointmentReminders: boolean;
  assessmentUpdates: boolean;
  insightReports: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
}

interface AccessibilityState {
  highContrast: boolean;
  reducedMotion: boolean;
  largeText: boolean;
}

interface UserSettings {
  notifications: NotificationState;
  theme: ThemeMode;
  twoFA: boolean;
  preferences: {
    language: string;
    specialist: string;
    viewMode: string;
    accessibility: AccessibilityState;
  };
}

interface StoredUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  dob?: string;
  settings?: Partial<UserSettings>;
}

interface ProfileForm {
  fullName: string;
  email: string;
  phone: string;
  dob: string;
}

interface ProfileErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  dob?: string;
}

const DEFAULT_SETTINGS: UserSettings = {
  notifications: {
    appointmentReminders: true,
    assessmentUpdates: true,
    insightReports: false,
    emailNotifications: true,
    pushNotifications: false,
  },
  theme: "system",
  twoFA: false,
  preferences: {
    language: "en",
    specialist: "general",
    viewMode: "comfortable",
    accessibility: {
      highContrast: false,
      reducedMotion: false,
      largeText: false,
    },
  },
};

function mergeSettings(settings?: Partial<UserSettings>): UserSettings {
  return {
    ...DEFAULT_SETTINGS,
    ...settings,
    notifications: {
      ...DEFAULT_SETTINGS.notifications,
      ...settings?.notifications,
    },
    preferences: {
      ...DEFAULT_SETTINGS.preferences,
      ...settings?.preferences,
      accessibility: {
        ...DEFAULT_SETTINGS.preferences.accessibility,
        ...settings?.preferences?.accessibility,
      },
    },
  };
}

function getToken() {
  return localStorage.getItem("token");
}

function getStoredUser(): StoredUser | null {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
}

function saveStoredUser(user: StoredUser) {
  localStorage.setItem("user", JSON.stringify(user));
}

async function apiRequest(path: string, options: RequestInit = {}) {
  const token = getToken();
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 404) {
      throw new Error("Email endpoint not found. Restart the backend server.");
    }

    throw new Error(data.message || data.error || "Request failed");
  }

  return data;
}

async function persistSettings(patch: Partial<UserSettings>) {
  const current = getStoredUser();
  if (current) {
    saveStoredUser({ ...current, settings: mergeSettings({ ...current.settings, ...patch }) });
  }

  const data = await apiRequest("/auth/me", {
    method: "PATCH",
    body: JSON.stringify({ settings: patch }),
  });

  if (data.user) {
    saveStoredUser(data.user);
  }
}

function downloadFile(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function csvEscape(value: unknown) {
  const text = String(value ?? "");
  return `"${text.replace(/"/g, '""')}"`;
}

function SectionCard({
  icon: Icon,
  title,
  description,
  children,
  destructive,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  children: React.ReactNode;
  destructive?: boolean;
}) {
  return (
    <Card className={`rounded-2xl shadow-sm ${destructive ? "border-rose-200/70" : "border-slate-200/80"}`}>
      <CardHeader>
        <div className="flex items-center gap-3">
          <span
            className={`flex h-9 w-9 items-center justify-center rounded-xl ${
              destructive ? "bg-rose-50 text-rose-600" : "bg-blue-50 text-blue-600"
            }`}
          >
            <Icon className="h-4 w-4" />
          </span>
          <div>
            <CardTitle className="text-base font-semibold text-slate-900">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function StatusText({ message, error }: { message: string | null; error?: boolean }) {
  if (!message) return null;
  return (
    <p
      className={`mt-4 rounded-md px-3 py-2 text-sm ${
        error ? "bg-rose-50 text-rose-700" : "bg-emerald-50 text-emerald-700"
      }`}
    >
      {message}
    </p>
  );
}

function scheduleStatusClear(setStatus: React.Dispatch<React.SetStateAction<string | null>>) {
  window.setTimeout(() => setStatus(null), 1800);
}

function ToggleRow({
  label,
  description,
  checked,
  onCheckedChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-100 p-4 hover:border-blue-200 hover:bg-blue-50/40">
      <div className="min-w-0">
        <p className="text-sm font-medium text-slate-800">{label}</p>
        <p className="text-xs text-slate-500">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} aria-label={label} />
    </div>
  );
}

function ProfileSection() {
  const [form, setForm] = useState<ProfileForm>({ fullName: "", email: "", phone: "", dob: "" });
  const [original, setOriginal] = useState<ProfileForm>(form);
  const [errors, setErrors] = useState<ProfileErrors>({});
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [statusError, setStatusError] = useState(false);

  useEffect(() => {
    const stored = getStoredUser();
    if (stored) {
      const next = {
        fullName: stored.name || "",
        email: stored.email || "",
        phone: stored.phone || "",
        dob: stored.dob || "",
      };
      setForm(next);
      setOriginal(next);
    }

    apiRequest("/auth/me")
      .then((data) => {
        const user = data.user as StoredUser;
        saveStoredUser(user);
        const next = {
          fullName: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
          dob: user.dob || "",
        };
        setForm(next);
        setOriginal(next);
      })
      .catch(() => undefined);
  }, []);

  const update = (key: keyof ProfileForm) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((current) => ({ ...current, [key]: e.target.value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
    setStatus(null);
  };

  const validate = () => {
    const next: ProfileErrors = {};
    if (!form.fullName.trim()) next.fullName = "Full name is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = "Enter a valid email address.";
    if (!form.phone.trim()) next.phone = "Phone number is required.";
    if (!form.dob) next.dob = "Date of birth is required.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSave = async () => {
    if (!validate()) return;

    setSaving(true);
    setStatus(null);
    try {
      const data = await apiRequest("/auth/me", {
        method: "PATCH",
        body: JSON.stringify({
          name: form.fullName,
          email: form.email,
          phone: form.phone,
          dob: form.dob,
        }),
      });
      saveStoredUser(data.user);
      setOriginal(form);
      setStatusError(false);
      setStatus("Profile saved.");
    } catch (error) {
      setStatusError(true);
      setStatus(error instanceof Error ? error.message : "Could not save profile.");
    } finally {
      setSaving(false);
    }
  };

  const onCancel = () => {
    setForm(original);
    setErrors({});
    setStatus(null);
  };

  const field = (
    key: keyof ProfileForm,
    label: string,
    icon: React.ComponentType<{ className?: string }>,
    type = "text",
  ) => {
    const Icon = icon;
    return (
      <div className="space-y-1.5">
        <Label htmlFor={key} className="text-slate-700">
          {label}
        </Label>
        <div className="relative">
          <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            id={key}
            type={type}
            value={form[key]}
            onChange={update(key)}
            aria-invalid={!!errors[key]}
            className={`pl-9 ${errors[key] ? "border-rose-400 focus-visible:ring-rose-300" : ""}`}
          />
        </div>
        {errors[key] && <p className="text-xs text-rose-600">{errors[key]}</p>}
      </div>
    );
  };

  return (
    <SectionCard icon={User} title="Profile Information" description="Update your personal details.">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {field("fullName", "Full Name", User)}
        {field("email", "Email", Mail, "email")}
        {field("phone", "Phone Number", Phone, "tel")}
        {field("dob", "Date of Birth", Calendar, "date")}
      </div>
      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button variant="outline" onClick={onCancel} disabled={saving}>
          Cancel
        </Button>
        <Button onClick={onSave} disabled={saving} className="bg-blue-600 hover:bg-blue-700">
          {saving ? "Saving..." : "Save changes"}
        </Button>
      </div>
      <StatusText message={status} error={statusError} />
    </SectionCard>
  );
}

function NotificationsSection() {
  const stored = mergeSettings(getStoredUser()?.settings);
  const [notifications, setNotifications] = useState<NotificationState>(stored.notifications);
  const [status, setStatus] = useState<string | null>(null);
  const [statusError, setStatusError] = useState(false);

  const set = (key: keyof NotificationState) => async (value: boolean) => {
    const next = { ...notifications, [key]: value };
    setNotifications(next);
    try {
      await persistSettings({ notifications: next });
      setStatusError(false);
      setStatus("Notification settings saved.");
      scheduleStatusClear(setStatus);
    } catch {
      setStatus(null);
    }
  };

  return (
    <SectionCard icon={Bell} title="Notifications" description="Choose what you want to hear about.">
      <div className="space-y-3">
        <ToggleRow label="Appointment Reminders" description="Get notified before upcoming appointments." checked={notifications.appointmentReminders} onCheckedChange={set("appointmentReminders")} />
        <ToggleRow label="Assessment Updates" description="Alerts when an assessment is processed." checked={notifications.assessmentUpdates} onCheckedChange={set("assessmentUpdates")} />
        <ToggleRow label="Health Insight Reports" description="Periodic summaries of your health trends." checked={notifications.insightReports} onCheckedChange={set("insightReports")} />
        <ToggleRow label="Email Notifications" description="Automatically email reminders for appointments scheduled tomorrow." checked={notifications.emailNotifications} onCheckedChange={set("emailNotifications")} />
        <ToggleRow label="Push Notifications" description="Real-time alerts on your devices." checked={notifications.pushNotifications} onCheckedChange={set("pushNotifications")} />
      </div>
      <StatusText message={status} error={statusError} />
    </SectionCard>
  );
}

function AppearanceSection() {
  const [theme, setTheme] = useState<ThemeMode>(mergeSettings(getStoredUser()?.settings).theme);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const useDark = theme === "dark" || (theme === "system" && prefersDark);
    document.documentElement.classList.toggle("dark", useDark);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const updateTheme = async (value: ThemeMode) => {
    setTheme(value);
    try {
      await persistSettings({ theme: value });
      setStatus("Appearance saved.");
      scheduleStatusClear(setStatus);
    } catch {
      setStatus(null);
    }
  };

  const preview = {
    light: { icon: Sun, label: "Light", bg: "bg-white", panel: "bg-slate-100", text: "text-slate-900" },
    dark: { icon: Moon, label: "Dark", bg: "bg-slate-900", panel: "bg-slate-700", text: "text-white" },
    system: { icon: Monitor, label: "System", bg: "bg-gradient-to-br from-white to-slate-800", panel: "bg-slate-400/40", text: "text-slate-700" },
  }[theme];
  const PreviewIcon = preview.icon;

  return (
    <SectionCard icon={Palette} title="Appearance" description="Customize how MedAssist looks.">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:items-center">
        <div className="space-y-1.5">
          <Label className="
  text-slate-700
  dark:text-slate-200
">Theme</Label>
          <Select value={theme} onValueChange={(value) => updateTheme(value as ThemeMode)}>
            <SelectTrigger>
              <SelectValue placeholder="Select theme" />
            </SelectTrigger>
            <SelectContent
  className="z-[9999] bg-white border border-slate-200 shadow-xl rounded-lg"
>
              <SelectItem value="light">Light Mode</SelectItem>
              <SelectItem value="dark">Dark Mode</SelectItem>
              <SelectItem value="system">System Default</SelectItem>
            </SelectContent>
          </Select>
          <p className="min-h-8 text-xs leading-4 text-slate-500">
            System follows your device setting automatically.
          </p>
        </div>
        <div className={`rounded-2xl border border-slate-200 p-4 transition-colors ${preview.bg}`}>
          <div className="mb-3 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
              <PreviewIcon className="h-4 w-4" />
            </span>
            <span className={`text-sm font-medium ${preview.text}`}>{preview.label} preview</span>
          </div>
          <div className="space-y-2">
            <div className={`h-2.5 w-3/4 rounded-full ${preview.panel}`} />
            <div className={`h-2.5 w-1/2 rounded-full ${preview.panel}`} />
            <div className={`h-2.5 w-2/3 rounded-full ${preview.panel}`} />
          </div>
        </div>
      </div>
      <StatusText message={status} error={status?.includes("failed")} />
    </SectionCard>
  );
}

function SecurityRow({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-100 p-4 hover:border-blue-200 hover:bg-blue-50/40">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
          <Icon className="h-4 w-4" />
        </span>
        <div>
          <p className="text-sm font-medium text-slate-800">{title}</p>
          <p className="text-xs text-slate-500">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

function SecuritySection() {
  const storedSettings = mergeSettings(getStoredUser()?.settings);
  const [twoFA, setTwoFA] = useState(storedSettings.twoFA);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [passwords, setPasswords] = useState({ current: "", next: "", confirm: "" });
  const [passwordStatus, setPasswordStatus] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [sessions, setSessions] = useState([
    { id: "current", device: "Current browser", meta: "This device", current: true },
    { id: "sample-mobile", device: "Mobile session", meta: "Last active recently", current: false },
  ]);

  const toggleTwoFA = async (value: boolean) => {
    setTwoFA(value);
    try {
      await persistSettings({ twoFA: value });
    } catch {
      const user = getStoredUser();
      if (user) saveStoredUser({ ...user, settings: mergeSettings({ ...user.settings, twoFA: value }) });
    }
  };

  const updatePassword = async () => {
    setPasswordStatus(null);
    setPasswordError(false);

    if (passwords.next.length < 8) {
      setPasswordError(true);
      setPasswordStatus("New password must be at least 8 characters.");
      return;
    }
    if (passwords.next !== passwords.confirm) {
      setPasswordError(true);
      setPasswordStatus("New passwords do not match.");
      return;
    }

    setSavingPassword(true);
    try {
      await apiRequest("/auth/me/password", {
        method: "PATCH",
        body: JSON.stringify({ currentPassword: passwords.current, newPassword: passwords.next }),
      });
      setPasswords({ current: "", next: "", confirm: "" });
      setPasswordStatus("Password updated.");
      setPasswordOpen(false);
    } catch (error) {
      setPasswordError(true);
      setPasswordStatus(error instanceof Error ? error.message : "Could not update password.");
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <SectionCard icon={ShieldCheck} title="Privacy & Security" description="Keep your account protected.">
      <div className="space-y-3">
        <SecurityRow icon={KeyRound} title="Change Password" description="Update the password used for sign-in.">
          <Dialog open={passwordOpen} onOpenChange={setPasswordOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">Change</Button>
            </DialogTrigger>
            <DialogContent
  className="
    sm:max-w-md
    bg-white
    text-slate-900
    border
    border-slate-200
    shadow-2xl
  "
>
              <DialogHeader>
                <DialogTitle>Change password</DialogTitle>
                <DialogDescription>Use at least 8 characters.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="space-y-1.5">
                  <Label htmlFor="current-pw">Current password</Label>
                  <Input id="current-pw" type="password" value={passwords.current} onChange={(e) => setPasswords((p) => ({ ...p, current: e.target.value }))} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="new-pw">New password</Label>
                  <Input id="new-pw" type="password" value={passwords.next} onChange={(e) => setPasswords((p) => ({ ...p, next: e.target.value }))} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="confirm-pw">Confirm new password</Label>
                  <Input id="confirm-pw" type="password" value={passwords.confirm} onChange={(e) => setPasswords((p) => ({ ...p, confirm: e.target.value }))} />
                </div>
                <StatusText message={passwordStatus} error={passwordError} />
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button onClick={updatePassword} disabled={savingPassword} className="bg-blue-600 hover:bg-blue-700">
                  {savingPassword ? "Updating..." : "Update password"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </SecurityRow>

        <SecurityRow icon={ShieldCheck} title="Two-Factor Authentication" description="Store your preference for extra sign-in protection.">
          <Switch checked={twoFA} onCheckedChange={toggleTwoFA} aria-label="Two-factor authentication" />
        </SecurityRow>

        <SecurityRow icon={Smartphone} title="Session Management" description="Review and revoke listed sessions.">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">Manage</Button>
            </DialogTrigger>
            <DialogContent
  className="
    sm:max-w-md
    bg-white
    text-slate-900
    border
    border-slate-200
    shadow-2xl
  "
>
              <DialogHeader>
                <DialogTitle>Active sessions</DialogTitle>
                <DialogDescription>You're signed in on these sessions.</DialogDescription>
              </DialogHeader>
              <div className="space-y-3 py-2">
                {sessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between rounded-lg border border-slate-100 p-3">
                    <div>
                      <p className="text-sm font-medium text-slate-800">{session.device}</p>
                      <p className="text-xs text-slate-500">{session.meta}</p>
                    </div>
                    {!session.current && (
                      <Button variant="ghost" size="sm" onClick={() => setSessions((items) => items.filter((item) => item.id !== session.id))} className="text-rose-600 hover:bg-rose-50 hover:text-rose-700">
                        Revoke
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Close</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </SecurityRow>

        <SecurityRow icon={History} title="Device History" description="See where your account has been used.">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">View</Button>
            </DialogTrigger>
            <DialogContent
  className="
    sm:max-w-md
    bg-white
    text-slate-900
    border
    border-slate-200
    shadow-2xl
  "
>
              <DialogHeader>
                <DialogTitle>Device history</DialogTitle>
                <DialogDescription>Recent sign-ins on your account.</DialogDescription>
              </DialogHeader>
              <div className="space-y-3 py-2">
                <div className="flex items-center gap-3 rounded-lg border border-slate-100 p-3">
                  <Smartphone className="h-4 w-4 text-slate-400" />
                  <div>
                    <p className="text-sm font-medium text-slate-800">Current browser</p>
                    <p className="text-xs text-slate-500">Current session</p>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Close</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </SecurityRow>
      </div>
    </SectionCard>
  );
}

function DataSection() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState(false);

  const getAssessments = async () => {
    const local = JSON.parse(localStorage.getItem("assessments") || "[]");
    try {
      const res = await fetch(`${API_BASE}/analysis/history`);
      if (!res.ok) return local;
      const remote = await res.json();
      return Array.isArray(remote) && remote.length ? remote : local;
    } catch {
      return local;
    }
  };

  const exportCsv = async () => {
    const assessments = await getAssessments();
    const rows = [
      ["Created At", "Risk", "Condition", "Specialist"].map(csvEscape).join(","),
      ...assessments.map((item: any) =>
        [item.createdAt, item.risk, item.condition, item.specialist].map(csvEscape).join(","),
      ),
    ];
    downloadFile("medassist-assessment-history.csv", rows.join("\n"), "text/csv;charset=utf-8");
    setError(false);
    setStatus("Assessment history exported.");
  };

  const downloadReports = async () => {
    const assessments = await getAssessments();
    const report = assessments
      .map((item: any, index: number) => [
        `Report ${index + 1}`,
        `Date: ${item.createdAt || "Unknown"}`,
        `Risk: ${item.risk || "Unknown"}`,
        `Condition: ${item.condition || "Unknown"}`,
        `Specialist: ${item.specialist || "Unknown"}`,
      ].join("\n"))
      .join("\n\n");
    downloadFile("medassist-reports.txt", report || "No reports available.", "text/plain;charset=utf-8");
    setError(false);
    setStatus("Reports downloaded.");
  };

  const backupData = async () => {
    const backup = {
      exportedAt: new Date().toISOString(),
      user: getStoredUser(),
      assessments: await getAssessments(),
      localAssessments: JSON.parse(localStorage.getItem("assessments") || "[]"),
    };
    downloadFile("medassist-backup.json", JSON.stringify(backup, null, 2), "application/json;charset=utf-8");
    setError(false);
    setStatus("Backup created.");
  };

  const importData = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const data = JSON.parse(await file.text());
      if (data.user) saveStoredUser(data.user);
      if (Array.isArray(data.assessments)) {
        localStorage.setItem("assessments", JSON.stringify(data.assessments));
      }
      setError(false);
      setStatus("Backup imported. Refresh the page to reload imported profile data.");
    } catch {
      setError(true);
      setStatus("Import failed. Please choose a valid MedAssist backup file.");
    } finally {
      event.target.value = "";
    }
  };

  const actions = [
    { icon: Download, title: "Export Assessment History", desc: "Download your full history as CSV.", action: exportCsv },
    { icon: FileDown, title: "Download Reports", desc: "Get your reports as a text file.", action: downloadReports },
    { icon: HardDriveDownload, title: "Backup Data", desc: "Create a backup of your account data.", action: backupData },
    { icon: Upload, title: "Import Data", desc: "Bring in records from a backup file.", action: () => fileInputRef.current?.click() },
  ];

  return (
    <SectionCard icon={Database} title="Assessment Data" description="Export, back up, and import your records.">
      <input ref={fileInputRef} type="file" accept="application/json,.json" className="hidden" onChange={importData} />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button key={action.title} type="button" onClick={action.action} className="flex items-center gap-3 rounded-xl border border-slate-100 p-4 text-left transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50/40 hover:shadow-sm">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-medium text-slate-800">{action.title}</p>
                <p className="text-xs text-slate-500">{action.desc}</p>
              </div>
            </button>
          );
        })}
      </div>
      <StatusText message={status} error={error} />
    </SectionCard>
  );
}

function PreferencesSection() {
  const stored = mergeSettings(getStoredUser()?.settings).preferences;
  const [language, setLanguage] = useState(stored.language);
  const [specialist, setSpecialist] = useState(stored.specialist);
  const [viewMode, setViewMode] = useState(stored.viewMode);
  const [accessibility, setAccessibility] = useState<AccessibilityState>(stored.accessibility);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    document.documentElement.classList.toggle("settings-high-contrast", accessibility.highContrast);
    document.documentElement.classList.toggle("settings-reduced-motion", accessibility.reducedMotion);
    document.documentElement.classList.toggle("settings-large-text", accessibility.largeText);
  }, [accessibility]);

  const savePreferences = async (next: UserSettings["preferences"]) => {
    try {
      await persistSettings({ preferences: next });
      setStatus("Preferences saved.");
      scheduleStatusClear(setStatus);
    } catch {
      setStatus(null);
    }
  };

  const updateSelect = (key: "language" | "specialist" | "viewMode", value: string) => {
    const next = { language, specialist, viewMode, accessibility, [key]: value };
    if (key === "language") setLanguage(value);
    if (key === "specialist") setSpecialist(value);
    if (key === "viewMode") setViewMode(value);
    savePreferences(next);
  };

  const updateAccessibility = (key: keyof AccessibilityState) => (value: boolean) => {
    const nextAccessibility = { ...accessibility, [key]: value };
    setAccessibility(nextAccessibility);
    savePreferences({ language, specialist, viewMode, accessibility: nextAccessibility });
  };

  const selectField = (
    label: string,
    icon: React.ComponentType<{ className?: string }>,
    value: string,
    onChange: (value: string) => void,
    options: { value: string; label: string }[],
  ) => {
    const Icon = icon;
    return (
      <div className="space-y-1.5">
        <Label className="flex items-center gap-2 text-slate-700">
          <Icon className="h-4 w-4 text-slate-400" />
          {label}
        </Label>
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent
  className="z-[9999] bg-white border border-slate-200 shadow-xl rounded-lg"
>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  };

  return (
    <SectionCard icon={Settings2} title="Preferences" description="Tune the app to how you work.">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {selectField("Preferred Language", Languages, language, (value) => updateSelect("language", value), [
          { value: "en", label: "English" },
          { value: "hi", label: "Hindi" },
          { value: "es", label: "Spanish" },
          { value: "fr", label: "French" },
        ])}
        {selectField("Default Specialist Type", Stethoscope, specialist, (value) => updateSelect("specialist", value), [
          { value: "general", label: "General Physician" },
          { value: "cardiology", label: "Cardiologist" },
          { value: "neurology", label: "Neurologist" },
          { value: "dermatology", label: "Dermatologist" },
        ])}
        {selectField("Dashboard View Mode", LayoutGrid, viewMode, (value) => updateSelect("viewMode", value), [
          { value: "comfortable", label: "Comfortable" },
          { value: "compact", label: "Compact" },
          { value: "detailed", label: "Detailed" },
        ])}
      </div>

      <Separator className="my-6" />

      <div className="space-y-3">
        <p className="flex items-center gap-2 text-sm font-medium text-slate-800">
          <Accessibility className="h-4 w-4 text-slate-400" />
          Accessibility options
        </p>
        <ToggleRow label="High Contrast" description="Increase color contrast across the app." checked={accessibility.highContrast} onCheckedChange={updateAccessibility("highContrast")} />
        <ToggleRow label="Reduced Motion" description="Minimize animations and transitions." checked={accessibility.reducedMotion} onCheckedChange={updateAccessibility("reducedMotion")} />
        <ToggleRow label="Large Text" description="Increase the base font size for readability." checked={accessibility.largeText} onCheckedChange={updateAccessibility("largeText")} />
      </div>
      <StatusText message={status} error={status?.includes("failed")} />
    </SectionCard>
  );
}

function DeleteAccountDialog() {
  const navigate = useNavigate();
  const [confirmText, setConfirmText] = useState("");
  const [acknowledged, setAcknowledged] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const canDelete = confirmText.trim().toUpperCase() === "DELETE" && acknowledged;

  const deleteAccount = async () => {
    if (!canDelete) return;

    setDeleting(true);
    setStatus(null);
    try {
      await apiRequest("/auth/me", { method: "DELETE" });
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("assessments");
      navigate("/register", { replace: true });
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Could not delete account.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) {
          setConfirmText("");
          setAcknowledged(false);
          setStatus(null);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="destructive" className="bg-rose-600 hover:bg-rose-700">
          <Trash2 className="mr-2 h-4 w-4" />
          Delete account
        </Button>
      </DialogTrigger>
      <DialogContent
  className="
    sm:max-w-md
    bg-white
    text-slate-900
    border
    border-slate-200
    shadow-2xl
  "
>
        <DialogHeader>
          <div className="mb-1 flex h-11 w-11 items-center justify-center rounded-full bg-rose-100 text-rose-600">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <DialogTitle className="text-rose-700">Delete your account</DialogTitle>
          <DialogDescription>This permanently removes your profile, assessments, and reports. This action cannot be undone.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <label className="flex items-start gap-3 rounded-lg border border-rose-100 bg-rose-50/50 p-3">
            <Switch checked={acknowledged} onCheckedChange={setAcknowledged} aria-label="Acknowledge deletion" />
            <span className="text-sm text-slate-700">I understand that all my health data will be permanently deleted.</span>
          </label>
          <div className="space-y-1.5">
            <Label htmlFor="confirm-delete">Type <span className="font-semibold text-rose-600">DELETE</span> to confirm</Label>
            <Input id="confirm-delete" value={confirmText} onChange={(e) => setConfirmText(e.target.value)} placeholder="DELETE" className="focus-visible:ring-rose-300" />
          </div>
          <StatusText message={status} error />
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button disabled={!canDelete || deleting} onClick={deleteAccount} className="bg-rose-600 hover:bg-rose-700 disabled:opacity-50">
            {deleting ? "Deleting..." : "Permanently delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function AccountSection() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  return (
    <SectionCard icon={LogOut} title="Account Actions" description="Sign out or remove your account." destructive>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-800">Session</p>
          <p className="text-xs text-slate-500">Sign out of MedAssist on this device.</p>
        </div>
        <Button variant="outline" onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </Button>
      </div>

      <Separator className="my-5" />

      <div className="flex flex-col gap-4 rounded-xl border border-rose-100 bg-rose-50/40 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-rose-700">Delete account</p>
          <p className="text-xs text-slate-500">Permanently erase your data. This cannot be undone.</p>
        </div>
        <DeleteAccountDialog />
      </div>
    </SectionCard>
  );
}

export default function Settings() {
  return (
    <div className="
  min-h-screen
  bg-slate-50/60
  dark:bg-slate-900
">
      <PageHeader title="Settings" />
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <header className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">Settings</h1>
          <p className="mt-1.5 text-sm text-slate-500">Manage your account preferences, notifications, and privacy settings.</p>
        </header>

        <div className="space-y-6">
          <ProfileSection />
          <NotificationsSection />
          <AppearanceSection />
          <SecuritySection />
          <DataSection />
          <PreferencesSection />
          <AccountSection />
        </div>
      </div>
    </div>
  );
}
