# CodeLab 🚀

Nền tảng học lập trình kiểu Codeforces/CSES với Monaco Editor, Python & C++.

## Tính năng

- ⚡ **Problems** — Bài toán thuật toán với Monaco Editor (Python/C++)
- 🧪 **Test Runner** — Chạy code và xem PASS/FAIL từng test case
- ✏️ **Make** — Tự tạo bài toán với test cases
- 📝 **Posts** — Blog công nghệ với Markdown + LaTeX
- 🔐 **Auth** — Login/Register với Supabase

## Chạy local

```bash
npm install
cp .env.example .env.local
# Điền Supabase keys vào .env.local
npm run dev
```

## Cấu hình

### 1. Supabase
1. Tạo project tại [supabase.com](https://supabase.com)
2. Vào SQL Editor → chạy `supabase/schema.sql`
3. Vào Project Settings → API → copy keys vào `.env.local`

### 2. Judge0 API (chạy code thực tế)
1. Đăng ký tại [RapidAPI Judge0 CE](https://rapidapi.com/judge0-official/api/judge0-ce)
2. Dùng free tier (50 requests/ngày)
3. Copy API key vào `.env.local`

> Không có Judge0 key → app vẫn chạy ở **Demo Mode** (kết quả giả lập)

## Deploy Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Thêm environment variables trên Vercel Dashboard:
# NEXT_PUBLIC_SUPABASE_URL
# NEXT_PUBLIC_SUPABASE_ANON_KEY  
# SUPABASE_SERVICE_ROLE_KEY
# JUDGE0_API_KEY
# JUDGE0_API_URL
# NEXT_PUBLIC_APP_URL (= URL của Vercel app)
```

## Tech Stack

| | |
|---|---|
| Framework | Next.js 16 (App Router) |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Code Editor | Monaco Editor (@monaco-editor/react) |
| Code Execution | Judge0 CE API |
| Markdown | react-markdown + remark-math + rehype-katex |
| Styling | Vanilla CSS (Dark theme) |
| Deploy | Vercel |

## Ngôn ngữ hỗ trợ

- 🐍 **Python 3** (Judge0 language ID: 71)
- ⚙️ **C++ 17** (Judge0 language ID: 54)
