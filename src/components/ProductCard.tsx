import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/lib/types';

function fmt(n: number) { return '$ ' + n.toLocaleString('es-AR'); }

function phClass(id: string): string {
  let sum = 0;
  for (let i = 0; i < id.length; i++) sum += id.charCodeAt(i);
  return `ph-${(sum % 10) + 1}`;
}

export default function ProductCard({ product }: { product: Product }) {
  const badge = product.badge === 'sale' && product.old_price
    ? `-${Math.round(((product.old_price - product.price) / product.old_price) * 100)}%`
    : product.badge === 'new' ? 'Nuevo' : null;

  return (
    <Link href={`/producto/${product.slug}`} className="block group cursor-pointer">
      <div className="aspect-[3/4] overflow-hidden relative mb-3.5">
        {badge && (
          <span className={`absolute top-3 left-3 z-10 px-3 py-1.5 text-[10px] tracking-[2px] uppercase ${product.badge === 'sale' ? 'bg-rose text-white' : 'bg-white text-black'}`}>
            {badge}
          </span>
        )}
        <div className={`ph ${phClass(product.id)} transition-transform duration-700 group-hover:scale-105 relative w-full h-full`}>
          {product.images && product.images.length > 0 ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover"
            />
          ) : (
            <span className="ph-label">{product.name}</span>
          )}
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-black text-white text-center py-3.5 text-[11px] tracking-[3px] uppercase translate-y-full group-hover:translate-y-0 transition-transform duration-400 z-10">
          Ver producto
        </div>
      </div>
      <div className="font-serif-c text-lg mb-1">{product.name}</div>
      <div className="text-[13px] tracking-wide text-gray">
        {product.old_price ? (
          <>
            <span className="line-through mr-2.5 opacity-50">{fmt(product.old_price)}</span>
            <span className="text-rose font-medium">{fmt(product.price)}</span>
          </>
        ) : fmt(product.price)}
      </div>
    </Link>
  );
}
