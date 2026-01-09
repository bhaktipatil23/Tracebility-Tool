"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PackagingRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/material-out');
  }, [router]);

  return null;
}