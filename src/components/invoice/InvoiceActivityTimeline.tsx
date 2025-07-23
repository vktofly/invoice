
'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  DocumentPlusIcon,
  PaperAirplaneIcon,
  CheckCircleIcon,
  CreditCardIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

interface Activity {
  id: string;
  created_at: string;
  activity_type: 'invoice_created' | 'invoice_sent' | 'payment_recorded' | 'invoice_viewed' | 'reminder_sent';
  comments: string;
  user: {
    full_name: string;
  } | null;
}

interface InvoiceActivityTimelineProps {
  invoiceId: string;
}

const ActivityIcon = ({ type }: { type: Activity['activity_type'] }) => {
  const iconClass = "h-5 w-5 text-white";
  let bgClass = "";

  switch (type) {
    case 'invoice_created':
      bgClass = 'bg-gray-400';
      return <DocumentPlusIcon className={iconClass} />;
    case 'invoice_sent':
      bgClass = 'bg-blue-500';
      return <PaperAirplaneIcon className={iconClass} />;
    case 'payment_recorded':
      bgClass = 'bg-green-500';
      return <CheckCircleIcon className={iconClass} />;
    case 'invoice_viewed':
      bgClass = 'bg-purple-500';
      return <CreditCardIcon className={iconClass} />;
    default:
      bgClass = 'bg-yellow-500';
      return <ExclamationTriangleIcon className={iconClass} />;
  }
};

export default function InvoiceActivityTimeline({ invoiceId }: InvoiceActivityTimelineProps) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('invoice_activity')
        .select(`
          id,
          created_at,
          activity_type,
          comments,
          user:profiles ( full_name )
        `)
        .eq('invoice_id', invoiceId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching activities:', error);
      } else {
        setActivities(data as any);
      }
      setLoading(false);
    };

    fetchActivities();
  }, [invoiceId]);

  if (loading) {
    return <p>Loading activity...</p>;
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border">
      <h3 className="font-semibold text-lg mb-4">Activity</h3>
      <ul className="space-y-6">
        {activities.map((activity, index) => (
          <li key={activity.id} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className={`rounded-full p-1.5 bg-gray-200`}>
                 <ActivityIcon type={activity.activity_type} />
              </div>
              {index < activities.length - 1 && (
                <div className="w-px h-full bg-gray-200 my-1"></div>
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-800">
                <span className="font-medium">{activity.user?.full_name || 'System'}</span>
                <span className="text-gray-500"> {activity.comments}</span>
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                {new Date(activity.created_at).toLocaleString()}
              </p>
            </div>
          </li>
        ))}
        {activities.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-4">No activity yet.</p>
        )}
      </ul>
    </div>
  );
}
