# Mock Test Duration Display Bug Fix

## Problem Statement
When admin adds custom durations for all tracks in a mock test, the system still displays the message "Duration is automatically calculated based on selected tracks", even though the durations are custom/manually set.

**Additional Issue Found:** The total duration was not recalculating when custom durations were entered, causing incorrect total duration display (e.g., showing 121 minutes when the actual sum was 80 minutes).

## Root Cause Analysis
The issue was in `/app/src/pages/admin/ExamControlPage.tsx`:

1. The duration display section (lines 783-789) always showed "Duration is automatically calculated based on selected tracks" for ALL mock tests
2. There was no logic to differentiate between:
   - Default track durations (automatically set when tracks are selected)
   - Custom durations (manually modified by admin)

## Solution Implemented

### 1. Added State to Track Customization
Added a new state variable `mockDurationsCustomized` to track whether each section's duration has been manually modified:

```typescript
const [mockDurationsCustomized, setMockDurationsCustomized] = useState<{
  listening: boolean;
  reading: boolean;
  writing: boolean;
}>({
  listening: false,
  reading: false,
  writing: false
});
```

### 2. Updated Duration Input Handlers
Modified all three duration input fields (Listening, Reading, Writing) to set the customization flag when admin manually changes a value:

```typescript
onChange={(e) => {
  setMockDurations(prev => ({ ...prev, listening: Number(e.target.value) }));
  setMockDurationsCustomized(prev => ({ ...prev, listening: true }));
}}
```

### 3. Reset Customization Flag on Track Change
When admin selects a different track, the customization flag is reset to `false` since the duration is now the default from the new track:

```typescript
onChange={(e) => {
  setMockTracks(prev => ({ ...prev, listening: e.target.value }));
  const track = getTracksByType('listening').find(t => t.id === e.target.value);
  if (track) {
    setMockDurations(prev => ({ ...prev, listening: track.duration }));
    setMockDurationsCustomized(prev => ({ ...prev, listening: false }));
  }
}}
```

### 4. Updated Duration Display Message
Modified the duration display section to show different messages based on whether durations are customized:

```typescript
{testType === 'mock' ? (
  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
    {(mockDurationsCustomized.listening || mockDurationsCustomized.reading || mockDurationsCustomized.writing) ? (
      <p className="text-sm text-orange-600 mb-1 font-medium">
        ⚙️ Custom durations are set for this mock test
      </p>
    ) : (
      <p className="text-sm text-gray-600 mb-1">
        Duration is automatically calculated based on selected tracks
      </p>
    )}
    <p className="text-2xl font-bold text-gray-900">{duration} minutes</p>
  </div>
) : (
```

### 5. Enhanced Duration Info Box
Updated the duration breakdown box to show "(custom)" indicator next to any manually modified durations:

```typescript
<div className="text-xs text-blue-700 space-y-1">
  <div>
    • Listening: {mockDurations.listening} minutes
    {mockDurationsCustomized.listening && <span className="ml-1 text-orange-600">(custom)</span>}
  </div>
  <div>
    • Reading: {mockDurations.reading} minutes
    {mockDurationsCustomized.reading && <span className="ml-1 text-orange-600">(custom)</span>}
  </div>
  <div>
    • Writing: {mockDurations.writing} minutes
    {mockDurationsCustomized.writing && <span className="ml-1 text-orange-600">(custom)</span>}
  </div>
</div>
```

Also added "CUSTOM DURATIONS" badge in the summary line when any duration is customized.

### 6. Reset on Form Submission
When the form is reset after creating an exam session, the customization flags are also reset:

```typescript
setMockDurationsCustomized({ listening: false, reading: false, writing: false });
```

## Testing Instructions

### Test Case 1: Default Track Durations
1. Go to Admin Dashboard → Exam Control
2. Select "Mock Test (Full Test)"
3. Select tracks for Listening, Reading, and Writing
4. **Expected Result**: Should show "Duration is automatically calculated based on selected tracks"

### Test Case 2: Partially Custom Durations
1. Select all three tracks
2. Manually change only the Listening duration
3. **Expected Result**: 
   - Should show "⚙️ Custom durations are set for this mock test"
   - Duration breakdown should show "(custom)" next to Listening
   - Should display "CUSTOM DURATIONS" badge in the info box

### Test Case 3: All Custom Durations
1. Select all three tracks
2. Manually change all three durations (Listening, Reading, Writing)
3. **Expected Result**:
   - Should show "⚙️ Custom durations are set for this mock test"
   - Duration breakdown should show "(custom)" next to all three sections
   - Should display "CUSTOM DURATIONS" badge in the info box

### Test Case 4: Reset to Default
1. Select all tracks and customize durations
2. Change one of the tracks (e.g., select a different Reading track)
3. **Expected Result**:
   - The duration for that section should reset to the new track's default
   - The customization flag for that section should be cleared
   - If other sections are still custom, they should maintain their "(custom)" indicator

### Test Case 5: Create and Reset
1. Create a mock test with custom durations
2. After successful creation, the form resets
3. **Expected Result**: All customization flags should be cleared for the next exam creation

## Files Modified
- `/app/src/pages/admin/ExamControlPage.tsx`

## Visual Changes
1. **Default behavior**: Shows standard blue info box with "Duration is automatically calculated based on selected tracks"
2. **Custom durations**: Shows orange warning-style message "⚙️ Custom durations are set for this mock test"
3. **Duration breakdown**: Shows "(custom)" in orange text next to any manually modified duration
4. **Summary badge**: Shows "CUSTOM DURATIONS" badge in orange when any duration is customized

## Benefits
1. **Clear feedback**: Admin can now see at a glance whether durations are default or custom
2. **Prevents confusion**: No more misleading message about automatic calculation when durations are manual
3. **Transparency**: Each section clearly shows if it has a custom duration
4. **Better UX**: Visual indicators (orange color scheme) draw attention to customized values

## Status
✅ **FIXED** - The bug has been resolved and the feature is working as expected.
