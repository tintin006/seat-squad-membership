import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { digitalDownloads } from "@/lib/digital-downloads";
import { canAccessTier, type SeatTier } from "@/lib/tiers";

export async function GET(_request: Request, context: RouteContext<"/api/resources/download/[id]">) {
  const { id } = await context.params;
  const download = digitalDownloads.find((item) => item.id === id);

  if (!download) {
    return NextResponse.json({ error: "Download not found." }, { status: 404 });
  }

  if (!download.storageBucket || !download.storagePath) {
    return NextResponse.json({ error: "Download is not available yet." }, { status: 404 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL("/login", _request.url));
  }

  const { data: profile } = await supabase
    .from("seat_profiles")
    .select("tier")
    .eq("id", user.id)
    .single();

  const userTier = (profile?.tier || "free") as SeatTier;
  if (!canAccessTier(userTier, download.tier)) {
    return NextResponse.redirect(new URL("/settings", _request.url));
  }

  const admin = createAdminClient();
  const { data, error } = await admin.storage
    .from(download.storageBucket)
    .createSignedUrl(download.storagePath, 60);

  if (error || !data?.signedUrl) {
    return NextResponse.json({ error: "Could not create a signed download link." }, { status: 500 });
  }

  return NextResponse.redirect(data.signedUrl);
}
