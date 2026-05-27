'use client';
import { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product, Category } from '@/lib/types';
import { useCart } from '@/components/CartContext';

function fmt(n: number) { return '$ ' + n.toLocaleString('es-AR'); }

export default function ProductDetailClient({
  product,
  category,
  phClass,
}: {
  product: Product;
  category?: Category;
  phClass: string;
}) {
  const { addItem } = useCart();
  const [size, setSize] = useState(product.sizes[0] || 'M');
  const [activeImg, setActiveImg] = useState(0);
  const [toast, setToast] = useState('');
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2200);
  };

  const handleAdd = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] || '',
      size,
      quantity: 1,
    });
    showToast('Producto agregado al carrito');
  };

  const next = () => setActiveImg((i) => (i + 1) % product.images.length);
  const prev = () => setActiveImg((i) => (i - 1 + product.images.length) % product.images.length);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchEndX.current = null;
    touchStartX.current = e.targetTouches[0].clientX;
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };
  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > 50) next();
    else if (distance < -50) prev();
  };

  const whatsappMsg = encodeURIComponent(`Hola! Me interesa el producto: ${product.name} (Talle ${size}) — ${fmt(product.price)}`);
  const whatsappPhone = process.env.NEXT_PUBLIC_WHATSAPP || '5492640000000';

  const hasImages = product.images && product.images.length > 0;
  const hasMultiple = hasImages && product.images.length > 1;

  return (
    <>
      <div className="max-w-[1400px] mx-auto p-4 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
        <div className="md:sticky md:top-24 md:self-start">
          {/* Imagen grande con swipe */}
          <div
            className="aspect-[3/4] bg-cream overflow-hidden mb-3 relative select-none"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {hasImages ? (
              <>
                {product.images.map((img, i) => (
                  <Image
                    key={i}
                    src={img}
                    alt={product.name}
                    fill
                    priority={i === 0}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className={`object-cover transition-opacity duration-300 ${i === activeImg ? 'opacity-100' : 'opacity-0'}`}
                  />
                ))}

                {/* Flechas desktop */}
                {hasMultiple && (
                  <>
                    <button
                      onClick={prev}
                      className="hidden md:flex absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center bg-white/70 hover:bg-white backdrop-blur-sm rounded-full text-black text-xl z-10 transition"
                      aria-label="Anterior"
                    >‹</button>
                    <button
                      onClick={next}
                      className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center bg-white/70 hover:bg-white backdrop-blur-sm rounded-full text-black text-xl z-10 transition"
                      aria-label="Siguiente"
                    >›</button>
                  </>
                )}

                {/* Contador */}
                {hasMultiple && (
                  <div className="md:hidden absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 text-[11px] tracking-wider rounded-full backdrop-blur-sm">
                    {activeImg + 1} / {product.images.length}
                  </div>
                )}
              </>
            ) : (
              <div className={`ph ${phClass}`}>
                <span className="ph-label">{product.name}</span>
              </div>
            )}
          </div>

          {/* Miniaturas (siguen funcionando con click) */}
          {hasMultiple && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`aspect-square bg-cream overflow-hidden border-2 relative ${i === activeImg ? 'border-rose' : 'border-transparent'}`}
                >
                  <Image
                    src={img}
                    alt=""
                    fill
                    sizes="100px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="py-5">
          <div className="text-[11px] tracking-[3px] uppercase text-gray mb-5">
            <Link href="/" className="hover:text-rose">Inicio</Link> /{' '}
            {category && <Link href={`/categoria/${category.slug}`} className="hover:text-rose">{category.name}</Link>}{' '}
            / <span>{product.name}</span>
          </div>

          <h1 className="font-serif-c font-light leading-[1.1] mb-4" style={{ fontSize: 'clamp(32px, 5vw, 42px)' }}>
            {product.name}
          </h1>

          <div className="text-[22px] tracking-wide mb-2">
            {product.old_price ? (
              <>
                <span className="line-through text-gray mr-3.5 text-base">{fmt(product.old_price)}</span>
                <span className="text-rose">{fmt(product.price)}</span>
              </>
            ) : fmt(product.price)}
          </div>

          <div className="text-xs text-gray mb-8 tracking-wide">3 cuotas sin interés con todas las tarjetas</div>

          <div className="mb-6">
            <div className="text-[10px] tracking-[3px] uppercase text-gray mb-3">Talle</div>
            <div className="flex gap-2.5 flex-wrap">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`w-12 h-12 border text-xs flex items-center justify-center transition-all ${size === s ? 'bg-black text-white border-black' : 'border-line bg-white hover:border-black'}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleAdd}
            disabled={product.stock === 0}
            className="w-full bg-black text-white py-5 text-[11px] tracking-[3px] uppercase hover:bg-rose transition-colors mb-3 disabled:opacity-40"
          >
            {product.stock === 0 ? 'Sin stock' : 'Agregar al carrito'}
          </button>

          <a
            href={`https://wa.me/${whatsappPhone}?text=${whatsappMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-white text-black py-5 text-[11px] tracking-[3px] uppercase border border-black hover:bg-black hover:text-white transition-colors text-center"
          >
            Consultar por WhatsApp
          </a>

          {product.description && (
            <div className="mt-8 pt-8 border-t border-line text-sm text-gray leading-relaxed whitespace-pre-line">
              {product.description}
            </div>
          )}
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-24 right-5 bg-black text-white px-6 py-4 text-xs tracking-[2px] uppercase z-[1000] shadow-lg">
          {toast}
        </div>
      )}
    </>
  );
}
