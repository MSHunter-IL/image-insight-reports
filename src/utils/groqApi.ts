
import { ReportEntry } from '@/types/report';

// Types for the image analysis API response
interface ImageAnalysisResponse {
  description: string;
  suggestedUrgency: string;
  suggestedTopic: string;
}

// Mock function to analyze images using GPT-like service (currently a placeholder)
// In a real implementation, this would call an actual AI service like GROQ
export const analyzeImage = async (
  imageData: string, 
  userDescription: string = '',
  language: string = 'he'
): Promise<ImageAnalysisResponse> => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Placeholder response while we don't have a real API integration
    // In a real implementation, the imageData would be sent to an AI service
    
    // Generate different responses based on language
    if (language === 'en') {
      return {
        description: getRandomEnglishDescription(),
        suggestedUrgency: getRandomEnglishUrgency(),
        suggestedTopic: getRandomEnglishTopic(),
      };
    } else {
      return {
        description: getRandomHebrewDescription(),
        suggestedUrgency: getRandomHebrewUrgency(),
        suggestedTopic: getRandomHebrewTopic(),
      };
    }
  } catch (error) {
    console.error("Error analyzing image:", error);
    throw new Error("Failed to analyze image");
  }
};

// Helper functions for random responses in different languages
function getRandomEnglishDescription(): string {
  const descriptions = [
    "The image shows a safety hazard in the form of exposed electrical wiring near a water source. This requires immediate attention to prevent electrical accidents.",
    "Missing safety railing on the staircase, creating a fall hazard for workers and visitors. Safety barriers should be installed according to regulations.",
    "Cracked load-bearing wall detected in the western section of the building. Structural assessment recommended to determine the extent of the damage.",
    "Improperly stored hazardous materials without proper labeling or containment. This violates safety regulations and poses a chemical exposure risk.",
    "Fire extinguisher missing from designated location. Emergency response equipment must be available and accessible at all times according to fire code.",
  ];
  return descriptions[Math.floor(Math.random() * descriptions.length)];
}

function getRandomHebrewDescription(): string {
  const descriptions = [
    "בתמונה נראה מפגע בטיחותי בצורת חיווט חשמלי חשוף בקרבת מקור מים. נדרש טיפול מיידי למניעת תאונות חשמל.",
    "מעקה בטיחות חסר במדרגות, היוצר סכנת נפילה לעובדים ולמבקרים. יש להתקין מחסומי בטיחות בהתאם לתקנות.",
    "נמצא סדק בקיר נושא בחלק המערבי של הבניין. מומלץ לבצע הערכה מבנית כדי לקבוע את היקף הנזק.",
    "חומרים מסוכנים מאוחסנים שלא כהלכה ללא סימון או הכלה נאותים. הדבר מפר את תקנות הבטיחות ומהווה סיכון לחשיפה כימית.",
    "מטף כיבוי אש חסר במיקום המיועד. ציוד תגובה לחירום חייב להיות זמין ונגיש בכל עת בהתאם לתקנות כיבוי אש.",
  ];
  return descriptions[Math.floor(Math.random() * descriptions.length)];
}

function getRandomEnglishUrgency(): string {
  const urgencies = ["High", "Medium", "Low"];
  return urgencies[Math.floor(Math.random() * urgencies.length)];
}

function getRandomHebrewUrgency(): string {
  const urgencies = ["גבוהה", "בינונית", "נמוכה"];
  return urgencies[Math.floor(Math.random() * urgencies.length)];
}

function getRandomEnglishTopic(): string {
  const topics = [
    "Electrical Hazard", 
    "Fall Protection", 
    "Structural Issue",
    "Chemical Storage",
    "Emergency Equipment"
  ];
  return topics[Math.floor(Math.random() * topics.length)];
}

function getRandomHebrewTopic(): string {
  const topics = [
    "סכנה חשמלית", 
    "הגנה מנפילה", 
    "בעיה מבנית",
    "אחסון כימיקלים",
    "ציוד חירום"
  ];
  return topics[Math.floor(Math.random() * topics.length)];
}
