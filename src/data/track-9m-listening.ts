// Track: 9-M Listening
import { Track } from './track1';

export const track9MListening: Track = {
  id: 'track-9m-listening',
  name: '9-M Listening',
  shortName: '9M',
  description: 'IELTS Listening Practice Test - Section 4 with 40 questions',
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
          instruction: 'Write ONE WORD AND/OR A NUMBER for each answer.',
          title: 'Notes on A Part-time Society',
          headers: ['', ''],
          rows: [
            {
              cells: [
                { content: 'Name of society:' },
                { content: 'Leighton' }
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
                { content: 'Want:' },
                { content: { questionNumber: 2 } }
              ]
            },
            {
              cells: [
                { content: 'Transportation:' },
                { content: 'shuttle services (need someone who is able to ' }
              ]
            },
            {
              cells: [
                { content: '' },
                { content: { questionNumber: 3 } }
              ]
            },
            {
              cells: [
                { content: 'Meeting time:' },
                { content: '6:00-8:00pm every ' }
              ]
            },
            {
              cells: [
                { content: '' },
                { content: { questionNumber: 4 } }
              ]
            },
            {
              cells: [
                { content: 'Close time:' },
                { content: 'during ' }
              ]
            },
            {
              cells: [
                { content: '' },
                { content: { questionNumber: 5 } }
              ]
            }
          ]
        },
        {
          type: 'multi-column-table',
          instruction: '',
          title: 'Membership fee (including ' + String.fromCharCode(8230) + ')',
          headers: ['', ''],
          rows: [
            {
              cells: [
                { content: '– £40 for employed members' },
                { content: '(under 30 years of age)' }
              ]
            },
            {
              cells: [
                { content: '– £60 for employed members' },
                { content: '(30-60 years of age)' }
              ]
            },
            {
              cells: [
                { content: '– £' },
                { content: { questionNumber: 7 } }
              ]
            },
            {
              cells: [
                { content: '' },
                { content: 'for retired or unemployed members (over 60 years of age)' }
              ]
            }
          ]
        },
        {
          type: 'multi-column-table',
          instruction: '',
          title: 'Minimum joining age',
          headers: ['', ''],
          rows: [
            {
              cells: [
                { content: '–' },
                { content: { questionNumber: 8 } }
              ]
            }
          ]
        },
        {
          type: 'multi-column-table',
          instruction: '',
          title: 'Most members are',
          headers: ['', ''],
          rows: [
            {
              cells: [
                { content: '– friendly' },
                { content: '' }
              ]
            },
            {
              cells: [
                { content: '– fond of culture and music' },
                { content: '' }
              ]
            },
            {
              cells: [
                { content: '–' },
                { content: { questionNumber: 9 } }
              ]
            },
            {
              cells: [
                { content: '' },
                { content: 'authors looking for new experiences to write about in their books' }
              ]
            }
          ]
        },
        {
          type: 'multi-column-table',
          instruction: '',
          title: 'Charity',
          headers: ['', ''],
          rows: [
            {
              cells: [
                { content: 'The children\'s' },
                { content: { questionNumber: 10 } }
              ]
            },
            {
              cells: [
                { content: '' },
                { content: 'will get the money raised by the annual dinner.' }
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
          type: 'multiple-choice',
          questionNumber: 11,
          question: 'What kind of changes is the station making?',
          options: [
            { label: 'relocation', value: 'A' },
            { label: 'reconstruction', value: 'B' },
            { label: 'expansion', value: 'C' }
          ]
        },
        {
          type: 'multiple-choice',
          questionNumber: 12,
          question: 'The original buildings on the site were',
          options: [
            { label: 'houses.', value: 'A' },
            { label: 'industrial buildings.', value: 'B' },
            { label: 'shops.', value: 'C' }
          ]
        },
        {
          type: 'multiple-choice',
          questionNumber: 13,
          question: 'Firstly the station intended to use the site as',
          options: [
            { label: 'a leisure centre.', value: 'A' },
            { label: 'a car park.', value: 'B' },
            { label: 'a lounge.', value: 'C' }
          ]
        },
        {
          type: 'multiple-choice',
          questionNumber: 14,
          question: 'The new buildings will be situated to the right side of',
          options: [
            { label: 'the shopping district.', value: 'A' },
            { label: 'the apartment blocks.', value: 'B' },
            { label: 'the new formal gardens.', value: 'C' }
          ]
        },
        {
          type: 'table-selection',
          instruction: 'Mark the correct letter, A-H, next to questions 15-20.',
          headers: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
          rows: [
            {
              questionNumber: 15,
              label: 'Cafe'
            },
            {
              questionNumber: 16,
              label: 'Taxi Rank'
            },
            {
              questionNumber: 17,
              label: 'Car Park'
            },
            {
              questionNumber: 18,
              label: 'Passenger Waiting Area'
            },
            {
              questionNumber: 19,
              label: 'Waiting Area for Wheelchair Users'
            },
            {
              questionNumber: 20,
              label: 'Tourist Office'
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
          type: 'multiple-choice',
          questionNumber: 21,
          question: 'What has Irene recently done?',
          options: [
            { label: 'She has almost finished planning the experiment.', value: 'A' },
            { label: 'She is not applying herself enough to her work.', value: 'B' },
            { label: 'She spends a lot of time in the laboratory.', value: 'C' }
          ]
        },
        {
          type: 'multiple-choice',
          questionNumber: 22,
          question: 'What is Bill\'s attitude toward Kim?',
          options: [
            { label: 'He is grateful for Kim\'s contribution.', value: 'A' },
            { label: 'He is not fond of Kim\'s tastes in clothes.', value: 'B' },
            { label: 'He thinks Kim is not good at laboratory work.', value: 'C' }
          ]
        },
        {
          type: 'multiple-choice',
          questionNumber: 23,
          question: 'What does Jen think of the other people in the group?',
          options: [
            { label: 'The boys are good at maths which is very helpful.', value: 'A' },
            { label: 'They would fail the experiment without Irene\'s contribution.', value: 'B' },
            { label: 'Irene has completed the data analysis so the experiment is nearly done.', value: 'C' }
          ]
        },
        {
          type: 'multiple-choice',
          questionNumber: 24,
          question: 'How did Jen and Bill feel about Linda?',
          options: [
            { label: 'She was always submitted her work late for the group work.', value: 'A' },
            { label: 'She was difficult to get in touch with.', value: 'B' },
            { label: 'She thought it was easy to get a high score.', value: 'C' }
          ]
        },
        {
          type: 'multiple-choice',
          questionNumber: 25,
          question: 'Why was Jen invited to the professor\'s individual project?',
          options: [
            { label: 'She was quite popular among students.', value: 'A' },
            { label: 'She always finished reading all the assignments.', value: 'B' },
            { label: 'She was close to the professor.', value: 'C' }
          ]
        },
        {
          type: 'drag-and-drop',
          instruction: 'Choose FIVE answers from the box and write the correct letter, A-G, next to questions 26-30.',
          items: [
            { questionNumber: 26, label: 'Irene' },
            { questionNumber: 27, label: 'Kim' },
            { questionNumber: 28, label: 'Jen' },
            { questionNumber: 29, label: 'Bill' },
            { questionNumber: 30, label: 'Linda' }
          ],
          options: [
            { label: 'Abstract', value: 'A' },
            { label: 'Acknowledgement', value: 'B' },
            { label: 'Methodology', value: 'C' },
            { label: 'Bibliography', value: 'D' },
            { label: 'Literature review', value: 'E' },
            { label: 'Results', value: 'F' },
            { label: 'Discussion', value: 'G' }
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
          instruction: 'Write ONE WORD ONLY for each answer.',
          items: [
            {
              questionNumber: 31,
              text: 'Nanotechnology\n\nGeneral information\n• explanation: manipulation of matter on a minute scale\n• huge investment in research The reason why development of Nanotechnology may be started because of a new type of (31)........................'
            },
            {
              questionNumber: 32,
              text: 'Application\n\na) daily lives\n* aids in getting (32)........................ from diet'
            },
            {
              questionNumber: 33,
              text: '* reduces the cost of (33)........................'
            },
            {
              questionNumber: 34,
              text: '* improves the (34)........................ of food'
            },
            {
              questionNumber: 35,
              text: 'b) agriculture\n* use of Nanotechnology has resulted in a spray which increase the efficiency of (35)........................ in the soil and can be use instead of Artificial chemical'
            },
            {
              questionNumber: 36,
              text: 'c) medical area\n* Nanotechnology can help avoid food poisoning\n* Nanotechnology can kill foods\' (36)........................ and make them'
            },
            {
              questionNumber: 37,
              text: '* Nanoparticles are injected into the body and allow (37)………… to enter the veins.'
            },
            {
              questionNumber: 38,
              text: '*  Some certain nanoparticles are able to sterilise more than 650 types of bacteria.\n*  (38)………….. has the greatest antibacterial qualities.'
            },
            {
              questionNumber: 39,
              text: '* Splifferenes help (39)……..….. loss programmes.'
            },
            {
              questionNumber: 40,
              text: 'd) cosmetics –\n* Preventing (40)………… from entering the body avoids skin cancer.'
            }
          ]
        }
      ]
    }
  ]
};
