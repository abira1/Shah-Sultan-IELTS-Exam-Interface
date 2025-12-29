// Track: 8-M Reading
import { Track } from './track1';

export const track8MReading: Track = {
  id: 'track-8m-reading',
  name: '8-M Reading',
  shortName: '8MR',
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
        title: 'The MAGIC of KEFIR',
        content: `You should spend about 20 minutes on Questions 1-13 which are based on Reading Passage 1 below.

A
The shepherds of the North Caucasus region of Europe were only trying to transport milk the best way they knew how – in leather pouches strapped to the side of donkeys – when they made a significant discovery. A fermentation process would sometimes inadvertently occur en route, and when the pouches were opened upon arrival they would no longer contain milk but rather a pungent, effervescent, low alcoholic substance instead. This unexpected development was a blessing in disguise. The new drink – which acquired the name kefir – turned out to be a health tonic, a naturally-preserved dairy product and tasty addition to our culinary repertoire.

B
Although their exact origin remains a mystery, we do know that yeast-based kefir grains have always been at the root of the kefir phenomenon. These grains are capable of a remarkable feat: in contradistinction to most other items you might find in a grocery store, they actually expand and propagate with use. This is because the grains, which are granular to the touch and bear a slight resemblance to cauliflower rosettes, house active cultures that feed on lactose when added to milk. Consequently, a bigger problem for most kefir drinkers is not where to source new kefir grains, but what to do with the ones they already have!

C
The great thing about kefir is that it does not require a manufacturing line in order to be produced. Grains can be simply thrown in with a batch of milk for ripening to begin. The mixture then requires a cool, dark place to live and grow, with periodic unsettling to prevent clumping (Caucasus inhabitants began storing the concoction in animal-skin satchels on the back of doors – every time someone entered the room the mixture would get lightly shaken). After about 24 hours the yeast cultures in the grains have multiplied and devoured most of the milk sugars, and the final product is then ready for human consumption.

D
Nothing compares to a person's first encounter with kefir. The smooth, uniform consistency rolls over the tongue in a manner akin to liquefied yogurt. The sharp, tart pungency of unsweetened yogurt is there too, but there is also a slight hint of effervescence, something most users will have previously associated only with mineral waters, soda or beer. Kefir also comes with a subtle aroma of yeast, and depending on the type of milk and ripening conditions, ethanol content can reach up to two or three percent – about on par with a decent lager – although you can expect around 0.8 to one per cent for a typical day-old preparation. This can bring out a tiny edge of alcohol in the kefir's flavour.

E
Although it has prevailed largely as a fermented milk drink, over the years kefir has acquired a number of other uses. Many bakers use it instead of starter yeast in the preparation of sourdough, and the tangy flavour also makes kefir an ideal buttermilk substitute in pancakes. Kefir also accompanies sour cream as one of the main ingredients in cold beetroot soup and can be used in lieu of regular cow's milk on granola or cereal. As a way to keep their digestive systems fine-tuned, athletes sometimes combine kefir with yoghurt in protein shakes.

F
Associated for centuries with pictures of Slavic babushkas clutching a shawl in one hand and a cup of kefir in the other, the unassuming beverage has become a minor celebrity of the nascent health food movement in the contemporary West. Every day, more studies pour out supporting the benefits of a diet high in probiotics. This trend toward consuming probiotics has engulfed the leisure classes in these countries to the point that it is poised to become, according to some commentators, "the next multivitamin". These days the word kefir is consequently more likely to bring to mind glamorous, yoga mat-toting women from Los Angeles than austere visions of blustery Eastern Europe.

G
Kefir's rise in popularity has encouraged producers to take short cuts or alter the production process. Some home users have omitted the ripening and culturation process while commercial dealers often add thickeners, stabilisers and sweeteners. But the beauty of kefir is that, at its healthiest and tastiest, it is a remarkably affordable, uncluttered process, as any accidental invention is bound to be. All that is necessary are some grains, milk and a little bit of patience. A return to the unadulterated kefir-making of old is in everyone's interest.`
      },
      questions: [
        {
          type: 'matching-headings',
          instruction: 'Use the information in the passage to match the paragraphs (listed i-x) with the headings below by dragging the heading into the appropriate box.',
          paragraphs: [
            {
              questionNumber: 1,
              paragraphLabel: 'Section A',
              content: 'Section A'
            },
            {
              questionNumber: 2,
              paragraphLabel: 'Section B',
              content: 'Section B'
            },
            {
              questionNumber: 3,
              paragraphLabel: 'Section C',
              content: 'Section C'
            },
            {
              questionNumber: 4,
              paragraphLabel: 'Section D',
              content: 'Section D'
            },
            {
              questionNumber: 5,
              paragraphLabel: 'Section E',
              content: 'Section E'
            },
            {
              questionNumber: 6,
              paragraphLabel: 'Section F',
              content: 'Section F'
            },
            {
              questionNumber: 7,
              paragraphLabel: 'Section G',
              content: 'Section G'
            }
          ],
          headings: [
            { label: 'i. A unique sensory experience', value: 'i' },
            { label: 'ii. Getting back to basics', value: 'ii' },
            { label: 'iii. The gift that keeps on giving', value: 'iii' },
            { label: 'iv. Variations in alcohol content', value: 'iv' },
            { label: 'v. Old methods of transportation', value: 'v' },
            { label: 'vi. Culinary applications', value: 'vi' },
            { label: 'vii. Making kefir', value: 'vii' },
            { label: 'viii. A fortunate accident', value: 'viii' },
            { label: 'ix. Kefir gets an image makeover', value: 'ix' },
            { label: 'x. Ways to improve taste', value: 'x' }
          ]
        },
        {
          type: 'sentence-completion',
          instruction: 'Answer the questions below using NO MORE THAN TWO WORDS from the passage for each answer. Write your answers in boxes 8–11 on your answer sheet.',
          items: [
            {
              questionNumber: 8,
              text: 'What do kefir grains look like? ……………………'
            },
            {
              questionNumber: 9,
              text: 'What needs to happen to kefir while it is ripening? ……………………'
            },
            {
              questionNumber: 10,
              text: 'What will the yeast cultures have consumed before kefir is ready to drink? ……………………'
            },
            {
              questionNumber: 11,
              text: 'The texture of kefir in the mouth is similar to what? ……………………'
            }
          ]
        },
        {
          type: 'multiple-choice-multiple',
          questionNumber: 12,
          instruction: 'Choose TWO letters, A–E. Write the correct letters in boxes 12 and 13 on your answer sheet.',
          question: 'Which TWO products are NOT mentioned as things which kefir can replace?',
          options: [
            { label: 'A. Ordinary cow\'s milk', value: 'A' },
            { label: 'B. Buttermilk', value: 'B' },
            { label: 'C. Sour cream', value: 'C' },
            { label: 'D. Starter yeast', value: 'D' },
            { label: 'E. Yoghurt', value: 'E' }
          ],
          correctAnswersCount: 2,
          questionNumbers: [12, 13]
        }
      ]
    },
    {
      sectionNumber: 2,
      title: 'READING PASSAGE 2',
      passage: {
        title: 'FOOD FOR THOUGHT',
        content: `You should spend about 20 minutes on Questions 14-26 which are based on Reading Passage 2 below.

A
Why not eat insects? So asked British entomologist Vincent M. Holt in the title of his 1885 treatise on the benefits of what he named entomophagy – the consumption of insects (and similar creatures) as a food source. The prospect of eating dishes such as "wireworm sauce" and "slug soup" failed to garner favour amongst those in the stuffy, proper, Victorian social milieu of his time, however, and Holt's visionary ideas were considered at best eccentric, at worst an offense to every refined palate. Anticipating such a reaction, Holt acknowledged the difficulty in unseating deep-rooted prejudices against insect cuisine, but quietly asserted his confidence that "we shall some day quite gladly cook and eat them".

B
It has taken nearly 150 years but an eclectic Western-driven movement has finally mounted around the entomophagic cause. In Los Angeles and other cosmopolitan Western cities, insects have been caught up in the endless pursuit of novel and authentic delicacies. "Eating grasshoppers is a thing you do here", bug-supplier Bricia Lopez has explained. "There's more of a 'cool' factor involved." Meanwhile, the Food and Agricultural Organization has considered a policy paper on the subject, initiated farming projects in Laos, and set down plans for a world congress on insect farming in 2013.

C
Eating insects is not a new phenomenon. In fact, insects and other such creatures are already eaten in 80 per cent of the world's countries, prepared in customary dishes ranging from deep-fried tarantula in Cambodia to bowls of baby bees in China. With the specialist knowledge that Western companies and organisations can bring to the table, however, these hand-prepared delicacies have the potential to be produced on a scale large enough to lower costs and open up mass markets. A new American company, for example, is attempting to develop pressurisation machines that would de-shell insects and make them available in the form of cutlets. According to the entrepreneur behind the company, Matthew Krisiloff, this will be the key to pleasing the uninitiated palate.

D
Insects certainly possess some key advantages over traditional Western meat sources. According to research findings from Professor Arnold van Huis, a Dutch entomologist, breeding insects results in far fewer noxious by-products. Insects produce less ammonia than pig and poultry farming, ten times less methane than livestock, and 300 times less nitrous oxide. Huis also notes that insects – being cold-blooded creatures – can convert food to protein at a rate far superior to that of cows, since the latter exhaust much of their energy just keeping themselves warm.

E
Although insects are sometimes perceived by Westerners as unhygienic or disease-ridden, they are a reliable option in light of recent global epidemics (as Holt pointed out many years ago, insects are "decidedly more particular in their feeding than ourselves"). Because bugs are genetically distant from humans, species-hopping diseases such as swine flu or mad cow disease are much less likely to start or spread amongst grasshoppers or slugs than in poultry and cattle. Furthermore, the squalid, cramped quarters that encourage diseases to propagate among many animal populations are actually the residence of choice for insects, which thrive in such conditions.

F
Then, of course, there are the commercial gains. As FAO Forestry Manager Patrick Durst notes, in developing countries many rural people and traditional forest dwellers have remarkable knowledge about managing insect populations to produce food. Until now, they have only used this knowledge to meet their own subsistence needs, but Durst believes that, with the adoption of modern technology and improved promotional methods, opportunities to expand the market to new consumers will flourish. This could provide a crucial step into the global economic arena for those primarily rural, impoverished populations who have been excluded from the rise of manufacturing and large-scale agriculture.

G
Nevertheless, much stands in the way of the entomophagic movement. One problem is the damage that has been caused and continues to be caused, by Western organisations prepared to kill off grasshoppers and locusts – complete food proteins – in favour of preserving the incomplete protein crops of millet, wheat, barley and maize. Entomologist Florence Dunkel has described the consequences of such interventions. While examining children's diets as a part of her field work in Mali, Dunkel discovered that a protein deficiency syndrome called kwashiorkor was increasing in incidence. Children in the area were once protected against kwashiorkor by a diet high in grasshoppers, but these had become unsafe to eat after pesticide use in the area increased.

H
A further issue is the persistent fear many Westerners still have about eating insects. "The problem is the ick factor—the eyes, the wings, the legs," Krisiloff has said. "It's not as simple as hiding it in a bug nugget. People won't accept it beyond the novelty. When you think of a chicken, you think of a chicken breast, not the eyes, wings, and beak." For Marcel Dicke, the key lies in camouflaging the fact that people are eating insects at all. Insect flour is one of his propositions, as is changing the language of insect cuisine. "If you say it's mealworms, it makes people think of ringworm", he notes. "So stop saying 'worm'. If we use Latin names, say it's a Tenebrio quiche, it sounds much more fancy". For Krisiloff, Dicke and others, keeping quiet about the gritty reality of our food is often the best approach.

I
It is yet to be seen if history will truly redeem Vincent Holt and his suggestion that British families should gather around their dining tables for a breakfast of "moths on toast". It is clear, however, that entomophagy, far from being a kooky sideshow to the real business of food production, has much to offer in meeting the challenges that global societies in the 21st century will face.`
      },
      questions: [
        {
          type: 'matching-headings',
          instruction: 'Use the information in the passage to match the paragraphs (listed i-xi) with the headings below by dragging the heading into the appropriate box.',
          paragraphs: [
            {
              questionNumber: 14,
              paragraphLabel: 'Section A',
              content: 'Section A'
            },
            {
              questionNumber: 15,
              paragraphLabel: 'Section B',
              content: 'Section B'
            },
            {
              questionNumber: 16,
              paragraphLabel: 'Section C',
              content: 'Section C'
            },
            {
              questionNumber: 17,
              paragraphLabel: 'Section D',
              content: 'Section D'
            },
            {
              questionNumber: 18,
              paragraphLabel: 'Section E',
              content: 'Section E'
            },
            {
              questionNumber: 19,
              paragraphLabel: 'Section F',
              content: 'Section F'
            },
            {
              questionNumber: 20,
              paragraphLabel: 'Section G',
              content: 'Section G'
            },
            {
              questionNumber: 21,
              paragraphLabel: 'Section H',
              content: 'Section H'
            }
          ],
          headings: [
            { label: 'i. A historical delicacy', value: 'i' },
            { label: 'ii. The poor may benefit', value: 'ii' },
            { label: 'iii. Presentation is key to changing attitudes', value: 'iii' },
            { label: 'iv. Environmentally friendly production', value: 'iv' },
            { label: 'v. Tradition meets technology', value: 'v' },
            { label: 'vi. A cultural pioneer', value: 'vi' },
            { label: 'vii. Western practices harm locals', value: 'vii' },
            { label: 'viii. Good source of nutrients', value: 'viii' },
            { label: 'ix. Growing popularity', value: 'ix' },
            { label: 'x. A healthy choice', value: 'x' },
            { label: 'xi. A safety risk', value: 'xi' }
          ]
        },
        {
          type: 'paragraph-gap',
          instruction: 'Complete the notes below. Choose NO MORE THAN THREE WORDS from the passage for each answer. Write your answers in boxes 22–26 on your answer sheet.',
          paragraph: `Van Huis
• Insects are cleaner & do not release as many harmful gases
• Insects use food intake economically in the production of protein as they waste less 22…………………

Durst
• Traditional knowledge could be combined with modern methods for mass production instead of just covering 23…………………
• This could help 24………………… people gain access to world markets.

Dunkel
• Due to increased 25…………………, more children in Mali are suffering from 26…………………`,
          questionNumbers: [22, 23, 24, 25, 26]
        }
      ]
    },
    {
      sectionNumber: 3,
      title: 'READING PASSAGE 3',
      passage: {
        title: 'Love Stories',
        content: `You should spend about 20 minutes on Questions 27-40 which are based on Reading Passage 3 below.

"Love stories" are often associated – at least in the popular imagination – with fairy tales, adolescent day dreams, Disney movies and other frivolous pastimes. For psychologists developing taxonomies of affection and attachment, however, this is an area of rigorous academic pursuit. Beginning in the early 1970s with the groundbreaking contributions of John Alan Lee, researchers have developed classifications that they believe better characterise our romantic predispositions. This involves examining not a single, universal, emotional expression ("love"), but rather a series of divergent behaviours and narratives that each has an individualised purpose, desired outcome and state of mind. Lee's gritty methodology painstakingly involved participants matching 170 typical romantic encounters (e.g., "The night after I met X…") with nearly 1500 possible reactions ("I could hardly get to sleep" or "I wrote X a letter"). The patterns unknowingly expressed by respondents culminated in a taxonomy of six distinct love "styles" that continue to inform research in the area forty years later.

The first of these styles – eros – is closely tied in with images of romantic love that are promulgated in Western popular culture. Characteristic of this style is a passionate emotional intensity, a strong physical magnetism – as if the two partners were literally being "pulled" together – and a sense of inevitability about the relationship. A related but more frantic style of love called mania involves an obsessive, compulsive attitude toward one's partner. Vast swings in mood from ecstasy to agony – dependent on the level of attention a person is receiving from his or her partner – are typical of manic love.

Two styles were much more subdued, however. Storge is a quiet, companionate type of loving – "love by evolution" rather than "love by revolution", according to some theorists. Relationships built on a foundation of platonic affection and caring are archetypal of storge. When care is extended to a sacrificial level of doting, however, it becomes another style – agape. In an agape relationship one partner becomes a "caretaker", exalting the welfare of the other above his or her own needs.

The final two styles of love seem to lack aspects of emotion and reciprocity altogether. The ludus style envisions relationships primarily as a game in which it is best to "play the field" or experience a diverse set of partners over time. Mutually-gratifying outcomes in relationships are not considered necessary, and deception of a partner and lack of disclosure about one's activities are also typical. While Lee found that college students in his study overwhelmingly disagreed with the tenets of this style, substantial numbers of them acted in a typically ludic style while dating, a finding that proves correct the deceit inherent in ludus. Pragma lovers also downplayed emotive aspects of relationships but favoured practical, sensible connections. Successful arranged marriages are a great example of pragma, in that the couple decides to make the relationship work; but anyone who seeks an ideal partner with a shopping list of necessary attributes (high salary, same religion, etc.) fits the classification.

Robert J. Sternberg's contemporary research on love stories has elaborated on how these narratives determine the shape of our relationships and our lives. Sternberg and others have proposed and tested the theory of love as a story, "whereby the interaction of our personal attributes with the environment – which we in part create – leads to the development of stories about love that we then seek to fulfil, to the extent possible, in our lives." Sternberg's taxonomy of love stories numbers far more, at twenty-six, than Lee's taxonomy of love styles, but as Sternberg himself admits there is plenty of overlap. The seventh story, Game, coincides with ludus, for example, while the nineteenth story, Sacrifice, fits neatly on top of agape.

Sternberg's research demonstrates that we may have predilections toward multiple love stories, each represented in a mental hierarchy and varying in weight in terms of their personal significance. This explains the frustration many of us experience when comparing potential partners. One person often fulfils some expected narratives – such as a need for mystery and fantasy – while lacking the ability to meet the demands of others (which may lie in direct contradiction). It is also the case that stories have varying abilities to adapt to a given cultural milieu and its respective demands. Love stories are, therefore, interactive and adaptive phenomena in our lives rather than rigid prescriptions.

Sternberg also explores how our love stories interact with the love stories of our partners. What happens when someone who sees love as art collides with someone who sees love as a business? Can a Sewing story (love is what you make it) co-exist with a Theatre story (love is a script with predictable acts, scenes and lines)? Certainly, it is clear that we look for partners with love stories that complement and are compatible with our own narratives. But they do not have to be an identical match. Someone who sees love as mystery and art, for example, might locate that mystery better in a partner who views love through a lens of business and humour. Not all love stories, however, are equally well predisposed to relationship longevity; stories that view love as a game, as a kind of surveillance or as addiction are all unlikely to prove durable.

Research on love stories continues apace. Defying the myth that rigorous science and the romantic persuasions of ordinary people are incompatible, this research demonstrates that good psychology can clarify and comment on the way we give affection and form attachments.`
      },
      questions: [
        {
          type: 'drag-and-drop',
          instruction: 'Use the information in the passage to match the love styles (listed A-F) with the statements below by dragging the style into the appropriate box.',
          items: [
            {
              questionNumber: 27,
              label: 'My most important concern is that my partner is happy.'
            },
            {
              questionNumber: 28,
              label: 'I enjoy having many romantic partners.'
            },
            {
              questionNumber: 29,
              label: 'I feel that my partner and I were always going to end up together.'
            },
            {
              questionNumber: 30,
              label: 'I want to be friends first and then let romance develop later.'
            },
            {
              questionNumber: 31,
              label: 'I always feel either very excited or absolutely miserable about my relationship.'
            },
            {
              questionNumber: 32,
              label: 'I prefer to keep many aspects of my love life to myself.'
            },
            {
              questionNumber: 33,
              label: 'When I am in love, that is all I can think about.'
            },
            {
              questionNumber: 34,
              label: 'I know before I meet someone what qualities I need in a partner.'
            }
          ],
          options: [
            { label: 'A. Eros', value: 'A' },
            { label: 'B. Mania', value: 'B' },
            { label: 'C. Storge', value: 'C' },
            { label: 'D. Agape', value: 'D' },
            { label: 'E. Ludus', value: 'E' },
            { label: 'F. Pragma', value: 'F' }
          ]
        },
        {
          type: 'yes-no-not-given',
          instruction: 'Do the following statements agree with the claims of the writer in Reading Passage 3? Write YES if the statement agrees with the claims of the writer, NO if the statement contradicts the claims of the writer, NOT GIVEN if it is impossible to say what the writer thinks about this.',
          statements: [
            {
              questionNumber: 35,
              statement: 'People\'s notions of love affect their relationships, rather than vice versa.'
            },
            {
              questionNumber: 36,
              statement: 'Some of our love stories are more important to us than others.'
            },
            {
              questionNumber: 37,
              statement: 'Our love stories can change to meet the needs of particular social environments.'
            },
            {
              questionNumber: 38,
              statement: 'We look for romantic partners with a love story just like our own.'
            },
            {
              questionNumber: 39,
              statement: 'The most successful partners have matching love stories.'
            },
            {
              questionNumber: 40,
              statement: 'No love story is more suited to a long relationship than any other.'
            }
          ]
        }
      ]
    }
  ]
};
