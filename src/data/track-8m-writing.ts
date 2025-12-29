// Writing Track: 8-M Writing
// Track type: Writing with image-based Task 1 and essay-based Task 2
import { Track } from './track1';

export const track8MWriting: Track = {
  id: 'track-8m-writing',
  name: '8-M Writing',
  shortName: '8-M',
  description: 'IELTS Academic Writing Test - Table Analysis (Task 1) and Urban Problems Essay (Task 2)',
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
          chartDescription: 'The table shows the number of employees and factories producing silk in England and Wales between 1851 and 1901.',
          chartImageURL: 'https://i.postimg.cc/q7WXQ2yx/28EE20F2-D22A-4D14-B7BA-776A81C0FC12.png',
          prompt: `Summarize the information by selecting and reporting the main features, and make comparison where relevant.

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
          prompt: `People living in large cities today face many problems in their everyday life.

What are these problems? Should governments encourage people to move to smaller regional towns?`,
          closingInstruction: `Give reasons for your answer and include any relevant examples from your own knowledge or experience.

Write at least 250 words.`,
          minWords: 250,
          timeRecommended: 40
        }
      ]
    }
  ]
};
