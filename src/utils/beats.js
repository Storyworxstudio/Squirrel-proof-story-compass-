export const ACTS = [
  { key: 'act1',  label: 'Act 1',   color: 'blue' },
  { key: 'act2a', label: 'Act 2a',  color: 'violet' },
  { key: 'act2b', label: 'Act 2b',  color: 'rose' },
  { key: 'act3',  label: 'Act 3',   color: 'amber' },
]

export const BEATS = [
  {
    number: 1,
    name: 'Ordinary World',
    act: 'Act 1',
    actKey: 'act1',
    pacing: 10,
    help: {
      explanation:
        "Establish who your protagonist is before everything changes. We need to see their 'normal' so we can feel the disruption when it comes. Ground us in their everyday life, their wants, and what's quietly wrong or missing — even if they can't see it yet.",
      questions: [
        "Who is your protagonist in everyday life? Their normal.",
        "What is missing in their life, even if they can't name it?",
        "What is the thing they desire that is specific and measurable?",
      ],
      example:
        "Dorothy is a Kansas farm girl who dreams of somewhere over the rainbow. We see her dusty, restless life before the tornado — yearning for more without knowing exactly what. That specific ordinary world makes everything that follows land harder.",
    },
  },
  {
    number: 2,
    name: 'Catalyst',
    act: 'Act 1',
    actKey: 'act1',
    pacing: 20,
    help: {
      explanation:
        "Something disrupts the ordinary world — an event, a revelation, a loss, an unexpected arrival. It forces your protagonist to respond. They can't just keep living as before. This isn't a choice yet; it's the thing that makes a choice necessary.",
      questions: [
        "What happens that your protagonist cannot ignore or avoid?",
        "How does this event threaten, upend, or challenge their ordinary world?",
        "What's at stake if they do nothing?",
      ],
      example:
        "The tornado sweeps Dorothy away to Oz. She didn't choose this — it happened to her. But now she must deal with it. The catalyst is the world acting on the protagonist before they act on the world.",
    },
  },
  {
    number: 3,
    name: 'Decision',
    act: 'Act 1',
    actKey: 'act1',
    pacing: 30,
    help: {
      explanation:
        "Your protagonist makes a choice that launches them into the story's main journey. This is the point of no return. Unlike the catalyst (which happened to them), the decision is something they own. It defines who they are and what this story is really about.",
      questions: [
        "What does your protagonist choose to do — and why can't they undo it?",
        "What are they hoping to gain, fix, or escape?",
        "What truth about them does this choice expose?",
      ],
      example:
        "Dorothy decides she must find the Wizard to get home. She sets off down the yellow brick road. The decision is hers — and it commits her to everything that follows.",
    },
  },
  {
    number: 4,
    name: 'New World Turn',
    act: 'Act 2a',
    actKey: 'act2a',
    pacing: 35,
    help: {
      explanation:
        "Your protagonist enters a new situation and gets their first real taste of this unfamiliar territory. Things seem strange, maybe even exciting. They're figuring out the rules of this new world — and so is the reader.",
      questions: [
        "What's surprising, disorienting, or exciting about this new world?",
        "What early wins, allies, or resources does your protagonist find?",
        "What do they think they must do to succeed?",
      ],
      example:
        "Dorothy lands in Oz, meets Glinda, gets the ruby slippers, and starts gathering allies. Everything is vivid and strange. She believes she just needs to reach the Wizard — it seems almost straightforward.",
    },
  },
  {
    number: 5,
    name: 'New World Struggles',
    act: 'Act 2a',
    actKey: 'act2a',
    pacing: 50,
    help: {
      explanation:
        "The initial excitement fades. Real obstacles emerge. Your protagonist realizes this is harder than they thought — and maybe harder than they're equipped for. This is where the plan starts to crack and doubts creep in.",
      questions: [
        "What is their first complication?",
        "How is this new world testing their flaw?",
        "What do they need but reject?",
      ],
      example:
        "The enchanted poppy field puts Dorothy's group to sleep. The Wicked Witch's interference escalates. What seemed manageable is becoming genuinely dangerous. The road to the Emerald City is longer and harder than it looked.",
    },
  },
  {
    number: 6,
    name: 'Escalation',
    act: 'Act 2a',
    actKey: 'act2a',
    pacing: 60,
    help: {
      explanation:
        "Stakes rise sharply. The antagonistic force grows stronger or more visible. Your protagonist's current approach is clearly not working. Time may be running out. The audience feels the pressure tightening.",
      questions: [
        "How does the opposition or conflict become more powerful and immediate?",
        "What does your protagonist try that fails — and why does it fail?",
        "Is there a deadline or ticking clock? If not, what makes this story feel urgent?",
      ],
      example:
        "The Wicked Witch captures Dorothy and threatens to kill her unless she surrenders the ruby slippers. Everything is now on the line. The Wizard and the plan feel very far away.",
    },
  },
  {
    number: 7,
    name: 'Midpoint Moment',
    act: 'Act 2b',
    actKey: 'act2b',
    pacing: 50,
    help: {
      explanation:
        "A pivotal scene — often a false victory or false defeat — that shifts the story's energy at its center. Your protagonist gains new information or a new perspective. Things look different now. The story turns.",
      questions: [
        "What apparent win or loss occurs at this midpoint?",
        "What truth did the protagonist learn about themselves or the story goal?",
        "How does this revelation shift the story?",
      ],
      example:
        "Dorothy finally reaches the Wizard — and he's a fraud, a small man behind a curtain. Everything she worked toward is hollow. The external goal (get the Wizard to send you home) is exposed as the wrong answer.",
    },
  },
  {
    number: 8,
    name: 'Midpoint Aftermath',
    act: 'Act 2b',
    actKey: 'act2b',
    pacing: 60,
    help: {
      explanation:
        "Your protagonist processes the midpoint revelation and pivots. Old strategies are abandoned. New understanding drives new action. This is a period of regrouping — messy, uncertain, but pointing toward something real.",
      questions: [
        "How does your protagonist respond to what they just learned or lost?",
        "What do they now believe they actually need (vs. what they thought before)?",
        "How does this revelation change their goal, their methods, or their mindset?",
      ],
      example:
        "With the Wizard revealed as useless, Dorothy and her friends pivot. They need another way. Dorothy still has hope, and her companions — who already had what they sought — begin to see that too.",
    },
  },
  {
    number: 9,
    name: 'Lowpoint',
    act: 'Act 2b',
    actKey: 'act2b',
    pacing: 70,
    help: {
      explanation:
        "Everything falls apart. Your protagonist hits rock bottom. It seems like all is lost and success is impossible. This is the darkest moment — the internal wound is fully exposed. Something has to break open for the story to move toward resolution.",
      questions: [
        "What is the worst thing that could happen — and does it happen?",
        "What does your protagonist lose, risk losing, or believe they've lost forever?",
        "What core belief about themselves or the world gets shattered here?",
      ],
      example:
        "Dorothy is trapped in the Wicked Witch's castle, the hourglass nearly empty, watching her home in the crystal ball. Her friends seem defeated. This looks like the end.",
    },
  },
  {
    number: 10,
    name: 'The Plan',
    act: 'Act 3',
    actKey: 'act3',
    pacing: 75,
    help: {
      explanation:
        "Despite everything, your protagonist digs deep and commits to one final attempt. They have new clarity — about what they truly need, who they truly are, or what truly matters. This isn't reckless; it's intentional. They know what must be done.",
      questions: [
        "What is the protagonist's final push — and what makes it different from before?",
        "What do they now understand about themselves or what they truly need?",
        "What are they willing to risk or sacrifice?",
      ],
      example:
        "Dorothy's friends disguise themselves as guards and storm the castle to rescue her. It's a real plan — risky, committed, born of love rather than hope for a Wizard's magic.",
    },
  },
  {
    number: 11,
    name: 'Climax',
    act: 'Act 3',
    actKey: 'act3',
    pacing: 90,
    help: {
      explanation:
        "The protagonist faces the central conflict head-on. Everything comes down to this moment — the decisive confrontation. All the skills, relationships, and growth of the story are tested here. This is the moment of transformation or defeat.",
      questions: [
        "What is the final confrontation, and what's at stake?",
        "How do they use what they've learned?",
        "What action or realization turns the tide?",
      ],
      example:
        "Dorothy throws water on the Wicked Witch — and she melts. The threat is destroyed. It's almost accidental, which is perfect: Dorothy wasn't trying to be a hero. She just acted from her own nature.",
    },
  },
  {
    number: 12,
    name: 'Resolution',
    act: 'Act 3',
    actKey: 'act3',
    pacing: 100,
    help: {
      explanation:
        "The dust settles. Show the new world your protagonist now inhabits. What has changed? What has been earned? The resolution doesn't have to wrap everything up perfectly — but it should leave the reader with a clear sense of what the story meant.",
      questions: [
        "How is your protagonist different from who they were at the start?",
        "What does the world look like now that the conflict is resolved?",
        "What's the final image or feeling you want to leave the reader with?",
      ],
      example:
        "Dorothy clicks her heels: 'There's no place like home.' She wakes up surrounded by family and understands what she had all along. The Wizard's magic was never the answer — she carried it the whole time.",
    },
  },
]

export const BEATS_BY_ACT = {
  act1:  BEATS.filter(b => b.actKey === 'act1'),
  act2a: BEATS.filter(b => b.actKey === 'act2a'),
  act2b: BEATS.filter(b => b.actKey === 'act2b'),
  act3:  BEATS.filter(b => b.actKey === 'act3'),
}
