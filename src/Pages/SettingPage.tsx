import React, { useEffect, useState } from "react";
import { apiGet, apiPut, apiPost } from "../services/api";
import { User, Shield } from "lucide-react";

interface UserSettings {
  name: string;
  email: string;
}

const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [changingPassword, setChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await apiGet("/settings");
        setSettings({
          name: data.name || "",
          email: data.email || "",
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    setMessage(null);
    try {
      const updated = await apiPut("/settings", {
        name: settings.name,
      });
      setSettings((prev) =>
        prev
          ? {
              ...prev,
              name: updated.name,
            }
          : prev
      );
      setMessage("Settings saved successfully.");
    } catch (err) {
      console.error(err);
      setMessage("Failed to save settings. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage(null);

    if (newPassword !== confirmPassword) {
      setPasswordMessage("New passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordMessage("Password must be at least 6 characters long.");
      return;
    }

    setChangingPassword(true);
    try {
      await apiPost("/auth/change-password", {
        currentPassword,
        newPassword,
      });
      setPasswordMessage("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      console.error(err);
      setPasswordMessage(
        err?.message || "Failed to change password. Please check your current password."
      );
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading || !settings) {
    return <p className="text-sm text-gray-500">Loading settings…</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-1">Settings</h1>
        <p className="text-sm text-gray-500">
          Manage your profile and account security.
        </p>
      </div>

      {message && (
        <div className="text-xs px-3 py-2 rounded-lg bg-blue-50 text-blue-700">
          {message}
        </div>
      )}

      {/* Profile & security */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* User profile */}
        <form
          onSubmit={handleSaveProfile}
          className="bg-white rounded-2xl shadow-sm p-6 space-y-4"
        >
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-full bg-blue-50">
              <User className="w-4 h-4 text-blue-600" />
            </div>
            <h2 className="font-semibold text-sm">Profile</h2>
          </div>
          <p className="text-xs text-gray-500 mb-2">
            Basic information about your account.
          </p>

          <div className="space-y-2">
            <label className="block text-xs font-medium text-gray-700">
              Display name
            </label>
            <input
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
              value={settings.name}
              onChange={(e) =>
                setSettings((prev) =>
                  prev ? { ...prev, name: e.target.value } : prev
                )
              }
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-medium text-gray-700">
              Email
            </label>
            <input
              disabled
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-500"
              value={settings.email}
            />
            <p className="text-[11px] text-gray-400">
              Email is currently read-only. Use your auth provider to update it.
            </p>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="mt-2 inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save profile"}
          </button>
        </form>

        {/* Change password */}
        <form
          onSubmit={handleChangePassword}
          className="bg-white rounded-2xl shadow-sm p-6 space-y-4"
        >
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-full bg-red-50">
              <Shield className="w-4 h-4 text-red-600" />
            </div>
            <h2 className="font-semibold text-sm">Change Password</h2>
          </div>
          <p className="text-xs text-gray-500 mb-2">
            Update your account password.
          </p>

          {passwordMessage && (
            <div
              className={`text-xs px-3 py-2 rounded-lg ${
                passwordMessage.includes("successfully")
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {passwordMessage}
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-xs font-medium text-gray-700">
              Current Password
            </label>
            <input
              type="password"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-medium text-gray-700">
              New Password
            </label>
            <input
              type="password"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-medium text-gray-700">
              Confirm New Password
            </label>
            <input
              type="password"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={changingPassword}
            className="mt-2 inline-flex items-center px-4 py-2 rounded-lg bg-red-600 text-white text-xs font-medium hover:bg-red-700 disabled:opacity-60"
          >
            {changingPassword ? "Changing…" : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SettingsPage;
