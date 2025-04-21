
export interface Site {
  id: string;
  name: string;
  address: string;
  contactPerson?: string;
  phoneNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SiteReport {
  id: string;
  siteId: string;
  date: string;
  status: 'פתוח' | 'סגור';
  entryCount: number;
  completedCount: number;
}
