# Testing Guide: Auto-Stop Exam Feature

## Quick Test (1-2 Minutes)

### Prerequisites
1. Admin access to the Exam Control page
2. At least one batch created

### Test Steps

#### Step 1: Create a Short Test Exam
1. Navigate to Admin Dashboard → Exam Control
2. In "Create New Exam Session" section:
   - **Test Type:** Partial Test
   - **Track Type:** Select any (e.g., Listening)
   - **Track:** Select any track
   - **Date:** Today's date
   - **Start Time:** Current time or 1 minute in future
   - **Duration:** Set to **1 minute** (for quick testing)
   - **Batches:** Select at least one batch
3. Click **"Start Immediately"**

#### Step 2: Verify Active Status
- Exam should appear in "🟢 Active Exam Sessions" section
- Status badge should show: **ACTIVE** (green)
- Note the start time displayed

#### Step 3: Wait for Auto-Stop
- Wait for **1 minute** (the duration you set)
- After 1 minute, wait up to **10 more seconds** (refresh cycle)
- **Expected Result:** Exam automatically disappears from "Active Exam Sessions"

#### Step 4: Verify Completion
- Check "✅ Recently Completed Exams" section
- Your test exam should now appear there
- Status should be: **COMPLETED**

### Expected Timeline
```
0:00 - Exam starts (Shows in Active section)
1:00 - Duration expires
1:10 - Auto-stop kicks in (within 10 seconds of expiry)
      → Exam moves to Completed section
```

## Detailed Testing

### Test Case 1: Different Durations
Test with various durations to ensure accuracy:

| Duration | Expected Auto-Stop |
|----------|-------------------|
| 1 min    | After 1:00-1:10   |
| 2 min    | After 2:00-2:10   |
| 5 min    | After 5:00-5:10   |

### Test Case 2: Multiple Active Exams
1. Create multiple short-duration exams with staggered start times
2. Verify each stops at its correct end time
3. Ensure one exam stopping doesn't affect others

### Test Case 3: Mock Test Auto-Stop
1. Create a mock test with custom durations:
   - Listening: 1 min
   - Reading: 1 min  
   - Writing: 1 min
   - Total: 3 minutes
2. Start immediately
3. Verify auto-stop after 3 minutes

### Test Case 4: Scheduled Exam
1. Create and schedule an exam (don't start immediately)
2. Manually start it from "Scheduled Exams" section
3. Verify it auto-stops after duration

## Console Monitoring

### Opening Browser Console
1. Press `F12` or right-click → "Inspect"
2. Go to "Console" tab
3. Watch for auto-stop logs

### Expected Console Logs
When auto-stop occurs, you should see:
```
⏰ Auto-stopping expired exam: 6M-20250126-001 (ended at 2025-01-26T16:00:00Z)
🛑 Phase 4: Stopping exam: 6M-20250126-001
✓ Exam session marked as completed
✓ Global exam status cleared - all students will be forced to exit
✅ Successfully auto-stopped exam: 6M-20250126-001
```

### Error Detection
If you see errors like:
```
❌ Failed to auto-stop exam: [exam-code]
```
This indicates a problem - please report with full error details.

## Firebase Database Verification

### Before Auto-Stop
Check `examSessions/{examCode}`:
```json
{
  "status": "active",
  "startedAt": "2025-01-26T15:15:00.000Z",
  "duration": 1,
  ...
}
```

### After Auto-Stop
Check `examSessions/{examCode}`:
```json
{
  "status": "completed",
  "startedAt": "2025-01-26T15:15:00.000Z",
  "completedAt": "2025-01-26T15:16:05.000Z",
  "duration": 1,
  ...
}
```

Check `exam/status`:
```json
{
  "isStarted": false,
  "activeTrackId": null,
  "examCode": null,
  ...
}
```

## Student Experience Testing

### Test from Student Side
1. Have a student log in during an active exam
2. Student should be able to access exam
3. When exam auto-stops:
   - Student should be forced to exit
   - Submission page should appear
   - No further answers can be entered

## Troubleshooting

### Issue: Exam Not Auto-Stopping
**Possible Causes:**
1. Admin page is not open/active
2. Browser console shows errors
3. Firebase connection issues

**Solution:**
- Keep admin panel open in at least one browser tab
- Check browser console for errors
- Verify Firebase credentials in `.env` file

### Issue: Delayed Auto-Stop
**Normal Behavior:**
- Auto-stop can take up to 10 seconds after expiry
- This is due to the 10-second refresh cycle

**If delay > 20 seconds:**
- Check browser console for errors
- Verify Firebase connection

## Performance Testing

### Load Test
1. Create 10 exams with different durations
2. Start all simultaneously
3. Verify all auto-stop correctly at their respective end times

### Concurrent Users
1. Have multiple admin tabs open
2. Verify auto-stop works regardless of which tab is active
3. All tabs should update to show completed status

## Acceptance Criteria

✅ **PASS** if:
- Exam auto-stops within 10 seconds of duration expiry
- Status changes from "ACTIVE" to "COMPLETED"
- Exam moves to "Completed" section
- Console logs show successful auto-stop
- Students are forced to exit (existing functionality)

❌ **FAIL** if:
- Exam stays active after duration + 20 seconds
- Console shows persistent errors
- Exam doesn't appear in completed section
- Students can continue after time expires

## Reporting Issues

If you encounter problems, please provide:
1. **Exam Code** of the affected exam
2. **Start Time** and **Duration** configured
3. **Console Logs** (screenshot or copy-paste)
4. **Firebase Database Status** (screenshot of examSessions node)
5. **Steps to Reproduce** the issue

## Success Confirmation

Once testing is complete and all criteria pass, you can confirm:
- ✅ Auto-stop feature is working correctly
- ✅ Exam management is fully automated
- ✅ No manual intervention needed to stop exams
- ✅ Ready for production use

---

**Note:** For production deployment, consider using longer test durations (e.g., 30-45 minutes) to ensure realistic scenarios work correctly.
