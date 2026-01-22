// frontend2\src\app\loading.tsx
export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="text-center">
        <div className="spinner mb-4 mx-auto"></div>
        <p className="text-xl text-slate-600 font-semibold">Loading...</p>
      </div>
    </div>
  );
}