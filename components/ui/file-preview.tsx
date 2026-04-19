"use client";

import Image from "next/image";
import * as React from "react";
import { FileImage, Film } from "lucide-react";

type FilePreviewProps = {
  file?: File | null;
  existingUrl?: string | null;
  alt: string;
  className?: string;
};

export function FilePreview({ file, existingUrl, alt, className }: FilePreviewProps) {
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(existingUrl ?? null);

  React.useEffect(() => {
    if (!file) {
      setPreviewUrl(existingUrl ?? null);
      return;
    }

    const nextUrl = URL.createObjectURL(file);
    setPreviewUrl(nextUrl);

    return () => URL.revokeObjectURL(nextUrl);
  }, [existingUrl, file]);

  if (!previewUrl) {
    return (
      <div className={className ?? "grid h-32 place-items-center rounded-3xl bg-white/70 text-slate-400"}>
        <FileImage className="h-7 w-7" />
      </div>
    );
  }

  const isVideo = file?.type?.startsWith("video/") || /\.(mp4|webm|mov)$/i.test(previewUrl);

  if (isVideo) {
    return (
      <div className={className ?? "grid h-32 place-items-center rounded-3xl bg-white/70 text-slate-400"}>
        <Film className="h-7 w-7" />
        <video className="hidden" src={previewUrl} />
      </div>
    );
  }

  return (
    <div className={className ?? "relative h-32 overflow-hidden rounded-3xl"}>
      <Image alt={alt} fill src={previewUrl} className="object-cover" sizes="320px" />
    </div>
  );
}
