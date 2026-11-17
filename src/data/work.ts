/**
 * Everything that appears in a video grid — the home page's "Recent work" row
 * and the Work page's category sections read from here, so a reel only ever
 * has to be described once.
 */

export type Reel = {
  /** Category label printed above the title on the tile. */
  tag: string;
  title: string;
  /** Permalink the modal's call-to-action opens in a new tab. */
  href: string;
  /**
   * Short muted clip for tiles that loop in place (home page only). Optional:
   * reels pulled straight from a post have no separate cut, and the Work page
   * shows a still either way. A tile in preview mode falls back to the poster.
   */
  preview?: string;
  /** Full-quality file the modal plays with sound. */
  full: string;
  /** Still frame — the thumbnail on the Work page, and the modal's poster. */
  poster: string;
  aspect: 'landscape' | 'portrait';
};

/**
 * A reel we hold no file for — the modal loads Instagram's own player instead.
 * Two caveats against a local `Reel`:
 *   · the post must be public. A private account renders "the link may be
 *     broken" inside the frame, for us and for every visitor.
 *   · Instagram will not autoplay a cross-origin embed, so the visitor taps
 *     play once inside the frame.
 * Prefer a local `Reel` whenever we have the file.
 */
export type EmbedReel = {
  tag: string;
  title: string;
  href: string;
  /** The shortcode out of the permalink: instagram.com/reel/<postId>/ */
  postId: string;
  poster: string;
  aspect: 'landscape' | 'portrait';
};

/**
 * A slot whose files have not landed yet. It renders as a dashed placeholder
 * so the grid keeps its shape; swap it for a full `Reel` once the video is cut
 * and the tile starts working with no other change.
 */
export type PendingReel = {
  pending: true;
  tag: string;
  title: string;
};

export type WorkItem = Reel | EmbedReel | PendingReel;

export const isPending = (item: WorkItem): item is PendingReel => 'pending' in item;

export const isEmbed = (item: WorkItem): item is EmbedReel => 'postId' in item;

/** Television commercials — the long-form spots, most recent first. */
export const tvCommercials: WorkItem[] = [
  {
    tag: 'Television Commercial',
    title: 'Every Brand Has a Soul',
    href: 'https://www.instagram.com/reel/Daavj7ZvLgd/?igsh=cDk1dnNtbXQ2ejVi',
    preview: '/assets/reels/brand-film-preview.mp4',
    full: '/assets/reels/brand-film.mp4',
    poster: '/assets/reels/brand-film-poster.jpg',
    aspect: 'landscape',
  },
  {
    tag: 'Television Commercial',
    title: 'Le Client',
    href: 'https://www.instagram.com/reel/DAtPFqShxuw/?igsh=MXQ5ZDFjc2sxcWN2ZA==',
    preview: '/assets/reels/le-client-preview.mp4',
    full: '/assets/reels/le-client.mp4',
    poster: '/assets/reels/le-client-poster.jpg',
    aspect: 'portrait',
  },
  {
    /* No file we can host — plays through Instagram's embed. */
    tag: 'Television Commercial',
    title: 'Skye Holidays',
    href: 'https://www.instagram.com/reel/DVWI4_Fk__r/',
    postId: 'DVWI4_Fk__r',
    poster: '/assets/reels/skye-poster.jpg',
    aspect: 'portrait',
  },
  {
    /* No file we can host — plays through Instagram's embed. */
    tag: 'Television Commercial',
    title: 'Aster Women & Children',
    href: 'https://www.instagram.com/reel/DDUND2Oz1k3/',
    postId: 'DDUND2Oz1k3',
    poster: '/assets/reels/aster-poster.jpg',
    aspect: 'portrait',
  },
];

/** Most recent first. */
export const socialAds: WorkItem[] = [
  {
    /* No file we can host — plays through Instagram's embed. */
    tag: 'Social Media Ad',
    title: 'Skye Holidays — Onam Offer',
    href: 'https://www.instagram.com/reel/DOI-F5WlJA-/',
    postId: 'DOI-F5WlJA-',
    poster: '/assets/reels/skye-onam-poster.jpg',
    aspect: 'portrait',
  },
  {
    /* No file we can host — plays through Instagram's embed. */
    tag: 'Social Media Ad',
    title: 'Mahima Counselling',
    href: 'https://www.instagram.com/reel/DSZ3WtbCLU7/',
    postId: 'DSZ3WtbCLU7',
    poster: '/assets/reels/mahima-poster.jpg',
    aspect: 'portrait',
  },
  {
    /* No file we can host — plays through Instagram's embed. */
    tag: 'Social Media Ad',
    title: 'Manappuram MaSkill',
    href: 'https://www.instagram.com/reel/DOYhLjoD3-L/',
    postId: 'DOYhLjoD3-L',
    poster: '/assets/reels/maskill-poster.jpg',
    aspect: 'portrait',
  },
  {
    tag: 'Social Media Ad',
    title: 'Autostarke Energy',
    href: 'https://www.instagram.com/reel/DUdL9gdDxE0/',
    full: '/assets/reels/autostarke.mp4',
    poster: '/assets/reels/autostarke-poster.jpg',
    aspect: 'portrait',
  },
  {
    tag: 'Food & Product Shoot',
    title: 'Hearts and Plates',
    href: 'https://www.instagram.com/reel/DSFP1Lrkd74/?igsh=N2l1anVxZDBpeWIw',
    preview: '/assets/reels/hearts-and-plates-preview.mp4',
    full: '/assets/reels/hearts-and-plates.mp4',
    poster: '/assets/reels/hearts-and-plates-poster.jpg',
    aspect: 'portrait',
  },
  {
    /* No file we can host — plays through Instagram's embed. */
    tag: 'Social Reel',
    title: 'Athira Suresh',
    href: 'https://www.instagram.com/reel/DSfM6VCj4U8/',
    postId: 'DSfM6VCj4U8',
    poster: '/assets/reels/ml-athira-poster.jpg',
    aspect: 'portrait',
  },
  {
    /* No file we can host — plays through Instagram's embed. */
    tag: 'Social Media Ad',
    title: 'Skye Holidays — Dream Holiday',
    href: 'https://www.instagram.com/reel/DPN8QY4CvSt/',
    postId: 'DPN8QY4CvSt',
    poster: '/assets/reels/skye-dream-holiday-poster.jpg',
    aspect: 'portrait',
  },
  {
    /* Cut from the master; no post link yet, so the modal's button opens
       our profile. Swap `href` for the reel's permalink once there is one. */
    tag: 'Social Media Ad',
    title: 'Ather — Women’s Day',
    href: 'https://www.instagram.com/magic__lantern_/',
    full: '/assets/reels/ather-womens-day.mp4',
    poster: '/assets/reels/ather-womens-day-poster.jpg',
    aspect: 'portrait',
  },
  {
    /* No file we can host — plays through Instagram's embed. */
    tag: 'Social Media Ad',
    title: 'Ather Rizta',
    href: 'https://www.instagram.com/reel/Da7XGsOvJ5b/',
    postId: 'Da7XGsOvJ5b',
    poster: '/assets/reels/ather-rizta-poster.jpg',
    aspect: 'portrait',
  },
  {
    tag: 'Social Media Ad',
    title: 'Fides Eye Care',
    href: 'https://www.instagram.com/reel/DU2ZyPYgWKo/',
    full: '/assets/reels/fides.mp4',
    poster: '/assets/reels/fides-poster.jpg',
    aspect: 'portrait',
  },
  {
    tag: 'Brand Teaser',
    title: 'Bini Heritage',
    href: 'https://www.instagram.com/reel/C_TSoAyhVZ5/',
    full: '/assets/reels/bini-heritage.mp4',
    poster: '/assets/reels/bini-heritage-poster.jpg',
    aspect: 'landscape',
  },
  {
    tag: 'Commercial',
    title: 'Onyx TVC',
    href: 'https://www.instagram.com/reel/C74coDrBVn4/',
    full: '/assets/reels/onyx-tvc.mp4',
    poster: '/assets/reels/onyx-tvc-poster.jpg',
    aspect: 'portrait',
  },
  {
    tag: 'Food Ad',
    title: 'Fish Curry Meals',
    href: 'https://www.instagram.com/reel/DG6Dq2BS0gS/',
    full: '/assets/reels/fish-curry-meals.mp4',
    poster: '/assets/reels/fish-curry-meals-poster.jpg',
    aspect: 'portrait',
  },
  {
    /* Instagram only served a 360x640 cut of this one — re-export from the
       master if it needs to stand next to the others at full resolution. */
    tag: 'Food Ad',
    title: 'Reshmi Kabab',
    href: 'https://www.instagram.com/reel/C-Kb1NahUd9/',
    full: '/assets/reels/reshmi-kabab.mp4',
    poster: '/assets/reels/reshmi-kabab-poster.jpg',
    aspect: 'portrait',
  },
  /* No file we can host — the post carries no inline player, only a link
     out — so it runs through Instagram's embed. Export the cut and it becomes
     a plain `full`/`poster` entry like the rest. */
  {
    tag: 'Food Ad',
    title: 'Karimeen Fry',
    href: 'https://www.instagram.com/reel/C9uoJ9mBrcP/',
    postId: 'C9uoJ9mBrcP',
    poster: '/assets/reels/karimeen-fry-poster.jpg',
    aspect: 'portrait',
  },
];

/**
 * AI video work. To publish another, drop its `.mp4` and `-poster.jpg` into
 * `/public/assets/ai-video/` and add an entry with the same shape as the first
 * one below.
 */
export const aiVideos: WorkItem[] = [
  {
    tag: 'AI Video Production',
    title: 'Poorakkatha',
    href: 'https://www.instagram.com/reel/DJLtblrPayd/',
    full: '/assets/ai-video/poorakkatha.mp4',
    poster: '/assets/ai-video/poorakkatha-poster.jpg',
    aspect: 'portrait',
  },
  {
    /* No file of our own yet, so this one plays through Instagram's embed. */
    tag: 'AI Video Production',
    title: 'Ambiswami Catering',
    href: 'https://www.instagram.com/reel/DcaXPWxv-1v/',
    postId: 'DcaXPWxv-1v',
    poster: '/assets/ai-video/ambiswami-poster.jpg',
    aspect: 'landscape',
  },
];

/**
 * The four-episode Onam campaign for Ather, in release order. These play
 * through Instagram's embed, so the posts have to stay public. The masters
 * are 200–300 MB each; cut a web version into `/public/assets/ather-onam/`
 * and an entry becomes a plain `full`/`poster` reel like the rest.
 */
export const atherOnam: WorkItem[] = [
  {
    tag: 'Onam Campaign',
    title: 'Ather — Episode 1',
    href: 'https://www.instagram.com/reel/DcV7pGSPI2S/',
    postId: 'DcV7pGSPI2S',
    poster: '/assets/ather-onam/episode-01-poster.jpg',
    aspect: 'portrait',
  },
  {
    tag: 'Onam Campaign',
    title: 'Ather — Episode 2',
    href: 'https://www.instagram.com/reel/DcY_3drv5cp/',
    postId: 'DcY_3drv5cp',
    poster: '/assets/ather-onam/episode-02-poster.jpg',
    aspect: 'portrait',
  },
  {
    tag: 'Onam Campaign',
    title: 'Ather — Episode 3',
    href: 'https://www.instagram.com/reel/DcdwFJEvkBu/',
    postId: 'DcdwFJEvkBu',
    poster: '/assets/ather-onam/episode-03-poster.jpg',
    aspect: 'portrait',
  },
  {
    tag: 'Onam Campaign',
    title: 'Ather — Episode 4',
    href: 'https://www.instagram.com/reel/Dcfz01MPIu7/',
    postId: 'Dcfz01MPIu7',
    poster: '/assets/ather-onam/episode-04-poster.jpg',
    aspect: 'portrait',
  },
];

/**
 * The home page's "Recent work" row: the first three reels, television
 * commercials first, that have a `preview` cut to loop in place.
 */
export const recentWork: WorkItem[] = [...tvCommercials, ...socialAds]
  .filter((item) => 'preview' in item && !!item.preview)
  .slice(0, 3);
