"use client";
import React from 'react';

export const StatCard = ({ title, value, icon: Icon }) => (
    <div className="bg-white/40 backdrop-blur-lg rounded-xl border border-white/20 shadow-lg p-6 flex items-center space-x-4 dark:bg-gray-800/40 dark:border-gray-700">
      <div className="bg-white/50 p-3 rounded-full dark:bg-gray-700/50">
        <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
      </div>
      <div>
        <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
        <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{value}</p>
      </div>
    </div>
  );
