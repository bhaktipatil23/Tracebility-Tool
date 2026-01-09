"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NewCollectionPartnerPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to collection partners page since we use modal now
    router.replace('/partners/collection');
  }, [router]);

  return null;
}