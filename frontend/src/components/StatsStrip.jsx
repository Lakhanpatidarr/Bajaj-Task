import React from 'react';
import { BiTask, BiLoaderCircle, BiCheckCircle, BiArchive, BiError } from 'react-icons/bi';

const StatsStrip = ({ stats = {}, loading = false }) => {
  const openCount = stats.open ?? 0;
  const inProgressCount = stats.inProgress ?? stats.in_progress ?? 0;
  const resolvedCount = stats.resolved ?? 0;
  const closedCount = stats.closed ?? 0;
  const breachedCount = stats.breached ?? 0;

  const statItems = [
    {
      label: 'Open',
      count: openCount,
      color: 'text-blue-600 bg-blue-50 border-blue-200',
      icon: <BiTask className="h-6 w-6 text-blue-500" />,
    },
    {
      label: 'In Progress',
      count: inProgressCount,
      color: 'text-amber-600 bg-amber-50 border-amber-200',
      icon: <BiLoaderCircle className="h-6 w-6 text-amber-500 animate-pulse" />,
    },
    {
      label: 'Resolved',
      count: resolvedCount,
      color: 'text-green-600 bg-green-50 border-green-200',
      icon: <BiCheckCircle className="h-6 w-6 text-green-500" />,
    },
    {
      label: 'Closed',
      count: closedCount,
      color: 'text-gray-600 bg-gray-50 border-gray-200',
      icon: <BiArchive className="h-6 w-6 text-gray-500" />,
    },
    {
      label: 'SLA Breached',
      count: breachedCount,
      color: 'text-red-600 bg-red-50 border-red-200 font-bold',
      icon: <BiError className="h-6 w-6 text-red-500" />,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
      {statItems.map((item, index) => (
        <div
          key={index}
          className={`flex items-center justify-between p-4 rounded-xl border shadow-sm ${item.color} transition-all duration-300 hover:shadow-md`}
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              {item.label}
            </p>
            {loading ? (
              <div className="h-7 w-12 bg-gray-200 animate-pulse rounded mt-1"></div>
            ) : (
              <h3 className="text-2xl font-bold mt-1 text-gray-800">{item.count}</h3>
            )}
          </div>
          <div className="p-2 bg-white rounded-lg shadow-sm border border-gray-100">
            {item.icon}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsStrip;
