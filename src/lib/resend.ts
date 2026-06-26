import { Resend } from "resend";

export const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export const weeklyRecapFrom =
  process.env.WEEKLY_RECAP_FROM || "SEAT Squad <updates@remixacademics.com>";
