/** Base URL for the Go API (no trailing slash). */
export function getApiBaseUrl(): string {
  const fallback = "https://uncleansed-untiringly-ron.ngrok-free.dev"; // TODO: Remove this when the API is deployed
  const raw = process.env.NEXT_PUBLIC_API_URL ?? fallback;
  return raw.replace(/\/$/, "");
}
