import { notFound } from 'next/navigation';
import { getProductBySlug, supabase } from '@/lib/supabase';
import ProductDetailClient from './ProductDetailClient';

export const dynamic = 'force-dynamic';

function phClass(id: string): string {
  let sum = 0;
  for (let i = 0; i < id.length; i++) sum += id.charCodeAt(i);
  return `ph-${(sum % 10) + 1}`;
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProductBySlug(id);
  if (!product) notFound();

  const { data: category } = await supabase
    .from('categories')
    .select('*')
    .eq('id', product.category_id)
    .single();

  return <ProductDetailClient product={product} category={category || undefined} phClass={phClass(product.id)} />;
}
