import { redirect } from "next/navigation";

import { DashboardClient } from "@/components/dashboard/dashboard-client";
import { fetchSpaceData } from "@/lib/queries";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();

  if (!claims?.claims?.sub) {
    redirect("/login");
  }

  const userId = claims.claims.sub;
  const [{ data: userResponse }, spaceData] = await Promise.all([
    supabase.auth.getUser(),
    fetchSpaceData(supabase, userId)
  ]);

  return (
    <DashboardClient
      userId={userId}
      userEmail={userResponse.user?.email ?? null}
      initialData={spaceData}
    />
  );
}
