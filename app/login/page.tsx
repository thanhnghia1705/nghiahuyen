import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";

import { AuthForm } from "@/components/auth/auth-form";
import { createClient } from "@/lib/supabase/server";

export default async function LoginPage() {
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();

  if (claims?.claims?.sub) {
    return (
      <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="section-shell w-full max-w-xl p-8 text-center">
          <Sparkles className="mx-auto mb-4 h-8 w-8 text-blush-700" />
          <h1 className="text-3xl font-semibold text-slate-900">Bạn đã đăng nhập rồi</h1>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Bạn có thể quay lại landing page hoặc mở dashboard để quản lý nội dung.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Link
              href="/"
              className="inline-flex h-11 items-center justify-center rounded-full bg-gradient-to-r from-blush-500 to-blush-700 px-5 text-sm font-semibold text-white shadow-glow"
            >
              Về trang chính
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex h-11 items-center justify-center rounded-full border border-white/70 bg-white/80 px-5 text-sm font-semibold text-slate-900"
            >
              Mở dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-blush-200/40 blur-[90px]" />
      <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-sand-300/20 blur-[90px]" />

      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-10 sm:px-6 lg:flex-row lg:items-center lg:gap-10 lg:px-8">
        <div className="mb-10 flex-1 lg:mb-0">
          <Link href="/" className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600">
            <ArrowLeft className="h-4 w-4" />
            Quay lại landing page
          </Link>
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.32em] text-blush-700">
              Welcome back
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900 md:text-6xl">
              Đăng nhập để bắt đầu lưu kỷ niệm thật trên web app của hai bạn.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-slate-600">
              Sau khi đăng nhập, bạn sẽ có dashboard riêng để upload ảnh/video, thêm timeline, ngày kỷ niệm, nhật ký, thư và mọi dữ liệu sẽ được lưu lại trên Supabase.
            </p>
          </div>
        </div>

        <div className="flex flex-1 justify-center">
          <AuthForm />
        </div>
      </div>
    </div>
  );
}
