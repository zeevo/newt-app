import dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '../../.env'), quiet: true });
dotenv.config({ path: resolve(process.cwd(), '.env'), quiet: true });

/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: [
    '@my-app/api',
    '@my-app/db',
    '@nestjs/core',
    '@nestjs/common',
    '@nestjs/microservices',
    '@nestjs/websockets',
    '@thallesp/nestjs-better-auth',
    'reflect-metadata',
    'express',
  ],
};

export default nextConfig;