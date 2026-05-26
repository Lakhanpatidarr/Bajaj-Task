import React from 'react';
import { BiFilterAlt, BiRefresh } from 'react-icons/bi';

const FilterBar = ({ filters = {}, onFilterChange, onRefresh }) => {
  const handlePriorityChange = (e) => {
    onFilterChange({ ...filters, priority: e.target.value });
  };

  const handleBreachedChange = (e) => {
    onFilterChange({ ...filters, breached: e.target.checked });
  };

  const handleClearFilters = () => {
    onFilterChange({ priority: '', breached: false });
  };

  return (
    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center text-gray-700 font-semibold text-sm">
          <BiFilterAlt className="mr-1 h-5 w-5 text-gray-400" />
          Filters
        </div>

        {/* Priority Dropdown */}
        <div className="flex items-center gap-2">
          <label htmlFor="priority-select" className="text-xs font-medium text-gray-500">
            Priority:
          </label>
          <select
            id="priority-select"
            value={filters.priority || ''}
            onChange={handlePriorityChange}
            className="text-sm bg-gray-50 border border-gray-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-gray-700 font-medium"
          >
            <option value="">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>

        {/* Breached Checkbox */}
        <div className="flex items-center">
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={filters.breached || false}
              onChange={handleBreachedChange}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:height-4 after:width-4 after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600 relative"></div>
            <span className="ml-2 text-sm font-medium text-gray-700">SLA Breached Only</span>
          </label>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Clear Filters Button */}
        {(filters.priority || filters.breached) && (
          <button
            onClick={handleClearFilters}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors duration-200 px-3 py-1.5 rounded-lg hover:bg-indigo-50 border border-transparent"
          >
            Clear Filters
          </button>
        )}

        {/* Refresh Button */}
        {onRefresh && (
          <button
            onClick={onRefresh}
            title="Refresh tickets"
            className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-lg px-3 py-1.5 transition-colors duration-200 border border-gray-200 shadow-sm"
          >
            <BiRefresh className="mr-1 h-5 w-5" />
            Refresh
          </button>
        )}
      </div>
    </div>
  );
};

export default FilterBar;
