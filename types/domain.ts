export type ProfileRole = "person_a" | "person_b";
export type MediaType = "image" | "video";
export type BucketStatus = "todo" | "planned" | "done";

export interface AppSettings {
  user_id: string;
  couple_title: string;
  tagline: string | null;
  quote: string | null;
  hero_image_url: string | null;
  public_slug: string | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface RelationshipInfo {
  id: string;
  user_id: string;
  start_date: string | null;
  first_meet_date: string | null;
  story: string | null;
  love_quote: string | null;
  location_label: string | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  user_id: string;
  role: ProfileRole;
  full_name: string;
  nickname: string | null;
  birth_date: string | null;
  description: string | null;
  hobbies: string[] | null;
  favorite_thing: string | null;
  adorable_habit: string | null;
  avatar_url: string | null;
  is_public: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Anniversary {
  id: string;
  user_id: string;
  title: string;
  event_date: string;
  note: string | null;
  is_public: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface TimelineEvent {
  id: string;
  user_id: string;
  title: string;
  event_date: string;
  description: string | null;
  media_url: string | null;
  media_bucket_path: string | null;
  tag: string | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface GalleryItem {
  id: string;
  user_id: string;
  title: string | null;
  caption: string | null;
  media_url: string;
  media_bucket_path: string | null;
  media_type: MediaType;
  album: string | null;
  taken_at: string | null;
  is_favorite: boolean;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface JournalEntry {
  id: string;
  user_id: string;
  title: string;
  content: string;
  mood: string | null;
  written_by: string | null;
  entry_date: string;
  attachment_url: string | null;
  attachment_bucket_path: string | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface Letter {
  id: string;
  user_id: string;
  title: string;
  content: string;
  sender_name: string | null;
  entry_date: string;
  attachment_url: string | null;
  attachment_bucket_path: string | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface PlaceVisited {
  id: string;
  user_id: string;
  place_name: string;
  city: string | null;
  visited_at: string | null;
  description: string | null;
  image_url: string | null;
  image_bucket_path: string | null;
  is_memorable: boolean;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface BucketListItem {
  id: string;
  user_id: string;
  title: string;
  note: string | null;
  status: BucketStatus;
  target_date: string | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface SpaceData {
  settings: AppSettings | null;
  relationship: RelationshipInfo | null;
  profiles: Profile[];
  anniversaries: Anniversary[];
  timeline: TimelineEvent[];
  gallery: GalleryItem[];
  journals: JournalEntry[];
  letters: Letter[];
  places: PlaceVisited[];
  bucketList: BucketListItem[];
}
