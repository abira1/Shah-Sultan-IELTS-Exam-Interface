// Track: 5-M Reading
import { Track } from './track1';

export const track5MReading: Track = {
  id: 'track-5m-reading',
  name: '5-M Reading',
  shortName: '5MR',
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
        title: 'LONGAEVA: Ancient Bristlecone Pine',
        content: `You should spend about 20 minutes on Questions 1-13 which are based on Reading Passage 1 below.

A

To understand more about the earth's history, humans have often looked to the natural environment for insight into the past. The bristlecone pine (Pinus longaeva), of the White Mountains in California, has served this purpose greater than any other species of tree on the planet. Conditions here are brutal: scant precipitation and low average temperatures mean a short growing season, only intensified by ferocious wind and mal-nutritious rocky soil. Nevertheless, bristlecone pines have claimed these barren slopes as their permanent home. Evolving here in this harsh environment, super-adapted and without much competition, bristlecones have earned their seat on the longevity throne by becoming the oldest living trees on the planet. Results of extensive studies on bristlecone pine stands have shown that in fact such environmental limitations are positively associated with the attainment of great age. This intriguing phenomenon will be discussed further on.

B

But exactly how old is old? Sprouted before the invention of Egyptian hieroglyphs and long before the teachings of Jesus of Nazareth, Methuselah is the oldest bristlecone alive at roughly 4,700 years. Although specimens of this age do not represent the species' average, there are 200 trees more than 3,000 years old, and two dozen more than 4,000. Considering that these high ages are obtained in the face of such remarkable environmental adversity, the bristlecone pines have become the focus of much scientific examination over the past half-century.

C

Perhaps most interested in the bristlecone pine are dendrochronologists or tree-ring daters. With every strenuous year that passes in the White Mountains, each bristlecone grows and forms a new outer layer of cambium that reflects a season's particular ease or hardship. So while growing seasons may expand or shrink, the trees carry on, their growth rings faithfully recording the bad years alongside the good. Through examining the annual growth rings of both living and dead specimens, taking thousands of core samples, and by processes of cross-dating between trees and other qualitative records, scientists have compiled a continuous tree-ring record that dates back to the last Ice Age between eight and ten thousand years ago. Among other linked accomplishments, this record has enhanced the dating process, helping to double-check and correct the radiocarbon-14 method to more accurately estimate the age of organic material.

D

Now more than ever the importance of monitoring the bristlecone is being realized. As our global climate continues to undergo its most recent and abrupt atmospheric change, these ancient scribes continue to respond. Since the rings of wood formed each year reveal the trees' response to climatic conditions during a particular growing season, in their persistence they have left us natural recordings of the past, markers of the present, and clues to the future.

E

The species' name originates from the appearance of its unusual cones and needles. The bristlecone's short, pale needles are also trademarks, bunching together to form foxtail-like bundles. As is the case of most conifer needles, these specialized leaves cluster together to shelter the stomata so very little moisture is lost through them. This adaptation helps the bristlecone photosynthesize during particularly brutal months, saving the energy of constant needle replacement and providing a stable supply of chlorophyll. For a plant trying to store so much energy, bristlecone seeds are relatively large in size. They are first reproduced when trees reach ages between thirty and seventy-five years old. Germination rates are generally high, in part because seeds require little to no initial stratification. Perhaps the most intriguing physical characteristic of a mature bristlecone, however, is its ratio of living to deadwood on harsh sites and how this relates to old age. In older trees, especially in individuals over 1,500 years, a strip-bark trait is adaptive. This condition occurs as a result of cambium dieback, which erodes and thereby exposes certain areas of the bole, leaving only narrow bands of bark intact.

F

The technique of cambial edge retreat has helped promote old age in bristlecone pine, but that certainly is not the only reason. Most crucial to these trees' longevity is their compact size and slow rates of growth. By remaining in most cases under ten meters tall, bristlecones stay close to the limited water supply and can hence support more branches and photosynthesizing. Combined with the dry, windy, and often freezing mountain air, slow growth guarantees the bristlecones tight, fibrous rings with a high resin content and structural strength. The absence of natural disaster has also safeguarded the bristlecone's lengthy lifespan. Due to a lack of ground cover vegetation and an evenly spaced layout, bristlecone stands on the White Mountain peaks have been practically unaffected by fire. This lack of vegetation also means a lack of competition for the bristlecones.

G

Bristlecone pines restricted to numerous, rather isolated stands at higher altitudes in the southwestern United States. Stands occur from the Rocky Mountains, through the Colorado Plateau, to the western margin of the Great Basin. Within this natural range, the oldest and most widely researched stands of bristlecones occur in California's White Mountains. Even just 200 miles away from the Pacific Ocean, the White Mountains are home to one of this country's few high-elevation deserts. Located in the extreme eastern rain shadow of the Sierra Nevada, this region receives only 12.54 inches of precipitation per year and experiences temperatures between -20F and +50F. The peaks south of the Owens Valley are higher up than they might appear from a distance. Although most summits exist somewhere around 11,000 feet, snow-capped White Mountain Peak, for which the range is named, stands at 14,246 feet above sea level. That said, to reach areas of a pure bristlecone is an intense journey all to itself.

H

With seemingly endless areas of wonder and interest, the bristlecone pines have become subject to much research over the past half-century. Since the annual growth of these ancient organisms directly reflects the climatic conditions of a particular time period, bristlecones are of greatest significance to dendrochronologists or tree-ring specialists. Dating any tree is simple and can be done within reasonable accuracy just by counting out the rings made each year by the plant's natural means of growth. By carefully compiling a nearly 10,000-year-old bristlecone pine record, these patient scientists have accurately corrected the carbon-14 dating method and estimated ages of past periods of global climate change. What makes this record so special to dendrochronologists, too, is that nowhere, throughout time, is precisely the same long-term sequence of wide and narrow rings repeated, because year-to-year variations in climate are never exactly the same.

I

Historically the bristlecone's remote location and gnarled wood have deterred commercial extraction, but nothing on earth will go unaffected by global warming. If temperatures rise by only 6 degrees F, which many experts say is likely this century, about two-thirds of the bristlecones' ideal habitat in the White Mountains effectively will be gone. Almost 30,000 acres of National Forest now preserves the ancient bristlecone, but paved roads, campsites, and self-guided trails have led only to more human impact. In 1966, the U.S.F.S reported over 20,000 visitors to the Ancient Bristlecone Pine Forest, a figure which could exceed 40,000 today. Over the past hundreds of thousands of years, this species has endured in one of the earth's most trying environments; they deserve our respect and reverence. As global climate change slowly alters their environment, we as humans must do our part to raise awareness and lower our impact.`
      },
      questions: [
        {
          type: 'table-selection',
          instruction: 'The Reading Passage has nine paragraphs A-I. Which paragraph contains the following information? Select the correct letter A-I by marking the checkbox in the appropriate column for each question below.',
          headers: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'],
          rows: [
            {
              questionNumber: 1,
              label: 'Human activity threatens bristlecone pines habitat'
            },
            {
              questionNumber: 2,
              label: 'Explanations for a ring of bristlecone pines'
            },
            {
              questionNumber: 3,
              label: 'An accountable recording provided from the past until now'
            },
            {
              questionNumber: 4,
              label: 'Survived in a hostile environment'
            }
          ]
        },
        {
          type: 'multiple-choice',
          questionNumber: 5,
          question: 'According to passage A, what aspect of bristlecone pines attracts author\'s attention?',
          options: [
            { label: 'Brutal environment they live', value: 'A' },
            { label: 'Remarkable long age', value: 'B' },
            { label: 'They only live in California', value: 'C' },
            { label: 'Outstanding height', value: 'D' }
          ]
        },
        {
          type: 'multiple-choice',
          questionNumber: 6,
          question: 'Why do we investigate Bristlecone pines in higher altitudes of California\'s White Mountains?',
          options: [
            { label: 'Because of the oldest ones researched in this region', value: 'A' },
            { label: 'Because most bizarre ones are in this region', value: 'B' },
            { label: 'Because precipitation is rich in this region', value: 'C' },
            { label: 'Because sea level is comparatively high in this region', value: 'D' }
          ]
        },
        {
          type: 'multiple-choice',
          questionNumber: 7,
          question: 'Why are there no repeated patterns of wide and narrow rings?',
          options: [
            { label: 'Because sea level rises which affect tree ring', value: 'A' },
            { label: 'Because tree ring pattern is completely random', value: 'B' },
            { label: 'Because ancient organisms affect their growth', value: 'C' },
            { label: 'Because the variation of climate change is different', value: 'D' }
          ]
        },
        {
          type: 'paragraph-gap',
          instruction: 'Complete the following summary of the paragraphs of Reading Passage using NO MORE THAN THREE WORDS from the Reading Passage for each answer.',
          paragraph: `The bristlecone's special adaptation is a benefit for photosynthesizing, and reserving the (8)……………………… of leaf replacement and providing sufficient chlorophyll. Probably because seeds do not rely on primary (9)…………………………, germination rate is high. Because of cambium dieback, only narrow (10)………………………….. remain complete. Due to multiple factors such as windy, cold climate and (11)…………………………., bristlecones' rings have a tight and solid structure full of resin. Moreover, bristlecone stands are safe from fire because of little (12)…………………………. plants spread in this place. The summits of Owens Valley are higher than they appear if you observe from a (13)……………………………..`,
          questionNumbers: [8, 9, 10, 11, 12, 13]
        }
      ]
    },
    {
      sectionNumber: 2,
      title: 'READING PASSAGE 2',
      passage: {
        title: 'Corporate Social Responsibility',
        content: `You should spend about 20 minutes on Questions 14-26 which are based on Reading Passage 2 below.

Broadly speaking, proponents of CSR have used four arguments to make their case: moral obligation, sustainability, license to operate, and reputation. The moral appeal – arguing that companies have a duty to be good citizens and to "do the right thing" – is prominent in the goal of Business for Social Responsibility, the leading nonprofit CSR business association in the United States. It asks that its members "achieve commercial success in ways that honor ethical values and respect people, communities, and the natural environment." Sustainability emphasizes the environment and community stewardship.

A

An excellent definition was developed in the 1980s by Norwegian Prime Minister Gro Harlem Brundtland and used by the World Business Council for Sustainable Development: "Meeting the needs of the present without compromising the ability of future generations to meet their own needs." The notion of a license to operate derives from the fact that every company needs tacit or explicit permission from governments, communities, and numerous other stakeholders to do business. Finally, reputation is used by many companies to justify CSR initiatives on the grounds that they will improve a company's image, strengthen its brand, enliven morale, and even raise the value of its stock.

B

To advance CSR, we must root it in a broad understanding of the interrelationship between a corporation and society while at the same time anchoring it in the strategies and activities of specific companies. To say broadly that business and society need each other might seem like a cliché, but it is also the basic truth that will pull companies out of the muddle that their current corporate-responsibility thinking has created. Successful corporations need a healthy society. Education, health care, and equal opportunity are essential to a productive workforce. Safe products and working conditions not only attract customers but lower the internal costs of accidents. Efficient utilization of land, water, energy, and other natural resources makes business more productive. Good government, the rule of law, and property rights are essential for efficiency and innovation. Strong regulatory standards protect both consumers and competitive companies from exploitation. Ultimately, a healthy society creates expanding demand for business, as more human needs are met and aspirations grow. Any business that pursues its ends at the expense of the society in which it operates will find its success to be illusory and ultimately temporary. At the same time, a healthy society needs successful companies. No social program can rival the business sector when it comes to creating the jobs, wealth, and innovation that improve standards of living and social conditions over time.

C

A company's impact on society also changes over time, as social standards evolve and science progresses. Asbestos, now understood as a serious health risk, was thought to be safe in the early 1900s, given the scientific knowledge then available. Evidence of its risks gradually mounted for more than 50 years before any company was held liable for the harms it can cause. Many firms that failed to anticipate the consequences of this evolving body of research have been bankrupted by the results. No longer can companies be content to monitor only the obvious social impacts of today. Without a careful process for identifying evolving social effects of tomorrow, firms may risk their very survival.

D

No business can solve all of society's problems or bear the cost of doing so. Instead, each company must select issues that intersect with its particular business. Other social agendas are best left to those companies in other industries, NGOs, or government institutions that are better positioned to address them. The essential test that should guide CSR is not whether a cause is worthy but whether it presents an opportunity to create shared value – that is, a meaningful benefit for society that is also valuable to the business. However, corporations are not responsible for all the world's problems, nor do they have the resources to solve them all. Each company can identify the particular set of societal problems that it is best equipped to help resolve and from which it can gain the greatest competitive benefit. Addressing social issues by creating shared value will lead to self-sustaining solutions that do not depend on private or government subsidies. When a well-run business applies its vast resources, expertise, and management talent to problems that it understands and in which it has a stake, it can have a greater impact on social good than any other institution or philanthropic organization.

E

The best corporate citizenship initiatives involve far more than writing a check: They specify clear, measurable goals and track results over time. A good example is GE's program to adopt underperforming public high schools near several of its major U.S. facilities. The company contributes between $250,000 and $1 million over a five-year period to each school and makes in-kind donations as well. GE managers and employees take an active role by working with school administrators to assess needs and mentor or tutor students. In an independent study of ten schools in the program between 1989 and 1999, nearly all showed significant improvement, while the graduation rate in four of the five worst-performing schools doubled from an average of 30% to 60%. Effective corporate citizenship initiatives such as this one create goodwill and improve relations with local governments and other important constituencies. What's more, GE's employees feel great pride in their participation. Their effect is inherently limited, however. No matter how beneficial the program is, it remains incidental to the company's business, and the direct effect on GE's recruiting and retention is modest.

F

Microsoft's Working Connections partnership with the American Association of Community Colleges (AACC) is a good example of a shared-value opportunity arising from investments in context. The shortage of information technology workers is a significant constraint on Microsoft's growth; currently, there are more than 450,000 unfilled IT positions in the United States alone. Community colleges, with an enrollment of 11.6 million students, representing 45% of all U.S. undergraduates, could be a major solution. Microsoft recognizes, however, that community colleges face special challenges: IT curricula are not standardized, the technology used in classrooms is often outdated, and there are no systematic professional development programs to keep faculty up to date. Microsoft's $50 million five-year initiative was aimed at all three problems. In addition to contributing money and products, Microsoft sent employee volunteers to colleges to assess needs, contribute to curriculum development, and create faculty development institutes. Note that in this case, volunteers and assigned staff were able to use their core professional skills to address a social need, a far cry from typical volunteer programs. Microsoft has achieved results that have benefited many communities while having a direct – and potentially significant – impact on the company.

G

At the heart of any strategy is a unique value proposition: a set of needs a company can meet for its chosen customers that others cannot. The most strategic CSR occurs when a company adds a social dimension to its value proposition, making social impact integral to the overall strategy. Consider Whole Foods Market, whose value proposition is to sell organic, natural, and healthy food products to customers who are passionate about food and the environment. The company's sourcing emphasizes purchases from local farmers through each store's procurement process. Buyers screen out foods containing any of nearly 100 common ingredients that the company considers unhealthy or environmentally damaging. The same standards apply to products made internally. Whole Foods' commitment to natural and environmentally friendly operating practices extends well beyond sourcing. Stores are constructed using a minimum of virgin raw materials. Recently, the company purchased renewable wind energy credits equal to 100% of its electricity use in all of its stores and facilities, the only Fortune 500 company to offset its electricity consumption entirely. Spoiled produce and biodegradable waste are trucked to regional centers for composting. Whole Foods' vehicles are being converted to run on biofuels. Even the cleaning products used in its stores are environmentally friendly. And through its philanthropy, the company has created the Animal Compassion Foundation to develop more natural and humane ways of raising farm animals. In short, nearly every aspect of the company's value chain reinforces the social dimensions of its value proposition, distinguishing Whole Foods from its competitors.

From Harvard Business Review 2007`
      },
      questions: [
        {
          type: 'matching-headings',
          instruction: 'The Reading Passage has seven paragraphs A-G. Match each paragraph with the correct heading from the list below by dragging the heading number into the appropriate box.',
          paragraphs: [
            {
              questionNumber: 14,
              paragraphLabel: 'Paragraph A',
              content: 'Section A'
            },
            {
              questionNumber: 15,
              paragraphLabel: 'Paragraph B',
              content: 'Section B'
            },
            {
              questionNumber: 16,
              paragraphLabel: 'Paragraph C',
              content: 'Section C'
            },
            {
              questionNumber: 17,
              paragraphLabel: 'Paragraph D',
              content: 'Section D'
            },
            {
              questionNumber: 18,
              paragraphLabel: 'Paragraph E',
              content: 'Section E'
            },
            {
              questionNumber: 19,
              paragraphLabel: 'Paragraph F',
              content: 'Section F'
            },
            {
              questionNumber: 20,
              paragraphLabel: 'Paragraph G',
              content: 'Section G'
            }
          ],
          headings: [
            { label: 'i. How CSR may help one business to expand', value: 'i' },
            { label: 'ii. CSR in many aspects of a company\'s business', value: 'ii' },
            { label: 'iii. A CSR initiative without a financial gain', value: 'iii' },
            { label: 'iv. Lack of action by the state of social issues', value: 'iv' },
            { label: 'v. Drives or pressures motivate companies to address CSR', value: 'v' },
            { label: 'vi. The past illustrates businesses are responsible for future outcomes', value: 'vi' },
            { label: 'vii. Companies applying CSR should be selective', value: 'vii' },
            { label: 'viii. Reasons that business and society benefit each other', value: 'viii' }
          ]
        },
        {
          type: 'paragraph-gap',
          instruction: 'Complete the following summary of the paragraphs of Reading Passage using NO MORE THAN TWO WORDS from the Reading Passage for each answer.',
          paragraph: `The implement of CSR, HOW?

Promotion of CSR requires the understanding of the interdependence between business and society. Corporations workers' productivity generally needs health care, education, and given (21)……………………… Restrictions imposed by government and companies both protect consumers from being treated unfairly. Improvement of the safety standard can reduce the (22)……………………… of accidents in the workplace. Similarly, society becomes a pool of more human needs and aspirations.`,
          questionNumbers: [21, 22]
        },
        {
          type: 'dropdown',
          instruction: 'Use the information in the passage to match the companies (listed A-C) with opinions or deeds below. NB You may use any letter more than once.',
          items: [
            {
              questionNumber: 23,
              statement: 'The disposable waste'
            },
            {
              questionNumber: 24,
              statement: 'The way company purchases as goods'
            },
            {
              questionNumber: 25,
              statement: 'Helping the underdeveloped'
            },
            {
              questionNumber: 26,
              statement: 'Ensuring the people have the latest information'
            }
          ],
          options: [
            { label: 'General Electronics', value: 'A' },
            { label: 'Microsoft', value: 'B' },
            { label: 'Whole Foods Market', value: 'C' }
          ]
        }
      ]
    },
    {
      sectionNumber: 3,
      title: 'READING PASSAGE 3',
      passage: {
        title: 'The Exploration of Mars',
        content: `You should spend about 20 minutes on Questions 27-40 which are based on Reading Passage 3 below.

A

In 1877, Giovanni Schiaparelli, an Italian astronomer, made drawings and maps of the Martian surface that suggested strange features. The images from telescopes at this time were not as sharp as today. Schiaparelli said he could see a network of lines or canali. In 1894, an American astronomer, Percival Lowell, made a series of observations of Mars from his own observatory at Flagstaff, Arizona, USA. Lowell was convinced a great network of canals had been dug to irrigate crops for the Martian race! He suggested that each canal had fertile vegetation on either side, making them noticeable from Earth. Drawings and globes he made show a network of canals and oases all over the planet.

B

The idea that there was intelligent life on Mars gained strength in the late 19th century. In 1898, H.G. Wells wrote a science fiction classic, The War of the Worlds about an invading force of Martians who try to conquer Earth. They use highly advanced technology (advanced for 1898) to crush human resistance in their path. In 1917, Edgar Rice Burroughs wrote the first in a series of 11 novels about Mars. Strange beings and rampaging Martian monsters gripped the public's imagination. A radio broadcast by Orson Welles on Halloween night in 1938 of The War of the Worlds caused widespread panic across America. People ran into the streets in their pyjamas – millions believed the dramatic reports of a Martian invasion.

C

Probes are very important to our understanding of other planets. Much of our recent knowledge comes from these robotic missions into space. The first images sent back from Mars came from Mariner 4 in July 1965. They showed a cratered and barren landscape, more like the surface of our moon than Earth. In 1969, Mariners 6 and 7 were launched and took 200 photographs of Mars's southern hemisphere and pole on fly-by missions. But these showed little more information. In 1971, Mariner 9's mission was to orbit the planet every 12 hours. In 1975, The USA sent two Viking probes to the planet, each with a lander and an orbiter. The landers had sampler arms to scoop up Martian rocks and did experiments to try and find signs of life. Although no life was found, they sent back the first colour pictures of the planet's surface and atmosphere from pivoting cameras.

D

The Martian meteorite found on Earth aroused doubts to the above analysis. ALH84001 meteorite was discovered in December 1984 in Antarctica, by members of the ANSMET project. The sample was ejected from Mars about 17 million years ago and spent 11,000 years in or on the Antarctic ice sheets. Composition analysis by NASA revealed a kind of magnetite that on Earth, is only found in association with certain microorganisms. Some structures resembling the mineralized casts of terrestrial bacteria and their appendages fibrils of by-products occur in the rims of carbonate globules and pre-terrestrial aqueous alteration regions. The size and shape of the objects are consistent with Earthly fossilized nanobacteria, but the existence of nanobacteria itself is still controversial.

E

In 1965, the Mariner 4 probe discovered that Mars had no global magnetic field that would protect the planet from potentially life-threatening cosmic radiation and solar radiation; observations made in the late 1990s by the Mars Global Surveyor confirmed this discovery. Scientists speculate that the lack of magnetic shielding helped the solar wind blow away much of Mars's atmosphere over the course of several billion years. After mapping cosmic radiation levels at various depths on Mars, researchers have concluded that any life within the first several meters of the planet's surface would be killed by lethal doses of cosmic radiation. In 2007, it was calculated that DNA and RNA damage by cosmic radiation would limit life on Mars to depths greater than 7.5 metres below the planet's surface. Therefore, the best potential locations for discovering life on Mars may be at subsurface environments that have not been studied yet. The disappearance of the magnetic field may have played a significant role in the process of Martian climate change. According to the valuation of the scientists, the climate of Mars gradually transits from warm and wet to cold and dry after the magnetic field vanished.

F

NASA's recent missions have focused on another question: whether Mars held lakes or oceans of liquid water on its surface in the ancient past. Scientists have found hematite, a mineral that forms in the presence of water. Thus, the mission of the Mars Exploration Rovers of 2004 was not to look for present or past life, but for evidence of liquid water on the surface of Mars in the planet's ancient past. Liquid water, necessary for Earth life and for metabolism as generally conducted by species on Earth, cannot exist on the surface of Mars under its present low atmospheric pressure and temperature, except at the lowest shaded elevations for short periods and liquid water does not appear at the surface itself. In March 2004, NASA announced that its rover Opportunity had discovered evidence that Mars was, in the ancient past, a wet planet. This had raised hopes that evidence of past life might be found on the planet today. ESA confirmed that the Mars Express orbiter had directly detected huge reserves of water ice at Mars' south pole in January 2004.

G

Researchers from the Center of Astrobiology (Spain) and the Catholic University of the North in Chile have found a 'microbial oasis' of microorganisms two meters below the surface of the Atacama Desert. SOLID, a detector for signs of life which could be used in environments similar to subsoil on Mars. "We have named it a 'microbial oasis' because we found microorganisms developing in a habitat that was rich in rock salt and other highly hygroscopic compounds that absorb water" explained Victor Parro, a researcher from the Center of Astrobiology in Spain. "If there are similar microbes on Mars or remains in similar conditions to the ones we have found in the Atacama, we could detect them with instruments like SOLID" Parro highlighted.

H

Even more intriguing, however, is the alternative scenario by Spanish scientists: If those samples could be found to that use DNA, as Earthly life does, as their genetic code. It is extremely unlikely that such a highly specialised, complex molecule like DNA could have evolved separately on the two planets, indicating that there must be a common origin for Martian and Earthly life. Life-based on DNA first appeared on Mars and then spread to Earth, where it then evolved into the myriad forms of plants and creatures that exist today. If this was found to be the case, we would have to face the logical conclusion: we are all Martian. If not, we would continue to search the life of signs.`
      },
      questions: [
        {
          type: 'table-selection',
          instruction: 'The Reading Passage has eight paragraphs A-H. Which paragraph contains the following information? Select the correct letter A-H by marking the checkbox in the appropriate column for each question below.',
          headers: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
          rows: [
            {
              questionNumber: 27,
              label: 'Martian evidence on Earth'
            },
            {
              questionNumber: 28,
              label: 'Mars and Earth may share the same life origin'
            },
            {
              questionNumber: 29,
              label: 'Certain agricultural construction was depicted specifically'
            },
            {
              questionNumber: 30,
              label: 'The project which aims to identify life under similar condition of Mars'
            },
            {
              questionNumber: 31,
              label: 'Mars had experienced terrifying climate transformation'
            },
            {
              questionNumber: 32,
              label: 'Attempts in scientific investigation to find liquid water'
            }
          ]
        },
        {
          type: 'multiple-choice',
          questionNumber: 33,
          question: 'How did Percival Lowell describe Mars in this passage?',
          options: [
            { label: 'Perfect observation location is in Arizona', value: 'A' },
            { label: 'Canals of Mars is broader than that of the earth', value: 'B' },
            { label: 'Dedicated water and agriculture trace are similar to the earth', value: 'C' },
            { label: 'Actively moving Martian lives are found by observation', value: 'D' }
          ]
        },
        {
          type: 'multiple-choice',
          questionNumber: 34,
          question: 'How did people change their point of view towards Mars from the 19th century?',
          options: [
            { label: 'They experienced a Martian attack', value: 'A' },
            { label: 'They learned knowledge of mars through some literature works', value: 'B' },
            { label: 'They learned a new concept by listening to a famous radio program', value: 'C' },
            { label: 'They attended lectures given by famous writers', value: 'D' }
          ]
        },
        {
          type: 'multiple-choice',
          questionNumber: 35,
          question: 'In the 1960s, which information is correct about Mars by a number of Probes sent to space?',
          options: [
            { label: 'It has a landscape full of rock and river', value: 'A' },
            { label: 'It was not as vivid as the earth', value: 'B' },
            { label: 'It contained the same substance as in the moon', value: 'C' },
            { label: 'It had different images from the following probes', value: 'D' }
          ]
        },
        {
          type: 'multiple-choice',
          questionNumber: 36,
          question: 'What is the implication of the project proceeded by a technology called SOLID in the Atacama Desert?',
          options: [
            { label: 'It could be employed to explore organisms under Martian condition', value: 'A' },
            { label: 'This technology could NOT be used to identify life on similar condition of Mars', value: 'B' },
            { label: 'Atacama Desert is the only place that has a suitable environment for organisms', value: 'C' },
            { label: 'Life had not yet been found yet in the Atacama Desert', value: 'D' }
          ]
        },
        {
          type: 'true-false-not-given',
          instruction: 'Do the following statements agree with the information given in Reading Passage 3? Write TRUE if the statement is true, FALSE if the statement is false, NOT GIVEN if the information is not given in the passage.',
          statements: [
            {
              questionNumber: 37,
              statement: 'The technology of Martian creature was superior to what human had at that time in every field according to The War of the Worlds.'
            },
            {
              questionNumber: 38,
              statement: 'Proof sent by Viking probes has not been challenged yet.'
            },
            {
              questionNumber: 39,
              statement: 'Analysis of meteorite from Mars found a substance which is connected to some germs.'
            },
            {
              questionNumber: 40,
              statement: 'According to Victor Parro, their project will be deployed on Mars after they identified DNA substance on earth.'
            }
          ]
        }
      ]
    }
  ]
};
