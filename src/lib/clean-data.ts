/**
 * Recursively strips `undefined` values from an object.
 *
 * Next.js RSC serialization converts `undefined` to the string `"$undefined"`
 * which breaks Zod validation on the server. This utility removes all `undefined`
 * keys so they are simply absent from the serialized payload.
 */
export function stripUndefined<T>(obj: T): T {
  if (obj === null || obj === undefined) return obj;
  if (Array.isArray(obj)) return obj.map(stripUndefined) as T;
  if (typeof obj !== "object") return obj;

  const clean: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
    if (value === undefined) continue;
    clean[key] = typeof value === "object" && value !== null
      ? stripUndefined(value)
      : value;
  }
  return clean as T;
}
