
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export default function PaymentSuccess() {
  const { t } = useLanguage();
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
            title: 'הצלחה!',
            description: 'המנוי שלך הופעל בהצלחה',
          });
        } else {
          toast({
            title: 'אימות בהמתנה',
            description: 'התשלום שלך מעובד. הגישה תינתן בקרוב.',
            variant: 'default',
          });
        }
      } catch (error) {
        console.error('שגיאה באימות המנוי:', error);
        toast({
          title: 'שגיאת אימות',
          description: 'אירעה שגיאה באימות המנוי שלך. אנא פנה לתמיכה.',
          variant: 'destructive',
        });
      }
    };
    
    verifySubscription();
  }, [sessionId, toast]);

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
            תודה על המנוי שלך! כעת יש לך גישה בלתי מוגבלת ליצירת דוחות.
          </p>
          <Button onClick={() => navigate('/')}>
            חזרה ללוח המחוונים
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
