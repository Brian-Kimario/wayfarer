"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";
import Button from "./Button";

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
    <header
      className="sticky top-0 z-50 border-b"
      style={{
        backgroundColor: "var(--color-ivory)",
        borderColor: "var(--color-border)",
      }}
    >
      <div className="container-page py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <div className="flex flex-col">
            <span
              className="text-lg font-bold"
              style={{ color: "var(--color-ocean-950)" }}
            >
              WAYFARER
            </span>
            <span
              className="text-xs font-medium tracking-wide"
              style={{ color: "var(--color-muted)" }}
            >
              travel better
            </span>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/stays"
            className="text-sm font-medium"
            style={{ color: "var(--color-ink)" }}
          >
            Stays
          </Link>
          <Link
            href="/flights"
            className="text-sm font-medium"
            style={{ color: "var(--color-ink)" }}
          >
            Flights
          </Link>
          <Link
            href="/trips"
            className="text-sm font-medium"
            style={{ color: "var(--color-ink)" }}
          >
            Trips
          </Link>
          <Link
            href="/wishlist"
            className="text-sm font-medium"
            style={{ color: "var(--color-ink)" }}
          >
            Wishlist
          </Link>
        </nav>

        {/* Account */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <div className="hidden sm:flex flex-col text-right text-sm">
                <span
                  className="font-medium"
                  style={{ color: "var(--color-ink)" }}
                >
                  {user.user_metadata?.name || user.email?.split("@")[0]}
                </span>
                <span style={{ color: "var(--color-muted)" }}>
                  {user.email}
                </span>
              </div>
              <Link href="/bookings">
                <Button variant="secondary" size="sm">
                  My Bookings
                </Button>
              </Link>
              <button
                onClick={handleLogout}
                className="px-3 py-2 text-sm font-medium"
                style={{ color: "var(--color-ocean-700)" }}
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="tertiary" size="sm">
                  Sign in
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">
                  Register
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
