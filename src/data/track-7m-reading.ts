// Track: 7-M Reading
import { Track } from './track1';

export const track7MReading: Track = {
  id: 'track-7m-reading',
  name: '7-M Reading',
  shortName: '7MR',
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
        title: 'History of Refrigeration',
        content: `You should spend about 20 minutes on Questions 1-14 which are based on Reading Passage 1 below.

Refrigeration is a process of removing heat, which means cooling an area or a substance below the environmental temperature. Mechanical refrigeration makes use of the evaporation of a liquid refrigerant, which goes through a cycle so that it can be reused. The main cycles include vapour-compression, absorption steam-jet or steam-ejector, and airing. The term 'refrigerator' was first introduced by a Maryland farmer Thomas Moore in 1803, but it is in the 20th century that the appliance we know today first appeared.

People used to find various ways to preserve their food before the advent of mechanical refrigeration systems. Some preferred using cooling systems of ice or snow, which meant that diets would have consisted of very little fresh food or fruits and vegetables, but mostly of bread, cheese and salted meals. For milk and cheeses, it was very difficult to keep them fresh, so such foods were usually stored in a cellar or window box. In spite of those measures, they could not survive rapid spoilage. Later on, people discovered that adding such chemicals as sodium nitrate or potassium nitrate to water could lead to a lower temperature. In 1550 when this technique was first recorded, people used it to cool wine, as was the term 'to refrigerate'. Cooling drinks grew very popular in Europe by 1600, particularly in Spain, France, and Italy. Instead of cooling water at night, people used a new technique: rotating long-necked bottles of water which held dissolved saltpeter. The solution was intended to create very low temperatures and even to make ice. By the end of the 17th century, iced drinks including frozen juices and liquors had become extremely fashionable in France.

People's demand for ice soon became strong. Consumers' soaring requirement for fresh food, especially for green vegetables, resulted in reform in people's dieting habits between 1830 and the American Civil War, accelerated by a drastic expansion of the urban areas and the rapid amelioration in an economy of the populace. With the growth of the cities and towns, the distance between the consumer and the source of food was enlarged. In the 1799s as a commercial product, ice was first transported out of Canal Street in New York City to Charleston, South Carolina. Unfortunately, this transportation was not successful because when the ship reached the destination, little ice left. Frederick Tudor and Nathaniel Wyeth, two New England businessmen, grasped the great potential opportunities for ice business and managed to improve the storage method of ice in the process of shipment. The acknowledged 'Ice King' in that time, Tudor concentrated his efforts on bringing the ice to the tropical areas. In order to achieve his goal and guarantee the ice to arrive at the destination safely he tried many insulating materials in an experiment and successfully constructed the ice containers, which reduce the ice loss from 66 per cent to less than 8 per cent drastically. Wyeth invented an economical and speedy method to cut the ice into uniform blocks, which had a tremendous positive influence on the ice industry. Also, he improved the processing techniques for storing, transporting and distributing ice with less waste.

When people realised that the ice transported from the distance was not as clean as previously thought and gradually caused many health problems, it was more demanding to seek the clean natural sources of ice. To make it worse, by the 1890s water pollution and sewage dumping made clean ice even more unavailable. The adverse effect first appeared in the blowing industry, and then seriously spread to such sectors as meat packing and dairy industries. As a result, the clean, mechanical refrigeration was considerably in need.

Many inventors with creative ideas took part in the process of inventing refrigeration, and each version was built on the previous discoveries. Dr William Cullen initiated to study the evaporation of liquid under the vacuum conditions in 1720. He soon invented the first man-made refrigerator at the University of Glasgow in 1748 with the employment of ethyl ether boiling into a partial vacuum. American inventor Oliver Evans designed the refrigerator firstly using vapour rather than liquid in 1805. Although his conception was not put into practice in the end the mechanism was adopted by an American physician John Gorrie, who made one cooling machine similar to Evans' in 1842 with the purpose of reducing the temperature of the patient with yellow fever in a Florida hospital. Until 1851, Evans obtained the first patent for mechanical refrigeration in the USA. In 1820, Michael Faraday, a Londoner, first liquefied ammonia to cause cooling. In 1859, Ferdinand Carre from France invented the first version of the ammonia water cooling machine.

In 1873, Carl von Linde designed the first practical and portable compressor refrigerator in Munich, and in 1876 he abandoned the methyl ether system and began using ammonia cycle. Linde later created a new method ('Linde technique') for liquefying large amounts of air in 1894. Nearly a decade later, this mechanical refrigerating method was adopted subsequently by the meat packing industry in Chicago.

Since 1840, cars with the refrigerating system had been utilised to deliver and distribute milk and butter. Until 1860, most seafood and dairy products were transported with cold-chain logistics. In 1867, refrigerated railroad cars are patented to J.B. Sutherland from Detroit, Michigan, who invented insulated cars by installing the ice bunkers at the end of the cars: air came in from the top, passed through the bunkers, circulated through the cars by gravity and controlled by different quantities of hanging flaps which caused different air temperatures. Depending on the cargo (such as meat, fruits etc.) transported by the cars, different car designs came into existence. In 1867, the first refrigerated car to carry fresh fruit was manufactured by Parker Earle of Illinois, who shipped strawberries on the Illinois Central Railroad. Each chest was freighted with 100 pounds of ice and 200 quarts of strawberries. Until 1949, the trucking industry began to be equipped with the refrigeration system with a roof-mounted cooling device, invented by Fred Jones.

From the late 1800s to 1929, the refrigerators employed toxic gases – methyl chloride, ammonia, and sulfur dioxide – as refrigerants. But in the 1920s, a great number of lethal accidents took place due to the leakage of methyl chloride out of refrigerators. Therefore, some American companies started to seek some secure methods of refrigeration. Frigidaire detected a new class of synthetic refrigerants called halocarbons or CFCs (chlorofluorocarbons) in 1928. This research led to the discovery of chlorofluorocarbons (Freon), which quickly became the prevailing material in compressor refrigerators. Freon was safer for the people in the vicinity, but in 1973 it was discovered to have detrimental effects on the ozone layer. After that, new improvements were made, and Hydrofluorocarbons, with no known harmful effects, was used in the cooling system. Simultaneously, nowadays, Chlorofluorocarbons (CFCs) are no longer used; they are announced illegal in several places, making the refrigeration far safer than before.`
      },
      questions: [
        {
          type: 'drag-and-drop',
          instruction: 'Use the information in the passage to match the events (listed A-F) with the dates below by dragging the date into the appropriate box.',
          items: [
            {
              questionNumber: 1,
              label: 'Vehicles with refrigerator were used to transport on the road.'
            },
            {
              questionNumber: 2,
              label: 'Ice was sold around the United States for the first time.'
            },
            {
              questionNumber: 3,
              label: 'Some kind of chemical refrigerant was found harmful to the atmosphere.'
            },
            {
              questionNumber: 4,
              label: "The term 'refrigerator' was firstly introduced."
            },
            {
              questionNumber: 5,
              label: 'Some chemicals were added to refrigerate wine.'
            }
          ],
          options: [
            { label: 'A. 1550', value: 'A' },
            { label: 'B. 1799', value: 'B' },
            { label: 'C. 1803', value: 'C' },
            { label: 'D. 1840', value: 'D' },
            { label: 'E. 1949', value: 'E' },
            { label: 'F. 1973', value: 'F' }
          ]
        },
        {
          type: 'drag-drop-table',
          instruction: 'Look at the following opinions or deeds (Questions 6-10) and the list of people below. Match each opinion or deed with the correct person by dragging the person\'s letter into the appropriate cell. NB You may use any letter more than once.',
          title: 'List of People',
          tableData: {
            headers: ['', 'List of People'],
            rows: [
              { cells: ['A', 'Thomas Moore'] },
              { cells: ['B', 'Frederick Tudor'] },
              { cells: ['C', 'Carl Von Linde'] },
              { cells: ['D', 'Nathaniel Wyeth'] },
              { cells: ['E', 'J.B. Sutherland'] },
              { cells: ['F', 'Fred Jones'] },
              { cells: ['G', 'Parker Earle'] }
            ]
          },
          items: [
            {
              questionNumber: 6,
              label: 'Patented the idea that refrigerating system can be installed on tramcars.'
            },
            {
              questionNumber: 7,
              label: 'Invented an ice-cutting technical method that could save money and time.'
            },
            {
              questionNumber: 8,
              label: 'Enabled the cold storage technology to be applied in fruit.'
            },
            {
              questionNumber: 9,
              label: 'Invented a cooling device applied into the trucking industry.'
            },
            {
              questionNumber: 10,
              label: 'Created a new technique to liquefy the air.'
            }
          ],
          options: [
            { label: 'A. Thomas Moore', value: 'A' },
            { label: 'B. Frederick Tudor', value: 'B' },
            { label: 'C. Carl Von Linde', value: 'C' },
            { label: 'D. Nathaniel Wyeth', value: 'D' },
            { label: 'E. J.B. Sutherland', value: 'E' },
            { label: 'F. Fred Jones', value: 'F' },
            { label: 'G. Parker Earle', value: 'G' }
          ]
        },
        {
          type: 'drag-and-drop',
          instruction: 'Use the information in the passage to match the sentence stems (listed A-E) with the endings below by dragging the ending into the appropriate box. NB You may use any letter more than once.',
          items: [
            {
              questionNumber: 11,
              label: "A healthy dietary change between 1830 and the American Civil War was greatly associated with"
            },
            {
              questionNumber: 12,
              label: 'The development of urbanisation was likely to cause'
            },
            {
              questionNumber: 13,
              label: 'Problems due to water treatment contributed to'
            },
            {
              questionNumber: 14,
              label: 'The risk of the environmental devastation from the refrigeration led to'
            }
          ],
          options: [
            { label: "A. new developments, such as the application of Hydrofluorocarbons.", value: 'A' },
            { label: "B. consumers' demand for fresh food, especially for vegetables.", value: 'B' },
            { label: 'C. the discovery of chlorofluorocarbons (Freon).', value: 'C' },
            { label: 'D. regional transportation system for refrigeration for a long distance.', value: 'D' },
            { label: 'E. extensive spread of the refrigeration method.', value: 'E' }
          ]
        }
      ]
    },
    {
      sectionNumber: 2,
      title: 'READING PASSAGE 2',
      passage: {
        title: 'The Evolutionary Mystery: Crocodile Survives',
        content: `You should spend about 20 minutes on Questions 15-27 which are based on Reading Passage 2 below.

A

Even though crocodiles have existed for 200 million years, they're anything but primitive. As crocodiles' ancestors, crocodilia came to adapt to an aquatic lifestyle. When most of the other contemporary reptiles went extinct, crocodiles were able to make it because their bodies changed and they adapted better to the climate. They witnessed the rise and fall of the dinosaurs, which once ruled the planet, and even the 65 million years of alleged mammalian dominance didn't wipe them off. Nowadays, the crocodiles and alligators are not that different from their prehistoric ancestors, which proves that they were (and still are) incredibly adaptive.

B

The first crocodile-like ancestors came into existence approximately 230 million years ago, and they had many of the features which make crocodiles natural and perfect stealth hunters: streamlined body, long tail, protective armour and long jaws. They are born with four short, webbed legs, but this does not mean that their capacity to move on the ground shall ever be underestimated. When they move, they are so fast that you won't even have any chance to try making the same mistake again by getting too close, especially when they're hunting.

C

Like other reptiles, crocodiles are poikilothermal animals (commonly known as cold-blooded, whose body temperature changes with that of the surroundings) and consequently, require exposure to sunlight regularly to raise body temperature. When it is too hot, they would rather stay in water or shade. Compared with mammals and birds, crocodiles have a slower metabolism, which makes them less vulnerable to food shortage. In the most extreme case, a crocodile can slow its metabolism down even further, to the point that it would survive without food for a whole year, enabling them to outlive mammals in relatively volatile environments.

D

Crocodiles have a highly efficient way to prey catching. The prey rarely realises there might be a crocodile under the water because the crocodile makes a move without any noise or great vibration when spotting its prey. It only keeps its eyes above the water level. As soon as it feels close enough to the victim, it jerks out of the water with its wide open jaws. Crocodiles are successful because they are capable of switching feeding methods. It chases after fish and snatches birds at the water surface, hides in the waterside bushes in anticipation of a gazelle, and when the chance to ambush presents itself, the crocodile dashes forward, knocks the animal out with its powerful tail and then drags the prey into the water to drown.

E

In many crocodilian habitats, the hot season brings drought that dries up their hunting grounds, leaving it harder for them to regulate body temperatures. This actually allowed reptiles to rule. For instance, many crocodiles can protect themselves by digging holes and covering themselves in mud, waiting for months without consuming any food or water until the rains finally return. They transform into a quiescent state called aestivation.

F

The majority of crocodilian is considered to go into aestivation during the dry season. In a six-year study by Kennett and Christian, the King Crocodiles, a species of Australian freshwater crocodiles, spent nearly four months a year underground without access to water resources. Doubly labelled water was applied to detect field metabolic rates and water flux, and during some years, plasma fluid samples were taken once a month to keep track of the effects of aestivation regarding the accumulation of nitrogenous wastes and electrolyte concentrations.

G

The study discovered that the crocodiles' metabolic engines function slowly, creating waste and exhausting water and fat reserves. Waste is stored in the urine, becoming more and more concentrated. Nevertheless, the concentration of waste products in blood doesn't fluctuate much, allowing the crocodiles to carry on their normal functions. Besides, even though the crocodiles lost water reserves and body weight when underground, the losses were proportional; upon emerging, the aestivating animals had no dehydration and displayed no other harmful effects such as a slowed-down growth rate. The two researchers reckon that this capacity of crocodiles to get themselves through the harsh times and the long starvation periods is sure to be the answer to the crocodilian line's survival throughout history.`
      },
      questions: [
        {
          type: 'drag-and-drop',
          instruction: 'Use the information in the passage to match the paragraphs (listed i-xi) with the headings below by dragging the heading into the appropriate box. NB You may use any letter more than once.',
          items: [
            {
              questionNumber: 15,
              label: 'Paragraph A'
            },
            {
              questionNumber: 16,
              label: 'Paragraph B'
            },
            {
              questionNumber: 17,
              label: 'Paragraph C'
            },
            {
              questionNumber: 18,
              label: 'Paragraph D'
            },
            {
              questionNumber: 19,
              label: 'Paragraph E'
            },
            {
              questionNumber: 20,
              label: 'Paragraph F'
            },
            {
              questionNumber: 21,
              label: 'Paragraph G'
            }
          ],
          options: [
            { label: 'i. The favourable feature in the impact of a drought', value: 'i' },
            { label: 'ii. A unique finding that was recently achieved', value: 'ii' },
            { label: 'iii. Slow metabolism which makes crocodile a unique reptile', value: 'iii' },
            { label: 'iv. The perfectly designed body for a great land roamer', value: 'iv' },
            { label: 'v. Shifting eating habits and food intake', value: 'v' },
            { label: 'vi. A project on a special mechanism', value: 'vi' },
            { label: 'vii. Regulating body temperature by the surrounding environment', value: 'vii' },
            { label: 'viii. Underwater aid in body structure offered to a successful predator', value: 'viii' },
            { label: 'ix. A historical story for the supreme survivors', value: 'ix' },
            { label: 'x. What makes the crocodile the fastest running animal on land', value: 'x' },
            { label: 'xi. The competition between the crocodiles and other animals', value: 'xi' }
          ]
        },
        {
          type: 'paragraph-gap',
          instruction: 'Complete the summary below. Choose NO MORE THAN TWO WORDS from the passage for each answer. Write your answers in boxes 22-27 on your answer sheet.',
          paragraph: `Aestivation

In many places inhabited by crocodilians, most types of crocodiles have evolved a successful scheme to survive in the drought brought by a (22)………………………. According to Kennett and Christian's six-year study of Australian freshwater crocodiles' aestivation, they found estivating crocodiles spent around (23)………………………… of the year and had no access to (24)…………………… The amount of water in the body declined proportionately with (25)………………………; thus there is no sign of (26)………………………… and other health-damaging impact on the crocodiles even after an aestivation period. This super capacity helps crocodiles endure the tough drought without slowing their speed of (27)………………………….`,
          questionNumbers: [22, 23, 24, 25, 26, 27]
        }
      ]
    },
    {
      sectionNumber: 3,
      title: 'READING PASSAGE 3',
      passage: {
        title: 'Elephant Communication',
        content: `You should spend about 20 minutes on Questions 28-40 which are based on Reading Passage 3 below.

O'Connell-Rodwell, a postdoctoral fellow at Stanford University, has travelled to Namibia's first-ever wildlife reserve to explore the mystical and complicated realm of elephant communication. She, along with her colleagues, is part of a scientific revolution that started almost 20 years ago. This revolution has made a stunning revelation: elephants are capable of communicating with each other over long distances with low-frequency sounds, also known as infrasounds, which are too deep for humans to hear.

As might be expected, African elephants able to detect seismic sound may have something to do with their ears. The hammer bone in an elephant's inner ear is proportionally huge for a mammal, but it is rather normal for animals that use vibrational signals. Thus, it may be a sign that suggests elephants can use seismic sounds to communicate.

Other aspects of elephant anatomy also support that ability. First, their massive bodies, which enable them to give out low-frequency sounds almost as powerful as the sound a jet makes during takeoff, serve as ideal frames for receiving ground vibrations and transmitting them to the inner ear. Second, the elephant's toe bones are set on a fatty pad, which might be of help when focusing vibrations from the ground into the bone. Finally, the elephant has an enormous brain that sits in the cranial cavity behind the eyes in line with the auditory canal. The front of the skull is riddled with sinus cavities, which might function as resonating chambers for ground vibrations.

It remains unclear how the elephants detect such vibrations, but O'Connell-Rodwell raises a point that the pachyderms are 'listening' with their trunks and feet instead of their ears. The elephant trunk may just be the most versatile appendage in nature. Its utilization encompasses drinking, bathing, smelling, feeding and scratching. Both trunk and feet contain two types of nerve endings that are sensitive to pressure – one detects infrasonic vibration, and another responds to vibrations higher in frequencies. As O'Connell-Rodwell sees, this research has a boundless and unpredictable future. 'Our work is really interfaced of geophysics, neurophysiology and ecology,' she says. 'We're raising questions that have never even been considered before.'

It has been well-known to scientists that seismic communication is widely observed among small animals, such as spiders, scorpions, insects and quite a lot of vertebrate species like white-lipped frogs, blind mole rats, kangaroo rats and golden moles. Nevertheless, O'Connell-Rodwell first argued that a giant land animal is also sending and receiving seismic signals. 'I used to lay a male planthopper on a stem and replay the calling sound of a female, and then the male one would exhibit the same kind of behaviour that happens in elephants—he would freeze, then press down on his legs, move forward a little, then stay still again. I find it so fascinating, and it got me thinking that perhaps auditory communication is not the only thing that is going on.'

Scientists have confirmed that an elephant's capacity to communicate over long distance is essential for survival, especially in places like Etosha, where more than 2,400 savanna elephants range over a land bigger than New Jersey. It is already difficult for an elephant to find a mate in such a vast wild land, and the elephant reproductive biology only complicates it. Breeding herds also adopt low-frequency sounds to send alerts regarding predators. Even though grown-up elephants have no enemies else than human beings, baby elephants are vulnerable and are susceptible to lions and hyenas attack. At the sight of a predator, older ones in the herd will clump together to form protection before running away.

We now know that elephants can respond to warning calls in the air, but can they detect signals transmitted solely through the ground? To look into that matter, the research team designed an experiment in 2002, which used electronic devices that enabled them to give out signals through the ground at Mushara. 'The outcomes of our 2002 study revealed that elephants could indeed sense warning signals through the ground,' O'Connell-Rodwell observes.

Last year, an experiment was set up in the hope of solving that problem. It used three different recordings—the 1994 warning call from Mushara, an anti-predator call recorded by scientist Joyce Poole in Kenya and a made-up warble tone. 'The data I've observed to this point implies that the elephants were responding the way I always expected. However, the fascinating finding is that the anti-predator call from Kenya, which is unfamiliar to them, caused them to gather around, tense up and rumble aggressively as well—but they didn't always flee. I didn't expect the results to be that clear-cut.'`
      },
      questions: [
        {
          type: 'map-text-input',
          instruction: 'Label the diagram below. Choose NO MORE THAN TWO WORDS from the passage for each answer. Write your answers in boxes 28-31 on your answer sheet.',
          imageUrl: 'https://customer-assets.emergentagent.com/job_reading-track-1/artifacts/44pvg2kk_elephant%20anatomy%20diagram.jpeg',
          labels: [
            {
              questionNumber: 28,
              position: { x: 65, y: 15 },
              text: ''
            },
            {
              questionNumber: 29,
              position: { x: 70, y: 50 },
              text: ''
            },
            {
              questionNumber: 30,
              position: { x: 85, y: 85 },
              text: ''
            },
            {
              questionNumber: 31,
              position: { x: 15, y: 20 },
              text: ''
            }
          ]
        },
        {
          type: 'paragraph-gap',
          instruction: 'Complete the summary below. Choose NO MORE THAN THREE WORDS from the passage for each answer. Write your answers in boxes 32-38 on your answer sheet.',
          paragraph: `How the elephants sense these sound vibrations is still unknown, but O'Connell-Rodwell, a postdoctoral researcher at Stanford University, proposes that elephants are 'listening' with their 32…………………….. by two kinds of nerve endings that respond to vibrations with both 33…………………….. frequency and slightly higher frequencies. O'Connell-Rodwell's work is at the combination of geophysics, neurophysiology and 34………………………. It was known that seismic communication existed extensively within small animals, but O'Connell-Rodwell was the first person to indicate that a large land animal would send and receive 35………………………. too. Also, he noticed the freezing behavior by putting a male plant hopper on a stem and play back a female call, which might prove the existence of other communicative approaches besides 36……………………… Scientists have determined that an elephant's ability to communicate over long distances is essential, especially, when elephant herds are finding a 37………………………….., or are warning of predators. Finally, the results of our 2002 study showed us that elephants could detect warning calls through the 38…………………………..`,
          questionNumbers: [32, 33, 34, 35, 36, 37, 38]
        },
        {
          type: 'multiple-choice',
          questionNumber: 39,
          question: 'According to the passage, it is determined that an elephant needs to communicate over long distances for its survival',
          options: [
            { label: 'A. when a threatening predator appears.', value: 'A' },
            { label: 'B. when young elephants meet humans.', value: 'B' },
            { label: 'C. when older members of the herd want to flee from the group.', value: 'C' },
            { label: 'D. when a male elephant is in estrus.', value: 'D' }
          ]
        },
        {
          type: 'multiple-choice',
          questionNumber: 40,
          question: "What is the author's attitude toward the experiment by using three different recordings in the last paragraph?",
          options: [
            { label: 'A. The outcome is definitely out of the original expectation.', value: 'A' },
            { label: 'B. The data cannot be very clearly obtained.', value: 'B' },
            { label: 'C. The result can be somewhat undecided or inaccurate.', value: 'C' },
            { label: 'D. The result can be unfamiliar to the public.', value: 'D' }
          ]
        }
      ]
    }
  ]
};
