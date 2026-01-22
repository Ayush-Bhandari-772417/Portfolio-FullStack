// admin\src\app\admin\layout.tsx
'use client';

import RequireAuth from '@/components/RequireAuth';
import MainLayout from '@/components/AdminMainLayout';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth>
      <MainLayout>
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
          <div className="flex-1 overflow-y-auto p-6">
            {children}
          </div>
        </div>
      </MainLayout>
    </RequireAuth>
  );
}
