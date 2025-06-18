
import { GoogleGenerativeAI } from '@google/generative-ai';
import { MedicationFormData, OcrMedicationData } from '@/types/medication';

// Initialize Gemini AI with your API key
const getGeminiAI = () => {
  // You'll need to store your Gemini API key in the environment or ask user to input it
  const apiKey = localStorage.getItem('gemini_api_key') || 'YOUR_GEMINI_API_KEY_HERE';
  return new GoogleGenerativeAI(apiKey);
};

export const processImageWithGemini = async (imageBase64: string, userId: string): Promise<{
  success: boolean;
  extractedText: string;
  extractedMedications: MedicationFormData[];
  error?: string;
}> => {
  try {
    const genAI = getGeminiAI();
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Analyze this prescription image and extract all medication information. Return ONLY a valid JSON array in this exact format:
[
  {
    "medication_name": "exact name from prescription",
    "generic_name": "generic name if available or empty string",
    "dosage": "dosage with units",
    "dosing_pattern": "pattern like 1+0+1 or frequency description",
    "frequency": "once daily, twice daily, etc",
    "instructions": "special instructions or empty string",
    "timing": "before_food/with_food/after_food or empty string"
  }
]

Important: Return ONLY the JSON array, no other text. If you can't read something clearly, use empty string for that field.`;

    // Remove data URL prefix if present
    const base64Data = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');

    const imageParts = [
      {
        inlineData: {
          data: base64Data,
          mimeType: "image/jpeg"
        }
      }
    ];

    const result = await model.generateContent([prompt, ...imageParts]);
    const response = await result.response;
    const extractedText = response.text();

    console.log('Gemini response:', extractedText);

    // Parse the JSON response
    let extractedMedications: MedicationFormData[] = [];
    try {
      const cleanedText = extractedText.trim();
      const jsonMatch = cleanedText.match(/\[[\s\S]*\]/);
      
      let rawMedications = [];
      if (jsonMatch) {
        rawMedications = JSON.parse(jsonMatch[0]);
      } else {
        rawMedications = JSON.parse(cleanedText);
      }

      // Convert to MedicationFormData format
      extractedMedications = rawMedications.map((med: any) => {
        let frequency = "once-daily";
        const dosingPattern = med.dosing_pattern || '';
        
        if (dosingPattern === "1+0+0" || dosingPattern === "0+1+0" || dosingPattern === "0+0+1") {
          frequency = "once-daily";
        } else if (dosingPattern.includes("1") && dosingPattern.split('+').filter((x: string) => x === '1').length === 2) {
          frequency = "twice-daily";
        } else if (dosingPattern === "1+1+1") {
          frequency = "three-times-daily";
        }
        
        let defaultTime = "08:00";
        if (dosingPattern === "0+1+0") defaultTime = "13:00";
        else if (dosingPattern === "0+0+1") defaultTime = "20:00";
        
        return {
          name: med.medication_name || "",
          dosage: med.dosage || "",
          frequency: frequency,
          time: defaultTime,
          instructions: med.instructions || "",
          startDate: new Date().toISOString().split('T')[0],
          timing: med.timing as any || undefined,
          notes: `Extracted via Gemini AI\nGeneric: ${med.generic_name || 'N/A'}\nPattern: ${dosingPattern}`
        };
      }).filter((med: MedicationFormData) => med.name.trim() !== "");

    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      extractedMedications = [{
        name: "Error parsing prescription",
        dosage: "",
        frequency: "once-daily",
        time: "08:00",
        instructions: extractedText,
        startDate: new Date().toISOString().split('T')[0]
      }];
    }

    return {
      success: true,
      extractedText,
      extractedMedications
    };

  } catch (error: any) {
    console.error('Gemini OCR error:', error);
    return {
      success: false,
      extractedText: "",
      extractedMedications: [],
      error: error.message || "Failed to process image with Gemini"
    };
  }
};

export const setGeminiApiKey = (apiKey: string) => {
  localStorage.setItem('gemini_api_key', apiKey);
};

export const getStoredGeminiApiKey = (): string | null => {
  return localStorage.getItem('gemini_api_key');
};
