import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPageBySlug } from '@/lib/supabase';

export const revalidate = 60;

function renderContent(content: string): string {
  return content
    .split('\n\n')
    .map((para) => {
      const trimmed = para.trim();
      if (!trimmed) return '';
      if (trimmed.split('\n').every((l) => l.trim().startsWith('-'))) {
        const items = trimmed.split('\n').map((l) => `<li>${l.replace(/^-\s*/, '').replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')}</li>`).join('');
        return `<ul>${items}</ul>`;
      }
      if (/^\*\*[^*]+\*\*:?$/.test(trimmed)) {
        return `<h3>${trimmed.replace(/\*\*/g, '').replace(/:$/, '')}</h3>`;
      }
      return `<p>${trimmed.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>')}</p>`;
    })
    .join('');
}

export default async function PageRoute({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);
  if (!page) notFound();

  return (
    <div className="max-w-[800px] mx-auto px-5 py-12 md:py-20">
      <div className="text-[11px] tracking-[3px] uppercase text-gray mb-6">
        <Link href="/" className="hover:text-rose">Inicio</Link> / {page.title}
      </div>
      <h1 className="font-serif-c font-light leading-[1.1] mb-8" style={{ fontSize: 'clamp(36px, 5vw, 56px)' }}>
        {page.title.split(' ').map((w, i, arr) =>
          i === arr.length - 1 ? <em key={i} className="italic text-rose">{w}</em> : <span key={i}>{w} </span>
        )}
      </h1>
      <div
        className="prose-cataleya text-[15px] leading-relaxed text-black/80"
        dangerouslySetInnerHTML={{ __html: renderContent(page.content || '') }}
      />
    </div>
  );
}
