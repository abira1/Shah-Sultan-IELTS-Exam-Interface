// Reading Track 1: Academic Reading Test
import { Track } from './track1';

export const trackReading1: Track = {
  id: 'track-reading-1',
  name: 'IELTS Academic Reading Test 1',
  shortName: 'AR1',
  description: 'IELTS Academic Reading Practice Test - Multiple question types including True/False/Not Given, matching headings, and sentence completion',
  duration: 60,
  totalQuestions: 40,
  trackType: 'reading',
  audioURL: null, // Reading tracks don't use audio
  sections: [
    {
      sectionNumber: 1,
      title: 'Passage 1: Questions 1-13',
      passage: {
        title: 'The History of Refrigeration',
        content: `Refrigeration is a process that removes heat from a space or substance and transfers it to another place, reducing the temperature of the first space or substance. This process is accomplished by various means, the most common being the vapor-compression refrigeration cycle.

The history of refrigeration is long and varied. The ancient Persians were the first to store ice in specially designed buildings called yakhchals. These structures could store ice throughout the summer months. In the 18th century, William Cullen demonstrated artificial refrigeration at the University of Glasgow. However, it wasn't until the 19th century that refrigeration became practical for commercial use.

In 1834, Jacob Perkins built the first practical vapor-compression refrigeration system. It worked by compressing a vapor (ether) and then allowing it to evaporate, cooling the surrounding area. This invention laid the groundwork for modern refrigeration systems.

The impact of refrigeration on society has been profound. It has revolutionized the food industry by allowing for the preservation and transportation of perishable goods over long distances. Before refrigeration, food preservation relied on salting, smoking, or drying methods, which often altered the taste and texture of food. Refrigeration also played a crucial role in medicine, enabling the storage of vaccines and other temperature-sensitive medications.

Today, refrigeration technology continues to evolve. Modern systems are more energy-efficient and environmentally friendly, using refrigerants that have less impact on the ozone layer. Research is ongoing into alternative cooling methods, including magnetic refrigeration and solar-powered systems, which promise to make refrigeration even more sustainable in the future.`
      },
      questions: [
        {
          type: 'true-false-not-given',
          instruction: 'Do the following statements agree with the information given in the passage? Write TRUE if the statement agrees with the information, FALSE if the statement contradicts the information, or NOT GIVEN if there is no information on this.',
          statements: [
            {
              questionNumber: 1,
              statement: 'The ancient Persians were the first people to use refrigeration.'
            },
            {
              questionNumber: 2,
              statement: 'William Cullen\'s demonstration of refrigeration was at the University of Glasgow.'
            },
            {
              questionNumber: 3,
              statement: 'Jacob Perkins\' refrigeration system used ammonia as a refrigerant.'
            },
            {
              questionNumber: 4,
              statement: 'Refrigeration changed the food industry significantly.'
            },
            {
              questionNumber: 5,
              statement: 'Traditional food preservation methods did not affect food quality.'
            }
          ]
        },
        {
          type: 'sentence-completion',
          instruction: 'Complete the sentences below. Choose NO MORE THAN TWO WORDS from the passage for each answer.',
          items: [
            {
              questionNumber: 6,
              text: 'Ancient Persians stored ice in buildings called _______'
            },
            {
              questionNumber: 7,
              text: 'The most common refrigeration method today is the _______ refrigeration cycle'
            },
            {
              questionNumber: 8,
              text: 'Refrigeration has been essential for storing _______ and medications'
            },
            {
              questionNumber: 9,
              text: 'Modern refrigerants have less impact on the _______'
            },
            {
              questionNumber: 10,
              text: 'Future refrigeration research includes _______ refrigeration'
            }
          ]
        },
        {
          type: 'multiple-choice',
          questionNumber: 11,
          question: 'What was the main purpose of Perkins\' invention?',
          options: [
            {
              label: 'To preserve food for long journeys',
              value: 'A'
            },
            {
              label: 'To create a foundation for modern cooling systems',
              value: 'B'
            },
            {
              label: 'To replace traditional food preservation methods',
              value: 'C'
            },
            {
              label: 'To improve medical storage',
              value: 'D'
            }
          ]
        },
        {
          type: 'multiple-choice',
          questionNumber: 12,
          question: 'According to the passage, traditional food preservation methods:',
          options: [
            {
              label: 'Were more effective than refrigeration',
              value: 'A'
            },
            {
              label: 'Often changed the food\'s characteristics',
              value: 'B'
            },
            {
              label: 'Were completely replaced by refrigeration',
              value: 'C'
            },
            {
              label: 'Required more energy than refrigeration',
              value: 'D'
            }
          ]
        },
        {
          type: 'multiple-choice',
          questionNumber: 13,
          question: 'What is the main focus of current refrigeration research?',
          options: [
            {
              label: 'Increasing cooling capacity',
              value: 'A'
            },
            {
              label: 'Reducing costs',
              value: 'B'
            },
            {
              label: 'Improving sustainability',
              value: 'C'
            },
            {
              label: 'Developing new refrigerants',
              value: 'D'
            }
          ]
        }
      ]
    },
    {
      sectionNumber: 2,
      title: 'Passage 2: Questions 14-26',
      passage: {
        title: 'The Impact of Social Media on Communication',
        content: `Social media has fundamentally transformed the way people communicate in the 21st century. Platforms such as Facebook, Twitter, Instagram, and LinkedIn have created new channels for interpersonal interaction, business networking, and information dissemination. While these platforms offer unprecedented opportunities for connection, they also present unique challenges to traditional forms of communication.

One of the most significant impacts of social media is the speed at which information can be shared. News that once took hours or days to spread can now reach millions of people within minutes. This rapid dissemination has both positive and negative consequences. On one hand, it allows for quick mobilization during emergencies and enables real-time updates on important events. On the other hand, it has facilitated the spread of misinformation and fake news, which can have serious social and political implications.

Social media has also changed the nature of personal relationships. People can now maintain connections with friends and family across vast distances, sharing life updates and staying involved in each other's lives despite physical separation. However, critics argue that these digital connections lack the depth and authenticity of face-to-face interactions. Studies have shown that excessive social media use can lead to feelings of isolation and depression, particularly among young people who compare their lives unfavorably to the curated images presented by others online.

In the business world, social media has become an essential marketing tool. Companies can reach target audiences directly, engage with customers, and build brand loyalty through consistent online presence. Influencer marketing has emerged as a powerful strategy, with individuals who have large followings promoting products to their audiences. This has democratized advertising to some extent, allowing smaller businesses to compete with larger corporations.

Despite its prevalence, social media use raises important questions about privacy and data security. Users often share personal information without fully understanding how it might be used by companies or potentially accessed by malicious actors. Governments and regulatory bodies worldwide are grappling with how to protect users while preserving the benefits of these platforms.`
      },
      questions: [
        {
          type: 'yes-no-not-given',
          instruction: 'Do the following statements agree with the views of the writer? Write YES if the statement agrees with the views of the writer, NO if the statement contradicts the views of the writer, or NOT GIVEN if it is impossible to say what the writer thinks about this.',
          statements: [
            {
              questionNumber: 14,
              statement: 'Social media has created entirely new ways for people to interact.'
            },
            {
              questionNumber: 15,
              statement: 'The rapid spread of information on social media is always beneficial.'
            },
            {
              questionNumber: 16,
              statement: 'Young people are more affected by social media than older generations.'
            },
            {
              questionNumber: 17,
              statement: 'Face-to-face communication is superior to digital communication.'
            }
          ]
        },
        {
          type: 'matching-headings',
          instruction: 'The passage has five paragraphs. Choose the correct heading for each paragraph from the list of headings below.',
          paragraphs: [
            {
              questionNumber: 18,
              paragraphLabel: 'Paragraph 1',
              content: 'Introduction to social media transformation'
            },
            {
              questionNumber: 19,
              paragraphLabel: 'Paragraph 2',
              content: 'Information sharing speed'
            },
            {
              questionNumber: 20,
              paragraphLabel: 'Paragraph 3',
              content: 'Personal relationships'
            },
            {
              questionNumber: 21,
              paragraphLabel: 'Paragraph 4',
              content: 'Business applications'
            },
            {
              questionNumber: 22,
              paragraphLabel: 'Paragraph 5',
              content: 'Privacy concerns'
            }
          ],
          headings: [
            {
              label: 'i. The double-edged sword of rapid information spread',
              value: 'i'
            },
            {
              label: 'ii. Social media as a marketing revolution',
              value: 'ii'
            },
            {
              label: 'iii. The evolution of digital communication',
              value: 'iii'
            },
            {
              label: 'iv. Data protection in the digital age',
              value: 'iv'
            },
            {
              label: 'v. Virtual connections versus real relationships',
              value: 'v'
            },
            {
              label: 'vi. The future of social networking',
              value: 'vi'
            },
            {
              label: 'vii. Government regulation of social media',
              value: 'vii'
            }
          ]
        },
        {
          type: 'multiple-choice-multi-select',
          instruction: 'Choose THREE letters, A-F.',
          question: 'Which THREE of the following are mentioned as impacts of social media according to the passage?',
          questionNumbers: [23, 24, 25],
          maxSelections: 3,
          options: [
            {
              label: 'Faster information dissemination',
              value: 'A'
            },
            {
              label: 'Improved mental health',
              value: 'B'
            },
            {
              label: 'Changes in personal relationships',
              value: 'C'
            },
            {
              label: 'Reduced business competition',
              value: 'D'
            },
            {
              label: 'Privacy concerns',
              value: 'E'
            },
            {
              label: 'Decreased use of traditional media',
              value: 'F'
            }
          ]
        },
        {
          type: 'sentence-completion',
          instruction: 'Complete the sentences below. Choose NO MORE THAN THREE WORDS from the passage for each answer.',
          items: [
            {
              questionNumber: 26,
              text: 'In business, social media has become crucial for _______ and customer engagement.'
            }
          ]
        }
      ]
    },
    {
      sectionNumber: 3,
      title: 'Passage 3: Questions 27-40',
      passage: {
        title: 'Renewable Energy: The Path Forward',
        content: `The global transition to renewable energy sources represents one of the most significant technological and economic shifts of the 21st century. As concerns about climate change intensify and fossil fuel reserves diminish, nations worldwide are investing heavily in solar, wind, hydroelectric, and other renewable energy technologies. This transition is not merely an environmental imperative but also an economic opportunity that promises to reshape global energy markets.

Solar energy has experienced remarkable growth in recent years. The cost of solar panels has decreased by more than 80% over the past decade, making solar power competitive with or cheaper than traditional fossil fuels in many regions. Photovoltaic technology has improved dramatically, with modern panels achieving efficiency rates exceeding 20%. Large-scale solar farms now generate gigawatts of electricity, while residential solar installations have become increasingly common, allowing homeowners to reduce their energy bills and carbon footprints simultaneously.

Wind energy represents another crucial component of the renewable energy portfolio. Both onshore and offshore wind farms have proliferated globally, with offshore installations particularly promising due to stronger and more consistent winds at sea. Modern wind turbines are engineering marvels, with some standing over 200 meters tall and generating enough electricity to power thousands of homes. The intermittent nature of wind power has been addressed through improved energy storage technologies and smart grid systems that balance supply and demand across large geographic areas.

Despite these advances, the transition to renewable energy faces significant challenges. Energy storage remains a critical bottleneck, as solar and wind power are inherently variable. Battery technology has improved, but storing energy at the scale required to power entire cities during periods of low renewable generation remains expensive. Grid infrastructure must also be modernized to handle the decentralized nature of renewable energy production, where electricity might be generated by thousands of small sources rather than a few large power plants.

The economic implications of this energy transition are profound. The renewable energy sector has become a major employer, creating millions of jobs in manufacturing, installation, and maintenance. Traditional energy companies are adapting their business models, many investing heavily in renewable technologies. However, this transition also creates challenges for communities dependent on fossil fuel industries, necessitating careful planning and support for affected workers.

Governments play a crucial role in facilitating this transition through policy and investment. Subsidies and tax incentives have helped make renewable energy more competitive, while regulations mandating renewable energy targets drive investment and innovation. International cooperation is essential, as climate change is a global challenge requiring coordinated action. The Paris Agreement exemplifies such cooperation, with nations committing to reduce greenhouse gas emissions and limit global temperature rise.`
      },
      questions: [
        {
          type: 'multiple-choice',
          questionNumber: 27,
          question: 'According to the passage, the transition to renewable energy is important because:',
          options: [
            {
              label: 'It is required by international law',
              value: 'A'
            },
            {
              label: 'It addresses environmental and economic concerns',
              value: 'B'
            },
            {
              label: 'Fossil fuels have become too expensive',
              value: 'C'
            },
            {
              label: 'Traditional energy companies are failing',
              value: 'D'
            }
          ]
        },
        {
          type: 'true-false-not-given',
          instruction: 'Do the following statements agree with the information given in the passage?',
          statements: [
            {
              questionNumber: 28,
              statement: 'Solar panel costs have decreased by more than 80% in the last ten years.'
            },
            {
              questionNumber: 29,
              statement: 'All modern solar panels achieve efficiency rates above 25%.'
            },
            {
              questionNumber: 30,
              statement: 'Offshore wind farms produce more consistent power than onshore facilities.'
            },
            {
              questionNumber: 31,
              statement: 'Some wind turbines are taller than 200 meters.'
            },
            {
              questionNumber: 32,
              statement: 'Energy storage technology has completely solved the variability problem.'
            }
          ]
        },
        {
          type: 'sentence-completion',
          instruction: 'Complete the sentences below. Choose NO MORE THAN TWO WORDS from the passage for each answer.',
          items: [
            {
              questionNumber: 33,
              text: 'Modern wind turbines are described as engineering _______'
            },
            {
              questionNumber: 34,
              text: '_______ systems help balance electricity supply and demand across large areas'
            },
            {
              questionNumber: 35,
              text: 'The renewable energy sector has created millions of _______'
            },
            {
              questionNumber: 36,
              text: 'The _______ Agreement represents international cooperation on climate change'
            }
          ]
        },
        {
          type: 'multiple-choice-multi-select',
          instruction: 'Choose FOUR letters, A-G.',
          question: 'Which FOUR of the following challenges to renewable energy are mentioned in the passage?',
          questionNumbers: [37, 38, 39, 40],
          maxSelections: 4,
          options: [
            {
              label: 'Energy storage limitations',
              value: 'A'
            },
            {
              label: 'Public opposition to wind farms',
              value: 'B'
            },
            {
              label: 'Variable power generation',
              value: 'C'
            },
            {
              label: 'Outdated grid infrastructure',
              value: 'D'
            },
            {
              label: 'Lack of government support',
              value: 'E'
            },
            {
              label: 'Impact on fossil fuel communities',
              value: 'F'
            },
            {
              label: 'Limited land availability',
              value: 'G'
            }
          ]
        }
      ]
    }
  ]
};
