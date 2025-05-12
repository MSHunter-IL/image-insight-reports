
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";
import { Link } from 'react-router-dom';

export default function PaymentCanceled() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-[350px] text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-red-100 p-3">
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </div>
          <CardTitle className="text-2xl">התשלום בוטל</CardTitle>
          <CardDescription>לא בוצע חיוב</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>התשלום בוטל ולא בוצע חיוב בכרטיס האשראי שלך.</p>
          <div className="flex gap-2 pt-4">
            <Link to="/subscription" className="flex-1">
              <Button variant="outline" className="w-full">נסה שוב</Button>
            </Link>
            <Link to="/" className="flex-1">
              <Button className="w-full">חזרה לדף הבית</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
