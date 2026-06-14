-- ============================================================
-- CodeLab - Supabase Schema
-- Chạy SQL này trong Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- PROBLEMS
-- ============================================================
CREATE TABLE IF NOT EXISTS problems (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  input_format text DEFAULT '',
  output_format text DEFAULT '',
  constraints text DEFAULT '',
  difficulty text CHECK (difficulty IN ('Easy', 'Medium', 'Hard')) DEFAULT 'Easy',
  category text DEFAULT 'Algorithms',
  time_limit int DEFAULT 1000,        -- milliseconds
  memory_limit int DEFAULT 256,       -- MB
  author_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  author text DEFAULT 'Admin',
  is_public boolean DEFAULT true,
  solved_count int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================================
-- TEST CASES
-- ============================================================
CREATE TABLE IF NOT EXISTS test_cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  problem_id uuid REFERENCES problems(id) ON DELETE CASCADE,
  input text NOT NULL DEFAULT '',
  expected_output text NOT NULL,
  is_sample boolean DEFAULT false,
  order_index int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- ============================================================
-- SUBMISSIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  problem_id uuid REFERENCES problems(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  language text CHECK (language IN ('python', 'cpp')) NOT NULL,
  code text NOT NULL,
  status text DEFAULT 'pending',   -- 'AC','WA','TLE','MLE','CE','RE','pending'
  score int DEFAULT 0,             -- 0-100
  time_ms float,
  memory_kb int,
  created_at timestamptz DEFAULT now()
);

-- ============================================================
-- POSTS
-- ============================================================
CREATE TABLE IF NOT EXISTS posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,           -- Markdown
  author_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  author text DEFAULT 'Anonymous',
  tags text[] DEFAULT '{}',
  likes int DEFAULT 0,
  views int DEFAULT 0,
  is_published boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================================
-- POST LIKES (để tránh like 2 lần)
-- ============================================================
CREATE TABLE IF NOT EXISTS post_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(post_id, user_id)
);

-- ============================================================
-- USER PROFILES
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  bio text DEFAULT '',
  avatar_url text,
  problems_solved int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- Problems: public readable
ALTER TABLE problems ENABLE ROW LEVEL SECURITY;
CREATE POLICY "problems_read" ON problems FOR SELECT USING (is_public = true);
CREATE POLICY "problems_insert" ON problems FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "problems_update" ON problems FOR UPDATE USING (author_id = auth.uid());

-- Test cases: public readable
ALTER TABLE test_cases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "testcases_read" ON test_cases FOR SELECT USING (true);
CREATE POLICY "testcases_write" ON test_cases FOR ALL USING (
  EXISTS (SELECT 1 FROM problems WHERE id = test_cases.problem_id AND author_id = auth.uid())
);

-- Submissions: own only
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "submissions_own" ON submissions FOR ALL USING (user_id = auth.uid());

-- Posts: public readable
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "posts_read" ON posts FOR SELECT USING (is_published = true);
CREATE POLICY "posts_insert" ON posts FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "posts_update" ON posts FOR UPDATE USING (author_id = auth.uid());

-- Profiles: public readable
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_read" ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles_own" ON profiles FOR UPDATE USING (id = auth.uid());

-- ============================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (id, username)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1))
  )
  ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- SEED DATA (Problems)
-- ============================================================
INSERT INTO problems (title, description, input_format, output_format, constraints, difficulty, category, solved_count)
VALUES
(
  'Hello World',
  E'# Hello World\n\nViết chương trình in ra màn hình dòng chữ **"Hello, World!"**\n\nĐây là bài đầu tiên dành cho những bạn mới bắt đầu.',
  'Không có input.',
  'In ra một dòng: `Hello, World!`',
  '- Không có ràng buộc đặc biệt.',
  'Easy', 'Basics', 1024
),
(
  'Sum of Two Numbers',
  E'# Sum of Two Numbers\n\nCho hai số nguyên $a$ và $b$. Hãy tính tổng $a + b$.',
  'Một dòng chứa hai số nguyên $a$ và $b$ $(1 \\le a, b \\le 10^9)$.',
  'In ra một số nguyên duy nhất là tổng $a + b$.',
  E'- $1 \\le a, b \\le 10^9$',
  'Easy', 'Math', 856
);
