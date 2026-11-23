// lib/mongoose.ts
import mongoose from 'mongoose';
import "@/models/Order";
import "@/models/Payment";
import "@/models/Expense";
import "@/models/Folder";
import "@/models/PhotoDriveLink";
import "@/models/Pose";
import "@/models/Staff";
import "@/models/StaffFeature";
import "@/models/BentoConfig";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

// Extend the global NodeJS interface to hold our cached connection
declare global {
  namespace globalThis {
    var _mongooseClientPromise: Promise<typeof mongoose>;
  }
}


let cached = globalThis._mongooseClientPromise;

if (!cached) {
  cached = globalThis._mongooseClientPromise = mongoose.connect(MONGODB_URI).then((mongoose) => {
    return mongoose
  })
}


async function mongooseConnect() {
  return await cached;
}

export default mongooseConnect;
