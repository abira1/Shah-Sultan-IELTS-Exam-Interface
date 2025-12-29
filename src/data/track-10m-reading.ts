// Track: 10-M Reading
import { Track } from './track1';

export const track10MReading: Track = {
  id: 'track-10m-reading',
  name: '10-M Reading',
  shortName: '10MR',
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
        title: 'Wolf Pack Social Structure',
        content: `You should spend about 20 minutes on Questions 1-13 which are based on Reading Passage 1 below.

"For the strength of the pack is the wolf, and the strength of the wolf is the pack."
– Rudyard Kipling, The Law for the Wolves

A wolf pack is an extremely well-organised family group with a well-defined social structure and a clear-cut code of conduct. Every wolf has a certain place and function within the pack and every member has to do its fair share of the work. The supreme leader is a very experienced wolf – the alpha – who has dominance over the whole pack. It is the protector and decision-maker and directs the others as to where, when and what to hunt. However, it does not lead the pack into the hunt, for it is far too valuable to risk being injured or killed. That is the responsibility of the beta wolf, who assumes second place in the hierarchy of the pack. The beta takes on the role of enforcer – fighter or 'tough guy'– big, strong and very aggressive. It is both the disciplinarian of the pack and the alpha's bodyguard.

The tester, a watchful and distrustful character, will alert the alpha if it encounters anything suspicious while it is scouting around looking for signs of trouble. It is also the quality controller, ensuring that the others are deserving of their place in the pack. It does this by creating a situation that tests their bravery and courage, by starting a fight, for instance. At the bottom of the social ladder is the omega wolf, subordinate and submissive to all the others, but often playing the role of peacemaker by intervening in an intra-pack squabble and defusing the situation by clowning around. Whereas the tester may create conflict, the omega is more likely to resolve it.

The rest of the pack is made up of mid- to low-ranking non-breeding adults and the immature offspring of the alpha and its mate. The size of the group varies from around six to ten members or more, depending on the abundance of food and numbers of the wolf population in general.

Wolves have earned themselves an undeserved reputation for being ruthless predators and a danger to humans and livestock. The wolf has been portrayed in fairy tales and folklore as a very bad creature, killing any people and other animals it encounters. However, the truth is that wolves only kill to eat, never kill more than they need, and rarely attack humans unless their safety is threatened in some way. It has been suggested that hybrid wolf-dogs or wolves suffering from rabies are actually responsible for many of the historical offences as well as more recent incidents.

Wolves hunt mainly at night. They usually seek out large herbivores, such as deer, although they also eat smaller animals, such as beavers, hares and rodents, if these are obtainable. Some wolves in western Canada are known to fish for salmon. The alpha wolf picks out a specific animal in a large herd by the scent it leaves behind. The prey is often a very young, old or injured animal in poor condition. The alpha signals to its hunters which animal to take down and when to strike by using tail movements and the scent from a gland at the tip of its spine above the tail.

Wolves kill to survive. Obviously, they need to eat to maintain strength and health but the way they feast on the prey also reinforces social order. Every member of the family has a designated spot at the carcass and the alpha directs them to their places through various ear postures: moving an ear forward, flattening it back against the head or swiveling it around. The alpha wolf eats the prized internal organs while the beta is entitled to the muscle-meat of the rump and thigh, and the omega and other low ranks are assigned the intestinal contents and less desirable parts such as the backbone and ribs.

The rigid class structure in a wolf pack entails frequent displays of supremacy and respect. When a higher-ranking wolf approaches, a lesser-ranking wolf must slow down, lower itself, and pass to the side with head averted to show deference; or, in an extreme act of passive submission, it may roll onto its back, exposing its throat and belly. The dominant wolf stands over it, stiff-legged and tall, asserting its superiority and its authority in the pack.`
      },
      questions: [
        {
          type: 'dropdown',
          instruction: 'Classify the following statements as referring to a wolf role. Write the correct letter, A, B, C or D in boxes 1–6 on your answer sheet. You may use any letter more than once.',
          items: [
            {
              questionNumber: 1,
              statement: 'It is at the forefront of the pack when it makes a kill.'
            },
            {
              questionNumber: 2,
              statement: 'It tries to calm tensions and settle disputes between pack members.'
            },
            {
              questionNumber: 3,
              statement: 'It is the wolf in charge and maintains control over the pack.'
            },
            {
              questionNumber: 4,
              statement: 'It warns the leader of potential danger.'
            },
            {
              questionNumber: 5,
              statement: 'It protects the leader of the pack.'
            },
            {
              questionNumber: 6,
              statement: 'It sets up a trial to determine whether a wolf is worthy of its status in the pack.'
            }
          ],
          options: [
            { label: 'A. the alpha wolf', value: 'A' },
            { label: 'B. the beta wolf', value: 'B' },
            { label: 'C. the tester wolf', value: 'C' },
            { label: 'D. the omega wolf', value: 'D' }
          ]
        },
        {
          type: 'true-false-not-given',
          instruction: 'Do the following statements agree with the information given in Reading Passage 1? Write TRUE if the statement is true, FALSE if the statement is false, NOT GIVEN if the information is not given in the passage.',
          statements: [
            {
              questionNumber: 7,
              statement: 'Wolves are a constant danger to humans.'
            },
            {
              questionNumber: 8,
              statement: 'Crossbred wolves or sick wolves are most likely to blame for attacks on people.'
            },
            {
              questionNumber: 9,
              statement: 'Canadian wolves prefer to eat fish, namely salmon.'
            },
            {
              questionNumber: 10,
              statement: 'The wolf pack leader identifies a particular target for attack by its smell.'
            },
            {
              questionNumber: 11,
              statement: 'When wolves attack a herd, they go after the healthiest animal.'
            },
            {
              questionNumber: 12,
              statement: 'The piece of a dead animal that a wolf may eat depends on its status in the pack.'
            },
            {
              questionNumber: 13,
              statement: 'A low-ranking wolf must show submission or the dominant wolf will attack it.'
            }
          ]
        }
      ]
    },
    {
      sectionNumber: 2,
      title: 'READING PASSAGE 2',
      passage: {
        title: 'Environmental Medicine',
        content: `You should spend about 20 minutes on Questions 14-26 which are based on Reading Passage 2 below.

A
In simple terms, environmental medicine deals with the interaction between human and animal health and the environment. It concerns the adverse reactions that people have on contact with or exposure to an environmental excitant. Ecological health is its primary concern, especially emerging infectious diseases and pathogens from insects, plants and vertebrate animals.

B
Practitioners of environmental medicine work in teams involving many other specialists. As well as doctors, clinicians and medical researchers, there may be marine and climate biologists, toxicologists, veterinarians, geospatial and landscape analysts, even political scientists and economists. This is a very broad approach to the rather simple concept that there are causes for all illnesses, and that what we eat and drink or encounter in our surroundings has a direct impact on our health.

C
Central to environmental medicine is the total load theory developed by the clinical ecologist Theron Randolph, who postulated that illness occurs when the body's ability to detoxify environmental excitants has reached its capacity. His wide-ranging perception of what makes up those stimuli includes chemical, physical, biological and psychosocial factors. If a person with numerous and/or chronic exposures to environmental chemicals suffers a psychological upset, for example, this could overburden his immune system and result in actual physical illness. In other words, disease is the product of multiple factors.

D
Another Randolph concept is that of individual susceptibility or the variability in the response of individuals to toxic agents. Individuals may be susceptible to any number of excitants but those exposed to the same risk factors do not necessarily develop the same disease, due in large part to genetic predisposition; however, age, gender, nutrition, emotional or physical stress, as well as the particular infectious agents or chemicals and intensity of exposure, all contribute.

E
Adaptation is defined as the ability of an organism to adjust to gradually changing circumstances of its existence, to survive and be successful in a particular environment. Dr Randolph suggested that our bodies, designed for the Stone Age, have not quite caught up with the modern age and consequently, many people suffer diseases from maladaptation, or an inability to deal with some of the new substances that are now part of our environment. He asserted that this could cause exhaustion, irritability, depression, confusion and behavioural problems in children. Numerous traditional medical practitioners, however, are very sceptical of these assertions.

F
Looking at the environment and health together is a way of making distant and nebulous notions, such as global warming, more immediate and important. Even a slight rise in temperature, which the world is already experiencing, has immediate effects. Mosquitoes can expand their range and feed on different migratory birds than usual, resulting in these birds transferring a disease into other countries. Suburban sprawl is seen as more than a socioeconomic problem for it brings an immediate imbalance to the rural ecosystem, increasing population density so people come into closer contact with disease-carrying rodents or other animals. Deforestation also displaces feral animals that may then infect domesticated animals, which enter the food chain and transmit the disease to people. These kinds of connections are fundamental to environmental medicine and the threat of zoonotic disease looms larger.

G
Zoonoses, diseases of animals transmissible to humans, are a huge concern. Different types of pathogens, including bacteria, viruses, fungi and parasites, cause zoonoses. Every year, millions of people worldwide get sick because of foodborne bacteria such as salmonella and campylobacter, which cause fever, diarrhoea and abdominal pain. Tens of thousands of people die from the rabies virus after being bitten by rabid animals like dogs and bats. Viral zoonoses like avian influenza (bird flu), swine flu (H1N1 virus) and Ebola are on the increase with more frequent, often uncontainable, outbreaks. Some animals (particularly domestic pets) pass on fungal infections to humans. Parasitic infection usually occurs when people come into contact with food or water contaminated by animals that are infected with parasites like cryptosporidium, trichinella, or worms.

H
As the human population of the planet increases, encroaching further on animal domains and causing ecological change, inter-professional cooperation is crucial to meet the challenges of dealing with the effects of climate change, emergent cross-species pathogens, rising toxicity in air, water and soil, and uncontrolled development and urbanisation. This can only happen if additional government funds are channelled into the study and practice of environmental medicine.`
      },
      questions: [
        {
          type: 'table-selection',
          instruction: 'Reading Passage 2 has eight paragraphs A–H. Which paragraph contains the following information? Select the correct letter A–H by marking the checkbox in the appropriate column for each question below.',
          headers: ['', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
          rows: [
            {
              questionNumber: 14,
              label: 'An explanation of how population expansion exposes humans to disease'
            },
            {
              questionNumber: 15,
              label: 'The idea that each person can react differently to the same risk factors'
            },
            {
              questionNumber: 16,
              label: 'Types of disease-causing agents that move between species'
            },
            {
              questionNumber: 17,
              label: 'Examples of professionals working in the sphere of environmental medicine'
            },
            {
              questionNumber: 18,
              label: 'A definition of environmental medicine'
            },
            {
              questionNumber: 19,
              label: 'How ill health results from an accumulation of environmental stressors'
            }
          ]
        },
        {
          type: 'paragraph-gap',
          instruction: 'Complete the sentences below. Choose NO MORE THAN THREE WORDS from the passage for each answer. Write your answers in boxes 20–26 on your answer sheet.',
          paragraph: `(20) According to Dr Randolph, people get sick because of ……………………… – in other words, a failure to adjust to the modern environment.

(21) Vague, far-off concepts like global warming are made more urgent when ……………………… are studied together.

(22) Rising temperatures result in more widespread distribution of disease because some insects are able to ………………………

(23) Large-scale removal of trees forces wildlife from their habitat and brings them into contact with ………………………

(24) Uncontrollable ……………………… of zoonotic viruses are becoming more numerous.

(25) Collaboration between many disciplines is needed to confront the problems of urban development, pollution, ……………………… and new pathogens.

(26) Environmental medicine should receive more ……………………… to help it meet future demands.`,
          questionNumbers: [20, 21, 22, 23, 24, 25, 26]
        }
      ]
    },
    {
      sectionNumber: 3,
      title: 'READING PASSAGE 3',
      passage: {
        title: 'Television and Sport',
        content: `You should spend about 20 minutes on Questions 27-40 which are based on Reading Passage 3 below.

A
The relationship between television and sports is not widely thought of as problematic. For many people, television is a simple medium through which sports can be played, replayed, slowed down, and of course conveniently transmitted live to homes across the planet. What is often overlooked, however, is how television networks have reshaped the very foundations of an industry that they claim only to document. Major television stations immediately seized the revenue-generating prospects of televising sports and this has changed everything, from how they are played to who has a chance to watch them.

B
Before television, for example, live matches could only be viewed in person. For the majority of fans, who were unable to afford tickets to the top-flight matches, or to travel the long distances required to see them, the only option was to attend a local game instead, where the stakes were much lower. As a result, thriving social networks and sporting communities formed around the efforts of teams in the third and fourth divisions and below. With the advent of live TV, however, premier matches suddenly became affordable and accessible to hundreds of millions of new viewers. This shift in viewing patterns vacuumed out the support base of local clubs, many of which ultimately folded.

C
For those on the more prosperous side of this shift in viewing behaviour, however, the financial rewards are substantial. Television assisted in derailing long-held concerns in many sports about whether athletes should remain amateurs or 'go pro', and replaced this system with a new paradigm where nearly all athletes are free to pursue stardom and to make money from their sporting prowess. For the last few decades, top-level sports men and women have signed lucrative endorsement deals and sponsorship contracts, turning many into multi-millionaires and also allowing them to focus full-time on what really drives them. That they can do all this without harming their prospects at the Olympic Games and other major competitions is a significant benefit for these athletes.

D
The effects of television extend further, however, and in many instances have led to changes in sporting codes themselves. Prior to televised coverage of the Winter Olympics, for example, figure skating involved a component in which skaters drew 'figures' in the ice, which were later evaluated for the precision of their shapes. This component translated poorly to the small screen, as viewers found the whole procedure, including the judging of minute scratches on ice, to be monotonous and dull. Ultimately, figures were scrapped in favour of a short programme featuring more telegenic twists and jumps. Other sports are awash with similar regulatory shifts – passing the ball back to the goalkeeper was banned in football after gameplay at the 1990 World Cup was deemed overly defensive by television viewers.

E
In addition to insinuating changes into sporting regulation, television also tends to favour some individual sports over others. Some events, such as the Tour de France, appear to benefit: on television it can be viewed in its entirety, whereas on-site enthusiasts will only witness a tiny part of the spectacle. Wrestling, perhaps due to an image problem that repelled younger (and highly prized) television viewers, was scheduled for removal from the 2020 Olympic Games despite being a founding sport and a fixture of the Olympics since 708 BC. Only after a fervent outcry from supporters was that decision overturned.

F
Another change in the sporting landscape that television has triggered is the framing of sports not merely in terms of the level of skill and athleticism involved, but as personal narratives of triumph, shame and redemption on the part of individual competitors. This is made easier and more convincing through the power of close-up camera shots, profiles and commentary shown during extended build-ups to live events. It also attracts television audiences – particularly women – who may be less interested in the intricacies of the sport than they are in broader 'human interest' stories. As a result, many viewers are now more familiar with the private agonies of famous athletes than with their record scores or matchday tactics.

G
And what about the effects of male television viewership? Certainly, men have always been willing to watch male athletes at the top of their game, but female athletes participating in the same sports have typically attracted far less interest and, as a result, have suffered greatly reduced exposure on television. Those sports where women can draw the crowds – beach volleyball, for example – are often those where female participants are encouraged to dress and behave in ways oriented specifically toward a male demographic.

H
Does all this suggest the influence of television on sports has been overwhelmingly negative? The answer will almost certainly depend on who among the various stakeholders is asked. For all those who have lost out – lower-league teams, athletes whose sports lack a certain visual appeal – there are numerous others who have benefitted enormously from the partnership between television and sports, and whose livelihoods now depend on it.`
      },
      questions: [
        {
          type: 'matching-headings',
          instruction: 'Reading Passage 3 has eight paragraphs, A–H. Choose the correct heading for each paragraph from the list of headings below by dragging the heading number into the appropriate box.',
          paragraphs: [
            {
              questionNumber: 27,
              paragraphLabel: 'Paragraph B',
              content: 'Paragraph B'
            },
            {
              questionNumber: 28,
              paragraphLabel: 'Paragraph C',
              content: 'Paragraph C'
            },
            {
              questionNumber: 29,
              paragraphLabel: 'Paragraph D',
              content: 'Paragraph D'
            },
            {
              questionNumber: 30,
              paragraphLabel: 'Paragraph E',
              content: 'Paragraph E'
            },
            {
              questionNumber: 31,
              paragraphLabel: 'Paragraph F',
              content: 'Paragraph F'
            },
            {
              questionNumber: 32,
              paragraphLabel: 'Paragraph G',
              content: 'Paragraph G'
            },
            {
              questionNumber: 33,
              paragraphLabel: 'Paragraph H',
              content: 'Paragraph H'
            }
          ],
          headings: [
            { label: 'i. Gender bias in televised sport', value: 'i' },
            { label: 'ii. More money-making opportunities', value: 'ii' },
            { label: 'iii. Mixed views on TV\'s role in sports', value: 'iii' },
            { label: 'iv. Tickets to top matches too expensive', value: 'iv' },
            { label: 'v. A common misperception', value: 'v' },
            { label: 'vi. Personal stories become the focus', value: 'vi' },
            { label: 'vii. Sports people become stars', value: 'vii' },
            { label: 'viii. Rules changed to please viewers', value: 'viii' },
            { label: 'ix. Lower-level teams lose out', value: 'ix' },
            { label: 'x. Skill levels improve', value: 'x' },
            { label: 'xi. TV appeal influences sports\' success', value: 'xi' }
          ]
        },
        {
          type: 'yes-no-not-given',
          instruction: 'Do the following statements agree with the claims of the writer in Reading Passage 3? Write YES if the statement agrees with the claims of the writer, NO if the statement contradicts the claims of the writer, NOT GIVEN if it is impossible to say what the writer thinks about this.',
          statements: [
            {
              questionNumber: 34,
              statement: 'Television networks were slow to recognise opportunities to make money from televised sport.'
            },
            {
              questionNumber: 35,
              statement: 'The average sports fan travelled a long way to watch matches before live television broadcasts.'
            },
            {
              questionNumber: 36,
              statement: 'Television has reduced the significance of an athlete\'s amateur status.'
            },
            {
              questionNumber: 37,
              statement: 'The best athletes are now more interested in financial success rather than sporting achievement.'
            }
          ]
        },
        {
          type: 'paragraph-gap',
          instruction: 'Complete the notes below. Choose NO MORE THAN TWO WORDS from the passage for each answer. Write your answers in boxes 38–40 on your answer sheet.',
          paragraph: `Effect of television on individual sports

(38) Ice skating – viewers find 'figures' boring so they are replaced with a ………………………

(39) Back-passing banned in football.

        Tour de France great for TV, but wrestling initially dropped from Olympic Games due to ………………………

(40) Beach volleyball aimed at ………………………`,
          questionNumbers: [38, 39, 40]
        }
      ]
    }
  ]
};
