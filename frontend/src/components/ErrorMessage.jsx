import React from 'react';
import { BiErrorCircle } from 'react-icons/bi';

const ErrorMessage = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md shadow-sm my-4 flex items-start justify-between">
      <div className="flex">
        <div className="flex-shrink-0">
          <BiErrorCircle className="h-5 w-5 text-red-500" />
        </div>
        <div className="ml-3">
          <p className="text-sm text-red-700 font-medium">{message}</p>
        </div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-auto pl-3 text-red-500 hover:text-red-800 focus:outline-none text-xs font-semibold uppercase tracking-wider"
        >
          Dismiss
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
