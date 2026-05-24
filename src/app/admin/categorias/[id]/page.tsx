'use client';
import { useEffect, useState, use } from 'react';
import { supabase } from '@/lib/supabase';
import { Category } from '@/lib/types';
import CategoryForm from '@/components/CategoryForm';

export default function EditarCategoriaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('categories').select('*').eq('id', id).single().then(({ data }) => {
      setCategory(data);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <div className="p-10 text-gray">Cargando…</div>;
  if (!category) return <div className="p-10">Categoría no encontrada</div>;

  return <CategoryForm category={category} />;
}
