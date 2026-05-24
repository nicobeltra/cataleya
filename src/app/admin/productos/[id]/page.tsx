'use client';
import { useEffect, useState, use } from 'react';
import { supabase } from '@/lib/supabase';
import { Product } from '@/lib/types';
import ProductForm from '@/components/ProductForm';

export default function EditarProductoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('products').select('*').eq('id', id).single().then(({ data }) => {
      setProduct(data);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <div className="p-10 text-gray">Cargando…</div>;
  if (!product) return <div className="p-10">Producto no encontrado</div>;

  return <ProductForm product={product} />;
}
