import { createClient } from '@supabase/supabase-js';
import { Category, Product, Banner, Page } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase.from('categories').select('*').order('order', { ascending: true });
  if (error) { console.error(error); return []; }
  return data || [];
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const { data } = await supabase.from('categories').select('*').eq('slug', slug).single();
  return data;
}

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase.from('products').select('*').eq('active', true).order('created_at', { ascending: false });
  if (error) { console.error(error); return []; }
  return data || [];
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const { data } = await supabase.from('products').select('*').eq('active', true).eq('featured', true).limit(4);
  return data || [];
}

export async function getProductsByCategory(categoryId: string): Promise<Product[]> {
  const { data } = await supabase.from('products').select('*').eq('active', true).eq('category_id', categoryId);
  return data || [];
}

export async function getProductsByBadge(badge: 'new' | 'sale'): Promise<Product[]> {
  const { data } = await supabase.from('products').select('*').eq('active', true).eq('badge', badge);
  return data || [];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const { data } = await supabase.from('products').select('*').eq('slug', slug).single();
  return data;
}

export async function getSiteConfig(): Promise<Record<string, string>> {
  const { data } = await supabase.from('site_config').select('*');
  const map: Record<string, string> = {};
  data?.forEach((row: any) => { map[row.key] = row.value; });
  return map;
}

export async function getActiveBanners(): Promise<Banner[]> {
  const { data } = await supabase.from('banners').select('*').eq('active', true).order('order');
  return data || [];
}

export async function getPages(): Promise<Page[]> {
  const { data } = await supabase.from('pages').select('*').order('title');
  return data || [];
}

export async function getPageBySlug(slug: string): Promise<Page | null> {
  const { data } = await supabase.from('pages').select('*').eq('slug', slug).single();
  return data;
}
