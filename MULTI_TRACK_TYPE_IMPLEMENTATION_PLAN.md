# Multi-Track Type Implementation Plan
## Reading and Writing Track Types Addition

---

## 📋 Overview

This document outlines the comprehensive plan to expand the Track Management system from supporting only Listening tracks to supporting three track types: **Listening**, **Reading**, and **Writing**.

---

## 🎯 Requirements Summary

### Current State
- System supports only **Listening tracks** (4 tracks available)
- Tracks include audio upload/playback functionality
- Single track selection for exam creation

### Target State
- Support **three track types**: Listening, Reading, Writing
- **Reading tracks**: All IELTS question types (multiple choice, True/False/Not Given, Yes/No/Not Given, matching headings, sentence completion, summary/note completion)
- **Writing tracks**: Task-based with text input areas (Task 1 & Task 2), admin can add via prompt description
- **Track Management UI**: Tabbed interface with three sections
- **Exam Creation**: Two modes
  - **Partial Test**: Select ONE track from any single type
  - **Mock Test**: Select ONE track from EACH type (1 Listening + 1 Reading + 1 Writing)
- Time selection system remains unchanged

---

## 📐 Architecture Design

### 1. Data Structure Changes

#### Track Interface Enhancement
```typescript
export interface Track {
  id: string;
  name: string;
  shortName: string;
  description: string;
  duration: number;
  totalQuestions: number;
  trackType: 'listening' | 'reading' | 'writing';  // NEW FIELD
  audioURL: string | null;  // Only for listening tracks
  sections: Section[];
}
```

#### Exam Session Enhancement
```typescript
export interface ExamSession {
  // ... existing fields
  testType: 'partial' | 'mock';  // NEW FIELD
  selectedTracks: {
    listening?: string;  // track ID
    reading?: string;    // track ID
    writing?: string;    // track ID
  };  // NEW FIELD (replaces single trackId)
}
```

### 2. Question Type Support

#### Reading Track Question Types
- Multiple Choice (Single Answer)
- Multiple Choice (Multiple Answers)
- True/False/Not Given
- Yes/No/Not Given
- Matching Headings
- Sentence Completion
- Summary/Note Completion
- Table Gap Filling
- Diagram Labeling

#### Writing Track Structure
```typescript
export interface WritingSection {
  taskNumber: 1 | 2;
  title: string;
  prompt: string;
  minWords: number;
  maxWords?: number;
  duration: number;
}
```

---

## 🔧 Implementation Phases

### **Phase 1: Data Structure & Track Type System**
**Duration**: Setup foundation for multi-track types

#### Tasks:
1. ✅ Update Track interface with `trackType` field
2. ✅ Create `track-reading-1.ts` with sample Reading track
3. ✅ Create `track-writing-1.ts` with sample Writing track
4. ✅ Update existing Listening tracks to include `trackType: 'listening'`
5. ✅ Update `tracks.ts` registry to export tracks by type
6. ✅ Create helper functions:
   - `getTracksByType(type: 'listening' | 'reading' | 'writing')`
   - `getAllTracksByType()`

#### Files to Modify:
- `/app/src/data/track1.ts` (Update Track interface)
- `/app/src/data/track4.ts`, `track5.ts`, `track6.ts` (Add trackType)
- `/app/src/data/track-reading-1.ts` (NEW)
- `/app/src/data/track-writing-1.ts` (NEW)
- `/app/src/data/tracks.ts` (Update registry and helpers)

---

### **Phase 2: Track Management UI Enhancement**
**Duration**: Add tabbed interface for track type selection

#### Tasks:
1. ✅ Add tab navigation (Listening, Reading, Writing)
2. ✅ Filter tracks by selected tab type
3. ✅ Show/hide audio management based on track type
4. ✅ Update stats to show counts per track type
5. ✅ Add appropriate icons and visual indicators
6. ✅ Update info messages for different track types

#### UI Design:
```
┌─────────────────────────────────────────────────┐
│  Track Management                               │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐          │
│  │Listening│ │ Reading │ │ Writing │          │
│  └─────────┘ └─────────┘ └─────────┘          │
│                                                 │
│  ╔═══════════════════════════════════════════╗ │
│  ║ [Track Card]                              ║ │
│  ║   - Track Info                            ║ │
│  ║   - Question Count                        ║ │
│  ║   - Duration                              ║ │
│  ║   - Audio Management (Listening only)     ║ │
│  ╚═══════════════════════════════════════════╝ │
└─────────────────────────────────────────────────┘
```

#### Files to Modify:
- `/app/src/components/TrackManagement.tsx`

---

### **Phase 3: Exam Creation Enhancement**
**Duration**: Implement test type selection and conditional track selection

#### Tasks:
1. ✅ Add Test Type selection radio buttons (Partial Test / Mock Test)
2. ✅ Conditional track selection UI based on test type:
   - **Partial Test**: Single dropdown with ALL tracks (grouped by type)
   - **Mock Test**: Three separate dropdowns (Listening, Reading, Writing)
3. ✅ Update validation logic
4. ✅ Update exam code generation to handle multiple tracks
5. ✅ Update exam session creation
6. ✅ Calculate total duration for mock tests

#### UI Design:
```
┌─────────────────────────────────────────────────┐
│  Create Exam Session                            │
│                                                 │
│  Test Type:                                     │
│  ○ Partial Test    ● Mock Test                 │
│                                                 │
│  [If Mock Test Selected]                        │
│  ┌─────────────────────────────────────────┐  │
│  │ Listening Track: [Select Track ▼]       │  │
│  │ Reading Track:   [Select Track ▼]       │  │
│  │ Writing Track:   [Select Track ▼]       │  │
│  └─────────────────────────────────────────┘  │
│                                                 │
│  [If Partial Test Selected]                     │
│  ┌─────────────────────────────────────────┐  │
│  │ Select Track:    [All Tracks ▼]         │  │
│  │                  - Listening             │  │
│  │                    • Track 1             │  │
│  │                    • Track 2             │  │
│  │                  - Reading               │  │
│  │                    • Track 1             │  │
│  │                  - Writing               │  │
│  │                    • Track 1             │  │
│  └─────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

#### Files to Modify:
- `/app/src/pages/admin/ExamControlPage.tsx`
- `/app/src/services/examSessionService.ts`

---

### **Phase 4: Exam Taking Experience**
**Duration**: Update exam interface for different track types

#### Tasks:
1. ✅ Update ExamPage to handle multiple tracks in mock test
2. ✅ Show/hide audio player based on track type
3. ✅ Add track navigation for mock tests (Listening → Reading → Writing)
4. ✅ Implement text input areas for Writing tracks
5. ✅ Update timer logic for multi-track mock tests
6. ✅ Update submission handling
7. ✅ Add visual indicators for track type

#### UI Components:
- Conditional audio player (only for Listening)
- Text editors for Writing tasks (with word count)
- Track progress indicator for mock tests
- Auto-transition between tracks or manual navigation

#### Files to Modify:
- `/app/src/pages/ExamPage.tsx`
- `/app/src/components/ExamHeader.tsx`
- `/app/src/components/ExamAudioPlayer.tsx`
- Create `/app/src/components/WritingTaskInput.tsx` (NEW)
- Create `/app/src/components/ReadingQuestionRenderer.tsx` (NEW)

---

### **Phase 5: Question Rendering Components**
**Duration**: Create specific renderers for Reading and Writing

#### Tasks:
1. ✅ Create reading question type renderers
2. ✅ Create writing task input component with word counter
3. ✅ Update question renderer to route to appropriate component
4. ✅ Add validation for writing word count

#### Files to Create:
- `/app/src/components/questions/TrueFalseNotGiven.tsx`
- `/app/src/components/questions/YesNoNotGiven.tsx`
- `/app/src/components/questions/MatchingHeadings.tsx`
- `/app/src/components/questions/WritingTaskInput.tsx`

---

### **Phase 6: Testing & Validation**
**Duration**: Comprehensive testing

#### Tasks:
1. ✅ Test track management with all three types
2. ✅ Test partial test creation and execution
3. ✅ Test mock test creation and execution
4. ✅ Test audio functionality (only for listening)
5. ✅ Test writing task submission with word count
6. ✅ Test navigation between tracks in mock test
7. ✅ Verify data storage and submission structure

---

## 📁 File Structure

```
/app/src/
├── data/
│   ├── track1.ts (Listening - Updated)
│   ├── track4.ts (Listening - Updated)
│   ├── track5.ts (Listening - Updated)
│   ├── track6.ts (Listening - Updated)
│   ├── track-reading-1.ts (NEW)
│   ├── track-writing-1.ts (NEW)
│   ├── tracks.ts (Updated)
│   └── examData.ts (Updated)
│
├── components/
│   ├── TrackManagement.tsx (Updated)
│   ├── WritingTaskInput.tsx (NEW)
│   ├── ReadingQuestionRenderer.tsx (NEW)
│   └── questions/
│       ├── TrueFalseNotGiven.tsx (NEW)
│       ├── YesNoNotGiven.tsx (NEW)
│       └── MatchingHeadings.tsx (NEW)
│
├── pages/
│   ├── ExamPage.tsx (Updated)
│   └── admin/
│       └── ExamControlPage.tsx (Updated)
│
└── services/
    └── examSessionService.ts (Updated)
```

---

## 🔄 Migration Strategy

### Backward Compatibility
- Existing Listening tracks remain functional
- Existing exam sessions continue to work
- Audio functionality preserved for Listening tracks

### Data Migration
- Add `trackType: 'listening'` to all existing tracks
- Update exam sessions to use new structure
- No database migration required (Firebase flexibility)

---

## ✅ Testing Checklist

### Track Management
- [ ] Can view Listening tracks in Listening tab
- [ ] Can view Reading tracks in Reading tab
- [ ] Can view Writing tracks in Writing tab
- [ ] Audio management only shows for Listening tracks
- [ ] Stats update correctly per track type

### Exam Creation - Partial Test
- [ ] Can select any single track from any type
- [ ] Exam code generates correctly
- [ ] Exam session saves with correct structure
- [ ] Duration calculated correctly

### Exam Creation - Mock Test
- [ ] Must select one track from each type
- [ ] Validation prevents missing tracks
- [ ] Total duration calculated correctly
- [ ] Exam code includes all track types

### Exam Taking - Partial Test
- [ ] Audio player shows only for Listening
- [ ] Questions render correctly
- [ ] Timer works correctly
- [ ] Submission saves correctly

### Exam Taking - Mock Test
- [ ] Can navigate between tracks
- [ ] Audio player shows only for Listening section
- [ ] Writing tasks show text editors with word count
- [ ] Timer tracks total time across all tracks
- [ ] Submission includes all track responses

---

## 🎨 UI/UX Considerations

### Visual Indicators
- **Listening**: 🎧 Headphone icon, Blue color
- **Reading**: 📖 Book icon, Green color
- **Writing**: ✍️ Pen icon, Orange color

### Color Scheme
```css
Listening: #3B82F6 (blue-600)
Reading:   #10B981 (green-600)
Writing:   #F59E0B (orange-600)
```

### Icons (Lucide React)
- Listening: `Headphones`
- Reading: `BookOpen`
- Writing: `PenTool` or `Edit3`

---

## 🚀 Deployment Notes

1. No database migration required (Firebase schema-less)
2. Frontend-only changes
3. Deploy during low-traffic period
4. Monitor for any submission issues
5. Test all exam types post-deployment

---

## 📝 Future Enhancements

- Bulk track upload via CSV/JSON
- Track cloning/templating
- Advanced writing task configurations
- Reading passage management
- Question bank system
- Track versioning
- Performance analytics per track type

---

## 🔗 Dependencies

- No new packages required
- Uses existing Firebase structure
- Uses existing Lucide icons
- Uses existing Tailwind CSS classes

---

**Plan Created**: December 2024
**Status**: Ready for Implementation
**Estimated Effort**: 6 Phases, ~2-3 days of development
