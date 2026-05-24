'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Page } from '@/lib/types';

export default function Footer() {
  const [pages, setPages] = useState<Page[]>([]);
  const [config, setConfig] = useState<Record<string, string>>({});

  useEffect(() => {
    supabase.from('pages').select('*').eq('active', true).order('title').then(({ data }) => setPages(data || []));
    supabase.from('site_config').select('*').then(({ data }) => {
      const map: Record<string, string> = {};
      data?.forEach((r: any) => { map[r.key] = r.value; });
      setConfig(map);
    });
  }, []);

  const instaUrl = config.instagram_url || 'https://instagram.com';
  const waUrl = config.whatsapp_url || (config.whatsapp ? `https://wa.me/${config.whatsapp}` : '#');
  const tagline = config.footer_brand_tagline || 'Vestí tu esencia';

  return (
    <footer className="bg-black text-white px-5 pt-16 pb-6">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-10 pb-10 border-b border-white/10">
        <div>
          <div className="font-serif-c text-3xl tracking-[8px] mb-3">CATALEYA</div>
          <p className="font-serif-c italic text-rose text-base">{tagline}</p>
        </div>
        <div>
          <h5 className="text-[11px] tracking-[3px] uppercase mb-4 text-rose font-medium">Tienda</h5>
          <Link href="/categoria/novedades" className="block text-white/70 text-[13px] mb-2 hover:text-white">Novedades</Link>
          <Link href="/categoria/ofertas" className="block text-white/70 text-[13px] mb-2 hover:text-white">Ofertas</Link>
          <Link href="/" className="block text-white/70 text-[13px] mb-2 hover:text-white">Inicio</Link>
        </div>
        <div>
          <h5 className="text-[11px] tracking-[3px] uppercase mb-4 text-rose font-medium">Ayuda</h5>
          {pages.map((p) => (
            <Link key={p.id} href={`/p/${p.slug}`} className="block text-white/70 text-[13px] mb-2 hover:text-white">
              {p.title}
            </Link>
          ))}
        </div>
        <div>
          <h5 className="text-[11px] tracking-[3px] uppercase mb-4 text-rose font-medium">Seguinos</h5>
          <a href={instaUrl} target="_blank" rel="noopener noreferrer" className="block text-white/70 text-[13px] mb-2 hover:text-white">Instagram</a>
          <a href={waUrl} target="_blank" rel="noopener noreferrer" className="block text-white/70 text-[13px] mb-2 hover:text-white">WhatsApp</a>
        </div>
      </div>
      <div className="max-w-[1400px] mx-auto mt-6 flex flex-col md:flex-row justify-between gap-2 text-[10px] tracking-[2px] text-white/40 uppercase">
        <div>© 2026 Cataleya · San Juan, Argentina</div>
        <div>{config.address || 'Sarmiento — San Juan'} 🇦🇷</div>
      </div>
    </footer>
  );
}
