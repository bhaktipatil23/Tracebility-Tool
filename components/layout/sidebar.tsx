"use client";

import Image from 'next/image';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth';
import { hasRoutePermission } from '@/lib/permissions';
import {
  PackageIcon,
  Users,
  BarChart3,
  FileText,
  Settings,
  LogOut,
  Home,
  Archive,
  ClipboardCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const navigation = [
  {
    name: 'Dashboard',
    href: '/',
    icon: Home,
    roles: ['ADMIN', 'GATE', 'SEG', 'INVENTORY', 'SALES', 'FINANCE', 'AUDITOR']
  },
  {
    name: 'Material Collection',
    href: '/material-in',
    icon: PackageIcon,
    roles: ['GATE', 'ADMIN', 'AUDITOR']
  },

  {
    name: 'Material Out',
    href: '/material-out',
    icon: Archive,
    roles: ['INVENTORY', 'ADMIN']
  },
  {
    name: 'Partners',
    href: '/partners',
    icon: Users,
    roles: ['ADMIN', 'SALES'],
    children: [
      { name: 'Collection Partners', href: '/partners/collection' },
      { name: 'Processors', href: '/partners/processors' }
    ]
  },
  {
    name: 'Inventory',
    href: '/inventory',
    icon: BarChart3,
    roles: ['INVENTORY', 'SALES', 'ADMIN', 'AUDITOR']
  },

  // {
  //   name: 'Compliance',
  //   href: '/compliance',
  //   icon: ClipboardCheck,
  //   roles: ['AUDITOR', 'ADMIN']
  // },
  // {
  //   name: 'Config',
  //   href: '/config',
  //   icon: Settings,
  //   roles: ['ADMIN']
  // }
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const filteredNavigation = navigation.filter(item => 
    user && hasRoutePermission(item.href, user.role)
  );

  return (
    <div 
      className="flex flex-col fixed left-0 top-0 h-full backdrop-blur-sm bg-white/95 shadow-xl" 
      style={{ 
        width: '300px', 
        zIndex: 100
      }}
    >
      <div className="flex items-center bg-[#01298a]" style={{ height: '60px', padding: '0 16px' }}>
        <Image src="/logo.jpg" alt="Logo" width={68} height={68} className="mt-2 rounded-lg shadow-sm" />
      </div>

      <div className="flex-1 overflow-y-auto">
        <nav className="space-y-2" style={{ padding: '1.5rem 1rem' }}>
          {filteredNavigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            
            return (
              <div key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    'group flex items-center rounded-xl transition-all duration-200 hover:shadow-sm',
                    isActive
                      ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-sm border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  )}
                  style={{
                    padding: '0.75rem 1rem',
                    fontSize: '0.875rem',
                    fontWeight: isActive ? '600' : '500',
                    letterSpacing: '-0.01em'
                  }}
                >
                  <item.icon
                    className={cn(
                      'mr-3 h-5 w-5 transition-colors duration-200',
                      isActive ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-700'
                    )}
                  />
                  {item.name}
                </Link>
                
                {item.children && isActive && (
                  <div className="space-y-1 animate-slide-up" style={{ marginLeft: '2rem', marginTop: '0.5rem' }}>
                    {item.children.map((child) => (
                      <Link
                        key={child.name}
                        href={child.href}
                        className={cn(
                          'block rounded-lg transition-all duration-200 hover:shadow-sm',
                          pathname === child.href
                            ? 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 shadow-sm border border-blue-200'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                        )}
                        style={{
                          padding: '0.5rem 1rem',
                          fontSize: '0.8125rem',
                          fontWeight: pathname === child.href ? '600' : '500',
                          letterSpacing: '-0.01em'
                        }}
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      <div className="border-t bg-gradient-to-r from-gray-50 to-white" style={{ padding: '1rem', borderColor: '#e2e8f0' }}>
        {user && (
          <div className="flex items-center justify-between p-3 rounded-xl bg-white shadow-sm border border-gray-200">
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-gray-900" style={{ fontSize: '0.875rem' }}>
                {user.name}
              </p>
              <p className="truncate text-gray-500" style={{ fontSize: '0.75rem' }}>
                {user.role}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="ml-2 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all duration-200"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}