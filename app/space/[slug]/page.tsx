import { notFound } from "next/navigation";

import { SiteHeader } from "@/components/site/site-header";
import { SpacePage } from "@/components/site/space-page";
import { fetchPublicSpaceBySlug } from "@/lib/queries";
import { createClient } from "@/lib/supabase/server";

export default async function PublicSpacePage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();
  const data = await fetchPublicSpaceBySlug(supabase, slug);

  if (!data) {
    notFound();
  }

  return (
    <>
      <SiteHeader loggedIn={false} />
      <SpacePage data={data} />
    </>
  );
}
