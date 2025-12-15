// Writing Track: 4-M Writing
// Track type: Writing with image-based Task 1 and essay-based Task 2
import { Track } from './track1';

export const track4MWriting: Track = {
  id: 'track-4m-writing',
  name: '4-M Writing',
  shortName: '4-M',
  description: 'IELTS Academic Writing Test - Map Analysis (Task 1) and Opinion Essay (Task 2)',
  duration: 60,
  totalQuestions: 2,
  trackType: 'writing',
  audioURL: null,
  sections: [
    {
      sectionNumber: 1,
      title: 'Writing Task 1',
      questions: [
        {
          type: 'writing-task-with-image',
          taskNumber: 1,
          title: 'Writing Task 1',
          instruction: 'You should spend about 20 minutes on this task.',
          chartDescription: 'The maps below show Hunderstone town at present and a proposed plan for it.',
          chartImageURL: 'https://customer-assets.emergentagent.com/job_quick-preview-65/artifacts/qiovq7nf_4-M%20Reading.png',
          prompt: `Summarize the information by selecting and reporting the main features, and make comparisons where relevant.

Write at least 150 words.`,
          minWords: 150,
          timeRecommended: 20
        }
      ]
    },
    {
      sectionNumber: 2,
      title: 'Writing Task 2',
      questions: [
        {
          type: 'writing-task',
          taskNumber: 2,
          title: 'Writing Task 2',
          instruction: 'You should spend about 40 minutes on this task.',
          topicIntro: 'Write about the following topic:',
          prompt: `These days, a great number of children prefer spending time on computer games rather than on sports.

Why is it?
Is it a positive or negative development?`,
          closingInstruction: `Give reasons for your answer and include any relevant examples from your own knowledge or experience.

Write at least 250 words.`,
          minWords: 250,
          timeRecommended: 40
        }
      ]
    }
  ]
};
