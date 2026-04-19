"use client";

import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import { motion } from "framer-motion";
import {
  CalendarDays,
  Camera,
  Heart,
  ListTodo,
  MapPin,
  MessageSquareText,
  Sparkles,
  UploadCloud
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionHeading } from "@/components/ui/section-heading";
import { cn, formatDate, getDaysTogether, initials } from "@/lib/utils";
import type { SpaceData } from "@/types/domain";

function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = React.useState(0);

  React.useEffect(() => {
    let frame = 0;
    const totalFrames = 36;
    const increment = value / totalFrames;

    const id = window.setInterval(() => {
      frame += 1;
      if (frame >= totalFrames) {
        setDisplay(value);
        window.clearInterval(id);
        return;
      }
      setDisplay(Math.round(increment * frame));
    }, 24);

    return () => window.clearInterval(id);
  }, [value]);

  return <>{display}</>;
}

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: "easeOut" } }
};

const stagger = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08
    }
  }
};

export function SpacePage({
  data,
  canManage = false
}: {
  data: SpaceData;
  canManage?: boolean;
}) {
  const daysTogether = getDaysTogether(data.relationship?.start_date);

  const stats = [
    {
      label: "Ngày bên nhau",
      value: daysTogether,
      icon: Heart
    },
    {
      label: "Ảnh & video",
      value: data.gallery.length,
      icon: Camera
    },
    {
      label: "Địa điểm đã đi",
      value: data.places.length,
      icon: MapPin
    },
    {
      label: "Bucket list",
      value: data.bucketList.length,
      icon: ListTodo
    }
  ];

  const gallery = data.gallery.slice(0, 8);
  const journals = data.journals.slice(0, 3);
  const letters = data.letters.slice(0, 2);
  const timeline = data.timeline.slice(0, 5);

  return (
    <div className="pb-20">
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-8 sm:px-6 lg:px-8">
        <section className="hero-mesh section-shell relative overflow-hidden">
          <div className="grid gap-6 p-6 md:grid-cols-[1.1fr_0.9fr] md:p-10">
            <motion.div initial="hidden" animate="show" variants={stagger} className="relative z-10 flex flex-col justify-between gap-8">
              <div>
                <motion.div variants={fadeUp}>
                  <Badge variant="soft" className="mb-5 rounded-full px-4 py-2 text-[11px] uppercase tracking-[0.26em] text-blush-700">
                    <Sparkles className="mr-2 h-3.5 w-3.5" />
                    Album tình yêu số của hai người
                  </Badge>
                </motion.div>
                <motion.h1
                  variants={fadeUp}
                  className="max-w-4xl text-4xl font-semibold tracking-tight text-slate-900 md:text-7xl"
                >
                  {data.settings?.couple_title || "Love Memory Space"}
                </motion.h1>
                <motion.p
                  variants={fadeUp}
                  className="mt-5 max-w-2xl text-base leading-8 text-slate-600 md:text-lg"
                >
                  {data.settings?.tagline ||
                    "Một nơi để lưu lại những ngày đẹp nhất, các cột mốc quan trọng, ảnh, video, thư từ và tất cả điều dễ thương của hai đứa."}
                </motion.p>

                <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-3">
                  <a href="#timeline">
                    <Button size="lg">Xem hành trình</Button>
                  </a>
                  {canManage ? (
                    <Link href="/dashboard">
                      <Button variant="secondary" size="lg">
                        <UploadCloud className="mr-2 h-4 w-4" />
                        Vào dashboard quản lý
                      </Button>
                    </Link>
                  ) : (
                    <Link href="/login">
                      <Button variant="secondary" size="lg">
                        Đăng nhập để thêm kỷ niệm
                      </Button>
                    </Link>
                  )}
                </motion.div>

                <motion.div
                  variants={stagger}
                  className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
                >
                  {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                      <motion.div variants={fadeUp} key={stat.label}>
                        <Card className="h-full rounded-[24px] border-white/80 bg-white/75">
                          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-blush-100 text-blush-700">
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="text-3xl font-semibold text-slate-900">
                            <AnimatedNumber value={stat.value} />
                          </div>
                          <p className="mt-1 text-sm text-slate-600">{stat.label}</p>
                        </Card>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </div>

              <motion.div variants={fadeUp}>
                <Card className="rounded-[24px] bg-white/70">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blush-700">
                        Lời nhắn của tụi mình
                      </p>
                      <p className="mt-2 max-w-xl text-sm leading-7 text-slate-600">
                        {data.settings?.quote || data.relationship?.love_quote || "Cảm ơn vì đã ở đây, và làm cho mọi ngày bình thường trở nên đáng nhớ hơn."}
                      </p>
                    </div>
                    {data.relationship?.start_date ? (
                      <Badge className="rounded-full px-4 py-2">
                        Bắt đầu từ {formatDate(data.relationship.start_date)}
                      </Badge>
                    ) : null}
                  </div>
                </Card>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="relative z-10 overflow-hidden rounded-[32px] border border-white/70 bg-white/80 p-4 shadow-soft"
            >
              <div className="relative h-[520px] overflow-hidden rounded-[28px] bg-gradient-to-br from-blush-100 via-white to-sand-100">
                {data.settings?.hero_image_url ? (
                  <Image
                    fill
                    src={data.settings.hero_image_url}
                    alt="Ảnh cover của hai bạn"
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 45vw"
                  />
                ) : (
                  <div className="grid h-full place-items-center bg-grid-soft p-8 text-center">
                    <div>
                      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-white/80 text-blush-700 shadow-soft">
                        <Heart className="h-7 w-7" />
                      </div>
                      <h3 className="text-3xl font-semibold text-slate-900">
                        Ảnh cover của hai đứa
                      </h3>
                      <p className="mx-auto mt-3 max-w-sm text-sm leading-7 text-slate-600">
                        Khi upload ảnh cover trong dashboard, khu vực này sẽ tự động hiển thị.
                      </p>
                    </div>
                  </div>
                )}

                <div className="absolute inset-x-0 bottom-0 p-5">
                  <div className="rounded-[24px] border border-white/50 bg-white/70 p-4 backdrop-blur-xl">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blush-700">
                          Countdown tình yêu
                        </p>
                        <h3 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
                          <AnimatedNumber value={daysTogether} /> ngày bên nhau
                        </h3>
                      </div>
                      {data.relationship?.location_label ? (
                        <Badge variant="soft" className="rounded-full px-4 py-2">
                          <MapPin className="mr-2 h-3.5 w-3.5" />
                          {data.relationship.location_label}
                        </Badge>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <motion.section id="story" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.25 }} variants={stagger}>
          <SectionHeading
            kicker="Câu chuyện"
            title="Mỗi mối quan hệ đẹp đều có một khởi đầu rất riêng."
            description="Phần này đọc từ dữ liệu thật: ngày đầu gặp nhau, ngày bắt đầu yêu, câu chuyện chung và các cột mốc có thể thêm tiếp theo thời gian."
          />

          <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
            <motion.div variants={fadeUp}>
              <Card className="h-full rounded-[32px] p-6 md:p-8">
                <div className="grid gap-6 md:grid-cols-2">
                  {data.profiles.length > 0 ? (
                    data.profiles.map((profile) => (
                      <div key={profile.id} className="rounded-[26px] bg-white/70 p-5">
                        <div className="mb-4 flex items-center gap-4">
                          <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-[22px] bg-gradient-to-br from-blush-200 to-white text-lg font-semibold text-blush-700">
                            {profile.avatar_url ? (
                              <Image
                                fill
                                src={profile.avatar_url}
                                alt={profile.full_name}
                                className="object-cover"
                                sizes="64px"
                              />
                            ) : (
                              initials(profile.full_name)
                            )}
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold text-slate-900">{profile.full_name}</h3>
                            <p className="text-sm text-slate-500">{profile.nickname || "Người thương của bạn"}</p>
                          </div>
                        </div>
                        <p className="text-sm leading-7 text-slate-600">{profile.description || "Thêm mô tả riêng cho người này trong dashboard."}</p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {profile.hobbies?.map((hobby) => (
                            <Badge key={hobby} variant="soft">
                              {hobby}
                            </Badge>
                          ))}
                        </div>
                        {profile.favorite_thing ? (
                          <p className="mt-4 rounded-[20px] bg-blush-50 p-4 text-sm leading-7 text-slate-700">
                            <span className="font-semibold text-blush-700">Điều mình yêu nhất:</span>{" "}
                            {profile.favorite_thing}
                          </p>
                        ) : null}
                      </div>
                    ))
                  ) : (
                    <EmptyState
                      title="Chưa có hồ sơ"
                      description="Sau khi đăng nhập, bạn có thể thêm hồ sơ của cả hai ở dashboard."
                    />
                  )}
                </div>
              </Card>
            </motion.div>

            <motion.div variants={fadeUp}>
              <Card className="h-full rounded-[32px] p-6 md:p-8">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blush-100 text-blush-700">
                    <MessageSquareText className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blush-700">
                      Love story
                    </p>
                    <h3 className="text-2xl font-semibold text-slate-900">
                      {data.relationship?.first_meet_date
                        ? `Gặp nhau từ ${formatDate(data.relationship.first_meet_date)}`
                        : "Không gian kể chuyện của hai bạn"}
                    </h3>
                  </div>
                </div>
                <p className="text-sm leading-8 text-slate-600 md:text-base">
                  {data.relationship?.story ||
                    "Tại đây bạn có thể lưu lại câu chuyện của hai người: gặp nhau ra sao, bắt đầu nhắn tin như thế nào, buổi hẹn đầu tiên, ngày yêu nhau và mọi khoảnh khắc muốn nhớ lâu."}
                </p>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <Card className="rounded-[24px] bg-blush-50/80 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blush-700">
                      First meet
                    </p>
                    <p className="mt-2 text-base font-semibold text-slate-900">
                      {formatDate(data.relationship?.first_meet_date)}
                    </p>
                  </Card>
                  <Card className="rounded-[24px] bg-white/90 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blush-700">
                      Start date
                    </p>
                    <p className="mt-2 text-base font-semibold text-slate-900">
                      {formatDate(data.relationship?.start_date)}
                    </p>
                  </Card>
                </div>
              </Card>
            </motion.div>
          </div>
        </motion.section>

        <motion.section id="timeline" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.25 }} variants={stagger}>
          <SectionHeading
            kicker="Timeline"
            title="Những cột mốc sẽ luôn còn ở đây, và có thể tiếp tục thêm mãi."
            description="Timeline dùng dữ liệu thật từ database. Bạn có thể upload ảnh cho từng mốc, chỉnh sửa hoặc xóa ngay trong dashboard."
          />

          {timeline.length === 0 ? (
            <EmptyState
              title="Chưa có cột mốc nào"
              description="Hãy vào dashboard và thêm những ngày quan trọng đầu tiên của hai bạn."
            />
          ) : (
            <Card className="rounded-[32px] p-6 md:p-8">
              <div className="relative">
                <div className="absolute left-5 top-2 hidden h-[calc(100%-1rem)] w-px bg-gradient-to-b from-blush-200 via-blush-100 to-transparent md:block" />
                <div className="grid gap-5">
                  {timeline.map((item) => (
                    <motion.div
                      variants={fadeUp}
                      key={item.id}
                      className="grid gap-4 md:grid-cols-[3rem_1fr]"
                    >
                      <div className="hidden md:flex">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-blush-700 shadow-soft">
                          <Heart className="h-4 w-4" />
                        </div>
                      </div>
                      <Card className="rounded-[28px] bg-white/70">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blush-700">
                              {formatDate(item.event_date)}
                            </p>
                            <h3 className="mt-2 text-xl font-semibold text-slate-900">{item.title}</h3>
                          </div>
                          {item.tag ? <Badge variant="soft">{item.tag}</Badge> : null}
                        </div>
                        {item.description ? (
                          <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
                        ) : null}
                        {item.media_url ? (
                          <div className="relative mt-4 h-52 overflow-hidden rounded-[24px]">
                            <Image
                              fill
                              src={item.media_url}
                              alt={item.title}
                              className="object-cover"
                              sizes="(max-width: 768px) 100vw, 50vw"
                            />
                          </div>
                        ) : null}
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            </Card>
          )}
        </motion.section>

        <motion.section initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.25 }} variants={stagger}>
          <SectionHeading
            kicker="Kỷ niệm"
            title="Ngày kỷ niệm sẽ được hiển thị gọn gàng và rất dễ xem."
            description="Bạn có thể thêm ngày yêu nhau, sinh nhật, chuyến đi đầu tiên hoặc bất kỳ cột mốc nào khác."
          />
          {data.anniversaries.length === 0 ? (
            <EmptyState
              title="Chưa có ngày kỷ niệm"
              description="Thêm ngày quan trọng trong dashboard để landing page tự động hiển thị."
            />
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {data.anniversaries.slice(0, 8).map((item) => (
                <motion.div key={item.id} variants={fadeUp}>
                  <Card className="h-full rounded-[28px]">
                    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-blush-100 text-blush-700">
                      <CalendarDays className="h-5 w-5" />
                    </div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blush-700">
                      {formatDate(item.event_date)}
                    </p>
                    <h3 className="mt-2 text-lg font-semibold text-slate-900">{item.title}</h3>
                    {item.note ? (
                      <p className="mt-3 text-sm leading-7 text-slate-600">{item.note}</p>
                    ) : null}
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.section>

        <motion.section id="gallery" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={stagger}>
          <SectionHeading
            kicker="Gallery"
            title="Ảnh và video được trình bày như một album nhẹ nhàng, hiện đại và rất dễ lướt trên điện thoại."
            description="Bản đầy đủ cho phép upload ảnh/video, chọn album, ghi caption và đánh dấu ảnh nổi bật."
          />

          {gallery.length === 0 ? (
            <EmptyState
              title="Chưa có ảnh hoặc video"
              description="Thêm media trong dashboard để landing page tự tạo gallery."
            />
          ) : (
            <Card className="rounded-[32px] p-4 md:p-5">
              <div className="grid auto-rows-[180px] gap-4 md:grid-cols-2 xl:grid-cols-4">
                {gallery.map((item, index) => (
                  <motion.div
                    variants={fadeUp}
                    key={item.id}
                    className={cn(
                      "group relative overflow-hidden rounded-[28px]",
                      index === 0 && "xl:col-span-2 xl:row-span-2 min-h-[240px]",
                      index === 3 && "xl:row-span-2"
                    )}
                  >
                    {item.media_type === "video" ? (
                      <div className="flex h-full min-h-[180px] items-center justify-center bg-gradient-to-br from-blush-100 via-white to-sand-100">
                        <Camera className="h-10 w-10 text-blush-700" />
                      </div>
                    ) : (
                      <Image
                        fill
                        src={item.media_url}
                        alt={item.title || item.caption || "Gallery image"}
                        className="object-cover transition duration-300 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
                      />
                    )}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent p-4 text-white">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold">{item.title || item.album || "Kỷ niệm đẹp"}</p>
                          {item.caption ? (
                            <p className="mt-1 line-clamp-2 text-xs text-white/85">{item.caption}</p>
                          ) : null}
                        </div>
                        {item.is_favorite ? <Badge>Yêu thích</Badge> : null}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          )}
        </motion.section>

        <motion.section initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={stagger}>
          <SectionHeading
            kicker="Nhật ký & thư"
            title="Không chỉ ảnh, những điều muốn kể và muốn giữ cũng có chỗ của riêng mình."
            description="Nhật ký và thư riêng tư mặc định không hiện ở landing page, nhưng bạn có thể bật chia sẻ công khai nếu muốn."
          />
          <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
            <motion.div variants={fadeUp}>
              {journals.length === 0 ? (
                <EmptyState
                  title="Chưa có nhật ký công khai"
                  description="Bạn vẫn có thể lưu nhật ký riêng tư trong dashboard và chỉ mở công khai khi muốn."
                />
              ) : (
                <div className="grid gap-4">
                  {journals.map((item) => (
                    <Card key={item.id} className="rounded-[28px]">
                      <Badge variant="soft">{item.mood || "Nhật ký"}</Badge>
                      <h3 className="mt-3 text-xl font-semibold text-slate-900">{item.title}</h3>
                      <p className="mt-3 text-sm leading-7 text-slate-600">{item.content}</p>
                      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                        <span>{formatDate(item.entry_date)}</span>
                        {item.written_by ? <span>• {item.written_by}</span> : null}
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </motion.div>

            <motion.div variants={fadeUp}>
              {letters.length === 0 ? (
                <EmptyState
                  title="Chưa có thư công khai"
                  description="Có thể lưu thư riêng tư hoặc chọn chia sẻ vài lá thư nổi bật lên landing page."
                />
              ) : (
                <div className="grid gap-4">
                  {letters.map((item) => (
                    <Card key={item.id} className="rounded-[28px] bg-gradient-to-br from-white to-blush-50/70">
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blush-700">
                        Từ {item.sender_name || "người thương"}
                      </p>
                      <h3 className="mt-3 text-xl font-semibold text-slate-900">{item.title}</h3>
                      <p className="mt-3 text-sm leading-7 text-slate-600">{item.content}</p>
                      <p className="mt-4 text-xs text-slate-500">{formatDate(item.entry_date)}</p>
                    </Card>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </motion.section>

        <motion.section initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={stagger}>
          <SectionHeading
            kicker="Địa điểm & kế hoạch"
            title="Những nơi đã đi và những điều còn muốn làm cùng nhau."
            description="Địa điểm và bucket list đều lấy từ dữ liệu thật, có thể cập nhật từ điện thoại bất cứ lúc nào."
          />

          <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
            <motion.div variants={fadeUp}>
              {data.places.length === 0 ? (
                <EmptyState
                  title="Chưa có địa điểm"
                  description="Hãy thêm những nơi hai bạn từng đi qua để landing page sống động hơn."
                />
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {data.places.slice(0, 4).map((place) => (
                    <Card key={place.id} className="overflow-hidden rounded-[28px] p-0">
                      <div className="relative h-52 bg-gradient-to-br from-blush-100 via-white to-sand-100">
                        {place.image_url ? (
                          <Image
                            fill
                            src={place.image_url}
                            alt={place.place_name}
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 50vw"
                          />
                        ) : (
                          <div className="grid h-full place-items-center">
                            <MapPin className="h-10 w-10 text-blush-700" />
                          </div>
                        )}
                      </div>
                      <div className="p-5">
                        <div className="flex items-center justify-between gap-3">
                          <h3 className="text-xl font-semibold text-slate-900">{place.place_name}</h3>
                          {place.is_memorable ? <Badge>Đáng nhớ</Badge> : null}
                        </div>
                        <p className="mt-2 text-sm text-slate-500">
                          {[place.city, place.visited_at ? formatDate(place.visited_at) : null]
                            .filter(Boolean)
                            .join(" • ")}
                        </p>
                        {place.description ? (
                          <p className="mt-3 text-sm leading-7 text-slate-600">{place.description}</p>
                        ) : null}
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </motion.div>

            <motion.div variants={fadeUp}>
              {data.bucketList.length === 0 ? (
                <EmptyState
                  title="Chưa có kế hoạch chung"
                  description="Thêm bucket list để landing page có thêm mục tiêu tương lai."
                />
              ) : (
                <div className="grid gap-4">
                  {data.bucketList.slice(0, 6).map((item) => (
                    <Card key={item.id} className="rounded-[28px]">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                          {item.note ? (
                            <p className="mt-2 text-sm leading-7 text-slate-600">{item.note}</p>
                          ) : null}
                        </div>
                        <Badge variant={item.status === "done" ? "success" : "soft"}>
                          {item.status}
                        </Badge>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </motion.section>

        <section id="dashboard-preview">
          <Card className="overflow-hidden rounded-[36px] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-0 text-white">
            <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
              <div className="p-8 md:p-10">
                <Badge className="bg-white/10 text-white">Dashboard thật sự</Badge>
                <h2 className="mt-5 text-3xl font-semibold tracking-tight md:text-5xl">
                  Upload ảnh, video, timeline, nhật ký và lưu dữ liệu thật bằng Supabase.
                </h2>
                <p className="mt-5 max-w-xl text-sm leading-8 text-slate-300 md:text-base">
                  Phần dashboard đã có sẵn trong project này: đăng nhập, quản lý hồ sơ, ảnh cover, gallery, timeline, ngày kỷ niệm, nhật ký, thư, địa điểm và bucket list. Tất cả đều lưu lại được sau khi refresh hoặc đổi thiết bị.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  {canManage ? (
                    <Link href="/dashboard">
                      <Button className="bg-white text-slate-900 hover:bg-slate-100">
                        Mở dashboard ngay
                      </Button>
                    </Link>
                  ) : (
                    <Link href="/login">
                      <Button className="bg-white text-slate-900 hover:bg-slate-100">
                        Đăng nhập để bắt đầu
                      </Button>
                    </Link>
                  )}
                  {data.settings?.public_slug ? (
                    <Link href={`/space/${data.settings.public_slug}`}>
                      <Button variant="ghost" className="border border-white/20 text-white hover:bg-white/10">
                        Xem link public
                      </Button>
                    </Link>
                  ) : null}
                </div>
              </div>

              <div className="border-t border-white/10 bg-white/5 p-6 md:p-8 lg:border-l lg:border-t-0">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Card className="rounded-[28px] bg-white/10 text-white">
                    <p className="text-xs uppercase tracking-[0.24em] text-blush-200">Hồ sơ</p>
                    <p className="mt-3 text-sm text-slate-200">Quản lý thông tin của cả hai, avatar, quote, story và public slug.</p>
                  </Card>
                  <Card className="rounded-[28px] bg-white/10 text-white">
                    <p className="text-xs uppercase tracking-[0.24em] text-blush-200">Gallery</p>
                    <p className="mt-3 text-sm text-slate-200">Upload ảnh/video trực tiếp từ điện thoại hoặc desktop.</p>
                  </Card>
                  <Card className="rounded-[28px] bg-white/10 text-white">
                    <p className="text-xs uppercase tracking-[0.24em] text-blush-200">Timeline</p>
                    <p className="mt-3 text-sm text-slate-200">Thêm cột mốc với ngày tháng, mô tả và media riêng.</p>
                  </Card>
                  <Card className="rounded-[28px] bg-white/10 text-white">
                    <p className="text-xs uppercase tracking-[0.24em] text-blush-200">Journal</p>
                    <p className="mt-3 text-sm text-slate-200">Viết nhật ký, thư riêng tư và chọn mục nào được chia sẻ công khai.</p>
                  </Card>
                </div>
              </div>
            </div>
          </Card>
        </section>
      </main>
    </div>
  );
}
