// Writing Track 1: IELTS Academic Writing Test
import { Track } from './track1';

export const trackWriting1: Track = {
  id: 'track-writing-1',
  name: 'IELTS Academic Writing Test 1',
  shortName: 'AW1',
  description: 'IELTS Academic Writing Test - Task 1 (Report) and Task 2 (Essay)',
  duration: 60,
  totalQuestions: 2, // Writing has 2 tasks, not traditional question count
  trackType: 'writing',
  audioURL: null, // Writing tracks don't use audio
  sections: [
    {
      sectionNumber: 1,
      title: 'Writing Task 1',
      questions: [
        {
          type: 'writing-task',
          taskNumber: 1,
          title: 'Academic Writing Task 1',
          instruction: 'You should spend about 20 minutes on this task.',
          prompt: `The graph below shows the percentage of households with different kinds of technology in a European country between 2010 and 2023.

Summarize the information by selecting and reporting the main features, and make comparisons where relevant.

Write at least 150 words.

[In a real exam, a graph/chart/diagram would be displayed here showing:
- Smartphone ownership: rising from 20% (2010) to 95% (2023)
- Computer ownership: relatively stable from 75% (2010) to 80% (2023)
- Tablet ownership: rising from 5% (2010) to 65% (2023)
- Smart TV ownership: rising from 10% (2010) to 70% (2023)]`,
          minWords: 150,
          maxWords: 200,
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
          title: 'Academic Writing Task 2',
          instruction: 'You should spend about 40 minutes on this task. Write about the following topic:',
          prompt: `In many countries, traditional food is being replaced by international fast food. This is having a negative effect on both families and societies.

To what extent do you agree or disagree with this opinion?

Give reasons for your answer and include any relevant examples from your own knowledge or experience.

Write at least 250 words.`,
          minWords: 250,
          timeRecommended: 40
        }
      ]
    }
  ]
};
