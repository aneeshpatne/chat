"use server";
import { v4 as uuidv4 } from "uuid";
export function createSession() {
  const sessionId = uuidv4();
  return sessionId;
}
