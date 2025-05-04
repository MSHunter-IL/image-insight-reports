
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { CompanyDetails, ReportEntry } from '@/types/report';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { StatusCounts } from './StatusCounts';
import { UrgencyCounts } from './UrgencyCounts';

interface CompanyInfoTabProps {
  selectedCompany: CompanyDetails;
  companyEntries: ReportEntry[];
}

export function CompanyInfoTab({ selectedCompany, companyEntries }: CompanyInfoTabProps) {
  const { t } = useLanguage();
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-lg font-medium mb-2">{t('company.details')}</h3>
          <div className="space-y-2">
            <p><strong>{t('company.name')}:</strong> {selectedCompany.name}</p>
            <p><strong>{t('site')}:</strong> {selectedCompany.surveyLocation || t('not.specified')}</p>
            <p><strong>{t('company.address')}:</strong> {selectedCompany.address || t('not.specified')}</p>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-2">{t('contact.details')}</h3>
          <div className="space-y-2">
            <p><strong>{t('contact.person')}:</strong> {selectedCompany.contactName || t('not.specified')}</p>
            <p><strong>{t('contact.phone')}:</strong> {selectedCompany.contactPhone || t('not.specified')}</p>
            <p><strong>{t('contact.email')}:</strong> {selectedCompany.contactEmail || t('not.specified')}</p>
          </div>
        </div>
      </div>
      
      <div className="mt-6">
        <h3 className="text-lg font-medium mb-4">{t('survey.summary')}</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">{t('total.findings')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{companyEntries.length}</p>
            </CardContent>
          </Card>
          
          <StatusCounts companyEntries={companyEntries} />
          <UrgencyCounts companyEntries={companyEntries} />
        </div>
      </div>
    </div>
  );
}
