# Bug Fix: Mock Test Module Transitions Missing Instructions

## Issue Reported
When transitioning from Listening to Reading or Reading to Writing in a mock test, the instruction pages were not showing. The exam would directly jump to the next module without displaying the required instructions.

## Root Cause
The `handleSectionSubmit()` function was directly advancing to the next track without triggering the instruction page display. It was setting:
```typescript
setCurrentTrackIndex(prev => prev + 1);
```

Without also setting:
```typescript
setExamStarted(false);
setShowInstructions(true);
```

## Solution Applied
Modified `/app/src/pages/ExamPage.tsx` in the `handleSectionSubmit()` function (around line 636-642):

**Before:**
```typescript
if (currentTrackIndex < trackDataList.length - 1) {
  console.log('Moving to next track...');
  setCurrentTrackIndex(prev => prev + 1);
  setCurrentSection(0);
  setIsTimeWarning(false);
  setIsTimeCritical(false);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
```

**After:**
```typescript
if (currentTrackIndex < trackDataList.length - 1) {
  console.log('Moving to next track...');
  // Show instructions for the next module
  setExamStarted(false);
  setShowInstructions(true);
  setCurrentTrackIndex(prev => prev + 1);
  setCurrentSection(0);
  setIsTimeWarning(false);
  setIsTimeCritical(false);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
```

## Impact
✅ **Fixed Flow for Mock Tests:**
1. Important Notice → Accept & Continue
2. Listening Instructions → Start Listening Test → Listening Exam
3. Submit Listening → **Reading Instructions** → Start Reading Test → Reading Exam
4. Submit Reading → **Writing Instructions** → Start Writing Test → Writing Exam
5. Submit Writing → Final Submission

## Testing
The fix ensures that:
- Reading instructions appear after Listening section is submitted
- Writing instructions appear after Reading section is submitted
- Each module transition shows proper instructions before starting
- The flow matches the official IELTS exam experience

## Date Fixed
December 31, 2024
