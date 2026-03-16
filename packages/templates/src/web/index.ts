import type { Module } from "../types";
import packageJson from "./templates/package-json";
import gitignore from "./templates/gitignore";
import readme from "./templates/readme";
import eslintConfig from "./templates/eslint-config";
import nextConfig from "./templates/next-config";
import postcssConfig from "./templates/postcss-config";
import tsconfig from "./templates/tsconfig";
import globalsCss from "./templates/globals-css";
import layout from "./templates/layout";
import page from "./templates/page";
import providers from "./templates/providers";
import authForm from "./templates/auth-form";
import todoList from "./templates/todo-list";
import authRoute from "./templates/auth-route";
import authClient from "./templates/auth-client";

const web: Module = {
  templates: [
    packageJson,
    gitignore,
    readme,
    eslintConfig,
    nextConfig,
    postcssConfig,
    tsconfig,
    globalsCss,
    layout,
    page,
    providers,
    authForm,
    todoList,
    authRoute,
    authClient,
  ],
  staticFiles: [
    { src: "web/static/fonts/GeistVF.woff", filename: "apps/web/app/fonts/GeistVF.woff" },
    { src: "web/static/fonts/GeistMonoVF.woff", filename: "apps/web/app/fonts/GeistMonoVF.woff" },
    { src: "web/static/favicon.ico", filename: "apps/web/app/favicon.ico" },
    { src: "web/static/public/file-text.svg", filename: "apps/web/public/file-text.svg" },
    { src: "web/static/public/globe.svg", filename: "apps/web/public/globe.svg" },
    { src: "web/static/public/next.svg", filename: "apps/web/public/next.svg" },
    { src: "web/static/public/turborepo-dark.svg", filename: "apps/web/public/turborepo-dark.svg" },
    { src: "web/static/public/turborepo-light.svg", filename: "apps/web/public/turborepo-light.svg" },
    { src: "web/static/public/vercel.svg", filename: "apps/web/public/vercel.svg" },
    { src: "web/static/public/window.svg", filename: "apps/web/public/window.svg" },
  ],
};

export default web;
