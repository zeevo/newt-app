export default {
  filename: "apps/web/app/layout.tsx",
  template: `'use client';

import localFont from "next/font/local";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@<%= projectName %>/ui/globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <html lang="en" className="dark">
      <head>
        <title><%= projectName %></title>
      </head>
      <body className={\`\${geistSans.variable} \${geistMono.variable} h-full\`}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </body>
    </html>
  );
}`,
};
