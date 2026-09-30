"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const client = createClient();
      const { error: authError } = await client.auth.signUp({
        email,
        password,
        options: {
          data: { name },
        },
      });

      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }

      router.refresh();
      router.push("/");
    } catch (err) {
      setError("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--page)" }}>
      <header style={{ backgroundColor: "var(--brand)" }} className="text-white">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <Link href="/" className="text-xl font-bold">
            Wayfarer
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded border" style={{ borderColor: "var(--line)" }}>
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-6" style={{ color: "var(--ink)" }}>
              Create account
            </h1>

            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-500 mb-2" style={{ color: "var(--ink)" }}>
                  Full name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                  className="w-full px-4 py-2 border rounded text-sm"
                  style={{ borderColor: "var(--line)", color: "var(--ink)" }}
                />
              </div>

              <div>
                <label className="block text-sm font-500 mb-2" style={{ color: "var(--ink)" }}>
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="w-full px-4 py-2 border rounded text-sm"
                  style={{ borderColor: "var(--line)", color: "var(--ink)" }}
                />
              </div>

              <div>
                <label className="block text-sm font-500 mb-2" style={{ color: "var(--ink)" }}>
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="w-full px-4 py-2 border rounded text-sm"
                  style={{ borderColor: "var(--line)", color: "var(--ink)" }}
                />
              </div>

              {error && <p style={{ color: "var(--alert)" }} className="text-sm">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 rounded text-white font-500 text-sm"
                style={{ backgroundColor: "var(--action)" }}
              >
                {loading ? "Creating..." : "Create account"}
              </button>
            </form>

            <p className="mt-4 text-sm text-center" style={{ color: "var(--muted)" }}>
              Already have an account?{" "}
              <Link href="/login" className="font-500" style={{ color: "var(--action)" }}>
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
