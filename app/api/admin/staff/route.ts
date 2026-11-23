import { NextResponse } from "next/server";
import { hashPassword } from "@/lib/password";
import mongooseConnect from "@/lib/mongoose";
import Staff from "@/models/Staff";

const DEFAULT_STAFF_EMAIL_DOMAIN = "chitrojal.local";

interface StaffRequest extends Record<string, unknown> {
  _id?: string;
  loginId: string;
  password: string;
  email?: string;
  role?: string;
  name?: string;
  phone?: string;
  address?: string;
}

function normalizeStaffFields(body: Record<string, unknown>): StaffRequest {
  const loginId = typeof body.loginId === "string" ? body.loginId.trim() : "";

  const password = typeof body.password === "string" ? body.password : "";

  const email =
    typeof body.email === "string" && body.email.trim()
      ? body.email.trim()
      : loginId
        ? `${loginId}@${DEFAULT_STAFF_EMAIL_DOMAIN}`
        : "";

  const role =
    typeof body.role === "string" && body.role.trim()
      ? body.role.trim()
      : "Staff";

  return {
    ...body,
    loginId,
    password,
    email,
    role,
  } as StaffRequest;
}

export async function GET() {
  await mongooseConnect();

  try {
    const staff = await Staff.find({})
      .sort({ createdAt: -1 })
      .select("-passwordHash");

    return NextResponse.json({
      success: true,
      data: staff,
    });
  } catch (error) {
    console.error("Error fetching staff:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Server Error",
      },
      {
        status: 500,
      },
    );
  }
}

export async function POST(request: Request) {
  await mongooseConnect();

  try {
    const rawBody = (await request.json()) as Record<string, unknown>;
    const body = normalizeStaffFields(rawBody);

    if (!body.loginId || !body.password) {
      return NextResponse.json(
        {
          success: false,
          error: "Login ID and password are required",
        },
        {
          status: 400,
        },
      );
    }

    if (!body.email) {
      return NextResponse.json(
        {
          success: false,
          error: "Email or login ID is required",
        },
        {
          status: 400,
        },
      );
    }

    const newStaffMember = new Staff({
      ...body,
      loginId: body.loginId,
      passwordHash: hashPassword(body.password),
      accessRole: "staff",
      updatedAt: new Date(),
    });

    await newStaffMember.save();

    const result = newStaffMember.toObject();
    delete result.passwordHash;

    return NextResponse.json(
      {
        success: true,
        data: result,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error("Error creating staff member:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Bad Request",
      },
      {
        status: 400,
      },
    );
  }
}

export async function PUT(request: Request) {
  await mongooseConnect();

  try {
    const rawBody = (await request.json()) as Record<string, unknown>;
    const body = normalizeStaffFields(rawBody);

    const { _id, password, ...updates } = body;

    const nextUpdates = {
      ...updates,
      accessRole: "staff",
      updatedAt: new Date(),
      ...(password
        ? {
            passwordHash: hashPassword(password),
          }
        : {}),
    };

    const updatedStaff = await Staff.findByIdAndUpdate(_id, nextUpdates, {
      new: true,
    }).select("-passwordHash");

    if (!updatedStaff) {
      return NextResponse.json(
        {
          success: false,
          error: "Staff member not found",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedStaff,
    });
  } catch (error) {
    console.error("Error updating staff member:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Bad Request",
      },
      {
        status: 400,
      },
    );
  }
}
