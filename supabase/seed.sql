-- Optional demo seed
-- Replace YOUR_AUTH_USER_ID with the UUID of a user already created in auth.users.
-- You can get it from Authentication > Users in Supabase dashboard.

-- example:
-- select id, email from auth.users;

insert into public.app_settings (
  user_id,
  couple_title,
  tagline,
  quote,
  public_slug,
  is_public
) values (
  'YOUR_AUTH_USER_ID',
  'Minh & Nhi',
  'Một nơi để lưu lại mọi điều đáng yêu của hai đứa.',
  'Ở cạnh nhau, những ngày bình thường cũng trở nên đặc biệt.',
  'minh-va-nhi',
  true
)
on conflict (user_id) do update
set
  couple_title = excluded.couple_title,
  tagline = excluded.tagline,
  quote = excluded.quote,
  public_slug = excluded.public_slug,
  is_public = excluded.is_public;

insert into public.relationship_info (
  user_id,
  start_date,
  first_meet_date,
  story,
  love_quote,
  location_label,
  is_public
) values (
  'YOUR_AUTH_USER_ID',
  '2023-08-14',
  '2023-06-27',
  'Từ một cuộc trò chuyện rất ngẫu nhiên, hai người dần quen với việc kể cho nhau nghe mọi điều nhỏ xíu trong ngày.',
  'Cảm ơn vì đã ở đây, và làm mọi ngày trở nên dịu dàng hơn.',
  'TP.HCM',
  true
)
on conflict (user_id) do update
set
  start_date = excluded.start_date,
  first_meet_date = excluded.first_meet_date,
  story = excluded.story,
  love_quote = excluded.love_quote,
  location_label = excluded.location_label,
  is_public = excluded.is_public;

insert into public.profiles (
  user_id,
  role,
  full_name,
  nickname,
  description,
  hobbies,
  favorite_thing,
  adorable_habit,
  is_public,
  sort_order
) values
(
  'YOUR_AUTH_USER_ID',
  'person_a',
  'Minh Anh',
  'Mèo nhỏ',
  'Nhẹ nhàng, tinh tế và lúc nào cũng có một playlist rất hợp tâm trạng.',
  array['Hoa tulip', 'Đồ ngọt', 'Chụp ảnh film'],
  'Cách em nhớ từng điều nhỏ nhặt.',
  'Hay cười khi đang ngại.',
  true,
  1
),
(
  'YOUR_AUTH_USER_ID',
  'person_b',
  'Tuấn Minh',
  'Mặt trời',
  'Luôn mang lại cảm giác an tâm, vui vẻ và rất thích lưu lại kỷ niệm bằng hình ảnh.',
  array['Cà phê sữa đá', 'Road trip', 'Chụp lén'],
  'Cách anh làm mọi chuyến đi thành đáng nhớ.',
  'Hay xoa đầu khi muốn dỗ dành.',
  true,
  2
)
on conflict (user_id, role) do update
set
  full_name = excluded.full_name,
  nickname = excluded.nickname,
  description = excluded.description,
  hobbies = excluded.hobbies,
  favorite_thing = excluded.favorite_thing,
  adorable_habit = excluded.adorable_habit,
  is_public = excluded.is_public,
  sort_order = excluded.sort_order;

insert into public.anniversaries (user_id, title, event_date, note, is_public)
values
('YOUR_AUTH_USER_ID', 'Ngày bắt đầu yêu nhau', '2023-08-14', 'Ngày chính thức có nhau.', true),
('YOUR_AUTH_USER_ID', 'Lần đầu đi chơi cùng nhau', '2023-06-27', 'Một quán nhỏ và rất nhiều điều muốn kể.', true);

insert into public.timeline_events (user_id, title, event_date, description, tag, is_public)
values
('YOUR_AUTH_USER_ID', 'Lần đầu nói chuyện tới khuya', '2023-06-12', 'Bắt đầu bằng vài dòng, rồi thành những cuộc trò chuyện kéo dài mãi không muốn dừng.', 'Tin nhắn', true),
('YOUR_AUTH_USER_ID', 'Buổi hẹn đầu tiên', '2023-06-27', 'Ngại ngùng một chút, dễ thương một chút, nhưng đủ để nhớ mãi.', 'Hẹn hò', true),
('YOUR_AUTH_USER_ID', 'Ngày yêu nhau', '2023-08-14', 'Ngày mọi thứ chính thức có tên gọi.', 'Yêu nhau', true);

insert into public.journal_entries (user_id, title, content, mood, written_by, entry_date, is_public)
values
('YOUR_AUTH_USER_ID', 'Một ngày rất bình thường nhưng rất thương', 'Có những hôm chẳng làm gì đặc biệt, chỉ là đi ăn tối cùng nhau và kể vài chuyện nhỏ, vậy mà vẫn thấy rất hạnh phúc.', 'Bình yên', 'Minh Anh', '2026-03-18', false);

insert into public.letters (user_id, title, content, sender_name, entry_date, is_public)
values
('YOUR_AUTH_USER_ID', 'Cảm ơn vì luôn ở đây', 'Có em rồi, mọi kế hoạch đều thấy có lý do để mong chờ hơn.', 'Tuấn Minh', '2026-02-14', false);

insert into public.places_visited (user_id, place_name, city, visited_at, description, is_memorable, is_public)
values
('YOUR_AUTH_USER_ID', 'Đà Lạt', 'Lâm Đồng', '2025-12-22', 'Chuyến đi đầu đông với rất nhiều ảnh đẹp.', true, true);

insert into public.bucket_list_items (user_id, title, note, status, is_public)
values
('YOUR_AUTH_USER_ID', 'Đi biển ngắm bình minh cùng nhau', 'Có máy ảnh film càng tốt.', 'planned', true),
('YOUR_AUTH_USER_ID', 'Chụp một bộ ảnh thật đẹp', 'Tone ấm, tự nhiên, không diễn quá nhiều.', 'todo', true);
