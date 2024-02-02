"use client"
import React from 'react';
import { SessionProvider } from 'next-auth/react';
import { TourProvider } from './onboarding/tourContext';

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {  return (
    <SessionProvider>
      <TourProvider>
        <div>
          {children}
        </div>
      </TourProvider>
    </SessionProvider>
  );
};

