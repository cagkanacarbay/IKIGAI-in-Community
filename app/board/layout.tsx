"use client"
import React from 'react';
import { SessionProvider } from 'next-auth/react';
import { BoardProvider } from './boardContext';

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {  return (
    <SessionProvider>
      <BoardProvider>
        <div>
          {children}
        </div>
      </BoardProvider>
    </SessionProvider>
  );
};

