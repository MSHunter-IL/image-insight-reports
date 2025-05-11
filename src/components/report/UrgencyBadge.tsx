
import React from 'react';
import { UrgencyLevel } from '@/types/report';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, AlarmClock, CheckCircle } from 'lucide-react';

interface UrgencyBadgeProps {
  urgency: UrgencyLevel;
}

export function UrgencyBadge({ urgency }: UrgencyBadgeProps) {
  const getUrgencyIcon = (urgency: UrgencyLevel) => {
    switch (urgency) {
      case 'גבוהה':
        return <AlertCircle className="h-4 w-4" />;
      case 'בינונית':
        return <AlarmClock className="h-4 w-4" />;
      case 'נמוכה':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getUrgencyClass = (urgency: UrgencyLevel) => {
    switch (urgency) {
      case 'גבוהה':
        return 'urgency-high';
      case 'בינונית':
        return 'urgency-medium';
      case 'נמוכה':
        return 'urgency-low';
      default:
        return '';
    }
  };

  return (
    <Badge 
      variant="outline" 
      className={getUrgencyClass(urgency)}
    >
      {getUrgencyIcon(urgency)}
      <span className="mr-1">{urgency}</span>
    </Badge>
  );
}
