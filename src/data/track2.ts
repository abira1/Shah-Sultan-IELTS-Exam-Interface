// Track 2: Academic Discussion
import { Track } from './track1';

export const track2: Track = {
  id: 'track-2',
  name: 'IELTS Listening Test 2 - Academic Discussion',
  shortName: 'AL',
  description: 'IELTS Listening Practice Test - University lecture and campus life',
  duration: 45,
  totalQuestions: 40,
  audioURL: null, // Will use audio from Firebase if uploaded
  sections: [{
    sectionNumber: 1,
    title: 'Questions 1-10',
    questions: [{
      type: 'table-gap',
      instruction: 'Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
      title: 'Library Registration Form',
      rows: [{
        label: "Student's name:",
        value: 'Sarah Thompson'
      }, {
        label: 'Course:',
        value: {
          questionNumber: 1
        }
      }, {
        label: 'Year:',
        value: {
          questionNumber: 2
        }
      }, {
        label: 'Contact number:',
        value: {
          questionNumber: 3
        }
      }, {
        label: 'Email:',
        value: 'sarah.t@university.edu'
      }, {
        label: 'Card type:',
        value: {
          questionNumber: 4
        }
      }, {
        label: 'Books allowed:',
        value: {
          questionNumber: 5
        }
      }, {
        label: 'Loan period:',
        value: {
          questionNumber: 6
        }
      }, {
        label: 'Fine per day:',
        value: {
          questionNumber: 7
        }
      }, {
        label: 'Opening hours:',
        value: {
          questionNumber: 8
        }
      }, {
        label: 'Special collection access:',
        value: {
          questionNumber: 9
        }
      }, {
        label: 'Password reset:',
        value: {
          questionNumber: 10
        }
      }]
    }]
  }, {
    sectionNumber: 2,
    title: 'Questions 11-20',
    questions: [{
      type: 'multiple-choice',
      questionNumber: 11,
      question: 'The main topic of the lecture is',
      options: [{
        label: 'climate change effects.',
        value: 'A'
      }, {
        label: 'renewable energy sources.',
        value: 'B'
      }, {
        label: 'environmental policies.',
        value: 'C'
      }]
    }, {
      type: 'multiple-choice',
      questionNumber: 12,
      question: 'According to the professor, solar panels are most effective in',
      options: [{
        label: 'urban areas.',
        value: 'A'
      }, {
        label: 'desert regions.',
        value: 'B'
      }, {
        label: 'coastal zones.',
        value: 'C'
      }]
    }, {
      type: 'sentence-completion',
      instruction: 'Complete the sentences below. Write NO MORE THAN TWO WORDS for each answer.',
      items: [{
        questionNumber: 13,
        text: 'Wind energy is considered a _______ resource.'
      }, {
        questionNumber: 14,
        text: 'The main disadvantage is the _______ of wind.'
      }, {
        questionNumber: 15,
        text: 'Modern turbines can generate up to _______ megawatts.'
      }, {
        questionNumber: 16,
        text: 'Installation costs have _______ in recent years.'
      }, {
        questionNumber: 17,
        text: 'Countries like Denmark use wind for _______ of their electricity.'
      }, {
        questionNumber: 18,
        text: 'Offshore wind farms have _______ efficiency.'
      }, {
        questionNumber: 19,
        text: 'The main challenge is _______ storage.'
      }, {
        questionNumber: 20,
        text: 'Future developments include _______ wind technology.'
      }]
    }]
  }, {
    sectionNumber: 3,
    title: 'Questions 21-30',
    questions: [{
      type: 'multiple-choice',
      questionNumber: 21,
      question: 'What does the student say about the assignment?',
      options: [{
        label: 'It is too difficult.',
        value: 'A'
      }, {
        label: 'It is due next week.',
        value: 'B'
      }, {
        label: 'It requires group work.',
        value: 'C'
      }]
    }, {
      type: 'multiple-choice',
      questionNumber: 22,
      question: 'The tutor recommends starting with',
      options: [{
        label: 'a literature review.',
        value: 'A'
      }, {
        label: 'data collection.',
        value: 'B'
      }, {
        label: 'research questions.',
        value: 'C'
      }]
    }, {
      type: 'sentence-completion',
      instruction: 'Complete the notes below. Write NO MORE THAN THREE WORDS for each answer.',
      items: [{
        questionNumber: 23,
        text: 'Research methodology: Use both _______ and qualitative data'
      }, {
        questionNumber: 24,
        text: 'Sample size: At least _______'
      }, {
        questionNumber: 25,
        text: 'Data analysis: Consider using _______'
      }, {
        questionNumber: 26,
        text: 'Citation style: Must follow _______'
      }, {
        questionNumber: 27,
        text: 'Deadline for draft: _______'
      }, {
        questionNumber: 28,
        text: 'Final submission: Include _______'
      }, {
        questionNumber: 29,
        text: 'Presentation: Prepare _______ slides'
      }, {
        questionNumber: 30,
        text: 'Assessment criteria: Focus on _______'
      }]
    }]
  }, {
    sectionNumber: 4,
    title: 'Questions 31-40',
    questions: [{
      type: 'dropdown',
      instruction: 'Choose the correct letter, A, B or C.',
      items: [{
        questionNumber: 31,
        statement: 'Historical buildings should be preserved.'
      }, {
        questionNumber: 32,
        statement: 'Modern architecture is more practical.'
      }, {
        questionNumber: 33,
        statement: 'Urban planning needs community input.'
      }, {
        questionNumber: 34,
        statement: 'Green spaces improve quality of life.'
      }, {
        questionNumber: 35,
        statement: 'Public transport reduces pollution.'
      }, {
        questionNumber: 36,
        statement: 'High-rise buildings save space.'
      }, {
        questionNumber: 37,
        statement: 'Smart cities use technology efficiently.'
      }, {
        questionNumber: 38,
        statement: 'Pedestrian zones increase safety.'
      }, {
        questionNumber: 39,
        statement: 'Mixed-use developments are beneficial.'
      }, {
        questionNumber: 40,
        statement: 'Sustainable design is the future.'
      }],
      options: [{
        label: 'Dr. Chen',
        value: 'A'
      }, {
        label: 'Prof. Williams',
        value: 'B'
      }, {
        label: 'Ms. Anderson',
        value: 'C'
      }]
    }]
  }]
};
