'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError('Email o contraseña incorrectos');
      setLoading(false);
    } else {
      router.push('/admin');
    }
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-5">
      <div className="bg-white p-10 w-full max-w-md shadow-sm">
        <div className="text-center mb-10">
          <div className="font-serif-c text-3xl tracking-[6px] mb-2">CATALEYA</div>
          <div className="text-[10px] tracking-[3px] uppercase text-rose">Panel administrador</div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="block text-[10px] tracking-[3px] uppercase text-gray mb-2">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
              className="w-full border border-line px-4 py-3 text-sm focus:outline-none focus:border-rose" />
          </div>

          <div className="mb-6">
            <label className="block text-[10px] tracking-[3px] uppercase text-gray mb-2">Contraseña</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
              className="w-full border border-line px-4 py-3 text-sm focus:outline-none focus:border-rose" />
          </div>

          {error && <div className="mb-4 text-sm text-rose">{error}</div>}

          <button type="submit" disabled={loading}
            className="w-full bg-black text-white py-4 text-[11px] tracking-[3px] uppercase hover:bg-rose transition disabled:opacity-50">
            {loading ? 'Ingresando…' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  );
}
