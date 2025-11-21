import React, { useEffect, useState } from "react";
import { apiGet, apiPut } from "../services/api";
import { Sparkles, User, Shield } from "lucide-react";

interface UserSettings {
  name: string;
  email: string;
  aiModel: string;
}

const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [autoAnalyze, setAutoAnalyze] = useState<boolean>(true); // local-only example toggle
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await apiGet("/settings");
        setSettings({
          name: data.name || "",
          email: data.email || "",
          aiModel: data.aiModel || "gpt-4.1-mini",
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
        aiModel: settings.aiModel,
      });
      setSettings((prev) =>
        prev
          ? {
              ...prev,
              name: updated.name,
              aiModel: updated.aiModel,
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

  if (loading || !settings) {
    return <p className="text-sm text-gray-500">Loading settings…</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-1">Settings</h1>
        <p className="text-sm text-gray-500">
          Manage your user preferences, AI controls, and account details.
        </p>
      </div>

      {message && (
        <div className="text-xs px-3 py-2 rounded-lg bg-blue-50 text-blue-700">
          {message}
        </div>
      )}

      {/* Profile & account details */}
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

        {/* AI controls */}
        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-full bg-purple-50">
              <Sparkles className="w-4 h-4 text-purple-600" />
            </div>
            <h2 className="font-semibold text-sm">AI controls</h2>
          </div>
          <p className="text-xs text-gray-500 mb-2">
            Configure how the AI assists with your contracts.
          </p>

          <div className="space-y-2">
            <label className="block text-xs font-medium text-gray-700">
              Default AI model
            </label>
            <select
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
              value={settings.aiModel}
              onChange={(e) =>
                setSettings((prev) =>
                  prev ? { ...prev, aiModel: e.target.value } : prev
                )
              }
            >
              <option value="gpt-4.1-mini">gpt-4.1-mini (fast & efficient)</option>
              <option value="gpt-4.1">gpt-4.1 (higher quality)</option>
            </select>
            <p className="text-[11px] text-gray-400">
              You can change this anytime. Some models may use more credits.
            </p>
          </div>

          <div className="flex items-start gap-3">
            <button
              type="button"
              onClick={() => setAutoAnalyze((v) => !v)}
              className={`relative inline-flex h-5 w-9 flex-shrink-0 rounded-full border transition-colors ${
                autoAnalyze ? "bg-blue-600 border-blue-600" : "bg-gray-200 border-gray-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                  autoAnalyze ? "translate-x-4" : "translate-x-0.5"
                }`}
              />
            </button>
            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-800">
                Auto-analyze new contracts
              </p>
              <p className="text-[11px] text-gray-500">
                When enabled, newly uploaded contracts will be sent to the AI
                for analysis automatically. (UI only for now – hook to backend later.)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Account & danger zone */}
      <div className="bg-white rounded-2xl shadow-sm p-6 space-y-3">
        <div className="flex items-center gap-2 mb-1">
          <div className="p-2 rounded-full bg-red-50">
            <Shield className="w-4 h-4 text-red-600" />
          </div>
          <h2 className="font-semibold text-sm">Account & security</h2>
        </div>
        <p className="text-xs text-gray-500">
          Manage security-related actions for your account.
        </p>

        <div className="mt-2 flex flex-col gap-2 text-xs">
          <button
            type="button"
            className="inline-flex items-center self-start px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50"
          >
            Change password (coming soon)
          </button>
          <button
            type="button"
            className="inline-flex items-center self-start px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
          >
            Deactivate account (coming soon)
          </button>
        </div>

        <p className="text-[11px] text-gray-400 mt-2">
          These options are placeholders for future account management features.
        </p>
      </div>
    </div>
  );
};

export default SettingsPage;
