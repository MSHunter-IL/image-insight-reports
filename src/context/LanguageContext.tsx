import React, { createContext, useContext, useState } from 'react';

type SupportedLanguage = 'en' | 'he' | 'es';

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
  const [language, setLanguage] = useState<SupportedLanguage>('en');

  // Define translations for different languages
  const translations: Record<SupportedLanguage, Record<string, string>> = {
    en: {
      'safety.survey': 'Safety Survey',
      'image.upload': 'Image Upload',
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
    },
    he: {
      'safety.survey': 'סקר בטיחות',
      'image.upload': 'העלאת תמונה',
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
    },
    es: {
      'safety.survey': 'Encuesta de Seguridad',
      'image.upload': 'Cargar Imagen',
      'report.items': 'Elementos del Reporte',
      'company.name': 'Nombre de la Empresa',
      'company.address': 'Dirección',
      'company.contactName': 'Nombre del Contacto',
      'company.contactPhone': 'Teléfono del Contacto',
      'company.contactEmail': 'Correo Electrónico del Contacto',
      'company.surveyDate': 'Fecha de la Encuesta',
      'company.surveyStatus': 'Estado de la Encuesta',
      'company.open': 'Abierto',
      'company.closed': 'Cerrado',
      'export.report': 'Exportar Reporte',
      'select.language': 'Seleccionar Idioma',
      'auth.welcome': 'Bienvenido',
      'auth.welcomeDescription': 'Inicia sesión en tu cuenta o crea una nueva',
      'auth.signin': 'Iniciar sesión',
      'auth.signup': 'Registrarse',
      'auth.email': 'Correo electrónico',
      'auth.password': 'Contraseña',
      'auth.signingIn': 'Iniciando sesión...',
      'auth.signingUp': 'Registrándose...',
      'auth.or': 'O',
      'auth.googleAuth': 'Continuar con Google',
      'auth.error': 'Error de autenticación',
      'auth.checkEmail': 'Revisa tu correo electrónico',
      'auth.checkEmailDescription': 'Te hemos enviado un correo de confirmación. Por favor revisa tu bandeja de entrada.',
      'auth.signout': 'Cerrar sesión',
      'copyright': 'Todos los derechos reservados a Daniel Eliyahu Bellelli',
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
