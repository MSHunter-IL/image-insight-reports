import React from 'react';
import { Button } from '@/components/ui/button';
import { useReport } from '@/context/ReportContext';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { FileDown, FilePlus2, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from '@/components/ui/use-toast';

export function ReportExport() {
  const { entries, clearAllEntries } = useReport();
  const { toast } = useToast();

  const generateReport = () => {
    if (entries.length === 0) {
      toast({
        title: "אין נתונים",
        description: "אין פריטים בסקר להצגה",
        variant: "destructive"
      });
      return;
    }

    const reportWindow = window.open('', '_blank');
    if (!reportWindow) {
      toast({
        title: "חסימת חלונות קופצים",
        description: "אפשר חלונות קופצים בדפדפן כדי להציג את הסקר",
        variant: "destructive"
      });
      return;
    }

    // Create HTML content for the report
    let htmlContent = `
      <!DOCTYPE html>
      <html lang="he" dir="rtl">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>סקר בטיחות</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            direction: rtl;
          }
          h1 {
            text-align: center;
            margin-bottom: 20px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: right;
          }
          th {
            background-color: #f2f2f2;
            font-weight: bold;
          }
          tr:nth-child(even) {
            background-color: #f9f9f9;
          }
          img {
            max-width: 100px;
            max-height: 100px;
            object-fit: cover;
          }
          .urgency-high {
            background-color: #FFEBEE;
            color: #B71C1C;
            padding: 2px 8px;
            border-radius: 4px;
            display: inline-block;
          }
          .urgency-medium {
            background-color: #FFF8E1;
            color: #F57F17;
            padding: 2px 8px;
            border-radius: 4px;
            display: inline-block;
          }
          .urgency-low {
            background-color: #E8F5E9;
            color: #1B5E20;
            padding: 2px 8px;
            border-radius: 4px;
            display: inline-block;
          }
          .status-pending {
            background-color: #ECEFF1;
            color: #263238;
            padding: 2px 8px;
            border-radius: 4px;
            display: inline-block;
          }
          .status-in-progress {
            background-color: #E3F2FD;
            color: #0D47A1;
            padding: 2px 8px;
            border-radius: 4px;
            display: inline-block;
          }
          .status-completed {
            background-color: #E8F5E9;
            color: #1B5E20;
            padding: 2px 8px;
            border-radius: 4px;
            display: inline-block;
          }
          .print-button {
            display: block;
            margin: 20px auto;
            padding: 10px 20px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
          }
          @media print {
            .print-button {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <h1>סקר בטיחות</h1>
        <p>תאריך: ${new Date().toLocaleDateString('he-IL')}</p>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>תמונה</th>
              <th>נושא</th>
              <th>תיאור</th>
              <th>דחיפות</th>
              <th>סטטוס</th>
            </tr>
          </thead>
          <tbody>
    `;

    // Add entries to the table
    entries.forEach((entry, index) => {
      const urgencyClass = entry.urgency === 'גבוהה' 
        ? 'urgency-high' 
        : entry.urgency === 'בינונית' 
          ? 'urgency-medium' 
          : 'urgency-low';
      
      const statusClass = entry.status === 'טרם טופל'
        ? 'status-pending'
        : entry.status === 'בטיפול'
          ? 'status-in-progress'
          : 'status-completed';
      
      htmlContent += `
        <tr>
          <td>${index + 1}</td>
          <td><img src="${entry.imageUrl}" alt="${entry.topic}"></td>
          <td>${entry.topic}</td>
          <td>${entry.description}</td>
          <td><span class="${urgencyClass}">${entry.urgency}</span></td>
          <td><span class="${statusClass}">${entry.status}</span></td>
        </tr>
      `;
    });

    // Close the HTML structure
    htmlContent += `
          </tbody>
        </table>
        <button class="print-button" onclick="window.print()">הדפס סקר</button>
      </body>
      </html>
    `;

    // Write content to new window and focus
    reportWindow.document.write(htmlContent);
    reportWindow.document.close();
    reportWindow.focus();

    toast({
      title: "סקר הופק בהצלחה",
      description: "הסקר נפתח בחלון חדש",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>כלי סקר</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Button 
            onClick={generateReport} 
            className="w-full"
            disabled={entries.length === 0}
          >
            <FileDown className="ml-2 h-4 w-4" />
            הפק סקר
          </Button>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button 
              variant="outline" 
              className="w-full text-destructive hover:bg-destructive hover:text-destructive-foreground"
              disabled={entries.length === 0}
            >
              <Trash2 className="ml-2 h-4 w-4" />
              נקה הכל
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>האם אתה בטוח?</AlertDialogTitle>
              <AlertDialogDescription>
                פעולה זו תמחק את כל הפריטים בסקר באופן בלתי הפיך.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>ביטול</AlertDialogCancel>
              <AlertDialogAction onClick={clearAllEntries}>
                כן, נקה הכל
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}
