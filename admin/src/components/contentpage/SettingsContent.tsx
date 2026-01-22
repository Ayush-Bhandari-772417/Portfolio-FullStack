// admin\src\components\contentpage\SettingsContent.tsx
'use client';

import { FiPlus, FiEdit2, FiTrash2, FiSearch } from "react-icons/fi";
import { useAdminList } from "@/hooks/useAdminList";
import Pagination from "@/components/Pagination";
import SettingForm from "@/components/forms/SettingForm";
import SeoSettingForm from "@/components/forms/SeoSettingForm";
import SiteMapSettingForm from "@/components/forms/SiteMapSettingForm";
import DisplaySettingForm from "@/components/forms/DisplaySettingForm";

interface SettingsContentProps {
  type: 'settings' | 'seosettings' | 'sitemapsettings' | 'displaysettings';
}

export default function SettingsContent({ type }: SettingsContentProps) {
  const endpoints = {
    settings: '/settings/',
    seosettings: '/seosettings/',
    sitemapsettings: '/sitemapsettings/',
    displaysettings: '/displaysettings/'
  };

  const searchFnMap = {
    settings: (s, q) => s.key?.toLowerCase().includes(q),
    seosettings: (s, q) => s.page?.toLowerCase().includes(q),
    sitemapsettings: (s, q) => s.page?.toLowerCase().includes(q),
    displaysettings: (s, q) =>
      s.context?.toLowerCase().includes(q) ||
      s.item_type?.toLowerCase().includes(q),
  };

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
    endpoint: endpoints[type],
    searchFn: searchFnMap[type],
  });

  if (showForm) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-6">
          {currentItem ? "Edit Settings" : "Add Settings"}
        </h2>
        {type === 'settings' && (
          <SettingForm
            setting={currentItem}
            onSuccess={handleFormSuccess}
            onCancel={handleFormCancel}
          />
        )}
        {type === 'seosettings' && (
          <SeoSettingForm
            seosetting={currentItem}
            onSuccess={handleFormSuccess}
            onCancel={handleFormCancel}
          />
        )}
        {type === 'sitemapsettings' && (
          <SiteMapSettingForm
            siteMapSetting={currentItem}
            onSuccess={handleFormSuccess}
            onCancel={handleFormCancel}
          />
        )}
        {type === 'displaysettings' && (
          <DisplaySettingForm
            displaySetting={currentItem}
            onSuccess={handleFormSuccess}
            onCancel={handleFormCancel}
          />
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {/* Header */}
      <div className="flex justify-between mb-6">
        <h2 className="text-xl font-bold">
          {type.replace('settings', ' Settings')}
        </h2>
        <button onClick={handleAdd} className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
          <FiPlus className="-ml-1 mr-2 h-5 w-5" /> Add {type}
        </button>
      </div>

      {/* Search */}
      <div className="mb-4 relative">
        <input
          type="text"
          placeholder="Search ..."
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
            {searchQuery ? 'No matching settings found.' : 'No settings of this type yet. Add first setting under this type!'}
          </div>
        ) : (
          <>
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {type === 'settings' && (
                      <>
                        <th className="px-4 py-2 text-left">Key</th>
                        <th className="px-4 py-2 text-left">Value</th>
                        <th className="px-4 py-2 text-left">Type</th>
                      </>
                    )}
                    {type === 'seosettings' && (
                      <>
                        <th className="px-4 py-2 text-left">Page</th>
                        <th className="px-4 py-2">Index</th>
                        <th className="px-4 py-2">Follow</th>
                      </>
                    )}
                    {type === 'sitemapsettings' && (
                      <>
                        <th className="px-4 py-2 text-left">Page</th>
                        <th className="px-4 py-2">Include</th>
                        <th className="px-4 py-2">Priority</th>
                      </>
                    )}
                    {type === 'displaysettings' && (
                      <>
                        <th className="px-4 py-2 text-left">Context</th>
                        <th className="px-4 py-2 text-left">Item Type</th>
                        <th className="px-4 py-2">Limit</th>
                      </>
                    )}
                    <th className="px-4 py-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentItems.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-6 text-gray-500">
                        No records found
                      </td>
                    </tr>
                  ) : (
                    currentItems.map((item:any) => {
                      return (
                        <tr key={item.id}>
                          {type === 'settings' && (
                            <>
                              <td className="px-4 py-2">{item.key}</td>
                              <td className="px-4 py-2 truncate max-w-xs">{item.value}</td>
                              <td className="px-4 py-2">{item.type}</td>
                            </>
                          )}
                          {type === 'seosettings' && (
                            <>
                              <td className="px-4 py-2">{item.page}</td>
                              <td className="px-4 py-2 text-center">{item.index ? 'Yes' : 'No'}</td>
                              <td className="px-4 py-2 text-center">{item.follow ? 'Yes' : 'No'}</td>
                            </>
                          )}
                          {type === 'sitemapsettings' && (
                            <>
                              <td className="px-4 py-2">{item.page}</td>
                              <td className="px-4 py-2 text-center">{item.include ? 'Yes' : 'No'}</td>
                              <td className="px-4 py-2 text-center">{item.priority}</td>
                            </>
                          )}
                          {type === 'displaysettings' && (
                            <>
                              <td className="px-4 py-2">{item.context}</td>
                              <td className="px-4 py-2">{item.item_type}</td>
                              <td className="px-4 py-2 text-center">{item.limit}</td>
                            </>
                          )}
                          <td className="px-4 py-2 text-right">
                            <button
                              onClick={() => handleEdit(item)}
                              className="text-blue-600 mr-3"
                            >
                              <FiEdit2 />
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="text-red-600"
                            >
                              <FiTrash2 />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
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