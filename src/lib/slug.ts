import { customAlphabet } from "nanoid";

// Create a custom nanoid with URL-friendly characters
const nanoid = customAlphabet(
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  8
);

export function generateSlug(): string {
  return nanoid();
}
