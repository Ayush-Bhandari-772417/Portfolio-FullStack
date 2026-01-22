// admin\src\components\contentpage\SubSkillsContent.tsx
"use client";

import { FiPlus, FiEdit2, FiTrash2, FiSearch } from "react-icons/fi";
import { useAdminList } from "@/hooks/useAdminList";
import Pagination from "@/components/Pagination";
import SubSkillForm from "@/components/forms/SubSkillForm";

export default function SubSkillsContent() {
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
    endpoint: "/subskills/",
    searchFn: (ss, query) =>
      ss.name?.toLowerCase().includes(query) ||
      ss.icon?.toLowerCase().includes(query) ||
      ss.level?.toLowerCase().includes(query),
  });

  if (showForm) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-6">
          {currentItem ? "Edit Sub Skill" : "Add Sub Skill"}
        </h2>
        <SubSkillForm
          subskill={currentItem}
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
        />
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between mb-6">
        <h2 className="text-xl font-bold">Sub Skills</h2>
        <button onClick={handleAdd} className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
          <FiPlus className="-ml-1 mr-2 h-5 w-5" />
          Add Sub Skill
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
            {searchQuery ? 'No matching sub skills found.' : 'No sub skills yet. Add your first sub skill!'}
          </div>
        ) : (
          <>
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Skill</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Icon</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Public</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentItems.map((ss) => {
                    return (
                      <tr key={ss.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{ss.skill}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{ss.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{ss.icon}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{ss.level}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{ss.rating}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded text-xs ${ss.is_public ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-700'}`}>
                            {ss.is_public ? 'Yes' : 'No'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleEdit(ss)}
                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                          >
                            <FiEdit2 className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(ss.id)}
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