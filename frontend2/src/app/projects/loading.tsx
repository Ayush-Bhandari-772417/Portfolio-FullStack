// frontend2\src\app\projects\loading.tsx
export default function ProjectsLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="h-12 bg-white/20 rounded-lg mb-6 w-3/4 mx-auto"></div>
            <div className="h-8 bg-white/20 rounded-lg w-1/2 mx-auto"></div>
          </div>
        </div>
      </div>
      
      <section className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="h-56 bg-slate-200 animate-pulse"></div>
              <div className="p-6 space-y-4">
                <div className="h-6 bg-slate-200 rounded animate-pulse"></div>
                <div className="h-4 bg-slate-200 rounded animate-pulse w-3/4"></div>
                <div className="flex gap-2">
                  <div className="h-6 w-16 bg-slate-200 rounded animate-pulse"></div>
                  <div className="h-6 w-16 bg-slate-200 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}