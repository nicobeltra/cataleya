'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Page } from '@/lib/types';

export default function AdminPaginas() {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from('pages').select('*').order('title');
    setPages(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (p: Page) => {
    if (!confirm(`¿Eliminar página "${p.title}"? Esta acción no se puede deshacer.`)) return;
    const { error } = await supabase.from('pages').delete().eq('id', p.id);
    if (error) alert('Error: ' + error.message);
    else load();
  };

  const toggleActive = async (p: Page) => {
    await supabase.from('pages').update({ active: !p.active }).eq('id', p.id);
    load();
  };

  return (
    <div className="p-6 md:p-10">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
        <div>
          <h1 className="font-serif-c text-4xl font-light">Páginas</h1>
          <p className="text-gray text-sm">{pages.length} páginas · Aparecen en el footer del sitio.</p>
        </div>
        <Link href="/admin/paginas/nueva" className="bg-black text-white px-6 py-3 text-[11px] tracking-[3px] uppercase hover:bg-rose transition text-center">
          ➕ Nueva página
        </Link>
      </div>

      {loading ? (
        <div className="text-gray text-center py-10">Cargando…</div>
      ) : pages.length === 0 ? (
        <div className="bg-white p-10 text-center text-gray">
          Todavía no hay páginas. <Link href="/admin/paginas/nueva" className="text-rose underline">Crear la primera</Link>
        </div>
      ) : (
        <div className="bg-white">
          {pages.map((p) => (
            <div key={p.id} className="flex items-center gap-4 p-4 border-b border-line">
              <div className="flex-1">
                <div className="font-medium">{p.title}</div>
                <div className="text-xs text-gray">/{p.slug}</div>
              </div>
              <button onClick={() => toggleActive(p)} className={`text-[10px] tracking-wider uppercase px-3 py-1 ${p.active ? 'bg-green-100 text-green-800' : 'bg-gray/20 text-gray'}`}>
                {p.active ? 'Visible' : 'Oculta'}
              </button>
              <div className="flex gap-3 text-[11px] tracking-[2px] uppercase">
                <Link href={`/admin/paginas/${p.id}`} className="hover:text-rose">Editar</Link>
                <button onClick={() => handleDelete(p)} className="text-rose hover:underline">Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
