import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-4 py-12">
      <div className="section-shell w-full p-8 text-center md:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-blush-700">404</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900">
          Không tìm thấy trang này
        </h1>
        <p className="mt-4 text-sm leading-8 text-slate-600">
          Link public có thể chưa được bật hoặc public slug chưa đúng.
        </p>
        <div className="mt-6">
          <Link href="/">
            <Button>Quay về trang chính</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
