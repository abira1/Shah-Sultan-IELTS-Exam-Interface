// Track 4: 4-M Listening
import { Track } from './track1';

export const track4: Track = {
  id: 'track-4',
  name: '4-M Listening',
  shortName: '4M',
  description: 'IELTS Listening Practice Test - Advanced question types with drag and drop, flowchart, and map labeling',
  duration: 60,
  totalQuestions: 40,
  trackType: 'listening',
  audioURL: null,
  sections: [
    {
      sectionNumber: 1,
      title: 'Questions 1-10',
      questions: [
        {
          type: 'table-gap',
          instruction: 'Write NO MORE THAN THREE WORDS AND/OR A NUMBER for each answer.',
          title: 'Holiday Information',
          rows: [
            {
              label: 'Most suitable holiday lasts 10 days.',
              value: ''
            },
            {
              label: 'Holiday begins on',
              value: {
                questionNumber: 1
              }
            },
            {
              label: 'No more than _______ people in the cycling group.',
              value: {
                questionNumber: 2
              }
            },
            {
              label: 'Each day, group cycles _______ on average.',
              value: {
                questionNumber: 3
              }
            },
            {
              label: 'Some of the hotels have a',
              value: {
                questionNumber: 4
              }
            },
            {
              label: 'Holidays cost £_______ per person without flights.',
              value: {
                questionNumber: 5
              }
            },
            {
              label: 'All food included except',
              value: {
                questionNumber: 6
              }
            },
            {
              label: 'Essential to bring a',
              value: {
                questionNumber: 7
              }
            },
            {
              label: 'Discount possible on equipment at www._______.com',
              value: {
                questionNumber: 8
              }
            },
            {
              label: 'Possible that the _______ may change.',
              value: {
                questionNumber: 9
              }
            },
            {
              label: 'Guided tour of a _______ is arranged.',
              value: {
                questionNumber: 10
              }
            }
          ]
        }
      ]
    },
    {
      sectionNumber: 2,
      title: 'Questions 11-20',
      questions: [
        {
          type: 'multiple-choice',
          questionNumber: 11,
          question: 'The market is now situated',
          options: [
            {
              label: 'under a car park.',
              value: 'A'
            },
            {
              label: 'beside the cathedral.',
              value: 'B'
            },
            {
              label: 'near the river.',
              value: 'C'
            }
          ]
        },
        {
          type: 'multiple-choice',
          questionNumber: 12,
          question: 'On only one day a week the market sells',
          options: [
            {
              label: 'antique furniture.',
              value: 'A'
            },
            {
              label: 'local produce.',
              value: 'B'
            },
            {
              label: 'hand-made items.',
              value: 'C'
            }
          ]
        },
        {
          type: 'multiple-choice',
          questionNumber: 13,
          question: 'The area is well known for',
          options: [
            {
              label: 'ice cream.',
              value: 'A'
            },
            {
              label: 'a cake.',
              value: 'B'
            },
            {
              label: 'a fish dish.',
              value: 'C'
            }
          ]
        },
        {
          type: 'multiple-choice',
          questionNumber: 14,
          question: 'What change has taken place in the harbour area?',
          options: [
            {
              label: 'Fish can now be bought from the fishermen.',
              value: 'A'
            },
            {
              label: 'The restaurants have moved to a different part.',
              value: 'B'
            },
            {
              label: 'There are fewer restaurants than there used to be.',
              value: 'C'
            }
          ]
        },
        {
          type: 'drag-and-drop',
          instruction: 'Choose SIX answers from the box and write the correct letter, A-H, next to questions 15-20.',
          items: [
            {
              questionNumber: 15,
              label: 'Merrivales'
            },
            {
              questionNumber: 16,
              label: 'The Lobster Pot'
            },
            {
              questionNumber: 17,
              label: 'Elliots'
            },
            {
              questionNumber: 18,
              label: 'The Cabin'
            },
            {
              questionNumber: 19,
              label: 'The Olive Tree'
            },
            {
              questionNumber: 20,
              label: 'The Old School Restaurant'
            }
          ],
          options: [
            {
              label: 'the decoration',
              value: 'A'
            },
            {
              label: 'easy parking',
              value: 'B'
            },
            {
              label: 'entertainment',
              value: 'C'
            },
            {
              label: 'excellent service',
              value: 'D'
            },
            {
              label: 'good value',
              value: 'E'
            },
            {
              label: 'good views',
              value: 'F'
            },
            {
              label: 'quiet location',
              value: 'G'
            },
            {
              label: 'wide menu',
              value: 'H'
            }
          ]
        }
      ]
    },
    {
      sectionNumber: 3,
      title: 'Questions 21-30',
      questions: [
        {
          type: 'flowchart',
          instruction: 'Choose SIX answers from the box and write the correct letter, A-I, next to questions 21-26.',
          title: 'FILM PROJECT',
          steps: [
            {
              questionNumber: 21,
              text: 'Visit locations and discuss (21).............'
            },
            {
              questionNumber: 22,
              text: 'Contact the (22)............. about roadworks'
            },
            {
              questionNumber: 23,
              text: 'Plan the (23).............'
            },
            {
              questionNumber: 24,
              text: 'Hold auditions and recheck availability of the (24).............'
            },
            {
              questionNumber: 25,
              text: 'Choose the (25)............. from the volunteers'
            },
            {
              text: 'Rehearse',
              isPlainText: true
            },
            {
              questionNumber: 26,
              text: 'Collect (26)............. and organize food and transport'
            }
          ],
          options: [
            {
              label: 'actors',
              value: 'A'
            },
            {
              label: 'furniture',
              value: 'B'
            },
            {
              label: 'background noise',
              value: 'C'
            },
            {
              label: 'costumes',
              value: 'D'
            },
            {
              label: 'local council',
              value: 'E'
            },
            {
              label: 'equipment',
              value: 'F'
            },
            {
              label: 'shooting schedule',
              value: 'G'
            },
            {
              label: 'understudies',
              value: 'H'
            },
            {
              label: 'shopowners',
              value: 'I'
            }
          ]
        },
        {
          type: 'map-labeling',
          instruction: 'Choose four answers from the box and write the correct letter, A-G, next to questions 27-30.',
          imageUrl: 'https://customer-assets.emergentagent.com/job_e7c6a0ba-b2d7-4b56-8790-56a95d12cce7/artifacts/k8ezfdlm_Old%20water-mill.png',
          labels: [
            {
              questionNumber: 27,
              position: { x: 55, y: 15 }
            },
            {
              questionNumber: 28,
              position: { x: 75, y: 65 }
            },
            {
              questionNumber: 29,
              position: { x: 25, y: 35 }
            },
            {
              questionNumber: 30,
              position: { x: 15, y: 65 }
            }
          ],
          options: [
            {
              label: 'lights',
              value: 'A'
            },
            {
              label: 'fixed camera',
              value: 'B'
            },
            {
              label: 'mirror',
              value: 'C'
            },
            {
              label: 'torches',
              value: 'D'
            },
            {
              label: 'wooden screen',
              value: 'E'
            },
            {
              label: 'bike',
              value: 'F'
            },
            {
              label: 'large box',
              value: 'G'
            }
          ]
        }
      ]
    },
    {
      sectionNumber: 4,
      title: 'Questions 31-40',
      questions: [
        {
          type: 'multi-column-table',
          instruction: 'Fill in the blanks.',
          title: 'EXOTIC PESTS',
          headers: ['Origin', 'Name', 'New habitat', 'Notes'],
          rows: [
            {
              cells: [
                { content: 'Australia' },
                { content: 'red-backed spider' },
                { content: 'New Zealand and Japan' },
                { content: 'Even so island in middle of (31)............' }
              ]
            },
            {
              cells: [
                { content: 'England' },
                { content: 'rabbit' },
                { content: 'Australia' },
                { content: '800 years ago: imported into England to be used for (32)............' }
              ]
            },
            {
              cells: [
                { content: 'America' },
                { content: 'fire ants' },
                { content: '(33).............. in Brisbane' },
                { content: 'imported by chance' }
              ]
            },
            {
              cells: [
                { content: 'Australia' },
                { content: { questionNumber: 34 } },
                { content: 'Scotland' },
                { content: 'Deliberately introduced in order to improve (35).............. (not effective)' }
              ]
            },
            {
              cells: [
                { content: 'New Zealand' },
                { content: 'flatworm' },
                { content: '(36).............. Europe' },
                { content: 'accidental introduction inside imported (37)..............' }
              ]
            },
            {
              cells: [
                { content: 'Japan' },
                { content: { questionNumber: 38 } },
                { content: 'Australian coastal waters' },
                { content: 'Some advantages' }
              ]
            },
            {
              cells: [
                { content: 'Australia' },
                { content: 'budgerigar' },
                { content: 'urban areas of south-east (39)..............' },
                { content: 'Smaller flocks because of arrival of (40).............. in recent years' }
              ]
            }
          ]
        }
      ]
    }
  ]
};
