"use client";

import Image from "next/image";
import * as React from "react";
import {
  CalendarHeart,
  Camera,
  Film,
  Heart,
  ImagePlus,
  LoaderCircle,
  MapPinned,
  MessageCircleHeart,
  NotebookPen,
  Settings2,
  Sparkles,
  Trash2
} from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { LogoutButton } from "@/components/auth/logout-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { FilePreview } from "@/components/ui/file-preview";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SectionHeading } from "@/components/ui/section-heading";
import { Textarea } from "@/components/ui/textarea";
import { fetchSpaceData } from "@/lib/queries";
import { createClient } from "@/lib/supabase/client";
import { removeFromBucket, uploadToBucket } from "@/lib/storage";
import {
  BUCKET_STATUSES,
  formatDate,
  MOODS,
  PROFILE_ROLES,
  slugify
} from "@/lib/utils";
import type { SpaceData } from "@/types/domain";

type TabKey =
  | "overview"
  | "relationship"
  | "profiles"
  | "gallery"
  | "timeline"
  | "anniversaries"
  | "journal"
  | "letters"
  | "places"
  | "bucket";

const settingsSchema = z.object({
  couple_title: z.string().min(2, "Nhập tên không gian"),
  public_slug: z.string().min(2, "Nhập slug public"),
  tagline: z.string().optional(),
  quote: z.string().optional(),
  is_public: z.boolean()
});

const relationshipSchema = z.object({
  start_date: z.string().optional(),
  first_meet_date: z.string().optional(),
  story: z.string().optional(),
  love_quote: z.string().optional(),
  location_label: z.string().optional(),
  is_public: z.boolean()
});

const profileSchema = z.object({
  full_name: z.string().min(2, "Nhập họ tên"),
  nickname: z.string().optional(),
  birth_date: z.string().optional(),
  description: z.string().optional(),
  hobbies: z.string().optional(),
  favorite_thing: z.string().optional(),
  adorable_habit: z.string().optional(),
  is_public: z.boolean()
});

const anniversarySchema = z.object({
  title: z.string().min(2, "Nhập tiêu đề"),
  event_date: z.string().min(1, "Chọn ngày"),
  note: z.string().optional(),
  is_public: z.boolean()
});

const timelineSchema = z.object({
  title: z.string().min(2, "Nhập tiêu đề"),
  event_date: z.string().min(1, "Chọn ngày"),
  description: z.string().optional(),
  tag: z.string().optional(),
  is_public: z.boolean()
});

const journalSchema = z.object({
  title: z.string().min(2, "Nhập tiêu đề"),
  content: z.string().min(5, "Nhập nội dung"),
  entry_date: z.string().min(1, "Chọn ngày"),
  mood: z.string().optional(),
  written_by: z.string().optional(),
  is_public: z.boolean()
});

const letterSchema = z.object({
  title: z.string().min(2, "Nhập tiêu đề"),
  content: z.string().min(5, "Nhập nội dung"),
  entry_date: z.string().min(1, "Chọn ngày"),
  sender_name: z.string().optional(),
  is_public: z.boolean()
});

const placeSchema = z.object({
  place_name: z.string().min(2, "Nhập tên địa điểm"),
  city: z.string().optional(),
  visited_at: z.string().optional(),
  description: z.string().optional(),
  is_memorable: z.boolean(),
  is_public: z.boolean()
});

const bucketSchema = z.object({
  title: z.string().min(2, "Nhập nội dung"),
  note: z.string().optional(),
  status: z.enum(BUCKET_STATUSES),
  target_date: z.string().optional(),
  is_public: z.boolean()
});

type SettingsFormState = z.infer<typeof settingsSchema> & {
  heroFile: File | null;
};

type RelationshipFormState = z.infer<typeof relationshipSchema> & {
  id?: string;
};

type ProfileFormState = z.infer<typeof profileSchema> & {
  id?: string;
  avatarFile: File | null;
};

type AnniversaryFormState = z.infer<typeof anniversarySchema> & {
  id?: string;
};

type TimelineFormState = z.infer<typeof timelineSchema> & {
  id?: string;
  file: File | null;
  oldBucketPath?: string | null;
};

type JournalFormState = z.infer<typeof journalSchema> & {
  id?: string;
  file: File | null;
  oldBucketPath?: string | null;
};

type LetterFormState = z.infer<typeof letterSchema> & {
  id?: string;
  file: File | null;
  oldBucketPath?: string | null;
};

type PlaceFormState = z.infer<typeof placeSchema> & {
  id?: string;
  file: File | null;
  oldBucketPath?: string | null;
};

type BucketFormState = z.infer<typeof bucketSchema> & {
  id?: string;
};

function Toggle({
  checked,
  onChange,
  label
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
}) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-3 text-sm text-slate-700">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-4 w-4 rounded border-slate-300 text-blush-600 focus:ring-blush-300"
      />
      {label}
    </label>
  );
}

function FormShell({
  title,
  description,
  children
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="rounded-[28px] p-5 md:p-6">
      <div className="mb-5">
        <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
        <p className="mt-2 text-sm leading-7 text-slate-600">{description}</p>
      </div>
      <div className="grid gap-4">{children}</div>
    </Card>
  );
}

function Field({
  label,
  children
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label>{label}</Label>
      {children}
    </div>
  );
}

export function DashboardClient({
  userId,
  userEmail,
  initialData
}: {
  userId: string;
  userEmail: string | null;
  initialData: SpaceData;
}) {
  const supabase = React.useMemo(() => createClient(), []);
  const [activeTab, setActiveTab] = React.useState<TabKey>("overview");
  const [spaceData, setSpaceData] = React.useState<SpaceData>(initialData);
  const [busyLabel, setBusyLabel] = React.useState<string | null>(null);

  const [settingsForm, setSettingsForm] = React.useState<SettingsFormState>(() => ({
    couple_title: initialData.settings?.couple_title ?? "Love Memory Space",
    tagline: initialData.settings?.tagline ?? "",
    quote: initialData.settings?.quote ?? "",
    public_slug: initialData.settings?.public_slug ?? "couple-space",
    is_public: initialData.settings?.is_public ?? false,
    heroFile: null
  }));

  const [relationshipForm, setRelationshipForm] = React.useState<RelationshipFormState>(() => ({
    id: initialData.relationship?.id,
    start_date: initialData.relationship?.start_date ?? "",
    first_meet_date: initialData.relationship?.first_meet_date ?? "",
    story: initialData.relationship?.story ?? "",
    love_quote: initialData.relationship?.love_quote ?? "",
    location_label: initialData.relationship?.location_label ?? "",
    is_public: initialData.relationship?.is_public ?? true
  }));

  const buildProfileForm = React.useCallback(
    (role: "person_a" | "person_b"): ProfileFormState => {
      const profile = initialData.profiles.find((item) => item.role === role);
      return {
        id: profile?.id,
        full_name: profile?.full_name ?? "",
        nickname: profile?.nickname ?? "",
        birth_date: profile?.birth_date ?? "",
        description: profile?.description ?? "",
        hobbies: profile?.hobbies?.join(", ") ?? "",
        favorite_thing: profile?.favorite_thing ?? "",
        adorable_habit: profile?.adorable_habit ?? "",
        is_public: profile?.is_public ?? true,
        avatarFile: null
      };
    },
    [initialData.profiles]
  );

  const [profileForms, setProfileForms] = React.useState<Record<"person_a" | "person_b", ProfileFormState>>({
    person_a: buildProfileForm("person_a"),
    person_b: buildProfileForm("person_b")
  });

  const emptyAnniversary = React.useMemo<AnniversaryFormState>(
    () => ({
      title: "",
      event_date: "",
      note: "",
      is_public: true
    }),
    []
  );
  const [anniversaryForm, setAnniversaryForm] = React.useState<AnniversaryFormState>(emptyAnniversary);

  const emptyTimeline = React.useMemo<TimelineFormState>(
    () => ({
      title: "",
      event_date: "",
      description: "",
      tag: "",
      is_public: true,
      file: null,
      oldBucketPath: null
    }),
    []
  );
  const [timelineForm, setTimelineForm] = React.useState<TimelineFormState>(emptyTimeline);

  const [galleryFiles, setGalleryFiles] = React.useState<File[]>([]);
  const [galleryMeta, setGalleryMeta] = React.useState({
    title: "",
    caption: "",
    album: "",
    taken_at: "",
    is_favorite: false,
    is_public: true
  });

  const emptyJournal = React.useMemo<JournalFormState>(
    () => ({
      title: "",
      content: "",
      entry_date: new Date().toISOString().slice(0, 10),
      mood: "",
      written_by: "",
      is_public: false,
      file: null,
      oldBucketPath: null
    }),
    []
  );
  const [journalForm, setJournalForm] = React.useState<JournalFormState>(emptyJournal);

  const emptyLetter = React.useMemo<LetterFormState>(
    () => ({
      title: "",
      content: "",
      entry_date: new Date().toISOString().slice(0, 10),
      sender_name: "",
      is_public: false,
      file: null,
      oldBucketPath: null
    }),
    []
  );
  const [letterForm, setLetterForm] = React.useState<LetterFormState>(emptyLetter);

  const emptyPlace = React.useMemo<PlaceFormState>(
    () => ({
      place_name: "",
      city: "",
      visited_at: "",
      description: "",
      is_memorable: true,
      is_public: true,
      file: null,
      oldBucketPath: null
    }),
    []
  );
  const [placeForm, setPlaceForm] = React.useState<PlaceFormState>(emptyPlace);

  const emptyBucket = React.useMemo<BucketFormState>(
    () => ({
      title: "",
      note: "",
      status: "todo",
      target_date: "",
      is_public: true
    }),
    []
  );
  const [bucketForm, setBucketForm] = React.useState<BucketFormState>(emptyBucket);

  const refreshData = React.useCallback(async () => {
    const fresh = await fetchSpaceData(supabase, userId);
    setSpaceData(fresh);

    setSettingsForm((current) => ({
      ...current,
      couple_title: fresh.settings?.couple_title ?? current.couple_title,
      tagline: fresh.settings?.tagline ?? "",
      quote: fresh.settings?.quote ?? "",
      public_slug: fresh.settings?.public_slug ?? current.public_slug,
      is_public: fresh.settings?.is_public ?? current.is_public,
      heroFile: null
    }));

    setRelationshipForm({
      id: fresh.relationship?.id,
      start_date: fresh.relationship?.start_date ?? "",
      first_meet_date: fresh.relationship?.first_meet_date ?? "",
      story: fresh.relationship?.story ?? "",
      love_quote: fresh.relationship?.love_quote ?? "",
      location_label: fresh.relationship?.location_label ?? "",
      is_public: fresh.relationship?.is_public ?? true
    });

    setProfileForms({
      person_a: {
        id: fresh.profiles.find((item) => item.role === "person_a")?.id,
        full_name: fresh.profiles.find((item) => item.role === "person_a")?.full_name ?? "",
        nickname: fresh.profiles.find((item) => item.role === "person_a")?.nickname ?? "",
        birth_date: fresh.profiles.find((item) => item.role === "person_a")?.birth_date ?? "",
        description: fresh.profiles.find((item) => item.role === "person_a")?.description ?? "",
        hobbies: fresh.profiles.find((item) => item.role === "person_a")?.hobbies?.join(", ") ?? "",
        favorite_thing: fresh.profiles.find((item) => item.role === "person_a")?.favorite_thing ?? "",
        adorable_habit: fresh.profiles.find((item) => item.role === "person_a")?.adorable_habit ?? "",
        is_public: fresh.profiles.find((item) => item.role === "person_a")?.is_public ?? true,
        avatarFile: null
      },
      person_b: {
        id: fresh.profiles.find((item) => item.role === "person_b")?.id,
        full_name: fresh.profiles.find((item) => item.role === "person_b")?.full_name ?? "",
        nickname: fresh.profiles.find((item) => item.role === "person_b")?.nickname ?? "",
        birth_date: fresh.profiles.find((item) => item.role === "person_b")?.birth_date ?? "",
        description: fresh.profiles.find((item) => item.role === "person_b")?.description ?? "",
        hobbies: fresh.profiles.find((item) => item.role === "person_b")?.hobbies?.join(", ") ?? "",
        favorite_thing: fresh.profiles.find((item) => item.role === "person_b")?.favorite_thing ?? "",
        adorable_habit: fresh.profiles.find((item) => item.role === "person_b")?.adorable_habit ?? "",
        is_public: fresh.profiles.find((item) => item.role === "person_b")?.is_public ?? true,
        avatarFile: null
      }
    });
  }, [supabase, userId]);

  const runTask = async (label: string, task: () => Promise<void>) => {
    setBusyLabel(label);
    try {
      await task();
      await refreshData();
      toast.success(`${label} thành công`);
    } catch (error) {
      toast.error(`Không thể ${label.toLowerCase()}`, {
        description: error instanceof Error ? error.message : "Vui lòng thử lại."
      });
    } finally {
      setBusyLabel(null);
    }
  };

  const createStarterSpace = async () => {
    await runTask("Tạo không gian mẫu", async () => {
      const slug = slugify(settingsForm.public_slug || `space-${Date.now()}`);

      await supabase.from("app_settings").upsert({
        user_id: userId,
        couple_title: settingsForm.couple_title || "Love Memory Space",
        tagline: settingsForm.tagline || "Một nơi để lưu mọi điều dễ thương của hai đứa",
        quote: settingsForm.quote || "Chúng ta vẫn đang tiếp tục viết câu chuyện này mỗi ngày.",
        public_slug: slug,
        is_public: settingsForm.is_public
      });

      await supabase.from("relationship_info").upsert({
        user_id: userId,
        start_date: relationshipForm.start_date || null,
        first_meet_date: relationshipForm.first_meet_date || null,
        story: relationshipForm.story || null,
        love_quote: relationshipForm.love_quote || null,
        location_label: relationshipForm.location_label || null,
        is_public: relationshipForm.is_public
      });

      const profileResponses = await Promise.all(
        PROFILE_ROLES.map((role, index) =>
          supabase.from("profiles").upsert({
            user_id: userId,
            role,
            full_name:
              role === "person_a"
                ? profileForms.person_a.full_name || "Người thương 1"
                : profileForms.person_b.full_name || "Người thương 2",
            nickname:
              role === "person_a" ? profileForms.person_a.nickname || null : profileForms.person_b.nickname || null,
            birth_date:
              role === "person_a" ? profileForms.person_a.birth_date || null : profileForms.person_b.birth_date || null,
            description:
              role === "person_a"
                ? profileForms.person_a.description || null
                : profileForms.person_b.description || null,
            hobbies:
              role === "person_a"
                ? splitTags(profileForms.person_a.hobbies)
                : splitTags(profileForms.person_b.hobbies),
            favorite_thing:
              role === "person_a"
                ? profileForms.person_a.favorite_thing || null
                : profileForms.person_b.favorite_thing || null,
            adorable_habit:
              role === "person_a"
                ? profileForms.person_a.adorable_habit || null
                : profileForms.person_b.adorable_habit || null,
            is_public: role === "person_a" ? profileForms.person_a.is_public : profileForms.person_b.is_public,
            sort_order: index + 1
          })
        )
      );

      const firstProfileError = profileResponses.find((response) => response.error)?.error;
      if (firstProfileError) throw firstProfileError;
    });
  };

  const saveSettings = async () => {
    const parsed = settingsSchema.safeParse({
      couple_title: settingsForm.couple_title,
      public_slug: slugify(settingsForm.public_slug),
      tagline: settingsForm.tagline,
      quote: settingsForm.quote,
      is_public: settingsForm.is_public
    });

    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Kiểm tra lại dữ liệu");
      return;
    }

    await runTask("Lưu cài đặt", async () => {
      let heroPayload: { hero_image_url?: string | null } = {};

      if (settingsForm.heroFile) {
        const upload = await uploadToBucket({
          supabase,
          userId,
          bucket: "covers",
          folder: "hero",
          file: settingsForm.heroFile
        });

        if (spaceData.settings?.hero_image_url && spaceData.settings.hero_image_url.includes("/storage/v1/object/public/covers/")) {
          await removeFromBucket({
            supabase,
            bucket: "covers",
            bucketPath: extractBucketPath(spaceData.settings.hero_image_url, "covers")
          });
        }

        heroPayload.hero_image_url = upload.publicUrl;
      }

      const { error } = await supabase.from("app_settings").upsert({
        user_id: userId,
        couple_title: parsed.data.couple_title,
        tagline: parsed.data.tagline || null,
        quote: parsed.data.quote || null,
        public_slug: parsed.data.public_slug,
        is_public: parsed.data.is_public,
        ...heroPayload
      });

      if (error) throw error;
      setSettingsForm((current) => ({ ...current, heroFile: null, public_slug: parsed.data.public_slug }));
    });
  };

  const saveRelationship = async () => {
    const parsed = relationshipSchema.safeParse(relationshipForm);

    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Kiểm tra lại dữ liệu");
      return;
    }

    await runTask("Lưu câu chuyện", async () => {
      const { error } = await supabase.from("relationship_info").upsert({
        id: relationshipForm.id,
        user_id: userId,
        start_date: parsed.data.start_date || null,
        first_meet_date: parsed.data.first_meet_date || null,
        story: parsed.data.story || null,
        love_quote: parsed.data.love_quote || null,
        location_label: parsed.data.location_label || null,
        is_public: parsed.data.is_public
      });

      if (error) throw error;
    });
  };

  const saveProfile = async (role: "person_a" | "person_b") => {
    const formState = profileForms[role];
    const parsed = profileSchema.safeParse(formState);

    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Kiểm tra lại dữ liệu hồ sơ");
      return;
    }

    await runTask(`Lưu hồ sơ ${role === "person_a" ? "người 1" : "người 2"}`, async () => {
      let avatarPayload: { avatar_url?: string | null } = {};
      const existing = spaceData.profiles.find((item) => item.role === role);

      if (formState.avatarFile) {
        const upload = await uploadToBucket({
          supabase,
          userId,
          bucket: "avatars",
          folder: role,
          file: formState.avatarFile
        });

        if (existing?.avatar_url) {
          await removeFromBucket({
            supabase,
            bucket: "avatars",
            bucketPath: extractBucketPath(existing.avatar_url, "avatars")
          });
        }

        avatarPayload.avatar_url = upload.publicUrl;
      }

      const { error } = await supabase.from("profiles").upsert({
        id: formState.id,
        user_id: userId,
        role,
        full_name: parsed.data.full_name,
        nickname: parsed.data.nickname || null,
        birth_date: parsed.data.birth_date || null,
        description: parsed.data.description || null,
        hobbies: splitTags(parsed.data.hobbies),
        favorite_thing: parsed.data.favorite_thing || null,
        adorable_habit: parsed.data.adorable_habit || null,
        is_public: parsed.data.is_public,
        sort_order: role === "person_a" ? 1 : 2,
        ...avatarPayload
      });

      if (error) throw error;
      setProfileForms((current) => ({
        ...current,
        [role]: {
          ...current[role],
          avatarFile: null
        }
      }));
    });
  };

  const saveAnniversary = async () => {
    const parsed = anniversarySchema.safeParse(anniversaryForm);

    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Kiểm tra lại ngày kỷ niệm");
      return;
    }

    await runTask(anniversaryForm.id ? "Cập nhật ngày kỷ niệm" : "Thêm ngày kỷ niệm", async () => {
      const { error } = await supabase.from("anniversaries").upsert({
        id: anniversaryForm.id,
        user_id: userId,
        title: parsed.data.title,
        event_date: parsed.data.event_date,
        note: parsed.data.note || null,
        is_public: parsed.data.is_public
      });

      if (error) throw error;
      setAnniversaryForm(emptyAnniversary);
    });
  };

  const saveTimeline = async () => {
    const parsed = timelineSchema.safeParse(timelineForm);

    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Kiểm tra lại cột mốc");
      return;
    }

    await runTask(timelineForm.id ? "Cập nhật cột mốc" : "Thêm cột mốc", async () => {
      let mediaPayload: { media_url?: string | null; media_bucket_path?: string | null } = {};

      if (timelineForm.file) {
        const upload = await uploadToBucket({
          supabase,
          userId,
          bucket: "memories",
          folder: "timeline",
          file: timelineForm.file
        });

        if (timelineForm.oldBucketPath) {
          await removeFromBucket({
            supabase,
            bucket: "memories",
            bucketPath: timelineForm.oldBucketPath
          });
        }

        mediaPayload = {
          media_url: upload.publicUrl,
          media_bucket_path: upload.bucketPath
        };
      }

      const { error } = await supabase.from("timeline_events").upsert({
        id: timelineForm.id,
        user_id: userId,
        title: parsed.data.title,
        event_date: parsed.data.event_date,
        description: parsed.data.description || null,
        tag: parsed.data.tag || null,
        is_public: parsed.data.is_public,
        ...mediaPayload
      });

      if (error) throw error;
      setTimelineForm(emptyTimeline);
    });
  };

  const saveGallery = async () => {
    if (galleryFiles.length === 0) {
      toast.error("Hãy chọn ít nhất một ảnh hoặc video");
      return;
    }

    await runTask("Upload gallery", async () => {
      const payloads = await Promise.all(
        galleryFiles.map(async (file) => {
          const upload = await uploadToBucket({
            supabase,
            userId,
            bucket: "memories",
            folder: "gallery",
            file
          });

          return {
            user_id: userId,
            title: galleryMeta.title || file.name,
            caption: galleryMeta.caption || null,
            media_url: upload.publicUrl,
            media_bucket_path: upload.bucketPath,
            media_type: file.type.startsWith("video/") ? "video" : "image",
            album: galleryMeta.album || null,
            taken_at: galleryMeta.taken_at ? new Date(galleryMeta.taken_at).toISOString() : null,
            is_favorite: galleryMeta.is_favorite,
            is_public: galleryMeta.is_public
          };
        })
      );

      const { error } = await supabase.from("gallery_items").insert(payloads);

      if (error) throw error;
      setGalleryFiles([]);
      setGalleryMeta({
        title: "",
        caption: "",
        album: "",
        taken_at: "",
        is_favorite: false,
        is_public: true
      });
    });
  };

  const saveJournal = async () => {
    const parsed = journalSchema.safeParse(journalForm);

    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Kiểm tra lại nhật ký");
      return;
    }

    await runTask(journalForm.id ? "Cập nhật nhật ký" : "Thêm nhật ký", async () => {
      let attachmentPayload: { attachment_url?: string | null; attachment_bucket_path?: string | null } = {};

      if (journalForm.file) {
        const upload = await uploadToBucket({
          supabase,
          userId,
          bucket: "attachments",
          folder: "journal",
          file: journalForm.file
        });

        if (journalForm.oldBucketPath) {
          await removeFromBucket({
            supabase,
            bucket: "attachments",
            bucketPath: journalForm.oldBucketPath
          });
        }

        attachmentPayload = {
          attachment_url: upload.publicUrl,
          attachment_bucket_path: upload.bucketPath
        };
      }

      const { error } = await supabase.from("journal_entries").upsert({
        id: journalForm.id,
        user_id: userId,
        title: parsed.data.title,
        content: parsed.data.content,
        mood: parsed.data.mood || null,
        written_by: parsed.data.written_by || null,
        entry_date: parsed.data.entry_date,
        is_public: parsed.data.is_public,
        ...attachmentPayload
      });

      if (error) throw error;
      setJournalForm(emptyJournal);
    });
  };

  const saveLetter = async () => {
    const parsed = letterSchema.safeParse(letterForm);

    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Kiểm tra lại thư");
      return;
    }

    await runTask(letterForm.id ? "Cập nhật thư" : "Thêm thư", async () => {
      let attachmentPayload: { attachment_url?: string | null; attachment_bucket_path?: string | null } = {};

      if (letterForm.file) {
        const upload = await uploadToBucket({
          supabase,
          userId,
          bucket: "attachments",
          folder: "letters",
          file: letterForm.file
        });

        if (letterForm.oldBucketPath) {
          await removeFromBucket({
            supabase,
            bucket: "attachments",
            bucketPath: letterForm.oldBucketPath
          });
        }

        attachmentPayload = {
          attachment_url: upload.publicUrl,
          attachment_bucket_path: upload.bucketPath
        };
      }

      const { error } = await supabase.from("letters").upsert({
        id: letterForm.id,
        user_id: userId,
        title: parsed.data.title,
        content: parsed.data.content,
        sender_name: parsed.data.sender_name || null,
        entry_date: parsed.data.entry_date,
        is_public: parsed.data.is_public,
        ...attachmentPayload
      });

      if (error) throw error;
      setLetterForm(emptyLetter);
    });
  };

  const savePlace = async () => {
    const parsed = placeSchema.safeParse(placeForm);

    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Kiểm tra lại địa điểm");
      return;
    }

    await runTask(placeForm.id ? "Cập nhật địa điểm" : "Thêm địa điểm", async () => {
      let imagePayload: { image_url?: string | null; image_bucket_path?: string | null } = {};

      if (placeForm.file) {
        const upload = await uploadToBucket({
          supabase,
          userId,
          bucket: "memories",
          folder: "places",
          file: placeForm.file
        });

        if (placeForm.oldBucketPath) {
          await removeFromBucket({
            supabase,
            bucket: "memories",
            bucketPath: placeForm.oldBucketPath
          });
        }

        imagePayload = {
          image_url: upload.publicUrl,
          image_bucket_path: upload.bucketPath
        };
      }

      const { error } = await supabase.from("places_visited").upsert({
        id: placeForm.id,
        user_id: userId,
        place_name: parsed.data.place_name,
        city: parsed.data.city || null,
        visited_at: parsed.data.visited_at || null,
        description: parsed.data.description || null,
        is_memorable: parsed.data.is_memorable,
        is_public: parsed.data.is_public,
        ...imagePayload
      });

      if (error) throw error;
      setPlaceForm(emptyPlace);
    });
  };

  const saveBucketItem = async () => {
    const parsed = bucketSchema.safeParse(bucketForm);

    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Kiểm tra lại bucket list");
      return;
    }

    await runTask(bucketForm.id ? "Cập nhật bucket list" : "Thêm bucket list", async () => {
      const { error } = await supabase.from("bucket_list_items").upsert({
        id: bucketForm.id,
        user_id: userId,
        title: parsed.data.title,
        note: parsed.data.note || null,
        status: parsed.data.status,
        target_date: parsed.data.target_date || null,
        is_public: parsed.data.is_public
      });

      if (error) throw error;
      setBucketForm(emptyBucket);
    });
  };

  const deleteRow = async (table: string, id: string, label: string, bucket?: { bucket: "avatars" | "covers" | "memories" | "attachments"; path?: string | null }) => {
    if (!window.confirm(`Bạn có chắc muốn xóa ${label}?`)) return;

    await runTask(`Xóa ${label}`, async () => {
      if (bucket?.path) {
        await removeFromBucket({
          supabase,
          bucket: bucket.bucket,
          bucketPath: bucket.path
        });
      }

      const { error } = await supabase.from(table).delete().eq("id", id);
      if (error) throw error;
    });
  };

  const publicPath = spaceData.settings?.public_slug
    ? `/space/${spaceData.settings.public_slug}`
    : null;

  const tabs: { key: TabKey; label: string; icon: React.ElementType }[] = [
    { key: "overview", label: "Tổng quan", icon: Sparkles },
    { key: "relationship", label: "Cài đặt chung", icon: Settings2 },
    { key: "profiles", label: "Hồ sơ 2 người", icon: Heart },
    { key: "gallery", label: "Gallery", icon: ImagePlus },
    { key: "timeline", label: "Timeline", icon: CalendarHeart },
    { key: "anniversaries", label: "Kỷ niệm", icon: CalendarHeart },
    { key: "journal", label: "Nhật ký", icon: NotebookPen },
    { key: "letters", label: "Thư từ", icon: MessageCircleHeart },
    { key: "places", label: "Địa điểm", icon: MapPinned },
    { key: "bucket", label: "Bucket list", icon: Sparkles }
  ];

  return (
    <div className="min-h-screen">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <section className="section-shell rounded-[36px] p-6 md:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-blush-700">
                Dashboard riêng tư
              </p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 md:text-5xl">
                Quản lý toàn bộ không gian kỷ niệm của hai bạn
              </h1>
              <p className="mt-4 max-w-3xl text-sm leading-8 text-slate-600 md:text-base">
                Email hiện tại: <span className="font-semibold">{userEmail ?? "Không xác định"}</span>. Mọi thay đổi bạn lưu ở đây sẽ ghi vào Supabase Database và Storage thật, không mất khi reload hay đổi thiết bị.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="secondary"
                onClick={() => {
                  window.open("/", "_blank");
                }}
              >
                Xem landing page
              </Button>
              <LogoutButton />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {busyLabel ? (
              <Badge variant="soft">
                <LoaderCircle className="mr-2 h-3.5 w-3.5 animate-spin" />
                {busyLabel}...
              </Badge>
            ) : (
              <Badge variant="soft">Sẵn sàng chỉnh sửa</Badge>
            )}
            {spaceData.settings?.public_slug ? (
              <Badge variant={spaceData.settings.is_public ? "success" : "soft"}>
                {spaceData.settings.is_public ? "Public mode: ON" : "Public mode: OFF"}
              </Badge>
            ) : null}
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="space-y-4 xl:sticky xl:top-24 xl:h-fit">
            <Card className="rounded-[32px] p-4">
              <div className="grid gap-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => setActiveTab(tab.key)}
                      className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${
                        activeTab === tab.key
                          ? "bg-blush-100 text-blush-800"
                          : "text-slate-600 hover:bg-white/80"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </Card>

            <Card className="rounded-[32px]">
              <h3 className="text-lg font-semibold text-slate-900">Link public</h3>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                Khi bật chế độ public và có slug, bạn có thể chia sẻ landing page bằng link riêng.
              </p>
              {publicPath ? (
                <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                  <p className="break-all">{publicPath}</p>
                  <Button
                    variant="secondary"
                    className="mt-3 w-full"
                    onClick={async () => {
                      const fullUrl = `${window.location.origin}${publicPath}`;
                      await navigator.clipboard.writeText(fullUrl);
                      toast.success("Đã copy link public");
                    }}
                  >
                    Copy link
                  </Button>
                </div>
              ) : (
                <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                  Chưa có public slug.
                </div>
              )}
            </Card>
          </aside>

          <section className="space-y-6">
            {activeTab === "overview" && (
              <div className="space-y-6">
                <SectionHeading
                  kicker="Overview"
                  title="Tổng quan nhanh về dữ liệu hiện có"
                  description="Nếu đây là lần đầu bạn dùng app, có thể bấm tạo không gian mẫu để sinh các bản ghi nền tảng rồi chỉnh sửa tiếp."
                />
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  <StatCard label="Profiles" value={spaceData.profiles.length} icon={<Heart className="h-5 w-5" />} />
                  <StatCard label="Gallery" value={spaceData.gallery.length} icon={<Camera className="h-5 w-5" />} />
                  <StatCard label="Timeline" value={spaceData.timeline.length} icon={<CalendarHeart className="h-5 w-5" />} />
                  <StatCard label="Journal" value={spaceData.journals.length} icon={<NotebookPen className="h-5 w-5" />} />
                </div>

                <Card className="rounded-[32px] p-6">
                  <h3 className="text-xl font-semibold text-slate-900">Khởi tạo nhanh</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    App sẽ chạy tốt nhất khi có ít nhất bản ghi cài đặt chung, relationship info và 2 hồ sơ đầu tiên.
                  </p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <Button onClick={createStarterSpace}>Tạo không gian mẫu</Button>
                    <Button variant="secondary" onClick={() => refreshData()}>
                      Làm mới dữ liệu
                    </Button>
                  </div>
                </Card>
              </div>
            )}

            {activeTab === "relationship" && (
              <div className="space-y-6">
                <SectionHeading
                  kicker="Cài đặt chung"
                  title="Tên landing page, quote, ảnh cover, public slug và câu chuyện chung."
                  description="Đây là phần điều khiển hero section, link public và nội dung giới thiệu chung của hai bạn."
                />

                <FormShell
                  title="Cài đặt landing page"
                  description="Ảnh cover nên là ảnh ngang đẹp, rõ mặt hoặc có cảm xúc. Public slug dùng cho link chia sẻ."
                >
                  <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
                    <div className="space-y-4">
                      <FilePreview
                        file={settingsForm.heroFile}
                        existingUrl={spaceData.settings?.hero_image_url}
                        alt="Hero preview"
                        className="relative h-52 overflow-hidden rounded-[28px] bg-white/80"
                      />
                      <Field label="Ảnh cover">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(event) =>
                            setSettingsForm((current) => ({
                              ...current,
                              heroFile: event.target.files?.[0] ?? null
                            }))
                          }
                        />
                      </Field>
                    </div>

                    <div className="grid gap-4">
                      <Field label="Tên không gian">
                        <Input
                          value={settingsForm.couple_title}
                          onChange={(event) =>
                            setSettingsForm((current) => ({ ...current, couple_title: event.target.value }))
                          }
                          placeholder="Ví dụ: Minh & Nhi"
                        />
                      </Field>
                      <Field label="Tagline">
                        <Input
                          value={settingsForm.tagline}
                          onChange={(event) =>
                            setSettingsForm((current) => ({ ...current, tagline: event.target.value }))
                          }
                          placeholder="Một nơi để lưu mọi điều đẹp nhất của hai đứa."
                        />
                      </Field>
                      <Field label="Quote">
                        <Textarea
                          value={settingsForm.quote}
                          onChange={(event) =>
                            setSettingsForm((current) => ({ ...current, quote: event.target.value }))
                          }
                          placeholder="Cảm ơn vì đã ở đây và làm mọi ngày trở nên dịu dàng hơn."
                        />
                      </Field>
                      <Field label="Public slug">
                        <Input
                          value={settingsForm.public_slug}
                          onChange={(event) =>
                            setSettingsForm((current) => ({
                              ...current,
                              public_slug: slugify(event.target.value)
                            }))
                          }
                          placeholder="minh-va-nhi"
                        />
                      </Field>
                      <Toggle
                        checked={settingsForm.is_public}
                        onChange={(value) =>
                          setSettingsForm((current) => ({ ...current, is_public: value }))
                        }
                        label="Bật landing page public"
                      />
                      <div>
                        <Button onClick={saveSettings}>Lưu cài đặt</Button>
                      </div>
                    </div>
                  </div>
                </FormShell>

                <FormShell
                  title="Câu chuyện chung"
                  description="Những thông tin này hiển thị ở phần Love Story trên landing page."
                >
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Ngày gặp nhau">
                      <Input
                        type="date"
                        value={relationshipForm.first_meet_date}
                        onChange={(event) =>
                          setRelationshipForm((current) => ({
                            ...current,
                            first_meet_date: event.target.value
                          }))
                        }
                      />
                    </Field>
                    <Field label="Ngày bắt đầu yêu">
                      <Input
                        type="date"
                        value={relationshipForm.start_date}
                        onChange={(event) =>
                          setRelationshipForm((current) => ({ ...current, start_date: event.target.value }))
                        }
                      />
                    </Field>
                    <Field label="Địa điểm / thành phố chính">
                      <Input
                        value={relationshipForm.location_label}
                        onChange={(event) =>
                          setRelationshipForm((current) => ({
                            ...current,
                            location_label: event.target.value
                          }))
                        }
                        placeholder="TP.HCM"
                      />
                    </Field>
                    <div className="flex items-end">
                      <Toggle
                        checked={relationshipForm.is_public}
                        onChange={(value) =>
                          setRelationshipForm((current) => ({ ...current, is_public: value }))
                        }
                        label="Cho hiển thị công khai"
                      />
                    </div>
                  </div>
                  <Field label="Love quote">
                    <Textarea
                      value={relationshipForm.love_quote}
                      onChange={(event) =>
                        setRelationshipForm((current) => ({
                          ...current,
                          love_quote: event.target.value
                        }))
                      }
                      placeholder="Một câu ngắn mà hai bạn rất thích."
                    />
                  </Field>
                  <Field label="Love story">
                    <Textarea
                      value={relationshipForm.story}
                      onChange={(event) =>
                        setRelationshipForm((current) => ({ ...current, story: event.target.value }))
                      }
                      placeholder="Kể lại hành trình gặp nhau, bắt đầu nói chuyện và ngày yêu nhau."
                    />
                  </Field>
                  <div>
                    <Button onClick={saveRelationship}>Lưu câu chuyện</Button>
                  </div>
                </FormShell>
              </div>
            )}

            {activeTab === "profiles" && (
              <div className="space-y-6">
                <SectionHeading
                  kicker="Profiles"
                  title="Chỉnh hồ sơ của cả hai người"
                  description="Mỗi hồ sơ có avatar, mô tả, sở thích, biệt danh và các chi tiết dễ thương."
                />
                <div className="grid gap-6 xl:grid-cols-2">
                  {PROFILE_ROLES.map((role) => {
                    const profile = spaceData.profiles.find((item) => item.role === role);
                    const formState = profileForms[role];
                    return (
                      <FormShell
                        key={role}
                        title={role === "person_a" ? "Hồ sơ người 1" : "Hồ sơ người 2"}
                        description="Ảnh avatar upload thật lên Supabase Storage."
                      >
                        <div className="grid gap-4 md:grid-cols-[170px_1fr]">
                          <div className="space-y-4">
                            <FilePreview
                              file={formState.avatarFile}
                              existingUrl={profile?.avatar_url}
                              alt={role}
                              className="relative h-40 overflow-hidden rounded-[28px] bg-white/80"
                            />
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={(event) =>
                                setProfileForms((current) => ({
                                  ...current,
                                  [role]: {
                                    ...current[role],
                                    avatarFile: event.target.files?.[0] ?? null
                                  }
                                }))
                              }
                            />
                          </div>

                          <div className="grid gap-4">
                            <Field label="Họ tên">
                              <Input
                                value={formState.full_name}
                                onChange={(event) =>
                                  setProfileForms((current) => ({
                                    ...current,
                                    [role]: { ...current[role], full_name: event.target.value }
                                  }))
                                }
                              />
                            </Field>
                            <Field label="Biệt danh">
                              <Input
                                value={formState.nickname}
                                onChange={(event) =>
                                  setProfileForms((current) => ({
                                    ...current,
                                    [role]: { ...current[role], nickname: event.target.value }
                                  }))
                                }
                              />
                            </Field>
                            <Field label="Ngày sinh">
                              <Input
                                type="date"
                                value={formState.birth_date}
                                onChange={(event) =>
                                  setProfileForms((current) => ({
                                    ...current,
                                    [role]: { ...current[role], birth_date: event.target.value }
                                  }))
                                }
                              />
                            </Field>
                          </div>
                        </div>

                        <Field label="Mô tả">
                          <Textarea
                            value={formState.description}
                            onChange={(event) =>
                              setProfileForms((current) => ({
                                ...current,
                                [role]: { ...current[role], description: event.target.value }
                              }))
                            }
                          />
                        </Field>
                        <Field label="Sở thích (ngăn cách bằng dấu phẩy)">
                          <Input
                            value={formState.hobbies}
                            onChange={(event) =>
                              setProfileForms((current) => ({
                                ...current,
                                [role]: { ...current[role], hobbies: event.target.value }
                              }))
                            }
                          />
                        </Field>
                        <Field label="Điều mình yêu nhất">
                          <Textarea
                            value={formState.favorite_thing}
                            onChange={(event) =>
                              setProfileForms((current) => ({
                                ...current,
                                [role]: { ...current[role], favorite_thing: event.target.value }
                              }))
                            }
                          />
                        </Field>
                        <Field label="Thói quen đáng yêu">
                          <Input
                            value={formState.adorable_habit}
                            onChange={(event) =>
                              setProfileForms((current) => ({
                                ...current,
                                [role]: { ...current[role], adorable_habit: event.target.value }
                              }))
                            }
                          />
                        </Field>
                        <Toggle
                          checked={formState.is_public}
                          onChange={(value) =>
                            setProfileForms((current) => ({
                              ...current,
                              [role]: { ...current[role], is_public: value }
                            }))
                          }
                          label="Cho hiển thị công khai"
                        />
                        <div>
                          <Button onClick={() => saveProfile(role)}>
                            Lưu {role === "person_a" ? "người 1" : "người 2"}
                          </Button>
                        </div>
                      </FormShell>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === "gallery" && (
              <div className="space-y-6">
                <SectionHeading
                  kicker="Gallery"
                  title="Upload ảnh và video thật từ điện thoại hoặc desktop"
                  description="Có thể chọn nhiều file cùng lúc. Mỗi file sẽ được upload lên Supabase Storage và ghi metadata vào database."
                />

                <FormShell
                  title="Thêm media mới"
                  description="Chọn nhiều ảnh/video để tạo gallery nhanh."
                >
                  <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
                    <div className="grid gap-4">
                      <Field label="Chọn ảnh hoặc video">
                        <Input
                          type="file"
                          multiple
                          accept="image/*,video/*"
                          onChange={(event) =>
                            setGalleryFiles(Array.from(event.target.files ?? []))
                          }
                        />
                      </Field>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {galleryFiles.map((file) => (
                          <div key={`${file.name}-${file.size}`} className="rounded-[24px] border border-white/70 bg-white/80 p-3">
                            <p className="truncate text-sm font-medium text-slate-800">{file.name}</p>
                            <p className="mt-1 text-xs text-slate-500">
                              {Math.round(file.size / 1024)} KB · {file.type.startsWith("video/") ? "Video" : "Ảnh"}
                            </p>
                          </div>
                        ))}
                        {galleryFiles.length === 0 ? (
                          <div className="rounded-[24px] border border-dashed border-blush-200 bg-white/80 p-6 text-sm text-slate-500">
                            Chưa chọn file nào.
                          </div>
                        ) : null}
                      </div>
                    </div>

                    <div className="grid gap-4">
                      <Field label="Tiêu đề / album name">
                        <Input
                          value={galleryMeta.title}
                          onChange={(event) =>
                            setGalleryMeta((current) => ({ ...current, title: event.target.value }))
                          }
                        />
                      </Field>
                      <Field label="Caption">
                        <Textarea
                          value={galleryMeta.caption}
                          onChange={(event) =>
                            setGalleryMeta((current) => ({ ...current, caption: event.target.value }))
                          }
                        />
                      </Field>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <Field label="Album">
                          <Input
                            value={galleryMeta.album}
                            onChange={(event) =>
                              setGalleryMeta((current) => ({ ...current, album: event.target.value }))
                            }
                          />
                        </Field>
                        <Field label="Ngày chụp">
                          <Input
                            type="date"
                            value={galleryMeta.taken_at}
                            onChange={(event) =>
                              setGalleryMeta((current) => ({ ...current, taken_at: event.target.value }))
                            }
                          />
                        </Field>
                      </div>
                      <div className="flex flex-wrap gap-4">
                        <Toggle
                          checked={galleryMeta.is_favorite}
                          onChange={(value) =>
                            setGalleryMeta((current) => ({ ...current, is_favorite: value }))
                          }
                          label="Đánh dấu yêu thích"
                        />
                        <Toggle
                          checked={galleryMeta.is_public}
                          onChange={(value) =>
                            setGalleryMeta((current) => ({ ...current, is_public: value }))
                          }
                          label="Cho hiển thị công khai"
                        />
                      </div>
                      <div>
                        <Button onClick={saveGallery}>Upload gallery</Button>
                      </div>
                    </div>
                  </div>
                </FormShell>

                {spaceData.gallery.length === 0 ? (
                  <EmptyState
                    title="Gallery còn trống"
                    description="Upload những ảnh đầu tiên để landing page đẹp ngay."
                  />
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {spaceData.gallery.map((item) => (
                      <Card key={item.id} className="overflow-hidden rounded-[28px] p-0">
                        <div className="relative h-56 bg-gradient-to-br from-blush-100 via-white to-sand-100">
                          {item.media_type === "image" ? (
                            <Image
                              fill
                              src={item.media_url}
                              alt={item.title || "Gallery item"}
                              className="object-cover"
                              sizes="(max-width: 768px) 100vw, 33vw"
                            />
                          ) : (
                            <div className="grid h-full place-items-center">
                              <Film className="h-12 w-12 text-blush-700" />
                            </div>
                          )}
                        </div>
                        <div className="p-5">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <h3 className="text-lg font-semibold text-slate-900">{item.title || "Gallery item"}</h3>
                              <p className="mt-1 text-sm text-slate-500">
                                {[item.album, item.taken_at ? formatDate(item.taken_at) : null].filter(Boolean).join(" • ")}
                              </p>
                            </div>
                            {item.is_favorite ? <Badge>Yêu thích</Badge> : null}
                          </div>
                          {item.caption ? (
                            <p className="mt-3 text-sm leading-7 text-slate-600">{item.caption}</p>
                          ) : null}
                          <div className="mt-4 flex items-center justify-between">
                            <Badge variant="soft">{item.is_public ? "Public" : "Private"}</Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                deleteRow("gallery_items", item.id, "media", {
                                  bucket: "memories",
                                  path: item.media_bucket_path
                                })
                              }
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Xóa
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "timeline" && (
              <div className="space-y-6">
                <SectionHeading
                  kicker="Timeline"
                  title="Thêm hoặc sửa cột mốc"
                  description="Mỗi cột mốc có thể gắn ảnh riêng, mô tả và tag."
                />
                <FormShell
                  title={timelineForm.id ? "Chỉnh sửa cột mốc" : "Thêm cột mốc mới"}
                  description="Nhấn Sửa trên một card phía dưới để nạp dữ liệu vào form này."
                >
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Tiêu đề">
                      <Input
                        value={timelineForm.title}
                        onChange={(event) =>
                          setTimelineForm((current) => ({ ...current, title: event.target.value }))
                        }
                      />
                    </Field>
                    <Field label="Ngày">
                      <Input
                        type="date"
                        value={timelineForm.event_date}
                        onChange={(event) =>
                          setTimelineForm((current) => ({ ...current, event_date: event.target.value }))
                        }
                      />
                    </Field>
                    <Field label="Tag">
                      <Input
                        value={timelineForm.tag}
                        onChange={(event) =>
                          setTimelineForm((current) => ({ ...current, tag: event.target.value }))
                        }
                      />
                    </Field>
                    <Field label="Media">
                      <Input
                        type="file"
                        accept="image/*,video/*"
                        onChange={(event) =>
                          setTimelineForm((current) => ({
                            ...current,
                            file: event.target.files?.[0] ?? null
                          }))
                        }
                      />
                    </Field>
                  </div>
                  <Field label="Mô tả">
                    <Textarea
                      value={timelineForm.description}
                      onChange={(event) =>
                        setTimelineForm((current) => ({ ...current, description: event.target.value }))
                      }
                    />
                  </Field>
                  <Toggle
                    checked={timelineForm.is_public}
                    onChange={(value) =>
                      setTimelineForm((current) => ({ ...current, is_public: value }))
                    }
                    label="Cho hiển thị công khai"
                  />
                  <div className="flex flex-wrap gap-3">
                    <Button onClick={saveTimeline}>
                      {timelineForm.id ? "Lưu thay đổi" : "Thêm cột mốc"}
                    </Button>
                    {timelineForm.id ? (
                      <Button variant="secondary" onClick={() => setTimelineForm(emptyTimeline)}>
                        Tạo mới
                      </Button>
                    ) : null}
                  </div>
                </FormShell>

                {spaceData.timeline.length === 0 ? (
                  <EmptyState
                    title="Chưa có timeline"
                    description="Thêm ngày đầu tiên để landing page trở nên sống động."
                  />
                ) : (
                  <div className="grid gap-4">
                    {spaceData.timeline.map((item) => (
                      <Card key={item.id} className="rounded-[28px]">
                        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                          <div className="max-w-3xl">
                            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blush-700">
                              {formatDate(item.event_date)}
                            </p>
                            <h3 className="mt-2 text-xl font-semibold text-slate-900">{item.title}</h3>
                            {item.description ? (
                              <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
                            ) : null}
                            <div className="mt-4 flex flex-wrap gap-2">
                              {item.tag ? <Badge variant="soft">{item.tag}</Badge> : null}
                              <Badge variant="soft">{item.is_public ? "Public" : "Private"}</Badge>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() =>
                                setTimelineForm({
                                  id: item.id,
                                  title: item.title,
                                  event_date: item.event_date,
                                  description: item.description ?? "",
                                  tag: item.tag ?? "",
                                  is_public: item.is_public,
                                  file: null,
                                  oldBucketPath: item.media_bucket_path
                                })
                              }
                            >
                              Sửa
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                deleteRow("timeline_events", item.id, "cột mốc", {
                                  bucket: "memories",
                                  path: item.media_bucket_path
                                })
                              }
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Xóa
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "anniversaries" && (
              <div className="space-y-6">
                <SectionHeading
                  kicker="Anniversaries"
                  title="Quản lý các ngày kỷ niệm"
                  description="Sinh nhật, ngày yêu nhau, chuyến đi đầu tiên hoặc bất kỳ mốc nào khác."
                />
                <FormShell
                  title={anniversaryForm.id ? "Chỉnh sửa ngày kỷ niệm" : "Thêm ngày kỷ niệm"}
                  description="Ngày kỷ niệm sẽ tự hiện ở landing page nếu bật public."
                >
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Tiêu đề">
                      <Input
                        value={anniversaryForm.title}
                        onChange={(event) =>
                          setAnniversaryForm((current) => ({ ...current, title: event.target.value }))
                        }
                      />
                    </Field>
                    <Field label="Ngày">
                      <Input
                        type="date"
                        value={anniversaryForm.event_date}
                        onChange={(event) =>
                          setAnniversaryForm((current) => ({ ...current, event_date: event.target.value }))
                        }
                      />
                    </Field>
                  </div>
                  <Field label="Ghi chú">
                    <Textarea
                      value={anniversaryForm.note}
                      onChange={(event) =>
                        setAnniversaryForm((current) => ({ ...current, note: event.target.value }))
                      }
                    />
                  </Field>
                  <Toggle
                    checked={anniversaryForm.is_public}
                    onChange={(value) =>
                      setAnniversaryForm((current) => ({ ...current, is_public: value }))
                    }
                    label="Cho hiển thị công khai"
                  />
                  <div className="flex flex-wrap gap-3">
                    <Button onClick={saveAnniversary}>
                      {anniversaryForm.id ? "Lưu thay đổi" : "Thêm ngày kỷ niệm"}
                    </Button>
                    {anniversaryForm.id ? (
                      <Button variant="secondary" onClick={() => setAnniversaryForm(emptyAnniversary)}>
                        Tạo mới
                      </Button>
                    ) : null}
                  </div>
                </FormShell>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {spaceData.anniversaries.map((item) => (
                    <Card key={item.id} className="rounded-[28px]">
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blush-700">
                        {formatDate(item.event_date)}
                      </p>
                      <h3 className="mt-2 text-lg font-semibold text-slate-900">{item.title}</h3>
                      {item.note ? (
                        <p className="mt-3 text-sm leading-7 text-slate-600">{item.note}</p>
                      ) : null}
                      <div className="mt-4 flex items-center justify-between gap-3">
                        <Badge variant="soft">{item.is_public ? "Public" : "Private"}</Badge>
                        <div className="flex gap-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() =>
                              setAnniversaryForm({
                                id: item.id,
                                title: item.title,
                                event_date: item.event_date,
                                note: item.note ?? "",
                                is_public: item.is_public
                              })
                            }
                          >
                            Sửa
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteRow("anniversaries", item.id, "ngày kỷ niệm")}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Xóa
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "journal" && (
              <EntitySection
                title="Nhật ký"
                description="Viết nhật ký hằng ngày hoặc những điều muốn nhớ lâu."
                form={
                  <FormShell
                    title={journalForm.id ? "Chỉnh sửa nhật ký" : "Thêm nhật ký"}
                    description="Bạn có thể giữ riêng tư hoặc bật public để hiển thị lên landing page."
                  >
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field label="Tiêu đề">
                        <Input
                          value={journalForm.title}
                          onChange={(event) =>
                            setJournalForm((current) => ({ ...current, title: event.target.value }))
                          }
                        />
                      </Field>
                      <Field label="Ngày">
                        <Input
                          type="date"
                          value={journalForm.entry_date}
                          onChange={(event) =>
                            setJournalForm((current) => ({ ...current, entry_date: event.target.value }))
                          }
                        />
                      </Field>
                      <Field label="Mood">
                        <Input
                          list="mood-list"
                          value={journalForm.mood}
                          onChange={(event) =>
                            setJournalForm((current) => ({ ...current, mood: event.target.value }))
                          }
                        />
                        <datalist id="mood-list">
                          {MOODS.map((mood) => (
                            <option key={mood} value={mood} />
                          ))}
                        </datalist>
                      </Field>
                      <Field label="Người viết">
                        <Input
                          value={journalForm.written_by}
                          onChange={(event) =>
                            setJournalForm((current) => ({ ...current, written_by: event.target.value }))
                          }
                        />
                      </Field>
                    </div>
                    <Field label="Nội dung">
                      <Textarea
                        value={journalForm.content}
                        onChange={(event) =>
                          setJournalForm((current) => ({ ...current, content: event.target.value }))
                        }
                      />
                    </Field>
                    <Field label="Ảnh đính kèm">
                      <Input
                        type="file"
                        accept="image/*,video/*"
                        onChange={(event) =>
                          setJournalForm((current) => ({
                            ...current,
                            file: event.target.files?.[0] ?? null
                          }))
                        }
                      />
                    </Field>
                    <Toggle
                      checked={journalForm.is_public}
                      onChange={(value) =>
                        setJournalForm((current) => ({ ...current, is_public: value }))
                      }
                      label="Cho hiển thị công khai"
                    />
                    <div className="flex gap-3">
                      <Button onClick={saveJournal}>
                        {journalForm.id ? "Lưu thay đổi" : "Thêm nhật ký"}
                      </Button>
                      {journalForm.id ? (
                        <Button variant="secondary" onClick={() => setJournalForm(emptyJournal)}>
                          Tạo mới
                        </Button>
                      ) : null}
                    </div>
                  </FormShell>
                }
                content={
                  spaceData.journals.length === 0 ? (
                    <EmptyState title="Chưa có nhật ký" description="Viết entry đầu tiên của hai bạn." />
                  ) : (
                    <div className="grid gap-4">
                      {spaceData.journals.map((item) => (
                        <Card key={item.id} className="rounded-[28px]">
                          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                            <div className="max-w-3xl">
                              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blush-700">
                                {formatDate(item.entry_date)}
                              </p>
                              <h3 className="mt-2 text-xl font-semibold text-slate-900">{item.title}</h3>
                              <p className="mt-3 text-sm leading-7 text-slate-600">{item.content}</p>
                              <div className="mt-3 flex flex-wrap gap-2">
                                {item.mood ? <Badge variant="soft">{item.mood}</Badge> : null}
                                <Badge variant="soft">{item.is_public ? "Public" : "Private"}</Badge>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() =>
                                  setJournalForm({
                                    id: item.id,
                                    title: item.title,
                                    content: item.content,
                                    mood: item.mood ?? "",
                                    written_by: item.written_by ?? "",
                                    entry_date: item.entry_date,
                                    is_public: item.is_public,
                                    file: null,
                                    oldBucketPath: item.attachment_bucket_path
                                  })
                                }
                              >
                                Sửa
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  deleteRow("journal_entries", item.id, "nhật ký", {
                                    bucket: "attachments",
                                    path: item.attachment_bucket_path
                                  })
                                }
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Xóa
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )
                }
              />
            )}

            {activeTab === "letters" && (
              <EntitySection
                title="Thư từ"
                description="Lưu lại những lá thư gửi nhau, có thể giữ riêng tư hoặc chia sẻ công khai."
                form={
                  <FormShell
                    title={letterForm.id ? "Chỉnh sửa thư" : "Thêm thư"}
                    description="Thư hỗ trợ đính kèm ảnh/file trong bucket attachments."
                  >
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field label="Tiêu đề">
                        <Input
                          value={letterForm.title}
                          onChange={(event) =>
                            setLetterForm((current) => ({ ...current, title: event.target.value }))
                          }
                        />
                      </Field>
                      <Field label="Ngày viết">
                        <Input
                          type="date"
                          value={letterForm.entry_date}
                          onChange={(event) =>
                            setLetterForm((current) => ({ ...current, entry_date: event.target.value }))
                          }
                        />
                      </Field>
                    </div>
                    <Field label="Người gửi">
                      <Input
                        value={letterForm.sender_name}
                        onChange={(event) =>
                          setLetterForm((current) => ({ ...current, sender_name: event.target.value }))
                        }
                      />
                    </Field>
                    <Field label="Nội dung">
                      <Textarea
                        value={letterForm.content}
                        onChange={(event) =>
                          setLetterForm((current) => ({ ...current, content: event.target.value }))
                        }
                      />
                    </Field>
                    <Field label="Ảnh/File đính kèm">
                      <Input
                        type="file"
                        accept="image/*,video/*,.pdf,.doc,.docx"
                        onChange={(event) =>
                          setLetterForm((current) => ({
                            ...current,
                            file: event.target.files?.[0] ?? null
                          }))
                        }
                      />
                    </Field>
                    <Toggle
                      checked={letterForm.is_public}
                      onChange={(value) =>
                        setLetterForm((current) => ({ ...current, is_public: value }))
                      }
                      label="Cho hiển thị công khai"
                    />
                    <div className="flex gap-3">
                      <Button onClick={saveLetter}>
                        {letterForm.id ? "Lưu thay đổi" : "Thêm thư"}
                      </Button>
                      {letterForm.id ? (
                        <Button variant="secondary" onClick={() => setLetterForm(emptyLetter)}>
                          Tạo mới
                        </Button>
                      ) : null}
                    </div>
                  </FormShell>
                }
                content={
                  spaceData.letters.length === 0 ? (
                    <EmptyState title="Chưa có thư nào" description="Thêm những lá thư đầu tiên để lưu lại cảm xúc." />
                  ) : (
                    <div className="grid gap-4">
                      {spaceData.letters.map((item) => (
                        <Card key={item.id} className="rounded-[28px] bg-gradient-to-br from-white to-blush-50/70">
                          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                            <div className="max-w-3xl">
                              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blush-700">
                                {item.sender_name || "Người gửi"} • {formatDate(item.entry_date)}
                              </p>
                              <h3 className="mt-2 text-xl font-semibold text-slate-900">{item.title}</h3>
                              <p className="mt-3 text-sm leading-7 text-slate-600">{item.content}</p>
                              <div className="mt-3">
                                <Badge variant="soft">{item.is_public ? "Public" : "Private"}</Badge>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() =>
                                  setLetterForm({
                                    id: item.id,
                                    title: item.title,
                                    content: item.content,
                                    sender_name: item.sender_name ?? "",
                                    entry_date: item.entry_date,
                                    is_public: item.is_public,
                                    file: null,
                                    oldBucketPath: item.attachment_bucket_path
                                  })
                                }
                              >
                                Sửa
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  deleteRow("letters", item.id, "thư", {
                                    bucket: "attachments",
                                    path: item.attachment_bucket_path
                                  })
                                }
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Xóa
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )
                }
              />
            )}

            {activeTab === "places" && (
              <EntitySection
                title="Địa điểm"
                description="Lưu nơi đã đi, ngày đi và ảnh minh họa."
                form={
                  <FormShell
                    title={placeForm.id ? "Chỉnh sửa địa điểm" : "Thêm địa điểm"}
                    description="Ảnh sẽ được upload lên bucket memories/places."
                  >
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field label="Tên địa điểm">
                        <Input
                          value={placeForm.place_name}
                          onChange={(event) =>
                            setPlaceForm((current) => ({ ...current, place_name: event.target.value }))
                          }
                        />
                      </Field>
                      <Field label="Thành phố">
                        <Input
                          value={placeForm.city}
                          onChange={(event) =>
                            setPlaceForm((current) => ({ ...current, city: event.target.value }))
                          }
                        />
                      </Field>
                      <Field label="Ngày đi">
                        <Input
                          type="date"
                          value={placeForm.visited_at}
                          onChange={(event) =>
                            setPlaceForm((current) => ({ ...current, visited_at: event.target.value }))
                          }
                        />
                      </Field>
                      <Field label="Ảnh">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(event) =>
                            setPlaceForm((current) => ({
                              ...current,
                              file: event.target.files?.[0] ?? null
                            }))
                          }
                        />
                      </Field>
                    </div>
                    <Field label="Mô tả">
                      <Textarea
                        value={placeForm.description}
                        onChange={(event) =>
                          setPlaceForm((current) => ({ ...current, description: event.target.value }))
                        }
                      />
                    </Field>
                    <div className="flex flex-wrap gap-4">
                      <Toggle
                        checked={placeForm.is_memorable}
                        onChange={(value) =>
                          setPlaceForm((current) => ({ ...current, is_memorable: value }))
                        }
                        label="Đánh dấu đáng nhớ"
                      />
                      <Toggle
                        checked={placeForm.is_public}
                        onChange={(value) =>
                          setPlaceForm((current) => ({ ...current, is_public: value }))
                        }
                        label="Cho hiển thị công khai"
                      />
                    </div>
                    <div className="flex gap-3">
                      <Button onClick={savePlace}>
                        {placeForm.id ? "Lưu thay đổi" : "Thêm địa điểm"}
                      </Button>
                      {placeForm.id ? (
                        <Button variant="secondary" onClick={() => setPlaceForm(emptyPlace)}>
                          Tạo mới
                        </Button>
                      ) : null}
                    </div>
                  </FormShell>
                }
                content={
                  spaceData.places.length === 0 ? (
                    <EmptyState title="Chưa có địa điểm" description="Thêm chuyến đi đầu tiên hoặc quán quen của hai bạn." />
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                      {spaceData.places.map((item) => (
                        <Card key={item.id} className="overflow-hidden rounded-[28px] p-0">
                          <div className="relative h-52 bg-gradient-to-br from-blush-100 via-white to-sand-100">
                            {item.image_url ? (
                              <Image
                                fill
                                src={item.image_url}
                                alt={item.place_name}
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 50vw"
                              />
                            ) : (
                              <div className="grid h-full place-items-center">
                                <MapPinned className="h-10 w-10 text-blush-700" />
                              </div>
                            )}
                          </div>
                          <div className="p-5">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <h3 className="text-lg font-semibold text-slate-900">{item.place_name}</h3>
                                <p className="mt-1 text-sm text-slate-500">
                                  {[item.city, item.visited_at ? formatDate(item.visited_at) : null].filter(Boolean).join(" • ")}
                                </p>
                              </div>
                              {item.is_memorable ? <Badge>Đáng nhớ</Badge> : null}
                            </div>
                            {item.description ? (
                              <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
                            ) : null}
                            <div className="mt-4 flex items-center justify-between">
                              <Badge variant="soft">{item.is_public ? "Public" : "Private"}</Badge>
                              <div className="flex gap-2">
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  onClick={() =>
                                    setPlaceForm({
                                      id: item.id,
                                      place_name: item.place_name,
                                      city: item.city ?? "",
                                      visited_at: item.visited_at ?? "",
                                      description: item.description ?? "",
                                      is_memorable: item.is_memorable,
                                      is_public: item.is_public,
                                      file: null,
                                      oldBucketPath: item.image_bucket_path
                                    })
                                  }
                                >
                                  Sửa
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    deleteRow("places_visited", item.id, "địa điểm", {
                                      bucket: "memories",
                                      path: item.image_bucket_path
                                    })
                                  }
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Xóa
                                </Button>
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )
                }
              />
            )}

            {activeTab === "bucket" && (
              <EntitySection
                title="Bucket list"
                description="Những điều tụi mình muốn làm cùng nhau trong tương lai."
                form={
                  <FormShell
                    title={bucketForm.id ? "Chỉnh sửa bucket list" : "Thêm bucket list"}
                    description="Landing page sẽ hiển thị trạng thái todo, planned hoặc done."
                  >
                    <Field label="Nội dung">
                      <Input
                        value={bucketForm.title}
                        onChange={(event) =>
                          setBucketForm((current) => ({ ...current, title: event.target.value }))
                        }
                      />
                    </Field>
                    <Field label="Ghi chú">
                      <Textarea
                        value={bucketForm.note}
                        onChange={(event) =>
                          setBucketForm((current) => ({ ...current, note: event.target.value }))
                        }
                      />
                    </Field>
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field label="Trạng thái">
                        <select
                          value={bucketForm.status}
                          onChange={(event) =>
                            setBucketForm((current) => ({
                              ...current,
                              status: event.target.value as BucketFormState["status"]
                            }))
                          }
                          className="flex h-11 w-full rounded-2xl border border-white/70 bg-white/80 px-4 text-sm text-slate-900 shadow-sm outline-none"
                        >
                          {BUCKET_STATUSES.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </Field>
                      <Field label="Deadline">
                        <Input
                          type="date"
                          value={bucketForm.target_date}
                          onChange={(event) =>
                            setBucketForm((current) => ({ ...current, target_date: event.target.value }))
                          }
                        />
                      </Field>
                    </div>
                    <Toggle
                      checked={bucketForm.is_public}
                      onChange={(value) =>
                        setBucketForm((current) => ({ ...current, is_public: value }))
                      }
                      label="Cho hiển thị công khai"
                    />
                    <div className="flex gap-3">
                      <Button onClick={saveBucketItem}>
                        {bucketForm.id ? "Lưu thay đổi" : "Thêm bucket list"}
                      </Button>
                      {bucketForm.id ? (
                        <Button variant="secondary" onClick={() => setBucketForm(emptyBucket)}>
                          Tạo mới
                        </Button>
                      ) : null}
                    </div>
                  </FormShell>
                }
                content={
                  spaceData.bucketList.length === 0 ? (
                    <EmptyState title="Chưa có bucket list" description="Hãy thêm vài kế hoạch đáng yêu của hai bạn." />
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                      {spaceData.bucketList.map((item) => (
                        <Card key={item.id} className="rounded-[28px]">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                              {item.note ? (
                                <p className="mt-3 text-sm leading-7 text-slate-600">{item.note}</p>
                              ) : null}
                              <div className="mt-3 flex flex-wrap gap-2">
                                <Badge variant={item.status === "done" ? "success" : "soft"}>
                                  {item.status}
                                </Badge>
                                <Badge variant="soft">{item.is_public ? "Public" : "Private"}</Badge>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() =>
                                  setBucketForm({
                                    id: item.id,
                                    title: item.title,
                                    note: item.note ?? "",
                                    status: item.status,
                                    target_date: item.target_date ?? "",
                                    is_public: item.is_public
                                  })
                                }
                              >
                                Sửa
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteRow("bucket_list_items", item.id, "bucket list")}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Xóa
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )
                }
              />
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

function EntitySection({
  title,
  description,
  form,
  content
}: {
  title: string;
  description: string;
  form: React.ReactNode;
  content: React.ReactNode;
}) {
  return (
    <div className="space-y-6">
      <SectionHeading kicker={title} title={title} description={description} />
      {form}
      {content}
    </div>
  );
}

function StatCard({
  label,
  value,
  icon
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <Card className="rounded-[28px]">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-blush-100 text-blush-700">
        {icon}
      </div>
      <div className="text-3xl font-semibold text-slate-900">{value}</div>
      <p className="mt-1 text-sm text-slate-600">{label}</p>
    </Card>
  );
}

function splitTags(value?: string | null) {
  if (!value) return [];
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function extractBucketPath(publicUrl: string, bucketName: string) {
  const marker = `/storage/v1/object/public/${bucketName}/`;
  const parts = publicUrl.split(marker);
  return parts[1] ?? null;
}
