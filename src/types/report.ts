
export type UrgencyLevel = 'גבוהה' | 'בינונית' | 'נמוכה';
export type StatusType = 'טרם טופל' | 'בטיפול' | 'טופל';
export type ImageCategory = 'חוץ' | 'פנים' | 'מסמכים' | 'תשתיות' | 'אחר';

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
  companyId?: string; // הפניה לחברה
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
  surveyLocation?: string; // שדה חדש למיקום הסקר
}
