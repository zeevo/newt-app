export default {
  filename: "apps/web/app/layout.tsx",
  template: `import type { Metadata } from "next";
import localFont from "next/font/local";
import Providers from "./providers";
import "./globals.css";

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
  description: "Next + Nest = Newt",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={\`\${geistSans.variable} \${geistMono.variable}\`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}`,
};
