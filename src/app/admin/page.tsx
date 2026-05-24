'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function AdminHome() {
  const [stats, setStats] = useState({ products: 0, categories: 0, banners: 0, orders: 0, pages: 0 });

  useEffect(() => {
    Promise.all([
      supabase.from('products').select('id', { count: 'exact', head: true }),
      supabase.from('categories').select('id', { count: 'exact', head: true }),
      supabase.from('banners').select('id', { count: 'exact', head: true }),
      supabase.from('orders').select('id', { count: 'exact', head: true }),
      supabase.from('pages').select('id', { count: 'exact', head: true }),
    ]).then(([p, c, b, o, pg]) => {
      setStats({
        products: p.count || 0,
        categories: c.count || 0,
        banners: b.count || 0,
        orders: o.count || 0,
        pages: pg.count || 0,
      });
    });
  }, []);

  const cards = [
    { href: '/admin/productos', icon: '👗', label: 'Productos', count: stats.products, color: 'bg-rose-pale' },
    { href: '/admin/categorias', icon: '🏷️', label: 'Categorías', count: stats.categories, color: 'bg-cream' },
    { href: '/admin/banners', icon: '🖼️', label: 'Banners', count: stats.banners, color: 'bg-rose-pale' },
    { href: '/admin/paginas', icon: '📄', label: 'Páginas', count: stats.pages, color: 'bg-cream' },
    { href: '/admin/pedidos', icon: '📦', label: 'Pedidos', count: stats.orders, color: 'bg-rose-pale' },
  ];

  return (
    <div className="p-6 md:p-10">
      <div className="mb-10">
        <h1 className="font-serif-c text-4xl font-light mb-2">¡Bienvenida!</h1>
        <p className="text-gray text-sm">Acá vas a manejar todo el contenido de tu tienda.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
        {cards.map((c) => (
          <Link key={c.href} href={c.href} className={`${c.color} p-6 hover:shadow-md transition-shadow block`}>
            <div className="text-3xl mb-2">{c.icon}</div>
            <div className="text-[10px] tracking-[3px] uppercase text-gray mb-1">{c.label}</div>
            <div className="font-serif-c text-3xl">{c.count}</div>
          </Link>
        ))}
      </div>

      <div className="bg-white p-6 md:p-8">
        <h2 className="font-serif-c text-2xl italic text-rose mb-5">Accesos rápidos</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <Link href="/admin/productos/nuevo" className="bg-black text-white px-5 py-4 text-[11px] tracking-[3px] uppercase text-center hover:bg-rose transition">
            ➕ Producto
          </Link>
          <Link href="/admin/categorias/nuevo" className="border border-black px-5 py-4 text-[11px] tracking-[3px] uppercase text-center hover:bg-black hover:text-white transition">
            ➕ Categoría
          </Link>
          <Link href="/admin/banners/nuevo" className="border border-black px-5 py-4 text-[11px] tracking-[3px] uppercase text-center hover:bg-black hover:text-white transition">
            ➕ Banner
          </Link>
          <Link href="/admin/paginas/nueva" className="border border-black px-5 py-4 text-[11px] tracking-[3px] uppercase text-center hover:bg-black hover:text-white transition">
            ➕ Página
          </Link>
        </div>
      </div>
    </div>
  );
}
