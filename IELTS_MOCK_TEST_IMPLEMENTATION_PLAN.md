# IELTS Mock Test Flow - Detailed Implementation Plan

**Created**: January 2025
**Status**: Ready for Implementation
**Priority**: HIGH

---

## 📋 Executive Summary

This plan details the complete implementation for updating the IELTS mock test flow to ensure:
- Fixed section order (Listening → Reading → Writing)
- Individual section timers with manual submission
- Section locking after submission
- Teacher marking with automatic band conversion
- Speaking marks integration
- Overall IELTS band score calculation

---

## 🎯 Core Requirements

### 1. Student Exam Flow
✅ **Fixed Section Order**: Listening → Reading → Writing (enforced, no navigation)
✅ **Individual Timers**: Each section has its own countdown timer
✅ **Manual Submission**: Submit button at end of each section (NO auto-advance)
✅ **Time Warning**: Show warning when timer reaches 00:00
✅ **Post-Time Submission**: Allow submission even after time expires
✅ **Section Locking**: After submission, section becomes view-only (no edits)

### 2. Submission Management
✅ **Three Section Slides**: L, R, W displayed as navigable slides/pages
✅ **Teacher Marking**: Review and mark each section independently
✅ **Band Score Conversion**: 
   - Listening: Auto-convert from /40 correct answers
   - Reading: Auto-convert from /40 correct answers
   - Writing: Manual band input (0-9, with .5)
   - Speaking: Manual band input (0-9, with .5)
✅ **Overall Band**: (L+R+W+S) ÷ 4, rounded to nearest 0.5

### 3. Publishing Rules
✅ **Speaking Mandatory**: Cannot publish without Speaking marks
✅ **All Four Sections**: Overall band calculated only when all 4 scores available
✅ **Student Dashboard**: Published results show all section scores + overall band

---

## 🗂️ Data Structure Updates

### Updated ExamSubmission Interface

```typescript
export interface ExamSubmission {
  id: string;
  studentId: string;
  studentName: string;
  
  // Mock test specific
  testType: 'partial' | 'mock';
  
  // Section-wise submission data (for mock tests)
  sectionSubmissions?: {
    listening?: SectionSubmission;
    reading?: SectionSubmission;
    writing?: SectionSubmission;
  };
  
  // Section-wise band scores
  sectionScores?: {
    listening?: number;      // Band score 0-9
    reading?: number;        // Band score 0-9
    writing?: number;        // Band score 0-9
    speaking?: number;       // Band score 0-9 (mandatory)
  };
  
  // Overall band score
  overallBand?: number;      // Average of 4 sections, rounded to 0.5
  
  // Publishing status
  resultPublished: boolean;
  publishedAt?: string;
  
  // Legacy fields (for partial tests)
  trackId: string;
  trackName: string;
  answers: Record<number | string, string>;
  marks?: Record<number | string, 'correct' | 'incorrect' | null>;
  score?: number;
  manualScore?: number;
  
  // Common fields
  examCode: string;
  batchId?: string;
  submittedAt: string;
  timeSpent: string;
  status: 'completed';
  markedBy?: string;
}

interface SectionSubmission {
  trackId: string;
  trackName: string;
  answers: Record<number | string, string>;
  marks?: Record<number | string, 'correct' | 'incorrect' | null>;
  submittedAt: string;
  timeSpent: string;
  locked: boolean;           // View-only after submission
  correctAnswers?: number;   // For L & R automatic conversion
  bandScore?: number;        // Calculated or manually input
}
```

---

## 📊 IELTS Band Score Conversion Tables

### File: `/app/src/utils/bandScoreConversion.ts`

```typescript
/**
 * Standard IELTS Band Score Conversion Tables
 * Based on official IELTS scoring guidelines
 */

export interface BandConversion {
  correctAnswers: number;
  bandScore: number;
}

// Listening Band Score Conversion (40 questions)
export const LISTENING_BAND_CONVERSION: BandConversion[] = [
  { correctAnswers: 39, bandScore: 9.0 },
  { correctAnswers: 37, bandScore: 8.5 },
  { correctAnswers: 35, bandScore: 8.0 },
  { correctAnswers: 32, bandScore: 7.5 },
  { correctAnswers: 30, bandScore: 7.0 },
  { correctAnswers: 26, bandScore: 6.5 },
  { correctAnswers: 23, bandScore: 6.0 },
  { correctAnswers: 18, bandScore: 5.5 },
  { correctAnswers: 16, bandScore: 5.0 },
  { correctAnswers: 13, bandScore: 4.5 },
  { correctAnswers: 10, bandScore: 4.0 },
  { correctAnswers: 8, bandScore: 3.5 },
  { correctAnswers: 6, bandScore: 3.0 },
  { correctAnswers: 4, bandScore: 2.5 },
  { correctAnswers: 3, bandScore: 2.0 },
  { correctAnswers: 2, bandScore: 1.5 },
  { correctAnswers: 1, bandScore: 1.0 },
  { correctAnswers: 0, bandScore: 0 }
];

// Reading Band Score Conversion (40 questions) - Academic
export const READING_BAND_CONVERSION_ACADEMIC: BandConversion[] = [
  { correctAnswers: 39, bandScore: 9.0 },
  { correctAnswers: 37, bandScore: 8.5 },
  { correctAnswers: 35, bandScore: 8.0 },
  { correctAnswers: 33, bandScore: 7.5 },
  { correctAnswers: 30, bandScore: 7.0 },
  { correctAnswers: 27, bandScore: 6.5 },
  { correctAnswers: 23, bandScore: 6.0 },
  { correctAnswers: 19, bandScore: 5.5 },
  { correctAnswers: 15, bandScore: 5.0 },
  { correctAnswers: 13, bandScore: 4.5 },
  { correctAnswers: 10, bandScore: 4.0 },
  { correctAnswers: 8, bandScore: 3.5 },
  { correctAnswers: 6, bandScore: 3.0 },
  { correctAnswers: 4, bandScore: 2.5 },
  { correctAnswers: 3, bandScore: 2.0 },
  { correctAnswers: 2, bandScore: 1.5 },
  { correctAnswers: 1, bandScore: 1.0 },
  { correctAnswers: 0, bandScore: 0 }
];

/**
 * Convert correct answers to IELTS band score for Listening
 */
export function convertListeningToBand(correctAnswers: number): number {
  // Find the band score by matching or finding closest lower value
  for (let i = 0; i < LISTENING_BAND_CONVERSION.length; i++) {
    if (correctAnswers >= LISTENING_BAND_CONVERSION[i].correctAnswers) {
      return LISTENING_BAND_CONVERSION[i].bandScore;
    }
  }
  return 0;
}

/**
 * Convert correct answers to IELTS band score for Reading (Academic)
 */
export function convertReadingToBand(correctAnswers: number): number {
  // Find the band score by matching or finding closest lower value
  for (let i = 0; i < READING_BAND_CONVERSION_ACADEMIC.length; i++) {
    if (correctAnswers >= READING_BAND_CONVERSION_ACADEMIC[i].correctAnswers) {
      return READING_BAND_CONVERSION_ACADEMIC[i].bandScore;
    }
  }
  return 0;
}

/**
 * Calculate overall IELTS band score from four sections
 * Rules: Average of 4 sections, rounded to nearest 0.5
 * 
 * Examples:
 * - 6.75 → 7.0
 * - 6.25 → 6.5
 * - 6.125 → 6.0
 */
export function calculateOverallBand(
  listening: number,
  reading: number,
  writing: number,
  speaking: number
): number {
  const average = (listening + reading + writing + speaking) / 4;
  
  // Round to nearest 0.5
  const rounded = Math.round(average * 2) / 2;
  
  // Ensure within valid range (0-9)
  return Math.max(0, Math.min(9, rounded));
}

/**
 * Validate band score input (for Writing and Speaking)
 * Must be 0-9 in 0.5 increments
 */
export function isValidBandScore(score: number): boolean {
  if (score < 0 || score > 9) return false;
  // Check if it's a whole number or .5
  return (score * 2) % 1 === 0;
}

/**
 * IELTS Writing Assessment Criteria (for teacher reference)
 */
export const WRITING_CRITERIA = {
  task1: {
    criteria: [
      'Task Achievement',
      'Coherence and Cohesion',
      'Lexical Resource',
      'Grammatical Range and Accuracy'
    ],
    minWords: 150,
    timeRecommended: 20
  },
  task2: {
    criteria: [
      'Task Response',
      'Coherence and Cohesion',
      'Lexical Resource',
      'Grammatical Range and Accuracy'
    ],
    minWords: 250,
    timeRecommended: 40
  }
};

/**
 * IELTS Speaking Assessment Criteria (for teacher reference)
 */
export const SPEAKING_CRITERIA = [
  'Fluency and Coherence',
  'Lexical Resource',
  'Grammatical Range and Accuracy',
  'Pronunciation'
];
```

---

## 🔄 Implementation Phases

### **PHASE 1: Data Structure & Utilities** (1-2 hours)

#### Task 1.1: Create Band Score Conversion Utility
- **File**: Create `/app/src/utils/bandScoreConversion.ts`
- **Content**: Complete conversion tables and helper functions (see above)
- **Testing**: Unit tests for conversion accuracy

#### Task 1.2: Update Storage Interface
- **File**: `/app/src/utils/storage.ts`
- **Changes**:
  - Add `SectionSubmission` interface
  - Update `ExamSubmission` interface
  - Add helper methods for section-wise operations
  - Add method to calculate and save band scores

```typescript
// Add to storage.ts

interface SectionSubmission {
  trackId: string;
  trackName: string;
  answers: Record<number | string, string>;
  marks?: Record<number | string, 'correct' | 'incorrect' | null>;
  submittedAt: string;
  timeSpent: string;
  locked: boolean;
  correctAnswers?: number;
  bandScore?: number;
}

// New methods to add:

async updateSectionSubmission(
  submissionId: string,
  section: 'listening' | 'reading' | 'writing',
  sectionData: SectionSubmission
): Promise<boolean>

async saveSectionBandScore(
  submissionId: string,
  section: 'listening' | 'reading' | 'writing' | 'speaking',
  bandScore: number
): Promise<boolean>

async calculateAndSaveOverallBand(submissionId: string): Promise<number | null>

async canPublishResult(submissionId: string): Promise<boolean>
```

---

### **PHASE 2: Student Exam Flow Updates** (3-4 hours)

#### Task 2.1: Update ExamPage.tsx Timer Logic
- **File**: `/app/src/pages/ExamPage.tsx`
- **Location**: Lines 317-404 (timer useEffect)
- **Changes**:

```typescript
// REMOVE auto-advance logic at lines 331-345
// REPLACE WITH:

if (trackRemainingMs <= 0) {
  // Show warning but DON'T auto-advance
  setCurrentTrackTimeRemaining('00:00');
  setIsTimeCritical(true);
  setIsTimeWarning(true);
  
  // Show modal/banner warning
  if (!timeExpiredWarningShown[currentTrackIndex]) {
    setTimeExpiredWarningShown(prev => ({
      ...prev,
      [currentTrackIndex]: true
    }));
    // Display warning banner
  }
  return; // Stop here, no auto-advance
}
```

#### Task 2.2: Add Section Submission Logic
- **File**: `/app/src/pages/ExamPage.tsx`
- **Location**: Add new state and handlers
- **Changes**:

```typescript
// Add state
const [sectionSubmissions, setSectionSubmissions] = useState<{
  listening?: SectionSubmission;
  reading?: SectionSubmission;
  writing?: SectionSubmission;
}>({});

const [timeExpiredWarningShown, setTimeExpiredWarningShown] = useState<{
  [key: number]: boolean;
}>({});

// Add handler for section submission
const handleSectionSubmit = async (sectionType: 'listening' | 'reading' | 'writing') => {
  const currentTrackData = trackDataList[currentTrackIndex];
  
  // Prepare section submission data
  const sectionSubmission: SectionSubmission = {
    trackId: currentTrackData.track.id,
    trackName: currentTrackData.track.name,
    answers: sectionType === 'writing' ? writingAnswers : answers,
    submittedAt: new Date().toISOString(),
    timeSpent: calculateTimeSpent(),
    locked: true
  };
  
  // Update state
  setSectionSubmissions(prev => ({
    ...prev,
    [sectionType]: sectionSubmission
  }));
  
  // Move to next section if not last
  if (currentTrackIndex < trackDataList.length - 1) {
    setCurrentTrackIndex(prev => prev + 1);
    setCurrentSection(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    // All sections submitted, proceed to final submission
    await handleFinalSubmit();
  }
};

// Update handleSubmit to use section submissions
const handleFinalSubmit = async () => {
  const submission: ExamSubmission = {
    id: `${studentId}-${Date.now()}`,
    studentId,
    studentName,
    testType: 'mock',
    examCode: currentExamCode || '',
    sectionSubmissions,
    submittedAt: new Date().toISOString(),
    timeSpent: calculateTimeSpent(),
    status: 'completed',
    resultPublished: false,
    // ... other fields
  };
  
  await storage.addSubmission(submission);
  onSubmit();
};
```

#### Task 2.3: Update Submit Button UI
- **File**: `/app/src/pages/ExamPage.tsx`
- **Location**: Lines 920-975 (navigation buttons)
- **Changes**:

```typescript
// REPLACE auto-advance message WITH manual submit button

{currentSection === (examData?.length || 0) - 1 ? (
  <button
    onClick={() => handleSectionSubmit(trackOrder[currentTrackIndex])}
    disabled={sectionSubmissions[trackOrder[currentTrackIndex]]?.locked}
    className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    data-testid="submit-section-button"
  >
    {sectionSubmissions[trackOrder[currentTrackIndex]]?.locked 
      ? '✓ Section Submitted' 
      : `Submit ${trackOrder[currentTrackIndex]} Section`}
  </button>
) : (
  // Next section button
)}
```

#### Task 2.4: Add Time Expired Warning Banner
- **File**: `/app/src/pages/ExamPage.tsx`
- **Location**: After ExamHeader
- **Changes**:

```typescript
{/* Time Expired Warning Banner */}
{timeExpiredWarningShown[currentTrackIndex] && 
 currentTrackTimeRemaining === '00:00' && 
 !sectionSubmissions[trackOrder[currentTrackIndex]]?.locked && (
  <div className="bg-red-100 border-l-4 border-red-500 p-4 mb-4 mx-4" data-testid="time-expired-warning">
    <div className="flex items-center gap-3">
      <AlertCircle className="w-6 h-6 text-red-600" />
      <div>
        <h3 className="text-lg font-bold text-red-900">Time Expired</h3>
        <p className="text-red-800">
          The time for this section has ended. You can still submit your answers, 
          but you cannot make further changes. Please submit now.
        </p>
      </div>
    </div>
  </div>
)}
```

#### Task 2.5: Add Section Lock (View-Only Mode)
- **File**: `/app/src/pages/ExamPage.tsx`
- **Changes**: Disable all input components when section is locked

```typescript
// Add to all question components
disabled={sectionSubmissions[trackOrder[currentTrackIndex]]?.locked}

// Add visual indicator
{sectionSubmissions[trackOrder[currentTrackIndex]]?.locked && (
  <div className="fixed top-20 right-4 bg-green-100 border border-green-400 rounded-lg px-4 py-2 shadow-lg z-50">
    <div className="flex items-center gap-2">
      <CheckCircle className="w-5 h-5 text-green-600" />
      <span className="text-sm font-medium text-green-900">
        Section Submitted - View Only
      </span>
    </div>
  </div>
)}
```

---

### **PHASE 3: Teacher Marking Interface** (4-5 hours)

#### Task 3.1: Create Section Submission Card Component
- **File**: Create `/app/src/components/SectionSubmissionCard.tsx`
- **Purpose**: Display one section (L, R, or W) with marking interface

```typescript
import React, { useState } from 'react';
import { CheckIcon, XIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { convertListeningToBand, convertReadingToBand } from '../utils/bandScoreConversion';

interface SectionSubmissionCardProps {
  section: 'listening' | 'reading' | 'writing';
  sectionData: SectionSubmission;
  onMarkQuestion: (questionNumber: number | string, mark: 'correct' | 'incorrect' | null) => void;
  onSaveBandScore: (bandScore: number) => void;
  currentBandScore?: number;
  isReadOnly?: boolean;
}

export function SectionSubmissionCard({
  section,
  sectionData,
  onMarkQuestion,
  onSaveBandScore,
  currentBandScore,
  isReadOnly
}: SectionSubmissionCardProps) {
  const [localMarks, setLocalMarks] = useState(sectionData.marks || {});
  const [manualBandScore, setManualBandScore] = useState<string>(
    currentBandScore?.toString() || ''
  );

  // Get section icon and color
  const getSectionStyle = () => {
    switch (section) {
      case 'listening':
        return { icon: '🎧', color: 'blue', label: 'Listening' };
      case 'reading':
        return { icon: '📖', color: 'green', label: 'Reading' };
      case 'writing':
        return { icon: '✍️', color: 'orange', label: 'Writing' };
    }
  };

  const style = getSectionStyle();

  // Calculate correct answers
  const correctCount = Object.values(localMarks).filter(m => m === 'correct').length;
  const totalQuestions = section === 'writing' ? 2 : 40;

  // Auto-calculate band score for L & R
  const autoCalculatedBand = section === 'listening' 
    ? convertListeningToBand(correctCount)
    : section === 'reading'
    ? convertReadingToBand(correctCount)
    : null;

  // Display band score
  const displayBandScore = section === 'writing'
    ? parseFloat(manualBandScore) || null
    : autoCalculatedBand;

  const handleMarkChange = (questionNumber: number | string, mark: 'correct' | 'incorrect' | null) => {
    if (isReadOnly) return;
    
    const newMarks = { ...localMarks, [questionNumber]: mark };
    setLocalMarks(newMarks);
    onMarkQuestion(questionNumber, mark);
  };

  const handleSaveBand = () => {
    if (section === 'writing') {
      const band = parseFloat(manualBandScore);
      if (!isNaN(band) && band >= 0 && band <= 9) {
        onSaveBandScore(band);
      }
    } else if (autoCalculatedBand !== null) {
      onSaveBandScore(autoCalculatedBand);
    }
  };

  // Get all questions/tasks
  const questions = section === 'writing'
    ? Object.keys(sectionData.answers).filter(key => key.includes('task'))
    : Array.from({ length: 40 }, (_, i) => i + 1);

  return (
    <div className="bg-white rounded-lg border-2 border-gray-200 shadow-lg overflow-hidden">
      {/* Section Header */}
      <div className={`bg-${style.color}-500 text-white p-6`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{style.icon}</span>
            <div>
              <h2 className="text-2xl font-bold">{style.label} Section</h2>
              <p className="text-sm opacity-90">{sectionData.trackName}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm opacity-90">Band Score</div>
            <div className="text-5xl font-bold">
              {displayBandScore?.toFixed(1) || '--'}
            </div>
          </div>
        </div>
      </div>

      {/* Marking Stats */}
      <div className="bg-gray-50 border-b border-gray-200 p-4">
        <div className="grid grid-cols-4 gap-4">
          <div>
            <div className="text-xs text-gray-600">Total {section === 'writing' ? 'Tasks' : 'Questions'}</div>
            <div className="text-2xl font-bold text-gray-900">{totalQuestions}</div>
          </div>
          <div>
            <div className="text-xs text-gray-600">Correct</div>
            <div className="text-2xl font-bold text-green-600">{correctCount}</div>
          </div>
          <div>
            <div className="text-xs text-gray-600">Submitted</div>
            <div className="text-sm text-gray-900">{sectionData.submittedAt}</div>
          </div>
          <div>
            <div className="text-xs text-gray-600">Time Spent</div>
            <div className="text-sm text-gray-900">{sectionData.timeSpent}</div>
          </div>
        </div>
      </div>

      {/* Questions/Tasks */}
      <div className="p-6 max-h-96 overflow-y-auto">
        <div className="space-y-3">
          {questions.map((q) => {
            const answer = sectionData.answers[q];
            const mark = localMarks[q];
            
            return (
              <div key={q} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-700 mb-1">
                      {section === 'writing' ? `Task ${q}` : `Question ${q}`}
                    </div>
                    <div className="text-gray-900 bg-gray-50 p-2 rounded">
                      {answer || <span className="text-gray-400 italic">Not answered</span>}
                    </div>
                  </div>
                  
                  {!isReadOnly && section !== 'writing' && (
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => handleMarkChange(q, mark === 'correct' ? null : 'correct')}
                        className={`p-2 rounded-lg transition-colors ${
                          mark === 'correct'
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-200 text-gray-600 hover:bg-green-100'
                        }`}
                      >
                        <CheckIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleMarkChange(q, mark === 'incorrect' ? null : 'incorrect')}
                        className={`p-2 rounded-lg transition-colors ${
                          mark === 'incorrect'
                            ? 'bg-red-500 text-white'
                            : 'bg-gray-200 text-gray-600 hover:bg-red-100'
                        }`}
                      >
                        <XIcon className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Band Score Input (for Writing) or Auto-calculated Display */}
      <div className="border-t border-gray-200 bg-gray-50 p-6">
        {section === 'writing' ? (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Writing Band Score (0-9, with .5)
            </label>
            <div className="flex items-center gap-4">
              <input
                type="number"
                min="0"
                max="9"
                step="0.5"
                value={manualBandScore}
                onChange={(e) => setManualBandScore(e.target.value)}
                disabled={isReadOnly}
                className="w-32 px-4 py-2 border border-gray-300 rounded-lg text-lg font-bold"
                placeholder="0.0"
              />
              <button
                onClick={handleSaveBand}
                disabled={isReadOnly}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                Save Band Score
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Assessment Criteria: Task Achievement, Coherence & Cohesion, Lexical Resource, Grammatical Range & Accuracy
            </p>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600 mb-1">Auto-calculated Band Score</div>
              <div className="text-3xl font-bold text-blue-600">
                {autoCalculatedBand?.toFixed(1) || '--'}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Based on {correctCount} correct answers out of 40
              </div>
            </div>
            <button
              onClick={handleSaveBand}
              disabled={isReadOnly || autoCalculatedBand === null}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              Save Band Score
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
```

#### Task 3.2: Create Speaking Marks Input Component
- **File**: Create `/app/src/components/SpeakingMarksInput.tsx`

```typescript
import React, { useState } from 'react';
import { Mic, AlertCircle } from 'lucide-react';
import { SPEAKING_CRITERIA } from '../utils/bandScoreConversion';

interface SpeakingMarksInputProps {
  currentScore?: number;
  onSave: (score: number) => void;
  isReadOnly?: boolean;
  isMandatory?: boolean;
}

export function SpeakingMarksInput({
  currentScore,
  onSave,
  isReadOnly,
  isMandatory
}: SpeakingMarksInputProps) {
  const [speakingScore, setSpeakingScore] = useState<string>(
    currentScore?.toString() || ''
  );
  const [error, setError] = useState<string>('');

  const handleSave = () => {
    const score = parseFloat(speakingScore);
    
    if (isNaN(score) || score < 0 || score > 9) {
      setError('Please enter a valid band score between 0 and 9');
      return;
    }
    
    // Check if it's in 0.5 increments
    if ((score * 2) % 1 !== 0) {
      setError('Band score must be in 0.5 increments (e.g., 6.0, 6.5, 7.0)');
      return;
    }
    
    setError('');
    onSave(score);
  };

  return (
    <div className="bg-white rounded-lg border-2 border-purple-200 shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
          <Mic className="w-6 h-6 text-purple-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900">Speaking Band Score</h3>
          {isMandatory && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              Required before publishing results
            </p>
          )}
        </div>
      </div>

      {/* Assessment Criteria */}
      <div className="bg-purple-50 rounded-lg p-4 mb-4">
        <h4 className="text-sm font-semibold text-gray-900 mb-2">Assessment Criteria:</h4>
        <ul className="text-sm text-gray-700 space-y-1">
          {SPEAKING_CRITERIA.map((criterion, index) => (
            <li key={index} className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
              {criterion}
            </li>
          ))}
        </ul>
      </div>

      {/* Band Score Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Band Score (0-9, with .5 increments)
        </label>
        <div className="flex items-center gap-4">
          <input
            type="number"
            min="0"
            max="9"
            step="0.5"
            value={speakingScore}
            onChange={(e) => {
              setSpeakingScore(e.target.value);
              setError('');
            }}
            disabled={isReadOnly}
            className="w-32 px-4 py-3 border-2 border-gray-300 rounded-lg text-2xl font-bold text-center focus:border-purple-500 focus:outline-none"
            placeholder="0.0"
            data-testid="speaking-score-input"
          />
          <button
            onClick={handleSave}
            disabled={isReadOnly || !speakingScore}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            data-testid="save-speaking-score-button"
          >
            Save Speaking Score
          </button>
        </div>
        
        {error && (
          <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {error}
          </p>
        )}
        
        {currentScore !== undefined && (
          <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
            <span className="font-semibold">Saved:</span> Band {currentScore.toFixed(1)}
          </p>
        )}
      </div>
    </div>
  );
}
```

#### Task 3.3: Update SubmissionsPage for Mock Tests
- **File**: `/app/src/pages/admin/SubmissionsPage.tsx`
- **Location**: Inside submission detail view (when expanded)
- **Changes**: Add section slides and Speaking input

```typescript
// Add state for section navigation
const [currentSectionSlide, setCurrentSectionSlide] = useState<'listening' | 'reading' | 'writing'>('listening');

// Inside the expanded submission detail (replace existing marking interface for mock tests)
{expandedId === submission.id && submission.testType === 'mock' && (
  <tr>
    <td colSpan={7} className="bg-gray-50 p-6">
      {/* Section Navigation Tabs */}
      <div className="flex items-center gap-4 mb-6 border-b border-gray-300">
        <button
          onClick={() => setCurrentSectionSlide('listening')}
          className={`px-6 py-3 font-medium transition-colors ${
            currentSectionSlide === 'listening'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          🎧 Listening
        </button>
        <button
          onClick={() => setCurrentSectionSlide('reading')}
          className={`px-6 py-3 font-medium transition-colors ${
            currentSectionSlide === 'reading'
              ? 'border-b-2 border-green-500 text-green-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          📖 Reading
        </button>
        <button
          onClick={() => setCurrentSectionSlide('writing')}
          className={`px-6 py-3 font-medium transition-colors ${
            currentSectionSlide === 'writing'
              ? 'border-b-2 border-orange-500 text-orange-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          ✍️ Writing
        </button>
      </div>

      {/* Current Section Card */}
      <div className="mb-6">
        {submission.sectionSubmissions?.[currentSectionSlide] && (
          <SectionSubmissionCard
            section={currentSectionSlide}
            sectionData={submission.sectionSubmissions[currentSectionSlide]}
            onMarkQuestion={(qNum, mark) => handleMarkQuestion(submission.id, qNum, mark)}
            onSaveBandScore={(band) => handleSaveSectionBandScore(submission.id, currentSectionSlide, band)}
            currentBandScore={submission.sectionScores?.[currentSectionSlide]}
            isReadOnly={submission.resultPublished}
          />
        )}
      </div>

      {/* Speaking Marks Input */}
      <div className="mb-6">
        <SpeakingMarksInput
          currentScore={submission.sectionScores?.speaking}
          onSave={(score) => handleSaveSectionBandScore(submission.id, 'speaking', score)}
          isReadOnly={submission.resultPublished}
          isMandatory={!submission.resultPublished}
        />
      </div>

      {/* Overall Band Score Display */}
      {submission.overallBand !== undefined && (
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm opacity-90 mb-1">Overall IELTS Band Score</div>
              <div className="text-6xl font-bold">{submission.overallBand.toFixed(1)}</div>
            </div>
            <div className="text-right">
              <div className="text-sm opacity-90">Section Scores</div>
              <div className="text-lg font-medium">
                L: {submission.sectionScores?.listening?.toFixed(1) || '--'} | 
                R: {submission.sectionScores?.reading?.toFixed(1) || '--'} | 
                W: {submission.sectionScores?.writing?.toFixed(1) || '--'} | 
                S: {submission.sectionScores?.speaking?.toFixed(1) || '--'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Publish Button */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          {!submission.sectionScores?.speaking && (
            <span className="flex items-center gap-2 text-red-600">
              <AlertCircle className="w-4 h-4" />
              Speaking score required before publishing
            </span>
          )}
        </div>
        <button
          onClick={() => handlePublishResult(submission.id)}
          disabled={
            submission.resultPublished || 
            !submission.sectionScores?.listening ||
            !submission.sectionScores?.reading ||
            !submission.sectionScores?.writing ||
            !submission.sectionScores?.speaking
          }
          className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          data-testid="publish-result-button"
        >
          {submission.resultPublished ? '✓ Result Published' : 'Publish Result'}
        </button>
      </div>
    </td>
  </tr>
)}
```

#### Task 3.4: Add Handler Methods
- **File**: `/app/src/pages/admin/SubmissionsPage.tsx`
- **Add methods**:

```typescript
const handleSaveSectionBandScore = async (
  submissionId: string,
  section: 'listening' | 'reading' | 'writing' | 'speaking',
  bandScore: number
) => {
  const success = await storage.saveSectionBandScore(submissionId, section, bandScore);
  
  if (success) {
    // Recalculate overall band if all four sections have scores
    await storage.calculateAndSaveOverallBand(submissionId);
    await loadSubmissions();
  }
};
```

---

### **PHASE 4: Results Display** (2-3 hours)

#### Task 4.1: Update Student Dashboard Results Display
- **File**: `/app/src/pages/student/StudentDashboard.tsx`
- **Location**: Results table (lines 278-365)
- **Changes**: Add detailed score display for mock tests

```typescript
// Update the Score column in results table
<td className="px-6 py-4 whitespace-nowrap">
  {submission.resultPublished ? (
    submission.testType === 'mock' && submission.overallBand ? (
      <div className="text-left">
        <div className="text-2xl font-bold text-blue-600 mb-1">
          {submission.overallBand.toFixed(1)}
        </div>
        <div className="text-xs text-gray-600 space-y-0.5">
          <div>L: {submission.sectionScores?.listening?.toFixed(1) || '--'}</div>
          <div>R: {submission.sectionScores?.reading?.toFixed(1) || '--'}</div>
          <div>W: {submission.sectionScores?.writing?.toFixed(1) || '--'}</div>
          <div>S: {submission.sectionScores?.speaking?.toFixed(1) || '--'}</div>
        </div>
      </div>
    ) : submission.manualScore ? (
      <div className="text-lg font-bold text-green-600">
        {submission.manualScore}%
      </div>
    ) : (
      <span className="text-gray-400">--</span>
    )
  ) : (
    <span className="text-gray-400">--</span>
  )}
</td>
```

#### Task 4.2: Create Detailed Results View Page
- **File**: Create `/app/src/pages/student/ResultDetailPage.tsx`
- **Purpose**: Full-page detailed results view

```typescript
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Award, TrendingUp } from 'lucide-react';
import { storage, ExamSubmission } from '../../utils/storage';

export function ResultDetailPage() {
  const { submissionId } = useParams<{ submissionId: string }>();
  const navigate = useNavigate();
  const [submission, setSubmission] = useState<ExamSubmission | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSubmission();
  }, [submissionId]);

  const loadSubmission = async () => {
    if (!submissionId) return;
    
    const submissions = await storage.getSubmissions();
    const found = submissions.find(s => s.id === submissionId);
    setSubmission(found || null);
    setIsLoading(false);
  };

  if (isLoading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>;
  }

  if (!submission || !submission.resultPublished) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Result Not Available</h2>
        <p className="text-gray-600 mb-4">This result has not been published yet.</p>
        <button
          onClick={() => navigate('/student/dashboard')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Back to Dashboard
        </button>
      </div>
    </div>;
  }

  const isMockTest = submission.testType === 'mock' && submission.overallBand !== undefined;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <button
            onClick={() => navigate('/student/dashboard')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* Overall Score Card */}
        {isMockTest ? (
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl shadow-2xl p-8 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Award className="w-8 h-8" />
                  <h1 className="text-3xl font-bold">IELTS Mock Test Result</h1>
                </div>
                <p className="text-blue-100">Exam Code: {submission.examCode}</p>
                <p className="text-blue-100">Submitted: {new Date(submission.submittedAt).toLocaleDateString()}</p>
              </div>
              <div className="text-center">
                <div className="text-sm opacity-90 mb-2">Overall Band Score</div>
                <div className="text-8xl font-bold">{submission.overallBand?.toFixed(1)}</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Exam Result</h1>
            <div className="flex items-center gap-4">
              <div>
                <p className="text-gray-600">Score</p>
                <p className="text-4xl font-bold text-blue-600">{submission.manualScore}%</p>
              </div>
            </div>
          </div>
        )}

        {/* Section Scores (Mock Test) */}
        {isMockTest && submission.sectionScores && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🎧</span>
                <h3 className="font-semibold text-gray-900">Listening</h3>
              </div>
              <div className="text-4xl font-bold text-blue-600">
                {submission.sectionScores.listening?.toFixed(1) || '--'}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">📖</span>
                <h3 className="font-semibold text-gray-900">Reading</h3>
              </div>
              <div className="text-4xl font-bold text-green-600">
                {submission.sectionScores.reading?.toFixed(1) || '--'}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">✍️</span>
                <h3 className="font-semibold text-gray-900">Writing</h3>
              </div>
              <div className="text-4xl font-bold text-orange-600">
                {submission.sectionScores.writing?.toFixed(1) || '--'}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🎤</span>
                <h3 className="font-semibold text-gray-900">Speaking</h3>
              </div>
              <div className="text-4xl font-bold text-purple-600">
                {submission.sectionScores.speaking?.toFixed(1) || '--'}
              </div>
            </div>
          </div>
        )}

        {/* Submission Details */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Submission Details</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Student Name:</span>
              <span className="ml-2 font-medium text-gray-900">{submission.studentName}</span>
            </div>
            <div>
              <span className="text-gray-600">Student ID:</span>
              <span className="ml-2 font-mono font-medium text-gray-900">{submission.studentId}</span>
            </div>
            <div>
              <span className="text-gray-600">Submitted At:</span>
              <span className="ml-2 font-medium text-gray-900">
                {new Date(submission.submittedAt).toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Time Spent:</span>
              <span className="ml-2 font-medium text-gray-900">{submission.timeSpent}</span>
            </div>
          </div>
        </div>

        {/* Performance Interpretation */}
        {isMockTest && submission.overallBand && (
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
            <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Band Score Interpretation
            </h3>
            <p className="text-gray-700">
              {getB andInterpretation(submission.overallBand)}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

// Helper function
function getBandInterpretation(band: number): string {
  if (band >= 8.5) return "Excellent! You have a very good command of English and can handle complex language effectively.";
  if (band >= 7.5) return "Very Good! You show a high level of operational command with occasional errors.";
  if (band >= 6.5) return "Good! You have generally effective command of the language despite some inaccuracies.";
  if (band >= 5.5) return "Competent! You have partial command of the language and can handle overall meaning in most situations.";
  if (band >= 4.5) return "Basic! You have limited ability and may face communication breakdowns.";
  return "Keep practicing! There's room for improvement in your English language skills.";
}
```

---

### **PHASE 5: Testing & Validation** (2-3 hours)

#### Testing Checklist

**Student Flow Testing:**
- [ ] Section order enforced (L → R → W)
- [ ] Individual timers work correctly
- [ ] Timer shows 00:00 when expired
- [ ] Warning banner appears when time expires
- [ ] Can still submit after time expires
- [ ] Submit button appears at end of each section
- [ ] Section locks after submission (view-only)
- [ ] "Section Submitted" indicator shows
- [ ] Cannot edit locked sections
- [ ] Final submission creates proper data structure

**Teacher Marking Testing:**
- [ ] Three section tabs visible (L, R, W)
- [ ] Can switch between sections
- [ ] Section data displays correctly
- [ ] Marking interface works for L & R
- [ ] Band scores auto-calculate for L & R
- [ ] Manual band input works for Writing
- [ ] Speaking marks input appears
- [ ] Speaking score validation works (0-9, .5 increments)
- [ ] Cannot publish without Speaking marks
- [ ] Overall band calculates correctly
- [ ] Rounding works properly (.25 → .5, .75 → .0)

**Results Display Testing:**
- [ ] Student dashboard shows overall band
- [ ] Student dashboard shows section scores
- [ ] Detailed results page renders correctly
- [ ] Band interpretation displays
- [ ] Published status shows correctly

**Edge Cases:**
- [ ] Partial submissions handled
- [ ] Missing sections handled
- [ ] Invalid band scores rejected
- [ ] Backward compatibility with partial tests maintained

---

## 📁 File Summary

### New Files
1. `/app/src/utils/bandScoreConversion.ts` - Conversion tables & helpers
2. `/app/src/components/SectionSubmissionCard.tsx` - Section marking card
3. `/app/src/components/SpeakingMarksInput.tsx` - Speaking marks input
4. `/app/src/pages/student/ResultDetailPage.tsx` - Detailed results view

### Modified Files
1. `/app/src/pages/ExamPage.tsx` - Student exam flow updates
2. `/app/src/pages/admin/SubmissionsPage.tsx` - Teacher marking interface
3. `/app/src/pages/student/StudentDashboard.tsx` - Results display
4. `/app/src/utils/storage.ts` - Data structure & methods
5. `/app/src/services/examSessionService.ts` - Session management (if needed)

---

## 🚀 Implementation Timeline

| Phase | Tasks | Estimated Time | Status |
|-------|-------|---------------|--------|
| Phase 1 | Data structures & utilities | 1-2 hours | ⏳ Ready |
| Phase 2 | Student exam flow | 3-4 hours | ⏳ Ready |
| Phase 3 | Teacher marking | 4-5 hours | ⏳ Ready |
| Phase 4 | Results display | 2-3 hours | ⏳ Ready |
| Phase 5 | Testing | 2-3 hours | ⏳ Ready |
| **Total** | | **12-17 hours** | |

---

## ✅ Success Criteria

### Must Have:
1. ✅ Fixed section order enforced
2. ✅ Manual submission only (no auto-advance)
3. ✅ Section locking after submission
4. ✅ All three sections in single submission view
5. ✅ Speaking marks mandatory before publishing
6. ✅ Overall band auto-calculated correctly
7. ✅ Backward compatibility with partial tests

### Nice to Have:
- Export mock test results to Excel
- Performance analytics dashboard
- Band score improvement tracking
- Email notifications for published results

---

## 🔒 Backward Compatibility

**Preserved Features:**
- Partial test system remains unchanged
- Existing submission data structure compatible
- Current marking interface for partial tests unaffected
- Teacher role permissions maintained

**Migration Strategy:**
- New fields are optional
- Old submissions display correctly
- No database migration required
- Gradual rollout possible

---

## 📝 Notes

1. **Band Score Rounding**: Implemented exactly per IELTS rules
2. **Speaking Integration**: Clean, simple interface for teachers
3. **Section Locking**: Implemented as view-only, not hidden
4. **Time Management**: Warning but no hard stop
5. **Data Structure**: Flexible for future enhancements

---

## 🎯 Next Steps

After reviewing this plan:
1. Confirm all requirements are captured
2. Get approval on UI/UX approach
3. Start with Phase 1 implementation
4. Regular progress checkpoints
5. Testing after each phase

---

**Ready to proceed with implementation?**
