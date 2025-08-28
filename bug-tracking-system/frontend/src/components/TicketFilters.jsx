import React, { useState, useEffect } from 'react';
import { FiSearch, FiFilter, FiX } from 'react-icons/fi';

const TicketFilters = ({ onFiltersChange, users = [] }) => {
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    priority: 'all',
    assignedTo: 'all'
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    onFiltersChange(filters);
  }, [filters, onFiltersChange]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      status: 'all',
      priority: 'all',
      assignedTo: 'all'
    });
  };

  const hasActiveFilters = filters.search || filters.status !== 'all' || filters.priority !== 'all' || filters.assignedTo !== 'all';

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search tickets by title or description..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`inline-flex items-center px-4 py-2 border rounded-md text-sm font-medium transition-colors duration-200 ${
            showFilters || hasActiveFilters
              ? 'border-indigo-500 text-indigo-700 bg-indigo-50 hover:bg-indigo-100'
              : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
          }`}
        >
          <FiFilter className="w-4 h-4 mr-2" />
          Filters
          {hasActiveFilters && (
            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
              Active
            </span>
          )}
        </button>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
          >
            <FiX className="w-4 h-4 mr-1" />
            Clear
          </button>
        )}
      </div>

      {showFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">All Statuses</option>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Closed">Closed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                value={filters.priority}
                onChange={(e) => handleFilterChange('priority', e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">All Priorities</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assigned To
              </label>
              <select
                value={filters.assignedTo}
                onChange={(e) => handleFilterChange('assignedTo', e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">All Users</option>
                <option value="unassigned">Unassigned</option>
                {users.map(user => (
                  <option key={user._id} value={user._id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketFilters;
