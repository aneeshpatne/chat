import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

// More robust handling of the private key
const getPrivateKey = () => {
  const key = process.env.FIREBASE_PRIVATE_KEY;

  // If the key already contains newlines
  if (key?.includes("\n")) {
    return key;
  }

  // If the key has encoded newlines
  if (key?.includes("\\n")) {
    return key.replace(/\\n/g, "\n");
  }

  // If the key is JSON stringified
  if (key?.startsWith('"') && key?.endsWith('"')) {
    return JSON.parse(key);
  }

  return key;
};

const app =
  getApps().length === 0
    ? initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: getPrivateKey(),
        }),
      })
    : undefined;
export const adminAuth = getAuth();
