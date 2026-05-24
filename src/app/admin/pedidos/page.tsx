'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

function fmt(n: number) { return '$ ' + n.toLocaleString('es-AR'); }
function fmtDate(d: string) { return new Date(d).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }); }

const STATUS_COLORS: Record<string, string> = {
  pendiente: 'bg-yellow-100 text-yellow-800',
  pagado: 'bg-blue-100 text-blue-800',
  enviado: 'bg-purple-100 text-purple-800',
  entregado: 'bg-green-100 text-green-800',
  cancelado: 'bg-red-100 text-red-800',
};

export default function AdminPedidos() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    setOrders(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('orders').update({ status }).eq('id', id);
    load();
  };

  const filtered = filter ? orders.filter((o) => o.status === filter) : orders;

  return (
    <div className="p-6 md:p-10">
      <div className="mb-8">
        <h1 className="font-serif-c text-4xl font-light">Pedidos</h1>
        <p className="text-gray text-sm">{orders.length} pedidos en total</p>
      </div>

      <div className="bg-white p-4 mb-6 flex flex-wrap gap-2">
        <button onClick={() => setFilter('')} className={`px-3 py-1.5 text-[11px] tracking-[2px] uppercase ${filter === '' ? 'bg-black text-white' : 'bg-cream'}`}>Todos</button>
        {['pendiente', 'pagado', 'enviado', 'entregado', 'cancelado'].map((s) => (
          <button key={s} onClick={() => setFilter(s)} className={`px-3 py-1.5 text-[11px] tracking-[2px] uppercase ${filter === s ? 'bg-black text-white' : 'bg-cream'}`}>{s}</button>
        ))}
      </div>

      {loading ? (
        <div className="text-gray text-center py-10">Cargando…</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white p-10 text-center text-gray">Todavía no hay pedidos.</div>
      ) : (
        <div className="space-y-3">
          {filtered.map((o) => (
            <div key={o.id} className="bg-white p-5">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                <div>
                  <div className="font-serif-c text-xl">{o.customer_name || 'Sin nombre'}</div>
                  <div className="text-xs text-gray mt-1">{fmtDate(o.created_at)}</div>
                  <div className="text-sm mt-2">{o.customer_email} · {o.customer_phone}</div>
                  {o.shipping_address && <div className="text-sm text-gray mt-1">📍 {o.shipping_address}</div>}
                </div>
                <div className="text-right">
                  <div className="font-serif-c text-2xl mb-2">{fmt(o.total)}</div>
                  <select value={o.status}
                    onChange={(e) => updateStatus(o.id, e.target.value)}
                    className={`text-[10px] tracking-wider uppercase px-3 py-1.5 border-0 cursor-pointer ${STATUS_COLORS[o.status]}`}>
                    <option value="pendiente">Pendiente</option>
                    <option value="pagado">Pagado</option>
                    <option value="enviado">Enviado</option>
                    <option value="entregado">Entregado</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-line text-sm">
                {Array.isArray(o.items) && o.items.map((it: any, i: number) => (
                  <div key={i} className="flex justify-between py-1">
                    <span>{it.name} (Talle {it.size}) x{it.quantity}</span>
                    <span>{fmt(it.price * it.quantity)}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
