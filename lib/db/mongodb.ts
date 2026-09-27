import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/neon_thrift";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose | null> | null;
  isConnected: boolean;
  lastFailedTime: number;
  lastError: string | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongooseCache || {
  conn: null,
  promise: null,
  isConnected: false,
  lastFailedTime: 0,
  lastError: null,
};

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

// Cooldown of 30 seconds before attempting to reconnect to avoid blocking requests
const RETRY_COOLDOWN_MS = 30000;

export async function connectDB(forceRetry: boolean = false): Promise<typeof mongoose | null> {
  if (cached.conn && mongoose.connection.readyState === 1) {
    cached.isConnected = true;
    return cached.conn;
  }

  // If connection failed recently and forceRetry is not set, return null immediately without blocking
  const now = Date.now();
  if (!forceRetry && cached.lastFailedTime > 0 && now - cached.lastFailedTime < RETRY_COOLDOWN_MS) {
    return null;
  }

  if (cached.promise && !forceRetry) {
    try {
      cached.conn = await cached.promise;
      return cached.conn;
    } catch {
      return null;
    }
  }

  const opts = {
    bufferCommands: false,
    serverSelectionTimeoutMS: 1500, // Quick timeout for fast failover
  };

  cached.promise = mongoose
    .connect(MONGODB_URI, opts)
    .then((mongooseInstance) => {
      cached.isConnected = true;
      cached.lastFailedTime = 0;
      cached.lastError = null;
      cached.conn = mongooseInstance;
      return mongooseInstance;
    })
    .catch((err) => {
      cached.isConnected = false;
      cached.lastFailedTime = Date.now();
      cached.lastError = err.message;
      cached.conn = null;
      cached.promise = null;
      console.warn("MongoDB connection could not be established:", err.message);
      return null;
    });

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch {
    cached.conn = null;
    return null;
  }
}

export function isMongoConnected(): boolean {
  return !!cached.conn && mongoose.connection.readyState === 1;
}

export function getMongoStatus(): {
  connected: boolean;
  lastError: string | null;
  cooldownActive: boolean;
} {
  const connected = isMongoConnected();
  const cooldownActive = !connected && Date.now() - cached.lastFailedTime < RETRY_COOLDOWN_MS;
  return {
    connected,
    lastError: cached.lastError,
    cooldownActive,
  };
}
