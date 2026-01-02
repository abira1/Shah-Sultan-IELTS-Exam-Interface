// SICU Track: 1-SICU (Specialized Integrated Class Unit)
// Track type: SICU - Can contain any combination of Listening, Reading, or Writing questions
import { Track } from './track1';

export const track1SICU: Track = {
  id: 'track-1-sicu',
  name: '1-SICU Integrated Skills Test',
  shortName: '1-SICU',
  description: 'SICU Practice Test - Demo version',
  duration: 45,
  totalQuestions: 0,
  trackType: 'sicu',
  audioURL: null,
  sections: [
    {
      sectionNumber: 1,
      title: 'Demo Version - Coming Soon',
      passage: {
        title: '📢 Important Notice',
        content: `Dear Students,

This is a demo version of the SICU (Specialized Integrated Class Unit) test.

The full version with comprehensive questions covering Listening, Reading, and Writing skills will be available very soon.

Thank you for your patience and understanding.

Shah Sultan IELTS Academy`
      },
      questions: []
    }
  ]
};
