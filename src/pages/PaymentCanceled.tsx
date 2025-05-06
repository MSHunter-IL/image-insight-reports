
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function PaymentCanceled() {
  const navigate = useNavigate();
  const { language } = useLanguage();

  const handleContinue = () => {
    navigate('/');
  };

  return (
    <div className="container flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto bg-red-100 rounded-full p-3 w-16 h-16 flex items-center justify-center mb-4">
            <XCircle className="h-10 w-10 text-red-600" />
          </div>
          <CardTitle className="text-2xl">
            {language === 'en' ? 'Payment Canceled' : 'התשלום בוטל'}
          </CardTitle>
          <CardDescription>
            {language === 'en'
              ? 'Your payment process was canceled'
              : 'תהליך התשלום בוטל'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-4 text-center">
              <p className="text-muted-foreground text-sm">
                {language === 'en' 
                  ? 'You can try again or continue using your remaining free reports'
                  : 'אתה יכול לנסות שוב או להמשיך להשתמש בדוחות החינמיים שנותרו לך'}
              </p>
            </div>
            <Button className="w-full" onClick={handleContinue}>
              {language === 'en' ? 'Return to Dashboard' : 'חזור למסך הבית'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
