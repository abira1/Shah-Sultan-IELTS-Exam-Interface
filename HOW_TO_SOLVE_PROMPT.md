# How to Solve Critical Issues - Detailed Prompt

## Context
You are working on an IELTS Mock Test application built with React + TypeScript + Firebase. The application allows students to take mock IELTS tests with listening, reading, and writing sections.

---

## 🎯 Issue #1: TypeScript Type Safety - Missing `disabled` Prop

### Problem Statement
The application has TypeScript type errors in writing task components. The `ExamPage.tsx` component passes a `disabled` prop to three writing components, but these components don't have this prop defined in their TypeScript interfaces.

### Affected Files
- `/app/src/components/WritingTaskInput.tsx`
- `/app/src/components/WritingTaskWithImage.tsx`
- `/app/src/components/WritingTaskTwoColumn.tsx`

### How to Solve

#### Step 1: Add `disabled` prop to TypeScript interface

In each of the three files, update the Props interface:

**Before:**
```typescript
interface WritingTaskInputProps {
  taskNumber: 1 | 2;
  title: string;
  instruction: string;
  prompt: string;
  minWords: number;
  maxWords?: number;
  timeRecommended: number;
  value: string;
  onChange: (value: string) => void;
  // ❌ Missing disabled prop
}
```

**After:**
```typescript
interface WritingTaskInputProps {
  taskNumber: 1 | 2;
  title: string;
  instruction: string;
  prompt: string;
  minWords: number;
  maxWords?: number;
  timeRecommended: number;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;  // ✅ ADDED
}
```

#### Step 2: Destructure the disabled prop with default value

Update the component function signature:

**Before:**
```typescript
export function WritingTaskInput({
  taskNumber,
  title,
  instruction,
  prompt,
  minWords,
  maxWords,
  timeRecommended,
  value,
  onChange
  // ❌ Missing disabled
}: WritingTaskInputProps) {
```

**After:**
```typescript
export function WritingTaskInput({
  taskNumber,
  title,
  instruction,
  prompt,
  minWords,
  maxWords,
  timeRecommended,
  value,
  onChange,
  disabled = false  // ✅ ADDED with default value
}: WritingTaskInputProps) {
```

#### Step 3: Update the textarea element to use the disabled prop

Find the `<textarea>` element in each component and update it:

**Before:**
```typescript
<textarea
  value={value}
  onChange={(e) => onChange(e.target.value)}
  className="w-full h-96 p-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-y font-mono text-sm leading-relaxed"
  placeholder="Type your answer here..."
  data-testid={`writing-textarea-task-${taskNumber}`}
/>
```

**After:**
```typescript
<textarea
  value={value}
  onChange={(e) => onChange(e.target.value)}
  disabled={disabled}  // ✅ ADDED
  className={`w-full h-96 p-4 border-2 rounded-lg resize-y font-mono text-sm leading-relaxed ${
    disabled 
      ? 'bg-gray-100 border-gray-300 cursor-not-allowed'  // ✅ Disabled styling
      : 'border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500'  // Normal styling
  }`}
  placeholder="Type your answer here..."
  data-testid={`writing-textarea-task-${taskNumber}`}
/>
```

#### Key Points:
- Add the `disabled` attribute to the textarea
- Use conditional className to style disabled state differently
- When disabled: gray background, gray border, cursor-not-allowed
- When enabled: normal border with focus ring

#### Repeat for All Three Components:
1. `WritingTaskInput.tsx` - Standard writing task
2. `WritingTaskWithImage.tsx` - Writing task with chart/image (adjust height: `h-[calc(100vh-320px)] min-h-[500px]`)
3. `WritingTaskTwoColumn.tsx` - Writing task with two-column layout (adjust height: `h-[calc(100vh-320px)] min-h-[500px]`)

---

## 🎯 Issue #2: Security - Hardcoded Firebase Credentials

### Problem Statement
Firebase API keys and configuration are hardcoded in `/app/src/firebase.ts`. This is a security risk as credentials are exposed in source code and version control.

### Affected Files
- `/app/src/firebase.ts` (contains hardcoded credentials)
- `/app/.env` (needs to be created)
- `/app/.gitignore` (needs to exclude .env)

### How to Solve

#### Step 1: Create .env file in project root

Create `/app/.env` with the following content:

```env
# Firebase Configuration
# IMPORTANT: Keep these values secure and never commit to public repositories

VITE_FIREBASE_API_KEY=AIzaSyACqLW0zlrEByDJo1cqg_qPCZInHpS2gnI
VITE_FIREBASE_AUTH_DOMAIN=shah-sultan-s-ielts-academy.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://shah-sultan-s-ielts-academy-default-rtdb.asia-southeast1.firebasedatabase.app
VITE_FIREBASE_PROJECT_ID=shah-sultan-s-ielts-academy
VITE_FIREBASE_STORAGE_BUCKET=shah-sultan-s-ielts-academy.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=321911668194
VITE_FIREBASE_APP_ID=1:321911668194:web:bfa5aa4afbc53a57da4dbb
VITE_FIREBASE_MEASUREMENT_ID=G-Q4S9V2GSW8
```

**Important:** All environment variables for Vite must be prefixed with `VITE_`

#### Step 2: Update firebase.ts to use environment variables

Replace the hardcoded config in `/app/src/firebase.ts`:

**Before:**
```typescript
const firebaseConfig = {
  apiKey: "AIzaSyACqLW0zlrEByDJo1cqg_qPCZInHpS2gnI",  // ❌ Hardcoded
  authDomain: "shah-sultan-s-ielts-academy.firebaseapp.com",  // ❌ Hardcoded
  databaseURL: "https://shah-sultan-s-ielts-academy-default-rtdb.asia-southeast1.firebasedatabase.app",  // ❌ Hardcoded
  projectId: "shah-sultan-s-ielts-academy",  // ❌ Hardcoded
  storageBucket: "shah-sultan-s-ielts-academy.firebasestorage.app",  // ❌ Hardcoded
  messagingSenderId: "321911668194",  // ❌ Hardcoded
  appId: "1:321911668194:web:bfa5aa4afbc53a57da4dbb",  // ❌ Hardcoded
  measurementId: "G-Q4S9V2GSW8"  // ❌ Hardcoded
};
```

**After:**
```typescript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,  // ✅ From .env
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,  // ✅ From .env
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,  // ✅ From .env
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,  // ✅ From .env
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,  // ✅ From .env
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,  // ✅ From .env
  appId: import.meta.env.VITE_FIREBASE_APP_ID,  // ✅ From .env
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID  // ✅ From .env
};

// ✅ Add validation
if (!firebaseConfig.apiKey || !firebaseConfig.authDomain || !firebaseConfig.projectId) {
  throw new Error(
    'Missing Firebase configuration. Please check your .env file and ensure all VITE_FIREBASE_* variables are set.'
  );
}
```

#### Step 3: Update .gitignore to exclude .env files

Add to `/app/.gitignore`:

```gitignore
# Environment variables
.env
.env.local
.env.production
```

This prevents accidentally committing sensitive credentials.

#### Step 4: Create .env.example template

Create `/app/.env.example` as a template for developers:

```env
# Firebase Configuration Template
# Copy this file to .env and fill in your Firebase project credentials

VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://your_project_id-default-rtdb.region.firebasedatabase.app
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

#### Step 5: Restart development server

After making these changes, restart the dev server to load the new environment variables:

```bash
# Stop current server (Ctrl+C)
# Restart
cd /app
yarn dev
```

---

## 📋 Testing & Verification

### Test TypeScript Fixes

1. **Build the application:**
   ```bash
   cd /app
   yarn build
   ```
   - Should complete without TypeScript errors
   - Should see "✓ built in X.XXs"

2. **Test disabled state manually:**
   - Start an exam with writing tasks
   - Verify textarea is editable during exam
   - Submit the exam
   - Verify textarea becomes disabled (grayed out, cursor: not-allowed)

### Test Firebase Security Fix

1. **Check .env file exists:**
   ```bash
   ls -la /app/.env
   ```

2. **Start development server:**
   ```bash
   cd /app
   yarn dev
   ```

3. **Check browser console:**
   - Open http://localhost:5173
   - Open browser DevTools (F12)
   - Look for Firebase initialization messages
   - Should see no errors

4. **Test Firebase functionality:**
   - Try logging in with Google Auth
   - Verify database read/write operations work
   - Check that audio files load from Firebase Storage

### Verify .gitignore

```bash
cd /app
git status
```
- `.env` should NOT appear in untracked files
- If it does, verify .gitignore includes `.env`

---

## 🚀 Production Deployment

### For Hosting Platforms (Vercel, Netlify, Firebase Hosting)

1. **Add environment variables in platform dashboard:**
   - Navigate to project settings → Environment Variables
   - Add all 8 `VITE_FIREBASE_*` variables
   - Use the values from your `.env` file

2. **Example for Vercel:**
   ```
   Project Settings → Environment Variables → Add New
   
   Name: VITE_FIREBASE_API_KEY
   Value: AIzaSyACqLW0zlrEByDJo1cqg_qPCZInHpS2gnI
   
   (Repeat for all 8 variables)
   ```

3. **Redeploy the application**

### For Self-Hosted Servers

1. **Copy .env file to server:**
   ```bash
   scp .env user@server:/path/to/app/
   ```

2. **Or create .env manually on server:**
   ```bash
   ssh user@server
   cd /path/to/app
   nano .env
   # Paste environment variables
   ```

3. **Build and run:**
   ```bash
   yarn install
   yarn build
   yarn preview
   ```

---

## 🎯 Expected Outcomes

### After Fix #1 (TypeScript):
✅ All TypeScript errors resolved (0 errors)  
✅ Writing textarea properly disables after exam submission  
✅ Visual feedback for disabled state (gray background)  
✅ Improved type safety and IDE autocomplete  

### After Fix #2 (Security):
✅ No hardcoded credentials in source code  
✅ Firebase credentials protected in .env file  
✅ .env excluded from version control  
✅ Easy environment-specific configuration  
✅ Clear error message if credentials missing  
✅ Production-ready security practices  

---

## 🔍 Affected Functionality Analysis

### Writing Components
**Before:** Textareas could be edited even after exam submission/timeout  
**After:** Textareas properly lock when `disabled` prop is true  
**Impact:** Improved user experience and data integrity  

### Firebase Integration
**Before:** Credentials exposed in source code  
**After:** Credentials secured in environment variables  
**Impact:** Production-ready security, supports multiple environments  

### No Breaking Changes
All existing functionality continues to work. These are purely improvements to:
- Type safety
- Security
- Deployment flexibility
- Code maintainability

---

## 💡 Key Learnings

### TypeScript Best Practices
1. Always define all props in component interfaces
2. Use optional props (`?`) for non-required props
3. Provide default values in destructuring for optional props
4. TypeScript compilation catches issues before runtime

### Security Best Practices
1. Never hardcode credentials in source code
2. Use environment variables for sensitive data
3. Add .env to .gitignore immediately
4. Provide .env.example for documentation
5. Validate required environment variables on startup

### Vite-Specific Knowledge
1. Environment variables must be prefixed with `VITE_`
2. Access via `import.meta.env.VITE_VARIABLE_NAME`
3. Restart dev server after .env changes
4. Build process inlines environment variables

---

## 📚 Additional Resources

- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [TypeScript Handbook - Interfaces](https://www.typescriptlang.org/docs/handbook/interfaces.html)
- [Firebase Security Best Practices](https://firebase.google.com/docs/rules)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)

---

## ✅ Checklist

Use this checklist when implementing the fixes:

### TypeScript Fixes
- [ ] Add `disabled?: boolean` to WritingTaskInput interface
- [ ] Add `disabled?: boolean` to WritingTaskWithImage interface
- [ ] Add `disabled?: boolean` to WritingTaskTwoColumn interface
- [ ] Update all three component function signatures with `disabled = false`
- [ ] Update all three textarea elements with `disabled` attribute
- [ ] Update all three textarea className to handle disabled styling
- [ ] Run `yarn build` to verify no TypeScript errors

### Security Fixes
- [ ] Create `/app/.env` with all Firebase variables
- [ ] Update `/app/src/firebase.ts` to use `import.meta.env`
- [ ] Add validation for required Firebase variables
- [ ] Create `/app/.env.example` as template
- [ ] Update `/app/.gitignore` to exclude .env files
- [ ] Verify .env is not tracked by git
- [ ] Test Firebase connection in development
- [ ] Document deployment instructions for production

### Final Verification
- [ ] Application builds successfully (`yarn build`)
- [ ] No TypeScript errors
- [ ] Firebase initializes correctly
- [ ] Writing tasks disable properly after submission
- [ ] No console errors in browser
- [ ] .env file not in git status

---

**This prompt provides complete step-by-step instructions to solve both critical issues identified in the IELTS Mock Test application.**
