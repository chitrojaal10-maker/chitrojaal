import { NextResponse } from "next/server";
import { ensureDefaultAdminAccount, sanitizeStaffUser } from "@/lib/admin-bootstrap";
import mongooseConnect from "@/lib/mongoose";
import Staff from "@/models/Staff";
import { AUTH_COOKIE_NAME, getSessionTokenFromRequest, verifySessionToken } from "@/lib/session";

export async function GET(request: Request) {
  await ensureDefaultAdminAccount();
  await mongooseConnect();

  const token = getSessionTokenFromRequest(request);
  const session = await verifySessionToken(token);

  if (!session) {
    return NextResponse.json({ success: false, user: null }, { status: 401 });
  }

  const user = await Staff.findById(session.userId);
  if (!user) {
    const response = NextResponse.json({ success: false, user: null }, { status: 401 });
    response.cookies.set(AUTH_COOKIE_NAME, "", { path: "/", maxAge: 0 });
    return response;
  }

  return NextResponse.json({
    success: true,
    user: sanitizeStaffUser(user),
  });
}
