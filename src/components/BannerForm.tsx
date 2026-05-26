'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { uploadImage, deleteImage } from '@/lib/storage';
import { Banner, Category, Product } from '@/lib/types';

type LinkType = 'category' | 'product' | 'custom';

export default function BannerForm({ banner }: { banner?: Banner }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [uploadingMobile, setUploadingMobile] = useState(false);
  const [uploadingDesktop, setUploadingDesktop] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const detectLinkType = (link: string | null): LinkType => {
    if (!link) return 'category';
    if (link.startsWith('/categoria/')) return 'category';
    if (link.startsWith('/producto/')) return 'product';
    return 'custom';
  };

  const [linkType, setLinkType] = useState<LinkType>(detectLinkType(banner?.cta_link || null));
  const [form, setForm] = useState({
    title: banner?.title || '',
    subtitle: banner?.subtitle || '',
    eyebrow: banner?.eyebrow || '',
    cta_text: banner?.cta_text || 'Ver más',
    cta_link: banner?.cta_link || '',
    image_url_mobile: banner?.image_url_mobile || '',
    image_url_desktop: banner?.image_url_desktop || banner?.image_url || '',
    active: banner?.active ?? true,
    order: banner?.order || 99,
  });

  useEffect(() => {
    supabase.from('categories').select('*').order('order').then(({ data }) => setCategories(data || []));
    supabase.from('products').select('*').eq('active', true).order('name').then(({ data }) => setProducts(data || []));
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'mobile' | 'desktop') => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (type === 'mobile') setUploadingMobile(true); else setUploadingDesktop(true);
    const url = await uploadImage(file, 'banners');
    if (url) {
      if (type === 'mobile') setForm({ ...form, image_url_mobile: url });
      else setForm({ ...form, image_url_desktop: url });
    }
    if (type === 'mobile') setUploadingMobile(false); else setUploadingDesktop(false);
  };

  const removeImage = async (type: 'mobile' | 'desktop') => {
    const url = type === 'mobile' ? form.image_url_mobile : form.image_url_desktop;
    if (url) await deleteImage(url);
    if (type === 'mobile') setForm({ ...form, image_url_mobile: '' });
    else setForm({ ...form, image_url_desktop: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.image_url_mobile && !form.image_url_desktop) {
      alert('Subí al menos una imagen (mobile o desktop)');
      return;
    }
    setSaving(true);
    // image_url se mantiene como fallback (la primera disponible)
    const fallback = form.image_url_desktop || form.image_url_mobile;
    const payload = {
      title: form.title || null,
      subtitle: form.subtitle || null,
      eyebrow: form.eyebrow || null,
      cta_text: form.cta_text || null,
      cta_link: form.cta_link || null,
      image_url: fallback,
      image_url_mobile: form.image_url_mobile || null,
      image_url_desktop: form.image_url_desktop || null,
      active: form.active,
      order: Number(form.order),
    };
    const { error } = banner
      ? await supabase.from('banners').update(payload).eq('id', banner.id)
      : await supabase.from('banners').insert(payload);
    setSaving(false);
    if (error) alert('Error: ' + error.message);
    else router.push('/admin/banners');
  };

  return (
    <div className="p-6 md:p-10 max-w-3xl">
      <div className="mb-8">
        <button onClick={() => router.back()} className="text-[11px] tracking-[2px] uppercase text-gray hover:text-rose mb-2">← Volver</button>
        <h1 className="font-serif-c text-4xl font-light">{banner ? 'Editar banner' : 'Nuevo banner'}</h1>
        <p className="text-gray text-sm mt-2">Subí 2 versiones del banner: una horizontal para web y una vertical para celular.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 space-y-6">
        {/* Imagen Desktop */}
        <div>
          <label className="block text-[10px] tracking-[3px] uppercase text-gray mb-1">Imagen Desktop (web)</label>
          <p className="text-xs text-gray mb-3">Recomendado: 1920×800px horizontal</p>
          {form.image_url_desktop ? (
            <div className="relative aspect-[16/7] max-w-md bg-cream group">
              <img src={form.image_url_desktop} alt="" className="w-full h-full object-cover" />
              <button type="button" onClick={() => removeImage('desktop')} className="absolute top-2 right-2 bg-black text-white w-8 h-8 rounded-full">×</button>
            </div>
          ) : (
            <label className="block aspect-[16/7] max-w-md border-2 border-dashed border-line flex items-center justify-center cursor-pointer hover:border-rose">
              <input type="file" accept="image/*" onChange={(e) => handleUpload(e, 'desktop')} className="hidden" />
              <span className="text-sm text-gray text-center">{uploadingDesktop ? 'Subiendo...' : '+ Subir imagen desktop'}</span>
            </label>
          )}
        </div>

        {/* Imagen Mobile */}
        <div>
          <label className="block text-[10px] tracking-[3px] uppercase text-gray mb-1">Imagen Mobile (celular)</label>
          <p className="text-xs text-gray mb-3">Recomendado: 800×1200px vertical</p>
          {form.image_url_mobile ? (
            <div className="relative aspect-[2/3] max-w-[200px] bg-cream group">
              <img src={form.image_url_mobile} alt="" className="w-full h-full object-cover" />
              <button type="button" onClick={() => removeImage('mobile')} className="absolute top-2 right-2 bg-black text-white w-8 h-8 rounded-full">×</button>
            </div>
          ) : (
            <label className="block aspect-[2/3] max-w-[200px] border-2 border-dashed border-line flex items-center justify-center cursor-pointer hover:border-rose">
              <input type="file" accept="image/*" onChange={(e) => handleUpload(e, 'mobile')} className="hidden" />
              <span className="text-sm text-gray text-center">{uploadingMobile ? 'Subiendo...' : '+ Subir mobile'}</span>
            </label>
          )}
        </div>

        <div>
          <label className="block text-[10px] tracking-[3px] uppercase text-gray mb-2">Eyebrow</label>
          <input type="text" value={form.eyebrow}
            onChange={(e) => setForm({ ...form, eyebrow: e.target.value })}
            placeholder="Ej: Colección Otoño 2026"
            className="w-full border border-line px-4 py-3 text-sm focus:outline-none focus:border-rose" />
        </div>

        <div>
          <label className="block text-[10px] tracking-[3px] uppercase text-gray mb-2">Título principal</label>
          <input type="text" value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Ej: Vestí tu esencia"
            className="w-full border border-line px-4 py-3 text-sm focus:outline-none focus:border-rose" />
        </div>

        <div>
          <label className="block text-[10px] tracking-[3px] uppercase text-gray mb-2">Subtítulo</label>
          <textarea value={form.subtitle} rows={2}
            onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
            className="w-full border border-line px-4 py-3 text-sm focus:outline-none focus:border-rose" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] tracking-[3px] uppercase text-gray mb-2">Texto del botón</label>
            <input type="text" value={form.cta_text}
              onChange={(e) => setForm({ ...form, cta_text: e.target.value })}
              className="w-full border border-line px-4 py-3 text-sm focus:outline-none focus:border-rose" />
          </div>
          <div>
            <label className="block text-[10px] tracking-[3px] uppercase text-gray mb-2">Orden</label>
            <input type="number" value={form.order}
              onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
              className="w-full border border-line px-4 py-3 text-sm focus:outline-none focus:border-rose" />
          </div>
        </div>

        <div>
          <label className="block text-[10px] tracking-[3px] uppercase text-gray mb-3">¿A dónde lleva el banner?</label>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {(['category', 'product', 'custom'] as LinkType[]).map((t) => (
              <button key={t} type="button"
                onClick={() => { setLinkType(t); setForm({ ...form, cta_link: '' }); }}
                className={`py-3 text-[11px] tracking-[2px] uppercase border transition ${linkType === t ? 'bg-black text-white border-black' : 'border-line hover:border-black'}`}>
                {t === 'category' ? 'Categoría' : t === 'product' ? 'Producto' : 'Link personalizado'}
              </button>
            ))}
          </div>

          {linkType === 'category' && (
            <select value={form.cta_link}
              onChange={(e) => setForm({ ...form, cta_link: e.target.value })}
              className="w-full border border-line px-4 py-3 text-sm">
              <option value="">— Elegí una categoría —</option>
              {categories.map((c) => <option key={c.id} value={`/categoria/${c.slug}`}>{c.name}</option>)}
            </select>
          )}

          {linkType === 'product' && (
            <select value={form.cta_link}
              onChange={(e) => setForm({ ...form, cta_link: e.target.value })}
              className="w-full border border-line px-4 py-3 text-sm">
              <option value="">— Elegí un producto —</option>
              {products.map((p) => <option key={p.id} value={`/producto/${p.slug}`}>{p.name}</option>)}
            </select>
          )}

          {linkType === 'custom' && (
            <input type="text" value={form.cta_link}
              onChange={(e) => setForm({ ...form, cta_link: e.target.value })}
              placeholder="https://… o /alguna-ruta"
              className="w-full border border-line px-4 py-3 text-sm focus:outline-none focus:border-rose" />
          )}
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />
          <span className="text-sm">Mostrar en el sitio</span>
        </label>

        <div className="pt-6 border-t border-line flex gap-3">
          <button type="submit" disabled={saving} className="bg-black text-white px-8 py-4 text-[11px] tracking-[3px] uppercase hover:bg-rose transition disabled:opacity-50">
            {saving ? 'Guardando…' : banner ? 'Guardar cambios' : 'Crear banner'}
          </button>
          <button type="button" onClick={() => router.push('/admin/banners')} className="border border-line px-8 py-4 text-[11px] tracking-[3px] uppercase hover:bg-cream transition">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
