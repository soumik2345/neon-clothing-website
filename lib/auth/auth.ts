import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

const JWT_SECRET_STRING = process.env.JWT_SECRET || "neon-thrifted-secret-key-super-secure-2026-auth";
const JWT_SECRET = new TextEncoder().encode(JWT_SECRET_STRING);

export interface TokenPayload {
  userId: string;
  email: string;
  name: string;
  role: "admin" | "customer";
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password: string, hashed: string): Promise<boolean> {
  return bcrypt.compare(password, hashed);
}

export async function signToken(payload: TokenPayload, expiresIn = "7d"): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as TokenPayload;
  } catch {
    return null;
  }
}

export async function getCurrentUser(): Promise<TokenPayload | null> {
  try {
    const cookieStore = await cookies();
    // Check admin token first or customer token
    const adminToken = cookieStore.get("neon_admin_token")?.value;
    if (adminToken) {
      const decoded = await verifyToken(adminToken);
      if (decoded && decoded.role === "admin") return decoded;
    }

    const userToken = cookieStore.get("neon_user_token")?.value;
    if (userToken) {
      const decoded = await verifyToken(userToken);
      if (decoded) return decoded;
    }

    return null;
  } catch {
    return null;
  }
}

export async function getAdminSession(): Promise<TokenPayload | null> {
  try {
    const cookieStore = await cookies();
    const adminToken = cookieStore.get("neon_admin_token")?.value;
    if (!adminToken) return null;

    const decoded = await verifyToken(adminToken);
    if (decoded && decoded.role === "admin") {
      return decoded;
    }
    return null;
  } catch {
    return null;
  }
}
