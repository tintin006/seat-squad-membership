"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  Home,
  BookOpen,
  Package,
  CalendarDays,
  Users,
  MessageSquareText,
  GraduationCap,
  MapPinned,
  Trophy,
  Settings,
  LogOut,
  Menu,
  X,
  Shield,
  Compass,
  Download,
  Mail,
  Newspaper,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

const baseNavItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: Compass, label: "Start Here", href: "/start-here" },
  { icon: Download, label: "Resources", href: "/resources" },
  { icon: Newspaper, label: "Remix Report", href: "/remix-report" },
  { icon: Mail, label: "Weekly Recap", href: "/weekly-recap" },
  { icon: MessageSquareText, label: "Forum", href: "/forum" },
  { icon: BookOpen, label: "Classroom", href: "/classroom" },
  { icon: Package, label: "The Crate", href: "/crate" },
  { icon: MapPinned, label: "Pods & Groups", href: "/pods" },
  { icon: CalendarDays, label: "Events", href: "/events" },
  { icon: Users, label: "Members", href: "/members" },
  { icon: Trophy, label: "Leaderboard", href: "/leaderboard" },
  { icon: GraduationCap, label: "Tutors", href: "/tutors" },
];

const legalLinks = [
  { label: "Terms", href: "/terms" },
  { label: "Privacy", href: "/privacy" },
  { label: "Guidelines", href: "/community-guidelines" },
  { label: "Support", href: "/support" },
];

export function AppShell({
  children,
  user,
  profile,
  hrefResolver = (href) => href,
}: {
  children: React.ReactNode;
  user: { email?: string };
  profile: { display_name?: string; role: string; tier: string } | null;
  hrefResolver?: (href: string) => string;
}) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const supabase = createClient();

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [mobileMenuOpen]);

  const isAdmin = profile?.role === "admin";
  const navItems = isAdmin
    ? [...baseNavItems, { icon: Shield, label: "Admin", href: "/admin" }]
    : baseNavItems;

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  const displayName = profile?.display_name || user?.email?.split("@")[0] || "Member";
  const tierLabel = profile?.tier ? `${profile.tier.charAt(0).toUpperCase()}${profile.tier.slice(1)} plan` : "Free plan";

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop left sidebar */}
      <aside className="hidden w-72 flex-col border-r border-secondary/30 bg-secondary text-secondary-foreground lg:flex">
        <div className="flex items-center gap-3 border-b border-white/15 px-5 py-4">
          <Image src="/brand/asterisk.png" alt="" width={24} height={24} className="h-6 w-6" />
          <div>
            <p className="font-display text-lg font-black leading-none tracking-[-0.04em]">
              SEAT Squad
            </p>
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/70">
              Community commons
            </p>
          </div>
        </div>

        <div className="mx-4 mt-4 overflow-hidden rounded-lg border border-white/15 bg-white/10">
          <div className="seat-image h-28">
            <Image
              src="/images/seat-squad-community-diverse.png"
              alt=""
              fill
              sizes="288px"
              className="object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 z-10 p-3">
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-accent">
                What families actually need
              </p>
              <p className="mt-1 text-xs font-bold leading-4 text-white">
                Community, resources, and real support — from the people who live it.
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const href = hrefResolver(item.href);
            const isHomeHref = href === "/" || href === "/demo";
            const isActive = isHomeHref ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-bold transition ${
                  isActive
                    ? "bg-accent text-accent-foreground shadow-soft"
                    : "text-white/82 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/15 p-3">
          <div className="mb-2 rounded-lg border border-white/15 bg-white/10 p-3">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/60">
              Signed in as
            </p>
            <p className="mt-1 truncate text-sm font-black text-white">{displayName}</p>
            <p className="mt-1 text-xs font-semibold capitalize text-white/70">
              {tierLabel}
            </p>
          </div>
          <Link
            href={hrefResolver("/settings")}
            className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-bold text-white/82 transition hover:bg-white/10 hover:text-white"
          >
            <Settings size={18} />
            Settings
          </Link>
          <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-bold text-white/82 transition hover:bg-white/10 hover:text-white"
          >
            <LogOut size={18} />
            Sign Out
          </button>
          <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 px-3 text-[11px] font-bold text-white/55">
            {legalLinks.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-white">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-secondary/30 bg-secondary px-4 py-3 text-secondary-foreground lg:hidden">
          <div className="flex items-center gap-2">
            <Image src="/brand/asterisk.png" alt="" width={20} height={20} className="h-5 w-5" />
            <span className="font-display text-lg font-black tracking-[-0.04em]">SEAT Squad</span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-md p-2 hover:bg-white/10"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </header>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div
            className="border-b border-secondary/30 bg-secondary text-secondary-foreground lg:hidden"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setMobileMenuOpen(false);
              }
            }}
          >
            <nav className="space-y-1 px-3 py-3">
              {navItems.map((item) => {
                const Icon = item.icon;
                const href = hrefResolver(item.href);
                const isHomeHref = href === "/" || href === "/demo";
                const isActive = isHomeHref ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-bold transition ${
                      isActive
                        ? "bg-accent text-accent-foreground"
                        : "text-white/82 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <Icon size={18} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <div className="border-t border-white/15 p-3">
              <Link
                href={hrefResolver("/settings")}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-bold text-white/82 transition hover:bg-white/10 hover:text-white"
              >
                <Settings size={18} />
                Settings
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleSignOut();
                }}
                className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-bold text-white/82 transition hover:bg-white/10 hover:text-white"
              >
                <LogOut size={18} />
                Sign Out
              </button>
              <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 px-3 text-[11px] font-bold text-white/55">
                {legalLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="hover:text-white"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Main content */}
        <main className="flex-1 overflow-auto bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}
