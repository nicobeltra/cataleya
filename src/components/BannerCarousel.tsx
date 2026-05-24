'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Banner } from '@/lib/types';

export default function BannerCarousel({ banners }: { banners: Banner[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % banners.length), 5500);
    return () => clearInterval(t);
  }, [banners.length]);

  // SIN banners cargados — fallback simple
  if (banners.length === 0) {
    return (
      <section className="relative min-h-[70vh] md:min-h-[85vh] bg-gradient-to-br from-rose-pale via-cream to-white flex items-center justify-center px-6 py-20">
        <div className="text-center max-w-2xl">
          <div className="text-[11px] tracking-[4px] uppercase text-rose mb-6 animate-fadeup-1">
            Bienvenida a Cataleya
          </div>
          <h1 className="font-serif-c font-light leading-[0.95] mb-7 animate-fadeup-2" style={{ fontSize: 'clamp(48px, 7vw, 110px)' }}>
            Vestí <em className="italic text-rose">tu</em> esencia.
          </h1>
          <Link href="/categoria/novedades" className="inline-flex items-center gap-4 bg-black text-white px-9 py-4 text-[11px] tracking-[3px] uppercase hover:bg-rose hover:gap-6 transition-all animate-fadeup-4">
            Ver colección →
          </Link>
        </div>
      </section>
    );
  }

  const current = banners[index];
  const hasLink = !!current.cta_link;

  // Wrapper que hace clickeable todo el banner si hay link
  const BannerContent = (
    <div className="relative w-full h-full min-h-[60vh] md:min-h-[85vh] overflow-hidden cursor-pointer">
      {/* Imágenes apiladas con fade */}
      {banners.map((b, i) => (
        <img
          key={b.id}
          src={b.image_url}
          alt={b.title || ''}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${i === index ? 'opacity-100' : 'opacity-0'}`}
        />
      ))}

      {/* Overlay con textos */}
      {(current.title || current.subtitle || current.eyebrow) && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent flex items-end md:items-center">
          <div className="w-full md:w-1/2 px-6 md:px-16 py-10 md:py-20 text-white">
            {current.eyebrow && (
              <div key={`eb-${index}`} className="text-[11px] tracking-[4px] uppercase mb-4 animate-fadeup-1">
                {current.eyebrow}
              </div>
            )}
            {current.title && (
              <h1 key={`t-${index}`} className="font-serif-c font-light leading-[0.95] mb-5 animate-fadeup-2" style={{ fontSize: 'clamp(40px, 6vw, 90px)' }}>
                {current.title}
              </h1>
            )}
            {current.subtitle && (
              <p key={`s-${index}`} className="text-[14px] md:text-[15px] max-w-[420px] mb-6 opacity-90 animate-fadeup-3">
                {current.subtitle}
              </p>
            )}
            {current.cta_text && (
              <span className="inline-flex items-center gap-3 text-[11px] tracking-[3px] uppercase border-b border-white/60 pb-1 animate-fadeup-4">
                {current.cta_text} →
              </span>
            )}
          </div>
        </div>
      )}

      {/* Dots de navegación */}
      {banners.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIndex(i); }}
              className={`h-1 transition-all ${i === index ? 'w-10 bg-white' : 'w-5 bg-white/40'}`}
              aria-label={`Banner ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );

  return (
    <section className="relative">
      {hasLink ? (
        <Link href={current.cta_link!}>{BannerContent}</Link>
      ) : (
        BannerContent
      )}
    </section>
  );
}
