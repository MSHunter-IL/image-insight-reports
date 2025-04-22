
// Generate CSS styles for the report
export const generateReportStyles = () => `
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
