"use client";

import { useEffect, useState } from 'react';
import { BellIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

interface Notification {
  id: string;
  message: string;
  link: string | null;
  read_status: boolean;
  created_at: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/notifications');
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id: string) => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        setNotifications(notifications.map(n => n.id === id ? { ...n, read_status: true } : n));
      } else {
        console.error('Failed to mark notification as read');
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'PUT',
      });

      if (response.ok) {
        setNotifications(notifications.map(n => ({ ...n, read_status: true })));
      } else {
        console.error('Failed to mark all notifications as read');
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Notifications</h1>
        <button 
          onClick={handleMarkAllAsRead}
          className="text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          Mark all as read
        </button>
      </div>

      {loading ? (
        <p>Loading notifications...</p>
      ) : notifications.length === 0 ? (
        <div className="text-center py-12">
          <BellIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h2 className="mt-2 text-lg font-medium text-gray-900">No notifications</h2>
          <p className="mt-1 text-sm text-gray-500">You&apos;re all caught up!</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {notifications.map((notification) => (
            <li 
              key={notification.id} 
              className={`p-4 rounded-lg flex items-start gap-4 ${notification.read_status ? 'bg-gray-100' : 'bg-white shadow'}`}
            >
              <div className="flex-shrink-0 h-6 w-6">
                {notification.read_status ? (
                  <CheckCircleIcon className="h-6 w-6 text-green-500" />
                ) : (
                  <BellIcon className="h-6 w-6 text-blue-500" />
                )}
              </div>
              <div className="flex-grow">
                <p className="text-sm text-gray-800">{notification.message}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(notification.created_at).toLocaleString()}
                </p>
                {notification.link && (
                  <a href={notification.link} className="text-sm font-bold text-blue-600 hover:underline mt-1 inline-block">
                    View Details
                  </a>
                )}
              </div>
              {!notification.read_status && (
                <button 
                  onClick={() => handleMarkAsRead(notification.id)}
                  className="text-sm font-medium text-blue-600 hover:text-blue-800 self-center"
                >
                  Mark as read
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
