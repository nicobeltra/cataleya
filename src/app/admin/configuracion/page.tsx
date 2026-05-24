'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

const FIELDS = [
  { key: 'announce_text', label: 'Anuncio superior', type: 'text', section: 'General' },
  { key: 'footer_brand_tagline', label: 'Tagline del footer (ej: "Vestí tu esencia")', type: 'text', section: 'General' },

  { key: 'offer_title', label: 'Título banner ofertas', type: 'text', section: 'Banner Ofertas' },
  { key: 'offer_subtitle', label: 'Subtítulo banner ofertas', type: 'textarea', section: 'Banner Ofertas' },

  { key: 'whatsapp', label: 'WhatsApp (solo números con código país, ej: 5492640000000)', type: 'text', section: 'Contacto y redes' },
  { key: 'whatsapp_url', label: 'URL completa de WhatsApp (opcional, sobrescribe la anterior)', type: 'text', section: 'Contacto y redes' },
  { key: 'instagram', label: 'Instagram (handle, ej: @cataleya)', type: 'text', section: 'Contacto y redes' },
  { key: 'instagram_url', label: 'URL completa de Instagram (ej: https://instagram.com/cataleya)', type: 'text', section: 'Contacto y redes' },

  { key: 'address', label: 'Dirección', type: 'text', section: 'Local' },
  { key: 'city', label: 'Ciudad/Provincia', type: 'text', section: 'Local' },
  { key: 'hours_weekday', label: 'Días de atención', type: 'text', section: 'Local' },
  { key: 'hours_morning', label: 'Horario mañana', type: 'text', section: 'Local' },
  { key: 'hours_evening', label: 'Horario tarde', type: 'text', section: 'Local' },
];

export default function AdminConfig() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    supabase.from('site_config').select('*').then(({ data }) => {
      const map: Record<string, string> = {};
      data?.forEach((r: any) => { map[r.key] = r.value || ''; });
      setValues(map);
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const upserts = FIELDS.map(({ key }) => ({ key, value: values[key] || '' }));
    const { error } = await supabase.from('site_config').upsert(upserts);
    setSaving(false);
    if (error) alert('Error: ' + error.message);
    else {
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }
  };

  const sections = Array.from(new Set(FIELDS.map((f) => f.section)));

  if (loading) return <div className="p-10 text-gray">Cargando…</div>;

  return (
    <div className="p-6 md:p-10 max-w-3xl">
      <div className="mb-8">
        <h1 className="font-serif-c text-4xl font-light">Configuración</h1>
        <p className="text-gray text-sm">Textos del sitio, datos de contacto, links de redes.</p>
      </div>

      <div className="space-y-6">
        {sections.map((section) => (
          <div key={section} className="bg-white p-6 md:p-8">
            <h2 className="font-serif-c text-2xl italic text-rose mb-5">{section}</h2>
            <div className="space-y-4">
              {FIELDS.filter((f) => f.section === section).map((field) => (
                <div key={field.key}>
                  <label className="block text-[10px] tracking-[3px] uppercase text-gray mb-2">{field.label}</label>
                  {field.type === 'textarea' ? (
                    <textarea
                      value={values[field.key] || ''}
                      onChange={(e) => setValues({ ...values, [field.key]: e.target.value })}
                      rows={2}
                      className="w-full border border-line px-4 py-3 text-sm focus:outline-none focus:border-rose"
                    />
                  ) : (
                    <input
                      type="text"
                      value={values[field.key] || ''}
                      onChange={(e) => setValues({ ...values, [field.key]: e.target.value })}
                      className="w-full border border-line px-4 py-3 text-sm focus:outline-none focus:border-rose"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="sticky bottom-0 bg-cream py-4 mt-6 flex items-center gap-3">
        <button onClick={handleSave} disabled={saving} className="bg-black text-white px-8 py-4 text-[11px] tracking-[3px] uppercase hover:bg-rose transition disabled:opacity-50">
          {saving ? 'Guardando…' : 'Guardar cambios'}
        </button>
        {saved && <span className="text-green-700 text-sm">✓ Guardado</span>}
      </div>
    </div>
  );
}
