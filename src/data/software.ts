/**
 * The software side of the offer — the systems and engineering work Magic
 * Lantern sells and Cybromines builds.
 *
 * Written in Magic Lantern's own voice ("we"), which is why it is a separate
 * file from `cybromines.ts`: that one records how Cybromines describe
 * themselves on cybromines.com and should keep matching their site. The two
 * overlap on the platform products, so if a system's positioning changes,
 * change it in both places.
 *
 * Each entry renders three things with no other edit:
 *   · a card on /services#software and on the home page
 *   · an item in the Services dropdown and the footer
 *   · its own page at /software/<slug>, via pages/software/[slug].astro
 * Reordering the array renumbers everything.
 */

export type SoftwareService = {
  /** URL segment: /software/<slug> */
  slug: string;
  num: string;
  title: string;
  /** One line, used on every card and in the nav. */
  desc: string;
  /** Overview essay. The first paragraph is set large as the statement. */
  overview: string[];
  deliverablesLede: string;
  deliverables: string[];
  steps: { title: string; desc: string }[];
};

export const softwareServices: SoftwareService[] = [
  {
    slug: 'erp-system',
    num: '01',
    title: 'ERP System',
    desc: 'Trading, inventory, finance and HR on one ledger — with AI agents working across all of it.',
    overview: [
      'An ERP earns its keep the day you stop asking where a number came from. Ours puts trading, inventory, finance, purchasing, HR and point of sale on one ledger, so a sale at the counter, the stock it consumes and the entry it posts are the same event seen from three angles.',
      'We start from how you already work rather than from a template. Modules switch on as you need them — a trading business might begin with purchasing, stock and receivables and add production a year later — and every one of them writes to the same chart of accounts, so month-end stops being a reconciliation exercise and becomes a review.',
      'AI agents sit across the whole of it: flagging a margin that has quietly slipped, drafting the purchase request before a fast-moving line runs out, answering “what did we spend on packaging last quarter” in a sentence rather than a report. The result is one version of the business that every department can see, and nobody has to rebuild in a spreadsheet first.',
    ],
    deliverablesLede:
      'A modular ERP configured around your operation rather than a generic install — with the migration, the training and the support that make it stick.',
    deliverables: [
      'Finance & accounting ledger',
      'Purchasing & supplier management',
      'Inventory & warehouse control',
      'Sales, quotations & receivables',
      'HR & payroll modules',
      'Role-based dashboards & reporting',
    ],
    steps: [
      {
        title: 'Map',
        desc: 'We sit with each department and document how work actually moves today — including the spreadsheets nobody mentions in meetings.',
      },
      {
        title: 'Configure',
        desc: 'Modules, roles, approval chains and the chart of accounts are set up against that map, then tested with your own data rather than samples.',
      },
      {
        title: 'Migrate',
        desc: 'Masters, opening balances and history come across in a staged cutover, with the old system running alongside until the numbers agree.',
      },
      {
        title: 'Support',
        desc: 'Training by role, then a support line and a release cadence that keeps the system growing with the business instead of ageing against it.',
      },
    ],
  },
  {
    slug: 'crm-system',
    num: '02',
    title: 'CRM System',
    desc: 'Every enquiry becomes a tracked, AI-nurtured deal — from first contact to signed order.',
    overview: [
      'Most deals are not lost to a competitor. They are lost to a follow-up nobody made, because the enquiry lived in one person’s inbox and left with them on Friday.',
      'A CRM fixes that by making the pipeline something the whole team can see. Every enquiry — a form, a call, a message, a walk-in — lands in one pipeline with an owner and a next action. Stages, fields and permissions are shaped around how you actually sell, so your team is recording work rather than feeding a system that gives nothing back.',
      'An AI agent takes the unglamorous half: scoring leads as they arrive, drafting the first reply, nudging the owner when a deal has gone quiet, and writing the weekly summary you would otherwise chase four people for. What your team keeps is the part that needs judgement.',
    ],
    deliverablesLede:
      'A pipeline built around your sales process, connected to the channels enquiries actually arrive on, and reporting you can run a Monday meeting from.',
    deliverables: [
      'Lead capture from web, phone & social',
      'Custom pipelines & deal stages',
      'Quotation & proposal generation',
      'Automated follow-up sequences',
      'AI lead scoring & reply drafting',
      'Forecast & performance dashboards',
    ],
    steps: [
      {
        title: 'Map',
        desc: 'We trace a real enquiry end to end — who touches it, what they need to know, and where it currently goes cold.',
      },
      {
        title: 'Build',
        desc: 'Pipelines, fields, permissions and automations are configured to that route, not to a demo account’s idea of a sales team.',
      },
      {
        title: 'Connect',
        desc: 'Website forms, phone, email, WhatsApp and your ERP are wired in, so nothing has to be typed twice to be counted.',
      },
      {
        title: 'Adopt',
        desc: 'Training, a clean data migration and a first month of tuning — because a CRM only tells the truth if the team is genuinely using it.',
      },
    ],
  },
  {
    slug: 'whatsapp-crm',
    num: '03',
    title: 'WhatsApp CRM',
    desc: 'Sell and support on the channel your customers already use — with every thread on record.',
    overview: [
      'In India and the Gulf, the sale happens on WhatsApp. The problem is that it happens on somebody’s personal phone, where the business cannot see it, cannot measure it and cannot pick it up when that person is on leave.',
      'A WhatsApp CRM puts your business on the official WhatsApp Business Platform, with one number the whole team answers from. Every thread is assigned, tagged and searchable; catalogues, quotations and payment links go out inside the chat; and the conversation attaches to the customer record instead of staying trapped in a handset.',
      'Automation carries the repetitive part — an instant acknowledgement out of hours, order status on request, a broadcast to a segment that has opted in, a reminder before a renewal falls due — and hands over to a person the moment the question stops being routine. Your customers notice only that someone answers quickly.',
    ],
    deliverablesLede:
      'A verified business number, a shared inbox your team works from, and the automation that makes a channel this busy survivable.',
    deliverables: [
      'Official WhatsApp Business API number',
      'Shared team inbox with assignment',
      'Chatbot flows & office-hours routing',
      'Broadcast campaigns & opt-in lists',
      'Catalogue, quotation & payment links',
      'Full thread history on the customer record',
    ],
    steps: [
      {
        title: 'Verify',
        desc: 'Business verification and number provisioning on the official platform — the part that keeps you off the wrong side of a ban.',
      },
      {
        title: 'Design',
        desc: 'We write the conversation: the greeting, the menu, what the bot may answer alone and exactly where it hands over to a human.',
      },
      {
        title: 'Connect',
        desc: 'The inbox is wired to your CRM or ERP so an order placed in a chat becomes an order in the system, not a screenshot.',
      },
      {
        title: 'Measure',
        desc: 'Response times, resolution rates and campaign performance per agent and per segment, reviewed and tuned after launch.',
      },
    ],
  },
  {
    slug: 'hrms',
    num: '04',
    title: 'HRMS',
    desc: 'Attendance, leave, payroll and appraisals on one system — from the offer letter to the final settlement.',
    overview: [
      'HR software is judged on the last day of the month. If payroll runs clean, nothing else about it gets discussed; if it does not, nothing else about it matters.',
      'We put the whole employee record in one place — the offer, the documents, the shift roster, the attendance punch, the leave balance, the appraisal — so payroll becomes a calculation over data you already trust rather than a scramble across four spreadsheets. Statutory deductions, gratuity and end-of-service follow the rules of the country the employee is actually in.',
      'Everything routine moves to self-service: staff apply for leave, download a payslip and update their own details from their phone, and approvals follow the reporting line you configured. Managers get the dashboard; HR gets the last week of the month back.',
    ],
    deliverablesLede:
      'One employee record from hire to exit, with the attendance, payroll and compliance built on top of it.',
    deliverables: [
      'Employee records & document expiry alerts',
      'Shift rosters & biometric attendance',
      'Leave policies & approval workflows',
      'Payroll with statutory compliance',
      'Employee self-service on mobile',
      'Appraisals & performance reviews',
    ],
    steps: [
      {
        title: 'Policy',
        desc: 'Your leave rules, shift patterns, overtime and salary structures are written down properly — often for the first time — and then encoded.',
      },
      {
        title: 'Configure',
        desc: 'Grades, reporting lines, approval chains and payroll components are set up and checked against real past months.',
      },
      {
        title: 'Parallel run',
        desc: 'We run a full cycle alongside your current process and reconcile to the rupee or the fils before anyone depends on it.',
      },
      {
        title: 'Roll out',
        desc: 'Self-service goes to staff with a short guide, and HR keeps a support line through the first quarter-end.',
      },
    ],
  },
  {
    slug: 'pos-system',
    num: '05',
    title: 'POS System',
    desc: 'Fast at the counter, honest in the ledger — online or off, one shop or fifty.',
    overview: [
      'A counter has one requirement: the queue keeps moving. Everything else a till does is worth nothing if the cashier is waiting on a screen.',
      'Ours is built to be quick under the thumb and to keep working when the connection does not — offline first, syncing the moment the line comes back. Every sale writes straight through to stock and to the ledger, so the day’s takings, the shelf and the accounts never tell three different stories.',
      'Across several outlets you get one price list, one promotions engine and one view of performance by shop, by hour and by cashier. AI suggests the upsell at checkout and flags the void and discount patterns worth a second look.',
    ],
    deliverablesLede:
      'A till your staff can learn in an afternoon, wired to the same stock and accounts as the rest of the business.',
    deliverables: [
      'Touch-first billing on any device',
      'Offline mode with automatic sync',
      'Multi-outlet pricing & promotions',
      'Integrated payments & receipts',
      'Live stock deduction & reorder alerts',
      'Shift, cashier & day-end reconciliation',
    ],
    steps: [
      {
        title: 'Scope',
        desc: 'We watch a real trading hour at your busiest counter and design around what actually slows it down.',
      },
      {
        title: 'Configure',
        desc: 'Products, prices, taxes, offers, hardware and user roles are set up and tested against that hour.',
      },
      {
        title: 'Pilot',
        desc: 'One counter goes live first, with us on site, so the wrinkles are found before the whole floor depends on it.',
      },
      {
        title: 'Roll out',
        desc: 'Remaining counters and outlets follow on a schedule, with reporting consolidated as each one lands.',
      },
    ],
  },
  {
    slug: 'inventory-system',
    num: '06',
    title: 'Inventory System',
    desc: 'Know exactly what you hold, where it is and what it is worth — before the stockout, not after.',
    overview: [
      'Stock is the largest number on most balance sheets and the least trusted one. The gap between the system figure and the shelf is where margin quietly goes.',
      'We close it with barcode and batch-level tracking across every location you hold goods in — warehouse, shop, van, project site — and cycle counts that fit around trading instead of shutting it down for a weekend. Serial numbers, expiry dates and landed cost are tracked where they matter, so valuation becomes a number you can defend to an auditor.',
      'Then the system starts working ahead of you: forecasting demand from your own history and seasonality, raising the purchase request before a fast line runs dry, and flagging the slow stock that is quietly paying rent on your shelf space.',
    ],
    deliverablesLede:
      'Accurate stock across every location you hold it, with the forecasting that turns that accuracy into fewer stockouts and less dead capital.',
    deliverables: [
      'Barcode & QR stock movement',
      'Multi-location & bin-level tracking',
      'Batch, serial & expiry control',
      'Cycle counting & stock reconciliation',
      'AI demand forecasting & reorder points',
      'Valuation, ageing & dead-stock reports',
    ],
    steps: [
      {
        title: 'Audit',
        desc: 'A physical count and a look at where the current figures drift, so we are fixing the actual leak rather than a suspected one.',
      },
      {
        title: 'Structure',
        desc: 'Item masters, units, locations and bins are organised properly — the unglamorous work that decides whether any of this holds up.',
      },
      {
        title: 'Deploy',
        desc: 'Scanners and mobile stock apps go to the floor, with counts, transfers and receipts moving through the system from day one.',
      },
      {
        title: 'Tune',
        desc: 'Once a few months of clean movement exist, forecasting and reorder points are switched on and calibrated against them.',
      },
    ],
  },
  {
    slug: 'production-system',
    num: '07',
    title: 'Production System',
    desc: 'Plan, build and track every work order on the floor — with the schedule optimised as conditions change.',
    overview: [
      'A production plan made on Monday is wrong by Wednesday. The only question is whether the floor finds out from the system or from a shouted conversation across the shed.',
      'We track the job from the order through the bill of materials, the routing, the work centre and the finished-goods receipt, so consumption, wastage and actual cost per unit are recorded as the work happens rather than reconstructed at month-end from memory.',
      'AI takes the scheduling: resequencing work when a machine goes down or a material lands late, and flagging the equipment whose signature says it is about to stop the line. What you get back is a plan that survives contact with a real week.',
    ],
    deliverablesLede:
      'Visibility from the order to the finished unit, and a true cost for each one — including the wastage nobody was counting.',
    deliverables: [
      'Bill of materials & routing',
      'Work order planning & scheduling',
      'Shop-floor tracking & job cards',
      'Material consumption & wastage',
      'Quality checkpoints & rejections',
      'Actual cost per unit & yield reporting',
    ],
    steps: [
      {
        title: 'Model',
        desc: 'We document your products, recipes, routings and work centres as they really run, including the substitutions made under pressure.',
      },
      {
        title: 'Configure',
        desc: 'Work orders, quality gates and costing rules are built on that model and validated against completed jobs.',
      },
      {
        title: 'Instrument',
        desc: 'The floor gets job cards it can actually use mid-shift, so data is captured at the machine rather than typed up later.',
      },
      {
        title: 'Optimise',
        desc: 'With real throughput data in hand, AI scheduling and maintenance prediction are switched on and tuned to your constraints.',
      },
    ],
  },
  {
    slug: 'property-system',
    num: '08',
    title: 'Property System',
    desc: 'Units, leases, tenants and maintenance on one platform — with renewals and rent chased automatically.',
    overview: [
      'A property portfolio is a calendar problem dressed as a finance problem. Rent falls due, cheques clear, contracts expire and permits lapse — all on different dates, all quietly, and all expensive to miss.',
      'We put the portfolio on one platform: units and their status, tenants and their documents, leases and their payment schedules, and every receipt mapped to the instalment it settles. Owner statements and occupancy reporting come out of that same data instead of a spreadsheet somebody maintains by hand.',
      'An AI agent does the chasing — renewal notices before the window closes, rent reminders on the schedule you set, and maintenance requests triaged to the right contractor with the history of that unit already attached.',
    ],
    deliverablesLede:
      'One register for the whole portfolio, and the automation that means a lapsed date costs you nothing.',
    deliverables: [
      'Unit, tower & portfolio register',
      'Tenant records & document expiry alerts',
      'Lease contracts & payment schedules',
      'Cheque & instalment tracking',
      'Maintenance requests & work orders',
      'Owner statements & occupancy reports',
    ],
    steps: [
      {
        title: 'Register',
        desc: 'Every unit, lease and tenant is brought into one structure, with the document expiry dates that nobody currently tracks centrally.',
      },
      {
        title: 'Configure',
        desc: 'Rent schedules, escalation clauses, deposits and approval rules are set up to match your actual contracts.',
      },
      {
        title: 'Migrate',
        desc: 'Live leases, outstanding balances and post-dated cheques come across and are reconciled before the system takes over.',
      },
      {
        title: 'Operate',
        desc: 'Reminders, renewals and maintenance run on the platform, with owner reporting produced from the same numbers.',
      },
    ],
  },
  {
    slug: 'queue-management',
    num: '09',
    title: 'Queue Management',
    desc: 'Turn a waiting line into a measured experience — and know when to open another counter.',
    overview: [
      'Nobody minds waiting as much as they mind not knowing how long. A queue system is worth more for what it tells the customer than for what it tells you — though it tells you plenty.',
      'Tokens are issued at a kiosk, from a QR code or on the visitor’s own phone; displays and announcements call them; and every service point reports what it is doing. Different services get their own queues, priorities and service-level targets, so a two-minute transaction is not stuck behind a twenty-minute one.',
      'Underneath, the data turns into staffing decisions: average wait by hour and by counter, where the line builds and how long it takes to clear. AI predicts the wait and tells the supervisor to open another counter before the lobby fills rather than after.',
    ],
    deliverablesLede:
      'A calmer lobby, a visitor who knows where they stand, and a manager who can prove what the wait actually was.',
    deliverables: [
      'Kiosk, QR & mobile token issue',
      'Counter displays & audio calling',
      'Multi-service queues & priority rules',
      'Appointment booking & check-in',
      'AI wait-time prediction & staffing alerts',
      'Service-level & footfall analytics',
    ],
    steps: [
      {
        title: 'Survey',
        desc: 'We measure your current flow at peak — arrivals, service times and where the line actually forms — before designing anything.',
      },
      {
        title: 'Configure',
        desc: 'Services, priorities, counters and targets are set up around that measurement, including how exceptions get handled.',
      },
      {
        title: 'Install',
        desc: 'Kiosks, displays and audio go in, with signage and a staff briefing so the first day is not the training day.',
      },
      {
        title: 'Analyse',
        desc: 'A month in, we review the numbers with you and retune priorities and staffing against what the data now shows.',
      },
    ],
  },
  {
    slug: 'custom-software',
    num: '10',
    title: 'Custom Software Development',
    desc: 'Bespoke web systems for the part of your business no product off the shelf fits.',
    overview: [
      'Most businesses run a standard system for the standard ninety per cent and something unrepeatable for the rest. That last part is usually where the margin is — and it is almost always held together by a spreadsheet and one person’s memory.',
      'That is the part worth building properly. We scope it against the outcome rather than a feature list, ship in increments you can use while the rest is still being built, and write it to be handed over: documented, tested and yours, with no lock-in to a vendor you cannot replace.',
      'It integrates with what you already run instead of replacing it, and it is engineered to still be maintainable in five years — which is a design decision made at the start, not a promise made at the end.',
    ],
    deliverablesLede:
      'Software shaped to one specific problem, delivered in working increments and handed over properly.',
    deliverables: [
      'Discovery, scoping & technical design',
      'Web application development',
      'API design & third-party integration',
      'Database architecture & migration',
      'Automated testing & CI/CD',
      'Documentation, handover & support',
    ],
    steps: [
      {
        title: 'Discover',
        desc: 'We work out what the software has to make true, and what it deliberately will not do — the second list saves the most money.',
      },
      {
        title: 'Design',
        desc: 'Data model, interfaces and integration points are designed and reviewed with you before a line of it is built.',
      },
      {
        title: 'Build',
        desc: 'Delivered in short increments you can actually use, so priorities can change while changing them is still cheap.',
      },
      {
        title: 'Hand over',
        desc: 'Documentation, source, deployment and a support window — written so another engineer could pick it up without us.',
      },
    ],
  },
  {
    slug: 'mobile-apps',
    num: '11',
    title: 'Mobile App Development',
    desc: 'iOS and Android apps your customers keep on the first screen — and your team actually uses.',
    overview: [
      'An app has to earn its place on a phone that is already full. It gets one chance, and it is not judged against your last app — it is judged against every app the person already uses daily.',
      'So we design for the moment it opens: what the person came to do, done in as few taps as the task honestly allows, working on a weak connection and on a three-year-old handset. Native where the experience demands it, cross-platform where it does not, and the choice explained to you rather than assumed.',
      'We take it through store review, instrument it so you can see what people actually do rather than what you hoped they would, and keep shipping after launch — because the version that matters is rarely the first one.',
    ],
    deliverablesLede:
      'A published app on both stores, built for real phones and real signal, with the analytics to keep improving it.',
    deliverables: [
      'iOS & Android applications',
      'UI/UX design & prototyping',
      'Offline support & background sync',
      'Push notifications & deep links',
      'App Store & Play Store submission',
      'Analytics, crash reporting & updates',
    ],
    steps: [
      {
        title: 'Define',
        desc: 'We agree the one job the app exists to do, and cut the features that would dilute it into a menu of everything.',
      },
      {
        title: 'Design',
        desc: 'Flows and screens are prototyped and put in front of real users on a real device before development starts.',
      },
      {
        title: 'Build',
        desc: 'Developed against test builds you can install and use each sprint, on both platforms, on the handsets you care about.',
      },
      {
        title: 'Launch',
        desc: 'Store listings, review, a staged rollout, and the first round of fixes shipped from what launch-week data shows.',
      },
    ],
  },
  {
    slug: 'ai-automation',
    num: '12',
    title: 'AI Automation & Consulting',
    desc: 'Put AI to work across the tools you already run — and the ones we build for you.',
    overview: [
      'Most AI projects fail on the same thing: they start from the technology instead of from a task somebody does forty times a week and quietly resents.',
      'We start from the task. We audit where your team’s hours actually go, pick the handful of jobs where automation pays back inside a quarter, and build agents that do them — reading the inbox, drafting the reply, extracting the invoice, summarising the call, watching the numbers and speaking up when one moves.',
      'Beyond the systems we build, we act as your AI partner across the tools you already have: choosing them, wiring them together, setting the guardrails for what a machine may decide on its own, and training your team so the capability stays in the building rather than leaving with a consultant.',
    ],
    deliverablesLede:
      'A short list of jobs worth automating, the agents that do them, and a team that knows how to use and supervise them.',
    deliverables: [
      'AI readiness audit & opportunity mapping',
      'Custom AI agents & workflow automation',
      'Document & invoice data extraction',
      'Chat assistants over your own data',
      'Integration with your existing tools',
      'Team training & usage guardrails',
    ],
    steps: [
      {
        title: 'Audit',
        desc: 'We follow the work for a week and come back with where the hours go, ranked by what automation would actually be worth.',
      },
      {
        title: 'Pilot',
        desc: 'One job, automated end to end and measured against how it ran before — so the business case is evidence, not a slide.',
      },
      {
        title: 'Deploy',
        desc: 'The agent goes into daily use with guardrails, an audit trail and a clear line for what still needs a human decision.',
      },
      {
        title: 'Scale',
        desc: 'Next jobs on the list follow, and your team is trained to spot and specify the ones after that themselves.',
      },
    ],
  },
];

/** Lookup for the dynamic route and for cross-linking between pages. */
export const softwareBySlug = new Map(softwareServices.map((s) => [s.slug, s]));
