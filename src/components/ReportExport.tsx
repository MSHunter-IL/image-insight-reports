
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useReport } from '@/context/ReportContext';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { FileDown } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { generateReportContent } from '@/utils/reportGenerator';
import { ClearAllConfirmation } from './report/ClearAllConfirmation';
import { useSites } from '@/context/SiteContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CompanyDetails {
  name: string;
  address: string;
  contactName: string;
  contactPhone: string;
}

interface ReportExportProps {
  companyDetails: CompanyDetails;
}

export function ReportExport({ companyDetails }: ReportExportProps) {
  const { entries, clearAllEntries } = useReport();
  const { sites } = useSites();
  const [selectedSiteId, setSelectedSiteId] = useState<string>("");
  const { toast } = useToast();

  const generateReport = () => {
    if (entries.length === 0) {
      toast({
        title: "אין נתונים",
        description: "אין פריטים בסקר להצגה",
        variant: "destructive"
      });
      return;
    }

    const selectedSite = selectedSiteId ? sites.find(site => site.id === selectedSiteId) : undefined;
    const siteDetails = selectedSite ? { id: selectedSite.id, name: selectedSite.name } : undefined;

    const htmlContent = generateReportContent(entries, companyDetails, siteDetails);
    
    const reportWindow = window.open('', '_blank');
    if (reportWindow) {
      reportWindow.document.write(htmlContent);
      reportWindow.document.close();
      reportWindow.focus();

      toast({
        title: "סקר הופק בהצלחה",
        description: "הסקר נפתח בחלון חדש",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>כלי סקר</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sites.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium">אתר</label>
              <Select
                value={selectedSiteId}
                onValueChange={setSelectedSiteId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="בחר אתר" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">ללא אתר</SelectItem>
                  {sites.map(site => (
                    <SelectItem key={site.id} value={site.id}>{site.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          <Button 
            onClick={generateReport} 
            className="w-full"
            disabled={entries.length === 0}
          >
            <FileDown className="ml-2 h-4 w-4" />
            הפק סקר
          </Button>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <ClearAllConfirmation 
          onClear={clearAllEntries}
          disabled={entries.length === 0}
        />
      </CardFooter>
    </Card>
  );
}
