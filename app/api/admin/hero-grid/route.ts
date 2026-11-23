import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import fs from "fs";
import path from "path";
import { getSessionTokenFromRequest, verifySessionToken } from "@/lib/session";
import mongooseConnect from "@/lib/mongoose";
import BentoConfig from "@/models/BentoConfig";

const BENTO_FOLDERS = [
  "portfolio",
  "portrait-library",
  "landscape-library",
  "package",
] as const;

export type BentoFolder = (typeof BENTO_FOLDERS)[number];

export type AnimationType = "fade" | "zoom" | "slide" | "slideUp" | "blur";

export interface BentoCategorySettings {
  intervalDuration: number;
  animationType: AnimationType;
}

export type BentoSettings = Record<BentoFolder, BentoCategorySettings>;

const DEFAULT_SETTINGS: BentoSettings = {
  portfolio: { intervalDuration: 2000, animationType: "fade" },
  "portrait-library": { intervalDuration: 2000, animationType: "fade" },
  package: { intervalDuration: 2000, animationType: "zoom" },
  "landscape-library": { intervalDuration: 2000, animationType: "slide" },
};

async function requireAdmin(request: Request) {
  const token = getSessionTokenFromRequest(request);
  const session = await verifySessionToken(token);
  return session?.accessRole === "admin" || session?.accessRole === "staff";
}

function getFolderPath(folder: BentoFolder) {
  return path.join(process.cwd(), "public", folder);
}

function getOrderFilePath(folder: BentoFolder) {
  return path.join(getFolderPath(folder), "order.json");
}

function getSettingsFilePath() {
  return path.join(process.cwd(), "public", "bento-settings.json");
}

export async function readBentoSettings(): Promise<BentoSettings> {
  // 1. Try reading from MongoDB
  try {
    await mongooseConnect();
    const doc = await BentoConfig.findOne({ key: "bento_settings" }).lean();
    if (doc?.value && typeof doc.value === "object") {
      return { ...DEFAULT_SETTINGS, ...(doc.value as object) };
    }
  } catch (e) {
    console.error("Error reading bento settings from MongoDB:", e);
  }

  // 2. Fallback to local JSON file
  const filePath = getSettingsFilePath();
  if (fs.existsSync(filePath)) {
    try {
      const content = fs.readFileSync(filePath, "utf-8");
      const parsed = JSON.parse(content);
      return { ...DEFAULT_SETTINGS, ...parsed };
    } catch (e) {
      console.error("Error reading bento-settings.json", e);
    }
  }
  return DEFAULT_SETTINGS;
}

async function saveBentoSettings(settings: Partial<BentoSettings>) {
  const current = await readBentoSettings();
  const updated = { ...current, ...settings };

  // Save to MongoDB (works in serverless/production read-only FS)
  try {
    await mongooseConnect();
    await BentoConfig.findOneAndUpdate(
      { key: "bento_settings" },
      { value: updated },
      { upsert: true, new: true }
    );
  } catch (e) {
    console.error("Failed to save bento settings to MongoDB:", e);
  }

  // Try writing to disk if in local writable environment (silently ignore EROFS in production)
  try {
    const filePath = getSettingsFilePath();
    const dirPath = path.dirname(filePath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(updated, null, 2), "utf-8");
  } catch {
    // Ignore read-only filesystem errors in production
  }

  try {
    revalidatePath("/");
  } catch (e) {
    // Ignore revalidatePath errors outside request lifecycle if any
  }

  return updated;
}

export async function readFolderImages(folder: BentoFolder): Promise<string[]> {
  const dirPath = getFolderPath(folder);
  let allFiles: string[] = [];
  if (fs.existsSync(dirPath)) {
    try {
      allFiles = fs.readdirSync(dirPath).filter((file) => {
        if (file === "order.json" || file.startsWith(".")) return false;
        try {
          const stat = fs.statSync(path.join(dirPath, file));
          return stat.isFile();
        } catch {
          return false;
        }
      });
    } catch (e) {
      console.error(`Error reading dir for ${folder}:`, e);
    }
  }

  let orderedFilenames: string[] = [];
  let hasConfiguredOrder = false;

  // 1. Try reading order from MongoDB
  try {
    await mongooseConnect();
    const doc = await BentoConfig.findOne({ key: `bento_order_${folder}` }).lean();
    if (Array.isArray(doc?.value)) {
      orderedFilenames = doc.value.filter((name: unknown) => typeof name === "string") as string[];
      hasConfiguredOrder = true;
    }
  } catch (e) {
    console.error(`Error reading order from DB for ${folder}:`, e);
  }

  // 2. Fallback to order.json
  if (!hasConfiguredOrder) {
    const orderFile = getOrderFilePath(folder);
    if (fs.existsSync(orderFile)) {
      try {
        const content = fs.readFileSync(orderFile, "utf-8");
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed)) {
          orderedFilenames = parsed.filter((name) => typeof name === "string");
          hasConfiguredOrder = true;
        }
      } catch (e) {
        console.error(`Error reading order.json for ${folder}:`, e);
      }
    }
  }

  let finalFilenames: string[] = [];

  if (hasConfiguredOrder) {
    if (allFiles.length > 0) {
      finalFilenames = orderedFilenames.filter((name) => allFiles.includes(name));
    } else {
      finalFilenames = orderedFilenames;
    }
  } else {
    finalFilenames = allFiles;
  }

  return finalFilenames.map((name) => `/${folder}/${name}`);
}

async function saveFolderOrder(folder: BentoFolder, filenames: string[]) {
  // Save to MongoDB
  try {
    await mongooseConnect();
    await BentoConfig.findOneAndUpdate(
      { key: `bento_order_${folder}` },
      { value: filenames },
      { upsert: true, new: true }
    );
  } catch (e) {
    console.error(`Failed to save folder order to MongoDB for ${folder}:`, e);
  }

  // Try writing to disk if in local writable environment (silently ignore EROFS in production)
  try {
    const dirPath = getFolderPath(folder);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    const orderFile = getOrderFilePath(folder);
    fs.writeFileSync(orderFile, JSON.stringify(filenames, null, 2), "utf-8");
  } catch {
    // Ignore read-only filesystem errors in production
  }

  try {
    revalidatePath("/");
  } catch (e) {
    // Ignore revalidatePath errors outside request lifecycle if any
  }
}

// GET all bento folder images and settings
export async function GET() {
  try {
    const data: Record<string, string[]> = {};
    for (const folder of BENTO_FOLDERS) {
      data[folder] = await readFolderImages(folder);
    }
    const settings = await readBentoSettings();
    return NextResponse.json({ success: true, folders: data, settings });
  } catch (error: any) {
    console.error("Error fetching bento images:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to fetch bento images" },
      { status: 500 },
    );
  }
}

// POST upload, update, or delete handler (handles all write actions to support environments where PUT/DELETE return 501)
export async function POST(request: Request) {
  try {
    if (!(await requireAdmin(request))) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access" },
        { status: 403 },
      );
    }

    const contentType = request.headers.get("content-type") || "";

    // Handle JSON body requests (Delete or Update/Save)
    if (contentType.includes("application/json")) {
      let body: any;
      try {
        body = await request.json();
      } catch {
        return NextResponse.json(
          { success: false, error: "Invalid JSON request body" },
          { status: 400 },
        );
      }

      // Action: Delete Image
      if (body.action === "delete") {
        const { folder, imagePath } = body as {
          folder: BentoFolder;
          imagePath: string;
        };

        if (!folder || !BENTO_FOLDERS.includes(folder) || !imagePath) {
          return NextResponse.json(
            { success: false, error: "Invalid parameters for delete" },
            { status: 400 },
          );
        }

        const decodedPath = decodeURIComponent(imagePath);
        const filename = path.basename(decodedPath);
        const filePath = path.join(getFolderPath(folder), filename);

        if (fs.existsSync(filePath)) {
          try {
            fs.unlinkSync(filePath);
            console.log(`[Bento Delete] Successfully deleted file from disk: ${filePath}`);
          } catch (e) {
            console.error(`[Bento Delete] Error deleting file from disk: ${filePath}`, e);
          }
        } else {
          console.warn(`[Bento Delete] File not found on disk: ${filePath}`);
        }

        const currentImages = await readFolderImages(folder);
        const updatedFilenames = currentImages
          .map((img) => path.basename(decodeURIComponent(img)))
          .filter((n) => n !== filename);

        await saveFolderOrder(folder, updatedFilenames);

        return NextResponse.json({
          success: true,
          folder,
          images: await readFolderImages(folder),
        });
      }

      // Action: Save Order / Settings
      const { folder, images, settings } = body as {
        folder?: BentoFolder;
        images?: string[];
        settings?: BentoSettings;
      };

      if (settings) {
        await saveBentoSettings(settings);
      }

      const validFolder = folder && BENTO_FOLDERS.includes(folder) ? folder : undefined;

      if (validFolder && Array.isArray(images)) {
        const filenames = images.map((img) => path.basename(img));
        await saveFolderOrder(validFolder, filenames);
      }

      return NextResponse.json({
        success: true,
        folder: validFolder,
        images: validFolder ? await readFolderImages(validFolder) : undefined,
        settings: await readBentoSettings(),
      });
    }

    // Handle Multipart Form Data (Upload)
    const formData = await request.formData();
    const folder = formData.get("folder") as BentoFolder;

    if (!folder || !BENTO_FOLDERS.includes(folder)) {
      return NextResponse.json(
        { success: false, error: "Invalid folder target" },
        { status: 400 },
      );
    }

    const files = formData.getAll("files") as File[];
    const singleFile = formData.get("file") as File;
    const uploadFiles = files.length > 0 ? files : singleFile ? [singleFile] : [];

    if (uploadFiles.length === 0) {
      return NextResponse.json(
        { success: false, error: "No files uploaded" },
        { status: 400 },
      );
    }

    const dirPath = getFolderPath(folder);

    const currentImages = await readFolderImages(folder);
    const currentFilenames = currentImages.map((img) => path.basename(img));
    const newFilenames: string[] = [];

    for (const file of uploadFiles) {
      const originalName = file.name.replace(/[^a-zA-Z0-9.\-_ ()]/g, "_");
      let targetName = originalName;

      let counter = 1;
      const ext = path.extname(originalName);
      const nameWithoutExt = path.basename(originalName, ext);

      while (fs.existsSync(path.join(dirPath, targetName))) {
        targetName = `${nameWithoutExt}_${counter}${ext}`;
        counter++;
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      try {
        if (!fs.existsSync(dirPath)) {
          fs.mkdirSync(dirPath, { recursive: true });
        }
        fs.writeFileSync(path.join(dirPath, targetName), buffer);
        newFilenames.push(targetName);
      } catch (e: any) {
        if (e?.code === "EROFS" || e?.message?.includes("read-only")) {
          return NextResponse.json(
            {
              success: false,
              error:
                "File upload to public folder is not supported in serverless production (read-only filesystem). Please add images to git repository or configure cloud storage.",
            },
            { status: 400 },
          );
        }
        throw e;
      }
    }

    const updatedFilenames = [...currentFilenames, ...newFilenames];
    await saveFolderOrder(folder, updatedFilenames);

    return NextResponse.json({
      success: true,
      folder,
      images: await readFolderImages(folder),
    });
  } catch (error: any) {
    console.error("Error in hero-grid POST route:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Operation failed" },
      { status: 500 },
    );
  }
}

// PUT handler (for standard REST clients)
export async function PUT(request: Request) {
  return POST(request);
}

// DELETE handler (for standard REST clients)
export async function DELETE(request: Request) {
  try {
    if (!(await requireAdmin(request))) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { folder, imagePath } = body as {
      folder: BentoFolder;
      imagePath: string;
    };

    if (!folder || !BENTO_FOLDERS.includes(folder) || !imagePath) {
      return NextResponse.json(
        { success: false, error: "Invalid parameters" },
        { status: 400 },
      );
    }

    const decodedPath = decodeURIComponent(imagePath);
    const filename = path.basename(decodedPath);
    const filePath = path.join(getFolderPath(folder), filename);

    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
        console.log(`[Bento Delete] Successfully deleted file from disk: ${filePath}`);
      } catch (e) {
        console.error(`[Bento Delete] Error deleting file from disk: ${filePath}`, e);
      }
    } else {
      console.warn(`[Bento Delete] File not found on disk: ${filePath}`);
    }

    const currentImages = await readFolderImages(folder);
    const updatedFilenames = currentImages
      .map((img) => path.basename(decodeURIComponent(img)))
      .filter((n) => n !== filename);

    await saveFolderOrder(folder, updatedFilenames);

    return NextResponse.json({
      success: true,
      folder,
      images: await readFolderImages(folder),
    });
  } catch (error) {
    console.error("Error deleting hero grid image:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete image" },
      { status: 500 },
    );
  }
}

