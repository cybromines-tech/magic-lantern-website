/**
 * The team roster.
 *
 * Photos live in /public/assets/team and are keyed by `slug`:
 *   m01 -> /assets/team/m01.webp (780x1040) + m01-sm.webp (390x520)
 *
 * This array is the whole roster — the page reads everything from here.
 * Reordering rows reorders the grid, and the 01..NN index on the cards
 * renumbers itself.
 *
 * Source files, in case a photo needs recropping:
 *   m01 IMG-20260815-WA0222   m02 IMG-20260814-WA0194   m03 IMG_0970
 *   m04 IMG-20260814-WA0065   m05 file_0000…f2a476      m06 IMG-20260814-WA0184
 *   m07 b1a607ca-…d91d        m08 IMG_3501              m09 IMG_9335-01
 *   m10 IMG_1362              m11 IMG-20240914-WA0111
 *   crew IMG-20230719-WA0008 (the group shot in the closing band)
 */

export type Member = {
  /** Filename stem in /public/assets/team. */
  slug: string;
  name: string;
  /** Designation, shown under the name. */
  role: string;
};

/* Runs back-to-front against the source folder: the last photo leads the grid
   and the first one closes it, so the slugs count down. */
export const team: Member[] = [
  { slug: 'm11', name: 'Gokul Babu', role: 'Founder · CEO' },
  { slug: 'm10', name: 'Gokul Nandan', role: 'Co-Founder · Managing Director' },
  { slug: 'm09', name: 'Sarang Sangeeth', role: 'Post Production Director' },
  { slug: 'm08', name: 'Vishnudev VD', role: 'Visualizer' },
  { slug: 'm07', name: 'Akash UP', role: 'Creative Producer' },
  { slug: 'm06', name: 'Arjun', role: 'Creative Producer' },
  { slug: 'm05', name: 'Rishikesh', role: 'Creative Director' },
  { slug: 'm04', name: 'Arjun Marar', role: 'Creative Director' },
  { slug: 'm03', name: 'Devanarayanan', role: 'Cinematographer' },
  { slug: 'm02', name: 'Devadas', role: 'Video Editor' },
  { slug: 'm01', name: 'Arun Jayaraj', role: 'Creative Director' },
];
