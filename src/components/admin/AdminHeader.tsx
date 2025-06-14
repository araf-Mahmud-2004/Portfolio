import React from 'react';
import { User } from '@supabase/supabase-js';

interface AdminHeaderProps {
  user: User | null;
  onSignOut: () => Promise<void>;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ user, onSignOut }) => {
  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <div className="flex items-center space-x-4">
          <span className="text-gray-700">{user?.email}</span>
          <button
            onClick={onSignOut}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
