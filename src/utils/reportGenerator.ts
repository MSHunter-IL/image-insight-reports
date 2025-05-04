
import { ReportEntry, CompanyDetails } from '@/types/report';
import { generateReportHtml } from './report/html-template';

// Separate the report generation logic from the UI component
export const generateReportContent = (
  entries: ReportEntry[], 
  companyDetails: CompanyDetails, 
  includeSummary = false,
  customLogo?: string | null
) => {
  return generateReportHtml(entries, companyDetails, includeSummary, customLogo);
};

// Function to generate and download PDF report
export const generatePdfReport = (
  entries: ReportEntry[],
  companyDetails: CompanyDetails,
  includeSummary = false,
  customLogo?: string | null
) => {
  const htmlContent = generateReportContent(entries, companyDetails, includeSummary, customLogo);
  
  const reportWindow = window.open('', '_blank');
  if (reportWindow) {
    reportWindow.document.write(htmlContent);
    reportWindow.document.close();
    
    // Use browser's print functionality to generate PDF
    reportWindow.addEventListener('load', () => {
      reportWindow.print();
    });
  }
  
  return reportWindow;
};

// Function to send report via email
export const emailReport = async (
  entries: ReportEntry[],
  companyDetails: CompanyDetails,
  includeSummary = false
) => {
  if (!companyDetails.contactEmail) {
    throw new Error('No email address provided');
  }
  
  // In a real implementation, this would send the email via a server API
  // Here we're just simulating the action
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    success: true,
    message: `הדוח נשלח בהצלחה אל ${companyDetails.contactEmail}`
  };
};
