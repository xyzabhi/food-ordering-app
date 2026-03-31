/** Base URL for the Go API (no trailing slash). */
export function getApiBaseUrl(): string {
  const fallback =
    process.env.NODE_ENV === "production"
      ? "http://35.200.214.55"
      : "http://localhost:8080";
  const raw = process.env.NEXT_PUBLIC_API_URL ?? fallback;
  return raw.replace(/\/$/, "");
}
