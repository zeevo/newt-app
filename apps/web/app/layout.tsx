import { siteConfig } from "@/lib/config";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import { Toaster } from "@newt-app/ui/components/sonner";
import "@newt-app/ui/globals.css";
import "./styles.css";
import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { ThemeProvider } from "./_components/theme-provider";

// the whole site runs on one mono; --font-mono resolves to it too
const appFont = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-app-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: siteConfig.title,
  description: siteConfig.description,
  openGraph: {
    type: "website",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    creator: siteConfig.twitterHandle,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${appFont.variable} overscroll-none font-sans text-base text-foreground antialiased [--footer-height:calc(var(--spacing)*18)] [--header-height:calc(var(--spacing)*14)]`}
      >
        <NuqsAdapter>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <div className="relative z-10 flex min-h-svh flex-col bg-background">
              <div className="dot-fade-bg absolute inset-0 z-[-1]"></div>
              <SiteHeader />
              <main className="flex flex-1 flex-col">{children}</main>
              <SiteFooter />
            </div>
            <Toaster />
          </ThemeProvider>
        </NuqsAdapter>
        <TailwindIndicator />
      </body>
    </html>
  );
}
