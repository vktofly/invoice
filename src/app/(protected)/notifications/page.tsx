import React from 'react';

type Notification = {
  id: number;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
};

const notifications: Notification[] = [
  {
    id: 1,
    title: 'New Invoice Created',
    description: 'Invoice #INV-001 has been created for customer John Doe.',
    timestamp: '2025-07-13T10:00:00Z',
    read: false,
  },
  {
    id: 2,
    title: 'Payment Received',
    description: 'Payment of $500 has been received for Invoice #INV-002.',
    timestamp: '2025-07-12T15:30:00Z',
    read: true,
  },
  {
    id: 3,
    title: 'Invoice Overdue',
    description: 'Invoice #INV-003 is now overdue.',
    timestamp: '2025-07-11T09:00:00Z',
    read: false,
  },
    {
    id: 4,
    title: 'New Customer Registered',
    description: 'A new customer, Jane Smith, has registered.',
    timestamp: '2025-07-10T11:00:00Z',
    read: true,
  },
  {
    id: 5,
    title: 'Recurring Invoice Generated',
    description: 'Recurring invoice #RINV-001 has been generated for customer Acme Corp.',
    timestamp: '2025-07-10T08:00:00Z',
    read: false,
  },
];

const NotificationItem = ({ notification }: { notification: Notification }) => {
  return (
    <div className={`p-4 border-b ${notification.read ? 'bg-gray-50' : 'bg-white'}`}>
      <div className="flex justify-between">
        <h3 className="font-bold">{notification.title}</h3>
        <span className="text-sm text-gray-500">{new Date(notification.timestamp).toLocaleString()}</span>
      </div>
      <p className="text-gray-700">{notification.description}</p>
    </div>
  );
};

const NotificationsPage = () => {
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Notifications</h1>
        <button className="text-sm text-blue-500">Mark all as read</button>
      </div>
      <div className="border rounded-lg overflow-hidden">
        {notifications.map((notification) => (
          <NotificationItem key={notification.id} notification={notification} />
        ))}
      </div>
    </div>
  );
};

export default NotificationsPage;
