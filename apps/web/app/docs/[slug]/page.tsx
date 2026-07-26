import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getDocsPostBySlug, getDocsPostSlugs, getMDXContent } from '@/lib/docs';
import { TableOfContents } from '@/components/table-of-contents';
import { DocsPager } from '@/components/docs-pager';
import Image from 'next/image';

const slugLogos: Record<string, { src: string; alt: string; invert?: boolean }> = {
  nextjs: { src: '/logos/nextjs.svg', alt: 'Next.js logo', invert: true },
  nestjs: { src: '/logos/nestjs.svg', alt: 'NestJS logo' },
  'better-auth': { src: '/logos/better-auth.svg', alt: 'Better Auth logo', invert: true },
};

interface DocsPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const slugs = getDocsPostSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({
  params,
}: DocsPostPageProps): Promise<Metadata> {
  const param = await params;
  const post = getDocsPostBySlug(param.slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: `${post.title} - Next newt Docs`,
    description: post.description,
    authors: [{ name: post.author }],
    keywords: post.tags,
  };
}

export default async function DocsPostPage({ params }: DocsPostPageProps) {
  const param = await params;

  const post = getDocsPostBySlug(param.slug);

  if (!post) {
    notFound();
  }

  const mdxContent = await getMDXContent(post.content);
  const prevPost = post.prev ? getDocsPostBySlug(post.prev) : null;
  const nextPost = post.next ? getDocsPostBySlug(post.next) : null;

  return (
    <div className="flex h-full">
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-4xl p-6 lg:p-8">
          <article>
            <div className="rule mb-8 border-b pb-8">
              <span className="eyebrow">Docs / {param.slug.replace(/-/g, ' ')}</span>
              <h1 className="mt-4 mb-4 flex items-center gap-3 font-heading text-5xl font-normal tracking-[0.01em]">
                {(() => {
                  const logo = slugLogos[param.slug];
                  return logo ? (
                    <Image
                      src={logo.src}
                      alt={logo.alt}
                      width={36}
                      height={36}
                      className={logo.invert ? 'shrink-0 dark:invert' : 'shrink-0'}
                    />
                  ) : null;
                })()}
                {post.title}
              </h1>
              <p className="text-xl text-muted-foreground">
                {post.description}
              </p>
            </div>

            <div className="max-w-none">{mdxContent}</div>
            <DocsPager
              prev={prevPost ? { slug: prevPost.slug, title: prevPost.title } : null}
              next={nextPost ? { slug: nextPost.slug, title: nextPost.title } : null}
            />
          </article>
        </div>
      </div>
      <div className="sticky top-[calc(var(--header-height)+1px)] z-30 ml-auto hidden h-[calc(100svh-var(--header-height)-var(--footer-height))] w-72 flex-col gap-4 overflow-hidden overscroll-none pb-8 xl:flex">
        <div className="h-(--top-spacing) shrink-0" />
        <div className="no-scrollbar overflow-y-auto px-8">
          <TableOfContents />
          <div className="h-12" />
        </div>
      </div>
    </div>
  );
}
