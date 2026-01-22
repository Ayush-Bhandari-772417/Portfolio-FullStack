// frontend2\src\app\not-found.tsx
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="text-center p-8 bg-white rounded-2xl shadow-lg max-w-md">
        <h2 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
          404
        </h2>
        <h3 className="text-2xl font-bold text-slate-900 mb-4">Page Not Found</h3>
        <p className="text-slate-600 mb-6">
          The page you're looking for doesn't exist.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-full hover:shadow-lg transition-all"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}