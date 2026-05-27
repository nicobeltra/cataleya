'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from './CartContext';
import { Category } from '@/lib/types';
import { supabase } from '@/lib/supabase';

export default function Header() {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const { count } = useCart();

  useEffect(() => {
    supabase
      .from('categories')
      .select('*')
      .order('order', { ascending: true })
      .then(({ data }) => setCategories(data || []));
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/95 border-b border-line py-3.5 px-5">
        <div className="max-w-[1400px] mx-auto flex items-center">
          {/* Izquierda */}
          <div className="flex-1 flex items-center">
            <button
              onClick={() => setOpen(true)}
              className="md:hidden flex flex-col gap-1 p-2"
              aria-label="Menú"
            >
              <span className="w-[22px] h-px bg-black" />
              <span className="w-[22px] h-px bg-black" />
              <span className="w-[22px] h-px bg-black" />
            </button>

            <nav className="hidden md:flex gap-6 text-xs tracking-[2px] uppercase items-center">
              <Link href="/categoria/novedades" className="hover:text-rose transition">Novedades</Link>
              <Link href="/#categorias" className="hover:text-rose transition">Categorías</Link>
              <Link href="/categoria/ofertas" className="hover:text-rose transition">Ofertas</Link>
            </nav>
          </div>

          {/* Centro: logo */}
          <Link href="/" className="font-serif-c text-[22px] tracking-[6px] text-center text-black px-4">
            CATALEYA
          </Link>

          {/* Derecha */}
          <div className="flex-1 flex justify-end items-center text-xs tracking-[2px] uppercase">
            <Link href="/carrito" className="flex items-center gap-1.5 text-black hover:text-rose">
              <span className="hidden md:inline">Carrito</span>
              <span className="md:hidden">🛍</span>
              <span className="bg-black text-white rounded-full min-w-[20px] h-5 text-[10px] flex items-center justify-center px-1.5">
                {count}
              </span>
            </Link>
          </div>
        </div>
      </header>

      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 bg-black/40 z-[199] transition-opacity ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      />

      <aside
        className={`fixed top-0 left-0 w-[85%] max-w-[360px] h-screen bg-white z-[200] py-8 transform transition-transform duration-300 flex flex-col overflow-y-auto ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="px-7 pb-6 border-b border-line flex justify-between items-center">
          <div className="font-serif-c text-xl tracking-[5px] text-black">CATALEYA</div>
          <button onClick={() => setOpen(false)} className="text-3xl leading-none font-light text-black">×</button>
        </div>

        <div className="px-7 py-5 border-b border-line">
          <div className="text-[10px] tracking-[3px] uppercase text-rose mb-3.5 font-medium">Categorías</div>
          {categories.map((c) => (
            <Link
              key={c.id}
              onClick={() => setOpen(false)}
              href={`/categoria/${c.slug}`}
              className={`block font-serif-c text-xl py-2 ${['ofertas','novedades'].includes(c.slug) ? 'italic text-rose' : 'text-black'}`}
            >
              {c.name}
            </Link>
          ))}
        </div>

        <div className="px-7 py-5 border-b border-line">
          <div className="text-[10px] tracking-[3px] uppercase text-rose mb-3.5 font-medium">Cuenta</div>
          <Link onClick={() => setOpen(false)} href="/carrito" className="block font-serif-c text-base py-2 text-black">Mi carrito</Link>
        </div>

        <div className="px-7 py-5 mt-auto text-[11px] tracking-[2px] text-gray leading-relaxed">
          Av. Barboza y Martínez López<br />
          Sarmiento, San Juan<br />
          Lun a Sáb · 10—13 / 17—21
        </div>
      </aside>
    </>
  );
}
