'use client';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import WhatsAppFloat from './WhatsAppFloat';
import { supabase } from '@/lib/supabase';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');
  const [announce, setAnnounce] = useState('ENVÍOS A TODO EL PAÍS · 3 CUOTAS SIN INTERÉS');

  useEffect(() => {
    if (!isAdmin) {
      supabase.from('site_config').select('value').eq('key', 'announce_text').single()
        .then(({ data }) => { if (data?.value) setAnnounce(data.value); });
    }
  }, [isAdmin]);

  if (isAdmin) return <>{children}</>;

  return (
    <>
      <div className="bg-black text-white text-center py-2 text-[10px] tracking-[2.5px] uppercase font-light">
        {announce}
      </div>
      <Header />
      <main>{children}</main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
