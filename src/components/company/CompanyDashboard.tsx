
import React, { useState } from 'react';
import { useCompany } from '@/context/CompanyContext';
import { useReport } from '@/context/ReportContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Building, List } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { CompanyDetails } from '@/types/report';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from '@/components/report/StatusBadge';
import { UrgencyBadge } from '@/components/report/UrgencyBadge';
import { useLanguage } from '@/context/LanguageContext';
import { generateReportContent } from '@/utils/reportGenerator';
import { useLogo } from '@/context/LogoContext';

export function CompanyDashboard() {
  const { selectedCompany, companies } = useCompany();
  const { entries } = useReport();
  const { toast } = useToast();
  const { t } = useLanguage();
  const { customLogo } = useLogo();
  const [selectedTab, setSelectedTab] = useState<'info' | 'reports'>('info');

  if (!selectedCompany) {
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
  
  // Filter entries for this company
  const companyEntries = entries.filter(entry => 
    !entry.companyId || entry.companyId === selectedCompany.id
  );
  
  // Count status
  const pendingCount = companyEntries.filter(e => e.status === 'טרם טופל').length;
  const inProgressCount = companyEntries.filter(e => e.status === 'בטיפול').length;
  const completedCount = companyEntries.filter(e => e.status === 'טופל').length;
  
  // Count by urgency
  const highUrgencyCount = companyEntries.filter(e => e.urgency === 'גבוהה').length;
  const mediumUrgencyCount = companyEntries.filter(e => e.urgency === 'בינונית').length;
  const lowUrgencyCount = companyEntries.filter(e => e.urgency === 'נמוכה').length;

  const handleGenerateReport = () => {
    if (companyEntries.length === 0) {
      toast({
        title: t('no.data'),
        description: t('no.survey.items'),
        variant: "destructive"
      });
      return;
    }
    
    const htmlContent = generateReportContent(companyEntries, selectedCompany, true, customLogo);
    
    const reportWindow = window.open('', '_blank');
    if (reportWindow) {
      reportWindow.document.write(htmlContent);
      reportWindow.document.close();
      reportWindow.focus();

      toast({
        title: t('survey.generated'),
        description: t('survey.opened'),
      });
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center">
              <Building className="mr-2 h-5 w-5" />
              {selectedCompany.name}
              <Badge variant="outline" className="ml-2">
                {selectedCompany.surveyLocation || t('not.specified')}
              </Badge>
            </CardTitle>
            <CardDescription>
              {t('company.dashboard')}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button 
              variant={selectedTab === 'info' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setSelectedTab('info')}
            >
              <Building className="mr-1 h-4 w-4" />
              {t('company.details')}
            </Button>
            <Button 
              variant={selectedTab === 'reports' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setSelectedTab('reports')}
            >
              <List className="mr-1 h-4 w-4" />
              {t('report.items')}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {selectedTab === 'info' && (
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
              </div>
            </div>
          </div>
        )}
        
        {selectedTab === 'reports' && (
          <div>
            <h3 className="text-lg font-medium mb-4">{t('findings.list')}</h3>
            {companyEntries.length > 0 ? (
              <Table>
                <TableCaption>{t('findings.list')} {selectedCompany.name}</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">#</TableHead>
                    <TableHead>{t('topic')}</TableHead>
                    <TableHead>{t('date')}</TableHead>
                    <TableHead>{t('urgency')}</TableHead>
                    <TableHead>{t('status')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {companyEntries.map((entry, index) => (
                    <TableRow key={entry.id}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>{entry.topic}</TableCell>
                      <TableCell>{new Date(entry.timestamp).toLocaleDateString()}</TableCell>
                      <TableCell><UrgencyBadge urgency={entry.urgency} /></TableCell>
                      <TableCell><StatusBadge status={entry.status} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-muted-foreground text-center py-8">{t('no.items.company')}</p>
            )}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="justify-end">
        <Button 
          variant="outline" 
          className="ml-2"
          onClick={handleGenerateReport}
          disabled={companyEntries.length === 0}
        >
          <FileText className="mr-2 h-4 w-4" />
          {t('export.for.company')}
        </Button>
      </CardFooter>
    </Card>
  );
}
