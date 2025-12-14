// Track: 1-M Reading
import { Track } from './track1';

export const track1MReading: Track = {
  id: 'track-1m-reading',
  name: '1-M Reading',
  shortName: '1MR',
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
        title: 'Decibel Hell',
        content: `Section A: Decibel Hell
It's not difficult for a person to encounter sound at levels that can cause adverse health effects. During a single day, people living in a typical urban environment can experience a wide range of sounds in many locations, even once-quiet locales have become polluted with noise. In fact, it's difficult today to escape sound completely. In its 1999 Guidelines for Community Noise, the World Health Organization (WHO) declared, "Worldwide, noise-induced hearing impairment is the most prevalent irreversible occupational hazard, and it is estimated that 120 million people worldwide have disabling hearing difficulties." Growing evidence also points to many other health effects of too much volume.

Mark Stephenson, a Cincinnati, Ohio-based senior research audiologist at the National Institute for Occupational Safety and Health (NIOSH), says his agency's definition of hazardous noise is sound that exceeds the time-weighted average of 85 dBA, meaning the average noise exposure measured over a typical eight-hour workday. Other measures and definitions are used for other purposes.

Section B: Growing Volume
In the United States, about 30 million workers are exposed to hazardous sound levels on the job, according to NIOSH. Industries having a high number of workers exposed to loud sounds include construction, agriculture, mining, manufacturing, utilities, transportation, and the military. Noise in U.S. industry is an extremely difficult problem to monitor, acknowledges Craig Moulton, a senior industrial hygienist for the Occupational Safety and Health Administration (OSHA). "Still," he says, "OSHA does require that any employer with workers overexposed to noise provide protection for those employees against the harmful effects of noise. Additionally, employers must implement a continuing, effective hearing conservation program as outlined in OSHA's Noise Standard."

Section C: Scary Sound Effects
Numerous scientific studies over the years have confirmed that exposure to certain levels of sound can damage hearing. Prolonged exposure can actually change the structure of the hair cells in the inner ear, resulting in hearing loss. It can also cause tinnitus, a ringing, roaring, buzzing, or clicking on the ears.

NIOSH studies from the mid to late 1990s show that 90% of coal miners have hearing impairment by age 52 – compared to 9% of the general population – and 70% of male metal/nonmetal miners will experience hearing impairment by age 60 (Stephenson notes that from adolescence onward, females tend to have better hearing than males). Neitzel says nearly half of all construction workers have some degree of hearing loss. "NIOSH research also reveals that by age twenty-five, the average carpenter's hearing is equivalent to an otherwise healthy fifty-year-old male who hasn't been exposed to noise," he says.

William Luxford, medical director of the House Ear Clinic of St. Vincent Medical Center in Los Angeles, points out one piece of good news: "It's true that continuous noise exposure will lead to the continuation of hearing loss, but as soon as the exposure is stopped, the hearing loss stops. So a change in environment can improve a person's hearing health."

Research is catching up with this anecdotal evidence. In the July 2001 issue of Pediatrics, researchers from the Centers for Disease Control and Prevention reported that, based on audiometric testing of 5,249 children as part of the Third National Health and Nutrition, Examination Survey, an estimated 12.5% of American children have noise-induced hearing threshold shifts – or dulled hearing – in one or both ears. Most children with noise-induced hearing threshold shifts have only limited hearing damage, but continued exposure to excessive noise can lead to difficulties with high-frequency sound discrimination. The report listed stereos, music concerts, toys (such as toy telephones and certain rattles), lawnmowers, and fireworks as producing potentially harmful sounds.

Section D: Beyond the Ears
The effects of sound don't stop with the ears. Nonauditory effects of noise exposure are those effects that don't cause hearing loss but still can be measured, such as elevated blood pressure, loss of sleep, increased heart rate, cardiovascular constriction, labored breathing, and changes in brain chemistry.

The nonauditory effects of noise were noted as early as 1930 in a study published by E.L. Smith and D.L. Laird in volume 2 of the Journal of the Acoustical Society of America. The results showed that exposure to noise caused stomach contractions in healthy human beings. Reports on noise's nonauditory effects published since that pioneering study have been both contradictory and controversial in some areas.

Bronzaft and the school principal persuaded the school board to have acoustical tile installed in the classrooms adjacent to the tracks. The Transit Authority also treated the tracks near the school to make them less noisy. A follow-up study published in the September 1981 issue of the Journal of Environmental Psychology found that children's reading scores improved after these interventions were put in place.

Section E: Fighting for Quiet
Anti-noise activists say that Europe and several countries in Asia are more advanced than the United States in terms of combating noise. "Population pressure has prompted Europe to move more quickly on the noise issue that the United States has," Hume says. In the European Union, countries with cities of at least 250,000 people are creating noise maps of those cities to help leaders determine noise pollution policies. Paris has already prepared its first noise maps. The map data, which must be finished by 2007, will be fed into computer models that will help test the sound impact of street designs or new buildings before construction begins.

Activists in other countries say they too want the United States to play a more leading role on the noise issue. But as in other areas of environmental health, merely having a more powerful government agency in place that can set more regulations is not the ultimate answer, according to other experts. Bronzaft stresses that governments worldwide need to increase funding for noise research and do a better job coordinating their noise pollution efforts so they can establish health and environmental policies based on solid scientific research. "Governments have a responsibility to protect their citizens by curbing noise pollution," she says.`
      },
      questions: [
        {
          type: 'paragraph-gap',
          instruction: 'Complete the summary below. Choose NO MORE THAN TWO WORDS from the passage for each answer.',
          paragraph: `Nowadays it seems difficult for people to avoid the effects of living in a noisy world. Noise is the sound beyond the average of (1).......... referring to the agency's definition. Scientific studies over the years from the mid to late 1990s have confirmed that exposure to certain levels of sound can cause damage (2).......... at a certain senior age. From the testing of 5,249 children, those who are constantly exposed to excessive noise may have trouble in (3).......... sound discrimination. The effects of sound don't stop with the ears, exposure to noise may lead to the unease of (4).......... in healthy people. Europe has taken steps on the noise issue, big cities of over 250,000 people are creating (5).......... to help to create noise pollution policies.`,
          questionNumbers: [1, 2, 3, 4, 5]
        },
        {
          type: 'drag-and-drop',
          instruction: 'Match each researcher with the correct finding. Write the correct letter in boxes 6–10.',
          items: [
            {
              questionNumber: 6,
              label: 'People can change the environment to improve hearing health.'
            },
            {
              questionNumber: 7,
              label: 'The government should continue the research on anti-noise research with the fund.'
            },
            {
              questionNumber: 8,
              label: 'companies should be required to protect the employees to avoid noise.'
            },
            {
              questionNumber: 9,
              label: 'Noise has posed an effect on American children\'s hearing ability.'
            },
            {
              questionNumber: 10,
              label: 'noise has seriously affected human being where they live worldwide.'
            }
          ],
          options: [
            { label: 'WHO', value: 'A' },
            { label: 'William Luxford (House Ear Clinic)', value: 'B' },
            { label: 'Craig Moulton (OSHA)', value: 'C' },
            { label: 'Arline Bronzaft', value: 'D' },
            { label: 'Centers for Disease Control and Prevention', value: 'E' }
          ]
        },
        {
          type: 'multiple-choice',
          questionNumber: 11,
          question: 'The board of schools built close to the tracks are convinced to',
          options: [
            { label: 'moved the classrooms away from the noisy track', value: 'A' },
            { label: 'regulated the track usage to a less extent', value: 'B' },
            { label: 'utilised a special material into classroom buildings lessening the effect of outside noise', value: 'C' },
            { label: 'organised a team for a follow-up study', value: 'D' }
          ]
        },
        {
          type: 'multiple-choice',
          questionNumber: 12,
          question: 'In European countries, the big cities\' research on noise focuses on',
          options: [
            { label: 'How to record pollution details of the city on maps', value: 'A' },
            { label: 'the impact of noise on population shift in the European cities', value: 'B' },
            { label: 'how wide can a city be to avoid noise pollution', value: 'C' },
            { label: 'helping the authorities better make a decision on management of the city', value: 'D' }
          ]
        },
        {
          type: 'multiple-choice',
          questionNumber: 13,
          question: 'What is the best title in paragraph 1?',
          options: [
            { label: 'How people cope with noise pollution', value: 'A' },
            { label: 'the fight against the noise with the powerful technology', value: 'B' },
            { label: 'The Effects of Living in a Noisy World', value: 'C' },
            { label: 'The Effects of noise on children\'s learning', value: 'D' }
          ]
        }
      ]
    },
    {
      sectionNumber: 2,
      title: 'READING PASSAGE 2',
      passage: {
        title: 'TV Addiction',
        content: `A
The amount of time people spend watching television is astonishing. On average, individuals in the industrialized world devote three hours a day to the pursuit – fully half of their leisure time, and more than on any single activity save work and sleep. At this rate, someone who lives to 75 would spend nine years in front of the tube. To some commentators, this devotion means simply that people enjoy TV and make a conscious decision to watch it. But if that is the whole story, why do so many people experience misgivings about how much they view? In Gallup polls in 1992 and 1999, two out of five adult respondents and seven out of 10 teenagers said they spent too much time watching TV. Other surveys have consistently shown that roughly 10 percent of adults calls themselves TV addicts.

B
To study people's reactions to TV, researchers have undertaken laboratory experiments in which they have monitored the brain waves (using an electroencephalograph, or EEG) to track behavior and emotion in the normal course of life, as opposed to the artificial conditions of the lab. Participants carried a beeper, and we signaled them six to eight times a day, at random, over the period of a week; whenever they heard the beep, they wrote down what they were doing and how they were feeling using a standardized scorecard.

C
As one might expect, people who were watching TV when we beeped them reported feeling relaxed and passive. The EEG studies similarly show less mental stimulation, as measured by alpha brain-wave production, during viewing than during reading. What is more surprising is that the sense of relaxation ends when the set is turned off, but the feelings of passivity and lowered alertness continue. Survey participants say they have more difficulty concentrating after viewing than before. In contrast, they rarely indicate such difficulty after reading. After playing sports or engaging in hobbies, people report improvements in mood. After watching TV, people's moods are about the same or worse than before. That may be because of viewers' vague learned sense that they will feel less relaxed if they stop viewing. So they tend not to turn the set-off. Viewing begets more viewing which is the same as the experience of habit-forming drugs. Thus, the irony of TV: people watch a great deal longer than they plan to, even though prolonged viewing is less rewarding. In our ESM studies the longer people sat in front of the set, the less satisfaction they said they derived from it. For some, a twinge of unease or guilt that they aren't doing something more productive may also accompany and depreciate the enjoyment of prolonged viewing. Researchers in Japan, the U.K. and the U.S. have found that this guilt occurs much more among middle-class viewers than among less affluent ones.

D
What is it about TV that has such a hold on us? In part, the attraction seems to spring from our biological 'orienting response.' First described by Ivan Pavlov in 1927, the orienting response is our instinctive visual or auditory reaction to any sudden or novel stimulus. It is part of our evolutionary heritage, a built-in sensitivity to movement and potential predatory threats. In 1986 Byron Reeves of Stanford University, Esther Thorson of the University of Missouri and their colleagues began to study whether the simple formal features of television – cuts, edits, zooms, pans, sudden noises – activate the orienting response, thereby keeping attention on the screen. By watching how brain waves were affected by formal features, the researchers concluded that these stylistic tricks can indeed trigger involuntary responses and 'derive their attentional value through the evolutionary significance of detecting movement… It is the form, not the content, of television that is unique.'

E
The natural attraction to television's sound and the light starts very early in life. Dafna Lemish of Tel Aviv University has described babies at six to eight weeks attending to television. We have observed slightly older infants who, when lying on their backs on the floor, crane their necks around 180 degrees to catch what light through yonder window breaks. This inclination suggests how deeply rooted the orienting response is.

F
The Experience Sampling Method permitted us to look closely at most every domain of everyday life: working, eating, reading, talking to friends, playing a sport, and so on. We found that heavy viewers report feeling significantly more anxious and less happy than light viewers do in unstructured situations, such as doing nothing, daydreaming or waiting in line. The difference widens when the viewer is alone. Subsequently, Robert D. McIlwraith of the University of Manitoba extensively studies those who called themselves TV addicts on surveys. On a measure called the Short Imaginal Processes Inventory (SIPI), he found that the self-described addicts are more easily bored and distracted and have poorer attentional control than the non-addicts. The addicts said they used TV to distract themselves from unpleasant thoughts and to fill time. Other studies over the years have shown that heavy viewers are less likely to participate in community activities and sports and are more likely to be obese than moderate viewers or non-viewers.

G
More than 25 years ago psychologist Tannis M. MacBeth Williams of the University of British Columbia studied a mountain community that had no television until cable finally arrived. Over time, both adults and children in the town became less creative in problem-solving, less able to persevere at tasks, and less tolerant of unstructured time.

H
Nearly 40 years ago Gary A. Steiner of the University of Chicago collected fascinating individual accounts of families whose set had broken. In experiments, families have volunteered or been paid to stop viewing, typically for a week or a month. Some fought, verbally and physically. In a review of these could-turkey studies, Charles Winick of the City University of New York concluded: 'The first three or four days for most persons were the worst, even in many homes where the viewing was minimal and where there were other ongoing activities. In over half of all the households, during these first few days of loss, the regular routines were disrupted, family members had difficulties in dealing with the newly available time, anxiety and aggressions were expressed…. By the second week, a move toward adaptation to the situation was common.' Unfortunately, researchers have yet to flesh out these anecdotes; no one has systematically gathered statistics on the prevalence of these withdrawal symptoms.

I
Even though TV does seem to meet the criteria for substance dependence, not all researchers would go so far as to call TV addictive. McIlwraith said in 1988 that 'displacement of other activities by television may be socially significant but still fall short of the clinical requirement of significant impairment.' He argued that a new category of 'TV addiction' may not be necessary if heavy viewing stems from conditions such as depression and social phobia. Nevertheless, whether or not we formally diagnose someone as TV-dependent, millions of people sense that they cannot readily control the amount of television they watch.`
      },
      questions: [
        {
          type: 'true-false-not-given-collapsible',
          instruction: 'Do the following statements agree with the claims of the writer in Reading Passage 2',
          boxInstruction: 'TRUE - if the statement is true\nFALSE - if the statement is false\nNOT GIVEN - if the information is not given in the passage',
          statements: [
            {
              questionNumber: 14,
              statement: 'Study shows that males are more likely to be addicted to TV than females.'
            },
            {
              questionNumber: 15,
              statement: 'Greater improvements in mood are experienced after watching TV than playing sports.'
            },
            {
              questionNumber: 16,
              statement: 'TV addiction works in similar ways as drugs.'
            },
            {
              questionNumber: 17,
              statement: 'It is reported that people\'s satisfaction is in proportion to the time they spend watching TV.'
            },
            {
              questionNumber: 18,
              statement: 'Middle-class viewers are more likely to feel guilty about watching TV than the poor.'
            }
          ]
        },
        {
          type: 'table-selection',
          instruction: 'Select the correct letter A-H in boxes 19-23',
          headers: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
          rows: [
            {
              questionNumber: 19,
              label: 'Byron Reeves and Esther Thorson'
            },
            {
              questionNumber: 20,
              label: 'Dafna Lemish'
            },
            {
              questionNumber: 21,
              label: 'Robert D. McIlwraith'
            },
            {
              questionNumber: 22,
              label: 'Tannis M. MacBeth Williams'
            },
            {
              questionNumber: 23,
              label: 'Charles Winick'
            }
          ],
          optionsLegend: [
            { value: 'A', label: 'Audiences would get hypnotized from viewing too much television.' },
            { value: 'B', label: 'People have been sensitive to the TV signals since a younger age.' },
            { value: 'C', label: 'People are less likely to accomplish their work with television.' },
            { value: 'D', label: 'A handful of studies have attempted to study other types of media addiction.' },
            { value: 'E', label: 'The addictive power of television could probably minimize the problems.' },
            { value: 'F', label: 'Various media formal characters stimulate people\'s reaction on the screen.' },
            { value: 'G', label: 'People who believe themselves to be TV addicts are less likely to join in the group activities.' },
            { value: 'H', label: 'It is hard for people to accept life without a TV at the beginning.' }
          ]
        },
        {
          type: 'multiple-choice',
          questionNumber: 24,
          question: 'People in the industrialized world',
          options: [
            { label: 'devote ten hours watching TV on average', value: 'A' },
            { label: 'spend more time on TV than other entertainment', value: 'B' },
            { label: 'call themselves TV addicts.', value: 'C' },
            { label: 'enjoy working best.', value: 'D' }
          ]
        },
        {
          type: 'multiple-choice',
          questionNumber: 25,
          question: 'When compared with light viewers, heavy viewers',
          options: [
            { label: 'like playing sport more than reading.', value: 'A' },
            { label: 'feel relaxed after watching TV.', value: 'B' },
            { label: 'spend more time in daydreaming.', value: 'C' },
            { label: 'are more easily bored while waiting in line.', value: 'D' }
          ]
        },
        {
          type: 'multiple-choice',
          questionNumber: 26,
          question: 'Which of the following statements is true about the family experiment?',
          options: [
            { label: 'Not all subjects participate in the experiment for free.', value: 'A' },
            { label: 'There has been complete gathered data.', value: 'B' },
            { label: 'People are prevented from other activities during the experiment.', value: 'C' },
            { label: 'People can not adapt to the situation until the end.', value: 'D' }
          ]
        }
      ]
    },
    {
      sectionNumber: 3,
      title: 'READING PASSAGE 3',
      passage: {
        title: 'Communication in science',
        content: `A
Science plays an increasingly significant role in people's lives, making the faithful communication of scientific developments more important than ever. Yet such communication is fraught with challenges that can easily distort discussions, leading to unnecessary confusion and misunderstandings.

B
Some problems stem from the esoteric nature of current research and the associated difficulty of finding sufficiently faithful terminology. Abstraction and complexity are not signs that a given scientific direction is wrong, as some commentators have suggested, but are instead a tribute to the success of human ingenuity in meeting the increasingly complex challenges that nature presents. They can, however, make communication more difficult. But many of the biggest challenges for science reporting arise because in areas of evolving research, scientists themselves often only partly understand the full implications of any particular advance or development. Since that dynamic applies to most of the scientific developments that directly affect people's lives global warming, cancer research, diet studies – learning how to overcome it is critical to spurring a more informed scientific debate among the broader public.

C
Ambiguous word choices are the source of some misunderstandings. Scientists often employ colloquial terminology, which they then assign a specific meaning that is impossible to fathom without proper training. The term "relativity," for example, is intrinsically misleading. Many interpret the theory to mean that everything is relative and there are no absolutes. Yet although the measurements any observer makes depend on his coordinates and reference frame, the physical phenomena he measures have an invariant description that transcends that observer's particular coordinates. Einstein's theory of relativity is really about finding an invariant description of physical phenomena. True, Einstein agreed with the idea that his theory would have been better named "Invarianten theorie." But the term "relativity" was already entrenched at the time for him to change.

D
"The uncertainty principle" is another frequently abused term. It is sometimes interpreted as a limitation on observers and their ability to make measurements.

E
But it is not about intrinsic limitations on any one particular measurement; it is about the inability to precisely measure particular pairs of quantities simultaneously? The first interpretation is perhaps more engaging from a philosophical or political perspective. It's just not what the science is about.

F
Even the word "theory" can be a problem. Unlike most people, who use the word to describe a passing conjecture that they often regard as suspect, physicists have very specific ideas in mind when they talk about theories. For physicists, theories entail a definite physical framework embodied in a set of fundamental assumptions about the world that lead to a specific set of equations and predictions – ones that are borne out by successful predictions. Theories aren't necessarily shown to be correct or complete immediately. Even Einstein took the better part of a decade to develop the correct version of his theory of general relativity. But eventually both the ideas and the measurements settle down and theories are either proven correct, abandoned or absorbed into other, more encompassing theories.

G
"Global warming" is another example of problematic terminology. Climatologists predict more drastic fluctuations in temperature and rainfall – not necessarily that every place will be warmer. The name sometimes subverts the debate, since it lets people argue that their winter was worse, so how could there be global warming? Clearly "global climate change" would have been a better name. But not all problems stem solely from poor word choices. Some stem from the intrinsically complex nature of much of modern science. Science sometimes transcends this limitation: remarkably, chemists were able to detail the precise chemical processes involved in the destruction of the ozone layer, making the evidence that chlorofluorocarbon gases (Freon, for example) were destroying the ozone layer indisputable.

H
A better understanding of the mathematical significance of results and less insistence on a simple story would help to clarify many scientific discussions. For several months, Harvard was tortured months, Harvard was tortured by empty debates over the relative intrinsic scientific abilities of men and women. One of the more amusing aspects of the discussion was that those who believed in the differences and those who didn't use the same evidence about gender-specific special ability? How could that be? The answer is that the data shows no substantial effects. Social factors might account for these tiny differences, which in any case have an unclear connection to scientific ability. Not much of a headline when phrased that way, is it? Each type of science has its own source of complexity and potential for miscommunication. Yet there are steps we can take to improve public understanding in all cases. The first would be to inculcate greater understanding and acceptance of indirect scientific evidence. The information from an unmanned space mission is no less legitimate than the information from one in which people are on board.

I
This doesn't mean questioning an interpretation, but it also doesn't mean equating indirect evidence with blind belief, as people sometimes suggest. Second, we might need different standards for evaluating science with urgent policy implications than research with the purely theoretical value. When scientists say they are not certain about their predictions, it doesn't necessarily mean they've found nothing substantial. It would be better if scientists were more open about the mathematical significance of their results and if the public didn't treat math as quite so scary; statistics and errors, which tell us the uncertainty in a measurement, give us the tools to evaluate new developments fairly.

J
But most important, people have to recognize that science can be complex. If we accept only simple stories, the description will necessarily be distorted. When advances are subtle or complicated, scientists should be willing to go the extra distance to give proper explanations and the public should be more patient about the truth. Even so, some difficulties are unavoidable. Most developments reflect work in progress, so the story is complex because no one yet knows the big picture.`
      },
      questions: [
        {
          type: 'multiple-choice',
          questionNumber: 27,
          question: 'Why faithful science communication important?',
          options: [
            { label: 'Science plays an increasingly significant role in people\'s lives.', value: 'A' },
            { label: 'Science is fraught with challenges public are interested in.', value: 'B' },
            { label: 'The nature of complexity in science communication leads to confusion.', value: 'C' },
            { label: 'Scientific inventions are more important than ever before.', value: 'D' }
          ]
        },
        {
          type: 'multiple-choice',
          questionNumber: 28,
          question: 'What is the reason that the author believes for the biggest challenges for science reporting',
          options: [
            { label: 'phenomenon such as global warming, cancer research, diet studies is too complex.', value: 'A' },
            { label: 'Scientists themselves often only partly understand the Theory of Evolution', value: 'B' },
            { label: 'Scientists do not totally comprehend the meaning of certain scientific evolution', value: 'C' },
            { label: 'Scientists themselves often partly understand the esoteric communication nature', value: 'D' }
          ]
        },
        {
          type: 'multiple-choice',
          questionNumber: 29,
          question: 'According to the 3rd paragraph, the reference to the term and example of "theory of relativity" is to demonstrate',
          options: [
            { label: 'theory of relativity is about an invariant physical phenomenon', value: 'A' },
            { label: 'common people may be misled by the inaccurate choice of scientific phrase', value: 'B' },
            { label: 'the term "relativity," is designed to be misleading public', value: 'C' },
            { label: 'everything is relative and there is no absolutes existence', value: 'D' }
          ]
        },
        {
          type: 'multiple-choice',
          questionNumber: 30,
          question: 'Which one is a good example of appropriate word choice:',
          options: [
            { label: 'Scientific theory for the uncertainty principle', value: 'A' },
            { label: 'phenomenon of Global warming', value: 'B' },
            { label: 'the importance of ozone layer', value: 'C' },
            { label: 'Freon\'s destructive process on environmental', value: 'D' }
          ]
        },
        {
          type: 'multiple-choice',
          questionNumber: 31,
          question: 'What is a surprising finding of the Harvard debates in the passage?',
          options: [
            { label: 'There are equal intrinsic scientific abilities of men and women.', value: 'A' },
            { label: 'The proof applied by both sides seemed to be of no big difference.', value: 'B' },
            { label: 'The scientific data usually shows no substantial figures to support a debated idea.', value: 'C' },
            { label: 'Social factors might have a clear connection to scientific ability', value: 'D' }
          ]
        },
        {
          type: 'true-false-not-given-collapsible',
          instruction: 'Do the following statements agree with the information given in Reading Passage 3',
          boxInstruction: 'TRUE - if the statement is true\nFALSE - if the statement is false\nNOT GIVEN - if the information is not given in the passage',
          statements: [
            {
              questionNumber: 32,
              statement: '"Global warming" scientifically refers to greater fluctuations in temperature and rainfall rather than a universal temperature rise.'
            },
            {
              questionNumber: 33,
              statement: 'More media coverage of "global warming" would help the public to recognize the phenomenon.'
            },
            {
              questionNumber: 34,
              statement: 'Harvard debates should focus more on female scientist and male scientists'
            },
            {
              questionNumber: 35,
              statement: 'Public understanding and acceptance of indirect scientific evidence in all cases would lead to confusion'
            }
          ]
        },
        {
          type: 'paragraph-gap',
          instruction: 'Complete the summary below. Choose NO MORE THAN TWO WORDS from the passage for each answer.',
          paragraph: `Science Communication is fraught with challenges that can easily distort discussions, leading to unnecessary confusion and misunderstandings. Firstly, Ambiguous (36).......... are the source of some misunderstandings. Common people without proper training do not understand clearly or deeply a specific scientific meaning via the (37).......... scientists often employed. Besides, the measurements any (38).......... makes can not be confined to describe in a(n) constant (39).......... yet the phenomenon can be. What's more, even the word "theory" can be a problem. Theories aren't necessarily shown to be correct or complete immediately since scientists often evolved better versions of specific theories, a good example can be the theory of (40).......... Thus, most importantly people have to recognize that science can be complex.`,
          questionNumbers: [36, 37, 38, 39, 40]
        }
      ]
    }
  ]
};
