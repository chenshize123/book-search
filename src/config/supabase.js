import { createClient } from '@supabase/supabase-js';

// 请替换为您的 Supabase 项目 URL 和 Anon Key
// 这些值可以从 Supabase 项目设置中获取
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

