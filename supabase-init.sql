-- 图书快查平台 - Supabase 数据库初始化脚本
-- 请按顺序执行以下 SQL 语句

-- 1. 创建 categories 表（图书分类表）
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_name TEXT NOT NULL UNIQUE,
  sort_order INT DEFAULT 0
);

-- 2. 创建 books 表（图书核心信息表）
CREATE TABLE IF NOT EXISTS books (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  book_name TEXT NOT NULL,
  author TEXT NOT NULL,
  publisher TEXT,
  publish_date DATE,
  isbn TEXT UNIQUE,
  category_id UUID REFERENCES categories(id),
  cover_image_url TEXT,
  intro TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 3. 创建 book_stocks 表（图书库存表）
CREATE TABLE IF NOT EXISTS book_stocks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  book_id UUID REFERENCES books(id) ON DELETE CASCADE,
  stock_count INT DEFAULT 0,
  location TEXT
);

-- 4. 配置 RLS（行级安全策略）- 允许匿名用户读取所有表
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE book_stocks ENABLE ROW LEVEL SECURITY;

-- 创建策略：允许匿名用户读取 categories 表
CREATE POLICY "Allow anonymous read access on categories"
  ON categories FOR SELECT
  TO anon
  USING (true);

-- 创建策略：允许匿名用户读取 books 表
CREATE POLICY "Allow anonymous read access on books"
  ON books FOR SELECT
  TO anon
  USING (true);

-- 创建策略：允许匿名用户读取 book_stocks 表
CREATE POLICY "Allow anonymous read access on book_stocks"
  ON book_stocks FOR SELECT
  TO anon
  USING (true);

-- 5. 插入示例分类数据（可选）
INSERT INTO categories (category_name, sort_order) VALUES
  ('小说', 1),
  ('科技', 2),
  ('历史', 3),
  ('文学', 4),
  ('艺术', 5),
  ('教育', 6)
ON CONFLICT (category_name) DO NOTHING;

-- 6. 插入示例图书数据（可选）
-- 注意：需要先获取分类的 ID，这里使用示例 UUID，实际使用时请替换为真实的分类 ID
-- INSERT INTO books (book_name, author, publisher, category_id, intro) VALUES
--   ('示例图书1', '作者1', '出版社1', (SELECT id FROM categories WHERE category_name = '小说' LIMIT 1), '这是一本示例图书');

