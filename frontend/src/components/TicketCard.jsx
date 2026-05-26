import React from 'react';
import { BiTrash, BiChevronLeft, BiChevronRight, BiTimeFive, BiEnvelope, BiErrorCircle } from 'react-icons/bi';

export const formatAge = (createdAtString) => {
  if (!createdAtString) return '0m';
  const createdDate = new Date(createdAtString);
  const now = new Date();
  const diffMs = now - createdDate;
  
  if (diffMs < 0) return '0m';
  
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays >= 1) {
    const hoursPart = diffHours % 24;
    return hoursPart > 0 ? `${diffDays}d ${hoursPart}h` : `${diffDays}d`;
  }
  
  if (diffHours >= 1) {
    const minsPart = diffMins % 60;
    return minsPart > 0 ? `${diffHours}h ${minsPart}m` : `${diffHours}h`;
  }
  
  return `${Math.max(1, diffMins)}m`;
};

const TicketCard = ({ ticket, onMoveStatus, onDelete, loading }) => {
  const { _id, subject, description, customerEmail, priority, breached, status, createdAt } = ticket;

  // Determine priority color
  const getPriorityStyles = (p) => {
    switch (p?.toLowerCase()) {
      case 'low':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'medium':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'high':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'urgent':
        return 'bg-rose-50 text-rose-700 border-rose-200 font-semibold';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  // Status transitions config
  const renderTransitionButtons = () => {
    const btnClass = "flex items-center text-xs font-semibold px-2 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 text-gray-700";
    
    switch (status) {
      case 'open':
        return (
          <div className="flex justify-end w-full">
            <button
              onClick={() => onMoveStatus(_id, 'in_progress')}
              disabled={loading}
              className={`${btnClass} text-indigo-600 border-indigo-100 hover:bg-indigo-50`}
              title="Move to In Progress"
            >
              Start Progress <BiChevronRight className="ml-0.5 h-4 w-4" />
            </button>
          </div>
        );
      case 'in_progress':
        return (
          <div className="flex justify-between w-full gap-2">
            <button
              onClick={() => onMoveStatus(_id, 'open')}
              disabled={loading}
              className={btnClass}
              title="Move back to Open"
            >
              <BiChevronLeft className="mr-0.5 h-4 w-4" /> Open
            </button>
            <button
              onClick={() => onMoveStatus(_id, 'resolved')}
              disabled={loading}
              className={`${btnClass} text-emerald-600 border-emerald-100 hover:bg-emerald-50`}
              title="Move to Resolved"
            >
              Resolve <BiChevronRight className="ml-0.5 h-4 w-4" />
            </button>
          </div>
        );
      case 'resolved':
        return (
          <div className="flex justify-between w-full gap-2">
            <button
              onClick={() => onMoveStatus(_id, 'in_progress')}
              disabled={loading}
              className={btnClass}
              title="Move back to In Progress"
            >
              <BiChevronLeft className="mr-0.5 h-4 w-4" /> Progress
            </button>
            <button
              onClick={() => onMoveStatus(_id, 'closed')}
              disabled={loading}
              className={`${btnClass} text-gray-800 border-gray-300 hover:bg-gray-100`}
              title="Move to Closed"
            >
              Close <BiChevronRight className="ml-0.5 h-4 w-4" />
            </button>
          </div>
        );
      case 'closed':
        return (
          <div className="flex justify-start w-full">
            <button
              onClick={() => onMoveStatus(_id, 'resolved')}
              disabled={loading}
              className={btnClass}
              title="Move back to Resolved"
            >
              <BiChevronLeft className="mr-0.5 h-4 w-4" /> Reopen Resolved
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div 
      className={`bg-white rounded-xl border p-4 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-3 relative ${
        breached 
          ? 'border-red-200 bg-gradient-to-r from-red-50/20 to-white' 
          : 'border-gray-200'
      }`}
    >
      {/* SLA Breached Warning Bar */}
      {breached && (
        <div className="flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-50 border border-red-100 px-2 py-1 rounded-md self-start uppercase tracking-wider animate-pulse">
          <BiErrorCircle className="h-3.5 w-3.5" />
          SLA Breached
        </div>
      )}

      {/* Subject and Delete Button */}
      <div className="flex items-start justify-between gap-2">
        <h4 className="font-bold text-gray-800 text-sm leading-tight line-clamp-2">
          {subject}
        </h4>
        <button
          onClick={() => onDelete(_id)}
          disabled={loading}
          className="text-gray-400 hover:text-red-500 p-1 rounded-md hover:bg-gray-50 transition-colors duration-200 focus:outline-none"
          title="Delete ticket"
        >
          <BiTrash className="h-4 w-4" />
        </button>
      </div>

      {/* Description */}
      {description && (
        <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed whitespace-pre-wrap">
          {description}
        </p>
      )}

      {/* Email Info */}
      <div className="flex items-center text-gray-400 text-xs gap-1 border-t border-gray-50 pt-2">
        <BiEnvelope className="h-3.5 w-3.5 flex-shrink-0" />
        <span className="truncate" title={customerEmail}>{customerEmail}</span>
      </div>

      {/* Priority, Age, and Footer Details */}
      <div className="flex items-center justify-between text-xs pt-1">
        <span className={`px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider ${getPriorityStyles(priority)}`}>
          {priority}
        </span>
        
        <span className="flex items-center text-gray-400 gap-1 text-[11px]">
          <BiTimeFive className="h-3.5 w-3.5" />
          {formatAge(createdAt)}
        </span>
      </div>

      {/* Action Move Buttons */}
      <div className="mt-2 border-t border-gray-100 pt-3 flex items-center">
        {renderTransitionButtons()}
      </div>
    </div>
  );
};

export default TicketCard;
