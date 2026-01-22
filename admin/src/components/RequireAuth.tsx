// admin\src\components\RequireAuth.tsx
'use client';

import { useAuth } from './AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace('/'); // redirect to login
    }
  }, [isAuthenticated, loading, router]);

  if (loading) return null; // show nothing while checking
  if (!isAuthenticated) return null; // block render if logged out

  return <>{children}</>;
}
