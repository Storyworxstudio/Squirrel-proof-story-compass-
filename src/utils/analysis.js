import { BEATS } from './beats'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function wordCount(text) {
  return text.trim().split(/\s+/).filter(Boolean).length
}

function containsAny(text, words) {
  const lower = text.toLowerCase()
  return words.some(w => lower.includes(w))
}

const STOPWORDS = new Set([
  'the', 'and', 'but', 'for', 'are', 'was', 'were', 'has', 'had', 'have',
  'that', 'this', 'with', 'from', 'they', 'their', 'them', 'she', 'his',
  'her', 'him', 'you', 'your', 'our', 'its', 'been', 'not', 'nor', 'can',
  'could', 'would', 'should', 'will', 'may', 'might', 'shall', 'what',
  'when', 'where', 'which', 'who', 'how', 'why', 'than', 'more', 'most',
  'some', 'into', 'over', 'under', 'about', 'before', 'after', 'during',
  'since', 'very', 'just', 'also', 'then', 'now', 'here', 'there', 'too',
  'all', 'any', 'one', 'two', 'out', 'get', 'got', 'use', 'used', 'like',
  'make', 'made', 'even', 'still', 'such', 'each', 'does', 'did', 'only',
  'see', 'way', 'back', 'come', 'came', 'take', 'took', 'know', 'knew',
  'find', 'feel', 'felt', 'seem', 'show', 'need', 'want', 'goes', 'went',
  'said', 'say', 'says', 'tell', 'told', 'ask', 'asked', 'help', 'keep',
  'lets', 'put', 'look', 'same', 'long', 'away', 'good', 'turn', 'true',
  'real', 'own', 'down', 'left', 'next', 'last', 'must', 'much', 'many',
  'done', 'being', 'going', 'thing', 'things', 'time', 'little', 'every',
  'always', 'never', 'often', 'sometimes', 'usually', 'through', 'those',
])

function getMeaningfulWords(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 3 && !STOPWORDS.has(w))
}

// Detect a protagonist: pronouns, character nouns, or a capitalized proper name
// mid-sentence (heuristic for a character name).
function hasCharacter(text) {
  if (/\b(he|she|they|i|him|her|his|them|their)\b/i.test(text)) return true
  if (/\b(protagonist|character|hero|heroine|woman|man|girl|boy|person|narrator)\b/i.test(text)) return true
  // Check for a capitalized word that isn't the first word of its sentence
  return text.split(/[.!?]+/).some(sentence => {
    const words = sentence.trim().split(/\s+/)
    return words.slice(1).some(w => /^[A-Z][a-z]{1,}/.test(w))
  })
}

// ─── Act 1 ────────────────────────────────────────────────────────────────────

function analyzeAct1(beatStates) {
  const ow  = beatStates[1]?.content ?? ''
  const cat = beatStates[2]?.content ?? ''
  const dec = beatStates[3]?.content ?? ''

  const results = []

  // Word count — always passes (button only appears when ready)
  results.push({
    id: 'act1-length',
    label: 'Minimum beat length',
    status: 'pass',
    message: 'All three beats meet the 15-word minimum — good foundation to work from.',
  })

  // OW ❌ protagonist present
  results.push({
    id: 'act1-ow-protagonist',
    label: 'Ordinary World: protagonist present',
    status: hasCharacter(ow) ? 'pass' : 'fail',
    message: hasCharacter(ow)
      ? 'Your protagonist is visible and grounded in their ordinary world — we know who we\'re following.'
      : 'Give us someone to root for — name your protagonist or make them clearly visible in this beat.',
  })

  // Catalyst ⚠️ disrupting event present
  // Requires BOTH a disruption word AND an emotional/consequence word to pass.
  const catalystDisruptionWords = [
    'discovers', 'finds', 'reveals', 'breaks', 'loses', 'attacks', 'crashes',
    'dies', 'fires', 'expelled', 'rejected', 'fails', 'betrayed', 'stolen',
    'destroyed', 'arrested', 'injured', 'threatens', 'ruins', 'banned',
    'humiliated', 'chosen', 'selected', 'called', 'summoned',
  ]
  const catalystConsequenceWords = [
    'shocked', 'scared', 'angry', 'devastated', 'confused', 'embarrassed',
    'surprised', 'horrified', 'heartbroken', 'afraid', 'panicked', 'forced',
    'must', 'cannot', 'never', 'everything changes', 'world turns', 'turns out',
  ]
  const catalystPasses = containsAny(cat, catalystDisruptionWords) && containsAny(cat, catalystConsequenceWords)
  results.push({
    id: 'act1-catalyst-disruption',
    label: 'Catalyst: disrupting event present',
    status: catalystPasses ? 'pass' : 'warn',
    message: catalystPasses
      ? "The Catalyst has a clear disrupting event and shows how it lands on your protagonist — well done."
      : "The Catalyst should show a specific event that disrupts or changes your protagonist's world — not just what happens, but how it hits them.",
  })

  // Decision — response language + shared words with Catalyst
  const decisionResponseWords = [
    'decides', 'chooses', 'chosen', 'must', 'will', 'going to', 'plans',
    'refuses', 'committed', 'vows', 'swears', 'determined', 'resolves',
    'agrees', 'accepts', 'takes on', 'steps up', 'fights', 'runs', 'leaves',
    'stays', 'confronts', 'pursues', 'gives up', 'surrenders', 'pledges',
  ]
  const hasResponseLanguage = containsAny(dec, decisionResponseWords)

  const catWords = new Set(getMeaningfulWords(cat))
  const decWords = getMeaningfulWords(dec)
  const sharedCount = decWords.filter(w => catWords.has(w)).length
  const hasSharedWords = sharedCount >= 2

  const decisionStatus = hasResponseLanguage && hasSharedWords ? 'pass'
    : hasResponseLanguage ? 'warn'
    : 'fail'
  const decisionMessage = hasResponseLanguage && hasSharedWords
    ? "The Decision flows directly from the Catalyst — your protagonist is responding to what disrupted their world."
    : hasResponseLanguage
      ? "Your protagonist makes a decision, but it's not clearly connected to what happened in the Catalyst. Make sure the decision is a direct response to that disruption."
      : "The Decision beat needs to show your protagonist actively responding to the Catalyst event with a clear choice or commitment."
  results.push({
    id: 'act1-decision-choice',
    label: 'Decision: responds to Catalyst',
    status: decisionStatus,
    message: decisionMessage,
  })

  return results
}

// ─── Act 2a ───────────────────────────────────────────────────────────────────

function analyzeAct2a(beatStates) {
  const nwt = beatStates[4]?.content ?? ''
  const nws = beatStates[5]?.content ?? ''

  const results = []

  results.push({
    id: 'act2a-length',
    label: 'Minimum beat length',
    status: 'pass',
    message: 'All three beats meet the 15-word minimum — good foundation to work from.',
  })

  // NWT ❌ protagonist enters unfamiliar territory
  const shiftWords = [
    'new', 'enter', 'enters', 'arrive', 'arrives', 'find', 'finds',
    'discover', 'discovers', 'meet', 'meets', 'different', 'strange',
    'unfamiliar', 'cross', 'crosses', 'reach', 'reaches', 'begin', 'begins',
    'start', 'starts', 'world', 'territory', 'place', 'journey', 'first',
    'unknown', 'foreign', 'outside', 'transition', 'moves', 'step', 'venture',
    'suddenly', 'thrust', 'thrown', 'for the first', 'never before', 'now',
  ]
  results.push({
    id: 'act2a-nwt-shift',
    label: 'New World Turn: entering unfamiliar territory',
    status: containsAny(nwt, shiftWords) ? 'pass' : 'fail',
    message: containsAny(nwt, shiftWords)
      ? 'The shift into new territory is clear — we feel the protagonist crossing into unfamiliar ground.'
      : 'Show us the crossing — what specifically signals that your protagonist is now in new and unfamiliar territory?',
  })

  // NWS ❌ conflict, problem, or complication present
  const conflictWords = [
    'conflict', 'problem', 'complication', 'trouble', 'struggle', 'fail',
    'fails', 'failure', 'wrong', 'difficult', 'hard', 'obstacle', 'challenge',
    'threat', 'threatens', 'danger', 'dangerous', 'enemy', 'opposition',
    'setback', 'blocks', 'hinders', 'prevents', 'stops', 'issue', 'crisis',
    'clash', 'attack', 'attacked', 'betrayed', 'betrayal', 'mistake', 'error',
    'goes wrong', 'not working', 'push back', 'pushback', 'against', 'resist',
  ]
  results.push({
    id: 'act2a-nws-conflict',
    label: 'New World Struggles: conflict or complication present',
    status: containsAny(nws, conflictWords) ? 'pass' : 'fail',
    message: containsAny(nws, conflictWords)
      ? "There's real friction in the struggles beat — the new world is pushing back."
      : "Name the problem — what specific conflict or complication is this new world throwing at your protagonist?",
  })

  // NWS ❌ complications cause more conflict (escalation language)
  const escalationWords = [
    'also', 'and now', 'but now', 'however', 'moreover', 'worse', 'worsens',
    'worsening', 'increasingly', 'growing', 'spiral', 'spirals', 'compounds',
    'compounding', 'another', 'yet', 'still', 'further', 'escalates', 'builds',
    'on top of', 'in addition', 'as a result', 'which means', 'leading to',
    'not only', 'layer', 'piling', 'deepens', 'add to', 'adding to',
  ]
  results.push({
    id: 'act2a-nws-escalation',
    label: 'New World Struggles: complications compound',
    status: containsAny(nws, escalationWords) ? 'pass' : 'fail',
    message: containsAny(nws, escalationWords)
      ? 'The complications feel connected and building — each problem feeds into the next.'
      : 'Show the chain reaction — how do the complications compound on each other and dig your protagonist deeper?',
  })

  return results
}

// ─── Act 2b ───────────────────────────────────────────────────────────────────

function analyzeAct2b(beatStates) {
  const mm = beatStates[7]?.content ?? ''
  const ma = beatStates[8]?.content ?? ''
  const lp = beatStates[9]?.content ?? ''

  const results = []

  results.push({
    id: 'act2b-length',
    label: 'Minimum beat length',
    status: 'pass',
    message: 'All three beats meet the 15-word minimum — good foundation to work from.',
  })

  // MM ❌ shift language — exact list from spec
  const shiftWords = [
    'realizes', 'learns', 'discovers', 'understands', 'changes',
    'turns', 'but', 'however', 'until', 'except',
  ]
  results.push({
    id: 'act2b-mm-shift',
    label: 'Midpoint Moment: shift or revelation present',
    status: containsAny(mm, shiftWords) ? 'pass' : 'fail',
    message: containsAny(mm, shiftWords)
      ? 'The midpoint has a genuine pivot — something is realized, learned, or overturned here.'
      : "Add a moment of turn — a word like 'realizes,' 'discovers,' or 'however' signals the story is changing direction.",
  })

  // LP ❌ loss or consequence language — exact list from spec
  const lossWords = [
    'lost', 'fails', 'alone', 'broken', 'worst', 'everything', 'nothing', 'gives up',
  ]
  results.push({
    id: 'act2b-lp-loss',
    label: 'Lowpoint: loss or consequence present',
    status: containsAny(lp, lossWords) ? 'pass' : 'fail',
    message: containsAny(lp, lossWords)
      ? "The low point has real loss — we feel the weight of what's been taken or broken."
      : 'Push deeper into the loss — what is genuinely gone, broken, or surrendered at the darkest moment?',
  })

  // MA or LP ⚠️ behavior/mindset change — exact list from spec
  const behaviorWords = [
    'decides', 'chooses', 'stops', 'starts', 'realizes',
    'no longer', 'different', 'changed', 'finally', 'instead',
  ]
  const hasBehavior = containsAny(ma, behaviorWords) || containsAny(lp, behaviorWords)
  results.push({
    id: 'act2b-behavior-change',
    label: 'Aftermath/Lowpoint: behavior or mindset shift',
    status: hasBehavior ? 'pass' : 'warn',
    message: hasBehavior
      ? "There's a visible shift in behavior or thinking — the protagonist isn't just suffering, they're changing."
      : "Show how this section changes them — even a small decision or mindset shift signals the story is moving forward.",
  })

  return results
}

// ─── Act 3 ────────────────────────────────────────────────────────────────────

function analyzeAct3(beatStates) {
  const plan   = beatStates[10]?.content ?? ''
  const climax = beatStates[11]?.content ?? ''
  const res    = beatStates[12]?.content ?? ''
  const ow     = beatStates[1]?.content  ?? '' // for echo check

  const results = []

  results.push({
    id: 'act3-length',
    label: 'Minimum beat length',
    status: 'pass',
    message: 'All three beats meet the 15-word minimum — good foundation to work from.',
  })

  // Plan ❌ — exact word list from spec
  const planWords = [
    'plan', 'decide', 'going to', 'will', 'must', 'strategy',
    'prepare', 'ready', 'steps',
  ]
  results.push({
    id: 'act3-plan-strategy',
    label: 'The Plan: clear strategy present',
    status: containsAny(plan, planWords) ? 'pass' : 'fail',
    message: containsAny(plan, planWords)
      ? 'The plan beat has a clear strategy — we know your protagonist has a concrete course of action.'
      : 'Make the plan tangible — what specifically are they going to do, and how do they intend to do it?',
  })

  // Climax ❌ — exact word list from spec
  const actionWords = [
    'chooses', 'acts', 'faces', 'confronts', 'decides',
    'fights', 'stands', 'refuses',
  ]
  results.push({
    id: 'act3-climax-action',
    label: 'Climax: action or decision present',
    status: containsAny(climax, actionWords) ? 'pass' : 'fail',
    message: containsAny(climax, actionWords)
      ? 'The climax has real stakes and action — someone is doing something that matters here.'
      : 'The climax needs a moment of decision — what does your protagonist actively choose, do, or face?',
  })

  // Resolution ❌ thematic echo of Ordinary World
  const owWords  = new Set(getMeaningfulWords(ow))
  const resWords = getMeaningfulWords(res)
  const hasEcho  = resWords.some(w => owWords.has(w))
  results.push({
    id: 'act3-resolution-echo',
    label: 'Resolution: echoes Ordinary World',
    status: hasEcho ? 'pass' : 'fail',
    message: hasEcho
      ? 'The resolution echoes the ordinary world — the story has come full circle thematically.'
      : 'Try weaving a word or image from the Ordinary World into the Resolution — it creates a sense of the story completing its arc.',
  })

  return results
}

// ─── Public API ───────────────────────────────────────────────────────────────

export function analyzeAct(actKey, beatStates) {
  switch (actKey) {
    case 'act1':  return analyzeAct1(beatStates)
    case 'act2a': return analyzeAct2a(beatStates)
    case 'act2b': return analyzeAct2b(beatStates)
    case 'act3':  return analyzeAct3(beatStates)
    default:      return []
  }
}

export function isActReady(actKey, beatStates) {
  return BEATS
    .filter(b => b.actKey === actKey)
    .every(beat => wordCount(beatStates[beat.number]?.content ?? '') >= 15)
}
