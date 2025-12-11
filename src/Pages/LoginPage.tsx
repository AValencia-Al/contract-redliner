import React, { useState } from "react";
import { Mail, Lock } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const emailRegex =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        let message = "Login failed";
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
      setError(err.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm p-8 space-y-6">
        <h1 className="text-2xl font-bold text-center">Sign in</h1>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 p-2 rounded-md">
            {error}
          </p>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
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

          <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-gray-50">
            <Lock className="w-4 h-4 text-gray-400" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-transparent outline-none text-sm"
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
          >
            Sign in
          </button>
        </form>

        <p className="text-center text-xs text-gray-500 mt-2">
          Don&apos;t have an account?{" "}
          <a href="/signup" className="text-blue-600 font-medium hover:underline">
            Create one
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
  );
};

export default LoginPage;
