'use client';

import React, { useState, FormEvent, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Typography } from '@/components/ui/Typography';
import { Container } from '@/components/layout/Container';

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-[120px]" />}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');
  const { login, isLoading, error, clearError, isAuthenticated, user } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      const roleName = (user.role as any)?.name;
      if (roleName === 'ADMIN') {
        router.push('/dashboard');
      } else {
        router.push(callbackUrl || '/');
      }
    }
  }, [isAuthenticated, user, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (error) clearError();

    try {
      const loggedInUser = await login({ email, password });
      const roleName = (loggedInUser.role as any)?.name;
      if (roleName === 'ADMIN') {
        router.push('/dashboard');
      } else {
        router.push(callbackUrl || '/');
      }
    } catch (err) {
      // Error is caught and stored in useAuthStore,
      // which will be displayed in the UI below
    }
  };

  return (
    <main className="min-h-screen pt-[120px] pb-[80px] flex items-center justify-center bg-white">
      <Container>
        <div className="max-w-[440px] mx-auto w-full">
          <div className="text-center mb-12">
            <Typography variant="h2" className="mb-4">
              Welcome <span className="italic">Back</span>
            </Typography>
            <Typography variant="body" muted>
              Sign in to access your MONO account
            </Typography>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <Input
              type="email"
              label="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={isLoading}
            />

            <Input
              type="password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              disabled={isLoading}
            />

            {error && (
              <div className="p-4 bg-red-50/50 border border-red-100 mt-2">
                <Typography variant="body" className="text-red-500 text-[13px] text-center">
                  {error}
                </Typography>
              </div>
            )}

            <div className="mt-4">
              <Button
                type="submit"
                variant="primary"
                fullWidth
                disabled={isLoading}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>
            </div>
          </form>
        </div>
      </Container>
    </main>
  );
}
