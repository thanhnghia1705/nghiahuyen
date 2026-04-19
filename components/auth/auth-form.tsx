"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Heart, LoaderCircle, Lock, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const authSchema = z.object({
  email: z.email("Email chưa đúng định dạng"),
  password: z.string().min(6, "Mật khẩu cần ít nhất 6 ký tự")
});

type AuthValues = z.infer<typeof authSchema>;

export function AuthForm() {
  const router = useRouter();
  const supabase = React.useMemo(() => createClient(), []);
  const [mode, setMode] = React.useState<"sign-in" | "sign-up">("sign-in");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<AuthValues>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const onSubmit = async (values: AuthValues) => {
    setIsSubmitting(true);

    try {
      if (mode === "sign-up") {
        const { error } = await supabase.auth.signUp({
          email: values.email,
          password: values.password,
          options: {
            emailRedirectTo:
              typeof window !== "undefined" ? `${window.location.origin}/auth/callback` : undefined
          }
        });

        if (error) throw error;

        toast.success("Đăng ký thành công", {
          description:
            "Nếu dự án Supabase của bạn đang bật xác thực email, hãy kiểm tra hộp thư để xác nhận."
        });
        setMode("sign-in");
        return;
      }

      const { error } = await supabase.auth.signInWithPassword(values);

      if (error) throw error;

      toast.success("Đăng nhập thành công");
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      toast.error("Có lỗi xảy ra", {
        description: error instanceof Error ? error.message : "Vui lòng thử lại."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-lg rounded-[32px] p-7 md:p-9">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blush-100 text-blush-700">
          <Heart className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-blush-700">
            Love Memory Space
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
            {mode === "sign-in" ? "Đăng nhập để quản lý kỷ niệm" : "Tạo tài khoản cho không gian riêng"}
          </h1>
        </div>
      </div>

      <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
        <div>
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input id="email" type="email" placeholder="you@example.com" className="pl-11" {...form.register("email")} />
          </div>
          {form.formState.errors.email ? (
            <p className="mt-2 text-sm text-rose-600">{form.formState.errors.email.message}</p>
          ) : null}
        </div>

        <div>
          <Label htmlFor="password">Mật khẩu</Label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input id="password" type="password" placeholder="••••••••" className="pl-11" {...form.register("password")} />
          </div>
          {form.formState.errors.password ? (
            <p className="mt-2 text-sm text-rose-600">{form.formState.errors.password.message}</p>
          ) : null}
        </div>

        <Button className="w-full" disabled={isSubmitting} type="submit">
          {isSubmitting ? (
            <>
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
              Đang xử lý...
            </>
          ) : mode === "sign-in" ? (
            "Đăng nhập"
          ) : (
            "Tạo tài khoản"
          )}
        </Button>
      </form>

      <div className="mt-5 flex items-center justify-between rounded-2xl border border-white/70 bg-white/70 p-4 text-sm text-slate-600">
        <span>
          {mode === "sign-in" ? "Chưa có tài khoản?" : "Đã có tài khoản rồi?"}
        </span>
        <button
          type="button"
          className="font-semibold text-blush-700"
          onClick={() => setMode((current) => (current === "sign-in" ? "sign-up" : "sign-in"))}
        >
          {mode === "sign-in" ? "Đăng ký" : "Đăng nhập"}
        </button>
      </div>
    </Card>
  );
}
