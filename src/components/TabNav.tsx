"use client";
import React from "react";

interface Tab {
  label: string;
  value: string;
}

interface TabNavProps {
  tabs: Tab[];
  value: string;
  onChange: (value: string) => void;
}

export default function TabNav({ tabs, value, onChange }: TabNavProps) {
  return (
    <div role="tablist" className="flex gap-2 border-b bg-white px-8 pt-6">
      {tabs.map((t) => (
        <button
          key={t.value}
          role="tab"
          aria-selected={value === t.value}
          tabIndex={value === t.value ? 0 : -1}
          onClick={() => onChange(t.value)}
          className={`px-4 py-2 -mb-px border-b-2 font-medium transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${
            value === t.value
              ? "border-indigo-600 text-indigo-700 bg-indigo-50"
              : "border-transparent text-gray-500 hover:text-indigo-600"
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
} 