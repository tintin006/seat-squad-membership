import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { resend, weeklyRecapFrom } from "@/lib/resend";
import { getPublicSiteUrl } from "@/lib/stripe";
import { weeklyRecapIssue } from "@/lib/weekly-recap";
import { renderWeeklyRecapHtml, renderWeeklyRecapText } from "@/lib/weekly-recap-email";
import type { RecapThread } from "@/components/weekly-recap/weekly-recap-page";

type SendMode = "test" | "members";

type Recipient = {
  email: string;
  name: string | null;
};

type QueryThread = Omit<RecapThread, "channel"> & {
  channel: RecapThread["channel"] | NonNullable<RecapThread["channel"]>[];
};

function firstRelation<T>(relation: T | T[] | null): T | null {
  return Array.isArray(relation) ? relation[0] ?? null : relation;
}

async function getLatestThreads() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("seat_posts")
    .select(`
      id, title, content, created_at,
      channel:seat_channels!channel_id(name, slug, color)
    `)
    .order("is_pinned", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(4);

  return ((data || []) as unknown as QueryThread[]).map((thread) => ({
    ...thread,
    channel: firstRelation(thread.channel),
  }));
}

async function getMemberRecipients() {
  const supabase = createAdminClient();
  const { data: profiles } = await supabase
    .from("seat_profiles")
    .select("id, display_name")
    .eq("onboarding_complete", true)
    .eq("is_suspended", false);

  const profileById = new Map((profiles || []).map((profile) => [profile.id, profile.display_name || null]));
  const recipients: Recipient[] = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 1000 });
    if (error) throw error;

    for (const user of data.users) {
      if (user.email && profileById.has(user.id)) {
        recipients.push({ email: user.email, name: profileById.get(user.id) || null });
      }
    }

    hasMore = data.users.length === 1000;
    page += 1;
  }

  return recipients;
}

export async function POST(request: Request) {
  if (!resend) {
    return NextResponse.json({ error: "Resend is not configured." }, { status: 500 });
  }
  const resendClient = resend;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "You must be signed in." }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("seat_profiles")
    .select("role, display_name")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  const { mode } = await request.json() as { mode?: SendMode };
  if (mode !== "test" && mode !== "members") {
    return NextResponse.json({ error: "Choose test or members mode." }, { status: 400 });
  }

  const baseUrl = getPublicSiteUrl(request.headers.get("origin"));
  const latestThreads = await getLatestThreads();
  const recipients: Recipient[] = mode === "test"
    ? user.email ? [{ email: user.email, name: profile.display_name || null }] : []
    : await getMemberRecipients();

  if (recipients.length === 0) {
    return NextResponse.json({ error: "No eligible recipients found." }, { status: 400 });
  }

  const results = await Promise.allSettled(
    recipients.slice(0, 500).map((recipient) => resendClient.emails.send({
      from: weeklyRecapFrom,
      to: recipient.email,
      subject: weeklyRecapIssue.subject,
      html: renderWeeklyRecapHtml({ latestThreads, baseUrl, recipientName: recipient.name }),
      text: renderWeeklyRecapText({ latestThreads, baseUrl, recipientName: recipient.name }),
      tags: [
        { name: "product", value: "seat-squad" },
        { name: "email_type", value: "weekly-recap" },
        { name: "mode", value: mode },
      ],
    }))
  );

  const sent = results.filter((result) => result.status === "fulfilled").length;
  const failed = results.length - sent;

  return NextResponse.json({
    mode,
    requested: recipients.length,
    attempted: results.length,
    sent,
    failed,
  });
}
