export default {
  filename: "apps/web/app/layout.tsx",
  template: `import type { Metadata } from "next";
import localFont from "next/font/local";
import * as stylex from "@stylexjs/stylex";
import Providers from "@/app/providers";
import { colors, fonts } from "@<%= projectName %>/ui/tokens.stylex";
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
  description: "Next + Nest = Newt",
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
    <html lang="en" className={\`\${geistSans.variable} \${geistMono.variable}\`}>
      <body {...stylex.props(styles.body)}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

const styles = stylex.create({
  body: {
    backgroundColor: colors.background,
    color: colors.foreground,
    fontFamily: fonts.sans,
  },
});
`,
};
