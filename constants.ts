import { NavItem, Project, Award } from './types';

export const NAV_ITEMS: NavItem[] = [
  { label: 'ABOUT', href: '#about' },
  { label: 'WORK', href: '#work' },
  { label: 'CONTACT', href: '#contact' },
];

export const PROJECTS: Project[] = [
  {
    id: '01',
    code: '#3VVA-0000/34',
    title: 'ECLIPSE PROTOCOL',
    category: 'WEBGL EXPERIMENT',
    // Replaced with a placeholder matching the visual description. 
    // To use your specific uploaded file, place it in public/ and change this string to the filename (e.g. '/my-image.png')
    image: '/IMG-20251214-WA0005.jpg',
  },
  {
    id: '02',
    code: '#9XRF-1120/88',
    title: 'NEURAL SYMPHONY',
    category: 'IMMERSIVE AUDIO',
    image: 'https://picsum.photos/800/601?grayscale',
  },
  {
    id: '03',
    code: '#7BBA-9090/12',
    title: 'VOID WALKER',
    category: 'E-COMMERCE',
    image: 'https://picsum.photos/800/602?grayscale',
  },
  {
    id: '04',
    code: '#1AAB-3344/55',
    title: 'CHROMATIC ABERRATION',
    category: 'DIGITAL ART',
    image: 'https://picsum.photos/800/603?grayscale',
  },
];

export const AWARDS: Award[] = [
  { title: 'AWWWARDS', count: 16, description: 'SITE OF THE DAY' },
  { title: 'FWA', count: 4, description: 'SITE OF THE DAY' },
  { title: 'CSSDA', count: 18, description: 'WEBSITE OF THE DAY' },
];