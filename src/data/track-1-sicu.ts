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
      title: 'Demo Version',
      passage: {
        title: '📢 Important Notice',
        content: 'This is a demo version. Questions will be available very soon.'
      },
      questions: []
    }
  ]
};
