import { createClient } from '@supabase/supabase-js';

// Supabase 配置
// 支持通过环境变量覆盖，如果没有环境变量则使用默认值
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://tlspdluwfbjhcgwqxmvw.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'sb_publishable_ZUg6xiEFaHMHQFY57akH5Q_L2Y5ACVM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

