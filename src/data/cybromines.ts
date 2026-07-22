/**
 * Cybromines — Magic Lantern's software development partner.
 *
 * Copy is taken from cybromines.com so the partner page matches how they
 * describe themselves. Re-check it against their site before a release; the
 * stats in particular are their claims, not ours.
 */

export const cybromines = {
  name: 'Cybromines',
  url: 'https://cybromines.com',
  positioning: 'AI-native software house',
  headline: 'Every system your business runs on, built with AI at the core',
  subheadline:
    'Cybromines designs, builds, and integrates the software your operation depends on — ERP, CRM, POS, inventory, production, property, and queue systems — with autonomous AI agents working across all of it.',
  /** How the two companies divide the work, in Magic Lantern's voice. */
  relationship:
    'Magic Lantern tells the story — the film, the brand, the campaign. When a project needs real software underneath it, Cybromines builds it. Same table, one brief, no hand-off gap between the people who design it and the people who ship it.',
  socials: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/company/cybromines' },
    { label: 'GitHub', href: 'https://github.com/cybromines-tech' },
    { label: 'YouTube', href: 'https://youtube.com/@cybromines' },
    { label: 'X', href: 'https://x.com/cybromines' },
  ],
} as const;

/** The seven products they position as one platform. */
export const cybrominesSystems = [
  {
    num: '01',
    title: 'ERP System',
    desc: 'A modular ERP that unifies trading, inventory, finance, HR, and point of sale — with AI agents working across all of it.',
  },
  {
    num: '02',
    title: 'CRM System',
    desc: 'Turn every conversation into a tracked, AI-nurtured deal. An AI agent qualifies leads and drafts replies before your team wakes up.',
  },
  {
    num: '03',
    title: 'POS System',
    desc: 'Sell fast at the counter — online or off. AI suggests upsells at checkout and flags suspicious transactions in real time.',
  },
  {
    num: '04',
    title: 'Inventory System',
    desc: "Know exactly what you hold, where, and what it's worth. AI forecasts demand and raises purchase requests before stockouts happen.",
  },
  {
    num: '05',
    title: 'Production System',
    desc: 'Plan, build, and track every work order on the floor. AI optimises the schedule and predicts equipment failures before they stop the line.',
  },
  {
    num: '06',
    title: 'Property System',
    desc: 'Manage units, leases, and tenants on one platform. An AI agent chases renewals and rent, and triages every maintenance request.',
  },
  {
    num: '07',
    title: 'Queue Management',
    desc: 'Turn waiting lines into a smooth, measured experience. AI predicts wait times and tells you exactly when to open another counter.',
  },
] as const;

/** Work they take on beyond the seven platform products. */
export const cybrominesServices = [
  {
    title: 'Custom Software Development',
    desc: 'Bespoke web and mobile systems, engineered to last.',
  },
  {
    title: 'AI Consulting',
    desc: 'Beyond their own systems, they act as your AI partner — helping you adopt and use AI across the tools you already have, so your whole team gets more productive.',
  },
  { title: 'Mobile Apps', desc: 'iOS and Android apps your customers keep.' },
  { title: 'SEO Services', desc: 'Rank for the searches that bring you revenue.' },
] as const;

/** Figures as published on cybromines.com — confirm before a release. */
export const cybrominesStats = [
  { value: '7', label: 'Systems on one platform' },
  { value: '120+', label: 'Enterprise deployments' },
  { value: '99.9%', label: 'Platform uptime' },
  { value: '6', label: 'GCC countries served' },
] as const;
