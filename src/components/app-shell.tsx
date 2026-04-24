"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  Home,
  BookOpen,
  Package,
  CalendarDays,
  Users,
  GraduationCap,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: BookOpen, label: "Classroom", href: "/classroom" },
  { icon: Package, label: "The Crate", href: "/crate" },
  { icon: CalendarDays, label: "Events", href: "/events" },
  { icon: Users, label: "Members", href: "/members" },
  { icon: GraduationCap, label: "Tutors", href: "/tutors" },
];

export function AppShell({
  children,
  user,
  profile,
}: {
  children: React.ReactNode;
  user: { email?: string };
  profile: { display_name?: string; role: string; tier: string } | null;
}) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  const displayName = profile?.display_name || user?.email?.split("@")[0] || "Member";

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop left sidebar */}
      <aside className="hidden w-64 flex-col border-r border-border bg-card lg:flex">
        <div className="flex items-center gap-3 border-b border-border px-5 py-4">
          <img src="/brand/asterisk.png" alt="" className="h-6 w-6" />
          <div>
            <p className="font-display text-lg font-black leading-none tracking-[-0.04em]">
              SEAT Squad
            </p>
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
              Remix Academics
            </p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-bold transition ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground/80 hover:bg-surface-high"
                }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border p-3">
          <Link
            href="/settings"
            className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-bold text-foreground/80 transition hover:bg-surface-high"
          >
            <Settings size={18} />
            Settings
          </Link>
          <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-bold text-foreground/80 transition hover:bg-surface-high"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-border bg-card px-4 py-3 lg:hidden">
          <div className="flex items-center gap-2">
            <img src="/brand/asterisk.png" alt="" className="h-5 w-5" />
            <span className="font-display text-lg font-black tracking-[-0.04em]">SEAT Squad</span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-md p-2 hover:bg-surface-high"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </header>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="border-b border-border bg-card lg:hidden">
            <nav className="space-y-1 px-3 py-3">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-bold transition ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground/80 hover:bg-surface-high"
                    }`}
                  >
                    <Icon size={18} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <div className="border-t border-border p-3">
              <button
                onClick={handleSignOut}
                className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-bold text-foreground/80 transition hover:bg-surface-high"
              >
                <LogOut size={18} />
                Sign Out
              </button>
            </div>
          </div>
        )}

        {/* Main content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
