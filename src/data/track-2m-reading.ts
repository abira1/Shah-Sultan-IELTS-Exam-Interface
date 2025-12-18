// Track: 2-M Reading
import { Track } from './track1';

export const track2MReading: Track = {
  id: 'track-2m-reading',
  name: '2-M Reading',
  shortName: '2MR',
  description: 'IELTS Reading Practice Test - Academic Reading with 3 parts and 40 questions',
  duration: 60,
  totalQuestions: 40,
  trackType: 'reading',
  audioURL: null,
  sections: [
    {
      sectionNumber: 1,
      title: 'READING PASSAGE 1',
      passage: {
        title: 'Food for thought 2',
        content: `A
There are not enough classrooms at the Msekeni primary school, so half the lessons take place in the shade of yellow-blossomed acacia trees. Given this shortage, it might seem odd that one of the school's purpose-built classrooms has been emptied of pupils and turned into a storeroom for sacks of grain. But it makes sense. Food matters more than shelter.

B
Msekeni is in one of the poorer parts of Malawi, a landlocked southern African country of exceptional beauty and great poverty. No war lays waste Malawi, nor is the land unusually crowed or infertile, but Malawians still have trouble finding enough to eat. Half of the children under five are underfed to the point of stunting. Hunger blights most aspects of Malawian life, so the country is as good a place as any to investigate how nutrition affects development, and vice versa.

C
The headmaster at Msekeni, Bernard Kumanda, has strong views on the subject. He thinks food is a priceless teaching aid. Since 1999, his pupils have received free school lunches. Donors such as the World Food Programme (WFP) provide the food: those sacks of grain (mostly mixed maize and soya bean flour, enriched with vitamin A) in that converted classroom. Local volunteers do the cooking – turning the dry ingredients into a bland but nutritious slop and spooning it out on to plastic plates. The children line up in large crowds, cheerfully singing a song called "We are getting porridge".

D
When the school's feeding programme was introduced, enrolment at Msekeni doubled. Some of the new pupils had switched from nearby schools that did not give out free porridge, but most were children whose families had previously kept them at home to work. These families were so poor that the long-term benefits of education seemed unattractive when setting against the short-term gain of sending children out to gather firewood or help in the fields. One plate of porridge a day completely altered the calculation. A child fed at school will not howl so plaintively for food at home. Girls, who are more likely than boys to be kept out of school, are given extra snacks to take home.

E
When a school takes in a horde of extra students from the poorest homes, you would expect standards to drop. Anywhere in the world, poor kids tend to perform worse than their better-off classmates. When the influx of new pupils is not accompanied by an increase in the number of teachers, as was the case at Msekeni, you would expect standards to fall even further. But they have not. Pass rates at Msekeni improved dramatically, from 30% to 85%. Although this was an exceptional example, the nationwide results of school feeding programmes were still pretty good. On average, after a Malawian school started handing out free food it attracted 38% more girls and 24% more boys. The pass rate for boys stayed about the same, while for girls it improved by 9.5%.

F
Better nutrition makes for brighter children. Most immediately, well-fed children find it easier to concentrate. It is hard to focus the mind on long division when your stomach is screaming for food. Mr Kumanda says that it used to be easy to spot the kids who were really undernourished. "They were the ones who stared into space and didn't respond when you asked the question," he says. More crucially, though, more and better food helps brains grow and develop. Like any other organ in the body, the brain needs nutrition and exercise. But if it is starved of the necessary calories, proteins and micronutrients, it is stunted, perhaps not as severely as a muscle would be, but stunted nonetheless. That is why feeding children at schools work so well. And the fact that the effect of feeding was more pronounced in girls than in boys gives a clue to who eats first in rural Malawian households. It isn't the girls.

G
On a global scale, the good news is that people are eating better than ever before. Homo sapiens has grown 50% bigger since the industrial revolution. Three centuries ago, chronic malnutrition was more or less universal. Now, it is extremely rare in rich countries. In developing countries, where most people live, plates and rice bowls are also fuller than ever before. The proportion of children under five in the developing world who are malnourished to the point of stunting fell from 39% in 1990 to 30% in 2000, says the World Health Organisation (WHO). In other places, the battle against hunger is steadily being won. Better nutrition is making people cleverer and more energetic, which will help them grow more prosperous. And when they eventually join the ranks of the well off, they can start fretting about growing too fast.`
      },
      questions: [
        {
          type: 'matching-headings',
          instruction: 'The reading passage has seven paragraphs, A-G. Choose the correct heading for paragraphs A-G from the list below by dragging the heading number into the appropriate box.',
          paragraphs: [
            {
              questionNumber: 1,
              paragraphLabel: 'Paragraph A',
              content: ''
            },
            {
              questionNumber: 2,
              paragraphLabel: 'Paragraph B',
              content: ''
            },
            {
              questionNumber: 3,
              paragraphLabel: 'Paragraph C',
              content: ''
            },
            {
              questionNumber: 4,
              paragraphLabel: 'Paragraph D',
              content: ''
            },
            {
              questionNumber: 5,
              paragraphLabel: 'Paragraph E',
              content: ''
            },
            {
              questionNumber: 6,
              paragraphLabel: 'Paragraph F',
              content: ''
            },
            {
              questionNumber: 7,
              paragraphLabel: 'Paragraph G',
              content: ''
            }
          ],
          headings: [
            { label: 'i. Why better food helps students\' learning', value: 'i' },
            { label: 'ii. A song for getting porridge', value: 'ii' },
            { label: 'iii. Surprising use of school premises', value: 'iii' },
            { label: 'iv. Global perspective', value: 'iv' },
            { label: 'v. Brains can be starved', value: 'v' },
            { label: 'vi. Surprising academics outcome', value: 'vi' },
            { label: 'vii. Girls are specially treated in the program', value: 'vii' },
            { label: 'viii. How food program is operated', value: 'viii' },
            { label: 'ix. How food program affects school attendance', value: 'ix' },
            { label: 'x. None of the usual reasons', value: 'x' },
            { label: 'xi. How to maintain an academic standard', value: 'xi' }
          ]
        },
        {
          type: 'sentence-completion',
          instruction: 'Complete the sentences below using NO MORE THAN TWO WORDS AND/OR A NUMBER from the passage.',
          items: [
            {
              questionNumber: 8,
              text: '…………………… are exclusively offered to girls in the feeding programme.'
            },
            {
              questionNumber: 9,
              text: 'Instead of going to school, many children in poverty are sent to collect ……………………. in the fields.'
            },
            {
              questionNumber: 10,
              text: 'The pass rate as Msekeni has risen to …………………….. with the help of the feeding programme.'
            },
            {
              questionNumber: 11,
              text: 'Since the industrial revolution, the size of the modern human has grown by …………………….'
            }
          ]
        },
        {
          type: 'multiple-choice-multi-select',
          instruction: 'Choose TWO letters, A-F. Which TWO of the following statements are true?',
          question: 'Which TWO of the following statements are true?',
          questionNumbers: [12, 13],
          maxSelections: 2,
          options: [
            { label: 'A. Some children are taught in the open air.', value: 'A' },
            { label: 'B. Malawi has trouble to feed its large population.', value: 'B' },
            { label: 'C. No new staffs were recruited when attendance rose.', value: 'C' },
            { label: 'D. Girls enjoy a higher status than boys in the family', value: 'D' },
            { label: 'E. Boys and girls experience the same improvement in the pass rate.', value: 'E' },
            { label: 'F. WHO has cooperated with WFP to provide grain to the school at Msekeni.', value: 'F' }
          ]
        }
      ]
    },
    {
      sectionNumber: 2,
      title: 'READING PASSAGE 2',
      passage: {
        title: 'Biodiversity',
        content: `A 
It seems biodiversity has become a buzzword beloved of politicians, conservationists, protesters and scientists alike. But what exactly is it? The Convention on Biological Diversity, an international agreement to conserve and share the planet's biological riches, provides a good working definition: biodiversity comprises every form of life, from the smallest microbe to the largest animal or plant, the genes that give them their specific characteristics and the ecosystems of which they are apart.

B 
In October, the World Conservation Union (also known as the IUCN) published its updated Red List of Threatened Species, a roll call of 11,167 creatures facing extinction – 121 more than when the list was last published in 2000. But the new figures almost certainly underestimate the crisis. Some 1.2 million species of animal and 270,000 species of plant have been classified, but the well-being of only a fraction has been assessed. The resources are simply not available. The IUCN reports that 5714 plants are threatened, for example, but admits that only 4 per cent of known plants has been assessed. And, of course, there are thousands of species that we have yet to discover. Many of these could also be facing extinction.

C 
It is important to develop a picture of the diversity of life on Earth now so that comparisons can be made in the future and trends identified. But it isn't necessary to observe every single type of organism in an area to get a snapshot of the health of the ecosystem. In many habitats, there are species that are particularly susceptible to shifting conditions, and these can be used as indicator species.

D
In the media, it is usually large, charismatic animals such as pandas, elephants, tigers and whales that get all the attention when a loss of biodiversity is discussed. However, animals or plants far lower down the food chain are often the ones vital for preserving habitats – in the process saving the skins of those more glamorous species. There are known as keystone species.

E 
By studying the complex feeding relationships within habitats, species can be identified that have a particularly important impact on the environment. For example, the members of the fig family are the staple food for hundreds of different species in many different countries, so important that scientists sometimes call figs "jungle burgers". A whole range of animals, from tiny insects to birds and large mammals, feed on everything from the tree's bark and leaves to its flowers and fruits. Many fig species have very specific pollinators. There are several dozen species of the fig tree in Costa Rica, and a different type of wasp has evolved to pollinate each one. Chris Lyle of the Natural History Museum in London – who is also involved in the Global Taxonomy Initiative of the Convention on Biological Diversity – points out that if fig trees are affected by global warming, pollution, disease or any other catastrophe, the loss of biodiversity will be enormous.

F 
Similarly, sea otters play a major role in the survival of giant kelp forests along the coasts of California and Alaska. These "marine rainforests" provide a home for a wide range of other species. The kelp itself is the main food of purple and red sea urchins and in turn, the urchins are eaten by predators, particularly sea otters. They detach an urchin from the seabed then float to the surface and lie on their backs with the urchin shell on their tummy, smashing it open with a stone before eating the contents. Urchins that are not eaten tend to spend their time in rock crevices to avoid the predators. This allows the kelp to grow – and it can grow many centimetres in a day. As the forests form, bits of kelp break off and fall to the bottom to provide food for the urchins in their crevices. The sea otters thrive hunting for sea urchins in the kelp, and many other fish and invertebrates live among the fronds. The problems start when the sea otter population declines. As large predators they are vulnerable – their numbers are relatively small to disease or human hunters can wipe them out. The result is that the sea urchin population grows unchecked and they roam the seafloor eating young kelp fronds. This tends to keep the kelp very short and stops forests developing, which has a huge impact on biodiversity.

G 
Conversely, keystone species can also make dangerous alien species: they can wreak havoc if they end up in the wrong ecosystem. The cactus moth, whose caterpillar is a voracious eater of prickly pear was introduced to Australia to control the rampant cacti. It was so successful that someone thought it would be a good idea to introduce it to Caribbean islands that had the same problem. It solved the cactus menace, but unfortunately, some of the moths have now reached the US mainland – borne on winds and in tourists' luggage – where they are devastating the native cactus populations of Florida.

H
Organisations like the Convention on Biological Diversity work with groups such as the UN and with governments and scientists to raise awareness and fund research. A number of major international meetings – including the World Summit on Sustainable Development in Johannesburg this year – have set targets for governments around the world to slow the loss of biodiversity. And the CITES meeting in Santiago last month added several more names to its list of endangered species for which trade is controlled. Of course, these agreements will prove of limited value if some countries refuse to implement them.

I 
There is cause for optimism, however. There seems to be a growing understanding of the need for sustainable agriculture and sustainable tourism to conserve biodiversity. Problems such as illegal logging are being tackled through sustainable forestry programmes, with the emphasis on minimising the use of rainforest hardwoods in the developed world and on rigorous replanting of whatever trees are harvested. CITES is playing its part by controlling trade in wood from endangered tree species. In the same way, sustainable farming techniques that minimise environmental damage and avoid monoculture.

J 
Action at a national level often means investing in public education and awareness. Getting people like you and me involved can be very effective. Australia and many European countries are becoming increasingly efficient at recycling much of their domestic waste, for example, preserving natural resources and reducing the use of fossil fuels. This, in turn, has a direct effect on biodiversity by minimising pollution, and an indirect effect by reducing the number of greenhouse gases emitted from incinerators and landfill sites. Preserving ecosystems intact for future generations to enjoy is obviously important, but biodiversity is not some kind of optional extra. Variety may be "the spice of life", but biological variety is also our life-support system.`
      },
      questions: [
        {
          type: 'true-false-not-given',
          instruction: 'Do the following statements agree with the information given in Reading Passage 2',
          statements: [
            {
              questionNumber: 14,
              statement: 'The term "biodiversity" consists of living creatures and the environment that they live in.'
            },
            {
              questionNumber: 15,
              statement: 'There are species that have not been researched because it\'s unnecessary to study all creatures.'
            },
            {
              questionNumber: 16,
              statement: 'It is not necessary to investigate all creatures in a certain place.'
            },
            {
              questionNumber: 17,
              statement: 'The press more often than not focuses on animals well-known.'
            },
            {
              questionNumber: 18,
              statement: 'There is a successful case that cactus moth plays a positive role in the US.'
            },
            {
              questionNumber: 19,
              statement: 'Usage of hardwoods is forbidden in some European countries.'
            },
            {
              questionNumber: 20,
              statement: 'Agriculture experts advise farmers to plant single crops in the field in terms of sustainable farming.'
            }
          ]
        },
        {
          type: 'paragraph-gap',
          instruction: 'Complete the following summary of the paragraphs of Reading Passage, using NO MORE THAN TWO WORDS from the Reading Passage for each answer.',
          paragraph: `Because of the ignorance brought by media, people tend to neglect significant creatures called (21)……………………. Every creature has diet connections with others, such as (22)…………………………., which provide a majority of foods for other species. In some states of America, the decline in a number of sea otters leads to the boom of (23)………………………. An impressing case is that imported (24)………………………. successfully tackles the plant cacti in (25)………………………… However, the operation is needed for the government to increase its financial support in (26)………………………..`,
          questionNumbers: [21, 22, 23, 24, 25, 26]
        }
      ]
    },
    {
      sectionNumber: 3,
      title: 'READING PASSAGE 3',
      passage: {
        title: 'Soviet\'s New Working Week',
        content: `A 
"There are no fortresses that Bolsheviks cannot storm". With these words, Stalin expressed the dynamic self-confidence of the Soviet Union's Five Year Plan: weak and backward Russia was to turn overnight into a powerful modern industrial country. Between 1928 and 1932, production of coal, iron and steel increased at a fantastic rate, and new industrial cities sprang up, along with the world's biggest dam. Everyone's life was affected, as collectivised farming drove millions from the land to swell the industrial proletariat. Private enterprise disappeared in city and country, leaving the State supreme under the dictatorship of Stalin. Unlimited enthusiasm was the mood of the day, with the Communists believing that iron will and hard-working manpower alone would bring about a new world.

B 
Enthusiasm spread to time itself, in the desire to make the state a huge efficient machine, where not a moment would be wasted, especially in the workplace. Lenin had already been intrigued by the ideas of the American Frederick Winslow Taylor (1856-1915), whose time-motion studies had discovered ways of stream-lining effort so that every worker could produce the maximum. The Bolsheviks were also great admirers of Henry Ford's assembly line mass production and of his Fordson tractors that were imported by the thousands. The engineers who came with them to train their users helped spread what became a real cult of Ford. Emulating and surpassing such capitalist models formed part of the training of the new Soviet Man, a heroic figure whose unlimited capacity for work would benefit everyone in the dynamic new society. All this culminated in the Plan, which has been characterized as the triumph of the machine, where workers would become supremely efficient robot-like creatures.

C 
Yet this was Communism whose goals had always included improving the lives of the proletariat. One major step in that direction was the sudden announcement in 1927 that reduced the working day from eight to seven hours. In January 1929, all Indus-tries were ordered to adopt the shorter day by the end of the Plan. Workers were also to have an extra hour off on the eve of Sundays and holidays. Typically though, the state took away more than it gave, for this was part of a scheme to increase production by establishing a three-shift system. This meant that the factories were open day and night and that many had to work at highly undesirable hours.

D
Hardly had that policy been announced, though, then Yuri Larin, who had been a close associate of Lenin and architect of his radical economic policy, came up with an idea for even greater efficiency. Workers were free and plants were closed on Sundays. Why not abolish that wasted day by instituting a continuous workweek so that the machines could operate to their full capacity every day of the week? When Larin presented his idea to the Congress of Soviets in May 1929, no one paid much attention. Soon after, though, he got the ear of Stalin, who approved. Suddenly, in June, the Soviet press was filled with articles praising the new scheme. In August, the Council of Peoples' Commissars ordered that the continuous workweek be brought into immediate effect, during the height of enthusiasm for the Plan, whose goals the new schedule seemed guaranteed to forward.

E 
The idea seemed simple enough but turned out to be very complicated in practice. Obviously, the workers couldn't be made to work seven days a week, nor should their total work hours be increased. The solution was ingenious: a new five-day week would have the workers on the job for four days, with the fifth day free; holidays would be reduced from ten to five, and the extra hour off on the eve of rest days would be abolished. Staggering the rest-days between groups of workers meant that each worker would spend the same number of hours on the job, but the factories would be working a full 360 days a year instead of 300. The 360 divided neatly into 72 five-day weeks. Workers in each establishment (at first factories, then stores and offices) were divided into five groups, each assigned a colour which appeared on the new Uninterrupted Work Week calendars distributed all over the country. Colour-coding was a valuable mnemonic device since workers might have trouble remembering what their day off was going to be, for it would change every week. A glance at the colour on the calendar would reveal the free day, and allow workers to plan their activities. This system, however, did not apply to construction or seasonal occupations, which followed a six-day week, or to factories or mines which had to close regularly for maintenance: they also had a six-day week, whether interrupted (with the same day off for everyone) or continuous. In all cases, though, Sunday was treated like any other day.

F 
Official propaganda touted the material and cultural benefits of the new scheme. Workers would get more rest; production and employment would increase (for more workers would be needed to keep the factories running continuously); the standard of living would improve. Leisure time would be more rationally employed, for cultural activities (theatre, clubs, sports) would no longer have to be crammed into a weekend, but could flourish every day, with their facilities far less crowded. Shopping would be easier for the same reasons. Ignorance and superstition, as represented by organized religion, would suffer a mortal blow, since 80 per cent of the workers would be on the job on any given Sunday. The only objection concerned the family, where normally more than one member was working: well, the Soviets insisted, the narrow family was har less important than the vast common good and besides, arrangements could be made for husband and wife to share a common schedule. In fact, the regime had long wanted to weaken or sideline the two greatest potential threats to its total dominance: organised religion and the nuclear family. Religion succumbed, but the family, as even Stalin finally had to admit, proved much more resistant.

G 
The continuous work week, hailed as a Utopia where time itself was conquered and the sluggish Sunday abolished forever, spread like an epidemic. According to official figures, 63 per cent of industrial workers were so employed by April 1930; in June, all industry was ordered to convert during the next year. The fad reached its peak in October when it affected 73 per cent of workers. In fact, many managers simply claimed that their factories had gone over to the new week, without actually applying it. Conforming to the demands of the Plan was important; practical matters could wait. By then, though, problems were becoming obvious. Most serious (though never officially admitted), the workers hated it. Coordination of family schedules was virtually impossible and usually ignored, so husbands and wives only saw each other before or after work; rest days were empty without any loved ones to share them – even friends were likely to be on a different schedule. Confusion reigned: the new plan was introduced haphazardly, with some factories operating five-, six- and seven-day weeks at the same time, and the workers often not getting their rest days at all.

H
The Soviet government might have ignored all that (It didn't depend on public approval), but the new week was far from having the vaunted effect on production. With the complicated rotation system, the work teams necessarily found themselves doing different kinds of work in successive weeks. Machines, no longer consistently in the hands of people how knew how to tend them, were often poorly maintained or even broken. Workers lost a sense of responsibility for the special tasks they had normally performed.

I 
As a result, the new week started to lose ground. Stalin's speech of June 1931, which criticised the "depersonalised labor" its too hasty application had brought, marked the beginning of the end. In November, the government ordered the widespread adoption of the six-day week, which had its own calendar, with regular breaks on the 6th, 12th, 18th, 24th, and 30th, with Sunday usually as a working day. By July 1935, only 26 per cent of workers still followed the continuous schedule, and the six-day week was soon on its way out. Finally, in 1940, as part of the general reversion to more traditional methods, both the continuous five-day week and the novel six-day week were abandoned, and Sunday returned as the universal day of rest. A bold but typically ill-conceived experiment was at an end.`
      },
      questions: [
        {
          type: 'matching-headings',
          instruction: 'Reading Passage 3 has nine paragraphs A-I. Choose the correct heading for each paragraph from the list of headings below by dragging the heading number into the appropriate box.',
          paragraphs: [
            {
              questionNumber: 27,
              paragraphLabel: 'Paragraph A',
              content: ''
            },
            {
              questionNumber: 28,
              paragraphLabel: 'Paragraph B',
              content: ''
            },
            {
              questionNumber: 29,
              paragraphLabel: 'Paragraph D',
              content: ''
            },
            {
              questionNumber: 30,
              paragraphLabel: 'Paragraph E',
              content: ''
            },
            {
              questionNumber: 31,
              paragraphLabel: 'Paragraph F',
              content: ''
            },
            {
              questionNumber: 32,
              paragraphLabel: 'Paragraph G',
              content: ''
            },
            {
              questionNumber: 33,
              paragraphLabel: 'Paragraph H',
              content: ''
            },
            {
              questionNumber: 34,
              paragraphLabel: 'Paragraph I',
              content: ''
            }
          ],
          headings: [
            { label: 'i. Benefits of the new scheme and its resistance', value: 'i' },
            { label: 'ii. Making use of the once wasted weekends', value: 'ii' },
            { label: 'iii. Cutting work hours for better efficiency', value: 'iii' },
            { label: 'iv. Optimism of the great future', value: 'iv' },
            { label: 'v. Negative effects on the production itself', value: 'v' },
            { label: 'vi. Soviet Union\'s five-year plan', value: 'vi' },
            { label: 'vii. The abolishment of the new work-week scheme', value: 'vii' },
            { label: 'viii. The Ford model', value: 'viii' },
            { label: 'ix. Reaction from factory workers and their families', value: 'ix' },
            { label: 'x. The color-coding scheme', value: 'x' },
            { label: 'xi. Establishing a three-shift system', value: 'xi' },
            { label: 'xii. Foreign inspiration', value: 'xii' }
          ]
        },
        {
          type: 'multiple-choice',
          questionNumber: 35,
          question: 'According to paragraph A, the Soviet\'s five-year plan was a success because',
          options: [
            { label: 'A. Bolsheviks built a strong fortress.', value: 'A' },
            { label: 'B. Russia was weak and backward.', value: 'B' },
            { label: 'C. industrial production increased.', value: 'C' },
            { label: 'D. Stalin was confident about the Soviet\'s potential.', value: 'D' }
          ]
        },
        {
          type: 'multiple-choice',
          questionNumber: 36,
          question: 'Daily working hours were cut from eight to seven to',
          options: [
            { label: 'A. improve the lives of all people', value: 'A' },
            { label: 'B. boost industrial productivity.', value: 'B' },
            { label: 'C. get rid of undesirable work hours.', value: 'C' },
            { label: 'D. change the already establish three-shift work system.', value: 'D' }
          ]
        },
        {
          type: 'multiple-choice',
          questionNumber: 37,
          question: 'Many factory managers claimed to have complied with the demands of the new work week because',
          options: [
            { label: 'A. they were pressurized by the state to do so.', value: 'A' },
            { label: 'B. they believed there would not be any practical problems.', value: 'B' },
            { label: 'C. they were able to apply it.', value: 'C' },
            { label: 'D. workers hated the new plan.', value: 'D' }
          ]
        },
        {
          type: 'sentence-completion',
          instruction: 'Answer the questions below using NO MORE THAN TWO WORDS from the passage for each answer.',
          items: [
            {
              questionNumber: 38,
              text: 'Whose idea of continuous work week did Stalin approve and helped to implement?\nAnswer: (38)………………………'
            },
            {
              questionNumber: 39,
              text: 'What method was used to help workers to remember the rotation of their off days?\nAnswer: (39)………………………'
            },
            {
              questionNumber: 40,
              text: 'What was the most resistant force to the new work week scheme?\nAnswer: (40)………………………'
            }
          ]
        }
      ]
    }
  ]
};
