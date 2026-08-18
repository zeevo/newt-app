export default {
  filename: "apps/web/app/layout.tsx",
  template: `import type { Metadata } from "next";
import localFont from "next/font/local";
import Providers from "@/app/providers";
import { Toaster } from "@<%= projectName %>/ui/sonner";
import "@<%= projectName %>/ui/globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "<%= projectName %>",
  description: "<% if (mode === 'bare') { %>Next.js, batteries included<% } else { %>Next + Nest = Newt<% } %>",
  icons: {
    icon: [
      { url: "/icon0.svg", type: "image/svg+xml" },
      { url: "/icon1.png", type: "image/png" },
    ],
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={\`\${geistSans.variable} \${geistMono.variable} h-full\`}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}`,
};
