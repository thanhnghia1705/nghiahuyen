import type { SupabaseClient } from "@supabase/supabase-js";

import { buildPublicPath } from "@/lib/utils";

export async function uploadToBucket(args: {
  supabase: SupabaseClient;
  userId: string;
  bucket: "avatars" | "covers" | "memories" | "attachments";
  folder: string;
  file: File;
}) {
  const { supabase, userId, bucket, folder, file } = args;
  const path = buildPublicPath(userId, folder, file.name);

  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    upsert: true,
    cacheControl: "3600",
    contentType: file.type || undefined
  });

  if (error) {
    throw error;
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);

  return {
    bucketPath: path,
    publicUrl: data.publicUrl
  };
}

export async function removeFromBucket(args: {
  supabase: SupabaseClient;
  bucket: "avatars" | "covers" | "memories" | "attachments";
  bucketPath?: string | null;
}) {
  const { supabase, bucket, bucketPath } = args;
  if (!bucketPath) return;

  await supabase.storage.from(bucket).remove([bucketPath]);
}
