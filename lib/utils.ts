import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(value?: string | null, options?: Intl.DateTimeFormatOptions) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    ...options
  }).format(date);
}

export function getDaysTogether(value?: string | null) {
  if (!value) return 0;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 0;
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function buildPublicPath(userId: string, folder: string, fileName: string) {
  const ext = fileName.includes(".") ? fileName.split(".").pop() : "";
  const safeExt = ext ? `.${ext.toLowerCase()}` : "";
  return `${userId}/${folder}/${crypto.randomUUID()}${safeExt}`;
}

export function initials(name?: string | null) {
  if (!name) return "♡";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export const MOODS = ["Hạnh phúc", "Nhớ nhung", "Bình yên", "Tự hào", "Biết ơn", "Dễ thương"] as const;
export const BUCKET_STATUSES = ["todo", "planned", "done"] as const;
export const PROFILE_ROLES = ["person_a", "person_b"] as const;
export const MEDIA_TYPES = ["image", "video"] as const;
