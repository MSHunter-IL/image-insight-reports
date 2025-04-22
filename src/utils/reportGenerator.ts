
import { ReportEntry, CompanyDetails } from '@/types/report';
import { useLogo } from '@/context/LogoContext';
import { generateReportHtml } from './report/html-template';

export const generateReportContent = (
  entries: ReportEntry[], 
  companyDetails: CompanyDetails, 
  includeSummary = false
) => {
  const { customLogo } = useLogo();
  return generateReportHtml(entries, companyDetails, includeSummary, customLogo);
};
