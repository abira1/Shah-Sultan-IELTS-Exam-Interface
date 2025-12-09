// Track 3: Social Context
import { Track } from './track1';

export const track3: Track = {
  id: 'track-3',
  name: 'IELTS Listening Test 3 - Social Situations',
  shortName: 'SS',
  description: 'IELTS Listening Practice Test - Everyday social interactions and services',
  duration: 50,
  totalQuestions: 40,
  audioURL: null, // Will use audio from Firebase if uploaded
  sections: [{
    sectionNumber: 1,
    title: 'Questions 1-10',
    questions: [{
      type: 'table-gap',
      instruction: 'Write NO MORE THAN THREE WORDS AND/OR A NUMBER for each answer.',
      title: 'Gym Membership Enquiry',
      rows: [{
        label: 'Example - Enquirer name:',
        value: 'Robert Martinez'
      }, {
        label: 'Membership type interested:',
        value: {
          questionNumber: 1
        }
      }, {
        label: 'Monthly fee:',
        value: {
          questionNumber: 2
        }
      }, {
        label: 'Opening time:',
        value: {
          questionNumber: 3
        }
      }, {
        label: 'Personal trainer sessions:',
        value: {
          questionNumber: 4
        }
      }, {
        label: 'Pool access:',
        value: {
          questionNumber: 5
        }
      }, {
        label: 'Classes included:',
        value: {
          questionNumber: 6
        }
      }, {
        label: 'Free trial period:',
        value: {
          questionNumber: 7
        }
      }, {
        label: 'Cancellation notice:',
        value: {
          questionNumber: 8
        }
      }, {
        label: 'Guest passes per month:',
        value: {
          questionNumber: 9
        }
      }, {
        label: 'Join online at:',
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
      instruction: 'Write NO MORE THAN TWO WORDS for each answer.',
      title: 'Community Events Calendar',
      rows: [{
        label: 'Event',
        value: 'Date & Time'
      }, {
        label: {
          questionNumber: 11
        },
        value: 'Saturday 10 AM'
      }, {
        label: 'Book Club',
        value: {
          questionNumber: 12
        }
      }, {
        label: {
          questionNumber: 13
        },
        value: 'Friday 6 PM'
      }, {
        label: 'Art Workshop',
        value: {
          questionNumber: 14
        }
      }, {
        label: 'Movie Night',
        value: 'Thursday 7:30 PM'
      }, {
        label: {
          questionNumber: 15
        },
        value: 'Wednesday 5 PM'
      }]
    }, {
      type: 'multiple-choice',
      questionNumber: 16,
      question: 'The community center offers',
      options: [{
        label: 'free parking for members.',
        value: 'A'
      }, {
        label: 'discounted event tickets.',
        value: 'B'
      }, {
        label: 'childcare services.',
        value: 'C'
      }]
    }, {
      type: 'multiple-choice',
      questionNumber: 17,
      question: 'To register for events, you should',
      options: [{
        label: 'call the reception desk.',
        value: 'A'
      }, {
        label: 'visit the website.',
        value: 'B'
      }, {
        label: 'send an email.',
        value: 'C'
      }]
    }, {
      type: 'multiple-choice',
      questionNumber: 18,
      question: 'The most popular activity is',
      options: [{
        label: 'yoga classes.',
        value: 'A'
      }, {
        label: 'cooking workshops.',
        value: 'B'
      }, {
        label: 'dance sessions.',
        value: 'C'
      }]
    }, {
      type: 'multiple-choice',
      questionNumber: 19,
      question: 'New members receive',
      options: [{
        label: 'a welcome pack.',
        value: 'A'
      }, {
        label: 'a free t-shirt.',
        value: 'B'
      }, {
        label: 'a discount voucher.',
        value: 'C'
      }]
    }, {
      type: 'multiple-choice',
      questionNumber: 20,
      question: 'The center is closed on',
      options: [{
        label: 'public holidays.',
        value: 'A'
      }, {
        label: 'Sunday mornings.',
        value: 'B'
      }, {
        label: 'Monday evenings.',
        value: 'C'
      }]
    }]
  }, {
    sectionNumber: 3,
    title: 'Questions 21-30',
    questions: [{
      type: 'sentence-completion',
      instruction: 'Complete the sentences below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
      items: [{
        questionNumber: 21,
        text: 'The tour starts at the _______'
      }, {
        questionNumber: 22,
        text: 'Duration of the full tour: _______'
      }, {
        questionNumber: 23,
        text: 'The museum was founded in _______'
      }, {
        questionNumber: 24,
        text: 'Special exhibition on _______'
      }, {
        questionNumber: 25,
        text: 'Photography is allowed in the _______ only'
      }, {
        questionNumber: 26,
        text: 'Student tickets cost _______'
      }, {
        questionNumber: 27,
        text: 'Audio guides available in _______ languages'
      }, {
        questionNumber: 28,
        text: 'The gift shop sells _______'
      }, {
        questionNumber: 29,
        text: 'Café closes at _______'
      }, {
        questionNumber: 30,
        text: 'Annual membership includes _______'
      }]
    }]
  }, {
    sectionNumber: 4,
    title: 'Questions 31-40',
    questions: [{
      type: 'multiple-choice',
      questionNumber: 31,
      question: 'The speaker believes that volunteering',
      options: [{
        label: 'builds community connections.',
        value: 'A'
      }, {
        label: 'improves job prospects.',
        value: 'B'
      }, {
        label: 'provides tax benefits.',
        value: 'C'
      }]
    }, {
      type: 'multiple-choice',
      questionNumber: 32,
      question: 'The main challenge for volunteers is',
      options: [{
        label: 'finding suitable opportunities.',
        value: 'A'
      }, {
        label: 'managing time commitments.',
        value: 'B'
      }, {
        label: 'understanding responsibilities.',
        value: 'C'
      }]
    }, {
      type: 'multiple-choice',
      questionNumber: 33,
      question: 'Organizations prefer volunteers who are',
      options: [{
        label: 'highly experienced.',
        value: 'A'
      }, {
        label: 'available long-term.',
        value: 'B'
      }, {
        label: 'flexible with tasks.',
        value: 'C'
      }]
    }, {
      type: 'dropdown',
      instruction: 'Choose the correct letter, A, B or C to indicate who said the following.',
      items: [{
        questionNumber: 34,
        statement: 'Volunteering changed my career path.'
      }, {
        questionNumber: 35,
        statement: 'I met lifelong friends through volunteering.'
      }, {
        questionNumber: 36,
        statement: 'Time management became easier.'
      }, {
        questionNumber: 37,
        statement: 'My confidence increased significantly.'
      }, {
        questionNumber: 38,
        statement: 'I learned valuable technical skills.'
      }, {
        questionNumber: 39,
        statement: 'It helped me understand different cultures.'
      }, {
        questionNumber: 40,
        statement: 'I discovered my passion for teaching.'
      }],
      options: [{
        label: 'Emma',
        value: 'A'
      }, {
        label: 'David',
        value: 'B'
      }, {
        label: 'Lisa',
        value: 'C'
      }]
    }]
  }]
};
