"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NewLotRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/materials/new');
  }, [router]);

  return null;
}