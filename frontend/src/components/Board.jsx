import React from 'react';
import TicketColumn from './TicketColumn';

const COLUMNS = [
  { status: 'open', title: 'Open' },
  { status: 'in_progress', title: 'In Progress' },
  { status: 'resolved', title: 'Resolved' },
  { status: 'closed', title: 'Closed' },
];

const Board = ({ tickets = [], onMoveStatus, onDelete, loading }) => {
  // Group tickets by status
  const groupedTickets = COLUMNS.reduce((acc, col) => {
    acc[col.status] = tickets.filter(
      (ticket) => ticket.status?.toLowerCase() === col.status
    );
    return acc;
  }, {});

  return (
    <div className="w-full overflow-x-auto pb-4">
      <div className="flex gap-4 min-w-[1100px] h-full items-start">
        {COLUMNS.map((col) => (
          <TicketColumn
            key={col.status}
            status={col.status}
            title={col.title}
            tickets={groupedTickets[col.status] || []}
            onMoveStatus={onMoveStatus}
            onDelete={onDelete}
            loading={loading}
          />
        ))}
      </div>
    </div>
  );
};

export default Board;
