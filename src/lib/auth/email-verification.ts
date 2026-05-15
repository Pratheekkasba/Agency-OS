/** Agency accounts must verify email; clients use Access ID + login instead. */
export function requiresEmailVerification(role?: string | null): boolean {
  if (!role) return false;
  return role !== "client";
}
