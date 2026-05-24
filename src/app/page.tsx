import Link from 'next/link';
import { getCategories, getFeaturedProducts, getSiteConfig, getActiveBanners } from '@/lib/supabase';
import ProductCard from '@/components/ProductCard';
import BannerCarousel from '@/components/BannerCarousel';

function phClass(order: number): string {
  return `ph-${(order % 10) + 1}`;
}

export const dynamic = 'force-dynamic';

export default async function Home() {
  const [categories, featured, config, banners] = await Promise.all([
    getCategories(),
    getFeaturedProducts(),
    getSiteConfig(),
    getActiveBanners(),
  ]);

  const marqueeItems = [
    'Nuevos ingresos cada semana',
    'Envíos a todo el país',
    '3 cuotas sin interés',
    'Cambios y devoluciones',
  ];

  return (
    <>
      <BannerCarousel banners={banners} />

      <div className="bg-black text-white py-4 overflow-hidden whitespace-nowrap">
        <div className="inline-block animate-scroll">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} className="font-serif-c italic text-base mx-7 tracking-[2px]">
              {item}<span className="ml-14 text-rose not-italic">✦</span>
            </span>
          ))}
        </div>
      </div>

      <section id="categorias" className="px-5 py-20 max-w-[1400px] mx-auto">
        <div className="text-center mb-12">
          <div className="text-[11px] tracking-[4px] uppercase text-gray mb-4">Explorá</div>
          <h2 className="font-serif-c font-light leading-[1.1]" style={{ fontSize: 'clamp(32px, 5vw, 52px)' }}>
            Nuestras <em className="italic text-rose">categorías</em>
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {categories.map((c) => (
            <Link key={c.id} href={`/categoria/${c.slug}`} className="relative aspect-[3/4] overflow-hidden block group">
              <div className={`ph ${phClass(c.order)} transition-transform duration-700 group-hover:scale-105`}>
                {c.image_url ? (
                  <img src={c.image_url} alt={c.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="ph-label">{c.name}</span>
                )}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent flex items-end p-5 z-10">
                <div className="text-white font-serif-c text-xl md:text-2xl tracking-[2px]">{c.name}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="px-5 py-20 max-w-[1400px] mx-auto">
        <div className="text-center mb-12">
          <div className="text-[11px] tracking-[4px] uppercase text-gray mb-4">Lo más buscado</div>
          <h2 className="font-serif-c font-light leading-[1.1]" style={{ fontSize: 'clamp(32px, 5vw, 52px)' }}>
            Productos <em className="italic text-rose">destacados</em>
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {featured.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      <section className="bg-black text-white px-5 py-20 text-center my-10 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-serif-c italic opacity-5 tracking-[20px] whitespace-nowrap pointer-events-none" style={{ fontSize: 'clamp(120px, 28vw, 280px)' }}>
          OFERTAS
        </div>
        <div className="relative z-10">
          <div className="text-[11px] tracking-[6px] uppercase text-rose mb-5">Tiempo limitado</div>
          <h2 className="font-serif-c font-light mb-5" style={{ fontSize: 'clamp(42px, 8vw, 72px)' }}>
            {config.offer_title || 'Hasta 40% OFF'}
          </h2>
          <p className="max-w-[500px] mx-auto mb-9 text-sm text-white/70 px-5">
            {config.offer_subtitle || 'Seleccionamos prendas únicas a precios irresistibles.'}
          </p>
          <Link href="/categoria/ofertas" className="inline-block bg-white text-black px-10 py-4 text-[11px] tracking-[3px] uppercase hover:bg-rose hover:text-white transition-colors">
            Ver ofertas →
          </Link>
        </div>
      </section>

      <section className="bg-cream px-5 py-20">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <h4 className="font-serif-c text-2xl italic text-rose mb-4">Visitanos</h4>
            <div className="text-[10px] tracking-[3px] uppercase text-gray mb-1.5">Dirección</div>
            <p className="text-sm mb-1.5">{config.address}</p>
            <p className="text-sm mb-1.5">{config.city}</p>
          </div>
          <div>
            <h4 className="font-serif-c text-2xl italic text-rose mb-4">Hablanos</h4>
            <div className="text-[10px] tracking-[3px] uppercase text-gray mb-1.5">WhatsApp</div>
            <p className="text-sm mb-1.5">+{config.whatsapp}</p>
            <div className="text-[10px] tracking-[3px] uppercase text-gray mb-1.5 mt-4">Instagram</div>
            <p className="text-sm">{config.instagram}</p>
          </div>
          <div>
            <h4 className="font-serif-c text-2xl italic text-rose mb-4">Horarios</h4>
            <div className="text-[10px] tracking-[3px] uppercase text-gray mb-1.5">{config.hours_weekday}</div>
            <p className="text-sm mb-1.5">{config.hours_morning}</p>
            <p className="text-sm">{config.hours_evening}</p>
          </div>
        </div>
      </section>
    </>
  );
}
