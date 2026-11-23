import { NextResponse } from "next/server";
import { ensureDefaultAdminAccount, sanitizeStaffUser } from "@/lib/admin-bootstrap";

export async function POST() {
  try {
    const adminUser = await ensureDefaultAdminAccount();
    return NextResponse.json({
      success: true,
      user: sanitizeStaffUser(adminUser),
      defaultLoginId: "admin",
    });
  } catch (error) {
    console.error("Error bootstrapping admin account:", error);
    return NextResponse.json(
      { success: false, error: "Could not initialize admin account." },
      { status: 500 },
    );
  }
}
