"use client";
import React from 'react';
import {
    PlusCircleIcon,
    UserGroupIcon,
  } from '@heroicons/react/24/outline';

export const QuickActionsCard = () => (
    <div className="bg-white/40 backdrop-blur-lg rounded-xl border border-white/20 shadow-lg p-6 dark:bg-gray-800/40 dark:border-gray-700">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-4">
            <button className="btn-secondary bg-white/50 flex items-center justify-center p-4 dark:bg-gray-700/50 dark:text-gray-300 dark:hover:bg-gray-700">
                <PlusCircleIcon className="h-6 w-6 mr-2" />
                New Invoice
            </button>
            <button className="btn-secondary bg-white/50 flex items-center justify-center p-4 dark:bg-gray-700/50 dark:text-gray-300 dark:hover:bg-gray-700">
                <UserGroupIcon className="h-6 w-6 mr-2" />
                New Customer
            </button>
        </div>
    </div>
);