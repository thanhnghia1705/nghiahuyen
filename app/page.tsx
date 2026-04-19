import { SiteHeader } from "@/components/site/site-header";
import { SpacePage } from "@/components/site/space-page";
import { demoData } from "@/lib/demo";
import { fetchSpaceData } from "@/lib/queries";
import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();

  if (!claims?.claims?.sub) {
    return (
      <>
        <SiteHeader loggedIn={false} />
        <SpacePage data={demoData} />
      </>
    );
  }

  const userId = claims.claims.sub;
  const data = await fetchSpaceData(supabase, userId);

  return (
    <>
      <SiteHeader loggedIn />
      <SpacePage data={data.settings ? data : demoData} canManage />
    </>
  );
}
