'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

type CategoryWithCount = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  order: number;
  protected?: boolean;
  active?: boolean;
  product_count?: number;
};

export default function AdminCategorias() {
  const [categories, setCategories] = useState<CategoryWithCount[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data: cats } = await supabase.from('categories').select('*').order('order');
    const { data: prods } = await supabase.from('products').select('category_id');
    const counts: Record<string, number> = {};
    prods?.forEach((p: any) => { counts[p.category_id] = (counts[p.category_id] || 0) + 1; });
    setCategories((cats || []).map((c: any) => ({ ...c, product_count: counts[c.id] || 0 })));
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (cat: CategoryWithCount) => {
    if (cat.protected) {
      alert(`"${cat.name}" es una categoría especial y no se puede eliminar.`);
      return;
    }
    if (cat.product_count && cat.product_count > 0) {
      if (!confirm(`"${cat.name}" tiene ${cat.product_count} productos. Los productos quedarán sin categoría. ¿Continuar?`)) return;
    } else {
      if (!confirm(`¿Eliminar "${cat.name}"?`)) return;
    }
    const { error } = await supabase.from('categories').delete().eq('id', cat.id);
    if (error) alert('Error: ' + error.message);
    else load();
  };

  const moveOrder = async (cat: CategoryWithCount, direction: 'up' | 'down') => {
    const idx = categories.findIndex((c) => c.id === cat.id);
    const otherIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (otherIdx < 0 || otherIdx >= categories.length) return;
    const other = categories[otherIdx];
    await Promise.all([
      supabase.from('categories').update({ order: other.order }).eq('id', cat.id),
      supabase.from('categories').update({ order: cat.order }).eq('id', other.id),
    ]);
    load();
  };

  return (
    <div className="p-6 md:p-10">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
        <div>
          <h1 className="font-serif-c text-4xl font-light">Categorías</h1>
          <p className="text-gray text-sm">{categories.length} categorías</p>
        </div>
        <Link href="/admin/categorias/nuevo" className="bg-black text-white px-6 py-3 text-[11px] tracking-[3px] uppercase hover:bg-rose transition text-center">
          ➕ Nueva categoría
        </Link>
      </div>

      {loading ? (
        <div className="text-gray text-center py-10">Cargando…</div>
      ) : (
        <div className="bg-white">
          {categories.map((c, idx) => (
            <div key={c.id} className="flex items-center gap-4 p-4 border-b border-line">
              <div className="flex flex-col gap-1">
                <button onClick={() => moveOrder(c, 'up')} disabled={idx === 0} className="text-gray hover:text-rose disabled:opacity-30">▲</button>
                <button onClick={() => moveOrder(c, 'down')} disabled={idx === categories.length - 1} className="text-gray hover:text-rose disabled:opacity-30">▼</button>
              </div>
              <div className="w-16 h-20 bg-cream flex items-center justify-center text-xs text-gray overflow-hidden">
                {c.image_url ? <img src={c.image_url} alt="" className="w-full h-full object-cover" /> : '—'}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">{c.name}</span>
                  {c.protected && <span className="text-[9px] tracking-wider uppercase px-2 py-0.5 bg-rose-pale text-rose">Especial</span>}
                </div>
                <div className="text-xs text-gray">{c.product_count} productos · /categoria/{c.slug}</div>
              </div>
              <div className="flex gap-3 text-[11px] tracking-[2px] uppercase">
                <Link href={`/admin/categorias/${c.id}`} className="hover:text-rose">Editar</Link>
                <button onClick={() => handleDelete(c)} disabled={c.protected} className={`${c.protected ? 'opacity-30 cursor-not-allowed' : 'text-rose hover:underline'}`}>
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
