// Track 1: P-L-2 Application for membership
import { Section } from './examData';

export interface Track {
  id: string;
  name: string;
  description: string;
  duration: number; // in minutes
  totalQuestions: number;
  audioURL: string | null;
  sections: Section[];
}

export const track1: Track = {
  id: 'track-1',
  name: 'P-L-2 Application for membership',
  description: 'IELTS Listening Practice Test - Application form completion',
  duration: 60,
  totalQuestions: 40,
  audioURL: null, // Will use audio from Firebase if uploaded
  sections: [{
    sectionNumber: 1,
    title: 'Questions 1-10',
    questions: [{
      type: 'table-gap',
      instruction: 'Write NO MORE THAN THREE WORDS AND/OR A NUMBER for each answer.',
      title: 'Application for membership',
      rows: [{
        label: "Example Caller's name:",
        value: 'Michael Jones'
      }, {
        label: 'Heard of WCS from:',
        value: {
          questionNumber: 1
        }
      }, {
        label: 'Address:',
        value: '21 Beel Street, Leeds'
      }, {
        label: 'Postcode:',
        value: {
          questionNumber: 2
        }
      }, {
        label: 'Phone number:',
        value: '01173 58642'
      }, {
        label: 'E-mail address:',
        value: {
          questionNumber: 3
        }
      }, {
        label: 'Length of membership:',
        value: {
          questionNumber: 4
        }
      }, {
        label: 'Type of membership:',
        value: {
          questionNumber: 5
        }
      }, {
        label: 'Fee:',
        value: {
          questionNumber: 6
        }
      }, {
        label: 'Payment details:',
        value: 'direct debit'
      }, {
        label: 'Name of bank:',
        value: {
          questionNumber: 7
        }
      }, {
        label: 'Account name:',
        value: 'Michael Jones'
      }, {
        label: 'Account number:',
        value: '01059612'
      }, {
        label: 'Date of first payment:',
        value: {
          questionNumber: 8
        }
      }, {
        label: 'Reference number:',
        value: {
          questionNumber: 9
        }
      }, {
        label: 'Other requests:',
        value: '– extra information pack'
      }, {
        label: '',
        value: {
          questionNumber: 10
        }
      }]
    }]
  }, {
    sectionNumber: 2,
    title: 'Questions 11-20',
    questions: [{
      type: 'table-gap',
      instruction: 'Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
      title: 'Spring Festival',
      rows: [{
        label: 'Event',
        value: 'Location'
      }, {
        label: 'Firework display',
        value: {
          questionNumber: 11
        }
      }, {
        label: '',
        value: '4 Sept 9 p.m.'
      }, {
        label: '',
        value: {
          questionNumber: 12
        }
      }, {
        label: {
          questionNumber: 13
        },
        value: 'Central Park'
      }, {
        label: '',
        value: 'Daily'
      }, {
        label: '',
        value: {
          questionNumber: 14
        }
      }, {
        label: {
          questionNumber: 15
        },
        value: 'Exhibition Ct.'
      }, {
        label: '',
        value: '10–15 Sept'
      }, {
        label: '',
        value: '9 a.m.–10 p.m.'
      }, {
        label: 'Grow Imagination',
        value: {
          questionNumber: 16
        }
      }, {
        label: '',
        value: '11–19 Sept'
      }, {
        label: 'Swing in Spring',
        value: {
          questionNumber: 17
        }
      }, {
        label: '',
        value: '17–18 Sept'
      }, {
        label: '',
        value: {
          questionNumber: 18
        }
      }]
    }, {
      type: 'multiple-choice',
      questionNumber: 19,
      question: 'In the Spring Festival competition, you can win',
      options: [{
        label: 'A family passes to "Balloons Down Under".',
        value: 'A'
      }, {
        label: 'a check for $200.',
        value: 'B'
      }, {
        label: 'a flight in a hot air balloon.',
        value: 'C'
      }]
    }, {
      type: 'multiple-choice',
      questionNumber: 20,
      question: 'You can get an entry form for the competition from',
      options: [{
        label: 'the radio station.',
        value: 'A'
      }, {
        label: 'the newspaper.',
        value: 'B'
      }, {
        label: "the Festival's website.",
        value: 'C'
      }]
    }]
  }, {
    sectionNumber: 3,
    title: 'Questions 21-30',
    questions: [{
      type: 'sentence-completion',
      instruction: 'Write NO MORE THAN THREE WORDS for each answer.',
      items: [{
        questionNumber: 21,
        text: 'Can be combined with any other subject except'
      }, {
        questionNumber: 22,
        text: 'Has three _______ modules in first semester'
      }, {
        questionNumber: 23,
        text: 'Module 1 - Title:'
      }, {
        questionNumber: 24,
        text: 'Content processes: recording, _______, interpretation, display'
      }, {
        questionNumber: 25,
        text: 'Assessment: By'
      }, {
        questionNumber: 26,
        text: 'Module 2 - Title:'
      }, {
        questionNumber: 27,
        text: 'Content: _______ and development of built environments'
      }, {
        questionNumber: 28,
        text: 'Assessment: By _______ examination'
      }, {
        questionNumber: 29,
        text: 'Module 3 - Learning method: 50% lab work, 50%'
      }, {
        questionNumber: 30,
        text: 'Site survey at end of module (the _______ is to be announced later)'
      }]
    }]
  }, {
    sectionNumber: 4,
    title: 'Questions 31-40',
    questions: [{
      type: 'multiple-choice',
      questionNumber: 31,
      question: 'What impact does Marc Prensky believe that digital technology has had on young people?',
      options: [{
        label: 'It has altered their thinking patterns.',
        value: 'A'
      }, {
        label: 'It has harmed their physical development.',
        value: 'B'
      }, {
        label: 'It has limited their brain capacity.',
        value: 'C'
      }]
    }, {
      type: 'multiple-choice',
      questionNumber: 32,
      question: '"Digital immigrants" tend to access computers',
      options: [{
        label: 'using their native language.',
        value: 'A'
      }, {
        label: 'less efficiently than young people.',
        value: 'B'
      }, {
        label: 'for less important information.',
        value: 'C'
      }]
    }, {
      type: 'multiple-choice',
      questionNumber: 33,
      question: 'What example is given of having a "digital accent"?',
      options: [{
        label: 'Having less effective typing skills.',
        value: 'A'
      }, {
        label: 'Doing things the old-fashioned way.',
        value: 'B'
      }, {
        label: 'Being unable to understand instructions.',
        value: 'C'
      }]
    }, {
      type: 'dropdown',
      instruction: 'Choose the correct letter, A, B or C.',
      items: [{
        questionNumber: 34,
        statement: "Current teaching methods don't work"
      }, {
        questionNumber: 35,
        statement: "Many students don't understand computers."
      }, {
        questionNumber: 36,
        statement: "Computer technology doesn't interest all students."
      }, {
        questionNumber: 37,
        statement: 'Students can still learn the traditional way.'
      }, {
        questionNumber: 38,
        statement: 'Students still need to learn research skills.'
      }, {
        questionNumber: 39,
        statement: 'We should use computer games to teach.'
      }, {
        questionNumber: 40,
        statement: "Computers can't replace educators."
      }],
      options: [{
        label: 'Allen',
        value: 'A'
      }, {
        label: 'James',
        value: 'B'
      }, {
        label: 'Vander',
        value: 'C'
      }]
    }]
  }]
};
