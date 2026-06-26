import { weeklyRecapIssue, weeklyRecapSections } from "@/lib/weekly-recap";
import type { RecapThread } from "@/components/weekly-recap/weekly-recap-page";

type WeeklyRecapEmailInput = {
  latestThreads: RecapThread[];
  baseUrl: string;
  recipientName?: string | null;
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&#039;");
}

function absoluteUrl(baseUrl: string, href: string) {
  if (href.startsWith("http")) return href;
  return `${baseUrl.replace(/\/$/, "")}${href}`;
}

function plainThread(thread: RecapThread) {
  return `- ${thread.title || "Member thread"}: ${thread.content}`;
}

export function renderWeeklyRecapText({ latestThreads, baseUrl, recipientName }: WeeklyRecapEmailInput) {
  const greeting = recipientName ? `Hi ${recipientName},` : "Hi there,";
  return [
    greeting,
    "",
    weeklyRecapIssue.subject,
    "",
    weeklyRecapIssue.intro,
    "",
    "This week's actions:",
    ...weeklyRecapSections.map((item) => `- ${item.title}: ${absoluteUrl(baseUrl, item.href)}`),
    "",
    "Threads to bring forward:",
    ...(latestThreads.length ? latestThreads.map(plainThread) : ["- No member threads yet. Start with the weekly reset prompt."]),
    "",
    `Featured download: ${weeklyRecapIssue.featuredDownload.title}`,
    absoluteUrl(baseUrl, "/resources"),
    "",
    `Signal to discuss: ${weeklyRecapIssue.featuredSignal.title}`,
    weeklyRecapIssue.featuredSignal.discussionPrompt,
    absoluteUrl(baseUrl, "/remix-report"),
    "",
    `One clear next step: ${weeklyRecapIssue.nextStep}`,
    absoluteUrl(baseUrl, "/events"),
    "",
    "You are receiving this because you are a SEAT Squad member.",
    absoluteUrl(baseUrl, "/settings"),
  ].join("\n");
}

export function renderWeeklyRecapHtml({ latestThreads, baseUrl, recipientName }: WeeklyRecapEmailInput) {
  const greeting = recipientName ? `Hi ${escapeHtml(recipientName)},` : "Hi there,";
  const actionCards = weeklyRecapSections.map((item) => `
    <tr>
      <td style="padding:16px;border:1px solid #d6c4b3;border-radius:8px;background:#fffaf1;">
        <p style="margin:0 0 6px;color:#0f4c5c;font-size:11px;font-weight:900;text-transform:uppercase;letter-spacing:.12em;">${escapeHtml(item.eyebrow)}</p>
        <h2 style="margin:0 0 8px;color:#221520;font-size:18px;line-height:1.2;">${escapeHtml(item.title)}</h2>
        <p style="margin:0 0 12px;color:#473241;font-size:14px;line-height:1.55;font-weight:600;">${escapeHtml(item.description)}</p>
        <a href="${absoluteUrl(baseUrl, item.href)}" style="color:#0f4c5c;font-weight:900;text-decoration:none;">Open &rarr;</a>
      </td>
    </tr>
  `).join("<tr><td height=\"10\"></td></tr>");

  const threadRows = latestThreads.length
    ? latestThreads.map((thread) => `
      <tr>
        <td style="padding:14px 0;border-bottom:1px solid #d6c4b3;">
          <p style="margin:0 0 4px;color:#0f4c5c;font-size:12px;font-weight:900;">${escapeHtml(thread.channel?.name || "Forum")}</p>
          <h3 style="margin:0 0 6px;color:#221520;font-size:18px;line-height:1.25;">${escapeHtml(thread.title || "Member thread")}</h3>
          <p style="margin:0;color:#473241;font-size:14px;line-height:1.55;font-weight:600;">${escapeHtml(thread.content)}</p>
        </td>
      </tr>
    `).join("")
    : `<tr><td style="padding:14px 0;color:#473241;font-size:14px;font-weight:600;">No member threads yet. Start with the weekly reset prompt.</td></tr>`;

  return `
<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#f5efe5;font-family:Inter,Arial,sans-serif;color:#221520;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5efe5;padding:28px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:680px;">
            <tr>
              <td style="padding:28px;border-radius:10px;background:#5f0f40;background:linear-gradient(135deg,#5f0f40,#0f4c5c);color:#fff7ed;">
                <p style="margin:0 0 12px;color:#fb8b24;font-size:12px;font-weight:900;text-transform:uppercase;letter-spacing:.18em;">${escapeHtml(weeklyRecapIssue.issue)}</p>
                <h1 style="margin:0;font-size:34px;line-height:1.04;color:#fff7ed;">${escapeHtml(weeklyRecapIssue.subject)}</h1>
                <p style="margin:18px 0 0;color:#f5efe5;font-size:16px;line-height:1.65;font-weight:700;">${escapeHtml(weeklyRecapIssue.intro)}</p>
              </td>
            </tr>
            <tr><td height="18"></td></tr>
            <tr>
              <td style="padding:22px;border:1px solid #d6c4b3;border-radius:10px;background:#fffaf1;">
                <p style="margin:0 0 14px;color:#221520;font-size:15px;line-height:1.6;font-weight:700;">${greeting}</p>
                <p style="margin:0;color:#473241;font-size:15px;line-height:1.6;font-weight:600;">Here is the SEAT Squad rhythm for this week: what to open, what to ask, what to bring live, and what to try before next week.</p>
              </td>
            </tr>
            <tr><td height="18"></td></tr>
            ${actionCards}
            <tr><td height="18"></td></tr>
            <tr>
              <td style="padding:22px;border:1px solid #d6c4b3;border-radius:10px;background:#fffaf1;">
                <p style="margin:0 0 4px;color:#0f4c5c;font-size:12px;font-weight:900;text-transform:uppercase;letter-spacing:.16em;">Community pulse</p>
                <h2 style="margin:0 0 8px;color:#221520;font-size:24px;line-height:1.2;">Threads to bring forward</h2>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${threadRows}</table>
              </td>
            </tr>
            <tr><td height="18"></td></tr>
            <tr>
              <td style="padding:22px;border:1px solid #d6c4b3;border-radius:10px;background:#fffaf1;">
                <p style="margin:0 0 4px;color:#0f4c5c;font-size:12px;font-weight:900;text-transform:uppercase;letter-spacing:.16em;">Download to feature</p>
                <h2 style="margin:0 0 8px;color:#221520;font-size:22px;line-height:1.2;">${escapeHtml(weeklyRecapIssue.featuredDownload.title)}</h2>
                <p style="margin:0 0 12px;color:#473241;font-size:14px;line-height:1.55;font-weight:600;">${escapeHtml(weeklyRecapIssue.featuredDownload.summary)}</p>
                <a href="${absoluteUrl(baseUrl, "/resources")}" style="color:#0f4c5c;font-weight:900;text-decoration:none;">Open resources &rarr;</a>
              </td>
            </tr>
            <tr><td height="18"></td></tr>
            <tr>
              <td style="padding:22px;border-radius:10px;background:#0f4c5c;color:#fff7ed;">
                <p style="margin:0 0 4px;color:#fb8b24;font-size:12px;font-weight:900;text-transform:uppercase;letter-spacing:.16em;">One clear next step</p>
                <h2 style="margin:0 0 14px;color:#fff7ed;font-size:24px;line-height:1.2;">${escapeHtml(weeklyRecapIssue.nextStep)}</h2>
                <a href="${absoluteUrl(baseUrl, "/events")}" style="display:inline-block;border-radius:6px;background:#fb8b24;color:#221520;padding:10px 14px;font-size:14px;font-weight:900;text-decoration:none;">RSVP or ask live</a>
              </td>
            </tr>
            <tr>
              <td style="padding:18px 4px;color:#6d5a50;font-size:12px;line-height:1.5;">
                You are receiving this because you are a SEAT Squad member.
                <a href="${absoluteUrl(baseUrl, "/settings")}" style="color:#0f4c5c;font-weight:800;">Manage settings</a>.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}
