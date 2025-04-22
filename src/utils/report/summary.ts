
import { ReportEntry } from "@/types/report";

// Generate a summary of the report based on entries
export const generateReportSummary = (entries: ReportEntry[]) => {
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
