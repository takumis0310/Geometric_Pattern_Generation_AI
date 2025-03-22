import React from 'react';

export function Sidebar({ children }) {
  return (
    <div className="w-64 bg-gray-800 text-white p-4">
      {children}
    </div>
  );
}