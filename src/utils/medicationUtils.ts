
import { Medication } from "@/types/medication";

/**
 * Extract the dosing pattern from medication notes or timing
 * Returns an array with [morning, noon, evening] doses
 */
export const getDosingPattern = (medication: Medication): [number, number, number] => {
  // Try to extract from notes using the pattern "Dosing pattern: 1+0+0"
  const dosingPatternMatch = medication.notes?.match(/Dosing pattern: (\d+)\+(\d+)\+(\d+)/);
  
  if (dosingPatternMatch) {
    const morning = parseInt(dosingPatternMatch[1]);
    const noon = parseInt(dosingPatternMatch[2]);
    const evening = parseInt(dosingPatternMatch[3]);
    return [morning, noon, evening];
  }
  
  // If no dosing pattern in notes, check the timing field
  if (medication.timing) {
    if (medication.timing === 'morning') return [1, 0, 0];
    if (medication.timing === 'afternoon') return [0, 1, 0]; 
    if (medication.timing === 'evening') return [0, 0, 1];
  }
  
  // If no specific pattern, make a best guess based on time
  if (medication.time) {
    const hour = parseInt(medication.time.split(':')[0], 10);
    if (hour >= 5 && hour < 12) return [1, 0, 0]; // Morning
    if (hour >= 12 && hour < 17) return [0, 1, 0]; // Noon
    return [0, 0, 1]; // Evening
  }
  
  return [0, 0, 0];
};

/**
 * Get dosing pattern as readable text
 */
export const getDosingPatternText = (medication: Medication): string => {
  const [morning, noon, evening] = getDosingPattern(medication);
  
  // Map specific patterns to their descriptions
  if (morning === 1 && noon === 0 && evening === 0) return "Morning";
  if (morning === 0 && noon === 1 && evening === 0) return "Noon";
  if (morning === 0 && noon === 0 && evening === 1) return "Evening";
  if (morning === 1 && noon === 1 && evening === 0) return "Morning & Noon";
  if (morning === 1 && noon === 0 && evening === 1) return "Morning & Evening";
  if (morning === 0 && noon === 1 && evening === 1) return "Noon & Evening";
  if (morning === 1 && noon === 1 && evening === 1) return "Morning, Noon & Evening";
  
  // If there are multiple doses in a period
  if (morning > 1 || noon > 1 || evening > 1) {
    return `${morning}+${noon}+${evening}`;
  }
  
  // If nothing matches, show the pattern
  if (morning || noon || evening) {
    return `${morning}+${noon}+${evening}`;
  }
  
  return "No pattern";
};

/**
 * Display a placeholder if medication name is empty
 */
export const getMedicationName = (medication: Medication): string => {
  if (!medication.name) return "Unnamed Medication";
  return medication.name;
};

/**
 * Check if medication has special instructions
 */
export const hasSpecialInstructions = (medication: Medication): boolean => {
  return !!medication.instructions && medication.instructions.trim() !== '';
};
