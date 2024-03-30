"use client"
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RootDirect() {
  const router = useRouter();

  useEffect(() => {
    router.push('/board/latest');
  }, []);

  return null;
};