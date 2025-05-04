
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { ReportEntry } from '@/types/report';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface UrgencyCountsProps {
  companyEntries: ReportEntry[];
}

export function UrgencyCounts({ companyEntries }: UrgencyCountsProps) {
  const { t } = useLanguage();
  
  // Count by urgency
  const highUrgencyCount = companyEntries.filter(e => e.urgency === 'גבוהה').length;
  const mediumUrgencyCount = companyEntries.filter(e => e.urgency === 'בינונית').length;
  const lowUrgencyCount = companyEntries.filter(e => e.urgency === 'נמוכה').length;
  
  return (
    <>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">{t('high.urgency')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-red-600">{highUrgencyCount}</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">{t('medium.urgency')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-orange-500">{mediumUrgencyCount}</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">{t('low.urgency')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-green-600">{lowUrgencyCount}</p>
        </CardContent>
      </Card>
    </>
  );
}
