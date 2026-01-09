"use client";

import React from 'react';
import { Bell, User, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface HeaderProps {
  pageTitle?: string;
}

export function Header({ pageTitle = "Textile Recovery Facility" }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-[9999] bg-[#01298a] h-[60px] w-full">
      <div className="flex items-center justify-between h-full px-6">
        {/* Left Section: Logo/Brand and Title */}
        <div className="flex items-center space-x-4 h-full">
          <div className="bg-transparent h-full flex items-center px-2">
            <img 
              src="/recircle-logo.png" 
              alt="ReCircle Logo" 
              className="h-[56px] w-auto"
            />
          </div>
          <h1 className="text-white font-semibold text-xl">{pageTitle}</h1>
        </div>

        {/* Right Section: Empty */}
        <div className="flex items-center space-x-4">
        </div>
      </div>
    </header>
  );
}