import { db } from "./client.js";

export const SAVED_ADMIN_EMAIL_KEY = "yi-admin-email";

export function isAuthIssue(error) {
  const msg = (error?.message || "").toLowerCase();
  return (
    error?.status === 401 ||
    error?.status === 403 ||
    msg.includes("row-level security") ||
    msg.includes("permission") ||
    msg.includes("not authorized") ||
    msg.includes("jwt")
  );
}

export function getErrorMessage(error, fallback = "Something went wrong.") {
  if (!error) return fallback;
  if (isAuthIssue(error)) {
    return "Admin permission denied. Sign in with the approved admin account and confirm the Supabase admin policies are applied.";
  }
  return error.message || fallback;
}

export function getAdminSetupError(error) {
  const msg = (error?.message || "").toLowerCase();
  if (msg.includes("admin_users") || msg.includes("does not exist")) {
    return "Admin access could not be verified. Run the Supabase admin setup SQL first.";
  }
  return getErrorMessage(error, "Admin access could not be verified. Please try again.");
}

export async function checkAdminAccess(userId) {
  const { data, error } = await db
    .from("admin_users")
    .select("user_id")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw error;
  return !!data;
}
