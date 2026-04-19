# Love Memory Space

Web app Next.js + Supabase để lưu giữ hành trình tình yêu của 2 người: landing page đẹp, dashboard riêng tư, upload ảnh/video, timeline, ngày kỷ niệm, nhật ký, thư, địa điểm và bucket list.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Framer Motion
- Supabase Auth + Database + Storage
- React Hook Form
- Zod
- Sonner toast
- Lucide icons

## Chạy local

```bash
npm install
npm run dev
```

Sau đó mở `http://localhost:3000`.

## Thiết lập Supabase

### 1) Tạo project
Tạo một project mới trong Supabase Dashboard.

### 2) Lấy biến môi trường
Vào **Project > Connect** rồi copy:

- Project URL
- Publishable key

Tạo file `.env.local` từ `.env.example`:

```bash
cp .env.example .env.local
```

Điền:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxxxxxxxx
```

### 3) Chạy schema SQL
Mở **SQL Editor** trong Supabase và chạy file:

- `supabase/schema.sql`

File này sẽ:
- tạo bảng
- tạo trigger `updated_at`
- bật RLS
- tạo policy
- tạo 4 buckets:
  - `avatars`
  - `covers`
  - `memories`
  - `attachments`

### 4) Seed dữ liệu mẫu (tùy chọn)
- tạo trước một user bằng đăng ký trong app hoặc trong dashboard Auth
- lấy `id` của user đó trong **Authentication > Users**
- mở `supabase/seed.sql`
- thay `YOUR_AUTH_USER_ID` bằng UUID thật
- chạy file trong SQL Editor

> Bạn cũng có thể bỏ qua bước seed vì app đã có nút **Tạo không gian mẫu** trong dashboard.

## Auth flow

- `/login` dùng email + password
- nếu project bật email confirmation, user cần xác nhận mail trước khi đăng nhập
- route callback: `/auth/callback`

## Cấu trúc chính

- `/`:
  - landing page
  - nếu chưa login thì hiện demo layout
  - nếu đã login thì đọc dữ liệu thật của user
- `/dashboard`:
  - trang quản trị riêng
  - upload và lưu dữ liệu thật
- `/space/[slug]`:
  - trang public nếu `app_settings.is_public = true`

## Những gì đã có trong project

### Landing page
- hero đẹp
- couple profiles
- love story
- timeline
- anniversaries
- gallery
- journals / letters preview
- places
- bucket list
- link public

### Dashboard
- cài đặt landing page
- ảnh cover
- relationship info
- profile của 2 người
- gallery upload nhiều file
- timeline CRUD
- anniversaries CRUD
- journals CRUD
- letters CRUD
- places CRUD
- bucket list CRUD

## Lưu ý về storage

Project này dùng **public buckets** để giữ implementation đơn giản và hiển thị media nhanh bằng URL public.

Buckets hiện tại:
- `avatars`
- `covers`
- `memories`
- `attachments`

Nếu bạn muốn bảo mật media riêng tư chặt hơn:
- chuyển bucket sang private
- dùng signed URL khi render ảnh/file
- hoặc tách public media và private media thành 2 cơ chế khác nhau

## Mobile upload

Form upload đang hoạt động tốt trên trình duyệt mobile:
- chọn ảnh/video từ thư viện điện thoại
- upload trực tiếp lên Supabase Storage
- metadata lưu vào bảng tương ứng

## Giới hạn hiện tại

- upload progress đang ở mức trạng thái `loading`, chưa dùng TUS resumable upload
- gallery hiện hỗ trợ tạo mới + xóa; edit caption có thể thêm tiếp dễ dàng
- attachments đang để public bucket cho đơn giản

## Nếu muốn nâng cấp tiếp

Bạn có thể mở rộng thêm:
- TUS resumable upload cho video lớn
- signed URLs cho media private
- realtime updates
- album filter nâng cao
- map thật cho places
- nhiều user / shared couple accounts
- drag & drop reordering cho timeline và gallery

## Deploy lên Vercel

### 1) Push code lên GitHub
Tạo repo và đẩy project này lên.

### 2) Import vào Vercel
- vào Vercel
- chọn **Add New Project**
- import repo

### 3) Add Environment Variables
Trong Vercel project settings, thêm:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

### 4) Deploy
Sau khi deploy xong, mở app và test:
- sign up / sign in
- tạo dữ liệu
- bật public slug
- truy cập `/space/<slug>`

## Gợi ý workflow dùng thật

1. Đăng ký một tài khoản
2. Vào dashboard
3. Bấm **Tạo không gian mẫu**
4. Sửa lại:
   - tên 2 người
   - ảnh cover
   - avatar
   - câu chuyện
   - timeline
   - gallery
5. Bật `Public mode`
6. Chia sẻ link `/space/your-slug`
