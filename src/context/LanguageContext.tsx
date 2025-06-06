
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
  'auth.welcome': 'ברוכים הבאים',
  'auth.welcomeDescription': 'התחברו למערכת או הירשמו',
  'auth.error': 'שגיאת התחברות',
  'auth.checkEmail': 'בדוק את האימייל שלך',
  'auth.checkEmailDescription': 'נשלח אימייל אימות, אנא בדוק את תיבת הדואר שלך',
  'auth.or': 'או',
  'auth.googleAuth': 'המשך עם Google',
  'auth.signingIn': 'מתחבר...',
  'auth.signingUp': 'נרשם...',
  'hebrew': 'עברית',
  'language': 'שפה',
  'no.data': 'אין נתונים',
  'no.survey.items': 'אין פריטי סקר',
  'survey.generated': 'דוח נוצר',
  'survey.opened': 'דוח נפתח בחלון חדש',
  'company.dashboard': 'לוח מחוונים של החברה',
  'company.details': 'פרטי חברה',
  'export.for.company': 'ייצא עבור חברה',
  'item.added': 'פריט נוסף',
  'new.finding': 'ממצא חדש',
  'item.updated': 'פריט עודכן',
  'item.updated.msg': 'הפריט עודכן בהצלחה',
  'item.removed': 'פריט הוסר',
  'item.removed.msg': 'הפריט הוסר בהצלחה',
  'report.cleared': 'דוח נמחק',
  'all.items.removed': 'כל הפריטים הוסרו',
  'success': 'הצלחה',
  'all.items.marked': 'כל הפריטים סומנו כמטופלים',
  'all.items.marked.as.treated': 'כל הפריטים סומנו כמטופלים',
  'generate.report': 'הפק דוח',
  'generate.with.summary': 'הפק עם סיכום',
  'send.email': 'שלח במייל',
  'sending': 'שולח',
  'mark.all.as.treated': 'סמן הכל כמטופל',
  'total.findings': 'סה"כ ממצאים',
  'findings.list': 'רשימת ממצאים',
  'date': 'תאריך',
  'site': 'אתר',
  'contact.details': 'פרטי קשר',
  'contact.person': 'איש קשר',
  'not.specified': 'לא צוין',
  'survey.summary': 'סיכום הסקר',
  'no.items.company': 'אין פריטים לחברה זו',
  'reminder': 'תזכורת',
  'open.reports.msg': 'יש לך',
  'open.reports': 'דוחות פתוחים ישנים',
  'pending': 'ממתין',
  'resolved': 'טופל',
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
