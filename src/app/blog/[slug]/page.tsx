import Image from 'next/image';
import { draftMode } from 'next/headers';
import qs from 'qs';
import CopyLinkButton from './CopyLinkButton';

type NormalizedArticle = {
  id: string;
  title: string;
  subtitle?: string;
  content: string;
  cover: {
    url: string;
    alt: string;
    width?: number;
    height?: number;
  } | null;
  createdAt: string | null;
};

function resolveMedia(media: unknown): NormalizedArticle['cover'] {
  const base = (process.env.NEXT_PUBLIC_STRAPI_URL ?? '').replace(/\/$/, '');
  const candidate =
    (media as { data?: unknown })?.data ||
    (media as { attributes?: unknown })?.attributes ||
    media;

  if (!candidate || typeof candidate !== 'object') return null;

  const { url, alternativeText, name, width, height } = candidate as {
    url?: string;
    alternativeText?: string;
    name?: string;
    width?: number;
    height?: number;
  };

  if (!url) return null;

  const resolvedUrl = url.startsWith('http') ? url : `${base}${url}`;

  return {
    url: resolvedUrl,
    alt: alternativeText || name || 'Blog cover',
    width,
    height
  };
}

function normalizeArticle(entry: unknown): NormalizedArticle | null {
  if (!entry || typeof entry !== 'object') return null;

  const base = entry as {
    id?: number | string;
    attributes?: Record<string, unknown>;
  };

  const attributes = (base.attributes as Record<string, unknown>) ?? base;

  const content = (attributes.content as string) ?? '';

  return {
    id:
      (base.id !== undefined ? String(base.id) : undefined) ||
      ((attributes as { documentId?: string }).documentId ?? ''),
    title: (attributes.title as string) ?? 'Untitled',
    subtitle:
      (attributes.subTitle as string | undefined) ||
      (attributes.subtitle as string | undefined),
    content,
    cover: resolveMedia((attributes as { cover?: unknown }).cover),
    createdAt: (attributes.createdAt as string | null | undefined) ?? null
  };
}

function formatPublishedDate(iso?: string | null) {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(date);
}

async function fetchArticle(
  slug: string,
  { draft }: { draft: boolean }
): Promise<NormalizedArticle | null> {
  const base = process.env.NEXT_PUBLIC_STRAPI_URL!;
  const qsParams = qs.stringify(
    {
      filters: { slug: { $eq: slug } },
      populate: '*',
      status: draft ? 'draft' : 'published'
    },
    { encodeValuesOnly: true }
  );

  const headers: Record<string, string> = {};
  if (draft && process.env.STRAPI_PREVIEW_TOKEN) {
    headers['Authorization'] = `Bearer ${process.env.STRAPI_PREVIEW_TOKEN}`;
  }

  const res = await fetch(`${base}/api/articles?${qsParams}`, {
    cache: 'no-store',
    headers
  });

  if (!res.ok) throw new Error('Failed to fetch');
  const json = await res.json();

  return normalizeArticle(json.data?.[0]) ?? null;
}

export default async function Page({ params }: { params: { slug: string } }) {
  const { isEnabled } = await draftMode();

  const article = await fetchArticle(params.slug, { draft: isEnabled });

  if (!article) {
    return (
      <main className='flex min-h-[60vh] items-center justify-center bg-slate-950 px-6 text-center text-slate-300'>
        Không tìm thấy bài viết.
      </main>
    );
  }

  const formattedDate = formatPublishedDate(article.createdAt);

  return (
    <main className='relative min-h-screen bg-gradient-to-b from-[#04030f] via-[#111731] to-[#04030f] pb-24 pt-16 text-slate-100'>
      {isEnabled && (
        <div className='mx-auto mb-8 flex w-full max-w-5xl flex-wrap items-center justify-between gap-4 rounded-2xl border border-yellow-300/40 bg-yellow-400/10 px-5 py-4 text-sm text-yellow-50 shadow-[0_16px_40px_rgba(252,211,77,0.15)]'>
          <span>Preview mode is active.</span>
          <a
            className='font-medium underline underline-offset-4 hover:text-yellow-200'
            href={`/api/exit-preview?redirect=/blog/${params.slug}`}
          >
            Exit preview
          </a>
        </div>
      )}

      <article className='mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 sm:px-10 lg:px-0'>
        <div className='overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04] shadow-[0_40px_120px_-32px_rgba(12,17,43,0.75)] backdrop-blur-xl'>
          <div className='relative isolate'>
            {article.cover ? (
              <div className='relative h-[320px] w-full overflow-hidden sm:h-[420px] lg:h-[460px]'>
                <Image
                  src={article.cover.url}
                  alt={article.cover.alt || article.title}
                  fill
                  priority
                  className='object-cover object-center'
                  sizes='(max-width: 768px) 100vw, (max-width: 1200px) 960px, 960px'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/25 to-transparent' />
              </div>
            ) : (
              <div className='relative flex h-[280px] w-full items-center justify-center bg-gradient-to-br from-indigo-500/30 via-sky-500/30 to-purple-500/30 sm:h-[360px] lg:h-[420px]'>
                <div className='absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.35),transparent_55%)]' />
                <span className='relative text-sm font-medium uppercase tracking-[0.4em] text-white/70'>Blog</span>
              </div>
            )}

            <div className='relative mx-auto grid w-full gap-5 px-6 pb-10 pt-10 sm:max-w-3xl sm:px-8 md:px-12'>
              <span className='text-xs font-medium uppercase tracking-[0.35em] text-white/60'>
                Blog
              </span>

              <h1 className='text-balance text-4xl font-semibold leading-[1.1] sm:text-5xl md:text-6xl'>
                {article.title}
              </h1>
              {article.subtitle && (
                <p className='text-pretty text-base text-slate-200/80 sm:text-lg'>
                  {article.subtitle}
                </p>
              )}

              {formattedDate && (
                <time
                  dateTime={article.createdAt ?? undefined}
                  className='text-sm font-medium uppercase tracking-[0.3em] text-white/60'
                >
                  {formattedDate}
                </time>
              )}

              <CopyLinkButton href={`/blog/${params.slug}`} />
            </div>
          </div>

          <div className='border-t border-white/10 bg-slate-950/40 px-6 py-10 sm:px-8 md:px-12'>
            <div
              className='content-body text-base leading-8 text-slate-100/90 [&_a]:text-sky-300 [&_a:hover]:text-sky-200 [&_blockquote]:border-l-4 [&_blockquote]:border-sky-400 [&_blockquote]:bg-slate-900/40 [&_blockquote]:px-6 [&_blockquote]:py-4 [&_blockquote]:text-lg [&_blockquote]:text-slate-100 [&_code]:rounded-md [&_code]:bg-slate-900/80 [&_code]:px-2 [&_code]:py-1 [&_h2]:mt-12 [&_h2]:text-3xl [&_h2]:font-semibold [&_h3]:mt-10 [&_h3]:text-2xl [&_h3]:font-semibold [&_img]:my-8 [&_img]:w-full [&_img]:rounded-3xl [&_li]:mt-3 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mt-6 [&_strong]:text-slate-50 [&_ul]:list-disc [&_ul]:pl-6'
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </div>
        </div>

      </article>
    </main>
  );
}
