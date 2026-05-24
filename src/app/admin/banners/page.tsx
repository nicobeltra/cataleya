'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Banner } from '@/lib/types';

export default function AdminBanners() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from('banners').select('*').order('order');
    setBanners(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const toggleActive = async (b: Banner) => {
    await supabase.from('banners').update({ active: !b.active }).eq('id', b.id);
    load();
  };

  const handleDelete = async (b: Banner) => {
    if (!confirm(`¿Eliminar banner "${b.title || 'sin título'}"?`)) return;
    await supabase.from('banners').delete().eq('id', b.id);
    load();
  };

  const moveOrder = async (b: Banner, direction: 'up' | 'down') => {
    const idx = banners.findIndex((x) => x.id === b.id);
    const otherIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (otherIdx < 0 || otherIdx >= banners.length) return;
    const other = banners[otherIdx];
    await Promise.all([
      supabase.from('banners').update({ order: other.order }).eq('id', b.id),
      supabase.from('banners').update({ order: b.order }).eq('id', other.id),
    ]);
    load();
  };

  return (
    <div className="p-6 md:p-10">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
        <div>
          <h1 className="font-serif-c text-4xl font-light">Banners</h1>
          <p className="text-gray text-sm">{banners.filter(b => b.active).length} activos · {banners.length} totales</p>
          <p className="text-xs text-gray mt-1">Los banners se muestran como carrusel en el hero del home.</p>
        </div>
        <Link href="/admin/banners/nuevo" className="bg-black text-white px-6 py-3 text-[11px] tracking-[3px] uppercase hover:bg-rose transition text-center">
          ➕ Nuevo banner
        </Link>
      </div>

      {loading ? (
        <div className="text-gray text-center py-10">Cargando…</div>
      ) : banners.length === 0 ? (
        <div className="bg-white p-10 text-center text-gray">
          Todavía no hay banners. <Link href="/admin/banners/nuevo" className="text-rose underline">Crear el primero</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {banners.map((b, idx) => (
            <div key={b.id} className="bg-white p-4 flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="flex md:flex-col gap-1">
                <button onClick={() => moveOrder(b, 'up')} disabled={idx === 0} className="text-gray hover:text-rose disabled:opacity-30">▲</button>
                <button onClick={() => moveOrder(b, 'down')} disabled={idx === banners.length - 1} className="text-gray hover:text-rose disabled:opacity-30">▼</button>
              </div>
              <div className="w-full md:w-40 aspect-[4/3] bg-cream flex items-center justify-center overflow-hidden">
                {b.image_url ? <img src={b.image_url} alt="" className="w-full h-full object-cover" /> : <span className="text-gray text-xs">Sin imagen</span>}
              </div>
              <div className="flex-1">
                <div className="text-xs tracking-wider uppercase text-gray mb-1">{b.eyebrow}</div>
                <div className="font-serif-c text-xl">{b.title || '(sin título)'}</div>
                <div className="text-xs text-gray mt-1">CTA: "{b.cta_text}" → {b.cta_link}</div>
              </div>
              <div className="flex flex-row md:flex-col items-end gap-2 text-[11px] tracking-[2px] uppercase">
                <button onClick={() => toggleActive(b)} className={`px-3 py-1 ${b.active ? 'bg-green-100 text-green-800' : 'bg-gray/20 text-gray'}`}>
                  {b.active ? 'Activo' : 'Inactivo'}
                </button>
                <div className="flex gap-3">
                  <Link href={`/admin/banners/${b.id}`} className="hover:text-rose">Editar</Link>
                  <button onClick={() => handleDelete(b)} className="text-rose hover:underline">Eliminar</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
