// Track: 6-M Listening
import { Track } from './track1';

export const track6MListening: Track = {
  id: 'track-6m-listening',
  name: '6-M Listening',
  shortName: '6M',
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
          type: 'paragraph-gap',
          instruction: 'Complete the notes below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
          paragraph: 'Living in Easthill\n\n-Cheapest accommodation is in (1)......................... flat.\n-Look on (2)............................ for studio flats.\n-New requirement from landlords – show documents about your (3)..........\n-Check if (4)............. and ........... are included in rent.\n-Best to buy (5).......................bus pass.',
          questionNumbers: [1, 2, 3, 4, 5]
        },
        {
          type: 'multi-column-table',
          instruction: 'Complete the table below. Write NO MORE THAN THREE WORDS AND/OR A NUMBER for each answer.',
          title: '',
          headers: ['', 'Blooms Leisure Club', 'Good Life Centre'],
          rows: [
            {
              cells: [
                { content: 'For non-\nmembers' },
                { content: 'Guided tour available' },
                { content: '(6) ........ for free' }
              ]
            },
            {
              cells: [
                { content: 'Café' },
                { content: '(7) ........ members get 10%\ndiscount' },
                { content: 'Closed at present' }
              ]
            },
            {
              cells: [
                { content: 'Equipment' },
                { content: 'Wide range of machines' },
                { content: 'Machines arranged for\ndoing (8) ........' }
              ]
            },
            {
              cells: [
                { content: 'Facilities' },
                { content: 'Full-size swimming pool is\nnow (9) ........' },
                { content: 'All-weather tennis courts;\nsmall pool' }
              ]
            },
            {
              cells: [
                { content: 'Support' },
                { content: 'Personal trainer always\navailable' },
                { content: 'Consult qualified trainers\n(10) ........ only' }
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
          question: "What did the speaker's friend say about his volunteering and travel experience?",
          options: [
            { label: 'He felt part of the community he visited.', value: 'A' },
            { label: 'It was a cheap way to travel a long distance.', value: 'B' },
            { label: 'The training he received on the trip was very useful.', value: 'C' }
          ]
        },
        {
          type: 'multiple-choice',
          questionNumber: 12,
          question: 'The recent survey shows that increasingly travellers want',
          options: [
            { label: 'to avoid standard tourist destinations.', value: 'A' },
            { label: 'to have more contact with local people.', value: 'B' },
            { label: 'to feel that they can contribute something.', value: 'C' }
          ]
        },
        {
          type: 'multiple-choice',
          questionNumber: 13,
          question: "What does the speaker recommend in a 'voluntouring' trip?",
          options: [
            { label: 'combining different activities', value: 'A' },
            { label: 'learning the language before you go', value: 'B' },
            { label: 'making sure the climate suits you', value: 'C' }
          ]
        },
        {
          type: 'multiple-choice',
          questionNumber: 14,
          question: 'The speaker says you should think about your interests and',
          options: [
            { label: 'how long the trip will last', value: 'A' },
            { label: 'who else will go on the same trip', value: 'B' },
            { label: 'what skills you can offer on the trip', value: 'C' }
          ]
        },
        {
          type: 'multiple-choice',
          questionNumber: 15,
          question: "The speaker says an important benefit of 'voluntourism' for the traveller is",
          options: [
            { label: 'learning about local customs', value: 'A' },
            { label: 'being looked after by local people', value: 'B' },
            { label: 'travelling by local transport', value: 'C' }
          ]
        },
        {
          type: 'multiple-choice',
          questionNumber: 16,
          question: "The speaker recommends getting a business to sponsor your 'voluntourism' trip",
          options: [
            { label: 'because it saves money which you can donate to local people', value: 'A' },
            { label: 'because local people will take you more seriously', value: 'B' },
            { label: 'because businesses are interested in local markets.', value: 'C' }
          ]
        },
        {
          type: 'multiple-choice',
          questionNumber: 17,
          question: 'Why does the speaker say trips that combine work and holidays are a good idea?',
          options: [
            { label: 'They encourage travellers to go back to the places they visit', value: 'A' },
            { label: 'They mean travellers visit places they would not otherwise', value: 'B' },
            { label: 'They reduce the damage travellers cause to the environment', value: 'C' }
          ]
        },
        {
          type: 'multiple-choice',
          questionNumber: 18,
          question: "What criticism was made in a recent newspaper article about 'voluntourism'?",
          options: [
            { label: 'The trips are too short to provide meaningful experiences.', value: 'A' },
            { label: 'People only go on the trips because it is fashionable at present', value: 'B' },
            { label: 'None of the money volunteers pay reaches the local communities', value: 'C' }
          ]
        },
        {
          type: 'multiple-choice-multi-select',
          instruction: 'Choose two letters from the list, A-F.',
          question: "Which TWO things should you check when researching possible 'voluntourism' trips?",
          questionNumbers: [19, 20],
          maxSelections: 2,
          options: [
            { label: 'A. the size of the group of volunteers', value: 'A' },
            { label: 'B. what qualifications are needed', value: 'B' },
            { label: 'C. how long the scheme has been running', value: 'C' },
            { label: 'D. the history of the country', value: 'D' },
            { label: 'E. who your family can contact', value: 'E' },
            { label: 'F. what insurance cover is included', value: 'F' }
          ]
        }
      ]
    },
    {
      sectionNumber: 3,
      title: 'Questions 21-30',
      questions: [
        {
          type: 'multiple-choice-multi-select',
          instruction: 'Choose Two letters from the list, A-E.',
          question: 'Which TWO courses had Jill considered to be interesting when choosing a course?',
          questionNumbers: [21, 22],
          maxSelections: 2,
          options: [
            { label: 'A. archaeology', value: 'A' },
            { label: 'B. architecture', value: 'B' },
            { label: 'C. business administration', value: 'C' },
            { label: 'D. industrial design', value: 'D' },
            { label: 'E. information management', value: 'E' }
          ]
        },
        {
          type: 'multiple-choice-multi-select',
          instruction: 'Choose Two letters from the list, A-E.',
          question: 'Which TWO aspects of student life does Desmond find difficult?',
          questionNumbers: [23, 24],
          maxSelections: 2,
          options: [
            { label: 'A. prioritising tasks', value: 'A' },
            { label: 'B. controlling finances', value: 'B' },
            { label: 'C. getting information from lectures', value: 'C' },
            { label: 'D. working silently in the library', value: 'D' },
            { label: 'E. getting to know other students', value: 'E' }
          ]
        },
        {
          type: 'table-selection',
          instruction: 'Write the correct letter, A, B or C next to questions 25-30.',
          headers: ['', 'A', 'B', 'C'],
          rows: [
            {
              questionNumber: 25,
              label: 'design experiment structure'
            },
            {
              questionNumber: 26,
              label: 'get advice from statistics tutor'
            },
            {
              questionNumber: 27,
              label: 'Compare examples of previous research'
            },
            {
              questionNumber: 28,
              label: 'investigate possible support from IT Section'
            },
            {
              questionNumber: 29,
              label: 'organise focus groups'
            },
            {
              questionNumber: 30,
              label: 'speak at presentation'
            }
          ],
          optionsLegend: [
            { value: 'A', label: 'Desmond' },
            { value: 'B', label: 'Jill' },
            { value: 'C', label: 'both Desmond and Jill' }
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
          instruction: 'Complete the sentences below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
          items: [
            {
              questionNumber: 31,
              text: 'River Turtles\n\nNesting habits\n\n31. The arrau turtle\'s shell is approximately .................long.'
            },
            {
              questionNumber: 32,
              text: '32. A female arrau deposits at least ....................every night.'
            },
            {
              questionNumber: 33,
              text: '33. River terrapins make a noise similar to ..................'
            },
            {
              questionNumber: 34,
              text: '34. Male river terrapins\' heads change ....................in the breeding season.'
            },
            {
              questionNumber: 35,
              text: 'Threats\n\n35. Alexander von Humboldt estimated that ..............................jars of oil were produced at Rio Orinoco.'
            },
            {
              questionNumber: 36,
              text: '36. River terrapins used to be protected by a system of .................. for egg collectors.'
            },
            {
              questionNumber: 37,
              text: '37. River turtles are used in traditional ............................ in Asia.'
            },
            {
              questionNumber: 38,
              text: '38. River turtles can reproduce for several ........................if they are unharmed.'
            },
            {
              questionNumber: 39,
              text: 'Farming as a solution?\n\n39. Turtle farmers are encouraged not to sell turtles until they are ...................'
            },
            {
              questionNumber: 40,
              text: '40. It is uncertain whether turtle farming will be successful in ..................... terms.'
            }
          ]
        }
      ]
    }
  ]
};
