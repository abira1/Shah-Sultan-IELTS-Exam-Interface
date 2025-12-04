# Admin Marking Interface - UI Guide

## User Interface Overview

### 1. Submissions Table Enhancement

#### Score Column
```
Before:
┌─────────────┐
│ Score       │
├─────────────┤
│ 85%         │
└─────────────┘

After:
┌─────────────┐
│ Score       │
├─────────────┤
│ 85%         │  ← Original Score
│ Manual: 92% │  ← Manual Score (if published)
└─────────────┘
```

#### Status Column
```
Before:
┌──────────────┐
│ ✓ Completed  │
└──────────────┘

After:
┌──────────────┐
│ ✓ Completed  │
│ ✉ Published  │  ← Shows if results are published
└──────────────┘
```

### 2. Detailed View - Marking Interface

#### A. Marking Statistics Panel
```
┌─────────────────────────────────────────────────────────────────┐
│ Marking Progress                          Manual Score          │
│                                                                 │
│ ✓ 35 Correct   ✗ 3 Incorrect   ○ 2 Unmarked          87%      │
│                                                                 │
│                                    [Publish Result]            │
└─────────────────────────────────────────────────────────────────┘
```

When all marked:
```
┌─────────────────────────────────────────────────────────────────┐
│ Marking Progress                          Manual Score          │
│                                                                 │
│ ✓ 37 Correct   ✗ 3 Incorrect   ○ 0 Unmarked          92%      │
│                                                                 │
│                                    [Publish Result] ← Active   │
└─────────────────────────────────────────────────────────────────┘
```

After publishing:
```
┌─────────────────────────────────────────────────────────────────┐
│ Marking Progress                          Manual Score          │
│                                                                 │
│ ✓ 37 Correct   ✗ 3 Incorrect   ○ 0 Unmarked          92%      │
│                                                                 │
│                       ✉ Result Published                        │
│                     Dec 4, 2024 1:30 PM                        │
└─────────────────────────────────────────────────────────────────┘
```

#### B. Question Cards

##### Unmarked Question (White/Gray Background)
```
┌────────────────────────────────────┐
│ Question 15                     ✓  │
│                                    │
│ The capital city                   │
│                                    │
│ [✓ Correct]  [✗ Incorrect]        │
└────────────────────────────────────┘
```

##### Marked Correct (Green Background)
```
┌────────────────────────────────────┐
│ Question 15                     ✓  │ ← Green checkmark
│                                    │
│ The capital city                   │
│                                    │
│ [✓ Correct]  [ Incorrect]         │ ← Correct button highlighted
└────────────────────────────────────┘
```

##### Marked Incorrect (Red Background)
```
┌────────────────────────────────────┐
│ Question 16                     ✗  │ ← Red X icon
│                                    │
│ Wrong answer                       │
│                                    │
│ [ Correct]  [✗ Incorrect]         │ ← Incorrect button highlighted
└────────────────────────────────────┘
```

##### Unanswered Question (Orange Background)
```
┌────────────────────────────────────┐
│ Question 20                     !  │ ← Alert icon
│                                    │
│ Not Answered                       │ ← Italic text
│                                    │
│ [✓ Correct]  [✗ Incorrect]        │
└────────────────────────────────────┘
```

##### After Publishing (Read-Only)
```
┌────────────────────────────────────┐
│ Question 15                     ✓  │
│                                    │
│ The capital city                   │
│                                    │
│     ✓ Marked Correct               │ ← Status text (no buttons)
└────────────────────────────────────┘
```

### 3. Color Scheme

| Element                | Color        | Hex Code  |
|------------------------|-------------|-----------|
| Correct Background     | Light Green | bg-green-50 |
| Correct Border         | Green       | border-green-300 |
| Correct Button Active  | Green       | bg-green-600 |
| Incorrect Background   | Light Red   | bg-red-50 |
| Incorrect Border       | Red         | border-red-300 |
| Incorrect Button Active| Red         | bg-red-600 |
| Unmarked Background    | White       | bg-white |
| Unanswered Background  | Light Orange| bg-orange-50 |
| Published Badge        | Purple      | bg-purple-100 |

### 4. Button States

#### Correct Button
```
Inactive:  [✓ Correct]    (white bg, green border)
Active:    [✓ Correct]    (green bg, white text)
Hover:     [✓ Correct]    (light green bg)
```

#### Incorrect Button
```
Inactive:  [✗ Incorrect]  (white bg, red border)
Active:    [✗ Incorrect]  (red bg, white text)
Hover:     [✗ Incorrect]  (light red bg)
```

#### Publish Result Button
```
Disabled:  [Publish Result] (gray bg, cursor-not-allowed)
           Tooltip: "Please mark all questions before publishing"

Active:    [Publish Result] (green bg, white text)
           
Published: [✉ Result Published] (purple bg, read-only)
```

### 5. Responsive Layout

#### Desktop (3 columns)
```
┌─────────┬─────────┬─────────┐
│ Q1      │ Q2      │ Q3      │
│ Answer  │ Answer  │ Answer  │
│ [✓][✗] │ [✓][✗] │ [✓][✗] │
├─────────┼─────────┼─────────┤
│ Q4      │ Q5      │ Q6      │
│ Answer  │ Answer  │ Answer  │
│ [✓][✗] │ [✓][✗] │ [✓][✗] │
└─────────┴─────────┴─────────┘
```

#### Tablet (2 columns)
```
┌─────────┬─────────┐
│ Q1      │ Q2      │
│ Answer  │ Answer  │
│ [✓][✗] │ [✓][✗] │
├─────────┼─────────┤
│ Q3      │ Q4      │
│ Answer  │ Answer  │
│ [✓][✗] │ [✓][✗] │
└─────────┴─────────┘
```

#### Mobile (1 column)
```
┌─────────┐
│ Q1      │
│ Answer  │
│ [✓][✗] │
├─────────┤
│ Q2      │
│ Answer  │
│ [✓][✗] │
└─────────┘
```

### 6. Workflow States

```
State 1: Fresh Submission
└─> All questions unmarked (white/gray cards)
    └─> "Publish Result" button disabled
        └─> Tooltip: "Please mark all questions"

State 2: Partial Marking
└─> Some questions marked (green/red), some unmarked
    └─> Statistics show progress (e.g., 20 marked, 20 unmarked)
        └─> "Publish Result" button still disabled

State 3: All Marked
└─> All 40 questions have marks
    └─> Manual score calculated and displayed
        └─> "Publish Result" button enabled (green)
            └─> Click to publish

State 4: Published
└─> Result published and saved
    └─> Marking buttons hidden
        └─> Status text shows final marks
            └─> "Published" badge visible
                └─> Timestamp displayed
```

### 7. Interactive Elements

#### Toggle Marking
- Click "Correct" on unmarked → Marks as correct
- Click "Correct" on correct → Unmarks (back to neutral)
- Click "Incorrect" on unmarked → Marks as incorrect  
- Click "Incorrect" on incorrect → Unmarks (back to neutral)
- Switching between marks → Direct toggle (correct ↔ incorrect)

#### Real-time Updates
- Statistics update immediately when marking
- Manual score recalculates in real-time
- Button states change based on completion
- Color coding updates instantly

### 8. Accessibility Features

- **Keyboard Navigation**: Tab through questions and buttons
- **Screen Reader Support**: Descriptive labels and ARIA attributes
- **Color + Icons**: Not relying solely on color (icons included)
- **Clear Labels**: "Correct", "Incorrect", "Publish Result"
- **Tooltips**: Helpful hints on disabled elements
- **High Contrast**: Clear visual distinction between states

### 9. User Feedback

#### Success Messages
- "Result published successfully!" → Alert on publish
- Visual confirmation with badge change

#### Error Prevention
- Disabled button until all marked
- Tooltip explanation when disabled
- No accidental double-publishing

#### Progress Indication
- Real-time counters (35/40 marked)
- Visual progress with color coding
- Percentage score updates live
