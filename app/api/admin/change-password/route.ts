import { NextResponse } from "next/server";
import mongooseConnect from "@/lib/mongoose";
import Staff from "@/models/Staff";
import { hashPassword, verifyPassword } from "@/lib/password";
import { AUTH_COOKIE_NAME, getSessionTokenFromRequest, signSession, verifySessionToken } from "@/lib/session";
import { sanitizeStaffUser } from "@/lib/admin-bootstrap";

export async function POST(request: Request) {
  await mongooseConnect();

  try {
    const token = getSessionTokenFromRequest(request);
    const session = await verifySessionToken(token);

    if (!session || session.accessRole !== "admin") {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Admin access required." },
        { status: 403 },
      );
    }

    const { name, currentPassword, newPassword, confirmPassword } = await request.json();

    const adminUser =
      (await Staff.findById(session.userId)) ||
      (await Staff.findOne({ accessRole: "admin", loginId: session.loginId })) ||
      (await Staff.findOne({ accessRole: "admin" }));

    if (!adminUser) {
      return NextResponse.json(
        { success: false, error: "Admin user record not found." },
        { status: 404 },
      );
    }

    let updatedName = false;
    let updatedPassword = false;

    if (typeof name === "string" && name.trim().length > 0) {
      if (name.trim() !== adminUser.name) {
        adminUser.name = name.trim();
        updatedName = true;
      }
    }

    if (currentPassword || newPassword || confirmPassword) {
      if (!currentPassword || !newPassword || !confirmPassword) {
        return NextResponse.json(
          { success: false, error: "All password fields are required when changing password." },
          { status: 400 },
        );
      }

      if (newPassword !== confirmPassword) {
        return NextResponse.json(
          { success: false, error: "New password and confirm password do not match." },
          { status: 400 },
        );
      }

      if (newPassword.length < 6) {
        return NextResponse.json(
          { success: false, error: "New password must be at least 6 characters long." },
          { status: 400 },
        );
      }

      const isCurrentValid = adminUser.passwordHash
        ? verifyPassword(currentPassword, adminUser.passwordHash)
        : true;

      if (!isCurrentValid) {
        return NextResponse.json(
          { success: false, error: "Current password is incorrect." },
          { status: 400 },
        );
      }

      adminUser.passwordHash = hashPassword(newPassword);
      updatedPassword = true;
    }

    if (!updatedName && !updatedPassword) {
      return NextResponse.json(
        { success: false, error: "No changes provided to update." },
        { status: 400 },
      );
    }

    adminUser.updatedAt = new Date();
    await adminUser.save();

    const newSessionToken = await signSession({
      userId: adminUser._id.toString(),
      loginId: adminUser.loginId || session.loginId,
      name: adminUser.name,
      accessRole: adminUser.accessRole || "admin",
    });

    const response = NextResponse.json({
      success: true,
      message:
        updatedName && updatedPassword
          ? "Admin name and password updated successfully."
          : updatedName
          ? "Admin name updated successfully."
          : "Admin password updated successfully.",
      user: sanitizeStaffUser(adminUser),
    });

    response.cookies.set(AUTH_COOKIE_NAME, newSessionToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("Error updating admin profile settings:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update admin profile settings." },
      { status: 500 },
    );
  }
}
