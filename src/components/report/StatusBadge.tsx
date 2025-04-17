
import React from 'react';
import { StatusType } from '@/types/report';
import { Badge } from '@/components/ui/badge';
import { Clock, AlarmClock, CheckCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: StatusType;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusIcon = (status: StatusType) => {
    switch (status) {
      case 'טרם טופל':
        return <Clock className="h-4 w-4" />;
      case 'בטיפול':
        return <AlarmClock className="h-4 w-4" />;
      case 'טופל':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getStatusClass = (status: StatusType) => {
    switch (status) {
      case 'טרם טופל':
        return 'status-pending';
      case 'בטיפול':
        return 'status-in-progress';
      case 'טופל':
        return 'status-completed';
      default:
        return '';
    }
  };

  return (
    <Badge 
      variant="outline"
      className={getStatusClass(status)}
    >
      {getStatusIcon(status)}
      <span className="mr-1">{status}</span>
    </Badge>
  );
}
