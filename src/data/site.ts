/** Single source of truth for anything that appears in more than one place. */

export const site = {
  name: 'Magic Lantern',
  legalName: 'Magic Lantern Entertainments',
  tagline: 'Media House · Video · Marketing',
  description:
    'Magic Lantern is a full-service media house — we script, shoot, design and market your brand from the very first idea to the final cut.',
  email: 'hello@magiclantern.studio',
  /* Placeholders carried over from the source template — swap for the real numbers. */
  phone: '+91 00000 00000',
  phoneHref: 'tel:+910000000000',
  whatsapp: 'https://wa.me/910000000000',
  address: 'Thrissur, Kerala · India',
  founded: 'Founded by students of Sree Kerala Varma College.',
} as const;

export type NavLink = {
  label: string;
  href: string;
  /** Matches the `active` key a page passes to <Nav>. */
  key: string;
  children?: { label: string; href: string }[];
};

export const services = [
  {
    num: '01',
    title: 'Branding',
    desc: 'Identity, graphic design and brand systems that make you unmistakable.',
    href: '/service-branding',
  },
  {
    num: '02',
    title: 'Digital Marketing',
    desc: 'SEO, social, content and paid campaigns driven by real data.',
    href: '/service-digital',
  },
  {
    num: '03',
    title: 'Website Development',
    desc: 'Responsive, fast, beautiful sites — from design to deployment.',
    href: '/service-web',
  },
  {
    num: '04',
    title: 'Video & Photoshoot',
    desc: 'Commercials, corporate films, product shoots and social reels.',
    href: '/service-video',
  },
] as const;

export const navLinks: NavLink[] = [
  { label: 'Home', href: '/', key: 'home' },
  { label: 'About', href: '/about', key: 'about' },
  {
    label: 'Services',
    href: '/services',
    key: 'services',
    children: services.map((s) => ({ label: s.title, href: s.href })),
  },
  { label: 'Work', href: '/portfolio', key: 'work' },
  { label: 'Team', href: '/team', key: 'team' },
];

export const socials = [
  { label: 'Ig', name: 'Instagram', href: '#' },
  { label: 'Yt', name: 'YouTube', href: '#' },
  { label: 'Fb', name: 'Facebook', href: '#' },
  { label: 'Be', name: 'Behance', href: '#' },
] as const;
