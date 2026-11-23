import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE_NAME, verifySessionToken } from "./lib/session";

/**
 * Allowed domains and hostnames for API access.
 * Enforces origin & referer checks for chitrojaal.com and local development hosts.
 */
const ALLOWED_DOMAINS = [
  "chitrojaal.com",
  "www.chitrojaal.com",
  "localhost",
  "127.0.0.1",
  "192.168.0.149",
  "vercel.app",
];

/**
 * Public API routes accessible without session cookies (still protected against direct document access & invalid origins).
 */
const PUBLIC_API_ROUTES = [
  "/api/auth/login",
  "/api/auth/bootstrap",
  "/api/auth/logout",
  "/api/booking",
  "/api/orders/public",
];

const STAFF_ALLOWED_ADMIN_PAGES = [
  "/admin",
  "/admin/events",
  "/admin/event-managements",
  "/admin/staff",
  "/admin/poses",
  "/admin/photo-drive",
  "/admin/pose-library",
];

function isUnderPath(pathname: string, route: string) {
  return pathname === route || pathname.startsWith(`${route}/`);
}

/**
 * Verifies if the incoming request Origin or Referer matches chitrojaal.com or local dev environments.
 */
function isAllowedOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");
  const host = request.headers.get("host") || "";

  const getHostname = (urlStr: string | null): string | null => {
    if (!urlStr) return null;
    try {
      return new URL(urlStr).hostname.toLowerCase();
    } catch {
      return null;
    }
  };

  const originHost = getHostname(origin);
  const refererHost = getHostname(referer);
  const currentHost = host.split(":")[0].toLowerCase();

  if (
    originHost &&
    !ALLOWED_DOMAINS.some((d) => originHost === d || originHost.endsWith(`.${d}`)) &&
    originHost !== currentHost
  ) {
    return false;
  }

  if (
    refererHost &&
    !ALLOWED_DOMAINS.some((d) => refererHost === d || refererHost.endsWith(`.${d}`)) &&
    refererHost !== currentHost
  ) {
    return false;
  }

  return true;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isApi = pathname.startsWith("/api");
  const isAdminPage = pathname.startsWith("/admin");

  if (!isApi && !isAdminPage) {
    return NextResponse.next();
  }

  // --- API ROUTE DIRECT ACCESS & ORIGIN PROTECTION ---
  if (isApi) {
    const secFetchDest = request.headers.get("sec-fetch-dest");
    const secFetchMode = request.headers.get("sec-fetch-mode");
    const isDirectAccessAllowedApi = isUnderPath(pathname, "/api/invoices");

    // 1. Block direct browser navigation/url typing to API endpoints (except file downloads like invoices)
    if (
      (secFetchDest === "document" || secFetchMode === "navigate") &&
      !isDirectAccessAllowedApi
    ) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          error:
            "Direct access to API routes is forbidden. Access must originate from chitrojaal.com application.",
        }),
        {
          status: 403,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // 2. Validate Origin & Referer match chitrojaal.com
    if (!isAllowedOrigin(request)) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          error: "Access denied. Request origin is not authorized for chitrojaal.com.",
        }),
        {
          status: 403,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // 3. Allow public API endpoints
    const isPublicApi = PUBLIC_API_ROUTES.some((route) => isUnderPath(pathname, route));
    if (isPublicApi) {
      return NextResponse.next();
    }
  }

  // --- AUTHENTICATION & SESSION TOKEN VERIFICATION ---
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  const session = await verifySessionToken(token);

  if (pathname === "/admin/login") {
    if (session) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  // Unauthenticated requests to protected API routes or Admin pages
  if (!session) {
    if (isApi) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          error: "Unauthorized access. Valid session token required.",
        }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        },
      );
    }
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  // Admin users have full access to all API routes & Admin pages
  if (session.accessRole === "admin") {
    return NextResponse.next();
  }

  // Staff users: check admin page permissions
  if (isAdminPage) {
    const isAllowed = STAFF_ALLOWED_ADMIN_PAGES.some((route) => isUnderPath(pathname, route));
    if (!isAllowed) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  // Staff users: check API permissions
  if (isApi) {
    const isStaffAllowedGet =
      request.method === "GET" &&
      (isUnderPath(pathname, "/api/admin/staff") ||
        isUnderPath(pathname, "/api/staff") ||
        isUnderPath(pathname, "/api/event-managements") ||
        isUnderPath(pathname, "/api/admin/event-managements") ||
        isUnderPath(pathname, "/api/poses") ||
        isUnderPath(pathname, "/api/folders") ||
        isUnderPath(pathname, "/api/admin/dashboard") ||
        isUnderPath(pathname, "/api/admin/staff-features") ||
        isUnderPath(pathname, "/api/admin/hero-grid") ||
        isUnderPath(pathname, "/api/admin/bento") ||
        isUnderPath(pathname, "/api/invoices"));

    if (isStaffAllowedGet) {
      return NextResponse.next();
    }

    if (request.method !== "GET") {
      return new NextResponse(
        JSON.stringify({
          success: false,
          error: "Forbidden. Admin privileges required.",
        }),
        {
          status: 403,
          headers: { "Content-Type": "application/json" },
        },
      );
    }
  }

  return NextResponse.next();
}

// Next.js 16 proxy export
export const middleware = proxy;

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
};
