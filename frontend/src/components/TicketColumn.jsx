import React from 'react';
import TicketCard from './TicketCard';

const TicketColumn = ({ status, title, tickets = [], onMoveStatus, onDelete, loading }) => {
  // Dot styling based on column status
  const getHeaderStyle = () => {
    switch (status) {
      case 'open':
        return { dot: 'bg-blue-500', bg: 'bg-blue-50/50' };
      case 'in_progress':
        return { dot: 'bg-amber-500', bg: 'bg-amber-50/30' };
      case 'resolved':
        return { dot: 'bg-green-500', bg: 'bg-green-50/30' };
      case 'closed':
        return { dot: 'bg-gray-400', bg: 'bg-gray-50/50' };
      default:
        return { dot: 'bg-gray-300', bg: 'bg-gray-50' };
    }
  };

  const style = getHeaderStyle();

  return (
    <div className="flex flex-col flex-1 min-w-[280px] bg-gray-50/80 border border-gray-200/60 rounded-xl overflow-hidden shadow-sm h-full">
      {/* Column Header */}
      <div className="p-4 bg-white border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${style.dot}`}></span>
          <h3 className="font-bold text-gray-800 text-sm tracking-wide uppercase">
            {title}
          </h3>
        </div>
        <span className="bg-gray-100 text-gray-600 font-bold text-xs px-2.5 py-0.5 rounded-full border border-gray-200">
          {tickets.length}
        </span>
      </div>

      {/* Tickets List */}
      <div className={`p-3 flex-1 overflow-y-auto space-y-3 min-h-[500px] max-h-[800px] ${style.bg}`}>
        {tickets.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-gray-200 rounded-xl p-4 text-center">
            <p className="text-xs text-gray-400 font-medium">No tickets</p>
          </div>
        ) : (
          tickets.map((ticket) => (
            <TicketCard
              key={ticket._id}
              ticket={ticket}
              onMoveStatus={onMoveStatus}
              onDelete={onDelete}
              loading={loading}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default TicketColumn;
