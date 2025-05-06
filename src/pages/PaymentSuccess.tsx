
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export default function PaymentSuccess() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const verifySubscription = async () => {
      if (!sessionId) return;
      
      try {
        const { data, error } = await supabase.functions.invoke('verify-subscription', {
          body: { session_id: sessionId }
        });
        
        if (error) throw error;
        
        if (data?.active) {
          toast({
            title: language === 'en' ? 'Success!' : 'הצלחה!',
            description: language === 'en' 
              ? 'Your subscription was successfully activated' 
              : 'המנוי שלך הופעל בהצלחה',
          });
        } else {
          toast({
            title: language === 'en' ? 'Verification Pending' : 'אימות בהמתנה',
            description: language === 'en'
              ? 'Your payment is being processed. Access will be granted soon.'
              : 'התשלום שלך מעובד. הגישה תינתן בקרוב.',
            variant: 'default',
          });
        }
      } catch (error) {
        console.error('Error verifying subscription:', error);
        toast({
          title: language === 'en' ? 'Verification Error' : 'שגיאת אימות',
          description: language === 'en'
            ? 'There was an error verifying your subscription. Please contact support.'
            : 'אירעה שגיאה באימות המנוי שלך. אנא פנה לתמיכה.',
          variant: 'destructive',
        });
      }
    };
    
    verifySubscription();
  }, [sessionId, toast, language]);

  return (
    <div className="container flex items-center justify-center min-h-screen py-10">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-primary/10 p-4">
            <CheckCircle className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">
            {t('payment.success')}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <p>
            {language === 'en' 
              ? 'Thank you for your subscription! You now have unlimited access to create reports.'
              : 'תודה על המנוי שלך! כעת יש לך גישה בלתי מוגבלת ליצירת דוחות.'}
          </p>
          <Button onClick={() => navigate('/')}>
            {language === 'en' ? 'Return to Dashboard' : 'חזרה ללוח המחוונים'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
