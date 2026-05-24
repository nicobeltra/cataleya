'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session && pathname !== '/admin/login') {
        router.push('/admin/login');
      } else {
        setAuthed(!!session);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthed(!!session);
      if (!session && pathname !== '/admin/login') router.push('/admin/login');
    });

    return () => subscription.unsubscribe();
  }, [pathname, router]);

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray">Cargando…</div>;
  }

  if (!authed) return null;

  const navItems = [
    { href: '/admin', label: 'Inicio', icon: '🏠' },
    { href: '/admin/productos', label: 'Productos', icon: '👗' },
    { href: '/admin/categorias', label: 'Categorías', icon: '🏷️' },
    { href: '/admin/banners', label: 'Banners', icon: '🖼️' },
    { href: '/admin/paginas', label: 'Páginas', icon: '📄' },
    { href: '/admin/pedidos', label: 'Pedidos', icon: '📦' },
    { href: '/admin/configuracion', label: 'Configuración', icon: '⚙️' },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-cream flex">
      <aside className="hidden md:flex flex-col w-64 bg-black text-white p-6 fixed h-screen">
        <div className="font-serif-c text-2xl tracking-[5px] mb-2">CATALEYA</div>
        <div className="text-[10px] tracking-[3px] uppercase text-rose mb-10 font-medium">Panel admin</div>
        <nav className="flex flex-col gap-1 flex-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-4 py-3 text-sm tracking-wide rounded transition ${pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href)) ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
            >
              <span className="mr-3">{item.icon}</span>{item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-white/10 pt-4 mt-4">
          <Link href="/" target="_blank" className="block text-[11px] text-white/60 hover:text-white mb-3">
            ↗ Ver sitio público
          </Link>
          <button onClick={handleLogout} className="text-[11px] text-rose hover:text-white">
            Cerrar sesión
          </button>
        </div>
      </aside>

      <header className="md:hidden fixed top-0 left-0 right-0 bg-black text-white p-4 z-50 flex justify-between items-center">
        <div className="font-serif-c text-lg tracking-[4px]">CATALEYA</div>
        <button onClick={() => setSidebarOpen(true)} className="text-2xl">☰</button>
      </header>

      <div onClick={() => setSidebarOpen(false)} className={`md:hidden fixed inset-0 bg-black/50 z-40 ${sidebarOpen ? '' : 'hidden'}`} />
      <aside className={`md:hidden fixed top-0 left-0 h-screen w-72 bg-black text-white p-6 z-50 transform transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="font-serif-c text-2xl tracking-[5px] mb-2">CATALEYA</div>
        <div className="text-[10px] tracking-[3px] uppercase text-rose mb-10 font-medium">Panel admin</div>
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`px-4 py-3 text-sm tracking-wide rounded ${pathname === item.href ? 'bg-white/10' : 'text-white/60'}`}
            >
              <span className="mr-3">{item.icon}</span>{item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-white/10 pt-4 mt-4">
          <Link href="/" target="_blank" className="block text-[11px] text-white/60 mb-3">↗ Ver sitio público</Link>
          <button onClick={handleLogout} className="text-[11px] text-rose">Cerrar sesión</button>
        </div>
      </aside>

      <main className="flex-1 md:ml-64 pt-16 md:pt-0">
        {children}
      </main>
    </div>
  );
}
