export type SessionRole = "admin" | "staff";

export type SessionPayload = {
  userId: string;
  loginId: string;
  name: string;
  accessRole: SessionRole;
  exp: number;
};

export const AUTH_COOKIE_NAME = "chitro_session";

const SECRET = process.env.AUTH_SECRET || "chitro-jal-dev-secret";
const encoder = new TextEncoder();
const decoder = new TextDecoder();

function bytesToBase64Url(bytes: Uint8Array) {
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlToBytes(value: string) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}

function parseCookieHeader(cookieHeader: string | null) {
  if (!cookieHeader) {
    return {};
  }

  return cookieHeader.split(";").reduce<Record<string, string>>((cookies, item) => {
    const separatorIndex = item.indexOf("=");
    if (separatorIndex === -1) {
      return cookies;
    }
    const key = item.slice(0, separatorIndex).trim();
    const value = item.slice(separatorIndex + 1).trim();
    cookies[key] = value;
    return cookies;
  }, {});
}

async function getSigningKey() {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

export async function signSession(
  payload: Omit<SessionPayload, "exp">,
  ttlSeconds = 60 * 60 * 24 * 7,
) {
  const sessionPayload: SessionPayload = {
    ...payload,
    exp: Date.now() + ttlSeconds * 1000,
  };
  const body = JSON.stringify(sessionPayload);
  const signingKey = await getSigningKey();
  const signature = await crypto.subtle.sign(
    "HMAC",
    signingKey,
    encoder.encode(body),
  );

  return `${bytesToBase64Url(encoder.encode(body))}.${bytesToBase64Url(new Uint8Array(signature))}`;
}

export async function verifySessionToken(token?: string | null) {
  if (!token) {
    return null;
  }

  const [payloadPart, signaturePart] = token.split(".");
  if (!payloadPart || !signaturePart) {
    return null;
  }

  try {
    const payloadBytes = base64UrlToBytes(payloadPart);
    const payloadJson = decoder.decode(payloadBytes);
    const payload = JSON.parse(payloadJson) as SessionPayload;
    if (!payload.exp || payload.exp < Date.now()) {
      return null;
    }

    const signingKey = await getSigningKey();
    const isValid = await crypto.subtle.verify(
      "HMAC",
      signingKey,
      base64UrlToBytes(signaturePart),
      payloadBytes,
    );

    return isValid ? payload : null;
  } catch {
    return null;
  }
}

export function getSessionTokenFromRequest(request: Request) {
  const cookies = parseCookieHeader(request.headers.get("cookie"));
  return cookies[AUTH_COOKIE_NAME] || null;
}

export function parseCookieValue(cookieHeader: string | null, cookieName: string) {
  return parseCookieHeader(cookieHeader)[cookieName] || null;
}
