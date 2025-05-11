
import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { Link } from 'react-router-dom';
import { useLanguage } from "@/context/LanguageContext";
import { useToast } from "@/components/ui/use-toast";

export default function PaymentSuccess() {
  const { t } = useLanguage();
  const { toast } = useToast();

  // הודעת הצלחה כאשר הדף נטען
  useEffect(() => {
    toast({
      title: t('payment.success'),
      description: "המנוי שלך הופעל בהצלחה. יש לך כעת גישה בלתי מוגבלת!",
      variant: "default",
    });
  }, [toast, t]);

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
