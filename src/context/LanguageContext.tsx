
import React, { createContext, useContext, useState, useEffect } from 'react';

export type SupportedLanguage = 'en' | 'he' | 'es';

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (language: SupportedLanguage) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translations
const translations: Record<SupportedLanguage, Record<string, string>> = {
  en: {
    // Dashboard
    'safety.survey': 'Safety Survey',
    'company.name': 'Company Name',
    'company.address': 'Address',
    'contact.person': 'Contact Person',
    'contact.phone': 'Contact Phone',
    'contact.email': 'Contact Email',
    'survey.date': 'Survey Date',
    'survey.status': 'Survey Status',
    'select.date': 'Select Date',
    'status.open': 'Open',
    'status.in.progress': 'In Progress',
    'status.completed': 'Completed',
    'image.upload': 'Image Upload',
    'report.items': 'Report Items',
    'no.items.yet': 'No report items yet. Upload images to start.',
    
    // Company Selector
    'select.company': 'Select Company',
    'add.new.company': 'Add New Company',
    'add.company': 'Add Company',
    'add.company.details': 'Add new company details. Fields marked with (*) are required.',
    'site.location': 'Site Location',
    
    // Report Actions
    'generate.report': 'Generate Report',
    'generate.with.summary': 'Generate with Summary',
    'download.pdf': 'Download PDF',
    'send.email': 'Send Email',
    'mark.all.as.treated': 'Mark All as Treated',
    'export.for.company': 'Export Report for this Company',
    'view.previous.reports': 'View Previous Reports',
    'clear.all': 'Clear All',
    'history': 'History',
    'show.history': 'Show Version History',

    // Reports
    'filter.by.category': 'Filter by category',
    'all.categories': 'All categories',
    'search.items': 'Search items...',
    'total.findings': 'Total Findings',
    'pending': 'Pending',
    'resolved': 'Resolved',
    'high.urgency': 'High Urgency',
    'medium.urgency': 'Medium Urgency',
    'low.urgency': 'Low Urgency',
    'findings.list': 'Findings List',
    
    // Report statuses
    'status.pending': 'Pending',
    'status.in.treatment': 'In Treatment',
    'status.treated': 'Treated',
    
    // Copyright
    'copyright': 'All Rights Reserved to Daniel Eliyahu Bellelli',
    
    // Tooltips
    'company.name.tip': 'Enter the full company name',
    'company.address.tip': 'Enter the company\'s full address',
    'contact.person.tip': 'Enter the company\'s contact person name',
    'contact.phone.tip': 'Enter the contact phone number',
    'contact.email.tip': 'Enter the contact email address',
    'survey.date.tip': 'Select the survey opening date',
    'survey.status.tip': 'Select the survey status',

    // Messages
    'company.selected': 'Company selected successfully',
    'company.added': 'New company added successfully and selected',
    'error': 'Error',
    'company.name.required': 'Company name is required',
    'no.data': 'No Data',
    'no.survey.items': 'No items in the survey to display',
    'survey.generated': 'Survey generated successfully',
    'survey.opened': 'Survey opened in a new window',
    'report.cleared': 'Report cleared',
    'all.items.removed': 'All items have been removed from the report',
    'item.added': 'Added to report',
    'new.finding': 'New finding',
    'item.updated': 'Updated successfully',
    'item.updated.msg': 'The item has been updated in the report',
    'item.removed': 'Removed from report',
    'item.removed.msg': 'The item has been removed successfully',
    'no.company.selected': 'No company selected',
    'select.company.view': 'Please select a company from the list above to view its dashboard.',
    'company.dashboard': 'Company Dashboard',
    'company.details': 'Company Details',
    'contact.details': 'Contact Details',
    'survey.summary': 'Survey Summary',
    'site': 'Site',
    'not.specified': 'Not specified',
    'no.items.company': 'No findings for this company',

    // Language names
    'language': 'Language',
    'english': 'English',
    'hebrew': 'Hebrew',
    'spanish': 'Spanish'
  },
  he: {
    // Dashboard
    'safety.survey': 'סקר בטיחות',
    'company.name': 'שם חברה',
    'company.address': 'כתובת',
    'contact.person': 'איש קשר',
    'contact.phone': 'טלפון איש קשר',
    'contact.email': 'אימייל איש קשר',
    'survey.date': 'תאריך פתיחת הסקר',
    'survey.status': 'סטטוס טיפול',
    'select.date': 'בחר תאריך',
    'status.open': 'פתוח',
    'status.in.progress': 'בטיפול',
    'status.completed': 'הושלם',
    'image.upload': 'העלאת תמונה',
    'report.items': 'פריטי הדוח',
    'no.items.yet': 'אין פריטים בדוח עדיין. העלה תמונות כדי להתחיל.',
    
    // Company Selector
    'select.company': 'בחר חברה',
    'add.new.company': 'הוסף חברה חדשה',
    'add.company': 'הוסף חברה',
    'add.company.details': 'הוסף את פרטי החברה החדשה. שדות מסומנים בכוכבית (*) הם שדות חובה.',
    'site.location': 'אתר',
    
    // Report Actions
    'generate.report': 'הפק דוח',
    'generate.with.summary': 'הפק עם תקציר',
    'download.pdf': 'הורד PDF',
    'send.email': 'שלח באימייל',
    'mark.all.as.treated': 'סמן הכל כטופל',
    'export.for.company': 'הפק סקר לחברה זו',
    'view.previous.reports': 'הצג סקרים קודמים',
    'clear.all': 'נקה הכל',
    'history': 'היסטוריה',
    'show.history': 'הצג היסטוריית גרסאות',
    
    // Reports
    'filter.by.category': 'סנן לפי קטגוריה',
    'all.categories': 'כל הקטגוריות',
    'search.items': 'חפש פריטים...',
    'total.findings': 'סה"כ ממצאים',
    'pending': 'ממתינים לטיפול',
    'resolved': 'הושלמו',
    'high.urgency': 'דחיפות גבוהה',
    'medium.urgency': 'דחיפות בינונית',
    'low.urgency': 'דחיפות נמוכה',
    'findings.list': 'רשימת ממצאים',
    
    // Report statuses
    'status.pending': 'טרם טופל',
    'status.in.treatment': 'בטיפול',
    'status.treated': 'טופל',
    
    // Copyright
    'copyright': 'כל הזכויות שמורות לדניאל אליהו בללי',
    
    // Tooltips
    'company.name.tip': 'הזן את שם החברה המלא',
    'company.address.tip': 'הזן את כתובת החברה המלאה',
    'contact.person.tip': 'הזן את שם איש הקשר בחברה',
    'contact.phone.tip': 'הזן מספר טלפון ליצירת קשר',
    'contact.email.tip': 'הזן כתובת דוא"ל ליצירת קשר',
    'survey.date.tip': 'בחר את תאריך פתיחת הסקר',
    'survey.status.tip': 'בחר את סטטוס הטיפול בסקר',

    // Messages
    'company.selected': 'חברה נבחרה בהצלחה',
    'company.added': 'חברה חדשה נוספה בהצלחה ונבחרה',
    'error': 'שגיאה',
    'company.name.required': 'נא למלא לפחות את שם החברה',
    'no.data': 'אין נתונים',
    'no.survey.items': 'אין פריטים בסקר להצגה',
    'survey.generated': 'סקר הופק בהצלחה',
    'survey.opened': 'הסקר נפתח בחלון חדש',
    'report.cleared': 'הדוח נוקה',
    'all.items.removed': 'כל הפריטים הוסרו מהדוח',
    'item.added': 'נוסף לדוח',
    'new.finding': 'ממצא חדש',
    'item.updated': 'עודכן בהצלחה',
    'item.updated.msg': 'הפריט עודכן בדוח',
    'item.removed': 'הוסר מהדוח',
    'item.removed.msg': 'הפריט הוסר בהצלחה',
    'no.company.selected': 'לא נבחרה חברה',
    'select.company.view': 'אנא בחר חברה מהרשימה למעלה כדי לצפות בדשבורד שלה.',
    'company.dashboard': 'דשבורד חברה',
    'company.details': 'פרטי חברה',
    'contact.details': 'פרטי קשר',
    'survey.summary': 'סיכום סקרים',
    'site': 'אתר',
    'not.specified': 'לא צוין',
    'no.items.company': 'אין ממצאים לחברה זו',

    // Language names
    'language': 'שפה',
    'english': 'אנגלית',
    'hebrew': 'עברית',
    'spanish': 'ספרדית'
  },
  es: {
    // Dashboard
    'safety.survey': 'Encuesta de Seguridad',
    'company.name': 'Nombre de la Empresa',
    'company.address': 'Dirección',
    'contact.person': 'Persona de Contacto',
    'contact.phone': 'Teléfono de Contacto',
    'contact.email': 'Correo Electrónico',
    'survey.date': 'Fecha de la Encuesta',
    'survey.status': 'Estado del Tratamiento',
    'select.date': 'Seleccionar Fecha',
    'status.open': 'Abierto',
    'status.in.progress': 'En Progreso',
    'status.completed': 'Completado',
    'image.upload': 'Subir Imagen',
    'report.items': 'Elementos del Informe',
    'no.items.yet': 'No hay elementos en el informe todavía. Sube imágenes para empezar.',
    
    // Company Selector
    'select.company': 'Seleccionar Empresa',
    'add.new.company': 'Agregar Nueva Empresa',
    'add.company': 'Agregar Empresa',
    'add.company.details': 'Agrega los detalles de la nueva empresa. Los campos marcados con (*) son obligatorios.',
    'site.location': 'Ubicación del Sitio',
    
    // Report Actions
    'generate.report': 'Generar Informe',
    'generate.with.summary': 'Generar con Resumen',
    'download.pdf': 'Descargar PDF',
    'send.email': 'Enviar por Correo',
    'mark.all.as.treated': 'Marcar Todo como Tratado',
    'export.for.company': 'Exportar Informe para esta Empresa',
    'view.previous.reports': 'Ver Informes Anteriores',
    'clear.all': 'Borrar Todo',
    'history': 'Historial',
    'show.history': 'Mostrar Historial de Versiones',
    
    // Reports
    'filter.by.category': 'Filtrar por categoría',
    'all.categories': 'Todas las categorías',
    'search.items': 'Buscar elementos...',
    'total.findings': 'Total de Hallazgos',
    'pending': 'Pendientes',
    'resolved': 'Resueltos',
    'high.urgency': 'Alta Urgencia',
    'medium.urgency': 'Urgencia Media',
    'low.urgency': 'Baja Urgencia',
    'findings.list': 'Lista de Hallazgos',
    
    // Report statuses
    'status.pending': 'Pendiente',
    'status.in.treatment': 'En Tratamiento',
    'status.treated': 'Tratado',
    
    // Copyright
    'copyright': 'Todos los Derechos Reservados a Daniel Eliyahu Bellelli',
    
    // Tooltips
    'company.name.tip': 'Ingrese el nombre completo de la empresa',
    'company.address.tip': 'Ingrese la dirección completa de la empresa',
    'contact.person.tip': 'Ingrese el nombre de la persona de contacto',
    'contact.phone.tip': 'Ingrese el número de teléfono de contacto',
    'contact.email.tip': 'Ingrese la dirección de correo electrónico de contacto',
    'survey.date.tip': 'Seleccione la fecha de apertura de la encuesta',
    'survey.status.tip': 'Seleccione el estado del tratamiento de la encuesta',

    // Messages
    'company.selected': 'Empresa seleccionada con éxito',
    'company.added': 'Nueva empresa agregada con éxito y seleccionada',
    'error': 'Error',
    'company.name.required': 'El nombre de la empresa es obligatorio',
    'no.data': 'Sin Datos',
    'no.survey.items': 'No hay elementos en la encuesta para mostrar',
    'survey.generated': 'Encuesta generada con éxito',
    'survey.opened': 'La encuesta se abrió en una nueva ventana',
    'report.cleared': 'Informe borrado',
    'all.items.removed': 'Todos los elementos han sido eliminados del informe',
    'item.added': 'Agregado al informe',
    'new.finding': 'Nuevo hallazgo',
    'item.updated': 'Actualizado con éxito',
    'item.updated.msg': 'El elemento ha sido actualizado en el informe',
    'item.removed': 'Eliminado del informe',
    'item.removed.msg': 'El elemento ha sido eliminado con éxito',
    'no.company.selected': 'No se ha seleccionado ninguna empresa',
    'select.company.view': 'Seleccione una empresa de la lista anterior para ver su panel.',
    'company.dashboard': 'Panel de la Empresa',
    'company.details': 'Detalles de la Empresa',
    'contact.details': 'Detalles de Contacto',
    'survey.summary': 'Resumen de las Encuestas',
    'site': 'Sitio',
    'not.specified': 'No especificado',
    'no.items.company': 'No hay hallazgos para esta empresa',

    // Language names
    'language': 'Idioma',
    'english': 'Inglés',
    'hebrew': 'Hebreo',
    'spanish': 'Español'
  }
};

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  // Default to English, but check local storage
  const [language, setLanguage] = useState<SupportedLanguage>('en');

  // Load language preference from local storage on initial mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as SupportedLanguage | null;
    if (savedLanguage && ['en', 'he', 'es'].includes(savedLanguage)) {
      setLanguage(savedLanguage);
      // Set document direction based on language
      document.documentElement.dir = savedLanguage === 'he' ? 'rtl' : 'ltr';
    }
  }, []);

  const changeLanguage = (newLanguage: SupportedLanguage) => {
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
    // Set document direction based on language
    document.documentElement.dir = newLanguage === 'he' ? 'rtl' : 'ltr';
  };

  // Translation function
  const translate = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, t: translate }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
