export interface ExamSubmission {
  id: string;
  studentId: string;
  studentName: string;
  trackName: string;
  answers: Record<number, string>;
  submittedAt: string;
  timeSpent: string;
  status: 'completed';
  score?: number;
  marks?: Record<number, 'correct' | 'incorrect' | null>;
  manualScore?: number;
  resultPublished?: boolean;
  publishedAt?: string;
  markedBy?: string;
}
export const storage = {
  getSubmissions(): ExamSubmission[] {
    const data = localStorage.getItem('examSubmissions');
    return data ? JSON.parse(data) : [];
  },
  addSubmission(submission: ExamSubmission): void {
    const submissions = this.getSubmissions();
    submissions.push(submission);
    localStorage.setItem('examSubmissions', JSON.stringify(submissions));
  },
  updateSubmission(submissionId: string, updates: Partial<ExamSubmission>): void {
    const submissions = this.getSubmissions();
    const index = submissions.findIndex(s => s.id === submissionId);
    if (index !== -1) {
      submissions[index] = { ...submissions[index], ...updates };
      localStorage.setItem('examSubmissions', JSON.stringify(submissions));
    }
  },
  updateMark(submissionId: string, questionNumber: number, mark: 'correct' | 'incorrect' | null): void {
    const submissions = this.getSubmissions();
    const submission = submissions.find(s => s.id === submissionId);
    if (submission) {
      if (!submission.marks) {
        submission.marks = {};
      }
      submission.marks[questionNumber] = mark;
      localStorage.setItem('examSubmissions', JSON.stringify(submissions));
    }
  },
  publishResult(submissionId: string): boolean {
    const submissions = this.getSubmissions();
    const submission = submissions.find(s => s.id === submissionId);
    if (submission && submission.marks) {
      // Check if all 40 questions are marked
      const markedCount = Object.keys(submission.marks).filter(
        key => submission.marks![Number(key)] !== null
      ).length;
      
      if (markedCount === 40) {
        // Calculate manual score
        const correctCount = Object.keys(submission.marks).filter(
          key => submission.marks![Number(key)] === 'correct'
        ).length;
        
        submission.manualScore = Math.round((correctCount / 40) * 100);
        submission.resultPublished = true;
        submission.publishedAt = new Date().toISOString();
        
        localStorage.setItem('examSubmissions', JSON.stringify(submissions));
        return true;
      }
    }
    return false;
  },
  calculateManualScore(marks: Record<number, 'correct' | 'incorrect' | null>): number {
    const correctCount = Object.keys(marks).filter(
      key => marks[Number(key)] === 'correct'
    ).length;
    return Math.round((correctCount / 40) * 100);
  },
  getCurrentStudentId(): string | null {
    return localStorage.getItem('currentStudentId');
  },
  setCurrentStudentId(id: string): void {
    localStorage.setItem('currentStudentId', id);
  },
  getCurrentStudentName(): string | null {
    return localStorage.getItem('currentStudentName');
  },
  setCurrentStudentName(name: string): void {
    localStorage.setItem('currentStudentName', name);
  },
  clearCurrentStudent(): void {
    localStorage.removeItem('currentStudentId');
    localStorage.removeItem('currentStudentName');
  },
  calculateScore(answers: Record<number, string>): number {
    const answeredCount = Object.keys(answers).filter(key => answers[Number(key)].trim() !== '').length;
    return Math.round(answeredCount / 40 * 100);
  }
};