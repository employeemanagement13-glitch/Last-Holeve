// app/unauthorized/page.tsx
import { SignIn, SignUp, UserButton } from '@clerk/nextjs';
import Link from 'next/link';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <div className="text-6xl mb-4">🚫</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Access Denied
        </h1>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          You don't have permission to access the admin area. 
          Please contact the administrator if you believe this is an error.
        </p>
        <div className="space-x-4">
          <Link 
            href="/"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}