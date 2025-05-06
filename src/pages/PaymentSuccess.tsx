
import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/integrations/supabase/client';

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const [isVerifying, setIsVerifying] = React.useState(true);

  // Get the session ID from URL
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (sessionId) {
      const verifyPayment = async () => {
        setIsVerifying(true);
        
        try {
          // Call the verify-subscription function to update the user's subscription status
          const { data, error } = await supabase.functions.invoke('verify-subscription', {
            body: { session_id: sessionId }
          });
          
          if (error) throw error;
          
          if (data.active) {
            toast({
              title: t('payment.success'),
              description: language === 'en' 
                ? 'Your subscription has been activated successfully!'
                : 'המנוי שלך הופעל בהצלחה!'
            });
          }
        } catch (error) {
          console.error('Error verifying subscription:', error);
          toast({
            title: language === 'en' ? 'Verification Error' : 'שגיאת אימות',
            description: language === 'en'
              ? 'There was an error verifying your subscription. Please contact support.'
              : 'אירעה שגיאה באימות המנוי שלך. אנא צור קשר עם התמיכה.',
            variant: 'destructive'
          });
        } finally {
          setIsVerifying(false);
        }
      };
      
      verifyPayment();
    }
  }, [sessionId]);

  const handleContinue = () => {
    navigate('/');
  };

  return (
    <div className="container flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto bg-green-100 rounded-full p-3 w-16 h-16 flex items-center justify-center mb-4">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <CardTitle className="text-2xl">{t('payment.success')}</CardTitle>
          <CardDescription>
            {language === 'en'
              ? 'Your subscription has been successfully activated'
              : 'המנוי שלך הופעל בהצלחה'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-4 text-center">
              <p className="font-medium">{t('unlimited.reports')}</p>
              <p className="text-muted-foreground text-sm">
                {language === 'en' 
                  ? 'You now have access to unlimited report generation'
                  : 'כעת יש לך גישה ליצירת דוחות ללא הגבלה'}
              </p>
            </div>
            <Button className="w-full" onClick={handleContinue}>
              {language === 'en' ? 'Continue to Dashboard' : 'המשך למסך הבית'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
