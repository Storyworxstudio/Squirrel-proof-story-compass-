const SAVE_THE_CAT = [
  { name: 'Opening Image',        description: '', notes: '' },
  { name: 'Theme Stated',         description: '', notes: '' },
  { name: 'Set-Up',               description: '', notes: '' },
  { name: 'Catalyst',             description: '', notes: '' },
  { name: 'Debate',               description: '', notes: '' },
  { name: 'Break into Two',       description: '', notes: '' },
  { name: 'B Story',              description: '', notes: '' },
  { name: 'Fun and Games',        description: '', notes: '' },
  { name: 'Midpoint',             description: '', notes: '' },
  { name: 'Bad Guys Close In',    description: '', notes: '' },
  { name: 'All Is Lost',          description: '', notes: '' },
  { name: 'Dark Night of the Soul', description: '', notes: '' },
  { name: 'Break into Three',     description: '', notes: '' },
  { name: 'Finale',               description: '', notes: '' },
  { name: 'Final Image',          description: '', notes: '' },
]

const HERO_JOURNEY = [
  { name: 'Ordinary World',       description: '', notes: '' },
  { name: 'Call to Adventure',    description: '', notes: '' },
  { name: 'Refusal of the Call',  description: '', notes: '' },
  { name: 'Meeting the Mentor',   description: '', notes: '' },
  { name: 'Crossing the Threshold', description: '', notes: '' },
  { name: 'Tests, Allies, Enemies', description: '', notes: '' },
  { name: 'Approach to the Inmost Cave', description: '', notes: '' },
  { name: 'Ordeal',               description: '', notes: '' },
  { name: 'Reward (Seizing the Sword)', description: '', notes: '' },
  { name: 'The Road Back',        description: '', notes: '' },
  { name: 'Resurrection',         description: '', notes: '' },
  { name: 'Return with the Elixir', description: '', notes: '' },
]

const THREE_ACT = [
  { name: 'Act 1 — Setup',        description: '', notes: '' },
  { name: 'Inciting Incident',    description: '', notes: '' },
  { name: 'Plot Point 1',         description: '', notes: '' },
  { name: 'Act 2A — Rising Action', description: '', notes: '' },
  { name: 'Midpoint',             description: '', notes: '' },
  { name: 'Act 2B — Complications', description: '', notes: '' },
  { name: 'Plot Point 2',         description: '', notes: '' },
  { name: 'Act 3 — Resolution',   description: '', notes: '' },
]

export function getTemplateBeats(templateId) {
  switch (templateId) {
    case 'save-the-cat': return SAVE_THE_CAT.map((b) => ({ ...b }))
    case 'hero-journey':  return HERO_JOURNEY.map((b) => ({ ...b }))
    case 'three-act':     return THREE_ACT.map((b) => ({ ...b }))
    default:              return [{ name: 'Beat 1', description: '', notes: '' }]
  }
}
