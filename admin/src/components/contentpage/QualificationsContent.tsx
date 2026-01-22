// admin\src\components\contentpage\QualificationsContent.tsx
"use client";

import { FiPlus, FiEdit2, FiTrash2, FiSearch } from "react-icons/fi";
import { useAdminList } from "@/hooks/useAdminList";
import Pagination from "@/components/Pagination";
import QualificationForm from "@/components/forms/QualificationForm";

export default function QualificationsContent() {
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
    endpoint: "/qualifications/",
    searchFn: (q, query) =>
      q.board_name?.toLowerCase().includes(query) ||
      q.school_name?.toLowerCase().includes(query),
  });

  if (showForm) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-6">
          {currentItem ? "Edit Qualification" : "Add Qualification"}
        </h2>
        <QualificationForm
          qualification={currentItem}
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
        />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between mb-6">
        <h2 className="text-xl font-bold">Qualifications</h2>
        <button onClick={handleAdd} className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
          <FiPlus className="-ml-1 mr-2 h-5 w-5" />
          Add Qualification
        </button>
      </div>

      {/* Search */}
      <div className="mb-4 relative">
        <input
          type="text"
          placeholder="Search qualifications..."
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
            {searchQuery ? 'No matching qualifications found.' : 'No qualifications yet. Add your first qualification!'}
          </div>
        ) : (
          <>
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Board</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">School</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Public</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentItems.map((q) => {
                    const startYear = q.enrolled_year;
                    const endYear = q.passed_year ? q.passed_year : 'Present';
                    return (
                      <tr key={q.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{q.board_name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {q.school_name}
                          {q.school_url && (
                            <div className="text-xs text-indigo-600">
                              <a href={q.school_url} target="_blank" rel="noreferrer">{q.school_url}</a>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{startYear} - {endYear}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{q.location || '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded text-xs ${q.is_public ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-700'}`}>
                            {q.is_public ? 'Yes' : 'No'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleEdit(q)}
                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                           >
                            <FiEdit2 className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(q.id)}
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
