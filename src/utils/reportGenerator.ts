interface CompanyDetails {
  name: string;
  address: string;
  contactName: string;
  contactPhone: string;
}

const generateReportStyles = () => `
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
    table-layout: fixed;
    direction: rtl;
  }
  th, td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: right;
    vertical-align: middle;
    word-wrap: break-word;
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
    display: block;
    margin: 0 auto;
  }
  .logo {
    display: block;
    margin: 0 auto 20px;
    width: 600px;
    height: auto;
    max-width: 90%;
  }
  .urgency-high {
    background-color: #FFEBEE;
    color: #B71C1C;
    padding: 2px 8px;
    border-radius: 4px;
    display: inline-block;
    font-weight: bold;
  }
  .urgency-medium {
    background-color: #FFF8E1;
    color: #F57F17;
    padding: 2px 8px;
    border-radius: 4px;
    display: inline-block;
    font-weight: bold;
  }
  .urgency-low {
    background-color: #E8F5E9;
    color: #1B5E20;
    padding: 2px 8px;
    border-radius: 4px;
    display: inline-block;
    font-weight: bold;
  }
  .status-pending {
    background-color: #ECEFF1;
    color: #263238;
    padding: 2px 8px;
    border-radius: 4px;
    display: inline-block;
    font-weight: bold;
  }
  .status-in-progress {
    background-color: #E3F2FD;
    color: #0D47A1;
    padding: 2px 8px;
    border-radius: 4px;
    display: inline-block;
    font-weight: bold;
  }
  .status-completed {
    background-color: #E8F5E9;
    color: #1B5E20;
    padding: 2px 8px;
    border-radius: 4px;
    display: inline-block;
    font-weight: bold;
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
  .header {
    text-align: center;
    margin-bottom: 30px;
  }
  .company-details {
    margin-bottom: 30px; 
    border: 1px solid #ddd; 
    padding: 15px; 
    border-radius: 4px;
  }
  .company-details h2 {
    margin-bottom: 10px;
  }
  .company-details-grid {
    display: grid; 
    grid-template-columns: repeat(2, 1fr); 
    gap: 10px;
  }
  .date-container {
    margin-bottom: 15px;
    text-align: right;
  }
  .summary-container {
    margin-top: 30px;
    margin-bottom: 30px;
    border: 1px solid #ddd;
    padding: 15px;
    border-radius: 4px;
    background-color: #f9f9f9;
  }
  .summary-container h2 {
    margin-bottom: 10px;
  }
  @media print {
    .print-button, .action-button {
      display: none;
    }
  }
`;

// Generate a summary of the report based on entries
const generateReportSummary = (entries: any[]) => {
  // Count entries by urgency
  const urgencyCounts = {
    'גבוהה': 0,
    'בינונית': 0,
    'נמוכה': 0
  };
  
  // Count entries by status
  const statusCounts = {
    'טרם טופל': 0,
    'בטיפול': 0,
    'טופל': 0
  };
  
  entries.forEach(entry => {
    if (entry.urgency in urgencyCounts) {
      urgencyCounts[entry.urgency]++;
    }
    
    if (entry.status in statusCounts) {
      statusCounts[entry.status]++;
    }
  });

  // Generate recommendations based on the counts
  let recommendations = '';
  
  if (urgencyCounts['גבוהה'] > 0) {
    recommendations += `<li>יש לטפל ב-${urgencyCounts['גבוהה']} ממצאים בדחיפות גבוהה בהקדם האפשרי.</li>`;
  }
  
  if (statusCounts['טרם טופל'] > (entries.length / 2)) {
    recommendations += `<li>יותר ממחצית הממצאים (${statusCounts['טרם טופל']} מתוך ${entries.length}) טרם טופלו. מומלץ לזרז את קצב הטיפול.</li>`;
  }
  
  if (statusCounts['טופל'] === entries.length) {
    recommendations += `<li>כל הממצאים טופלו בהצלחה!</li>`;
  } else if (statusCounts['טופל'] > 0) {
    const percentage = Math.round((statusCounts['טופל'] / entries.length) * 100);
    recommendations += `<li>${percentage}% מהממצאים טופלו (${statusCounts['טופל']} מתוך ${entries.length}).</li>`;
  }
  
  if (recommendations === '') {
    recommendations = '<li>אין המלצות ספציפיות בשלב זה.</li>';
  }

  return `
    <div class="summary-container">
      <h2>סיכום וניתוח הדוח</h2>
      
      <div>
        <h3>סיכום ממצאים:</h3>
        <ul>
          <li>סה"כ ממצאים: ${entries.length}</li>
          <li>דחיפות גבוהה: ${urgencyCounts['גבוהה']}</li>
          <li>דחיפות בינונית: ${urgencyCounts['בינונית']}</li>
          <li>דחיפות נמוכה: ${urgencyCounts['נמוכה']}</li>
        </ul>
      </div>
      
      <div>
        <h3>סטטוס טיפול:</h3>
        <ul>
          <li>טרם טופל: ${statusCounts['טרם טופל']}</li>
          <li>בטיפול: ${statusCounts['בטיפול']}</li>
          <li>טופל: ${statusCounts['טופל']}</li>
        </ul>
      </div>
      
      <div>
        <h3>המלצות:</h3>
        <ul>
          ${recommendations}
        </ul>
      </div>
    </div>
  `;
};

import { useLogo } from '@/context/LogoContext'; // Add this line to get the custom logo

export const generateReportContent = (entries: any[], companyDetails: CompanyDetails, includeSummary = false) => {
  const { customLogo } = useLogo(); // Add this line to get the custom logo

  const htmlContent = `
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
        </div>
      </div>

      <div class="date-container">
        <strong>תאריך:</strong> ${new Date().toLocaleDateString('he-IL')}
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

  return htmlContent;
};
