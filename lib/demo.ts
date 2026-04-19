import type { SpaceData } from "@/types/domain";

export const demoData: SpaceData = {
  settings: {
    user_id: "demo",
    couple_title: "Minh & Nhi",
    tagline: "Một nơi để lưu lại mọi điều đáng yêu của hai đứa.",
    quote: "Ở cạnh nhau, những ngày bình thường cũng trở nên đặc biệt.",
    hero_image_url: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=1200&q=80",
    public_slug: "minh-va-nhi",
    is_public: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  relationship: {
    id: "demo-rel",
    user_id: "demo",
    start_date: "2023-08-14",
    first_meet_date: "2023-06-27",
    story:
      "Từ một cuộc trò chuyện rất ngẫu nhiên, hai người dần quen với việc kể cho nhau nghe mọi điều nhỏ xíu trong ngày. Rồi một buổi hẹn đầu tiên đã biến những dòng tin nhắn thành một hành trình thật sự.",
    love_quote: "Cảm ơn vì đã ở đây, và làm cho mọi ngày trở nên dịu dàng hơn.",
    location_label: "TP.HCM",
    is_public: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  profiles: [
    {
      id: "p1",
      user_id: "demo",
      role: "person_a",
      full_name: "Minh Anh",
      nickname: "Mèo nhỏ",
      birth_date: "2000-04-12",
      description: "Nhẹ nhàng, tinh tế và lúc nào cũng có một playlist rất hợp tâm trạng.",
      hobbies: ["Hoa tulip", "Đồ ngọt", "Chụp ảnh film"],
      favorite_thing: "Cách em nhớ từng điều nhỏ nhặt.",
      adorable_habit: "Hay cười khi đang ngại.",
      avatar_url: null,
      is_public: true,
      sort_order: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: "p2",
      user_id: "demo",
      role: "person_b",
      full_name: "Tuấn Minh",
      nickname: "Mặt trời",
      birth_date: "1998-09-28",
      description: "Luôn mang lại cảm giác an tâm, vui vẻ và rất thích lưu lại kỷ niệm bằng hình ảnh.",
      hobbies: ["Cà phê sữa đá", "Road trip", "Chụp lén"],
      favorite_thing: "Cách anh làm mọi chuyến đi thành đáng nhớ.",
      adorable_habit: "Hay xoa đầu khi muốn dỗ dành.",
      avatar_url: null,
      is_public: true,
      sort_order: 2,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ],
  anniversaries: [
    {
      id: "a1",
      user_id: "demo",
      title: "Ngày bắt đầu yêu nhau",
      event_date: "2023-08-14",
      note: "Ngày chính thức có nhau.",
      is_public: true,
      sort_order: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: "a2",
      user_id: "demo",
      title: "Lần đầu đi chơi cùng nhau",
      event_date: "2023-06-27",
      note: "Một quán nhỏ và rất nhiều điều muốn kể.",
      is_public: true,
      sort_order: 2,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ],
  timeline: [
    {
      id: "t1",
      user_id: "demo",
      title: "Lần đầu nói chuyện tới khuya",
      event_date: "2023-06-12",
      description: "Bắt đầu bằng vài dòng, rồi thành những cuộc trò chuyện kéo dài mãi không muốn dừng.",
      media_url: null,
      media_bucket_path: null,
      tag: "Tin nhắn",
      is_public: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: "t2",
      user_id: "demo",
      title: "Buổi hẹn đầu tiên",
      event_date: "2023-06-27",
      description: "Ngại ngùng một chút, dễ thương một chút, nhưng đủ để nhớ mãi.",
      media_url: null,
      media_bucket_path: null,
      tag: "Hẹn hò",
      is_public: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: "t3",
      user_id: "demo",
      title: "Ngày yêu nhau",
      event_date: "2023-08-14",
      description: "Ngày mọi thứ chính thức có tên gọi.",
      media_url: null,
      media_bucket_path: null,
      tag: "Yêu nhau",
      is_public: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ],
  gallery: [
    {
      id: "g1",
      user_id: "demo",
      title: "Buổi chiều đầu tiên",
      caption: "Một tấm hình rất bình thường nhưng xem lại luôn thấy dịu.",
      media_url: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=1200&q=80",
      media_bucket_path: null,
      media_type: "image",
      album: "Hẹn hò",
      taken_at: "2023-06-27T18:00:00.000Z",
      is_favorite: true,
      is_public: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: "g2",
      user_id: "demo",
      title: "Road trip đầu tiên",
      caption: "Một ngày rất gió và rất vui.",
      media_url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80",
      media_bucket_path: null,
      media_type: "image",
      album: "Du lịch",
      taken_at: "2024-01-14T18:00:00.000Z",
      is_favorite: false,
      is_public: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ],
  journals: [
    {
      id: "j1",
      user_id: "demo",
      title: "Một ngày rất bình thường nhưng rất thương",
      content: "Có những hôm chẳng làm gì đặc biệt, chỉ là đi ăn tối cùng nhau và kể vài chuyện nhỏ, vậy mà vẫn thấy rất hạnh phúc.",
      mood: "Bình yên",
      written_by: "Minh Anh",
      entry_date: "2026-03-18",
      attachment_url: null,
      attachment_bucket_path: null,
      is_public: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ],
  letters: [
    {
      id: "l1",
      user_id: "demo",
      title: "Cảm ơn vì luôn ở đây",
      content: "Có em rồi, mọi kế hoạch đều thấy có lý do để mong chờ hơn.",
      sender_name: "Tuấn Minh",
      entry_date: "2026-02-14",
      attachment_url: null,
      attachment_bucket_path: null,
      is_public: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ],
  places: [
    {
      id: "pl1",
      user_id: "demo",
      place_name: "Đà Lạt",
      city: "Lâm Đồng",
      visited_at: "2025-12-22",
      description: "Chuyến đi đầu đông với rất nhiều ảnh đẹp.",
      image_url: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=1200&q=80",
      image_bucket_path: null,
      is_memorable: true,
      is_public: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ],
  bucketList: [
    {
      id: "b1",
      user_id: "demo",
      title: "Đi biển ngắm bình minh cùng nhau",
      note: "Có máy ảnh film càng tốt.",
      status: "planned",
      target_date: null,
      is_public: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: "b2",
      user_id: "demo",
      title: "Chụp một bộ ảnh thật đẹp",
      note: "Tone ấm, tự nhiên, không diễn quá nhiều.",
      status: "todo",
      target_date: null,
      is_public: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ]
}
