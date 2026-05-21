import { CopyButton } from '@/components/copy-button';
import OrbitWrapper from '@/components/orbit-wrapper';
import { SiteFooter } from '@/components/site-footer';

export default function Home() {
  return (
    <div>
      <section className="relative flex items-center justify-center h-[calc(100svh-var(--header-height)-var(--footer-height))] overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            maskImage: [
              'linear-gradient(to bottom, transparent 0%, black 12%)',
              'linear-gradient(to left, transparent 0%, black 10%)',
              'linear-gradient(to top, transparent 0%, black 10%)',
              'radial-gradient(ellipse 65% 70% at 82% 44%, black 22%, transparent 72%)',
            ].join(', '),
            WebkitMaskImage: [
              'linear-gradient(to bottom, transparent 0%, black 12%)',
              'linear-gradient(to left, transparent 0%, black 10%)',
              'linear-gradient(to top, transparent 0%, black 10%)',
              'radial-gradient(ellipse 65% 70% at 82% 44%, black 22%, transparent 72%)',
            ].join(', '),
          }}
        >
          <div
            className="w-full h-full flex items-center justify-center"
            style={{
              transform: 'translate(60%, -18%)',
            }}
          >
            <OrbitWrapper />
          </div>
        </div>
        <div className="relative flex items-center lg:justify-center flex-col gap-2 z-10">
          <h1 className="p-1 rounded text-6xl font-semibold tracking-tight text-balance lg:leading-[1.1] lg:font-semibold xl:text-8xl xl:tracking-tighter max-w-4xl bg-gradient-to-r from-black to-gray-500 dark:from-white dark:to-gray-500 bg-clip-text text-transparent">
            newt-app
          </h1>
          <p className="text-center max-w-xl text-base text-balance sm:text-lg text-muted-foreground">
            Everything you want. Nothing you don&apos;t need. The monorepo-first
            way to build full-stack TypeScript apps.
          </p>
          <div className="mx-auto flex flex-col items-center gap-4 pt-2 sm:flex-row">
            <div className="flex h-10 w-full items-center justify-center gap-2 whitespace-nowrap rounded-md border bg-background py-2 pr-px pl-4 text-foreground text-sm shadow-sm">
              <p className="pointer-events-none shrink-0 select-none text-muted-foreground">
                $
              </p>
              <div className="flex-1 truncate text-left font-mono">
                npm create newt-app
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <CopyButton value={'npm create newt-app'} />
              </div>
            </div>
          </div>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
