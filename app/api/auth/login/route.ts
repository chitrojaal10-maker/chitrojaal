import { NextResponse } from "next/server";
import { ensureDefaultAdminAccount, sanitizeStaffUser } from "@/lib/admin-bootstrap";
import mongooseConnect from "@/lib/mongoose";
import Staff from "@/models/Staff";
import { hashPassword, verifyPassword } from "@/lib/password";
import { AUTH_COOKIE_NAME, signSession } from "@/lib/session";

export async function POST(request: Request) {
  await ensureDefaultAdminAccount();
  await mongooseConnect();

  try {
    const { loginId, password } = await request.json();

    if (!loginId || !password) {
      return NextResponse.json(
        { success: false, error: "Login ID and password are required." },
        { status: 400 },
      );
    }

    const user = await Staff.findOne({
      loginId: loginId.trim(),
      accessRole: { $in: ["admin", "staff"] },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Invalid login credentials." },
        { status: 401 },
      );
    }

    const passwordIsValid = user.passwordHash
      ? verifyPassword(password, user.passwordHash)
      : true;

    if (!passwordIsValid) {
      return NextResponse.json(
        { success: false, error: "Invalid login credentials." },
        { status: 401 },
      );
    }

    if (!user.passwordHash) {
      user.passwordHash = hashPassword(password);
      await user.save();
    }

    const sessionToken = await signSession({
      userId: user._id.toString(),
      loginId: user.loginId,
      name: user.name,
      accessRole: user.accessRole || "staff",
    });

    const response = NextResponse.json({
      success: true,
      user: sanitizeStaffUser(user),
    });

    response.cookies.set(AUTH_COOKIE_NAME, sessionToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("Error during login:", error);
    return NextResponse.json(
      { success: false, error: "Unable to sign in." },
      { status: 500 },
    );
  }
}
