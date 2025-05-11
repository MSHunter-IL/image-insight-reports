
import React, { createContext, useContext, useState, ReactNode } from 'react';

// הגדרת סוג שפה - רק עברית
export type LanguageType = 'he';

// מילון תרגומים - עברית בלבד
const translations: Record<string, string> = {
  'safety.survey': 'סקר בטיחות',
  'company.info': 'פרטי חברה',
  'company.name': 'שם חברה',
  'address': 'כתובת',
  'contact.name': 'איש קשר',
  'contact.phone': 'טלפון',
  'contact.email': 'אימייל',
  'survey.date': 'תאריך סקר',
  'survey.status': 'סטטוס סקר',
  'image.upload': 'העלאת תמונות',
  'analyze.image': 'נתח תמונה',
  'analyzing': 'מנתח...',
  'enter.description': 'הזן תיאור של הממצא',
  'description': 'תיאור',
  'topic': 'נושא',
  'urgency': 'דחיפות',
  'high.urgency': 'דחיפות גבוהה',
  'medium.urgency': 'דחיפות בינונית',
  'low.urgency': 'דחיפות נמוכה',
  'status': 'סטטוס',
  'category': 'קטגוריה',
  'select.urgency': 'בחר דחיפות',
  'select.category': 'בחר קטגוריה',
  'report.items': 'פריטי דוח',
  'report.generate': 'הפק דוח',
  'report.summary': 'כולל סיכום',
  'report.clear': 'נקה הכל',
  'drop.images': 'גרור תמונות לכאן או לחץ לבחירת קבצים',
  'drop.images.here': 'שחרר קבצים כאן...',
  'browse.files': 'עיון בקבצים',
  'accepted.formats': 'פורמטים מקובלים: JPG, PNG, GIF עד 10MB',
  'free.reports.remaining': 'דוחות חינם שנותרו:',
  'auth.signout': 'התנתק',
  'auth.signin': 'התחבר',
  'auth.signup': 'הירשם',
  'auth.email': 'אימייל',
  'auth.password': 'סיסמה',
  'auth.forgot': 'שכחתי סיסמה',
  'auth.google': 'התחבר עם Google',
  'subscription.required': 'נדרש מנוי',
  'subscription.description': 'הגעת למגבלת הדוחות החינמיים שלך. שדרג למנוי כדי ליצור דוחות נוספים.',
  'proceed.to.payment': 'המשך לתשלום',
  'unlimited.reports': 'דוחות בלתי מוגבלים',
  'subscription.plans': 'תוכניות מנוי',
  'compare.plans': 'השוואת תוכניות',
  'current.plan': 'התוכנית הנוכחית',
  'premium.plan': 'מקצועי',
  'payment.success': 'התשלום הצליח!',
};

// ממשק של הקשר השפה
interface LanguageContextType {
  language: LanguageType;
  setLanguage: (lang: LanguageType) => void;
  t: (key: string) => string;
}

// יצירת הקשר השפה
const LanguageContext = createContext<LanguageContextType>({
  language: 'he',
  setLanguage: () => {},
  t: (key) => key,
});

// ספק השפה
export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<LanguageType>('he');

  // פונקציית התרגום
  const t = (key: string): string => {
    // שימוש במילון עברית בלבד
    return translations[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// וו שימושי לגישה להקשר השפה
export const useLanguage = () => useContext(LanguageContext);
