
import React from 'react';
import { ImageUploader } from './ImageUploader';
import { ReportList } from './ReportList';
import { ReportExport } from './ReportExport';
import { Card, CardContent } from '@/components/ui/card';
import { CompanyDetails } from '@/types/report';
import { CompanyForm } from './dashboard/CompanyForm';
import { LanguageSelector } from './common/LanguageSelector';
import { Footer } from './common/Footer';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from './ui/button';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export function Dashboard() {
  const { t } = useLanguage();
  const { signOut, user } = useAuth();
  const [companyName, setCompanyName] = React.useState('');
  const [address, setAddress] = React.useState('');
  const [contactName, setContactName] = React.useState('');
  const [contactPhone, setContactPhone] = React.useState('');
  const [contactEmail, setContactEmail] = React.useState('');
  const [surveyDate, setSurveyDate] = React.useState<Date | undefined>(new Date());
  const [surveyStatus, setSurveyStatus] = React.useState('פתוח');

  // Create a proper CompanyDetails object that includes the required id property
  const companyDetails: CompanyDetails = {
    id: 'local-form', // Adding a default id for the form data
    name: companyName,
    address,
    contactName,
    contactPhone,
    contactEmail,
    surveyDate,
    surveyStatus
  };

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-center flex-grow">{t('safety.survey')}</h1>
        <div className="flex items-center space-x-4">
          {user && (
            <Button variant="outline" size="sm" onClick={signOut}>
              <LogOut className="h-4 w-4 mr-2" />
              {t('auth.signout')}
            </Button>
          )}
          <div className="flex-shrink-0">
            <LanguageSelector />
          </div>
        </div>
      </div>
      
      <Card className="mb-6">
        <CardContent className="pt-6">
          <CompanyForm 
            companyName={companyName}
            setCompanyName={setCompanyName}
            address={address}
            setAddress={setAddress}
            contactName={contactName}
            setContactName={setContactName}
            contactPhone={contactPhone}
            setContactPhone={setContactPhone}
            contactEmail={contactEmail}
            setContactEmail={setContactEmail}
            surveyDate={surveyDate}
            setSurveyDate={setSurveyDate}
            surveyStatus={surveyStatus}
            setSurveyStatus={setSurveyStatus}
          />
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-4">
          <h2 className="text-xl font-semibold mb-4">{t('image.upload')}</h2>
          <ImageUploader />
          <div className="mt-6">
            <ReportExport companyDetails={companyDetails} />
          </div>
        </div>
        
        <div className="md:col-span-8">
          <h2 className="text-xl font-semibold mb-4">{t('report.items')}</h2>
          <ReportList />
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
