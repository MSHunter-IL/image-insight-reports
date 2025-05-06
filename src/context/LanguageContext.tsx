
import React, { createContext, useContext, useState } from 'react';

// Export the SupportedLanguage type - remove Spanish
export type SupportedLanguage = 'en' | 'he';

type LanguageContextType = {
  language: SupportedLanguage;
  setLanguage: (language: SupportedLanguage) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string) => key, // Default translation function (returns the key itself)
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<SupportedLanguage>('he');

  // Define translations for different languages - remove Spanish and improve English translations
  const translations: Record<SupportedLanguage, Record<string, string>> = {
    en: {
      'safety.survey': 'Safety Survey',
      'image.upload': 'Image Upload',
      'image.upload.drag': 'Drag images here or',
      'image.upload.select': 'select files',
      'image.attached': 'Selected Images',
      'report.items': 'Report Items',
      'company.name': 'Company Name',
      'company.address': 'Address',
      'company.contactName': 'Contact Name',
      'company.contactPhone': 'Contact Phone',
      'company.contactEmail': 'Contact Email',
      'company.surveyDate': 'Survey Date',
      'company.surveyStatus': 'Survey Status',
      'company.open': 'Open',
      'company.closed': 'Closed',
      'export.report': 'Export Report',
      'select.language': 'Select Language',
      'auth.welcome': 'Welcome',
      'auth.welcomeDescription': 'Sign in to your account or create a new one',
      'auth.signin': 'Sign In',
      'auth.signup': 'Sign Up',
      'auth.email': 'Email',
      'auth.password': 'Password',
      'auth.signingIn': 'Signing in...',
      'auth.signingUp': 'Signing up...',
      'auth.or': 'OR',
      'auth.googleAuth': 'Continue with Google',
      'auth.error': 'Authentication Error',
      'auth.checkEmail': 'Check your email',
      'auth.checkEmailDescription': 'We sent you a confirmation email. Please check your inbox.',
      'auth.signout': 'Sign Out',
      'copyright': 'All rights reserved to Daniel Eliyahu Bellelli',
      'language': 'Language',
      'english': 'English',
      'hebrew': 'Hebrew',
      'analyze.image': 'Analyze Image',
      'analyzing': 'Analyzing...',
      'no.items': 'No items in the survey yet. Upload an image to get started.',
      'company.details': 'Company Details',
      'contact.details': 'Contact Details',
      'site': 'Site',
      'contact.person': 'Contact Person',
      'contact.phone': 'Contact Phone',
      'contact.email': 'Contact Email',
      'survey.summary': 'Survey Summary',
      'total.findings': 'Total Findings',
      'not.specified': 'Not Specified',
      'findings.list': 'Findings List',
      'topic': 'Topic',
      'date': 'Date',
      'urgency': 'Urgency',
      'status': 'Status',
      'no.items.company': 'No findings for this company yet.',
      'add.to.report': 'Add to Report',
      'reminder': 'Reminder',
      'open.reports.msg': 'You have',
      'open.reports': 'open reports that have been untreated for over 7 days',
      'item.added': 'Item Added',
      'new.finding': 'New finding added',
      'item.updated': 'Item Updated',
      'item.updated.msg': 'The item was successfully updated',
      'item.removed': 'Item Removed',
      'item.removed.msg': 'The item was successfully removed from the report',
      'report.cleared': 'Report Cleared',
      'all.items.removed': 'All items have been removed from the report',
      'success': 'Success',
      'all.items.marked.as.treated': 'All items have been marked as treated',
      'select.company': 'Select Company',
      'add.new.company': 'Add New Company',
      'select.files': 'Select Files',
      'free.reports.remaining': 'Free Reports Remaining:',
      'upgrade.plan': 'Upgrade Plan',
      'subscription.required': 'Subscription Required',
      'subscription.description': 'You have used all your free reports. Please upgrade to continue creating reports.',
      'proceed.to.payment': 'Proceed to Payment',
      'payment.success': 'Payment Successful',
      'payment.canceled': 'Payment Canceled',
      'unlimited.reports': 'Unlimited Reports',
      'upload.description': 'Drag and drop files here or click to select files',
      'enter.description': 'Enter description',
      'select.urgency': 'Select urgency',
      'select.category': 'Select category',
      'generating.report': 'Generating Report',
      'report.generated': 'Report Generated',
    },
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
      'english': 'אנגלית',
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
    },
  };

  // Function to get the translation for a given key
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
