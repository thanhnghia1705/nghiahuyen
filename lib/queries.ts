import type { SupabaseClient } from "@supabase/supabase-js";

import type { SpaceData } from "@/types/domain";

export async function fetchSpaceData(
  supabase: SupabaseClient,
  userId: string,
  publicOnly = false
): Promise<SpaceData> {
  const settingsQuery = supabase
    .from("app_settings")
    .select("*")
    .eq("user_id", userId)
    .single();

  const relationshipQuery = supabase
    .from("relationship_info")
    .select("*")
    .eq("user_id", userId)
    .single();

  const profilesQuery = supabase
    .from("profiles")
    .select("*")
    .eq("user_id", userId)
    .order("sort_order", { ascending: true });

  const anniversariesQuery = supabase
    .from("anniversaries")
    .select("*")
    .eq("user_id", userId)
    .order("event_date", { ascending: true });

  const timelineQuery = supabase
    .from("timeline_events")
    .select("*")
    .eq("user_id", userId)
    .order("event_date", { ascending: false });

  const galleryQuery = supabase
    .from("gallery_items")
    .select("*")
    .eq("user_id", userId)
    .order("taken_at", { ascending: false, nullsFirst: false });

  const journalsQuery = supabase
    .from("journal_entries")
    .select("*")
    .eq("user_id", userId)
    .order("entry_date", { ascending: false });

  const lettersQuery = supabase
    .from("letters")
    .select("*")
    .eq("user_id", userId)
    .order("entry_date", { ascending: false });

  const placesQuery = supabase
    .from("places_visited")
    .select("*")
    .eq("user_id", userId)
    .order("visited_at", { ascending: false, nullsFirst: false });

  const bucketQuery = supabase
    .from("bucket_list_items")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (publicOnly) {
    settingsQuery.eq("is_public", true);
    relationshipQuery.eq("is_public", true);
    profilesQuery.eq("is_public", true);
    anniversariesQuery.eq("is_public", true);
    timelineQuery.eq("is_public", true);
    galleryQuery.eq("is_public", true);
    journalsQuery.eq("is_public", true);
    lettersQuery.eq("is_public", true);
    placesQuery.eq("is_public", true);
    bucketQuery.eq("is_public", true);
  }

  const [
    settings,
    relationship,
    profiles,
    anniversaries,
    timeline,
    gallery,
    journals,
    letters,
    places,
    bucketList
  ] = await Promise.all([
    settingsQuery,
    relationshipQuery,
    profilesQuery,
    anniversariesQuery,
    timelineQuery,
    galleryQuery,
    journalsQuery,
    lettersQuery,
    placesQuery,
    bucketQuery
  ]);

  return {
    settings: settings.data ?? null,
    relationship: relationship.data ?? null,
    profiles: profiles.data ?? [],
    anniversaries: anniversaries.data ?? [],
    timeline: timeline.data ?? [],
    gallery: gallery.data ?? [],
    journals: journals.data ?? [],
    letters: letters.data ?? [],
    places: places.data ?? [],
    bucketList: bucketList.data ?? []
  };
}

export async function fetchPublicSpaceBySlug(
  supabase: SupabaseClient,
  slug: string
): Promise<SpaceData | null> {
  const settingsResponse = await supabase
    .from("app_settings")
    .select("*")
    .eq("public_slug", slug)
    .eq("is_public", true)
    .single();

  if (!settingsResponse.data) return null;

  const data = await fetchSpaceData(supabase, settingsResponse.data.user_id, true);
  return data;
}
