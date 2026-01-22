// admin\src\components\contentpage\ExperiencesContent.tsx
"use client";

import { FiPlus, FiEdit2, FiTrash2, FiSearch } from "react-icons/fi";
import { useAdminList } from "@/hooks/useAdminList";
import Pagination from "@/components/Pagination";
import ExperienceForm from "@/components/forms/ExperienceForm";

export default function ExperiencesContent() {
  const {
    loading,
    error,
    showForm,
    currentItem,
    currentItems,
    searchQuery,
    currentPage,
    totalPages,
    handleAdd,
    handleEdit,
    handleDelete,
    handleFormSuccess,
    handleFormCancel,
    handleSearch,
    setCurrentPage,
  } = useAdminList<any>({
    endpoint: "/experiences/",
    searchFn: (e, query) =>
      e.title?.toLowerCase().includes(query) ||
      e.organization?.toLowerCase().includes(query),
  });
  
  if (showForm) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-6">
          {currentItem ? "Edit Experience" : "Add Experience"}
        </h2>
        <ExperienceForm
          experience={currentItem}
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
        />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between mb-6">
        <h2 className="text-xl font-bold">Experiences</h2>
        <button onClick={handleAdd} className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
          <FiPlus className="-ml-1 mr-2 h-5 w-5" />
          Add Experience
        </button>
      </div>

      {/* Search */}
      <div className="mb-4 relative">
        <input
          type="text"
          placeholder="Search experiences..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10 pr-4 py-2 border rounded w-full"
        />
        <FiSearch className="absolute left-3 top-2.5 text-gray-400" />
      </div>
  
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        currentItems.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {searchQuery ? 'No matching experiences found.' : 'No experiences yet. Add your first experience!'}
          </div>
        ) : (
          <>
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Organization</th>
                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">location</th>
                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Public</th>
                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentItems.map((e) => {
                    return (
                      <tr key={e.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{e.title}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{e.organization}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{e.location}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {new Date(e.start_date).toLocaleDateString()} —{' '}
                          {e.end_date ? new Date(e.end_date).toLocaleDateString() : 'Ongoing'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded text-xs ${e.is_public ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-700'}`}>
                            {e.is_public ? 'Yes' : 'No'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleEdit(e)}
                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                          >
                            <FiEdit2 className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(e.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <FiTrash2 className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </>
        )
      )}
    </div>
  );
}