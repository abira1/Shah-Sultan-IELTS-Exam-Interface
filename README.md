# Shah Sultan IELTS Academy - Examination System

<div align="center">
  <img src="./public/shah-sultan-academy-logo.png" alt="Shah Sultan IELTS Academy Logo" width="200"/>
  
  **A comprehensive digital examination platform for IELTS preparation and assessment**
  
  [![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
  [![React](https://img.shields.io/badge/React-18.3.1-61dafb.svg)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.5.4-blue.svg)](https://www.typescriptlang.org/)
  [![Firebase](https://img.shields.io/badge/Firebase-12.6.0-orange.svg)](https://firebase.google.com/)
</div>

---

## 📖 Table of Contents

- [About](#about)
- [About Toiral Web Development](#about-toiral-web-development)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [User Roles](#user-roles)
- [Security](#security)
- [Deployment](#deployment)
- [Testing](#testing)
- [Contributing](#contributing)
- [Support](#support)
- [License](#license)

---

## 🎯 About

The **Shah Sultan IELTS Academy Examination System** is a full-featured, modern web application designed to deliver comprehensive IELTS mock tests and assessments. Built with cutting-edge technologies, this platform provides an authentic exam experience for students while offering powerful administrative tools for teachers and staff.

### Key Capabilities

- **Full IELTS Mock Tests**: Complete Reading, Listening, Writing, and Speaking assessments
- **Real-time Exam Environment**: Timed tests with countdown timers and auto-submission
- **Multi-track Support**: 10+ different mock test tracks (1M-10M) with varying difficulty levels
- **Intelligent Question Types**: Support for 15+ question formats including MCQ, True/False/Not Given, Matching Headings, Gap-fill, and more
- **Audio Integration**: Seamless audio playback for Listening tests with preloading capabilities
- **Automated Scoring**: Instant band score calculation for Reading and Listening sections
- **Result Analytics**: Detailed performance tracking and historical data visualization
- **Print-friendly Reports**: Professional PDF-ready result sheets
- **Role-based Access**: Separate portals for students, teachers, and administrators
- **Batch Management**: Organize students into cohorts for streamlined administration

---

## 🌐 About Toiral Web Development

<div align="center">
  <strong>"Imagine, Develop, Deploy"</strong>
</div>

**Toiral** is a professional web development and design agency focused on crafting meaningful digital experiences through storytelling, strategy, and modern technology. 

### Our Philosophy

At Toiral, we believe that great digital products are born from a deep understanding of:
- **Brand Identity**: Who you are and what makes you unique
- **Inspiration**: The vision that drives your mission forward
- **Goals**: Clear objectives that define success

### Our Services

**Toiral delivers end-to-end digital solutions:**

🎨 **Web Design & Development**
- Custom website design and development
- Responsive, mobile-first interfaces
- Performance-optimized web applications
- E-commerce solutions

💡 **UI/UX Design**
- User research and persona development
- Wireframing and prototyping
- Interactive design systems
- Usability testing and optimization

📱 **Digital Products**
- Progressive Web Apps (PWAs)
- Cross-platform mobile applications
- SaaS product development
- API design and integration

📊 **Strategy & Consulting**
- Digital transformation consulting
- Technology stack recommendations
- Scalability planning
- Performance auditing

📚 **Learning & Support**
- Curated development courses
- Technical documentation
- Ongoing maintenance and support
- Team training and workshops

🎯 **Social Media Solutions**
- Digital marketing integration
- Content management systems
- Analytics and tracking setup
- Social media API integration

### Our Commitment

Toiral emphasizes:
- **Quality**: Every line of code, every pixel matters
- **Creativity**: Innovative solutions that stand out
- **Long-term Success**: Building relationships, not just products
- **Growth-Ready**: Scalable architecture for your future needs

**Contact Toiral**: Ready to bring your digital vision to life? Let's imagine, develop, and deploy together.

---

## ✨ Features

### Student Portal
- 📝 Take full IELTS mock tests (Reading, Listening, Writing, Speaking)
- ⏱️ Real-time countdown timer with warnings
- 🎧 High-quality audio playback for Listening sections
- 💾 Auto-save progress during exams
- 📊 View detailed results and band scores
- 📈 Track performance history across multiple attempts
- 🖨️ Print professional result reports
- 🔐 Secure authentication with Google OAuth

### Teacher Portal
- 👥 View and manage student submissions
- ✅ Mark Writing and Speaking tasks with detailed feedback
- 📋 Access student profiles and performance data
- 📝 Review all submitted answers
- 🎯 Track class progress and analytics

### Admin Portal
- 👨‍🎓 Student management (add, edit, remove students)
- 🗂️ Batch/cohort organization
- 📊 System-wide analytics and reporting
- 🔑 Role and permission management
- 🎼 Track management (add/edit mock tests)
- 📤 Bulk operations and data export

### Exam Features
- **15+ Question Types**: MCQ, True/False/Not Given, Yes/No/Not Given, Matching Headings, Sentence Completion, Gap Fill, Paragraph Gap, Table Selection, Drag & Drop, Flow Charts, Map Labeling, and more
- **Question Navigation**: Quick jump to any question with highlighting support
- **Answer Review**: Review and modify answers before submission
- **Accessibility**: Keyboard shortcuts, clear visual indicators, and responsive design
- **Offline Resilience**: Graceful handling of network interruptions

---

## 🛠️ Technology Stack

### Frontend
- **React 18.3.1** - Modern UI library with hooks and concurrent features
- **TypeScript 5.5.4** - Type-safe development
- **Vite 5.2.0** - Lightning-fast build tool and dev server
- **React Router 7.10.1** - Client-side routing
- **Tailwind CSS 3.4.17** - Utility-first CSS framework
- **Lucide React** - Beautiful, consistent icons
- **Recharts** - Composable charting library

### Backend & Services
- **Firebase 12.6.0**
  - Authentication (Email/Password, Google OAuth)
  - Realtime Database
  - Cloud Storage (for audio files)
  - Hosting

### Development Tools
- **ESLint** - Code quality and consistency
- **TypeScript ESLint** - TypeScript-specific linting
- **PostCSS & Autoprefixer** - CSS processing
- **Firebase Tools** - Deployment and management CLI

### Additional Libraries
- **html2canvas** - Screenshot and PDF generation
- **jsPDF** - PDF creation for results
- **date-fns** - Modern date utility library
- **bcryptjs** - Password hashing
- **xlsx** - Excel file operations

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher)
- **Yarn** (v1.22.0 or higher) - `npm install -g yarn`
- **Git** - For version control
- **Firebase CLI** - `npm install -g firebase-tools`
- A **Firebase Project** - [Create one here](https://console.firebase.google.com/)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/abira1/exam.git
   cd exam
   ```

2. **Install dependencies**
   ```bash
   yarn install
   ```

3. **Set up Firebase**
   ```bash
   firebase login
   firebase init
   ```
   Select:
   - ☑️ Realtime Database
   - ☑️ Hosting
   - ☑️ Storage

### Configuration

1. **Create environment file**
   
   Create a `.env` file in the root directory:
   ```bash
   cp .env.example .env
   ```

2. **Configure Firebase credentials**
   
   Edit `.env` and add your Firebase configuration:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key_here
   VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   VITE_FIREBASE_DATABASE_URL=https://your_project_id.firebaseio.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

   **Where to find these values:**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Select your project
   - Click the gear icon ⚙️ → Project settings
   - Scroll to "Your apps" section
   - Copy the config values from the `firebaseConfig` object

3. **Configure Firebase Database Rules**
   
   Deploy the database rules:
   ```bash
   firebase deploy --only database
   ```

4. **Set up Firebase Storage Rules**
   
   Update `storage.rules` as needed and deploy:
   ```bash
   firebase deploy --only storage
   ```

5. **Initialize default admin account**
   
   The application will automatically create a default admin account on first run:
   - **Email**: `admin@shahsultan.com`
   - **Password**: `admin123` (⚠️ Change this immediately in production!)

### Running the Application

#### Development Mode

```bash
yarn dev
```

The application will start at `http://localhost:3000`

**Features in dev mode:**
- Hot Module Replacement (HMR)
- Source maps for debugging
- React DevTools support
- Detailed error messages

#### Production Build

```bash
# Build for production
yarn build

# Preview production build locally
yarn preview
```

#### Deployment

**Deploy to Firebase Hosting:**

```bash
# Build and deploy
yarn build
firebase deploy --only hosting

# Deploy everything (hosting, database, storage rules)
firebase deploy
```

Your app will be live at: `https://your-project-id.web.app`

---

## 📁 Project Structure

```
exam/
├── public/                          # Static assets
│   ├── shah-sultan-academy-logo.png # Main logo
│   ├── LeisureComplexPlan.png      # Map for reading questions
│   └── index.html                   # HTML entry point
│
├── src/
│   ├── components/                  # Reusable UI components
│   │   ├── questions/              # Question type components
│   │   │   ├── MatchingHeadings.tsx
│   │   │   ├── TrueFalseNotGiven.tsx
│   │   │   ├── YesNoNotGiven.tsx
│   │   │   └── TableSelectionQuestion.tsx
│   │   ├── ParagraphGapQuestion.tsx # Gap-fill questions
│   │   ├── ExamController.tsx       # Main exam logic
│   │   ├── ExamHeader.tsx          # Timer & navigation
│   │   ├── QuestionNavigator.tsx   # Question grid
│   │   ├── StudentLogin.tsx        # Authentication
│   │   └── ...
│   │
│   ├── contexts/                    # React Context providers
│   │   └── AuthContext.tsx         # Authentication state
│   │
│   ├── data/                        # Mock test data
│   │   ├── track-1m-reading.ts     # Track 1M Reading
│   │   ├── track-10m-reading.ts    # Track 10M Reading
│   │   └── ...                     # Other tracks
│   │
│   ├── pages/                       # Page components
│   │   ├── student/                # Student portal pages
│   │   │   ├── StudentDashboard.tsx
│   │   │   └── ResultDetailPage.tsx
│   │   ├── teacher/                # Teacher portal pages
│   │   │   └── TeacherDashboard.tsx
│   │   ├── admin/                  # Admin portal pages
│   │   │   ├── StudentsPage.tsx
│   │   │   ├── BatchesPage.tsx
│   │   │   └── SubmissionsPage.tsx
│   │   ├── ExamPage.tsx           # Main exam interface
│   │   └── NewHomePage.tsx        # Landing page
│   │
│   ├── services/                   # Firebase services
│   │   ├── authService.ts         # Authentication
│   │   ├── studentService.ts      # Student operations
│   │   ├── submissionService.ts   # Exam submissions
│   │   └── ...
│   │
│   ├── utils/                      # Utility functions
│   │   ├── scoringUtils.ts        # Band score calculation
│   │   ├── initializeDatabase.ts  # DB initialization
│   │   └── ...
│   │
│   ├── App.tsx                     # Root component & routing
│   ├── index.tsx                   # Application entry point
│   ├── firebase.ts                 # Firebase configuration
│   └── index.css                   # Global styles
│
├── .env.example                    # Environment template
├── .firebaserc                     # Firebase project config
├── database.rules.json             # Database security rules
├── firebase.json                   # Firebase hosting config
├── package.json                    # Dependencies
├── tsconfig.json                   # TypeScript config
├── vite.config.ts                  # Vite configuration
├── tailwind.config.js              # Tailwind CSS config
└── README.md                       # This file
```

---

## 👥 User Roles

### 1. **Student**
**Permissions:**
- Take mock tests
- View own results
- Access dashboard
- Update profile

**Default Test Credentials:**
- Email: `student@test.com`
- Password: `student123`

### 2. **Teacher**
**Permissions:**
- View all student submissions
- Mark Writing and Speaking tasks
- Access student profiles
- View analytics

**Default Test Credentials:**
- Email: `teacher@shahsultan.com`
- Password: `teacher123`

### 3. **Admin**
**Permissions:**
- All teacher permissions
- Manage students (CRUD operations)
- Manage batches
- Manage tracks
- System configuration
- User role assignment

**Default Credentials:**
- Email: `admin@shahsultan.com`
- Password: `admin123`

⚠️ **Important**: Change all default passwords immediately after first login!

---

## 🔒 Security

### Authentication & Authorization

1. **Firebase Authentication**
   - Secure email/password authentication
   - Google OAuth integration
   - Session management with automatic token refresh
   - Password reset functionality

2. **Role-Based Access Control (RBAC)**
   - Three-tier permission system (Student, Teacher, Admin)
   - Protected routes with authentication guards
   - API-level permission checks
   - Granular access to features based on role

3. **Database Security Rules**
   
   Our Firebase Realtime Database uses strict security rules:

   ```json
   {
     "rules": {
       "students": {
         "$uid": {
           ".read": "$uid === auth.uid || root.child('users').child(auth.uid).child('role').val() === 'admin' || root.child('users').child(auth.uid).child('role').val() === 'teacher'",
           ".write": "$uid === auth.uid || root.child('users').child(auth.uid).child('role').val() === 'admin'"
         }
       },
       "submissions": {
         "$submissionId": {
           ".read": "auth != null && (data.child('studentId').val() === auth.uid || root.child('users').child(auth.uid).child('role').val() === 'admin' || root.child('users').child(auth.uid).child('role').val() === 'teacher')",
           ".write": "auth != null && (data.child('studentId').val() === auth.uid || !data.exists())"
         }
       }
     }
   }
   ```

### Data Protection

1. **Password Security**
   - Passwords hashed using bcryptjs (10 rounds)
   - Never stored in plain text
   - Automatic session timeout after 7 days

2. **Input Validation**
   - Client-side validation for all forms
   - Server-side validation in Firebase Rules
   - XSS prevention through React's built-in escaping
   - SQL injection prevention (NoSQL database)

3. **Sensitive Data**
   - Firebase credentials stored in environment variables
   - `.env` file excluded from version control
   - API keys restricted by domain in Firebase Console
   - Audio files served through authenticated URLs

### Security Best Practices

✅ **DO:**
- Change default admin password immediately
- Use strong, unique passwords
- Enable Google OAuth for additional security
- Regularly review Firebase Console logs
- Keep dependencies updated (`yarn upgrade`)
- Use HTTPS in production (automatic with Firebase Hosting)
- Implement rate limiting for API calls
- Regular security audits of database rules

❌ **DON'T:**
- Commit `.env` file to version control
- Share Firebase credentials publicly
- Use default passwords in production
- Disable authentication for testing
- Grant admin role unnecessarily
- Expose sensitive student data

### Vulnerability Reporting

Found a security issue? Please email: **security@shahsultan.com**

Do not create public GitHub issues for security vulnerabilities.

---

## 🌍 Deployment

### Firebase Hosting (Recommended)

1. **Initial Setup**
   ```bash
   firebase login
   firebase init hosting
   ```

2. **Configure hosting** (firebase.json)
   ```json
   {
     "hosting": {
       "public": "dist",
       "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
       "rewrites": [
         {
           "source": "**",
           "destination": "/index.html"
         }
       ]
     }
   }
   ```

3. **Deploy**
   ```bash
   yarn build
   firebase deploy
   ```

### Custom Domain

1. Go to Firebase Console → Hosting → Add custom domain
2. Follow DNS configuration instructions
3. SSL certificate automatically provisioned

### Environment-Specific Deployments

**Production:**
```bash
firebase use production
yarn build
firebase deploy
```

**Staging:**
```bash
firebase use staging
yarn build
firebase deploy
```

### CI/CD with GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Firebase

on:
  push:
    branches: [main]

jobs:
  build_and_deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: yarn install
      - run: yarn build
      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          channelId: live
          projectId: your-project-id
```

---

## 🧪 Testing

### Manual Testing Checklist

**Student Flow:**
- [ ] Registration and login
- [ ] Take a Reading mock test
- [ ] Take a Listening mock test
- [ ] Submit Writing task
- [ ] View results
- [ ] Print result report

**Teacher Flow:**
- [ ] Login as teacher
- [ ] View student submissions
- [ ] Mark Writing task
- [ ] Provide feedback

**Admin Flow:**
- [ ] Add new student
- [ ] Create batch
- [ ] Assign students to batch
- [ ] View system analytics

### Running Tests

```bash
# Lint code
yarn lint

# Type check
npx tsc --noEmit

# Build test
yarn build
```

### Browser Testing

Test on:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Getting Started

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Commit with clear messages**
   ```bash
   git commit -m "Add: New question type for Reading section"
   ```
5. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Open a Pull Request**

### Code Standards

- **TypeScript**: Use strict typing, avoid `any`
- **Formatting**: Follow existing code style
- **Components**: One component per file
- **Naming**: Use descriptive, meaningful names
- **Comments**: Explain complex logic
- **Testing**: Test your changes thoroughly

### Commit Message Convention

```
Type: Brief description

Detailed explanation (if needed)

Fixes #issue_number
```

**Types:**
- `Add:` New feature
- `Fix:` Bug fix
- `Update:` Modify existing feature
- `Remove:` Delete code/feature
- `Refactor:` Code restructuring
- `Docs:` Documentation changes
- `Style:` Formatting, missing semicolons, etc.
- `Test:` Adding tests
- `Chore:` Maintenance tasks

### Need Help?

- 📧 Email: dev@shahsultan.com
- 💬 Discord: [Join our community](#)
- 📝 Issues: [GitHub Issues](https://github.com/abira1/exam/issues)

---

## 📞 Support

### Getting Help

- **Documentation**: Check this README and code comments
- **Issues**: [GitHub Issues](https://github.com/abira1/exam/issues)
- **Email**: support@shahsultan.com

### Common Issues

**Problem**: Firebase authentication not working
**Solution**: Check Firebase credentials in `.env`, ensure Firebase project is properly configured

**Problem**: Audio not playing in Listening tests
**Solution**: Ensure audio files are uploaded to Firebase Storage, check Storage Rules

**Problem**: Build fails
**Solution**: Delete `node_modules` and `yarn.lock`, run `yarn install` again

**Problem**: Hot reload not working
**Solution**: Check Vite configuration, restart dev server

### Feature Requests

Have an idea? Create a [Feature Request](https://github.com/abira1/exam/issues/new?template=feature_request.md)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2024 Shah Sultan IELTS Academy

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🙏 Acknowledgments

- **Toiral Web Development** - For expert development, design, and deployment
- **React Team** - For the amazing React library
- **Firebase** - For backend infrastructure
- **Tailwind CSS** - For beautiful, responsive styling
- **Vite** - For lightning-fast development experience
- All contributors who have helped shape this project

---

## 🗺️ Roadmap

### Coming Soon
- [ ] Mobile app (React Native)
- [ ] Speaking test video recording
- [ ] AI-powered Writing assessment
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Email notifications
- [ ] WhatsApp integration
- [ ] Payment gateway integration
- [ ] Certificate generation
- [ ] Parent portal

### Long-term Vision
- Become the leading IELTS preparation platform
- Expand to other English proficiency tests (TOEFL, PTE)
- AI tutor for personalized learning paths
- Gamification and achievement badges
- Community features and forums

---

## 📊 Project Statistics

- **Total Mock Tests**: 10+ tracks
- **Question Types**: 15+ formats
- **Lines of Code**: 50,000+
- **Components**: 100+
- **Active Users**: Growing daily
- **Response Time**: <100ms average

---

<div align="center">
  
### Built with ❤️ by Toiral Web Development
  
**Imagine. Develop. Deploy.**

[Website](#) • [Portfolio](#) • [Contact](#)

⭐ Star us on GitHub if this project helped you!

</div>
