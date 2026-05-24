'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { uploadImage, deleteImage } from '@/lib/storage';
import { Category } from '@/lib/types';

function slugify(text: string): string {
  return text.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

export default function CategoryForm({ category }: { category?: Category }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    name: category?.name || '',
    slug: category?.slug || '',
    description: category?.description || '',
    image_url: category?.image_url || '',
    order: category?.order || 99,
  });

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const url = await uploadImage(file, 'categories');
    if (url) setForm({ ...form, image_url: url });
    setUploading(false);
  };

  const removeImage = async () => {
    if (form.image_url) await deleteImage(form.image_url);
    setForm({ ...form, image_url: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      name: form.name,
      slug: form.slug || slugify(form.name),
      description: form.description || null,
      image_url: form.image_url || null,
      order: Number(form.order),
    };
    const { error } = category
      ? await supabase.from('categories').update(payload).eq('id', category.id)
      : await supabase.from('categories').insert(payload);
    setSaving(false);
    if (error) alert('Error: ' + error.message);
    else router.push('/admin/categorias');
  };

  return (
    <div className="p-6 md:p-10 max-w-2xl">
      <div className="mb-8">
        <button onClick={() => router.back()} className="text-[11px] tracking-[2px] uppercase text-gray hover:text-rose mb-2">← Volver</button>
        <h1 className="font-serif-c text-4xl font-light">{category ? 'Editar categoría' : 'Nueva categoría'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 space-y-6">
        <div>
          <label className="block text-[10px] tracking-[3px] uppercase text-gray mb-3">Imagen</label>
          {form.image_url ? (
            <div className="relative aspect-[3/4] w-48 bg-cream group">
              <img src={form.image_url} alt="" className="w-full h-full object-cover" />
              <button type="button" onClick={removeImage} className="absolute top-2 right-2 bg-black text-white w-8 h-8 rounded-full">×</button>
            </div>
          ) : (
            <label className="block aspect-[3/4] w-48 border-2 border-dashed border-line flex items-center justify-center cursor-pointer hover:border-rose">
              <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
              <span className="text-sm text-gray text-center">{uploading ? 'Subiendo...' : '+ Subir imagen'}</span>
            </label>
          )}
        </div>

        <div>
          <label className="block text-[10px] tracking-[3px] uppercase text-gray mb-2">Nombre *</label>
          <input type="text" required value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value, slug: category ? form.slug : slugify(e.target.value) })}
            className="w-full border border-line px-4 py-3 text-sm focus:outline-none focus:border-rose" />
        </div>

        <div>
          <label className="block text-[10px] tracking-[3px] uppercase text-gray mb-2">URL (slug)</label>
          <input type="text" value={form.slug}
            onChange={(e) => setForm({ ...form, slug: slugify(e.target.value) })}
            className="w-full border border-line px-4 py-3 text-sm font-mono focus:outline-none focus:border-rose" />
        </div>

        <div>
          <label className="block text-[10px] tracking-[3px] uppercase text-gray mb-2">Descripción</label>
          <textarea value={form.description} rows={3}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full border border-line px-4 py-3 text-sm focus:outline-none focus:border-rose" />
        </div>

        <div>
          <label className="block text-[10px] tracking-[3px] uppercase text-gray mb-2">Orden</label>
          <input type="number" value={form.order}
            onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
            className="w-full md:w-32 border border-line px-4 py-3 text-sm focus:outline-none focus:border-rose" />
        </div>

        <div className="pt-6 border-t border-line flex gap-3">
          <button type="submit" disabled={saving} className="bg-black text-white px-8 py-4 text-[11px] tracking-[3px] uppercase hover:bg-rose transition disabled:opacity-50">
            {saving ? 'Guardando…' : category ? 'Guardar cambios' : 'Crear categoría'}
          </button>
          <button type="button" onClick={() => router.push('/admin/categorias')} className="border border-line px-8 py-4 text-[11px] tracking-[3px] uppercase hover:bg-cream transition">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
