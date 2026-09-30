import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Wayfarer",
  description: "Travel Planning & Booking Platform",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        {/* Skip to main content link for keyboard navigation */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:p-4 focus:bg-[var(--color-ocean-700)] focus:text-white focus:font-bold"
        >
          Skip to main content
        </a>
        
        <Header user={user} />
        
        <main id="main-content" role="main">
          {children}
        </main>
      </body>
    </html>
  );
}
