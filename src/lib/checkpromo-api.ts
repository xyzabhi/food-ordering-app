import { getApiBaseUrl } from "@/src/lib/api-base";

export type CheckPromoOk =
  | { valid: true; code: string; discountPercent: number }
  | { valid: false; code: string };

export type CheckPromoResult =
  | { ok: true; body: CheckPromoOk }
  | { ok: false; message: string; status: number };

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

function parseCheckPromoBody(data: unknown): CheckPromoOk | null {
  if (!isRecord(data)) return null;
  const valid = data.valid;
  const code = data.code;
  if (valid === true) {
    const discountPercent = data.discountPercent;
    if (
      typeof code !== "string" ||
      typeof discountPercent !== "number" ||
      !Number.isFinite(discountPercent)
    ) {
      return null;
    }
    return { valid: true, code, discountPercent };
  }
  if (valid === false) {
    if (typeof code !== "string") return null;
    return { valid: false, code };
  }
  return null;
}

/**
 * GET /checkpromo?code=... — trims code before send.
 * UI promo validation uses this endpoint only.
 */
export async function checkPromoCode(code: string): Promise<CheckPromoResult> {
  const trimmed = code.trim();
  const q = encodeURIComponent(trimmed);
  const url = `${getApiBaseUrl()}/checkpromo?code=${q}`;
  try {
    const res = await fetch(url);

    if (res.status === 200) {
      let data: unknown;
      try {
        data = await res.json();
      } catch {
        return { ok: false, message: "Could not verify code", status: res.status };
      }
      const body = parseCheckPromoBody(data);
      if (!body) {
        return { ok: false, message: "Could not verify code", status: res.status };
      }
      return { ok: true, body };
    }

    return { ok: false, message: "Could not verify code", status: res.status };
  } catch {
    return { ok: false, message: "Could not verify code", status: 0 };
  }
}
