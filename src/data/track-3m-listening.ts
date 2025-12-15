// Track: 3-M Listening
import { Track } from './track1';

export const track3MListening: Track = {
  id: 'track-3m-listening',
  name: '3-M Listening',
  shortName: '3M',
  description: 'IELTS Listening Practice Test - Comprehensive listening with multiple question types',
  duration: 60,
  totalQuestions: 40,
  trackType: 'listening',
  audioURL: null, // To be uploaded via admin panel
  sections: [
    {
      sectionNumber: 1,
      title: 'Questions 1-10',
      questions: [
        {
          type: 'multi-column-table',
          instruction: 'Write NO MORE THAN TWO WORDS AND/OR NUMBERS for each answer.',
          title: 'Basic Details of Project',
          headers: ['', ''],
          rows: [
            {
              cells: [
                { content: 'Example Pre-phase' },
                { content: 'involves selecting rooms & (1)..............' }
              ]
            },
            {
              cells: [
                { content: 'Phase 1:' },
                { content: 'time needed: 3 days\nstaff involved: Jenna, Marco, & (2)..............' }
              ]
            },
            {
              cells: [
                { content: 'Phase 2:' },
                { content: 'time needed: (3)..............\nstaff involved: (4).............., with assistance\nfrom (5)..............' }
              ]
            }
          ]
        },
        {
          type: 'multiple-choice',
          questionNumber: 6,
          question: 'The main form of data collection will be',
          options: [
            { label: 'questionnaires.', value: 'A' },
            { label: 'Internet polling.', value: 'B' },
            { label: 'face-to-face interviews.', value: 'C' }
          ]
        },
        {
          type: 'multiple-choice',
          questionNumber: 7,
          question: 'To finish in time, the staff will have to',
          options: [
            { label: 'work late.', value: 'A' },
            { label: 'come in early.', value: 'B' },
            { label: 'take some work home.', value: 'C' }
          ]
        },
        {
          type: 'multiple-choice',
          questionNumber: 8,
          question: 'The final report will contain',
          options: [
            { label: 'three appendices.', value: 'A' },
            { label: 'material from the company website.', value: 'B' },
            { label: 'a supplementary booklet.', value: 'C' }
          ]
        },
        {
          type: 'multiple-choice',
          questionNumber: 9,
          question: 'The final report will be handed in on the',
          options: [
            { label: '5th.', value: 'A' },
            { label: '15th.', value: 'B' },
            { label: '25th.', value: 'C' }
          ]
        },
        {
          type: 'multiple-choice',
          questionNumber: 10,
          question: 'At the end, there will be',
          options: [
            { label: 'an office party.', value: 'A' },
            { label: 'a restaurant dinner.', value: 'B' },
            { label: 'presents for all involved.', value: 'C' }
          ]
        }
      ]
    },
    {
      sectionNumber: 2,
      title: 'Questions 11-20',
      questions: [
        {
          type: 'drag-and-drop',
          instruction: 'Write the correct letter, A-F, for each answer.',
          imageUrl: 'https://customer-assets.emergentagent.com/job_2eeda228-d9c9-4ac9-8d52-1d54bbc472a9/artifacts/pr4w5mld_Image%201.png',
          imageTitle: 'Schedule of Repairs',
          items: [
            { questionNumber: 11, label: '(11) ..............' },
            { questionNumber: 12, label: '(12) ..............' },
            { questionNumber: 13, label: '(13) ..............' },
            { questionNumber: 14, label: '(14) ..............' },
            { questionNumber: 15, label: '(15) ..............' }
          ],
          options: [
            { label: 'Birds in ceiling', value: 'A' },
            { label: 'Broken windows', value: 'B' },
            { label: 'Electrical fault', value: 'C' },
            { label: 'Fallen tree', value: 'D' },
            { label: 'Leaking roof', value: 'E' },
            { label: 'Leaking roof', value: 'F' }
          ]
        },
        {
          type: 'sentence-completion',
          instruction: 'Write NO MORE THAN TWO WORDS for each answer.',
          items: [
            { questionNumber: 16, text: 'The stained walls will be painted (16)…………………' },
            { questionNumber: 17, text: 'Extra paint will be left in the (17)…………………' },
            { questionNumber: 18, text: 'The baby birds will be given to a (18)…………………' },
            { questionNumber: 19, text: 'The fallen tree will be used as (19)…………………' },
            { questionNumber: 20, text: 'The smaller parts of the tree will be put in a (20)…………………' }
          ]
        }
      ]
    },
    {
      sectionNumber: 3,
      title: 'Questions 21-30',
      questions: [
        {
          type: 'multi-column-table',
          instruction: 'Write NO MORE THAN TWO WORDS for each answer.',
          title: '',
          headers: ['Subject', 'Textbook Used', 'Criticism of this book'],
          rows: [
            {
              cells: [
                { content: 'Social History' },
                { content: { questionNumber: 21 } },
                { content: 'It is (22)..............' }
              ]
            },
            {
              cells: [
                { content: 'Cultural Studies' },
                { content: { questionNumber: 23 } },
                { content: 'It (24).................' }
              ]
            },
            {
              cells: [
                { content: { questionNumber: 25 } },
                { content: 'Government in Action' },
                { content: 'It is (26)..............' }
              ]
            }
          ]
        },
        {
          type: 'dropdown',
          instruction: 'Choose the correct Answer.\n\nWhat are the speakers\' favorite subjects?',
          items: [
            { questionNumber: 27, statement: 'Steve' },
            { questionNumber: 28, statement: 'David' },
            { questionNumber: 29, statement: 'Susan' },
            { questionNumber: 30, statement: 'Olive' }
          ],
          options: [
            { label: 'Social History', value: 'Social History' },
            { label: 'Cultural Studies', value: 'Cultural Studies' },
            { label: 'Political Theory', value: 'Political Theory' }
          ]
        }
      ]
    },
    {
      sectionNumber: 4,
      title: 'Questions 31-40',
      questions: [
        {
          type: 'multiple-choice',
          questionNumber: 31,
          question: 'Originally, country',
          options: [
            { label: 'required fewer workers.', value: 'A' },
            { label: 'had lots of animals.', value: 'B' },
            { label: 'were more interesting places.', value: 'C' }
          ]
        },
        {
          type: 'multiple-choice',
          questionNumber: 32,
          question: 'Now, the problems there',
          options: [
            { label: 'can be solved.', value: 'A' },
            { label: 'are numerous.', value: 'B' },
            { label: 'are expected.', value: 'C' }
          ]
        },
        {
          type: 'multiple-choice-multi-select',
          instruction: 'Choose THREE answers from the list.',
          question: 'Which THREE factors are typical of modern farming?',
          questionNumbers: [33, 34, 35],
          maxSelections: 3,
          options: [
            { label: 'A. Many overheads', value: 'A' },
            { label: 'B. More machines', value: 'B' },
            { label: 'C. Fewer types of products', value: 'C' },
            { label: 'D. More frequent feeding', value: 'D' },
            { label: 'E. Greater numbers of products', value: 'E' },
            { label: 'F. More factories', value: 'F' }
          ]
        },
        {
          type: 'multi-column-table',
          instruction: 'Complete the table.',
          title: '',
          headers: ['Possible Solution', 'Important Factor', 'Examples'],
          rows: [
            {
              cells: [
                { content: 'tourism' },
                { content: 'Locals must (36)...........' },
                { content: 'Daylesford area uses its (37)..............' }
              ]
            },
            {
              cells: [
                { content: 'using the (38)..............' },
                { content: '- is (39)............. by its distinctive product\n- must market the idea effectively' },
                { content: 'Shepparton is known for its (40)..............' }
              ]
            }
          ]
        }
      ]
    }
  ]
};
