"use client";

import { useState } from "react";
import { Megaphone, Pin, ShieldCheck, Lock, Unlock, MessageSquareText } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Relation<T> = T | T[] | null;

export type AdminContentPost = {
  id: string;
  title: string | null;
  content: string;
  is_pinned: boolean;
  is_announcement: boolean;
  is_locked: boolean;
  created_at: string;
  channel: Relation<{ name: string; slug: string; color: string }>;
  author: Relation<{ display_name: string | null; role: string }>;
};

type ContentControlsProps = {
  posts: AdminContentPost[];
  demoMode?: boolean;
};

function firstRelation<T>(relation: Relation<T>): T | null {
  return Array.isArray(relation) ? relation[0] ?? null : relation;
}

export function ContentControls({ posts, demoMode = false }: ContentControlsProps) {
  const supabase = createClient();
  const [items, setItems] = useState(posts);
  const [savingId, setSavingId] = useState<string | null>(null);

  const togglePostFlag = async (postId: string, field: "is_pinned" | "is_announcement" | "is_locked") => {
    const current = items.find((item) => item.id === postId);
    if (!current) return;

    const nextValue = !current[field];
    setSavingId(postId);

    if (!demoMode) {
      const { error } = await supabase
        .from("seat_posts")
        .update({ [field]: nextValue, updated_at: new Date().toISOString() })
        .eq("id", postId);

      if (error) {
        setSavingId(null);
        return;
      }
    }

    setItems((existing) =>
      existing.map((item) => item.id === postId ? { ...item, [field]: nextValue } : item)
    );
    setSavingId(null);
  };

  const pinnedCount = items.filter((post) => post.is_pinned).length;
  const announcementCount = items.filter((post) => post.is_announcement).length;
  const lockedCount = items.filter((post) => post.is_locked).length;

  return (
    <section className="rounded-lg border border-border bg-card shadow-soft">
      <div className="border-b border-border p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h2 className="flex items-center gap-2 font-display text-xl font-black">
              <ShieldCheck size={20} className="text-primary" />
              Content Controls
            </h2>
            <p className="mt-1 text-sm font-semibold text-muted-foreground">
              Pin, announce, or lock important threads without touching the database by hand.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center text-xs font-black">
            <span className="rounded-md bg-surface-high px-3 py-2">{pinnedCount} pinned</span>
            <span className="rounded-md bg-surface-high px-3 py-2">{announcementCount} announced</span>
            <span className="rounded-md bg-surface-high px-3 py-2">{lockedCount} locked</span>
          </div>
        </div>
      </div>

      <div className="divide-y divide-border">
        {items.length === 0 && (
          <div className="p-8 text-center text-sm font-semibold text-muted-foreground">
            No forum posts yet.
          </div>
        )}

        {items.map((post) => {
          const channel = firstRelation(post.channel);
          const author = firstRelation(post.author);
          const isSaving = savingId === post.id;

          return (
            <article key={post.id} className="p-5">
              <div className="grid gap-4 xl:grid-cols-[1fr_auto]">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    {channel && (
                      <span className="rounded-full px-2 py-1 text-[11px] font-black text-white" style={{ backgroundColor: channel.color }}>
                        {channel.name}
                      </span>
                    )}
                    <span className="text-xs font-bold text-muted-foreground">
                      {new Date(post.created_at).toLocaleDateString()} by {author?.display_name || "Member"}
                    </span>
                    {post.is_pinned && <span className="rounded-full bg-accent px-2 py-1 text-[10px] font-black uppercase text-accent-foreground">Pinned</span>}
                    {post.is_announcement && <span className="rounded-full bg-secondary px-2 py-1 text-[10px] font-black uppercase text-secondary-foreground">Announcement</span>}
                    {post.is_locked && <span className="rounded-full border border-border bg-surface-high px-2 py-1 text-[10px] font-black uppercase">Locked</span>}
                  </div>
                  <h3 className="mt-3 font-display text-lg font-black">{post.title || "Untitled thread"}</h3>
                  <p className="mt-1 line-clamp-2 text-sm font-semibold leading-5 text-muted-foreground">{post.content}</p>
                </div>

                <div className="grid grid-cols-3 gap-2 xl:w-[25rem]">
                  <button
                    type="button"
                    onClick={() => togglePostFlag(post.id, "is_pinned")}
                    disabled={isSaving}
                    className={`inline-flex items-center justify-center gap-2 rounded-md border px-3 py-2 text-xs font-black transition ${
                      post.is_pinned ? "border-accent bg-accent text-accent-foreground" : "border-border bg-surface-high hover:border-primary"
                    } disabled:opacity-50`}
                  >
                    <Pin size={14} /> Pin
                  </button>
                  <button
                    type="button"
                    onClick={() => togglePostFlag(post.id, "is_announcement")}
                    disabled={isSaving}
                    className={`inline-flex items-center justify-center gap-2 rounded-md border px-3 py-2 text-xs font-black transition ${
                      post.is_announcement ? "border-secondary bg-secondary text-secondary-foreground" : "border-border bg-surface-high hover:border-primary"
                    } disabled:opacity-50`}
                  >
                    <Megaphone size={14} /> Announce
                  </button>
                  <button
                    type="button"
                    onClick={() => togglePostFlag(post.id, "is_locked")}
                    disabled={isSaving}
                    className={`inline-flex items-center justify-center gap-2 rounded-md border px-3 py-2 text-xs font-black transition ${
                      post.is_locked ? "border-primary bg-primary text-primary-foreground" : "border-border bg-surface-high hover:border-primary"
                    } disabled:opacity-50`}
                  >
                    {post.is_locked ? <Lock size={14} /> : <Unlock size={14} />}
                    {post.is_locked ? "Locked" : "Open"}
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className="border-t border-border bg-surface-high px-5 py-3">
        <p className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
          <MessageSquareText size={14} />
          Locked threads stay readable, but new replies are disabled in the member forum.
        </p>
      </div>
    </section>
  );
}
