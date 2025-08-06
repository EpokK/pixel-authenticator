import * as CryptoJS from "crypto-js";
import { addToCollection, incrementTotalGenerated } from './collection';

export interface TOTPEntry {
  id: string;
  issuer: string;
  accountName: string;
  secret: string;
  algorithm?: string;
  digits?: number;
  period?: number;
}

function base32Decode(base32: string): number[] {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  const cleanBase32 = base32.toUpperCase().replace(/[^A-Z2-7]/g, "");

  let bits = "";
  for (const char of cleanBase32) {
    const index = alphabet.indexOf(char);
    if (index === -1) continue;
    bits += index.toString(2).padStart(5, "0");
  }

  const bytes: number[] = [];
  for (let i = 0; i < bits.length; i += 8) {
    const byte = bits.substr(i, 8);
    if (byte.length === 8) {
      bytes.push(parseInt(byte, 2));
    }
  }

  return bytes;
}

function hmacSha1(key: number[], message: number[]): number[] {
  const keyWordArray = CryptoJS.lib.WordArray.create(new Uint8Array(key));
  const messageWordArray = CryptoJS.lib.WordArray.create(
    new Uint8Array(message)
  );

  const hmac = CryptoJS.HmacSHA1(messageWordArray, keyWordArray);
  const hmacBytes: number[] = [];

  for (let i = 0; i < hmac.words.length; i++) {
    const word = hmac.words[i];
    hmacBytes.push((word >>> 24) & 0xff);
    hmacBytes.push((word >>> 16) & 0xff);
    hmacBytes.push((word >>> 8) & 0xff);
    hmacBytes.push(word & 0xff);
  }

  return hmacBytes.slice(0, 20);
}

function generateTOTP(
  secret: string,
  timeStep: number = 30,
  digits: number = 6
): string {
  const secretBytes = base32Decode(secret);
  const time = Math.floor(Date.now() / 1000);
  const counter = Math.floor(time / timeStep);

  const counterBytes: number[] = [];
  for (let i = 7; i >= 0; i--) {
    counterBytes.push((counter >>> (i * 8)) & 0xff);
  }

  const hmac = hmacSha1(secretBytes, counterBytes);
  const offset = hmac[19] & 0xf;

  const code =
    ((hmac[offset] & 0x7f) << 24) |
    ((hmac[offset + 1] & 0xff) << 16) |
    ((hmac[offset + 2] & 0xff) << 8) |
    (hmac[offset + 3] & 0xff);

  const otp = (code % Math.pow(10, digits)).toString().padStart(digits, "0");
  return otp;
}

export function parseOtpAuthUri(uri: string): TOTPEntry | null {
  try {
    const url = new URL(uri);

    if (url.protocol !== "otpauth:" || url.host !== "totp") {
      return null;
    }

    const pathParts = url.pathname.substring(1).split(":");
    const issuer =
      pathParts.length > 1
        ? pathParts[0]
        : url.searchParams.get("issuer") || "Unknown";
    const accountName = pathParts.length > 1 ? pathParts[1] : pathParts[0];

    const secret = url.searchParams.get("secret");
    if (!secret) {
      return null;
    }

    const algorithm = url.searchParams.get("algorithm") || "SHA1";
    const digits = parseInt(url.searchParams.get("digits") || "6");
    const period = parseInt(url.searchParams.get("period") || "30");

    return {
      id: crypto.randomUUID(),
      issuer,
      accountName,
      secret,
      algorithm,
      digits,
      period,
    };
  } catch {
    return null;
  }
}

export function getTOTPCode(entry: TOTPEntry): string {
  const code = generateTOTP(entry.secret, entry.period || 30, entry.digits || 6);
  
  // Increment total generated counter
  incrementTotalGenerated();
  
  // Check if this is a special sequence and add to collection
  if (isSpecialSequence(code)) {
    addToCollection(code);
  }
  
  return code;
}

export function getTimeRemaining(period: number = 30): number {
  const time = Math.floor(Date.now() / 1000);
  return period - (time % period);
}

export function getProgressPercentage(period: number = 30): number {
  const remaining = getTimeRemaining(period);
  return ((period - remaining) / period) * 100;
}

export function isSpecialSequence(code: string): boolean {
  const patterns = [
    /^123456$/,
    /^654321$/,
    /^111111$/,
    /^222222$/,
    /^333333$/,
    /^444444$/,
    /^555555$/,
    /^666666$/,
    /^777777$/,
    /^888888$/,
    /^999999$/,
    /^000000$/,
    /^012345$/,
    /^543210$/,
    /^123123$/,
    /^321321$/,
    /^112233$/,
    /^332211$/,
    /^121212$/,
    /^212121$/,
    /^123/, // Start with 123
    /^321/, // Start with 321
    /^111/, // Start with 111
    /^222/, // Start with 222
    /^333/, // Start with 333
    /^444/, // Start with 444
    /^555/, // Start with 555
    /^666/, // Start with 666
    /^777/, // Start with 777
    /^888/, // Start with 888
    /^999/, // Start with 999
    /^000/, // Start with 000
    /123$/, // End with 123
    /321$/, // End with 321
    /111$/, // End with 111
    /222$/, // End with 222
    /333$/, // End with 333
    /444$/, // End with 444
    /555$/, // End with 555
    /^666$/, // End with 666
    /^777$/, // End with 777
    /^888$/, // End with 888
    /^999$/, // End with 999
    /^000$/, // End with 000
  ];

  return patterns.some((pattern) => pattern.test(code));
}
