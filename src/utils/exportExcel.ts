import * as XLSX from 'xlsx';
import { ExamSubmission } from './storage';
import { allTracks } from '../data/tracks';

interface ExportOptions {
  type: 'all' | 'track' | 'examCode' | 'batch' | 'dateRange';
  trackId?: string;
  examCode?: string;
  batchId?: string;
  startDate?: string;
  endDate?: string;
  filename?: string;
}

/**
 * Export submissions to Excel format
 */
export const exportToExcel = (submissions: ExamSubmission[], options: ExportOptions = { type: 'all' }) => {
  if (submissions.length === 0) {
    alert('No submissions to export');
    return;
  }

  // Prepare data for Excel
  const excelData = submissions.map((submission) => {
    const track = allTracks.find(t => t.id === submission.trackId);
    const stats = calculateSectionStats(submission);
    
    return {
      'Student ID': submission.studentId || 'N/A',
      'Student Name': submission.studentName || 'N/A',
      'Email': '-', // Will be populated from student data if available
      'Batch': submission.batchId || 'N/A',
      'Exam Code': submission.examCode || 'N/A',
      'Track': track?.name || submission.trackName || 'N/A',
      'Date': new Date(submission.submittedAt).toLocaleDateString(),
      'Time': new Date(submission.submittedAt).toLocaleTimeString(),
      'Total Score': `${stats.correct}/40`,
      'Section 1 (Q1-10)': `${stats.section1}/10`,
      'Section 2 (Q11-20)': `${stats.section2}/10`,
      'Section 3 (Q21-30)': `${stats.section3}/10`,
      'Section 4 (Q31-40)': `${stats.section4}/10`,
      'Percentage': `${stats.percentage}%`,
      'Status': submission.resultPublished ? 'Published' : (submission.marks ? 'Graded' : 'Pending'),
      'Graded By': submission.markedBy || '-',
      'Graded At': submission.marks ? new Date(submission.submittedAt).toLocaleDateString() : '-',
      'Published At': submission.publishedAt ? new Date(submission.publishedAt).toLocaleDateString() : '-',
      'Time Spent': submission.timeSpent || 'N/A'
    };
  });

  // Create workbook and worksheet
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(excelData);

  // Set column widths for better readability
  const columnWidths = [
    { wch: 15 }, // Student ID
    { wch: 25 }, // Student Name
    { wch: 30 }, // Email
    { wch: 15 }, // Batch
    { wch: 18 }, // Exam Code
    { wch: 20 }, // Track
    { wch: 12 }, // Date
    { wch: 12 }, // Time
    { wch: 12 }, // Total Score
    { wch: 15 }, // Section 1
    { wch: 15 }, // Section 2
    { wch: 15 }, // Section 3
    { wch: 15 }, // Section 4
    { wch: 12 }, // Percentage
    { wch: 12 }, // Status
    { wch: 20 }, // Graded By
    { wch: 15 }, // Graded At
    { wch: 15 }, // Published At
    { wch: 12 }, // Time Spent
  ];
  ws['!cols'] = columnWidths;

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(wb, ws, 'Submissions');

  // Generate filename
  const filename = generateFilename(options);

  // Save file
  XLSX.writeFile(wb, filename);
};

/**
 * Calculate section-wise statistics for a submission
 */
const calculateSectionStats = (submission: ExamSubmission) => {
  let section1 = 0, section2 = 0, section3 = 0, section4 = 0;
  let correct = 0;
  const totalQs = submission.totalQuestions || 40;
  const isWriting = submission.trackType === 'writing' && totalQs === 2;

  if (submission.marks) {
    if (isWriting) {
      // For writing tracks, count task marks
      if (submission.marks['task1'] === 'correct') correct++;
      if (submission.marks['task2'] === 'correct') correct++;
    } else {
      // For reading/listening tracks with numbered questions
      for (let i = 1; i <= totalQs; i++) {
        if (submission.marks[i] === 'correct') {
          correct++;
          if (i <= 10) section1++;
          else if (i <= 20) section2++;
          else if (i <= 30) section3++;
          else section4++;
        }
      }
    }
  }

  const percentage = submission.manualScore || Math.round((correct / totalQs) * 100);

  return { section1, section2, section3, section4, correct, percentage };
};

/**
 * Generate filename based on export options
 */
const generateFilename = (options: ExportOptions): string => {
  if (options.filename) {
    return options.filename.endsWith('.xlsx') ? options.filename : `${options.filename}.xlsx`;
  }

  const timestamp = new Date().toISOString().split('T')[0];
  
  switch (options.type) {
    case 'track':
      const track = allTracks.find(t => t.id === options.trackId);
      return `ShahSultan_Submissions_${track?.name.replace(/\s+/g, '_')}_${timestamp}.xlsx`;
    case 'examCode':
      return `ShahSultan_Submissions_${options.examCode}_${timestamp}.xlsx`;
    case 'batch':
      return `ShahSultan_Submissions_Batch_${options.batchId}_${timestamp}.xlsx`;
    case 'dateRange':
      return `ShahSultan_Submissions_${options.startDate}_to_${options.endDate}.xlsx`;
    default:
      return `ShahSultan_All_Submissions_${timestamp}.xlsx`;
  }
};

/**
 * Export summary statistics to Excel
 */
export const exportSummaryToExcel = (submissions: ExamSubmission[], groupBy: 'track' | 'batch' | 'examCode') => {
  if (submissions.length === 0) {
    alert('No submissions to export');
    return;
  }

  const grouped: Record<string, ExamSubmission[]> = {};
  
  submissions.forEach(sub => {
    let key: string;
    if (groupBy === 'track') {
      key = sub.trackName || 'Unknown Track';
    } else if (groupBy === 'batch') {
      key = sub.batchId || 'Unknown Batch';
    } else {
      key = sub.examCode || 'Unknown Exam';
    }
    
    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(sub);
  });

  const summaryData = Object.keys(grouped).map(key => {
    const subs = grouped[key];
    const graded = subs.filter(s => s.marks && Object.keys(s.marks).length > 0);
    const published = subs.filter(s => s.resultPublished);
    const avgScore = graded.length > 0 
      ? Math.round(graded.reduce((acc, s) => acc + (s.manualScore || 0), 0) / graded.length)
      : 0;

    return {
      [groupBy === 'track' ? 'Track' : groupBy === 'batch' ? 'Batch' : 'Exam Code']: key,
      'Total Submissions': subs.length,
      'Graded': graded.length,
      'Published': published.length,
      'Pending': subs.length - graded.length,
      'Average Score': `${avgScore}%`
    };
  });

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(summaryData);
  
  ws['!cols'] = [
    { wch: 25 },
    { wch: 18 },
    { wch: 12 },
    { wch: 12 },
    { wch: 12 },
    { wch: 15 }
  ];

  XLSX.utils.book_append_sheet(wb, ws, 'Summary');

  const timestamp = new Date().toISOString().split('T')[0];
  XLSX.writeFile(wb, `ShahSultan_Summary_${groupBy}_${timestamp}.xlsx`);
};

/**
 * Export student performance report
 */
export const exportStudentReport = (studentId: string, submissions: ExamSubmission[]) => {
  const studentSubmissions = submissions.filter(s => s.studentId === studentId);
  
  if (studentSubmissions.length === 0) {
    alert('No submissions found for this student');
    return;
  }

  const reportData = studentSubmissions.map(sub => {
    const stats = calculateSectionStats(sub);
    const track = allTracks.find(t => t.id === sub.trackId);
    
    return {
      'Date': new Date(sub.submittedAt).toLocaleDateString(),
      'Exam Code': sub.examCode || 'N/A',
      'Track': track?.name || sub.trackName,
      'Score': `${stats.correct}/40`,
      'Percentage': `${stats.percentage}%`,
      'Section 1': `${stats.section1}/10`,
      'Section 2': `${stats.section2}/10`,
      'Section 3': `${stats.section3}/10`,
      'Section 4': `${stats.section4}/10`,
      'Status': sub.resultPublished ? 'Published' : 'Pending'
    };
  });

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(reportData);
  
  ws['!cols'] = [
    { wch: 12 },
    { wch: 18 },
    { wch: 20 },
    { wch: 12 },
    { wch: 12 },
    { wch: 12 },
    { wch: 12 },
    { wch: 12 },
    { wch: 12 },
    { wch: 12 }
  ];

  XLSX.utils.book_append_sheet(wb, ws, 'Student Report');

  const studentName = studentSubmissions[0].studentName || studentId;
  const timestamp = new Date().toISOString().split('T')[0];
  XLSX.writeFile(wb, `ShahSultan_${studentName}_Report_${timestamp}.xlsx`);
};
