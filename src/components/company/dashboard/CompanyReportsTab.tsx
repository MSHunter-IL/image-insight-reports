
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { ReportEntry } from '@/types/report';
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

interface CompanyReportsTabProps {
  companyEntries: ReportEntry[];
}

export function CompanyReportsTab({ companyEntries }: CompanyReportsTabProps) {
  const { t } = useLanguage();
  
  return (
    <div>
      <h3 className="text-lg font-medium mb-4">{t('findings.list')}</h3>
      {companyEntries.length > 0 ? (
        <Table>
          <TableCaption>{t('findings.list')}</TableCaption>
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
  );
}
