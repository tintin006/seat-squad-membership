"use client";

import { useState } from "react";
import { Search, Shield, ShieldAlert, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Member {
  id: string;
  display_name: string | null;
  role: string;
  tier: string;
  is_suspended: boolean;
  onboarding_complete: boolean;
  created_at: string;
  location: string | null;
}

interface MembersTableProps {
  members: Member[];
}

export function MembersTable({ members }: MembersTableProps) {
  const supabase = createClient();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [updating, setUpdating] = useState<string | null>(null);

  const filtered = members.filter((m) => {
    const matchesSearch = (m.display_name || "").toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "all" || m.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const toggleSuspend = async (id: string, current: boolean) => {
    setUpdating(id);
    await supabase.from("seat_profiles").update({ is_suspended: !current }).eq("id", id);
    window.location.reload();
  };

  const changeRole = async (id: string, newRole: string) => {
    setUpdating(id);
    await supabase.from("seat_profiles").update({ role: newRole }).eq("id", id);
    window.location.reload();
  };

  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex flex-col gap-3 border-b border-border p-5 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="font-display text-lg font-black">Members</h2>
        <div className="flex gap-2">
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search members..."
              className="rounded-md border border-border bg-surface-high py-1.5 pl-8 pr-3 text-xs font-semibold outline-none focus:border-primary"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="rounded-md border border-border bg-surface-high px-2.5 py-1.5 text-xs font-bold outline-none focus:border-primary"
          >
            <option value="all">All Roles</option>
            <option value="family">Family</option>
            <option value="educator">Educator</option>
            <option value="both">Both</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground">
              <th className="px-5 py-3">Member</th>
              <th className="px-5 py-3">Role</th>
              <th className="px-5 py-3">Tier</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Joined</th>
              <th className="px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((m) => (
              <tr key={m.id} className={m.is_suspended ? "opacity-50" : ""}>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 font-display text-xs font-black text-primary">
                      {m.display_name?.[0]?.toUpperCase() || "M"}
                    </div>
                    <div>
                      <p className="font-bold">{m.display_name || "Member"}</p>
                      <p className="text-[10px] text-muted-foreground">{m.location || "No location"}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3">
                  <select
                    value={m.role}
                    onChange={(e) => changeRole(m.id, e.target.value)}
                    disabled={updating === m.id}
                    className="rounded-md border border-border bg-surface-high px-2 py-1 text-xs font-bold outline-none"
                  >
                    <option value="family">Family</option>
                    <option value="educator">Educator</option>
                    <option value="both">Both</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="px-5 py-3">
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-primary">
                    {m.tier}
                  </span>
                </td>
                <td className="px-5 py-3">
                  {m.is_suspended ? (
                    <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-destructive">
                      <ShieldAlert size={12} /> Suspended
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-green-600">
                      <ShieldCheck size={12} /> Active
                    </span>
                  )}
                </td>
                <td className="px-5 py-3 text-xs text-muted-foreground">
                  {new Date(m.created_at).toLocaleDateString()}
                </td>
                <td className="px-5 py-3">
                  <button
                    onClick={() => toggleSuspend(m.id, m.is_suspended)}
                    disabled={updating === m.id}
                    className={`flex items-center gap-1 rounded-md px-2.5 py-1.5 text-[10px] font-black uppercase tracking-wider transition ${
                      m.is_suspended
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : "bg-destructive/10 text-destructive hover:bg-destructive/20"
                    }`}
                  >
                    {updating === m.id ? "..." : m.is_suspended ? "Unsuspend" : "Suspend"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="p-8 text-center text-sm text-muted-foreground">
            No members found matching your search.
          </div>
        )}
      </div>
    </div>
  );
}
