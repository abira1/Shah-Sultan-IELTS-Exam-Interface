// Track: 5-M Listening
import { Track } from './track1';

export const track5MListening: Track = {
  id: 'track-5m-listening',
  name: '5-M Listening',
  shortName: '5M',
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
          instruction: 'Write NO MORE THAN TWO WORDS for each answer.',
          title: '',
          headers: ['Position', 'Place', 'Notes'],
          rows: [
            {
              cells: [
                { content: { questionNumber: 1 } },
                { content: 'Parkview Hotel' },
                { content: '- Speak foreign languages\n- Have a valid ' + { questionNumber: 2 } + '\n- Include ' + { questionNumber: 3 } }
              ]
            },
            {
              cells: [
                { content: 'General Assistant' },
                { content: 'Lakeside Hotel' },
                { content: '- Pay is low\n- Free ' + { questionNumber: 4 } + '\n- Issue a ' + { questionNumber: 5 } }
              ]
            },
            {
              cells: [
                { content: 'Catering Assistant' },
                { content: 'Hotel 98' },
                { content: '- Wear ' + { questionNumber: 6 } + '\n- Night shift work\n- Travel outside the city' }
              ]
            }
          ]
        },
        {
          type: 'flowchart',
          instruction: 'Write NO MORE THAN THREE WORDS for each answer.',
          title: 'RECRUITMENT PROCESS',
          steps: [
            {
              questionNumber: 7,
              text: 'STEP ONE: Complete a'
            },
            {
              questionNumber: 8,
              text: 'STEP TWO: Do a ______________ about personal skills'
            },
            {
              questionNumber: 9,
              text: 'STEP THREE: Participate a training course involving'
            },
            {
              questionNumber: 10,
              text: 'STEP FOUR: Get a ______________ about the work'
            }
          ],
          options: []
        }
      ]
    },
    {
      sectionNumber: 2,
      title: 'Questions 11-20',
      questions: [
        {
          type: 'paragraph-gap',
          instruction: 'Write NO MORE THAN THREE WORDS AND/OR A NUMBER for each answer.',
          paragraph: 'REGISTRATION OF FOREIGN NATIONALS AT THE HEALTH CENTER STANDARD PROCEDURES\n\nRegister as a (11)__________\n\nFill in a medical history form with details of previous illness, (12)__________ surgeries and (13)__________\n\nComplete a (14)__________ with personal information such as name, address and telephone number.',
          questionNumbers: [11, 12, 13, 14]
        },
        {
          type: 'multiple-choice',
          questionNumber: 15,
          question: 'The nurse can help you with',
          options: [
            { label: 'minor operation', value: 'A' },
            { label: 'all sorts of remedy', value: 'B' },
            { label: 'a small injury', value: 'C' }
          ]
        },
        {
          type: 'multiple-choice',
          questionNumber: 16,
          question: "You don't have to pay for the chiropodist if",
          options: [
            { label: 'you have registered at the health center', value: 'A' },
            { label: 'you are in your late sixties', value: 'B' },
            { label: 'you have foot trauma', value: 'C' }
          ]
        },
        {
          type: 'multiple-choice',
          questionNumber: 17,
          question: 'In case of emergency',
          options: [
            { label: 'you can ask for a home visit', value: 'A' },
            { label: 'you must go to the hospital directly', value: 'B' },
            { label: 'you should have an open surgery', value: 'C' }
          ]
        },
        {
          type: 'multiple-choice',
          questionNumber: 18,
          question: 'On Friday afternoons',
          options: [
            { label: "you don't need to wait for a long time", value: 'A' },
            { label: "you don't need to make an appointment", value: 'B' },
            { label: 'you ought not to come at a specified time', value: 'C' }
          ]
        },
        {
          type: 'multiple-choice',
          questionNumber: 19,
          question: 'If you require a repeat prescription',
          options: [
            { label: 'you have to see the doctor again', value: 'A' },
            { label: 'you need a special form', value: 'B' },
            { label: 'you can get one from the chemist', value: 'C' }
          ]
        },
        {
          type: 'multiple-choice',
          questionNumber: 20,
          question: "In which case you needn't pay for the prescription",
          options: [
            { label: 'if you are a student', value: 'A' },
            { label: 'if you are unemployed or very poor', value: 'B' },
            { label: 'if you are pregnant', value: 'C' }
          ]
        }
      ]
    },
    {
      sectionNumber: 3,
      title: 'Questions 21-30',
      questions: [
        {
          type: 'sentence-completion',
          instruction: 'Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
          items: [
            {
              questionNumber: 21,
              text: 'People domesticate bees for honey and'
            },
            {
              questionNumber: 22,
              text: 'Commercial crops such as almond, cherry, __________, water melon, cucumber, depend on pollination.'
            },
            {
              questionNumber: 23,
              text: 'Animal pollination contributes __________ dollars a year to world agriculture.'
            }
          ]
        },
        {
          type: 'multiple-choice-multi-select',
          instruction: 'Choose TWO letters, A–D.',
          question: 'According to the professor, what factors have affected pollinator populations?',
          questionNumbers: [24, 25],
          maxSelections: 2,
          options: [
            { label: 'A. Parasites', value: 'A' },
            { label: 'B. Air pollution', value: 'B' },
            { label: 'C. Hunting', value: 'C' },
            { label: 'D. Farm chemicals', value: 'D' }
          ]
        },
        {
          type: 'drag-and-drop',
          instruction: 'Choose the correct letter, A–F.',
          items: [
            { questionNumber: 26, label: 'Monarch butterfly' },
            { questionNumber: 27, label: 'Indian subcontinent butterflies' },
            { questionNumber: 28, label: 'Spectacular tropical butterflies' },
            { questionNumber: 29, label: 'Long-nosed bat' }
          ],
          options: [
            { label: 'It pollinates four out of five food crops in North America.', value: 'A' },
            { label: 'It has been mistaken for a similar animal.', value: 'B' },
            { label: 'It feeds on the nectar of lavender.', value: 'C' },
            { label: 'It has been affected by environmental alteration.', value: 'D' },
            { label: 'It has been smuggling traded.', value: 'E' },
            { label: 'It returns to the specific site every year.', value: 'F' }
          ]
        },
        {
          type: 'multiple-choice',
          questionNumber: 30,
          question: 'What can be done to protect pollinators?',
          options: [
            { label: 'Beekeeping needs to focus on honey production.', value: 'A' },
            { label: 'People should use a more organic approach to cultivation.', value: 'B' },
            { label: 'Scientists should exploit more wild plants.', value: 'C' }
          ]
        }
      ]
    },
    {
      sectionNumber: 4,
      title: 'Questions 31-40',
      questions: [
        {
          type: 'paragraph-gap',
          instruction: 'Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
          paragraph: 'THE LONDON EYE\n\nThe London Eye, or (31)__________ Wheel is an extremely large passenger-carrying Ferris wheel situated on the banks of the (32)__________ in Central London in the United Kingdom. It attracts (33)__________ people annually. Back in 2000, (34)__________ was the main sponsor. Today, the London Eye is operated by the London Eye Company Limited, a Merlin Entertainments Group Company. Standing at a height of (35)__________ is the largest Ferris wheel in Europe, and has become the most popular paid tourist attraction in the United Kingdom, visited by over three million people in one year.',
          questionNumbers: [31, 32, 33, 34, 35]
        },
        {
          type: 'map-text-input',
          instruction: 'Write NO MORE THAN TWO WORDS for each answer.',
          imageUrl: 'https://customer-assets.emergentagent.com/job_96d956d1-23db-4c01-8768-4cd7c9e85010/artifacts/2pez9v97_5-m%20image%202.jpg',
          labels: [
            { questionNumber: 36, position: { x: 15, y: 85 } },
            { questionNumber: 37, position: { x: 30, y: 50 } },
            { questionNumber: 38, position: { x: 35, y: 25 } },
            { questionNumber: 39, position: { x: 75, y: 25 } },
            { questionNumber: 40, position: { x: 70, y: 75 } }
          ]
        }
      ]
    }
  ]
};
