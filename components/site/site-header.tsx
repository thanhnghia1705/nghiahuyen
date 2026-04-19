import Link from "next/link";
import { Heart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SiteHeader({
  loggedIn,
  className
}: {
  loggedIn: boolean;
  className?: string;
}) {
  return (
    <header className={cn("sticky top-0 z-40 border-b border-white/40 bg-white/50 backdrop-blur-xl", className)}>
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-6 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blush-200 to-blush-50 text-blush-700 shadow-soft">
            <Heart className="h-5 w-5" />
          </div>
          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.24em] text-blush-700">
              Love Memory Space
            </div>
            <div className="text-sm text-slate-600">Private couple memory app</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-slate-600 md:flex">
          <a href="#story">Câu chuyện</a>
          <a href="#timeline">Kỷ niệm</a>
          <a href="#gallery">Gallery</a>
          <a href="#dashboard-preview">Dashboard</a>
        </nav>

        <div className="flex items-center gap-3">
          {loggedIn ? (
            <Link href="/dashboard">
              <Button variant="secondary">Mở dashboard</Button>
            </Link>
          ) : (
            <Link href="/login">
              <Button>Đăng nhập</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
