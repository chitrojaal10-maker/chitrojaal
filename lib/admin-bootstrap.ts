import mongooseConnect from "@/lib/mongoose";
import Staff from "@/models/Staff";
import { hashPassword } from "./password";

export const DEFAULT_ADMIN_LOGIN_ID = "admin";
export const DEFAULT_ADMIN_PASSWORD = "admin123";

export type PublicStaffUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  loginId?: string | null;
  accessRole: "admin" | "staff";
  phone?: string;
  joinDate?: Date;
  assignments?: number;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

type StaffRecordLike = {
  _id?: { toString(): string };
  id?: string;
  name: string;
  email: string;
  role: string;
  loginId?: string | null;
  accessRole?: "admin" | "staff";
  phone?: string;
  joinDate?: Date;
  assignments?: number;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export function sanitizeStaffUser(user: StaffRecordLike): PublicStaffUser {
  return {
    id: user._id?.toString() ?? user.id ?? "",
    name: user.name,
    email: user.email,
    role: user.role,
    loginId: user.loginId || null,
    accessRole: user.accessRole || "staff",
    phone: user.phone,
    joinDate: user.joinDate,
    assignments: user.assignments,
    status: user.status,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export async function ensureDefaultAdminAccount() {
  await mongooseConnect();

  const existingAdmin =
    (await Staff.findOne({ accessRole: "admin" }).sort({ createdAt: 1 })) ||
    (await Staff.findOne({ loginId: DEFAULT_ADMIN_LOGIN_ID }));

  if (existingAdmin) {
    let didUpdate = false;

    if (!existingAdmin.loginId) {
      existingAdmin.loginId = DEFAULT_ADMIN_LOGIN_ID;
      didUpdate = true;
    }

    if (!existingAdmin.passwordHash) {
      existingAdmin.passwordHash = hashPassword(DEFAULT_ADMIN_PASSWORD);
      didUpdate = true;
    }

    if (existingAdmin.accessRole !== "admin") {
      existingAdmin.accessRole = "admin";
      didUpdate = true;
    }

    if (!existingAdmin.email) {
      existingAdmin.email = "admin@chitrojal.local";
      didUpdate = true;
    }

    if (didUpdate) {
      await existingAdmin.save();
    }

    return existingAdmin;
  }

  const adminUser = await Staff.create({
    name: "Admin",
    email: "admin@chitrojal.local",
    role: "Administrator",
    loginId: DEFAULT_ADMIN_LOGIN_ID,
    passwordHash: hashPassword(DEFAULT_ADMIN_PASSWORD),
    accessRole: "admin",
    phone: "",
    joinDate: new Date(),
    assignments: 0,
    status: "Active",
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return adminUser;
}
