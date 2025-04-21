
interface CompanyDetails {
  name: string;
  address: string;
  contactName: string;
  contactPhone: string;
}

interface SiteDetails {
  id: string;
  name: string;
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
  @media print {
    .print-button, .actions {
      display: none !important;
    }
    body {
      padding: 10mm;
    }
    @page {
      margin: 15mm;
      size: A4;
    }
    table {
      page-break-inside: auto;
    }
    tr {
      page-break-inside: avoid;
      page-break-after: auto;
    }
    td img {
      max-width: 80px;
      max-height: 80px;
    }
  }
`;

export const generateReportContent = (entries: any[], companyDetails: CompanyDetails, siteDetails?: SiteDetails) => {
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
        <img src="/lovable-uploads/66ad0905-a1ce-4144-b307-bd9957ff43b7.png" alt="לוגו" class="logo" />
        <h1>סקר בטיחות</h1>
        ${siteDetails ? `<h2>אתר: ${siteDetails.name}</h2>` : ''}
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
                <td>${index + 1}</td>
                <td><img src="${entry.imageUrl}" alt="${entry.topic}"></td>
                <td>${entry.topic}</td>
                <td>${entry.description}</td>
                <td><span class="${urgencyClass}">${entry.urgency}</span></td>
                <td><span class="${statusClass}">${entry.status}</span></td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
      <div class="actions" style="display: flex; gap: 10px; justify-content: center; margin-top: 20px;">
        <button class="print-button" onclick="window.print()">הדפס סקר</button>
        <button class="print-button" onclick="window.downloadPDF()">הורד PDF</button>
      </div>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
      <script>
        window.downloadPDF = function() {
          const element = document.body;
          const buttons = document.querySelectorAll('.actions');
          buttons.forEach(btn => btn.style.display = 'none');
          
          const opt = {
            margin: [15, 15, 15, 15],
            filename: 'safety-report.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
          };

          html2pdf().set(opt).from(element).save().then(() => {
            buttons.forEach(btn => btn.style.display = 'flex');
          });
        }
      </script>
    </body>
    </html>
  `;

  return htmlContent;
};
