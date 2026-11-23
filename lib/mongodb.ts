import { MongoClient, Db } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local",
  );
}
if (!MONGODB_DB) {
  throw new Error(
    "Please define the MONGODB_DB environment variable inside .env.local",
  );
}

// Extend the global NodeJS interface to hold our cached connection
declare global {
  namespace globalThis {
    var _mongoClientPromise: Promise<MongoClient>;
  }
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that value is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!globalThis._mongoClientPromise) {
    client = new MongoClient(MONGODB_URI!);
    globalThis._mongoClientPromise = client.connect();
  }
  clientPromise = globalThis._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(MONGODB_URI!);
  clientPromise = client.connect();
}

async function dbConnect(): Promise<{ db: Db }> {
  const client = await clientPromise;
  const db = client.db(MONGODB_DB);
  return { db };
}

export default dbConnect;
