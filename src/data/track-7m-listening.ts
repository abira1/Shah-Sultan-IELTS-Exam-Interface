// Track: 7-M Listening
import { Track } from './track1';

export const track7MListening: Track = {
  id: 'track-7m-listening',
  name: '7-M Listening',
  shortName: '7M',
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
          type: 'multiple-choice',
          questionNumber: 1,
          question: 'The accommodation was originally built as',
          options: [
            { label: 'student flat.', value: 'A' },
            { label: 'local museum.', value: 'B' },
            { label: 'private house.', value: 'C' }
          ]
        },
        {
          type: 'multiple-choice-multi-select',
          instruction: 'Choose TWO letters, A-E.',
          question: 'Which of the following TWO facilities are NOT in the house?',
          questionNumbers: [2, 3],
          maxSelections: 2,
          options: [
            { label: 'A. bathroom', value: 'A' },
            { label: 'B. balcony', value: 'B' },
            { label: 'C. computer room', value: 'C' },
            { label: 'D. garden', value: 'D' },
            { label: 'E. garage', value: 'E' }
          ]
        },
        {
          type: 'multi-column-table',
          instruction: 'Write ONE WORD ONLY for each answer.',
          title: '',
          headers: ['', 'RULE'],
          rows: [
            {
              cells: [
                { content: 'Bedroom and bathroom' },
                { content: { questionNumber: 4 } }
              ]
            },
            {
              cells: [
                { content: { questionNumber: 5, suffix: ' room' } },
                { content: 'Use before 11 p.m.' }
              ]
            },
            {
              cells: [
                { content: 'Lounge' },
                { content: { questionNumber: 6, suffix: ' after 11 p.m.' } }
              ]
            },
            {
              cells: [
                { content: 'Yard' },
                { content: { questionNumber: 7, prefix: 'No ', suffix: ' is allowed' } }
              ]
            }
          ]
        },
        {
          type: 'sentence-completion',
          instruction: 'Write NO MORE THAN THREE WORDS AND/OR A NUMBER for each answer.',
          items: [
            {
              questionNumber: 8,
              text: '(8)........................ is only allowed on weekends.'
            },
            {
              questionNumber: 9,
              text: 'The opening time of the front door is (9)........................'
            },
            {
              questionNumber: 10,
              text: 'You can go to Room 101 beside reception to get a (10)........................'
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
          type: 'multi-column-table',
          instruction: 'Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
          title: '',
          headers: ['Item', 'Tennis', 'Soccer'],
          rows: [
            {
              cells: [
                { content: 'Number of teams' },
                { content: { questionNumber: 11 } },
                { content: '4' }
              ]
            },
            {
              cells: [
                { content: 'Age' },
                { content: '16–22' },
                { content: 'Up to (12)............' }
              ]
            },
            {
              cells: [
                { content: { questionNumber: 13 } },
                { content: 'court 2' },
                { content: { questionNumber: 14 } }
              ]
            },
            {
              cells: [
                { content: 'Date' },
                { content: { questionNumber: 15 } },
                { content: '(16)............. evenings' }
              ]
            },
            {
              cells: [
                { content: { questionNumber: 17 } },
                { content: 'George Hansen' },
                { content: 'Paul Bhatt' }
              ]
            }
          ]
        },
        {
          type: 'sentence-completion',
          instruction: 'Write NO MORE THAN TWO WORDS for each answer.',
          items: [
            {
              questionNumber: 18,
              text: 'The match always begins with a (18)........................'
            },
            {
              questionNumber: 19,
              text: '(19)........................ will be awarded an honour and prize.'
            },
            {
              questionNumber: 20,
              text: 'All players must write a (20)........................ by April 18th.'
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
          type: 'sentence-completion',
          instruction: 'Write NO MORE THAN THREE WORDS AND/OR A NUMBER for each answer.',
          items: [
            {
              questionNumber: 21,
              text: "The tutor's new room number is (21)........................"
            },
            {
              questionNumber: 22,
              text: 'The tutorial time is at (22)........................'
            },
            {
              questionNumber: 23,
              text: 'The reason for the student to see his tutor is to (23)........................'
            },
            {
              questionNumber: 24,
              text: 'The student\'s trouble is to have many (24)........................ to read.'
            }
          ]
        },
        {
          type: 'drag-and-drop',
          instruction: 'Choose your answer below and write the letters, A-F, next to Questions 25-28. What recommendations does the tutor make about the reference books?',
          items: [
            { questionNumber: 25, label: 'Bayer' },
            { questionNumber: 26, label: 'Oliver' },
            { questionNumber: 27, label: 'Billy' },
            { questionNumber: 28, label: 'Andrew' }
          ],
          options: [
            { label: 'All', value: 'A' },
            { label: 'Research method', value: 'B' },
            { label: 'Main Body', value: 'C' },
            { label: 'Conclusion', value: 'D' },
            { label: 'Avoid', value: 'E' },
            { label: 'Argument', value: 'F' }
          ]
        },
        {
          type: 'multiple-choice-multi-select',
          instruction: 'Choose TWO letters, A-E.',
          question: 'Which TWO of the following points does the tutor warn students research work?',
          questionNumbers: [29, 30],
          maxSelections: 2,
          options: [
            { label: 'A. interviewees', value: 'A' },
            { label: 'B. make data clearly', value: 'B' },
            { label: 'C. time arrangement', value: 'C' },
            { label: 'D. reference books', value: 'D' },
            { label: 'E. questionnaire design', value: 'E' }
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
          instruction: 'Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
          items: [
            {
              questionNumber: 31,
              text: 'Magic Meteor Astronomy\n\nMeteors are usually named (31)........................'
            },
            {
              questionNumber: 32,
              text: 'Meteoroids belong to inner (32)........................ system.'
            },
            {
              questionNumber: 33,
              text: 'Meteor storms are more beautiful and amazing than (33)........................'
            },
            {
              questionNumber: 34,
              text: 'The biggest meteor storm happened in (34)........................'
            },
            {
              questionNumber: 35,
              text: 'Leonids are usually connected with (35)........................'
            },
            {
              questionNumber: 36,
              text: 'A (36)........................ is brighter than any of the stars and planets.'
            },
            {
              questionNumber: 37,
              text: 'Most meteors appear colour of (37)........................'
            },
            {
              questionNumber: 38,
              text: 'In the 17th Century, many people regarded meteorite as (38)........................'
            },
            {
              questionNumber: 39,
              text: 'The most magnificent meteorite event took place on (39)........................ 1908.'
            },
            {
              questionNumber: 40,
              text: 'Dinosaurs became extinct about (40)........................ years ago.'
            }
          ]
        }
      ]
    }
  ]
};
