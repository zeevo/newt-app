import type { Module } from "../types";
import packageJson from "./templates/package-json";
import gitignore from "./templates/gitignore";
import readme from "./templates/readme";
import nextConfig from "./templates/next-config";
import postcssConfig from "./templates/postcss-config";
import tsconfig from "./templates/tsconfig";
import layout from "./templates/layout";
import page from "./templates/page";
import providers from "./templates/providers";
import authForm from "./templates/auth-form";
import authRoute from "./templates/auth-route";
import authClient from "./templates/auth-client";
import manifest from "./templates/manifest";
const web: Module = {
  templates: [
    packageJson,
    gitignore,
    readme,
    nextConfig,
    postcssConfig,
    tsconfig,
    layout,
    page,
    providers,
    authForm,
    authRoute,
    authClient,
    manifest,
  ],
  staticFiles: [
    {
      src: "web/static/fonts/GeistVF.woff",
      filename: "apps/web/app/fonts/GeistVF.woff",
    },
    {
      src: "web/static/fonts/GeistMonoVF.woff",
      filename: "apps/web/app/fonts/GeistMonoVF.woff",
    },
    { src: "web/static/favicon.ico", filename: "apps/web/app/favicon.ico" },
    { src: "web/static/icon0.svg", filename: "apps/web/app/icon0.svg" },
    { src: "web/static/icon1.png", filename: "apps/web/app/icon1.png" },
    {
      src: "web/static/apple-icon.png",
      filename: "apps/web/app/apple-icon.png",
    },
    {
      src: "web/static/public/web-app-manifest-192x192.png",
      filename: "apps/web/public/web-app-manifest-192x192.png",
    },
    {
      src: "web/static/public/web-app-manifest-512x512.png",
      filename: "apps/web/public/web-app-manifest-512x512.png",
    },
  ],
};

export default web;
