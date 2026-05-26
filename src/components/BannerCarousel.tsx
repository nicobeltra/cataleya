'use client';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Banner } from '@/lib/types';

export default function BannerCarousel({ banners }: { banners: Banner[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  useEffect(() => {
    if (banners.length <= 1 || paused) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % banners.length), 3500);
    return () => clearInterval(t);
  }, [banners.length, paused]);

  const next = () => setIndex((i) => (i + 1) % banners.length);
  const prev = () => setIndex((i) => (i - 1 + banners.length) % banners.length);

  // Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchEndX.current = null;
    touchStartX.current = e.targetTouches[0].clientX;
    setPaused(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) {
      setPaused(false);
      return;
    }
    const distance = touchStartX.current - touchEndX.current;
    const minSwipe = 50;
    if (distance > minSwipe) next();
    else if (distance < -minSwipe) prev();
    setTimeout(() => setPaused(false), 3000);
  };

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

  const BannerContent = (
    <div
      className="relative w-full h-full min-h-[60vh] md:min-h-[75vh] overflow-hidden cursor-pointer select-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {banners.map((b, i) => {
        const mobileSrc = b.image_url_mobile || b.image_url_desktop || b.image_url;
        const desktopSrc = b.image_url_desktop || b.image_url_mobile || b.image_url;
        return (
          <div key={b.id} className={`absolute inset-0 transition-opacity duration-700 ${i === index ? 'opacity-100' : 'opacity-0'}`}>
            {/* Mobile */}
            <Image
              src={mobileSrc}
              alt={b.title || ''}
              fill
              priority={i === 0}
              sizes="100vw"
              className="object-cover md:hidden"
            />
            {/* Desktop */}
            <Image
              src={desktopSrc}
              alt={b.title || ''}
              fill
              priority={i === 0}
              sizes="100vw"
              className="object-cover hidden md:block"
            />
          </div>
        );
      })}

      {(current.title || current.subtitle || current.eyebrow) && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent flex items-end md:items-center z-10 pointer-events-none">
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

      {/* Flechas desktop */}
      {banners.length > 1 && (
        <>
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); prev(); }}
            className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 items-center justify-center bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full text-white text-2xl z-20 transition"
            aria-label="Anterior"
          >‹</button>
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); next(); }}
            className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 items-center justify-center bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full text-white text-2xl z-20 transition"
            aria-label="Siguiente"
          >›</button>
        </>
      )}

      {/* Dots */}
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
