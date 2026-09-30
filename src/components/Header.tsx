"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";

export interface HeaderProps {
  user: any;
}

export default function Header({ user }: HeaderProps) {
  const router = useRouter();

  const handleLogout = async () => {
    const client = createClient();
    await client.auth.signOut();
    router.refresh();
    router.push("/");
  };

  return (
    <header style={{ backgroundColor: "var(--brand)" }} className="text-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Wayfarer
        </Link>
        <nav className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-sm">{user.user_metadata?.name || user.email}</span>
              <button
                onClick={handleLogout}
                className="text-sm hover:underline"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm hover:underline">
                Sign in
              </Link>
              <Link
                href="/register"
                className="text-sm px-4 py-2 rounded border"
                style={{ borderColor: "white" }}
              >
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
