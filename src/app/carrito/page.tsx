'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useCart } from '@/components/CartContext';
import { supabase } from '@/lib/supabase';

function fmt(n: number) { return '$ ' + n.toLocaleString('es-AR'); }

export default function CartPage() {
  const { items, removeItem, total, count } = useCart();
  const [phone, setPhone] = useState('');

  useEffect(() => {
    supabase.from('site_config').select('value').eq('key', 'whatsapp').single()
      .then(({ data }) => { if (data?.value) setPhone(data.value); });
  }, []);

  const whatsappMsg = encodeURIComponent(
    `Hola! Quiero comprar:\n\n${items.map(i => `• ${i.name} (Talle ${i.size}) x${i.quantity} — ${fmt(i.price * i.quantity)}`).join('\n')}\n\nTotal: ${fmt(total)}`
  );

  if (count === 0) {
    return (
      <div className="max-w-[800px] mx-auto py-32 px-5 text-center">
        <h1 className="font-serif-c text-5xl font-light mb-4">Tu carrito está <em className="italic text-rose">vacío</em></h1>
        <p className="text-gray mb-8">Explorá nuestras categorías y encontrá tu próxima prenda favorita.</p>
        <Link href="/" className="inline-block bg-black text-white px-9 py-4 text-[11px] tracking-[3px] uppercase hover:bg-rose transition-colors">
          Ver productos →
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto py-12 px-5">
      <h1 className="font-serif-c text-4xl md:text-5xl font-light mb-10 text-center">
        Tu <em className="italic text-rose">carrito</em>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-10">
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.productId + item.size} className="flex gap-4 pb-4 border-b border-line">
              <div className="w-20 h-24 bg-cream flex items-center justify-center overflow-hidden">
                {item.image ? <img src={item.image} alt="" className="w-full h-full object-cover" /> : <span className="font-serif-c italic text-rose text-xs">CATALEYA</span>}
              </div>
              <div className="flex-1">
                <div className="font-serif-c text-lg">{item.name}</div>
                <div className="text-xs text-gray tracking-wide mb-2">Talle {item.size} · Cantidad {item.quantity}</div>
                <div className="text-sm">{fmt(item.price * item.quantity)}</div>
              </div>
              <button onClick={() => removeItem(item.productId, item.size)} className="text-xs uppercase tracking-wide text-gray hover:text-rose self-start">
                Quitar
              </button>
            </div>
          ))}
        </div>

        <div className="bg-cream p-6 h-fit">
          <h3 className="font-serif-c text-xl italic text-rose mb-4">Resumen</h3>
          <div className="flex justify-between text-sm mb-2"><span>Subtotal</span><span>{fmt(total)}</span></div>
          <div className="flex justify-between text-sm mb-4 text-gray"><span>Envío</span><span>A coordinar</span></div>
          <div className="flex justify-between text-lg font-medium pt-4 border-t border-line mb-6">
            <span>Total</span><span>{fmt(total)}</span>
          </div>

          <a
            href={phone ? `https://wa.me/${phone}?text=${whatsappMsg}` : '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-black text-white py-4 text-center text-[11px] tracking-[3px] uppercase hover:bg-rose transition-colors mb-3"
          >
            Finalizar por WhatsApp
          </a>
          <p className="text-[11px] text-gray text-center leading-relaxed">
            Próximamente: pago con Mercado Pago
          </p>
        </div>
      </div>
    </div>
  );
}
