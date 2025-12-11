import React, { useState } from "react";
import { Lock, Mail, User } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

const SignUpPage: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const strongPasswordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

  const emailRegex =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!strongPasswordRegex.test(password)) {
      setError(
        "Password must be at least 8 characters and include at least one lowercase letter, one uppercase letter, one number, and one special character."
      );
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) {
        let message = "Sign up failed";
        try {
          const data = await res.json();
          message = data.message || message;
        } catch {
          const text = await res.text();
          message = text || message;
        }
        throw new Error(message);
      }

      const data = await res.json();
      localStorage.setItem("token", data.token);
      window.location.href = "/dashboard";
    } catch (err: any) {
      setError(err.message || "Sign up failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm p-8 space-y-6">
          <div className="space-y-1 text-center">
            <h1 className="text-2xl font-bold">Create your account</h1>
            <p className="text-sm text-gray-500">
              Set up your workspace to manage contracts and insights.
            </p>
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 p-2 rounded-md">
              {error}
            </p>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Full name
              </label>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-gray-50">
                <User className="w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Doe"
                  className="w-full bg-transparent outline-none text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-gray-50">
                <Mail className="w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-transparent outline-none text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-gray-50">
                <Lock className="w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-transparent outline-none text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
            >
              Create account
            </button>
          </form>

          <p className="text-center text-xs text-gray-500">
            Already have an account?{" "}
            <a href="/login" className="text-blue-600 font-medium">
              Sign in
            </a>
          </p>

          <div className="text-center text-xs text-gray-400 mt-4 space-x-3">
            <a href="/terms" className="hover:text-gray-600 underline">
              Terms
            </a>
            <span>•</span>
            <a href="/privacy" className="hover:text-gray-600 underline">
              Privacy
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
