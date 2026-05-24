'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Page } from '@/lib/types';

function slugify(text: string): string {
  return text.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

export default function PageForm({ page }: { page?: Page }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: page?.title || '',
    slug: page?.slug || '',
    content: page?.content || '',
    active: page?.active ?? true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      title: form.title,
      slug: form.slug || slugify(form.title),
      content: form.content || null,
      active: form.active,
    };

    const { error } = page
      ? await supabase.from('pages').update(payload).eq('id', page.id)
      : await supabase.from('pages').insert(payload);

    setSaving(false);
    if (error) alert('Error: ' + error.message);
    else router.push('/admin/paginas');
  };

  return (
    <div className="p-6 md:p-10 max-w-3xl">
      <div className="mb-8">
        <button onClick={() => router.back()} className="text-[11px] tracking-[2px] uppercase text-gray hover:text-rose mb-2">← Volver</button>
        <h1 className="font-serif-c text-4xl font-light">{page ? 'Editar página' : 'Nueva página'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 space-y-6">
        <div>
          <label className="block text-[10px] tracking-[3px] uppercase text-gray mb-2">Título *</label>
          <input
            type="text" required value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value, slug: page ? form.slug : slugify(e.target.value) })}
            className="w-full border border-line px-4 py-3 text-sm focus:outline-none focus:border-rose"
          />
        </div>

        <div>
          <label className="block text-[10px] tracking-[3px] uppercase text-gray mb-2">URL (slug)</label>
          <input
            type="text" value={form.slug}
            onChange={(e) => setForm({ ...form, slug: slugify(e.target.value) })}
            className="w-full border border-line px-4 py-3 text-sm font-mono focus:outline-none focus:border-rose"
          />
          <p className="text-xs text-gray mt-1">La página será visible en: /{form.slug || 'mi-pagina'}</p>
        </div>

        <div>
          <label className="block text-[10px] tracking-[3px] uppercase text-gray mb-2">Contenido</label>
          <textarea
            value={form.content} rows={14}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            placeholder="Escribí el contenido de la página acá..."
            className="w-full border border-line px-4 py-3 text-sm font-mono focus:outline-none focus:border-rose"
          />
          <p className="text-xs text-gray mt-2 leading-relaxed">
            <strong>Tips de formato:</strong><br/>
            • Para <strong>negrita</strong>, escribí <code>**tu texto**</code><br/>
            • Para títulos, poné <code>**Título:**</code> en una línea sola<br/>
            • Para listas, empezá cada línea con <code>-</code><br/>
            • Separá párrafos con una línea en blanco
          </p>
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />
          <span className="text-sm">Mostrar en el sitio</span>
        </label>

        <div className="pt-6 border-t border-line flex gap-3">
          <button type="submit" disabled={saving} className="bg-black text-white px-8 py-4 text-[11px] tracking-[3px] uppercase hover:bg-rose transition disabled:opacity-50">
            {saving ? 'Guardando…' : page ? 'Guardar cambios' : 'Crear página'}
          </button>
          <button type="button" onClick={() => router.push('/admin/paginas')} className="border border-line px-8 py-4 text-[11px] tracking-[3px] uppercase hover:bg-cream transition">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
