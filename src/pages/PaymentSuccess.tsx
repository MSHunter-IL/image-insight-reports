
import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { Link } from 'react-router-dom';
import { useLanguage } from "@/context/LanguageContext";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { useLocation } from 'react-router-dom';

export default function PaymentSuccess() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const location = useLocation();

  useEffect(() => {
    // הוצאת מזהה הסשן מפרמטרי ה-URL
    const params = new URLSearchParams(location.search);
    const sessionId = params.get('session_id');

    // אימות התשלום מול Stripe
    const verifyPayment = async () => {
      if (sessionId) {
        try {
          console.log("מאמת תשלום עם session_id:", sessionId);
          const { data, error } = await supabase.functions.invoke('verify-subscription', {
            body: { session_id: sessionId }
          });

          if (error) {
            console.error('שגיאה באימות התשלום:', error);
          } else {
            console.log("תשלום אומת בהצלחה:", data);
          }
        } catch (error) {
          console.error('שגיאה באימות התשלום:', error);
        }
      }
    };

    // קריאה לאימות התשלום
    verifyPayment();

    // הודעת הצלחה כאשר הדף נטען
    toast({
      title: "התשלום הצליח!",
      description: "המנוי שלך הופעל בהצלחה. יש לך כעת גישה בלתי מוגבלת!",
      variant: "default",
    });
  }, [toast, location.search]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-[350px] text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-green-100 p-3">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-2xl">התשלום הצליח!</CardTitle>
          <CardDescription>המנוי שלך הופעל בהצלחה</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>יש לך כעת גישה בלתי מוגבלת ליצירת דוחות בטיחות!</p>
          <div className="pt-4">
            <Link to="/">
              <Button className="w-full">חזרה למסך הראשי</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
