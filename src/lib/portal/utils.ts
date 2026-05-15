export function timestampMs(value: unknown): number {
  if (!value) return 0;
  if (typeof (value as { toMillis?: () => number }).toMillis === "function") {
    return (value as { toMillis: () => number }).toMillis();
  }
  if (typeof (value as { seconds?: number }).seconds === "number") {
    return (value as { seconds: number }).seconds * 1000;
  }
  if (value instanceof Date) return value.getTime();
  const parsed = new Date(value as string).getTime();
  return Number.isNaN(parsed) ? 0 : parsed;
}

export function formatPortalDate(value: unknown): string {
  if (!value) return "—";
  const d =
    typeof (value as { toDate?: () => Date }).toDate === "function"
      ? (value as { toDate: () => Date }).toDate()
      : new Date(value as string);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function parseLines(text: string): string[] {
  return text.split("\n").map((l) => l.trim()).filter(Boolean);
}

/** Agency dashboard stores progress on the client doc — match that source of truth. */
export function resolvePortalProgress(
  clientProgress?: number,
  projectProgress?: number
): number {
  const client = clientProgress ?? 0;
  const project = projectProgress ?? 0;
  if (client > 0) return Math.min(100, Math.max(0, client));
  if (project > 0) return Math.min(100, Math.max(0, project));
  return 0;
}
