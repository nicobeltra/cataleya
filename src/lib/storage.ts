import { supabase } from './supabase';

export async function uploadImage(file: File, folder: string = 'products'): Promise<string | null> {
  const ext = file.name.split('.').pop();
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage
    .from('cataleya')
    .upload(fileName, file, { cacheControl: '3600', upsert: false });
  if (error) { console.error('Upload error:', error); return null; }
  const { data } = supabase.storage.from('cataleya').getPublicUrl(fileName);
  return data.publicUrl;
}

export async function deleteImage(url: string): Promise<boolean> {
  try {
    const path = url.split('/cataleya/')[1];
    if (!path) return false;
    const { error } = await supabase.storage.from('cataleya').remove([path]);
    return !error;
  } catch { return false; }
}
