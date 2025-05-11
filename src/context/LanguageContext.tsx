
import React, { createContext, useContext, useState } from 'react';

// הגדרת סוג שפה נתמכת - רק עברית
export type SupportedLanguage = 'he';

type LanguageContextType = {
  language: SupportedLanguage;
  setLanguage: (language: SupportedLanguage) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'he',
  setLanguage: () => {},
  t: (key: string) => key, // פונקציית תרגום ברירת מחדל (מחזירה את המפתח עצמו)
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<SupportedLanguage>('he');

  // הגדרת תרגומים רק בעברית
  const translations: Record<SupportedLanguage, Record<string, string>> = {
    he: {
      'safety.survey': 'סקר בטיחות',
      'image.upload': 'העלאת תמונה',
      'image.upload.drag': 'גרור תמונות לכאן או',
      'image.upload.select': 'בחר קבצים',
      'image.attached': 'תמונות נבחרות',
      'report.items': 'פריטי הדיווח',
      'company.name': 'שם חברה',
      'company.address': 'כתובת',
      'company.contactName': 'שם איש קשר',
      'company.contactPhone': 'טלפון איש קשר',
      'company.contactEmail': 'אימייל איש קשר',
      'company.surveyDate': 'תאריך הסקר',
      'company.surveyStatus': 'סטטוס הסקר',
      'company.open': 'פתוח',
      'company.closed': 'סגור',
      'export.report': 'ייצוא דו"ח',
      'select.language': 'בחר שפה',
      'auth.welcome': 'ברוכים הבאים',
      'auth.welcomeDescription': 'התחבר לחשבון שלך או צור חשבון חדש',
      'auth.signin': 'התחברות',
      'auth.signup': 'הרשמה',
      'auth.email': 'אימייל',
      'auth.password': 'סיסמה',
      'auth.signingIn': 'מתחבר...',
      'auth.signingUp': 'נרשם...',
      'auth.or': 'או',
      'auth.googleAuth': 'המשך עם גוגל',
      'auth.error': 'שגיאת אימות',
      'auth.checkEmail': 'בדוק את האימייל שלך',
      'auth.checkEmailDescription': 'שלחנו לך אימייל אישור. אנא בדוק את תיבת הדואר הנכנס שלך.',
      'auth.signout': 'התנתק',
      'copyright': 'כל הזכויות שמורות לדניאל אליהו בללי',
      'language': 'שפה',
      'hebrew': 'עברית',
      'analyze.image': 'נתח תמונה',
      'analyzing': 'מנתח...',
      'no.items': 'אין פריטים בדוח עדיין. העלה תמונה כדי להתחיל.',
      'company.details': 'פרטי החברה',
      'contact.details': 'פרטי איש קשר',
      'site': 'אתר',
      'contact.person': 'איש קשר',
      'contact.phone': 'טלפון',
      'contact.email': 'אימייל',
      'survey.summary': 'סיכום הסקר',
      'total.findings': 'סה"כ ממצאים',
      'not.specified': 'לא צוין',
      'findings.list': 'רשימת ממצאים',
      'topic': 'נושא',
      'date': 'תאריך',
      'urgency': 'דחיפות',
      'status': 'סטטוס',
      'no.items.company': 'אין ממצאים לחברה זו עדיין.',
      'add.to.report': 'הוסף לדוח',
      'reminder': 'תזכורת',
      'open.reports.msg': 'יש לך',
      'open.reports': 'דוחות פתוחים שלא טופלו למעלה מ-7 ימים',
      'item.added': 'פריט נוסף',
      'new.finding': 'ממצא חדש נוסף',
      'item.updated': 'פריט עודכן',
      'item.updated.msg': 'הפריט עודכן בהצלחה',
      'item.removed': 'פריט הוסר',
      'item.removed.msg': 'הפריט הוסר בהצלחה מהדוח',
      'report.cleared': 'הדוח נוקה',
      'all.items.removed': 'כל הפריטים הוסרו מהדוח',
      'success': 'הצלחה',
      'all.items.marked.as.treated': 'כל הפריטים סומנו כמטופלים',
      'select.company': 'בחר חברה',
      'add.new.company': 'הוסף חברה חדשה',
      'select.files': 'בחר קבצים',
      'free.reports.remaining': 'דוחות חינמיים שנותרו:',
      'upgrade.plan': 'שדרג תוכנית',
      'subscription.required': 'נדרש מנוי',
      'subscription.description': 'ניצלת את כל הדוחות החינמיים. אנא שדרג כדי להמשיך ליצור דוחות.',
      'proceed.to.payment': 'המשך לתשלום',
      'payment.success': 'התשלום הצליח',
      'payment.canceled': 'התשלום בוטל',
      'unlimited.reports': 'דוחות ללא הגבלה',
      'upload.description': 'גרור ושחרר קבצים כאן או לחץ לבחירת קבצים',
      'enter.description': 'הזן תיאור',
      'select.urgency': 'בחר דחיפות',
      'select.category': 'בחר קטגוריה',
      'generating.report': 'מייצר דוח',
      'report.generated': 'הדוח נוצר',
      'payment.plans': 'תוכניות תשלום',
      'monthly.plan': 'מנוי חודשי',
      'yearly.plan': 'מנוי שנתי',
      'subscription.page': 'דף מנויים',
      'subscription.plans': 'תוכניות מנוי',
      'basic.plan': 'תוכנית בסיסית',
      'premium.plan': 'תוכנית פרימיום',
      'enterprise.plan': 'תוכנית ארגונית',
      'current.plan': 'התוכנית הנוכחית שלך',
      'compare.plans': 'השווה תוכניות',
      'category': 'קטגוריה',
      'description': 'תיאור',
    },
  };

  // פונקציה להשגת התרגום עבור מפתח נתון
  const t = (key: string) => {
    return translations[language][key] || key;
  };

  const value: LanguageContextType = {
    language,
    setLanguage,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;
