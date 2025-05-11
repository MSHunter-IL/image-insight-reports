
// מזהה משימה
export interface TaskId {
  id: string;
}

// סוגי דחיפות
export type UrgencyLevel = 'גבוהה' | 'בינונית' | 'נמוכה';

// סוגי סטטוס
export type StatusType = 'טרם טופל' | 'בטיפול' | 'טופל';

// קטגוריות תמונה
export type ImageCategory = 'חוץ' | 'פנים' | 'מסמכים' | 'תשתיות' | 'אחר';

// נתוני דוח
export interface ReportEntry {
  id?: string;
  topic: string;
  description: string;
  urgency: UrgencyLevel;
  status: StatusType;
  imageUrl?: string;
  imageFile?: File;
  category: ImageCategory;
  internalNotes?: string;
  dateAdded?: Date;
  dateModified?: Date;
  companyId?: string;
  // Adding missing properties that are being used in the code
  timestamp?: Date;
  version?: number;
}

// מידע חברה
export interface CompanyDetails {
  id: string;
  name: string;
  address: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  surveyDate?: Date;
  surveyStatus: string;
  // Adding missing property that is being used in the code
  surveyLocation?: string;
}

// Interface for form data used when creating a company
export interface CompanyFormData {
  name: string;
  address: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  surveyDate?: Date;
  surveyStatus: string;
  surveyLocation?: string;
}

// חברות מועדפות
export interface CompanyFavorite {
  id: string;
  name: string;
}

// היסטוריית דוח
export interface ReportHistory {
  id: string;
  date: string;
  user: string;
  action: string;
  itemId?: string;
}

// פרטי סמל
export interface LogoDetails {
  imageData: string;
  name: string;
  position?: 'top' | 'bottom' | 'header';
}

// ייצור דוח אפשרויות
export interface ReportGenerateOptions {
  includeSummary: boolean;
  includeImages: boolean;
  includeNotes: boolean;
  includeSignature: boolean;
}
