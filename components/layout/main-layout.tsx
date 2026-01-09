"use client";

import React from 'react';
import { Sidebar } from './sidebar';
import { Header } from './header';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Sidebar />
      <Header />
      <main 
        className="overflow-x-hidden overflow-y-auto transition-all duration-300 ease-in-out" 
        style={{ 
          marginTop: '60px',
          marginLeft: '300px',
          padding: '2rem'
        }}
      >
        <div 
          className="mx-auto animate-fade-in" 
          style={{ 
            maxWidth: '1200px',
            width: '100%'
          }}
        >
          {children}
        </div>
      </main>
    </div>
  );
}