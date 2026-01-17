/**
 * IELTS Band Score Conversion Utilities
 * 
 * This module provides conversion tables and helper functions for:
 * - Converting correct answers to IELTS band scores (Listening & Reading)
 * - Calculating overall IELTS band score from four sections
 * - Validating band score inputs
 * - Assessment criteria reference for teachers
 * 
 * Based on official IELTS scoring guidelines
 */

export interface BandConversion {
  correctAnswers: number;
  bandScore: number;
}

/**
 * Listening Band Score Conversion Table (40 questions)
 * Based on official IELTS Listening test scoring
 * Official IELTS Universal Scoring Methodology
 */
export const LISTENING_BAND_CONVERSION: BandConversion[] = [
  { correctAnswers: 40, bandScore: 9.0 },
  { correctAnswers: 39, bandScore: 9.0 },
  { correctAnswers: 38, bandScore: 8.5 },
  { correctAnswers: 37, bandScore: 8.5 },
  { correctAnswers: 36, bandScore: 8.0 },
  { correctAnswers: 35, bandScore: 8.0 },
  { correctAnswers: 34, bandScore: 7.5 },
  { correctAnswers: 33, bandScore: 7.5 },
  { correctAnswers: 32, bandScore: 7.5 },
  { correctAnswers: 31, bandScore: 7.0 },
  { correctAnswers: 30, bandScore: 7.0 },
  { correctAnswers: 29, bandScore: 6.5 },
  { correctAnswers: 28, bandScore: 6.5 },
  { correctAnswers: 27, bandScore: 6.5 },
  { correctAnswers: 26, bandScore: 6.5 },
  { correctAnswers: 25, bandScore: 6.0 },
  { correctAnswers: 24, bandScore: 6.0 },
  { correctAnswers: 23, bandScore: 6.0 },
  { correctAnswers: 22, bandScore: 5.5 },
  { correctAnswers: 21, bandScore: 5.5 },
  { correctAnswers: 20, bandScore: 5.5 },
  { correctAnswers: 19, bandScore: 5.5 },
  { correctAnswers: 18, bandScore: 5.5 },
  { correctAnswers: 17, bandScore: 5.0 },
  { correctAnswers: 16, bandScore: 5.0 },
  { correctAnswers: 15, bandScore: 4.5 },
  { correctAnswers: 14, bandScore: 4.5 },
  { correctAnswers: 13, bandScore: 4.5 },
  { correctAnswers: 12, bandScore: 4.0 },
  { correctAnswers: 11, bandScore: 4.0 },
  { correctAnswers: 10, bandScore: 4.0 },
  { correctAnswers: 9, bandScore: 3.5 },
  { correctAnswers: 8, bandScore: 3.5 },
  { correctAnswers: 7, bandScore: 3.5 },
  { correctAnswers: 6, bandScore: 3.5 },
  { correctAnswers: 5, bandScore: 3.0 },
  { correctAnswers: 4, bandScore: 3.0 },
  { correctAnswers: 3, bandScore: 2.5 },
  { correctAnswers: 2, bandScore: 2.5 },
  { correctAnswers: 1, bandScore: 2.5 },
  { correctAnswers: 0, bandScore: 2.5 }
];

/**
 * Reading Band Score Conversion Table - Academic (40 questions)
 * Based on official IELTS Reading test scoring for Academic module
 * Official IELTS Universal Scoring Methodology
 */
export const READING_BAND_CONVERSION_ACADEMIC: BandConversion[] = [
  { correctAnswers: 40, bandScore: 9.0 },
  { correctAnswers: 39, bandScore: 9.0 },
  { correctAnswers: 38, bandScore: 8.5 },
  { correctAnswers: 37, bandScore: 8.5 },
  { correctAnswers: 36, bandScore: 8.0 },
  { correctAnswers: 35, bandScore: 8.0 },
  { correctAnswers: 34, bandScore: 7.5 },
  { correctAnswers: 33, bandScore: 7.5 },
  { correctAnswers: 32, bandScore: 7.0 },
  { correctAnswers: 31, bandScore: 7.0 },
  { correctAnswers: 30, bandScore: 7.0 },
  { correctAnswers: 29, bandScore: 6.5 },
  { correctAnswers: 28, bandScore: 6.5 },
  { correctAnswers: 27, bandScore: 6.5 },
  { correctAnswers: 26, bandScore: 6.0 },
  { correctAnswers: 25, bandScore: 6.0 },
  { correctAnswers: 24, bandScore: 6.0 },
  { correctAnswers: 23, bandScore: 6.0 },
  { correctAnswers: 22, bandScore: 5.5 },
  { correctAnswers: 21, bandScore: 5.5 },
  { correctAnswers: 20, bandScore: 5.5 },
  { correctAnswers: 19, bandScore: 5.5 },
  { correctAnswers: 18, bandScore: 5.0 },
  { correctAnswers: 17, bandScore: 5.0 },
  { correctAnswers: 16, bandScore: 5.0 },
  { correctAnswers: 15, bandScore: 5.0 },
  { correctAnswers: 14, bandScore: 4.5 },
  { correctAnswers: 13, bandScore: 4.5 },
  { correctAnswers: 12, bandScore: 4.0 },
  { correctAnswers: 11, bandScore: 4.0 },
  { correctAnswers: 10, bandScore: 4.0 },
  { correctAnswers: 9, bandScore: 3.5 },
  { correctAnswers: 8, bandScore: 3.5 },
  { correctAnswers: 7, bandScore: 3.0 },
  { correctAnswers: 6, bandScore: 3.0 },
  { correctAnswers: 5, bandScore: 2.5 },
  { correctAnswers: 4, bandScore: 2.5 },
  { correctAnswers: 3, bandScore: 2.5 },
  { correctAnswers: 2, bandScore: 2.5 },
  { correctAnswers: 1, bandScore: 2.5 },
  { correctAnswers: 0, bandScore: 2.5 }
];

/**
 * Reading Band Score Conversion Table - General Training (40 questions)
 * Based on official IELTS Reading test scoring for General Training module
 * Official IELTS Universal Scoring Methodology
 */
export const READING_BAND_CONVERSION_GENERAL_TRAINING: BandConversion[] = [
  { correctAnswers: 40, bandScore: 9.0 },
  { correctAnswers: 39, bandScore: 8.5 },
  { correctAnswers: 38, bandScore: 8.0 },
  { correctAnswers: 37, bandScore: 8.0 },
  { correctAnswers: 36, bandScore: 7.5 },
  { correctAnswers: 35, bandScore: 7.0 },
  { correctAnswers: 34, bandScore: 7.0 },
  { correctAnswers: 33, bandScore: 6.5 },
  { correctAnswers: 32, bandScore: 6.5 },
  { correctAnswers: 31, bandScore: 6.0 },
  { correctAnswers: 30, bandScore: 6.0 },
  { correctAnswers: 29, bandScore: 5.5 },
  { correctAnswers: 28, bandScore: 5.5 },
  { correctAnswers: 27, bandScore: 5.5 },
  { correctAnswers: 26, bandScore: 5.0 },
  { correctAnswers: 25, bandScore: 5.0 },
  { correctAnswers: 24, bandScore: 5.0 },
  { correctAnswers: 23, bandScore: 5.0 },
  { correctAnswers: 22, bandScore: 4.5 },
  { correctAnswers: 21, bandScore: 4.5 },
  { correctAnswers: 20, bandScore: 4.5 },
  { correctAnswers: 19, bandScore: 4.5 },
  { correctAnswers: 18, bandScore: 4.0 },
  { correctAnswers: 17, bandScore: 4.0 },
  { correctAnswers: 16, bandScore: 4.0 },
  { correctAnswers: 15, bandScore: 4.0 },
  { correctAnswers: 14, bandScore: 3.5 },
  { correctAnswers: 13, bandScore: 3.5 },
  { correctAnswers: 12, bandScore: 3.5 },
  { correctAnswers: 11, bandScore: 3.0 },
  { correctAnswers: 10, bandScore: 3.0 },
  { correctAnswers: 9, bandScore: 3.0 },
  { correctAnswers: 8, bandScore: 2.5 },
  { correctAnswers: 7, bandScore: 2.5 },
  { correctAnswers: 6, bandScore: 2.5 },
  { correctAnswers: 5, bandScore: 2.5 },
  { correctAnswers: 4, bandScore: 2.5 },
  { correctAnswers: 3, bandScore: 2.5 },
  { correctAnswers: 2, bandScore: 2.5 },
  { correctAnswers: 1, bandScore: 2.5 },
  { correctAnswers: 0, bandScore: 2.5 }
];

/**
 * Convert correct answers to IELTS band score for Listening
 * 
 * @param correctAnswers - Number of correct answers (0-40)
 * @returns IELTS band score (0-9)
 * 
 * @example
 * convertListeningToBand(30) // Returns 7.0
 * convertListeningToBand(35) // Returns 8.0
 */
export function convertListeningToBand(correctAnswers: number): number {
  // Clamp to valid range
  const clamped = Math.max(0, Math.min(40, Math.floor(correctAnswers)));
  
  // Find the band score by matching exact value
  const entry = LISTENING_BAND_CONVERSION.find(e => e.correctAnswers === clamped);
  
  return entry ? entry.bandScore : 0;
}

/**
 * Convert correct answers to IELTS band score for Reading (Academic)
 *
 * @param correctAnswers - Number of correct answers (0-40)
 * @returns IELTS band score (0-9)
 *
 * @example
 * convertReadingToBand(30) // Returns 7.0
 * convertReadingToBand(35) // Returns 8.0
 */
export function convertReadingToBand(correctAnswers: number): number {
  // Clamp to valid range
  const clamped = Math.max(0, Math.min(40, Math.floor(correctAnswers)));

  // Find the band score by matching exact value
  const entry = READING_BAND_CONVERSION_ACADEMIC.find(e => e.correctAnswers === clamped);

  return entry ? entry.bandScore : 0;
}

/**
 * Convert correct answers to IELTS band score for Reading (General Training)
 *
 * @param correctAnswers - Number of correct answers (0-40)
 * @returns IELTS band score (0-9)
 *
 * @example
 * convertReadingGeneralTrainingToBand(30) // Returns 6.0
 * convertReadingGeneralTrainingToBand(35) // Returns 7.0
 */
export function convertReadingGeneralTrainingToBand(correctAnswers: number): number {
  // Clamp to valid range
  const clamped = Math.max(0, Math.min(40, Math.floor(correctAnswers)));

  // Find the band score by matching exact value
  const entry = READING_BAND_CONVERSION_GENERAL_TRAINING.find(e => e.correctAnswers === clamped);

  return entry ? entry.bandScore : 0;
}

/**
 * Calculate overall IELTS band score from four sections
 *
 * Official IELTS Universal Scoring Methodology:
 * Step 1: Add the four module band scores together
 * Step 2: Divide the total by 4 to calculate the average
 * Step 3: Apply official IELTS rounding rules to the average:
 *   - If decimal portion is 0.00 to 0.24 → round DOWN to nearest whole band (.0)
 *   - If decimal portion is 0.25 to 0.74 → round to .5 (half band)
 *   - If decimal portion is 0.75 to 0.99 → round UP to next whole band (.0)
 *
 * @param listening - Listening band score (0-9)
 * @param reading - Reading band score (0-9)
 * @param writing - Writing band score (0-9)
 * @param speaking - Speaking band score (0-9)
 * @returns Overall IELTS band score (0-9), rounded according to official rules
 *
 * @example
 * calculateOverallBand(6.5, 6.5, 5.0, 7.0) // Average: 6.25 → 6.5
 * calculateOverallBand(6.5, 6.5, 6.5, 6.5) // Average: 6.50 → 6.5
 * calculateOverallBand(6.5, 6.5, 5.5, 7.5) // Average: 6.50 → 6.5
 * calculateOverallBand(8.0, 7.0, 6.5, 6.5) // Average: 7.00 → 7.0
 * calculateOverallBand(4.0, 5.0, 4.0, 4.0) // Average: 4.25 → 4.5
 * calculateOverallBand(6.5, 6.5, 5.5, 6.5) // Average: 6.25 → 6.5
 */
export function calculateOverallBand(
  listening: number,
  reading: number,
  writing: number,
  speaking: number
): number {
  // Validate inputs - all scores must be valid band scores (0-9, in 0.5 increments)
  if ([listening, reading, writing, speaking].some(score => score < 0 || score > 9)) {
    console.warn('Invalid band scores provided to calculateOverallBand');
    return 0;
  }

  // Step 1 & 2: Calculate average of 4 sections
  const average = (listening + reading + writing + speaking) / 4;

  // Step 3: Apply official IELTS rounding rules
  // Get the whole number part and decimal part
  const wholePart = Math.floor(average);
  const decimalPart = average - wholePart;

  let rounded: number;

  if (decimalPart < 0.25) {
    // 0.00 to 0.24 → round DOWN to nearest whole band
    rounded = wholePart;
  } else if (decimalPart < 0.75) {
    // 0.25 to 0.74 → round to .5 (half band)
    rounded = wholePart + 0.5;
  } else {
    // 0.75 to 0.99 → round UP to next whole band
    rounded = wholePart + 1.0;
  }

  // Ensure within valid range (0-9)
  return Math.max(0, Math.min(9, rounded));
}

/**
 * Validate band score input (for Writing and Speaking manual input)
 * Must be 0-9 in 0.5 increments
 * 
 * @param score - Band score to validate
 * @returns true if valid, false otherwise
 * 
 * @example
 * isValidBandScore(7.0) // true
 * isValidBandScore(7.5) // true
 * isValidBandScore(7.3) // false (not in 0.5 increments)
 * isValidBandScore(10) // false (out of range)
 */
export function isValidBandScore(score: number): boolean {
  // Check range
  if (score < 0 || score > 9) return false;
  
  // Check if it's a whole number or .5
  // Multiply by 2, check if result is an integer
  // 7.0 * 2 = 14 (integer) ✓
  // 7.5 * 2 = 15 (integer) ✓
  // 7.3 * 2 = 14.6 (not integer) ✗
  return Number.isInteger(score * 2);
}

/**
 * Get band score description for display purposes
 * 
 * @param band - IELTS band score
 * @returns Description of proficiency level
 */
export function getBandDescription(band: number): string {
  if (band === 9.0) return 'Expert User';
  if (band >= 8.0) return 'Very Good User';
  if (band >= 7.0) return 'Good User';
  if (band >= 6.0) return 'Competent User';
  if (band >= 5.0) return 'Modest User';
  if (band >= 4.0) return 'Limited User';
  if (band >= 3.0) return 'Extremely Limited User';
  if (band >= 1.0) return 'Intermittent User';
  return 'Non User';
}

/**
 * Get detailed band score interpretation for students
 * 
 * @param band - Overall IELTS band score
 * @returns Detailed interpretation message
 */
export function getBandInterpretation(band: number): string {
  if (band >= 8.5) {
    return "Excellent! You have a very good command of English and can handle complex language effectively with minimal errors.";
  }
  if (band >= 7.5) {
    return "Very Good! You show a high level of operational command with occasional errors and misunderstandings in unfamiliar situations.";
  }
  if (band >= 6.5) {
    return "Good! You have generally effective command of the language despite some inaccuracies and occasional breakdowns in communication.";
  }
  if (band >= 5.5) {
    return "Competent! You have partial command of the language and can handle overall meaning in most situations, though you're likely to make many mistakes.";
  }
  if (band >= 4.5) {
    return "Basic! You have limited ability to use English in familiar situations and may face frequent communication breakdowns.";
  }
  return "Keep practicing! There's significant room for improvement in your English language skills. Focus on building vocabulary and grammar fundamentals.";
}

/**
 * IELTS Writing Assessment Criteria (for teacher reference)
 * Each task is assessed on four criteria, each worth 25% of the score
 * 
 * Overall Writing Band Score Calculation:
 * - Task 1 contributes 1/3 of the final score
 * - Task 2 contributes 2/3 of the final score (double weight)
 * - Formula: (Task 1 + Task 2 × 2) ÷ 3
 * - Result is rounded to the nearest 0.5 band score
 */
export const WRITING_CRITERIA = {
  task1: {
    title: 'Writing Task 1',
    criteria: [
      'Task Achievement (25%) - Addresses all parts of the task, presents overview',
      'Coherence and Cohesion (25%) - Logical organization, clear progression',
      'Lexical Resource (25%) - Range and accuracy of vocabulary',
      'Grammatical Range and Accuracy (25%) - Variety and correctness of structures'
    ],
    minWords: 150,
    timeRecommended: 20,
    description: 'Describe visual information (graph, chart, diagram) in your own words'
  },
  task2: {
    title: 'Writing Task 2',
    criteria: [
      'Task Response (25%) - Addresses all parts, develops position with relevant ideas',
      'Coherence and Cohesion (25%) - Logical organization, effective paragraphing',
      'Lexical Resource (25%) - Sophisticated vocabulary use with flexibility',
      'Grammatical Range and Accuracy (25%) - Complex structures used accurately'
    ],
    minWords: 250,
    timeRecommended: 40,
    description: 'Present and justify an opinion, compare viewpoints, or propose solutions'
  }
};

/**
 * IELTS Speaking Assessment Criteria (for teacher reference)
 * Each criterion is weighted equally
 */
export const SPEAKING_CRITERIA = [
  {
    name: 'Fluency and Coherence',
    description: 'Speaks smoothly with minimal hesitation, develops topics logically'
  },
  {
    name: 'Lexical Resource',
    description: 'Uses varied vocabulary accurately and appropriately'
  },
  {
    name: 'Grammatical Range and Accuracy',
    description: 'Uses a mix of simple and complex structures with minimal errors'
  },
  {
    name: 'Pronunciation',
    description: 'Clear articulation, appropriate intonation and stress patterns'
  }
];

/**
 * Get color coding for band score display
 * 
 * @param band - IELTS band score
 * @returns Tailwind CSS color class
 */
export function getBandColor(band: number): string {
  if (band >= 8.0) return 'text-green-600';
  if (band >= 7.0) return 'text-blue-600';
  if (band >= 6.0) return 'text-yellow-600';
  if (band >= 5.0) return 'text-orange-600';
  return 'text-red-600';
}

/**
 * Get background color for band score cards
 * 
 * @param band - IELTS band score
 * @returns Tailwind CSS background color class
 */
export function getBandBackgroundColor(band: number): string {
  if (band >= 8.0) return 'bg-green-100';
  if (band >= 7.0) return 'bg-blue-100';
  if (band >= 6.0) return 'bg-yellow-100';
  if (band >= 5.0) return 'bg-orange-100';
  return 'bg-red-100';
}
