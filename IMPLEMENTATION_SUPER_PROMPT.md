# 🚀 SUPER PROMPT: Multi-Track Exam System Implementation

## 📌 Context & Overview

You are implementing a **Multi-Track Exam System** for an IELTS Listening Exam platform. Currently, the system supports only ONE hardcoded exam track. Your task is to transform it into a dynamic system where:

1. **Admins** can create, edit, delete, and manage multiple question tracks
2. **Each track** can have optional audio (file upload or URL)
3. **Admin** selects which track to run from a list view
4. **Only ONE track** can be active at a time
5. **Students** see the dynamically loaded active track with its audio

---

## 🎯 Main Objectives

### Phase 1: Backend Foundation (Database & Services)
Create the backend infrastructure for multi-track support using Firebase.

### Phase 2: Admin Track Management
Build the admin interface for CRUD operations on tracks.

### Phase 3: Exam Control Enhancement
Update exam controller to select and start specific tracks.

### Phase 4: Student Interface Update
Make student exam page dynamically load the active track.

---

## 📂 Current System Architecture

**Technology Stack**:
- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Backend**: Firebase (Realtime Database + Storage)
- **Authentication**: Admin password-based (already exists)

**Key Files**:
```
/app/
├── src/
│   ├── pages/
│   │   ├── HomePage.tsx          # Student login + waiting
│   │   ├── ExamPage.tsx          # Student exam interface
│   │   └── AdminDashboard.tsx    # Admin panel with tabs
│   ├── components/
│   │   ├── ExamHeader.tsx        # Header with logo, timer, audio
│   │   ├── ExamController.tsx    # Exam start/stop controls
│   │   ├── AudioManager.tsx      # Audio upload management
│   │   └── [QuestionComponents]  # 4 question type components
│   ├── services/
│   │   └── audioService.ts       # Audio CRUD operations
│   ├── data/
│   │   └── examData.ts           # HARDCODED exam questions ⚠️
│   ├── utils/
│   │   └── storage.ts            # LocalStorage for submissions
│   └── firebase.ts               # Firebase config
```

**Current Firebase Structure**:
```
/exam/
  ├── status/
  │   ├── isStarted: boolean
  │   ├── startTime: string
  │   └── endTime: string
  ├── audio/
  │   ├── url: string
  │   ├── fileName: string
  │   └── uploadedAt: string
```

**What Needs to Change**:
- Move hardcoded `examData.ts` to Firebase `/tracks/`
- Create track management service
- Add track selection to ExamController
- Make ExamPage fetch active track dynamically
- Link audio to specific tracks (not global)

---

## 🗂️ New Firebase Database Structure

```javascript
/tracks/
  ├── {trackId}/ (e.g., "track-001")
  │   ├── id: string
  │   ├── name: string (e.g., "IELTS Listening Test 1")
  │   ├── description: string
  │   ├── duration: number (minutes)
  │   ├── totalQuestions: number (e.g., 40)
  │   ├── hasAudio: boolean
  │   ├── audioURL: string | null
  │   ├── audioFileName: string | null
  │   ├── status: "published" | "draft"
  │   ├── createdAt: string (ISO timestamp)
  │   ├── updatedAt: string (ISO timestamp)
  │   └── sections: Section[] (array of sections with questions)

/exam/status/
  ├── isStarted: boolean
  ├── activeTrackId: string | null
  ├── trackName: string
  ├── startTime: string
  ├── endTime: string
  ├── duration: number
  └── startedBy: string

/submissions/
  ├── {submissionId}/
  │   ├── trackId: string ⭐ NEW
  │   ├── trackName: string
  │   ├── studentId: string
  │   ├── studentName: string
  │   ├── answers: Record<number, string>
  │   └── ... (existing fields)
```

---

## 🛠️ Implementation Steps

### 🔷 STEP 1: Create Track Service

**File**: `/app/src/services/trackService.ts`

**Purpose**: Handle all track-related Firebase operations

**Required Functions**:
```typescript
export interface Track {
  id: string;
  name: string;
  description: string;
  duration: number;
  totalQuestions: number;
  hasAudio: boolean;
  audioURL: string | null;
  audioFileName: string | null;
  status: 'published' | 'draft';
  createdAt: string;
  updatedAt: string;
  sections: Section[]; // from examData.ts types
}

export const trackService = {
  // Create new track
  async createTrack(track: Omit<Track, 'id' | 'createdAt' | 'updatedAt'>): Promise<string>
  
  // Get all tracks
  async getAllTracks(): Promise<Track[]>
  
  // Get single track by ID
  async getTrack(trackId: string): Promise<Track | null>
  
  // Get active track (currently running exam)
  async getActiveTrack(): Promise<Track | null>
  
  // Update track
  async updateTrack(trackId: string, updates: Partial<Track>): Promise<void>
  
  // Delete track
  async deleteTrack(trackId: string): Promise<void>
  
  // Upload audio for track
  async uploadTrackAudio(trackId: string, file: File): Promise<string>
  
  // Set audio URL for track (external URL)
  async setTrackAudioURL(trackId: string, url: string): Promise<void>
  
  // Delete track audio
  async deleteTrackAudio(trackId: string): Promise<void>
}
```

**Implementation Notes**:
- Use Firebase Realtime Database `ref(database, 'tracks')`
- Generate unique track IDs using `Date.now()` or Firebase push keys
- Store audio in Firebase Storage under `audio/{trackId}/`
- Validate track data before saving
- Handle errors gracefully

---

### 🔷 STEP 2: Migrate Existing Data

**File**: Create `/app/src/utils/migrateData.ts`

**Purpose**: One-time script to move hardcoded exam to Firebase

```typescript
import { examData } from '../data/examData';
import { trackService } from '../services/trackService';

export async function migrateExistingExam() {
  const firstTrack = {
    name: 'P-L-2 Application for membership',
    description: 'IELTS Listening Practice Test',
    duration: 60,
    totalQuestions: 40,
    hasAudio: true,
    audioURL: null, // Will be fetched from current exam/audio
    audioFileName: null,
    status: 'published' as const,
    sections: examData
  };
  
  const trackId = await trackService.createTrack(firstTrack);
  console.log('Migrated track:', trackId);
  return trackId;
}
```

**Call this function ONCE from AdminDashboard on a button click or automatically on first load**

---

### 🔷 STEP 3: Create Track Management Components

#### 3.1 Track List Component

**File**: `/app/src/components/TrackList.tsx`

**Purpose**: Display all tracks in a grid/list with actions

**Features**:
- Fetch and display all tracks
- Show track cards with:
  - Track name
  - Duration
  - Total questions
  - Audio status (🎵 or 📝)
  - Created date
  - Active/Inactive badge
- Actions per track:
  - Edit button
  - Delete button (with confirmation)
  - View details
- "Create New Track" button

**UI Structure**:
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {tracks.map(track => (
    <TrackCard 
      key={track.id}
      track={track}
      isActive={activeTrackId === track.id}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onSelect={handleSelect}
    />
  ))}
</div>
```

---

#### 3.2 Track Form Component

**File**: `/app/src/components/TrackForm.tsx`

**Purpose**: Create/Edit track with all details

**Features**:
- Form fields:
  - Track Name (required)
  - Description (optional)
  - Duration in minutes (required)
  - Audio options (radio):
    - Upload file
    - Enter URL
    - No audio
- Section builder (collapsible sections)
- Question builder per section
- Save as draft or publish
- Cancel button

**Sections Management**:
- Allow adding/removing sections
- Each section has:
  - Section number (auto)
  - Title
  - Questions array

**Questions Management**:
- Support all 4 question types:
  1. Table Gap Fill
  2. Multiple Choice
  3. Sentence Completion
  4. Dropdown
- Add/Remove questions
- Reorder questions (optional)

**Validation**:
- Track name required
- At least 1 section
- At least 1 question
- Valid duration (1-300 minutes)

---

#### 3.3 Track Card Component

**File**: `/app/src/components/TrackCard.tsx`

**Purpose**: Individual track display in list

**UI**:
```jsx
<div className="bg-white rounded-lg border p-6 hover:shadow-lg transition">
  <div className="flex items-start justify-between mb-4">
    <div className="flex items-center gap-2">
      {track.hasAudio ? <Music className="w-5 h-5 text-blue-600" /> : <FileText className="w-5 h-5 text-gray-400" />}
      <h3 className="font-bold text-lg">{track.name}</h3>
    </div>
    {isActive && <Badge>Active</Badge>}
  </div>
  
  <p className="text-gray-600 text-sm mb-4">{track.description}</p>
  
  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
    <span><Clock className="w-4 h-4 inline" /> {track.duration} mins</span>
    <span><List className="w-4 h-4 inline" /> {track.totalQuestions} Qs</span>
  </div>
  
  <div className="flex gap-2">
    <button onClick={() => onEdit(track.id)}>Edit</button>
    <button onClick={() => onDelete(track.id)}>Delete</button>
  </div>
</div>
```

---

### 🔷 STEP 4: Update Admin Dashboard

**File**: `/app/src/pages/AdminDashboard.tsx`

**Changes**:
1. Add new tab: "Track Management"
2. Update tab navigation to include 4 tabs:
   - Submissions
   - Track Management ⭐ NEW
   - Audio Management (might deprecate or repurpose)
   - Exam Control

**Tab Structure**:
```jsx
const tabs = [
  { id: 'submissions', label: 'Submissions', icon: CheckCircleIcon },
  { id: 'tracks', label: 'Track Management', icon: LayersIcon }, // NEW
  { id: 'audio', label: 'Audio Management', icon: Music },
  { id: 'exam-control', label: 'Exam Control', icon: Play }
];
```

**Render Track Management**:
```jsx
{activeTab === 'tracks' && <TrackList />}
```

---

### 🔷 STEP 5: Update Exam Controller

**File**: `/app/src/components/ExamController.tsx`

**Current Functionality**:
- Set exam duration
- Set end time
- Start/Stop exam
- Display current exam status

**New Additions**:
1. **Track Selection Dropdown**
   - Fetch all published tracks
   - Display track name in dropdown
   - When selected, auto-fill duration from track

2. **Update Start Exam Logic**
   - Save `activeTrackId` to `/exam/status/`
   - Save `trackName` to `/exam/status/`
   - Prevent starting if another exam is running

3. **Display Currently Running Track**
   - Show track name
   - Show track duration
   - Show time remaining

**UI Structure**:
```jsx
<div className="space-y-6">
  {/* Track Selection */}
  <div>
    <label>Select Track</label>
    <select 
      value={selectedTrackId} 
      onChange={handleTrackSelect}
      disabled={isExamRunning}
    >
      <option value="">-- Select a track --</option>
      {tracks.map(track => (
        <option key={track.id} value={track.id}>
          {track.name} ({track.duration} mins, {track.totalQuestions} Qs)
        </option>
      ))}
    </select>
  </div>
  
  {/* Duration (auto-filled from track) */}
  <div>
    <label>Duration</label>
    <input 
      type="number" 
      value={duration} 
      onChange={handleDurationChange}
      disabled={!selectedTrackId}
    />
  </div>
  
  {/* Start/Stop Buttons */}
  <button 
    onClick={handleStartExam}
    disabled={!selectedTrackId || isExamRunning}
  >
    Start Exam
  </button>
  
  <button 
    onClick={handleStopExam}
    disabled={!isExamRunning}
  >
    Stop Exam
  </button>
  
  {/* Current Status */}
  {isExamRunning && (
    <div className="bg-green-50 p-4 rounded-lg">
      <h3>Exam in Progress</h3>
      <p>Track: {currentTrack?.name}</p>
      <p>Time Remaining: {timeRemaining}</p>
    </div>
  )}
</div>
```

---

### 🔷 STEP 6: Update Student Exam Page

**File**: `/app/src/pages/ExamPage.tsx`

**Current Behavior**:
- Imports hardcoded `examData` from local file
- Fetches global audio from `/exam/audio`

**New Behavior**:
- Fetch active track from Firebase `/exam/status/`
- Get track details from `/tracks/{activeTrackId}/`
- Load track-specific audio
- Render track sections and questions dynamically

**Implementation**:
```typescript
// Remove this line:
// import { examData } from '../data/examData';

// Add state:
const [trackData, setTrackData] = useState<Section[] | null>(null);
const [trackInfo, setTrackInfo] = useState<Track | null>(null);
const [isLoadingTrack, setIsLoadingTrack] = useState(true);

// Fetch active track on mount:
useEffect(() => {
  const fetchActiveTrack = async () => {
    try {
      setIsLoadingTrack(true);
      const track = await trackService.getActiveTrack();
      if (track) {
        setTrackInfo(track);
        setTrackData(track.sections);
        setAudioURL(track.audioURL);
      }
    } catch (error) {
      console.error('Error fetching active track:', error);
    } finally {
      setIsLoadingTrack(false);
    }
  };
  
  fetchActiveTrack();
}, []);

// Use trackData instead of examData:
// Replace all instances of 'examData' with 'trackData'
```

**Loading State**:
```jsx
if (isLoadingTrack || !trackData) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader className="w-12 h-12 animate-spin mx-auto mb-4" />
        <p>Loading exam...</p>
      </div>
    </div>
  );
}
```

---

### 🔷 STEP 7: Update Submission Storage

**File**: `/app/src/utils/storage.ts`

**Changes**:
1. Add `trackId` field to `ExamSubmission` interface ✅ (already there)
2. Update `addSubmission` to include trackId
3. Add filter by track functionality

**New Functions**:
```typescript
getSubmissionsByTrack(trackId: string): ExamSubmission[] {
  const all = this.getSubmissions();
  return all.filter(s => s.trackId === trackId);
}

getTrackStats(trackId: string): {
  totalSubmissions: number;
  averageScore: number;
  completedToday: number;
} {
  const submissions = this.getSubmissionsByTrack(trackId);
  // Calculate stats
}
```

---

### 🔷 STEP 8: UI Polish & Testing

**Responsive Design**:
- Test on mobile, tablet, desktop
- Ensure track cards look good on all screens
- Modal/drawer for track form on mobile

**Error Handling**:
- Show error messages for failed operations
- Validate inputs before submission
- Handle network failures gracefully

**Loading States**:
- Show spinners when fetching tracks
- Disable buttons during operations
- Optimistic updates where possible

**Confirmation Dialogs**:
- Confirm before deleting track
- Warn if exam is running when trying to start another
- Confirm before stopping active exam

---

## 🎨 Design Guidelines

**Color Scheme**:
- Primary: Blue (#3B82F6)
- Success: Green (#10B981)
- Warning: Orange (#F59E0B)
- Danger: Red (#EF4444)
- Gray tones for neutral elements

**Component Styling**:
- Use Tailwind CSS utility classes
- Consistent spacing (p-4, p-6, gap-4)
- Rounded corners (rounded-lg)
- Subtle shadows (shadow-sm, shadow-lg)
- Hover states on interactive elements

**Icons**:
- Use lucide-react icons (already installed)
- Consistent icon sizes (w-4 h-4 for small, w-5 h-5 for medium)

---

## ✅ Acceptance Criteria

**Admin Can**:
- [x] View list of all tracks
- [x] Create new track with sections and questions
- [x] Upload audio file for track OR provide URL OR skip audio
- [x] Edit existing track
- [x] Delete track (with confirmation)
- [x] Select track from dropdown in Exam Control
- [x] Start exam with selected track
- [x] See currently running track info
- [x] Stop exam
- [x] View submissions filtered by track

**Student Can**:
- [x] See correct track name in exam header
- [x] Hear correct audio for the active track
- [x] Answer questions from active track
- [x] Submit exam linked to correct track

**System Ensures**:
- [x] Only ONE exam can run at a time
- [x] Starting exam while another is running shows error
- [x] All data persists in Firebase
- [x] Audio plays correctly for each track
- [x] Submissions linked to correct track
- [x] Mobile responsive

---

## 🚨 Important Notes

1. **Do NOT break existing functionality**:
   - Submissions view must continue working
   - Marking system must work
   - Audio player must work
   - All question types must render correctly

2. **Firebase Paths**:
   - Use consistent naming: `/tracks/`, `/exam/status/`
   - Audio storage: `audio/{trackId}/filename`
   - Never hardcode paths, use constants

3. **Error Handling**:
   - Always wrap Firebase calls in try-catch
   - Show user-friendly error messages
   - Log errors to console for debugging

4. **Performance**:
   - Don't fetch all tracks on every render
   - Use React state properly
   - Minimize Firebase reads

5. **Testing**:
   - Test creating multiple tracks
   - Test starting/stopping exams
   - Test with and without audio
   - Test student exam loading
   - Test submission linking

---

## 📋 Implementation Checklist

### Phase 1: Backend
- [ ] Create `trackService.ts` with all CRUD functions
- [ ] Create `migrateData.ts` for data migration
- [ ] Test all Firebase operations in console
- [ ] Migrate existing exam to first track

### Phase 2: Track Management
- [ ] Create `TrackList.tsx` component
- [ ] Create `TrackCard.tsx` component
- [ ] Create `TrackForm.tsx` component
- [ ] Add Track Management tab to AdminDashboard
- [ ] Test creating/editing/deleting tracks

### Phase 3: Exam Control
- [ ] Update `ExamController.tsx` with track selection
- [ ] Add validation for single active exam
- [ ] Test starting exam with different tracks
- [ ] Test stop exam functionality

### Phase 4: Student Interface
- [ ] Update `ExamPage.tsx` to load dynamic track
- [ ] Update `ExamHeader.tsx` if needed
- [ ] Test student sees correct track
- [ ] Test audio plays correctly

### Phase 5: Testing & Polish
- [ ] Test all flows end-to-end
- [ ] Mobile responsive testing
- [ ] Error handling testing
- [ ] Performance optimization
- [ ] Code cleanup

---

## 🎯 Success Metrics

After implementation, you should be able to:
1. Create 3+ different tracks with different questions
2. Start exam with Track 1 → Students see Track 1
3. Stop exam
4. Start exam with Track 2 → Students see Track 2
5. View submissions filtered by track
6. All existing features (marking, results) still work

---

## 💬 Need Help?

If stuck on any step:
1. Check Firebase console for data structure
2. Console.log track data to debug
3. Test each function individually
4. Check browser network tab for Firebase calls
5. Review existing code patterns (ExamController, AudioManager)

---

## 🏁 You're Ready!

This super prompt contains everything needed to implement the multi-track system. Follow the steps sequentially, test as you go, and maintain code quality throughout.

**Good luck! 🚀**
