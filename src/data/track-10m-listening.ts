// Track: 10-M Listening
import { Track } from './track1';

export const track10MListening: Track = {
  id: 'track-10m-listening',
  name: '10-M Listening',
  shortName: '10M',
  description: 'IELTS Listening Practice Test - 4 Sections with 40 questions',
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
          instruction: 'Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
          title: 'Job Enquiry',
          headers: ['', ''],
          rows: [
            {
              cells: [
                { content: 'Example Name:' },
                { content: 'Fredie Lea' }
              ]
            },
            {
              cells: [
                { content: 'Location:' },
                { content: { questionNumber: 1 } }
              ]
            },
            {
              cells: [
                { content: '' },
                { content: 'Island' }
              ]
            },
            {
              cells: [
                { content: 'Starting date:' },
                { content: { questionNumber: 2 } }
              ]
            },
            {
              cells: [
                { content: 'Age:' },
                { content: '17' }
              ]
            },
            {
              cells: [
                { content: 'Four vacancies for' },
                { content: { questionNumber: 3 } }
              ]
            },
            {
              cells: [
                { content: 'Pay:' },
                { content: '5.52 per hour' }
              ]
            },
            {
              cells: [
                { content: 'Qualities required: ability to' },
                { content: { questionNumber: 4 } }
              ]
            }
          ]
        },
        {
          type: 'multi-column-table',
          instruction: '',
          title: 'Duties:',
          headers: ['', ''],
          rows: [
            {
              cells: [
                { content: 'Offer table service' },
                { content: '' }
              ]
            },
            {
              cells: [
                { content: 'Look after' },
                { content: { questionNumber: 5 } }
              ]
            }
          ]
        },
        {
          type: 'multi-column-table',
          instruction: '',
          title: 'Extra advantage:',
          headers: ['', ''],
          rows: [
            {
              cells: [
                { content: 'ability of the candidate to' },
                { content: { questionNumber: 6 } }
              ]
            }
          ]
        },
        {
          type: 'multi-column-table',
          instruction: '',
          title: 'Benefits:',
          headers: ['', ''],
          rows: [
            {
              cells: [
                { content: 'free' },
                { content: { questionNumber: 7 } }
              ]
            },
            {
              cells: [
                { content: 'a' },
                { content: { questionNumber: 8 } }
              ]
            },
            {
              cells: [
                { content: '' },
                { content: 'will be provided' }
              ]
            }
          ]
        },
        {
          type: 'multi-column-table',
          instruction: '',
          title: 'Interview arranged for:',
          headers: ['', ''],
          rows: [
            {
              cells: [
                { content: { questionNumber: 9 } },
                { content: 'at 10:00 am' }
              ]
            },
            {
              cells: [
                { content: 'Need to take:' },
                { content: 'a reference letter from employer' }
              ]
            },
            {
              cells: [
                { content: '' },
                { content: 'a bank statement' }
              ]
            },
            {
              cells: [
                { content: '' },
                { content: 'the application form with a' }
              ]
            },
            {
              cells: [
                { content: '' },
                { content: { questionNumber: 10 } }
              ]
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
          type: 'multiple-choice-multi-select',
          instruction: 'Choose TWO letters, A-E.',
          question: 'Which TWO factors should be considered when choosing a hotel?',
          questionNumbers: [11, 12],
          maxSelections: 2,
          options: [
            { label: 'price', value: 'A' },
            { label: 'location', value: 'B' },
            { label: 'reputation', value: 'C' },
            { label: 'service', value: 'D' },
            { label: 'facilities', value: 'E' }
          ]
        },
        {
          type: 'multiple-choice-multi-select',
          instruction: 'Choose TWO letters, A-E.',
          question: 'Which TWO facilities of Pine Garden are open today?',
          questionNumbers: [13, 14],
          maxSelections: 2,
          options: [
            { label: 'plant care centre', value: 'A' },
            { label: 'cafe', value: 'B' },
            { label: 'gift shop', value: 'C' },
            { label: 'model town', value: 'D' },
            { label: 'tourist office', value: 'E' }
          ]
        },
        {
          type: 'drag-and-drop',
          instruction: 'Choose SIX answers from the box and drop the correct letter, A-H, next to questions 15-20.',
          items: [
            { questionNumber: 15, label: 'Mary' },
            { questionNumber: 16, label: 'Berson' },
            { questionNumber: 17, label: 'Smith' },
            { questionNumber: 18, label: 'Nunee' },
            { questionNumber: 19, label: 'Scanlan' },
            { questionNumber: 20, label: 'Mandelson' }
          ],
          options: [
            { label: 'varieties of desert', value: 'A' },
            { label: 'edible plants', value: 'B' },
            { label: 'lawns and lawn alternatives', value: 'C' },
            { label: 'native plants', value: 'D' },
            { label: 'storing water', value: 'E' },
            { label: 'plants attract wildlife', value: 'F' },
            { label: 'unified design', value: 'G' },
            { label: 'soil nutrients', value: 'H' }
          ]
        }
      ]
    },
    {
      sectionNumber: 3,
      title: 'Questions 21-30',
      questions: [
        {
          type: 'multiple-choice',
          questionNumber: 21,
          question: 'How could ancient Africans recognize different stars?',
          options: [
            { label: 'by the location of the stars', value: 'A' },
            { label: 'by the way stars affect each other', value: 'B' },
            { label: 'by the distance between two stars', value: 'C' }
          ]
        },
        {
          type: 'multiple-choice',
          questionNumber: 22,
          question: 'In which way do the Weyaka people like to deal with their money?',
          options: [
            { label: 'open bank accounts', value: 'A' },
            { label: 'assist others', value: 'B' },
            { label: 'lend money to others', value: 'C' }
          ]
        },
        {
          type: 'multiple-choice',
          questionNumber: 23,
          question: 'What do the Africans obtain from their suffering?',
          options: [
            { label: 'ways of protecting their environment', value: 'A' },
            { label: 'approaches to improving their international status', value: 'B' },
            { label: 'reasons of conquering drought', value: 'C' }
          ]
        },
        {
          type: 'multiple-choice',
          questionNumber: 24,
          question: 'What are the local people concerned with?',
          options: [
            { label: 'having enough food', value: 'A' },
            { label: 'getting rid of disease', value: 'B' },
            { label: 'going back to their former environment', value: 'C' }
          ]
        },
        {
          type: 'multiple-choice',
          questionNumber: 25,
          question: 'What is the reason for the declining financial condition of the African people?',
          options: [
            { label: 'They find it hard to trade because of the undeveloped transportation system.', value: 'A' },
            { label: 'They have difficulty in mining minerals.', value: 'B' },
            { label: 'They refuse to develop a range of commercial activities.', value: 'C' }
          ]
        },
        {
          type: 'multiple-choice',
          questionNumber: 26,
          question: 'When can the African people expect to stop suffering from starvation?',
          options: [
            { label: 'next year', value: 'A' },
            { label: 'in the long-term future', value: 'B' },
            { label: 'in the near future', value: 'C' }
          ]
        },
        {
          type: 'sentence-completion',
          instruction: 'Write ONE WORD ONLY for each answer.',
          items: [
            {
              questionNumber: 27,
              text: 'A valuable quality of the Africans is to make up for............. the difficulties of food transportation.'
            },
            {
              questionNumber: 28,
              text: 'The government intends to pay greater attention to their............. plan.'
            },
            {
              questionNumber: 29,
              text: 'Nowadays, the Africans are encouraged to............. in an area consistently.'
            },
            {
              questionNumber: 30,
              text: 'For the Weyaka people, it is impolite to visit someone\'s home without..............'
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
          type: 'sentence-completion',
          instruction: 'Write NO MORE THAN TWO WORDS for each answer.',
          items: [
            {
              questionNumber: 31,
              text: 'Animal Sense\n\nSmell\n• Dogs have a greater sense of smell than human beings and are able to tell.\n• Some animals can smell odours such as (31)........................ recognized by the human nose.'
            },
            {
              questionNumber: 32,
              text: '• Some beetles can only distinguish the odours of certain plants.\n• Bees, feeling threatened, will use their (32)........................ before they sting.'
            },
            {
              questionNumber: 33,
              text: '• Queen bees, which can sting multiple times, use their feet to keep (33)........................ over the colony.'
            },
            {
              questionNumber: 34,
              text: '• A female (34)........................ decides whether or not to mate with a male according to the quality of his scent.'
            },
            {
              questionNumber: 35,
              text: 'Hearing\n• Sound through vibrations can be recognized by beetles without ears by using their (35)........................'
            },
            {
              questionNumber: 36,
              text: '• They can locate prey living in (36)........................ by tracking the vibrations.'
            },
            {
              questionNumber: 37,
              text: 'Sight\n• Snakes are able to search for food by detecting (37)........................ from the mouths of their prey.'
            },
            {
              questionNumber: 38,
              text: '• They can tell the (38)........................ and ........................ of a mouse by detecting its heat.'
            },
            {
              questionNumber: 39,
              text: '• After its prey is killed, a snake stores food in its (39)........................ and hibernates.'
            },
            {
              questionNumber: 40,
              text: '• A snake that goes into a state of hibernation will not eat for a long period of time.\n• The (40)........................ is calculated by snakes before hunting their prey.'
            }
          ]
        }
      ]
    }
  ]
};
