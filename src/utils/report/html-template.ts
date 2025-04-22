
import { ReportEntry, CompanyDetails } from "@/types/report";
import { generateReportStyles } from "./styles";
import { generateReportSummary } from "./summary";

export const generateReportHtml = (
  entries: ReportEntry[], 
  companyDetails: CompanyDetails, 
  includeSummary = false,
  customLogo?: string
) => {
  return `
    <!DOCTYPE html>
    <html lang="he" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>סקר בטיחות</title>
      <style>
        ${generateReportStyles()}
      </style>
    </head>
    <body>
      <div class="header">
        <img src="${customLogo || '/lovable-uploads/26b58140-d09a-43b7-b02a-4365f061cc76.png'}" alt="לוגו" class="logo" />
        <h1>סקר בטיחות</h1>
      </div>

      <div class="company-details">
        <h2>פרטי החברה</h2>
        <div class="company-details-grid">
          <div>
            <strong>שם חברה:</strong> ${companyDetails.name || 'לא צוין'}
          </div>
          <div>
            <strong>כתובת:</strong> ${companyDetails.address || 'לא צוין'}
          </div>
          <div>
            <strong>איש קשר:</strong> ${companyDetails.contactName || 'לא צוין'}
          </div>
          <div>
            <strong>טלפון:</strong> ${companyDetails.contactPhone || 'לא צוין'}
          </div>
          ${companyDetails.contactEmail ? `<div><strong>אימייל:</strong> ${companyDetails.contactEmail}</div>` : ''}
          ${companyDetails.surveyLocation ? `<div><strong>אתר:</strong> ${companyDetails.surveyLocation}</div>` : ''}
        </div>
      </div>

      <div class="date-container">
        <strong>תאריך:</strong> ${companyDetails.surveyDate ? new Date(companyDetails.surveyDate).toLocaleDateString('he-IL') : new Date().toLocaleDateString('he-IL')}
      </div>

      ${includeSummary ? generateReportSummary(entries) : ''}

      <table>
        <thead>
          <tr>
            <th style="width: 5%;">#</th>
            <th style="width: 15%;">תמונה</th>
            <th style="width: 10%;">נושא</th>
            <th style="width: 40%;">תיאור</th>
            <th style="width: 15%;">דחיפות</th>
            <th style="width: 15%;">סטטוס</th>
          </tr>
        </thead>
        <tbody>
          ${entries.map((entry, index) => {
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
            
            return `
              <tr>
                <td style="text-align: center;">${index + 1}</td>
                <td style="text-align: center;"><img src="${entry.imageUrl}" alt="${entry.topic}"></td>
                <td>${entry.topic}</td>
                <td>${entry.description}</td>
                <td style="text-align: center;"><span class="${urgencyClass}">${entry.urgency}</span></td>
                <td style="text-align: center;"><span class="${statusClass}">${entry.status}</span></td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
      <div class="actions" style="display: flex; gap: 10px; justify-content: center; margin-top: 20px;">
        <button class="print-button" onclick="window.print()">הדפס סקר</button>
        <button class="print-button" onclick="window.downloadPDF()">הורד PDF</button>
        ${!includeSummary ? `<button class="print-button action-button" onclick="window.showSummary()">הצג ניתוח וסיכום</button>` : ''}
      </div>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
      <script>
        window.downloadPDF = function() {
          const element = document.body;
          const buttons = document.querySelectorAll('.actions');
          buttons.forEach(btn => btn.style.display = 'none');
          
          const opt = {
            margin: [0.5, 0.5, 0.5, 0.5],
            filename: 'safety-report.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { 
              unit: 'in', 
              format: 'a4', 
              orientation: 'portrait',
              compress: false,
              textRenderingMode: 'text'
            }
          };

          html2pdf().set(opt).from(element).save().then(() => {
            buttons.forEach(btn => btn.style.display = 'flex');
          });
        }
        
        window.showSummary = function() {
          // Use the current URL to reload but with summary
          const url = new URL(window.location.href);
          url.searchParams.set('summary', 'true');
          window.open(url.toString(), '_blank');
        }
        
        // Check if we need to show the summary immediately (based on URL parameter)
        document.addEventListener('DOMContentLoaded', function() {
          const urlParams = new URLSearchParams(window.location.search);
          if (urlParams.get('summary') === 'true' && !document.querySelector('.summary-container')) {
            window.location.reload();
          }
        });
      </script>
    </body>
    </html>
  `;
};
