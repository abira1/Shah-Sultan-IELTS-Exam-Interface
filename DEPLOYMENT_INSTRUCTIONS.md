# Deployment Instructions for Google OAuth Implementation

## Important: Firebase Database Rules

The updated Firebase Realtime Database rules are in `/app/database.rules.json`. These rules **MUST** be deployed to Firebase Console for the application to work properly.

### Deploy Database Rules

#### Option 1: Firebase Console (Recommended for Quick Setup)
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **shah-sultan-s-ielts-academy**
3. Navigate to **Realtime Database** → **Rules** tab
4. Copy the contents of `/app/database.rules.json`
5. Paste into the rules editor
6. Click **Publish**

#### Option 2: Firebase CLI
```bash
cd /app
npm install -g firebase-tools
firebase login
firebase use shah-sultan-s-ielts-academy
firebase deploy --only database
```

### Updated Rules Include:
- `exam` - Exam status and audio
- `tracks` - Track management
- `submissions` - Student submissions
- `users` - Staff users (legacy)
- `students` - Student accounts
- `batches` - Batch management
- `authorizedUsers` - **NEW** - Google OAuth authorized emails
- `examSessions` - Exam session management

## Firebase Authentication Setup

### Enable Google Sign-In Provider

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: **shah-sultan-s-ielts-academy**
3. Navigate to **Authentication** → **Sign-in method**
4. Click on **Google** provider
5. Enable the toggle
6. Add your **support email**
7. Save

### Add Authorized Domains (For Production)

When deploying to production:
1. Go to **Authentication** → **Settings** → **Authorized domains**
2. Add your production domain (e.g., `yourdomain.com`)
3. Localhost is already authorized for development

## Google Cloud Console Setup

### OAuth Consent Screen (If Not Already Configured)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Navigate to **APIs & Services** → **OAuth consent screen**
4. Configure:
   - **App name**: Shah Sultan's IELTS Academy
   - **User support email**: Your email
   - **Developer contact**: Your email
5. Add authorized domains
6. Save and continue

### OAuth 2.0 Client IDs

The OAuth client is automatically created by Firebase. If you need to manage it:
1. Go to **APIs & Services** → **Credentials**
2. Find your Web client (auto-created by Firebase)
3. Add authorized JavaScript origins:
   - `http://localhost:3000` (development)
   - `https://yourdomain.com` (production)
4. Add authorized redirect URIs:
   - `http://localhost:3000/__/auth/handler` (development)
   - `https://yourdomain.com/__/auth/handler` (production)

## Security Recommendations

### For Production Deployment

1. **Update Database Rules** (More Restrictive)
   ```json
   {
     "rules": {
       "authorizedUsers": {
         ".read": "auth != null",
         ".write": "root.child('authorizedUsers').child(auth.token.email.replace('.', '_').replace('#', '_').replace('$', '_').replace('[', '_').replace(']', '_')).child('role').val() == 'admin'"
       },
       "students": {
         ".read": "auth != null",
         ".write": "auth != null"
       },
       "batches": {
         ".read": "auth != null",
         ".write": "auth != null"
       }
     }
   }
   ```

2. **Enable Firebase App Check**
   - Protects your Firebase resources from abuse
   - Go to Firebase Console → App Check
   - Register your app with reCAPTCHA v3

3. **Environment Variables**
   - Move Firebase config to environment variables
   - Use `.env` files (already using Vite env variables)
   - Never commit real API keys to Git

4. **Rate Limiting**
   - Consider implementing rate limiting for login attempts
   - Use Firebase Auth's built-in protection

## Verifying Deployment

### 1. Check Database Rules
```bash
# Should return your updated rules
curl -X GET \
  https://shah-sultan-s-ielts-academy-default-rtdb.asia-southeast1.firebasedatabase.app/.settings/rules.json
```

### 2. Test Authorized Users Initialization
1. Open browser console
2. Navigate to your app
3. Check for: `✅ Added default admin: abirsabirhossain@gmail.com`
4. Check Firebase Console → Realtime Database → Data → `authorizedUsers`

### 3. Test Google Login
1. Go to `/staff/login` or `/admin`
2. Click "Sign in with Google"
3. Sign in with authorized admin email
4. Should redirect to `/admin/dashboard`

### 4. Test Role Management
1. Login as admin
2. Go to Admin Dashboard → Role Management tab
3. Try adding a new user
4. Verify user appears in Firebase Database

## Troubleshooting

### "Permission denied" errors
- **Cause**: Database rules not deployed
- **Solution**: Deploy rules using Firebase Console or CLI

### Google Sign-In popup blocked
- **Cause**: Browser popup blocker
- **Solution**: Allow popups for your domain

### "Access Denied" after Google login
- **Cause**: Email not in authorizedUsers database
- **Solution**: 
  1. Check Firebase Console → Realtime Database → `authorizedUsers`
  2. Verify email exists and status is "active"
  3. Email comparison is case-sensitive

### Authorized users not initialized
- **Cause**: Database permission issue or initialization error
- **Solution**:
  1. Check browser console for errors
  2. Verify database rules are deployed
  3. Check Firebase Console for authorizedUsers node

### OAuth configuration error
- **Cause**: Google Sign-In provider not enabled
- **Solution**: Follow "Firebase Authentication Setup" steps above

## Local Development

### Running Locally
```bash
cd /app
yarn install
yarn dev
```

### Testing with Real Firebase
The app is already configured with your Firebase project. No additional setup needed for local development.

### Adding Default Admins
Edit `/app/src/utils/initializeAuthorizedUsers.ts`:
```typescript
const defaultAdmins = [
  'abirsabirhossain@gmail.com',
  'shahsultanweb@gmail.com',
  'newemail@example.com'  // Add here
];
```

## Production Deployment

### Using Vercel/Netlify
1. Build the app: `yarn build`
2. Deploy the `dist` folder
3. Set environment variables (if any)
4. Update Firebase authorized domains

### Using Firebase Hosting
```bash
cd /app
npm install -g firebase-tools
firebase login
firebase init hosting
# Select: Use existing project, shah-sultan-s-ielts-academy
# Public directory: dist
# Single-page app: Yes
# Build: yarn build
firebase deploy --only hosting
```

## Post-Deployment Checklist

- [ ] Firebase Database rules deployed
- [ ] Google Sign-In provider enabled
- [ ] Authorized domains added
- [ ] Default admin emails accessible
- [ ] Test Google login with authorized email
- [ ] Test unauthorized email rejection
- [ ] Test role management functionality
- [ ] Test student login (should still work)
- [ ] Verify all dashboards accessible
- [ ] Check browser console for errors

## Support

If you encounter issues:
1. Check Firebase Console logs
2. Check browser console for errors
3. Verify all setup steps completed
4. Test with a fresh browser session (incognito mode)

## Database Backup

Before deploying rules, backup your data:
```bash
firebase database:get / > backup.json
```

## Rollback Plan

If issues occur:
1. Restore previous database rules in Firebase Console
2. Revert code changes: `git revert HEAD`
3. Redeploy application

---

**Last Updated**: December 9, 2025
**Firebase Project**: shah-sultan-s-ielts-academy
**Status**: Ready for Deployment ✅
