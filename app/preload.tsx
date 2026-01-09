"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const routes = [
  '/',
  '/material-in',
  '/material-in/new',
  '/material-out',
  '/material-out/new',
  '/partners',
  '/partners/collection',
  '/partners/collection/new',
  '/partners/processors',
  '/partners/processors/new',
  '/inventory'
];

export function PreloadRoutes() {
  const router = useRouter();

  useEffect(() => {
    routes.forEach(route => {
      router.prefetch(route);
    });
  }, [router]);

  return null;
}