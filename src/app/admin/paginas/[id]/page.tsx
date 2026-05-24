'use client';
import { useEffect, useState, use } from 'react';
import { supabase } from '@/lib/supabase';
import { Page } from '@/lib/types';
import PageForm from '@/components/PageForm';

export default function EditarPaginaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [page, setPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('pages').select('*').eq('id', id).single().then(({ data }) => {
      setPage(data);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <div className="p-10 text-gray">Cargando…</div>;
  if (!page) return <div className="p-10">Página no encontrada</div>;
  return <PageForm page={page} />;
}
