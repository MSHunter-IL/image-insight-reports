import React, { createContext, useContext, useState, ReactNode } from 'react';

export type LanguageType = 'he';

// מילון תרגומים לעברית
const translations: Record<string, string> = {
  'company.name': 'שם החברה',
  'company.address': 'כתובת',
  'company.contact.name': 'איש קשר',
  'company.contact.phone': 'טלפון',
  'company.contact.email': 'אימייל',
  'company.survey.location': 'מיקום הסקר',
  'company.survey.status': 'סטטוס הסקר',
  'company.added': 'החברה נוספה בהצלחה',
  'company.updated': 'החברה עודכנה בהצלחה', 
  'company.deleted': 'החברה נמחקה בהצלחה',
  'add.company': 'הוסף חברה חדשה',
  'edit.company': 'ערוך חברה',
  'delete.company': 'מחק חברה',
  'add.company.details': 'הכנס את פרטי החברה החדשה',
  'edit.company.details': 'ערוך את פרטי החברה',
  'cancel': 'ביטול',
  'save': 'שמור',
  'delete': 'מחק',
  'edit': 'ערוך',
  'confirm.delete': 'אישור מחיקה',
  'confirm.delete.company': 'האם אתה בטוח שברצונך למחוק את החברה? פעולה זו אינה ניתנת לביטול.',
  'topic': 'נושא',
  'description': 'תיאור',
  'urgency': 'דחיפות',
  'category': 'קטגוריה',
  'status': 'סטטוס',
  'analyzing': 'מנתח תמונה...',
  'analysis.complete': 'ניתוח הושלם',
  'analysis.failed': 'ניתוח נכשל',
  'try.again': 'נסה שוב',
  'low': 'נמוכה',
  'medium': 'בינונית', 
  'high': 'גבוהה',
  'critical': 'קריטית',
  'open': 'פתוח',
  'in.progress': 'בטיפול',
  'closed': 'סגור',
  'workplace.safety': 'בטיחות במקום העבודה',
  'safety.hazard': 'סכנת בטיחות',
  'electrical.hazard': 'סכנה חשמלית',
  'fall.hazard': 'סכנת נפילה',
  'fire.hazard': 'סכנת שריפה',
  'general.safety': 'בטיחות כללית',
  'select.company': 'בחר חברה',
  'company.dashboard': 'לוח מחוונים של החברה',
  'company.details': 'פרטי חברה',
  'company.management': 'ניהול חברות',
  'companies.list': 'רשימת חברות',
  'no.companies': 'אין חברות במערכת',
  'recent.activities': 'פעילות אחרונה',
  'total.companies': 'סה"כ חברות',
  'active.surveys': 'סקרים פעילים',
  'reports.generated': 'דוחות שנוצרו',
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
  'error': 'שגיאה',
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
  'analyze.image': 'נתח תמונה',
  'upload.image': 'העלה תמונה',
  'drag.drop.images': 'גרור ושחרר תמונות כאן או לחץ לבחירה',
  'supported.formats': 'תמונות בפורמט JPG, PNG, GIF עד 10MB',
  'subscription.required': 'נדרש מנוי',
  'free.reports.used': 'השתמשת בכל הדוחות החינמיים שלך',
  'upgrade.to.continue': 'שדרג לתוכנית פרמיום כדי להמשיך',
  'upgrade.now': 'שדרג עכשיו',
  'free.reports.remaining': 'דוחות חינמיים נותרו',
  'unlimited.reports': 'דוחות בלתי מוגבלים',
  'subscription.plans': 'תוכניות מנוי',
  'compare.plans': 'השוואת תוכניות',
  'current.plan': 'התוכנית הנוכחית',
  'premium.plan': 'מקצועי',
  'proceed.to.payment': 'המשך לתשלום',
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
  'subscribe': 'מנוי',
  'subscribe.description': 'שדרג לתוכנית פרמיום עבור דוחות בלתי מוגבלים',
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