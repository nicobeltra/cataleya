'use client';
import { useEffect, useState, use } from 'react';
import { supabase } from '@/lib/supabase';
import { Banner } from '@/lib/types';
import BannerForm from '@/components/BannerForm';

export default function EditarBannerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [banner, setBanner] = useState<Banner | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('banners').select('*').eq('id', id).single().then(({ data }) => {
      setBanner(data);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <div className="p-10 text-gray">Cargando…</div>;
  if (!banner) return <div className="p-10">Banner no encontrado</div>;
  return <BannerForm banner={banner} />;
}
