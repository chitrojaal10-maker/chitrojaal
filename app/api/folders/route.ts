import { NextResponse } from "next/server";
import mongooseConnect from "@/lib/mongoose";
import Folder from "@/models/Folder";
import Pose from "@/models/Pose";
import { getSessionTokenFromRequest, verifySessionToken } from "@/lib/session";

async function requireAdmin(request: Request) {
  const token = getSessionTokenFromRequest(request);
  const session = await verifySessionToken(token);
  return session?.accessRole === "admin";
}

// GET all folders
export async function GET() {
  await mongooseConnect();
  try {
    const folders = await Folder.find({}).lean();
    const folderIds = folders.map((f) => f._id);
    const poses = await Pose.find({ folder: { $in: folderIds } })
      .select("folder imageUrls")
      .lean();

    const foldersWithImages = folders.map((folder) => {
      const folderPoses = poses.filter(
        (p) => String(p.folder) === String(folder._id),
      );
      const imageUrls = folderPoses.flatMap((p) => p.imageUrls || []);
      return {
        ...folder,
        imageUrls,
        totalPhotos: imageUrls.length,
      };
    });

    return NextResponse.json(foldersWithImages);
  } catch (error) {
    console.error("Error fetching folders:", error);
    return NextResponse.json({ error: "Error fetching folders" }, { status: 500 });
  }
}

// POST a new folder
export async function POST(request: Request) {
  await mongooseConnect();
  try {
    if (!(await requireAdmin(request))) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }
    const { name } = await request.json();
    const newFolder = await Folder.create({ name });
    return NextResponse.json(newFolder);
  } catch (error) {
    console.error("Error creating folder:", error);
    return NextResponse.json({ error: "Error creating folder" }, { status: 500 });
  }
}
