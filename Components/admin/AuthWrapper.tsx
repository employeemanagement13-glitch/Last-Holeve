// app/admin/AdminAuthWrapper.tsx
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface AdminAuthWrapperProps {
  children: React.ReactNode;
  isAuthorized: boolean;
}

export default function AdminAuthWrapper({ children, isAuthorized }: AdminAuthWrapperProps) {
  const router = useRouter();

  useEffect(() => {
    if (!isAuthorized) {
      router.push('/unauthorized');
    }
  }, [isAuthorized, router]);

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authorization...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}