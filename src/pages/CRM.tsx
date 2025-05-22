
import React from 'react';
import CRMHeader from '@/components/crm/CRMHeader';
import StatCards from '@/components/crm/StatCards';

const CRM = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-indigo-950">
      {/* CRM Header */}
      <CRMHeader activePage="Dashboard" />
      
      <div className="container mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Customer Management</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">Manage your contacts and interactions</p>
        </div>
        
        {/* Stats Cards */}
        <StatCards />
      </div>
    </div>
  );
};

export default CRM;
