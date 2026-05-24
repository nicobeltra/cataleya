'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { uploadImage, deleteImage } from '@/lib/storage';
import { Category, Product } from '@/lib/types';

function slugify(text: string): string {
  return text.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

export default function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    name: product?.name || '',
    slug: product?.slug || '',
    description: product?.description || '',
    price: product?.price || 0,
    old_price: product?.old_price || 0,
    stock: product?.stock || 0,
    category_id: product?.category_id || '',
    sizes: product?.sizes?.join(', ') || 'S, M, L',
    images: product?.images || [],
    badge: product?.badge || '',
    featured: product?.featured || false,
    active: product?.active ?? true,
  });

  useEffect(() => {
    supabase.from('categories').select('*').order('order').then(({ data }) => setCategories(data || []));
  }, []);

  useEffect(() => {
    if (!product && form.name) {
      setForm((f) => ({ ...f, slug: slugify(f.name) }));
    }
  }, [form.name, product]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setUploading(true);
    const urls: string[] = [];
    for (const file of Array.from(files)) {
      const url = await uploadImage(file, 'products');
      if (url) urls.push(url);
    }
    setForm((f) => ({ ...f, images: [...f.images, ...urls] }));
    setUploading(false);
  };

  const removeImage = async (url: string) => {
    setForm((f) => ({ ...f, images: f.images.filter((u) => u !== url) }));
    await deleteImage(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      name: form.name,
      slug: form.slug,
      description: form.description,
      price: Number(form.price),
      old_price: form.old_price ? Number(form.old_price) : null,
      stock: Number(form.stock),
      category_id: form.category_id || null,
      sizes: form.sizes.split(',').map((s) => s.trim()).filter(Boolean),
      images: form.images,
      badge: form.badge || null,
      featured: form.featured,
      active: form.active,
    };
    const { error } = product
      ? await supabase.from('products').update(payload).eq('id', product.id)
      : await supabase.from('products').insert(payload);
    setSaving(false);
    if (error) alert('Error: ' + error.message);
    else router.push('/admin/productos');
  };

  return (
    <div className="p-6 md:p-10 max-w-4xl">
      <div className="mb-8">
        <button onClick={() => router.back()} className="text-[11px] tracking-[2px] uppercase text-gray hover:text-rose mb-2">← Volver</button>
        <h1 className="font-serif-c text-4xl font-light">{product ? 'Editar producto' : 'Nuevo producto'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 space-y-6">
        <div>
          <label className="block text-[10px] tracking-[3px] uppercase text-gray mb-3">Imágenes</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
            {form.images.map((url) => (
              <div key={url} className="relative aspect-square bg-cream group">
                <img src={url} alt="" className="w-full h-full object-cover" />
                <button type="button" onClick={() => removeImage(url)} className="absolute top-1 right-1 bg-black text-white w-7 h-7 rounded-full opacity-0 group-hover:opacity-100 transition">×</button>
              </div>
            ))}
            <label className="aspect-square border-2 border-dashed border-line flex items-center justify-center cursor-pointer hover:border-rose">
              <input type="file" accept="image/*" multiple onChange={handleUpload} className="hidden" />
              <span className="text-sm text-gray">{uploading ? '...' : '+ Subir'}</span>
            </label>
          </div>
          <p className="text-xs text-gray">La primera imagen es la principal. Recomendado: 800×1000px.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] tracking-[3px] uppercase text-gray mb-2">Nombre *</label>
            <input type="text" required value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border border-line px-4 py-3 text-sm focus:outline-none focus:border-rose" />
          </div>
          <div>
            <label className="block text-[10px] tracking-[3px] uppercase text-gray mb-2">URL (slug) *</label>
            <input type="text" required value={form.slug}
              onChange={(e) => setForm({ ...form, slug: slugify(e.target.value) })}
              className="w-full border border-line px-4 py-3 text-sm focus:outline-none focus:border-rose font-mono" />
          </div>
        </div>

        <div>
          <label className="block text-[10px] tracking-[3px] uppercase text-gray mb-2">Descripción</label>
          <textarea value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            className="w-full border border-line px-4 py-3 text-sm focus:outline-none focus:border-rose" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-[10px] tracking-[3px] uppercase text-gray mb-2">Precio *</label>
            <input type="number" required value={form.price}
              onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
              className="w-full border border-line px-4 py-3 text-sm focus:outline-none focus:border-rose" />
          </div>
          <div>
            <label className="block text-[10px] tracking-[3px] uppercase text-gray mb-2">Precio anterior (oferta)</label>
            <input type="number" value={form.old_price}
              onChange={(e) => setForm({ ...form, old_price: Number(e.target.value) })}
              className="w-full border border-line px-4 py-3 text-sm focus:outline-none focus:border-rose" />
          </div>
          <div>
            <label className="block text-[10px] tracking-[3px] uppercase text-gray mb-2">Stock</label>
            <input type="number" value={form.stock}
              onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
              className="w-full border border-line px-4 py-3 text-sm focus:outline-none focus:border-rose" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] tracking-[3px] uppercase text-gray mb-2">Categoría</label>
            <select value={form.category_id}
              onChange={(e) => setForm({ ...form, category_id: e.target.value })}
              className="w-full border border-line px-4 py-3 text-sm focus:outline-none focus:border-rose">
              <option value="">— Sin categoría —</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] tracking-[3px] uppercase text-gray mb-2">Talles (separados por coma)</label>
            <input type="text" value={form.sizes}
              onChange={(e) => setForm({ ...form, sizes: e.target.value })}
              placeholder="S, M, L, XL"
              className="w-full border border-line px-4 py-3 text-sm focus:outline-none focus:border-rose" />
          </div>
        </div>

        <div>
          <label className="block text-[10px] tracking-[3px] uppercase text-gray mb-2">Etiqueta</label>
          <select value={form.badge}
            onChange={(e) => setForm({ ...form, badge: e.target.value })}
            className="w-full border border-line px-4 py-3 text-sm focus:outline-none focus:border-rose">
            <option value="">— Sin etiqueta —</option>
            <option value="new">Nuevo (aparece en Novedades)</option>
            <option value="sale">Oferta (aparece en Ofertas, requiere precio anterior)</option>
          </select>
        </div>

        <div className="flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
            <span className="text-sm">Destacado en home</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />
            <span className="text-sm">Visible en la tienda</span>
          </label>
        </div>

        <div className="pt-6 border-t border-line flex gap-3">
          <button type="submit" disabled={saving} className="bg-black text-white px-8 py-4 text-[11px] tracking-[3px] uppercase hover:bg-rose transition disabled:opacity-50">
            {saving ? 'Guardando…' : product ? 'Guardar cambios' : 'Crear producto'}
          </button>
          <button type="button" onClick={() => router.push('/admin/productos')} className="border border-line px-8 py-4 text-[11px] tracking-[3px] uppercase hover:bg-cream transition">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
