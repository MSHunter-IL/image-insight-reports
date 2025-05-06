
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';

export default function PaymentCanceled() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="container flex items-center justify-center min-h-screen py-10">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-destructive/10 p-4">
            <XCircle className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle className="text-2xl">
            {t('payment.canceled')}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <p>
            {language === 'en' 
              ? 'Your payment was canceled. You can still use your free reports or try again later.'
              : 'התשלום שלך בוטל. אתה עדיין יכול להשתמש בדוחות החינמיים שלך או לנסות שוב מאוחר יותר.'}
          </p>
          <Button onClick={() => navigate('/')}>
            {language === 'en' ? 'Return to Dashboard' : 'חזרה ללוח המחוונים'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
