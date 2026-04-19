"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const router = useRouter();

  return (
    <Button
      variant="secondary"
      onClick={async () => {
        const supabase = createClient();
        const { error } = await supabase.auth.signOut();

        if (error) {
          toast.error("Không thể đăng xuất", {
            description: error.message
          });
          return;
        }

        router.push("/");
        router.refresh();
      }}
    >
      <LogOut className="mr-2 h-4 w-4" />
      Đăng xuất
    </Button>
  );
}
