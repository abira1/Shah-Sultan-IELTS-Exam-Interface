// Track 4: 4-M Listening
import { Track } from './track1';

export const track4: Track = {
  id: 'track-4',
  name: '4-M Listening',
  description: 'IELTS Listening Practice Test - Advanced question types with drag and drop, flowchart, and map labeling',
  duration: 60,
  totalQuestions: 40,
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
              text: 'visit locations and discuss'
            },
            {
              questionNumber: 22,
              text: 'contact the _______ about roadworks'
            },
            {
              questionNumber: 23,
              text: 'plan the'
            },
            {
              questionNumber: 24,
              text: 'hold auditions and recheck availability of the'
            },
            {
              questionNumber: 25,
              text: 'choose the _______ from the volunteers'
            },
            {
              questionNumber: 26,
              text: 'rehearse, then collect _______ and organize food and transport'
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
          type: 'table-gap',
          instruction: 'Fill in the blanks.',
          title: 'Species Introduction Table',
          rows: [
            {
              label: 'Origin',
              value: 'Name | New habitat | Notes'
            },
            {
              label: 'Australia',
              value: 'red-backed spider | New Zealand and Japan | Even so island in middle of'
            },
            {
              label: '',
              value: {
                questionNumber: 31
              }
            },
            {
              label: 'England',
              value: 'rabbit | Australia | 800 years ago: imported into England to be used for'
            },
            {
              label: '',
              value: {
                questionNumber: 32
              }
            },
            {
              label: 'America',
              value: 'fire ants |'
            },
            {
              label: '',
              value: {
                questionNumber: 33
              }
            },
            {
              label: '',
              value: '| in Brisbane imported by chance'
            },
            {
              label: 'Australia',
              value: ''
            },
            {
              label: {
                questionNumber: 34
              },
              value: '| Scotland | Deliberately introduced in order to improve'
            },
            {
              label: '',
              value: {
                questionNumber: 35
              }
            },
            {
              label: '',
              value: '(not effective)'
            },
            {
              label: 'New Zealand',
              value: 'flatworm |'
            },
            {
              label: '',
              value: {
                questionNumber: 36
              }
            },
            {
              label: '',
              value: '| accidental introduction inside imported'
            },
            {
              label: '',
              value: {
                questionNumber: 37
              }
            },
            {
              label: 'Japan',
              value: ''
            },
            {
              label: {
                questionNumber: 38
              },
              value: '| Australian coastal waters | Some advantages'
            },
            {
              label: '',
              value: ''
            },
            {
              label: {
                questionNumber: 39
              },
              value: '| budgerigar | urban areas of south-east | Smaller flocks because of arrival of'
            },
            {
              label: '',
              value: {
                questionNumber: 40
              }
            },
            {
              label: '',
              value: 'in recent years'
            }
          ]
        }
      ]
    }
  ]
};
