// ============================================================
// YOUR CONTENT — Replace everything in this file with your info
// ============================================================

export const ui = {
  topActions: { timeMachine: 'Time Machine' },
  hud: {
    home: 'Home',
    work: 'Case studies',
    experience: 'Experience',
    projects: 'Side projects',
    more: 'More',
  },
  intro: {
    kicker: 'about',
    role: 'Senior Product Designer, UI/UX and Frontend Engineering',
    body: 'Design systems and interface specification for modern digital products. Building products that make a real difference — combining deep user empathy with strong technical ability and a sharp eye for visual craft.',
    practice: 'Design systems and interface specification for modern digital products.',
    recent: 'Led product design for multiple fintech and consumer products end-to-end.',
    systems: 'Built component libraries and design tokens powering production interfaces.',
    span: 'Over ten years across design and frontend implementation.',
  },
  footer: {
    kicker: 'get in touch',
    headlineBefore: 'Say',
    headlineGlitch: 'hello',
    headlineAfter: '',
    cta: {
      hello: 'Send a message',
      helloSub: 'hello@yourname.com',
      resume: 'View or download Resume',
      resumeSub: 'PDF / online',
      call: 'Schedule a call',
      quote: 'Get a quote',
    },
  },
};

export const person = {
  name: 'YOUR NAME',
  title: 'Senior Product Designer',
  email: 'hello@yourname.com',
  location: 'Your City, Country',
};

export const socials = [
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/yourprofile/',
    icon: 'linkedin',
  },
  {
    label: 'GitHub',
    href: 'https://github.com/yourprofile',
    icon: 'github',
  },
  {
    label: 'X (Twitter)',
    href: 'https://x.com/yourhandle',
    icon: 'twitter',
  },
  {
    label: 'Dribbble',
    href: 'https://dribbble.com/yourprofile',
    icon: 'dribbble',
  },
];

export const caseStudies = [
  {
    slug: 'project-one',
    client: 'Project One',
    title: 'Project One',
    desc: 'A short description of this project and what makes it interesting.',
    tags: ['Product', 'UI/UX', 'Frontend Engineering'],
    year: '2024',
    accent: '#8b6cff',
    img: '/casestudy/project-one/cover.webp',
    video: '/casestudy/project-one/cover.mp4',
    internal: true,
    page: {
      oneLiner: 'One clear sentence that captures the project.',
      meta: {
        type: 'Product',
        industry: 'Consumer / Tech',
        whatWeDid: ['Product design', 'Interface and motion', 'Frontend Engineering'],
      },
      sections: [
        {
          kind: 'text',
          body: 'First paragraph describing the project, the problem it solves, and the approach taken.',
        },
        {
          kind: 'text',
          body: 'Second paragraph with more detail about the design decisions, challenges overcome, and outcomes.',
        },
      ],
    },
  },
  {
    slug: 'project-two',
    client: 'Project Two',
    title: 'Project Two',
    desc: 'Another compelling project — a B2B platform built from scratch.',
    tags: ['SaaS', 'B2B', 'UI/UX'],
    year: '2023',
    accent: '#6e7bff',
    img: '/casestudy/project-two/cover.webp',
    video: '/casestudy/project-two/cover.mp4',
    internal: true,
    page: {
      oneLiner: 'A second project that demonstrates range.',
      meta: {
        type: 'Platform',
        industry: 'SaaS / B2B',
        whatWeDid: ['UX Research', 'Product design', 'Design systems'],
      },
      sections: [
        {
          kind: 'text',
          body: 'Describe the platform, the users, and the design challenge.',
        },
      ],
    },
  },
  {
    slug: 'project-three',
    client: 'Project Three',
    title: 'Project Three',
    desc: 'A mobile-first experience with deep attention to detail.',
    tags: ['iOS', 'Product', 'Sound'],
    year: '2022',
    accent: '#e25a1c',
    img: '/casestudy/project-three/cover.webp',
    video: '/casestudy/project-three/cover.mp4',
    internal: true,
    page: {
      oneLiner: 'Mobile experience, designed from first principles.',
      meta: {
        type: 'Mobile App',
        industry: 'Consumer',
        whatWeDid: ['Product design', 'iOS', 'Motion design'],
      },
      sections: [
        {
          kind: 'text',
          body: 'Describe the iOS app, design philosophy, and outcome.',
        },
      ],
    },
  },
];

export const timeline = [
  {
    kind: 'work',
    when: '2020-2024',
    title: 'Your Company',
    role: 'Senior Product Designer',
    where: 'Your City, Country',
    note: 'Led product design for a suite of fintech products. Owned discovery through post-launch iteration, built the shared component library and design tokens, and mentored junior designers.',
    highlights: [
      'Led product design across 3 flagship products',
      'Built shared component library and design tokens',
      'Mentored 4 designers; aligned product, engineering and executives',
    ],
    color: '#8b6cff',
  },
  {
    kind: 'work',
    when: '2017-2020',
    title: 'Previous Company',
    role: 'Product Designer',
    where: 'Your City, Country',
    note: 'Designed enterprise and B2B digital products from concept through implementation. Scalable interface systems, reusable component libraries, and stakeholder work from opportunity definition to solution validation.',
    highlights: [
      'B2B platforms and enterprise products',
      'Scalable interface systems and component libraries',
      'Award for best digital innovation',
    ],
    color: '#6e7bff',
  },
  {
    kind: 'work',
    when: '2014-2017',
    title: 'Earlier Role',
    role: 'UX Designer',
    where: 'Your City, Country',
    note: 'User experience design for consumer and healthcare products. Full process, research, wireframing, prototyping and validation.',
    highlights: [
      'Consumer and healthcare UX',
      'Research → wireframes → prototypes → validation',
    ],
    color: '#3ec6ff',
  },
];

export const background = {
  education: 'BA in Design, Your University (City), validated internationally.',
  citizenshipsLabel: 'Citizenships',
  citizenships: 'Your Country',
  languagesLabel: 'Languages',
  languages: 'English, Your Language',
};
