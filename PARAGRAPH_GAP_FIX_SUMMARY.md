# Paragraph Gap Question Fix - Track 10M Reading

## Issue
In Track 10M Reading, Section 2 (questions 20-26) and Section 3 (questions 38-40) were displaying dots `……………………` instead of functional input fields where students could type their answers.

## Root Cause
The `ParagraphGapQuestion` component was designed to handle a specific format where question numbers and blanks appeared together on the same line (e.g., `(1)..........`).

However, Track 10M Reading uses a different format:
- Question numbers appear at the beginning of sentences: `(20) According to Dr Randolph...`
- Answer blanks (dots/ellipsis) appear later in the sentence or on subsequent lines: `...because of ……………………… – in other words...`

This mismatch caused the component to fail to recognize and convert the dots into input fields.

## Solution
Updated `/app/src/components/ParagraphGapQuestion.tsx` to:

1. **Track question numbers across multiple lines**: The component now maintains a `currentQuestionNum` variable that persists across lines, rather than resetting for each line.

2. **Smart blank detection**: When dots/ellipsis are found, the component uses the most recently seen question number to create the input field.

3. **Backward compatibility**: The fix maintains support for both formats:
   - Old format: `(1)..........` (number immediately followed by dots on same line)
   - New format: `(20) Text with ……………………… blank` (number at start, dots later in sentence or on different line)

## Technical Details

### Key Changes
- Changed `currentQuestionNum` from a line-local variable to a persistent variable across the rendering loop
- Maintained the regex patterns for matching question numbers `^\((\d+)\)` and dots `[.…]{3,}`
- Preserved all existing functionality including placeholder text, styling, and test IDs

### Supported Characters
The component handles both:
- Regular dots: `.` (U+002E)
- Unicode ellipsis: `…` (U+2026)

### Test Coverage
Verified with:
- Track 10M Reading Section 2: Questions 20-26 ✓
- Track 10M Reading Section 3: Questions 38-40 ✓
- All input fields render correctly
- Students can type answers into all fields
- Answers are properly tracked in the state

## Files Modified
1. `/app/src/components/ParagraphGapQuestion.tsx` - Updated rendering logic

## Testing
All paragraph gap questions now render functional input fields where students can type their answers, replacing the previously static dots display.
