"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await login(email, password);
      toast.success('Login successful');
      router.push('/');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen bg-center bg-no-repeat flex items-center justify-center" 
      style={{ 
        backgroundImage: 'url("/login_bg.jpg")',
        backgroundColor: 'var(--background)',
        backgroundSize: '110%',
        padding: '16px'
      }}
    >
      <Card 
        className="w-full max-w-md" 
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(8px)',
          borderRadius: 'var(--card-radius)',
          boxShadow: 'var(--shadow-card)',
          border: 'none'
        }}
      >
        <CardHeader className="text-center">
          <CardTitle 
            className="font-bold" 
            style={{
              fontSize: 'var(--text-2xl)',
              fontFamily: 'var(--font-heading)',
              color: 'var(--text-primary)'
            }}
          >
            ReCircle&apos;s TRF
          </CardTitle>
          <CardDescription
            style={{
              color: 'var(--text-secondary)',
              fontSize: 'var(--text-sm)'
            }}
          >
            ReCircle&apos;s Textile Recovery Facility Management System
          </CardDescription>
        </CardHeader>
        <CardContent style={{ padding: 'var(--space-xl)' }}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label 
                htmlFor="email"
                style={{
                  fontSize: 'var(--text-sm)',
                  fontWeight: '500',
                  color: 'var(--text-primary)'
                }}
              >
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input-recircle"
              />
            </div>
            
            <div className="space-y-2">
              <Label 
                htmlFor="password"
                style={{
                  fontSize: 'var(--text-sm)',
                  fontWeight: '500',
                  color: 'var(--text-primary)'
                }}
              >
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input-recircle"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full btn-primary" 
              disabled={isLoading}
              style={{
                marginTop: 'var(--space-xl)'
              }}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign In
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}