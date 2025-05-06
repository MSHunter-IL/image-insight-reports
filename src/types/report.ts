
export type UrgencyLevel = 'גבוהה' | 'בינונית' | 'נמוכה' | 'High' | 'Medium' | 'Low';
export type StatusType = 'טרם טופל' | 'בטיפול' | 'טופל' | 'Untreated' | 'In Progress' | 'Treated';
export type ImageCategory = 'חוץ' | 'פנים' | 'מסמכים' | 'תשתיות' | 'אחר' | 'External' | 'Internal' | 'Documents' | 'Infrastructure' | 'Other';

export interface ReportEntry {
  id: string;
  topic: string;
  description: string;
  urgency: UrgencyLevel;
  status: StatusType;
  imageUrl: string;
  imageFile?: File;
  timestamp: Date;
  category?: ImageCategory;
  internalNotes?: string;
  version?: number;
  companyId?: string; // Reference to the company
}

export interface SurveyTool {
  id: string;
  name: string;
  type: string;
  downloadCount: number;
  lastDownload?: Date;
}

export interface CompanyDetails {
  id: string;
  name: string;
  address: string;
  contactName: string;
  contactPhone: string;
  contactEmail?: string;
  surveyDate?: Date;
  surveyStatus?: string;
  surveyLocation?: string; // New field for site location
}
