
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function NoDashboardContent() {
  const { t } = useLanguage();
  
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>{t('company.dashboard')}</CardTitle>
        <CardDescription>{t('no.company.selected')}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{t('select.company.view')}</p>
      </CardContent>
    </Card>
  );
}
