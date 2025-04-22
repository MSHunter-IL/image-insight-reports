
import { CompanyDetails } from '@/types/report';

export interface SurveyTool {
  id: string;
  name: string;
  type: string;
  downloadCount: number;
  lastDownload?: Date;
}

export interface SurveyToolsProps {
  tools: SurveyTool[];
  onDownload: (toolId: string) => void;
  onAddTool: (name: string, type: string) => void;
}

export interface ReportActionsProps {
  onGenerateReport: (includeSummary?: boolean) => void;
  disabled: boolean;
}

export interface ReportExportProps {
  companyDetails: CompanyDetails;
}
