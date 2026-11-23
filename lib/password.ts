import { randomBytes, scryptSync, timingSafeEqual } from "crypto";

const PASSWORD_HASH_LENGTH = 64;

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, PASSWORD_HASH_LENGTH).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, passwordHash?: string | null) {
  if (!passwordHash) {
    return false;
  }

  const [salt, storedHash] = passwordHash.split(":");
  if (!salt || !storedHash) {
    return false;
  }

  const computedHash = scryptSync(password, salt, PASSWORD_HASH_LENGTH);
  const storedHashBuffer = Buffer.from(storedHash, "hex");

  if (storedHashBuffer.length !== computedHash.length) {
    return false;
  }

  return timingSafeEqual(storedHashBuffer, computedHash);
}
