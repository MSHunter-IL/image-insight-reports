
export type UrgencyLevel = 'גבוהה' | 'בינונית' | 'נמוכה';
export type StatusType = 'טרם טופל' | 'בטיפול' | 'טופל';

export interface ReportEntry {
  id: string;
  topic: string;
  description: string;
  urgency: UrgencyLevel;
  status: StatusType;
  imageUrl: string;
  imageFile?: File;
  timestamp: Date;
}
