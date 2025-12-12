// Track 6: 2-M Listening
import { Track } from './track1';

export const track6: Track = {
  id: 'track-6',
  name: '2-M Listening',
  shortName: '2M',
  description: 'IELTS Listening Practice Test - Advanced listening comprehension with multiple question types',
  duration: 60,
  totalQuestions: 40,
  audioURL: null,
  sections: [
    {
      sectionNumber: 1,
      title: 'Section 1',
      questions: [
        {
          type: 'table-gap',
          instruction: 'Write NO MORE THAN THREE WORDS OR NUMBERS for each answer.',
          title: 'Survey Form',
          rows: [
            {
              label: 'Time contacted:',
              value: {
                questionNumber: 1
              }
            },
            {
              label: 'Suburb:',
              value: {
                questionNumber: 2
              }
            },
            {
              label: 'Age Group:',
              value: {
                questionNumber: 3
              }
            },
            {
              label: 'Occupation:',
              value: {
                questionNumber: 4
              }
            },
            {
              label: 'Family:',
              value: {
                questionNumber: 5
              }
            }
          ]
        },
        {
          type: 'paragraph-gap',
          instruction: 'Write ONE WORD ONLY for each answer.',
          paragraph: 'The subject undertakes exercise regularly (6).......... She does yoga in order to relax and (7).......... her muscles. When she was younger, she would (8).........., and in the future, she may go (9).......... although that will depend on whether she has enough (10)..........',
          questionNumbers: [6, 7, 8, 9, 10]
        }
      ]
    },
    {
      sectionNumber: 2,
      title: 'Section 2',
      questions: [
        {
          type: 'map-labeling',
          instruction: 'Label the floor plan.',
          imageUrl: 'https://customer-assets.emergentagent.com/job_0893d324-92cc-4e72-93ec-cbdce390970a/artifacts/s46s9e84_image%201.jpg',
          labels: [
            { questionNumber: 11, position: { x: 15, y: 25 } },  // A - top left circular area
            { questionNumber: 12, position: { x: 45, y: 20 } },  // B - middle top area (shelves)
            { questionNumber: 13, position: { x: 85, y: 15 } },  // C - top right area
            { questionNumber: 14, position: { x: 15, y: 70 } },  // D - bottom left L-shaped area
            { questionNumber: 15, position: { x: 45, y: 75 } },  // E - bottom middle seating area
            { questionNumber: 16, position: { x: 90, y: 75 } }   // F - right side vertical area
          ],
          options: [
            { label: 'Quiet reading', value: 'Quiet reading' },
            { label: 'Computers', value: 'Computers' },
            { label: 'Newspapers & magazines', value: 'Newspapers & magazines' },
            { label: 'Reference books', value: 'Reference books' },
            { label: 'Audio section', value: 'Audio section' },
            { label: 'Main library', value: 'Main library' }
          ]
        },
        {
          type: 'drag-drop-table',
          instruction: 'Complete the timetable.',
          title: 'ILC Special Sessions Timetable',
          tableData: {
            headers: ['', '9:00 to 10:30', '10:30 to noon', 'Noon to 1:30', '1:30 to 3:00', '3:00 to 4:30', '4:30 to 6:00'],
            rows: [
              { cells: ['Quiet reading', 'A', 'D', '', 'C', '', 'D'] },
              { cells: ['Central seating', 'E', '', 'F', '', '', 'G'] },
              { cells: ['Audio Section', '', 'H', 'I', 'J', '', ''] }
            ]
          },
          items: [
            { questionNumber: 17, label: 'Teacher-led discussion' },
            { questionNumber: 18, label: 'Writing skills' },
            { questionNumber: 19, label: 'On-call teacher' },
            { questionNumber: 20, label: 'Language exchange' }
          ],
          options: [
            { label: 'Teacher-led discussion', value: 'A' },
            { label: 'Writing skills', value: 'C' },
            { label: 'On-call teacher', value: 'D' },
            { label: 'Language exchange', value: 'E' },
            { label: 'Reading workshop', value: 'F' },
            { label: 'Grammar clinic', value: 'G' },
            { label: 'Audio practice', value: 'H' },
            { label: 'Pronunciation lab', value: 'I' },
            { label: 'Listening skills', value: 'J' }
          ]
        }
      ]
    },
    {
      sectionNumber: 3,
      title: 'Section 3',
      questions: [
        {
          type: 'paragraph-gap',
          instruction: 'Write ONE WORD ONLY for each answer.',
          paragraph: 'One of the basic strategies when listening to lectures is to use (21).......... This saves time, but it is only effective if they can be (22).......... later. More generally, it is necessary to format the page in anticipation of the (23).......... of the lecture. As an example, one can draw (24).........., tables, and flowcharts, consistent with the way the subject matter is presented.',
          questionNumbers: [21, 22, 23, 24]
        },
        {
          type: 'multi-column-table',
          instruction: 'Write ONE WORD ONLY for each answer.',
          title: '',
          headers: ['Subject', 'Recommended Page Design'],
          rows: [
            {
              cells: [
                { content: '(25).......... Studies' },
                { content: 'flowchart, showing courtroom processes and (26)..........' }
              ]
            },
            {
              cells: [
                { content: 'Culture Studies' },
                { content: 'table or spider graph, linking (27)......... thoughts etc.' }
              ]
            },
            {
              cells: [
                { content: 'Management Theory' },
                { content: 'network (like spider graph but has (28)..........)' }
              ]
            },
            {
              cells: [
                { content: 'Political Science' },
                { content: 'linear (29).........' }
              ]
            },
            {
              cells: [
                { content: 'Mass Media' },
                { content: 'just use (30).........' }
              ]
            }
          ]
        }
      ]
    },
    {
      sectionNumber: 4,
      title: 'Section 4',
      questions: [
        {
          type: 'multi-column-table',
          instruction: 'Write NO MORE THAN TWO WORDS for each answer.',
          title: 'Neutrinos',
          headers: ['', '', ''],
          rows: [
            {
              cells: [
                { content: 'are everywhere' },
                { content: '', colspan: 2 }
              ]
            },
            {
              cells: [
                { content: '' },
                { content: '→' },
                { content: '100 to 200 (31).......... pass through our bodies every second.' }
              ]
            },
            {
              cells: [
                { content: 'are difficult to detect because of' },
                { content: '1. the presence of other particles' },
                { content: '' }
              ]
            },
            {
              cells: [
                { content: '' },
                { content: '→' },
                { content: 'usually need a (32)..........' }
              ]
            },
            {
              cells: [
                { content: '' },
                { content: '2. the surrounding (33)..........' },
                { content: '' }
              ]
            },
            {
              cells: [
                { content: '' },
                { content: '→' },
                { content: 'detection location usually (34)..........' }
              ]
            },
            {
              cells: [
                { content: '' },
                { content: '3. challenge of installing equipment' },
                { content: '' }
              ]
            },
            {
              cells: [
                { content: '' },
                { content: '→' },
                { content: 'engineering is very (35)..........' }
              ]
            }
          ]
        },
        {
          type: 'map-text-input',
          instruction: 'Write NO MORE THAN TWO WORDS AND/OR NUMBERS for each answer.',
          imageUrl: 'https://customer-assets.emergentagent.com/job_0893d324-92cc-4e72-93ec-cbdce390970a/artifacts/8wqhgx2j_image%202.png',
          labels: [
            { questionNumber: 36, position: { x: 15, y: 30 }, text: 'sphere, containing (36)' },
            { questionNumber: 37, position: { x: 15, y: 50 }, text: 'sensitive (37) detector' },
            { questionNumber: 38, position: { x: 15, y: 75 }, text: 'weight of water (38)' },
            { questionNumber: 39, position: { x: 75, y: 45 }, text: 'Molecule splits, producing (39) for analysis.' },
            { questionNumber: 40, position: { x: 75, y: 70 }, text: 'Such knowledge can allow us to (40) neutrinos, useful for further investigation.' }
          ]
        }
      ]
    }
  ]
};
