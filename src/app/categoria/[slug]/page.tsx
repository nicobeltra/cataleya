import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  getCategoryBySlug, getProductsByCategory, getProductsByBadge
} from '@/lib/supabase';
import ProductCard from '@/components/ProductCard';

export const dynamic = 'force-dynamic';

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  let products;
  if (slug === 'ofertas') products = await getProductsByBadge('sale');
  else if (slug === 'novedades') products = await getProductsByBadge('new');
  else products = await getProductsByCategory(category.id);

  const isSpecial = slug === 'ofertas' || slug === 'novedades';

  return (
    <>
      <div className="bg-cream px-5 pt-16 pb-10 text-center">
        <div className="text-[11px] tracking-[3px] uppercase text-gray mb-4">
          <Link href="/" className="hover:text-rose">Inicio</Link> / {category.name}
        </div>
        <h1 className="font-serif-c font-light leading-none mb-4" style={{ fontSize: 'clamp(42px, 7vw, 84px)' }}>
          {isSpecial ? <em className="italic text-rose">{category.name}</em> : category.name}
        </h1>
        <p className="text-gray text-[15px] max-w-[500px] mx-auto">{category.description}</p>
        <div className="max-w-[1400px] mx-auto mt-7 pt-5 border-t border-line flex flex-col md:flex-row md:justify-between md:items-center gap-4 text-[11px] tracking-[2px] uppercase text-gray">
          <div>{products.length} productos</div>
        </div>
      </div>

      <section className="px-5 py-16 max-w-[1400px] mx-auto">
        {products.length === 0 ? (
          <p className="text-center text-gray py-10">Aún no hay productos en esta categoría.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>
    </>
  );
}
