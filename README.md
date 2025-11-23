# 图书快查 - 极简图书信息查询平台

一个基于 React + Supabase + Netlify 的简易图书信息查询平台。

## 功能特性

- 📚 多条件查询（书名关键词、作者、分类）
- 📖 图书列表展示（卡片形式）
- 🔍 图书详情查看
- 🏷️ 分类导航（快速筛选）

## 技术栈

- **前端框架**: React 18
- **路由管理**: React Router v6
- **UI 样式**: 原生 CSS
- **数据库/后端**: Supabase
- **部署平台**: Netlify

## 项目结构

```
book-search/
├── public/
│   └── index.html
├── src/
│   ├── pages/
│   │   ├── HomePage.js          # 首页（查询 + 列表）
│   │   ├── HomePage.css
│   │   ├── BookDetailPage.js    # 图书详情页
│   │   ├── BookDetailPage.css
│   │   ├── CategoryPage.js      # 分类列表页
│   │   └── CategoryPage.css
│   ├── config/
│   │   └── supabase.js          # Supabase 客户端配置
│   ├── App.js                   # 主应用组件
│   ├── App.css
│   ├── index.js                 # 入口文件
│   └── index.css
├── package.json
├── netlify.toml                 # Netlify 部署配置
└── README.md
```

## 安装与运行

### 1. 安装依赖

```bash
npm install
```

### 2. 配置 Supabase

1. 在 Supabase 创建项目
2. 在 Supabase SQL Editor 中执行 `supabase-init.sql` 文件中的 SQL 语句，或者手动创建以下 3 张表：

#### categories 表（先创建）
```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_name TEXT NOT NULL UNIQUE,
  sort_order INT DEFAULT 0
);
```

#### books 表
```sql
CREATE TABLE books (
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
```

#### book_stocks 表
```sql
CREATE TABLE book_stocks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  book_id UUID REFERENCES books(id) ON DELETE CASCADE,
  stock_count INT DEFAULT 0,
  location TEXT
);
```

**注意**: 创建表的顺序很重要，先创建 `categories` 表，再创建 `books` 表，最后创建 `book_stocks` 表。

3. 配置 RLS（行级安全策略）：
   - 所有表对匿名用户开放 SELECT 权限
   - SQL 脚本中已包含 RLS 配置，直接执行即可

4. 创建 `.env.local` 文件：
```env
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. 运行开发服务器

```bash
npm start
```

应用将在 http://localhost:3000 运行

### 4. 构建生产版本

```bash
npm run build
```

## 部署到 Netlify

1. 将代码推送到 GitHub
2. 在 Netlify 中连接 GitHub 仓库
3. 配置构建设置：
   - Build command: `npm run build`
   - Publish directory: `build`
4. 添加环境变量：
   - `REACT_APP_SUPABASE_URL`
   - `REACT_APP_SUPABASE_ANON_KEY`
5. 部署

## 页面说明

### 首页 (/)
- 查询表单（书名、作者、分类）
- 分类导航栏
- 图书列表（卡片网格）

### 图书详情页 (/books/:id)
- 图书详细信息展示
- 封面图、基本信息、库存信息、简介

### 分类列表页 (/category/:id)
- 显示指定分类下的所有图书

## 注意事项

- 确保 Supabase 项目已正确配置 RLS 策略
- 图片 URL 使用网络图片链接
- 数据添加通过 Supabase 后台手动完成

## 许可证

MIT

