// Writing Track: 5-M Writing
// Track type: Writing with image-based Task 1 and essay-based Task 2
import { Track } from './track1';

export const track5MWriting: Track = {
  id: 'track-5m-writing',
  name: '5-M Writing',
  shortName: '5-M',
  description: 'IELTS Academic Writing Test - Fuel Chart Analysis (Task 1) and Opinion Essay (Task 2)',
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
          chartDescription: 'The chart below shows information about fuel used in the transport sector in different countries in Europe, compared to the EU average, in 2009 and 2010.',
          chartImageURL: 'https://customer-assets.emergentagent.com/job_b9c44b1c-ad17-431b-bfaa-a9045238df95/artifacts/mu7ghsem_5-M%20Reading.png',
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
          prompt: `Some people think that planning for the future is a waste of time. They believe it is more important to focus on the present.

To what extent do you agree or disagree?`,
          closingInstruction: `Give reasons for your answer and include any relevant examples from your own knowledge or experience.

Write at least 250 words.`,
          minWords: 250,
          timeRecommended: 40
        }
      ]
    }
  ]
};
