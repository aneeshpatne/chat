"use server";
import { v4 as uuidv4 } from "uuid";
export async function createSession(): Promise<string> {
  const sessionId = uuidv4();
  return sessionId;
}
