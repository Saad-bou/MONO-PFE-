'use client';

import React, { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Typography } from '@/components/ui/Typography';
import { Container } from '@/components/layout/Container';

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading, error, clearError, isAuthenticated, user } = useAuthStore();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      const roleName = (user.role as any)?.name;
      if (roleName === 'ADMIN') {
        router.push('/dashboard');
      } else {
        router.push('/');
      }
    }
  }, [isAuthenticated, user, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (error) clearError();

    try {
      const registeredUser = await register({ firstName, lastName, email, password });

      if (registeredUser) {
        const roleName = (registeredUser.role as any)?.name;
        if (roleName === 'ADMIN') {
          router.push('/dashboard');
        } else {
          router.push('/');
        }
      } else {
        router.push('/login');
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
              Create <span className="italic">Account</span>
            </Typography>
            <Typography variant="body" muted>
              Join MONO and explore the future of fashion
            </Typography>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex gap-4">
              <Input
                type="text"
                label="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First name"
                required
                disabled={isLoading}
              />
              <Input
                type="text"
                label="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last name"
                required
                disabled={isLoading}
              />
            </div>

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
              placeholder="Create a password"
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
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </div>
          </form>
        </div>
      </Container>
    </main>
  );
}
