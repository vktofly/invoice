
import React from 'react';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * A reusable component for displaying empty states in a visually appealing way.
 */
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const EmptyState = ({ icon, title, description, action }: EmptyStateProps) => {
  return (
    <Card className="flex flex-col items-center justify-center p-10 text-center border-2 border-dashed bg-transparent shadow-none">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
        {icon}
      </div>
      <h3 className="mt-4 text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      {action && (
        <div className="mt-6">
          <Button onClick={action.onClick}>
            {action.label}
          </Button>
        </div>
      )}
    </Card>
  );
};

export default EmptyState;
