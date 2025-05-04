
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { ReportEntry } from '@/types/report';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface StatusCountsProps {
  companyEntries: ReportEntry[];
}

export function StatusCounts({ companyEntries }: StatusCountsProps) {
  const { t } = useLanguage();
  
  // Count status
  const pendingCount = companyEntries.filter(e => e.status === 'טרם טופל').length;
  const inProgressCount = companyEntries.filter(e => e.status === 'בטיפול').length;
  const completedCount = companyEntries.filter(e => e.status === 'טופל').length;
  
  return (
    <>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">{t('pending')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{pendingCount}</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">{t('resolved')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{completedCount}</p>
        </CardContent>
      </Card>
    </>
  );
}
