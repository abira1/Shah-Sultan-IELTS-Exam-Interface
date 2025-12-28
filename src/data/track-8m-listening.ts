// Track: 8-M Listening
import { Track } from './track1';

export const track8MListening: Track = {
  id: 'track-8m-listening',
  name: '8-M Listening',
  shortName: '8M',
  description: 'IELTS Listening Practice Test - Job Hunting and City Museum',
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
          instruction: 'Write ONE WORD AND/OR NUMBERS for each answer.',
          title: 'JOB HUNTING',
          headers: ["Company's name", 'Job details', 'Reference Number', 'Contact'],
          rows: [
            {
              cells: [
                { 
                  content: 'Example\nPOWER\n(manufacturing company)' 
                },
                { 
                  content: '• work in a (1)............... section' 
                },
                { 
                  content: 'SW35FT' 
                },
                { 
                  content: 'Jane (2)...............' 
                }
              ]
            },
            {
              cells: [
                { 
                  content: 'COTTON\n(grocery company)' 
                },
                { 
                  content: '• good pay\n• work\n  – in (3)............ office\n  – in a (4)................\n• chance of promotion' 
                },
                { 
                  content: '(5)..............' 
                },
                { 
                  content: 'go to office' 
                }
              ]
            }
          ]
        },
        {
          type: 'sentence-completion',
          instruction: 'Write ONE WORD ONLY for each answer.',
          items: [
            {
              questionNumber: 6,
              text: 'Notes on Jobs\n\n• Local jobs can be found in the ............'
            },
            {
              questionNumber: 7,
              text: '• Buy the ............ to get one free magazine (Job Plus) instead of the recruitment seminar'
            },
            {
              questionNumber: 8,
              text: '• The ............ is on the second floor of the library.'
            },
            {
              questionNumber: 9,
              text: '• Make a/an ............ with the counselor first.'
            },
            {
              questionNumber: 10,
              text: '• ............ is not allowed in the library.'
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
          question: 'The reason why David is replacing Jane is that',
          options: [
            { label: 'she is unwell.', value: 'A' },
            { label: 'she is very busy.', value: 'B' },
            { label: 'she is inexperienced.', value: 'C' }
          ]
        },
        {
          type: 'multiple-choice',
          questionNumber: 12,
          question: 'According to the speaker, what is the problem for the museum currently?',
          options: [
            { label: 'lack of staff', value: 'A' },
            { label: 'lack of publicity', value: 'B' },
            { label: 'lack of money', value: 'C' }
          ]
        },
        {
          type: 'multiple-choice',
          questionNumber: 13,
          question: 'Why were the thieves able to successfully steal the statue?',
          options: [
            { label: 'The security device is outdated.', value: 'A' },
            { label: 'The security guard is not well-trained.', value: 'B' },
            { label: 'They knew what they were searching for.', value: 'C' }
          ]
        },
        {
          type: 'multiple-choice',
          questionNumber: 14,
          question: 'In order to improve security, they are going to',
          options: [
            { label: 'get more closed-circuit television cameras.', value: 'A' },
            { label: 'hire more security guards.', value: 'B' },
            { label: 'buy more computers.', value: 'C' }
          ]
        },
        {
          type: 'multiple-choice',
          questionNumber: 15,
          question: 'What kind of librarian are they looking for?',
          options: [
            { label: 'responsible', value: 'A' },
            { label: 'experienced', value: 'B' },
            { label: 'highly-trained', value: 'C' }
          ]
        },
        {
          type: 'table-selection',
          instruction: 'Mark the correct letter, A-H, next to questions 16-20.',
          imageUrl: '/LeisureComplexPlan.png',
          imageTitle: 'City Museum',
          headers: ['', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
          rows: [
            {
              questionNumber: 16,
              label: '(16) Box Office'
            },
            {
              questionNumber: 17,
              label: "(17) Children's Room"
            },
            {
              questionNumber: 18,
              label: '(18) Cafe'
            },
            {
              questionNumber: 19,
              label: '(19) Multimedia Room'
            },
            {
              questionNumber: 20,
              label: '(20) Showroom'
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
          question: 'What field is Willows currently focused on?',
          options: [
            { label: 'Specialising in one product', value: 'A' },
            { label: 'making a variety of products', value: 'B' },
            { label: 'adding a lot of retial outlet', value: 'C' }
          ]
        },
        {
          type: 'multiple-choice',
          questionNumber: 22,
          question: 'How did the students feel about the software?',
          options: [
            { label: 'The professor contacted the company.', value: 'A' },
            { label: 'An article was read in a newspaper', value: 'B' },
            { label: 'A student work their part-time during the vacations.', value: 'C' }
          ]
        },
        {
          type: 'multiple-choice',
          questionNumber: 23,
          question: 'How did the student fell about the software?',
          options: [
            { label: "It's not easy to predict.", value: 'A' },
            { label: "It's slow for drawing designs", value: 'B' },
            { label: 'It had a good interface.', value: 'C' }
          ]
        },
        {
          type: 'multiple-choice',
          questionNumber: 24,
          question: 'How did the students find out about the effects of the software on the company?',
          options: [
            { label: 'They went to the IT department.', value: 'A' },
            { label: 'They talked with the manager.', value: 'B' },
            { label: 'They inspected the accounts.', value: 'C' }
          ]
        },
        {
          type: 'multiple-choice',
          questionNumber: 25,
          question: 'The reason why the students have a face-to-face interview alone is that',
          options: [
            { label: 'they could prepare for exams.', value: 'A' },
            { label: 'there will be less disturbance.', value: 'B' },
            { label: "it's less realistic.", value: 'C' }
          ]
        },
        {
          type: 'multiple-choice',
          questionNumber: 26,
          question: 'How did the two students perform in the exam?',
          options: [
            { label: 'very disappointing', value: 'A' },
            { label: 'significantly good', value: 'B' },
            { label: 'above the average', value: 'C' }
          ]
        },
        {
          type: 'multiple-choice-multi-select',
          instruction: 'Choose Two letters from the list, A-E.',
          question: 'In which TWO ways will the new system affect the company?',
          questionNumbers: [27, 28],
          maxSelections: 2,
          options: [
            { label: 'A. gain more profit', value: 'A' },
            { label: 'B. employ more new staff', value: 'B' },
            { label: 'C. increase sales', value: 'C' },
            { label: 'D. reduce production time', value: 'D' },
            { label: 'E. cut labour costs', value: 'E' }
          ]
        },
        {
          type: 'multiple-choice-multi-select',
          instruction: 'Choose TWO letters, A-E.',
          question: 'Which TWO effects will the new system have on new clients?',
          questionNumbers: [29, 30],
          maxSelections: 2,
          options: [
            { label: 'A. getting more involved in the design', value: 'A' },
            { label: 'B. obtaining more contacts', value: 'B' },
            { label: 'C. linking at home to do online work', value: 'C' },
            { label: 'D. wasting less time', value: 'D' },
            { label: 'E. decreasing labour costs', value: 'E' }
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
              text: 'A Survey Research\n\nResults of Questionnaire\n\n• The patients preferred to choose the hospital because of the free ............ service provided.'
            },
            {
              questionNumber: 32,
              text: '• Most patients wished the hospital to be ............'
            },
            {
              questionNumber: 33,
              text: '• Patients were concerned about prior ............ about the hospital treatment.'
            },
            {
              questionNumber: 34,
              text: 'Actions in the next year\n\n• improvements on website for local ............ as well as hospital medical staff'
            },
            {
              questionNumber: 35,
              text: "• incentive to motivate the members of staff - extra ............ for staff's success in work"
            },
            {
              questionNumber: 36,
              text: '• considering the opinions of the ............'
            },
            {
              questionNumber: 37,
              text: '• improving the effectiveness of ............ between patients, doctors and staff'
            },
            {
              questionNumber: 38,
              text: '• first-come-first-served system\n\nRecommendation\n\n• A new unit would be built for those who are suffering from ............ disturbance.'
            },
            {
              questionNumber: 39,
              text: '• A new ward would be proposed to those in need of ............ surgery.'
            },
            {
              questionNumber: 40,
              text: '• The equipment is advanced enough to do with the treatments.\n• More effective ............ is needed to improve the efficiency of communication.'
            }
          ]
        }
      ]
    }
  ]
};
