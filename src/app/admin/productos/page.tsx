'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Product, Category } from '@/lib/types';

function fmt(n: number) { return '$ ' + n.toLocaleString('es-AR'); }

export default function AdminProductos() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const [{ data: prods }, { data: cats }] = await Promise.all([
      supabase.from('products').select('*').order('created_at', { ascending: false }),
      supabase.from('categories').select('*').order('order'),
    ]);
    setProducts(prods || []);
    setCategories(cats || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`¿Eliminar "${name}"? Esta acción no se puede deshacer.`)) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) alert('Error al eliminar');
    else load();
  };

  const handleToggleActive = async (p: Product) => {
    await supabase.from('products').update({ active: !p.active }).eq('id', p.id);
    load();
  };

  const filtered = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCat = !filterCat || p.category_id === filterCat;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="p-6 md:p-10">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
        <div>
          <h1 className="font-serif-c text-4xl font-light">Productos</h1>
          <p className="text-gray text-sm">{products.length} productos en total</p>
        </div>
        <Link href="/admin/productos/nuevo" className="bg-black text-white px-6 py-3 text-[11px] tracking-[3px] uppercase hover:bg-rose transition text-center">
          ➕ Nuevo producto
        </Link>
      </div>

      <div className="bg-white p-4 md:p-6 mb-6 flex flex-col md:flex-row gap-3">
        <input type="text" placeholder="Buscar por nombre…" value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border border-line px-4 py-2.5 text-sm focus:outline-none focus:border-rose" />
        <select value={filterCat} onChange={(e) => setFilterCat(e.target.value)}
          className="border border-line px-4 py-2.5 text-sm">
          <option value="">Todas las categorías</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray">Cargando…</div>
      ) : (
        <div className="bg-white overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-cream text-[10px] tracking-[2px] uppercase text-gray">
              <tr>
                <th className="text-left p-4">Producto</th>
                <th className="text-left p-4 hidden md:table-cell">Categoría</th>
                <th className="text-left p-4">Precio</th>
                <th className="text-left p-4 hidden md:table-cell">Stock</th>
                <th className="text-left p-4 hidden md:table-cell">Estado</th>
                <th className="text-right p-4">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => {
                const cat = categories.find((c) => c.id === p.category_id);
                return (
                  <tr key={p.id} className="border-t border-line hover:bg-cream/50">
                    <td className="p-4">
                      <div className="font-medium">{p.name}</div>
                      {p.badge && (
                        <span className={`text-[9px] tracking-wider uppercase px-2 py-0.5 inline-block mt-1 ${p.badge === 'sale' ? 'bg-rose text-white' : 'bg-cream'}`}>
                          {p.badge === 'sale' ? 'Oferta' : 'Nuevo'}
                        </span>
                      )}
                    </td>
                    <td className="p-4 hidden md:table-cell text-gray">{cat?.name || '—'}</td>
                    <td className="p-4">
                      {p.old_price && <span className="line-through text-gray text-xs mr-2">{fmt(p.old_price)}</span>}
                      <span>{fmt(p.price)}</span>
                    </td>
                    <td className="p-4 hidden md:table-cell">{p.stock}</td>
                    <td className="p-4 hidden md:table-cell">
                      <button onClick={() => handleToggleActive(p)}
                        className={`text-[10px] tracking-wider uppercase px-2 py-1 ${p.active ? 'bg-green-100 text-green-800' : 'bg-gray/20 text-gray'}`}>
                        {p.active ? 'Visible' : 'Oculto'}
                      </button>
                    </td>
                    <td className="p-4 text-right whitespace-nowrap">
                      <Link href={`/admin/productos/${p.id}`} className="text-[11px] tracking-[2px] uppercase hover:text-rose mr-3">Editar</Link>
                      <button onClick={() => handleDelete(p.id, p.name)} className="text-[11px] tracking-[2px] uppercase text-rose hover:underline">Eliminar</button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="p-10 text-center text-gray">No se encontraron productos.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
