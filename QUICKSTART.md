# 快速开始指南

## 第一步：安装依赖

```bash
npm install
```

## 第二步：配置 Supabase

### 1. 创建 Supabase 项目

访问 [Supabase](https://supabase.com) 并创建一个新项目。

### 2. 执行 SQL 初始化脚本

1. 在 Supabase 控制台中，进入 **SQL Editor**
2. 复制 `supabase-init.sql` 文件中的所有内容
3. 粘贴到 SQL Editor 中并执行

这将创建：
- 3 张数据表（categories, books, book_stocks）
- RLS 策略（允许匿名用户读取数据）
- 示例分类数据

### 3. 获取 API 密钥

1. 在 Supabase 控制台中，进入 **Settings** > **API**
2. 复制以下信息：
   - **Project URL** (例如: `https://xxxxx.supabase.co`)
   - **anon public** key

### 4. 配置环境变量

在项目根目录创建 `.env.local` 文件：

```env
REACT_APP_SUPABASE_URL=你的_Project_URL
REACT_APP_SUPABASE_ANON_KEY=你的_anon_public_key
```

## 第三步：添加测试数据

在 Supabase 控制台的 **Table Editor** 中：

1. **添加分类**（如果还没有）：
   - 进入 `categories` 表
   - 点击 "Insert" 添加分类，例如：小说、科技、历史等

2. **添加图书**：
   - 进入 `books` 表
   - 点击 "Insert" 添加图书信息
   - 填写必填字段：`book_name`（书名）、`author`（作者）
   - 可选字段：`publisher`（出版社）、`publish_date`（出版日期）、`isbn`、`category_id`（选择分类）、`cover_image_url`（封面图 URL）、`intro`（简介）

3. **添加库存信息**（可选）：
   - 进入 `book_stocks` 表
   - 点击 "Insert" 添加库存记录
   - 填写 `book_id`（选择对应的图书）、`stock_count`（库存数量）、`location`（存放位置）

## 第四步：运行项目

```bash
npm start
```

应用将在 http://localhost:3000 运行

## 第五步：测试功能

1. **首页查询**：
   - 在搜索框中输入书名关键词、作者或选择分类
   - 点击"查询"按钮
   - 查看图书列表

2. **分类导航**：
   - 点击顶部的分类标签
   - 查看该分类下的所有图书

3. **查看详情**：
   - 点击任意图书卡片
   - 查看图书详细信息

## 常见问题

### 1. 查询无结果

- 检查 Supabase 中是否有数据
- 检查 RLS 策略是否正确配置
- 检查浏览器控制台是否有错误信息

### 2. 关联查询失败

- 确保外键关系已正确建立
- 在 Supabase 中检查 `books` 表的 `category_id` 字段是否正确关联到 `categories` 表

### 3. 图片不显示

- 确保 `cover_image_url` 是有效的网络图片 URL
- 检查图片 URL 是否支持跨域访问

## 部署到 Netlify

1. 将代码推送到 GitHub
2. 在 Netlify 中连接 GitHub 仓库
3. 配置构建设置：
   - Build command: `npm run build`
   - Publish directory: `build`
4. 添加环境变量：
   - `REACT_APP_SUPABASE_URL`
   - `REACT_APP_SUPABASE_ANON_KEY`
5. 点击 "Deploy site"

部署完成后，您的应用就可以在互联网上访问了！

