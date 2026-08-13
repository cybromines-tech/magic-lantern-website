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

/** Most recent first — the home page shows the top three. */
export const socialAds: WorkItem[] = [
  {
    tag: 'Social Reels',
    title: 'Every Brand Has a Soul',
    href: 'https://www.instagram.com/reel/Daavj7ZvLgd/?igsh=cDk1dnNtbXQ2ejVi',
    preview: '/assets/reels/brand-film-preview.mp4',
    full: '/assets/reels/brand-film.mp4',
    poster: '/assets/reels/brand-film-poster.jpg',
    aspect: 'landscape',
  },
  {
    tag: 'Video Production',
    title: 'Le Client',
    href: 'https://www.instagram.com/reel/DAtPFqShxuw/?igsh=MXQ5ZDFjc2sxcWN2ZA==',
    preview: '/assets/reels/le-client-preview.mp4',
    full: '/assets/reels/le-client.mp4',
    poster: '/assets/reels/le-client-poster.jpg',
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
    tag: 'Social Media Ad',
    title: 'Fides Eye Care',
    href: 'https://www.instagram.com/reel/DU2ZyPYgWKo/',
    full: '/assets/reels/fides.mp4',
    poster: '/assets/reels/fides-poster.jpg',
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
  /* The three below have no file we can host — their posts carry no inline
     player, only a link out — so they run through Instagram's embed. Export
     the cuts and they become plain `full`/`poster` entries like the rest. */
  {
    tag: 'Food Ad',
    title: 'Karimeen Fry',
    href: 'https://www.instagram.com/reel/C9uoJ9mBrcP/',
    postId: 'C9uoJ9mBrcP',
    poster: '/assets/reels/karimeen-fry-poster.jpg',
    aspect: 'portrait',
  },
  {
    tag: 'Social Media Ad',
    title: 'Skye Holidays',
    href: 'https://www.instagram.com/reel/DVWI4_Fk__r/',
    postId: 'DVWI4_Fk__r',
    poster: '/assets/reels/skye-poster.jpg',
    aspect: 'portrait',
  },
  {
    tag: 'Social Reel',
    title: 'Athira Suresh',
    href: 'https://www.instagram.com/reel/DSfM6VCj4U8/',
    postId: 'DSfM6VCj4U8',
    poster: '/assets/reels/ml-athira-poster.jpg',
    aspect: 'portrait',
  },
];

/**
 * AI video work. To publish another, drop its `.mp4` and `-poster.jpg` into
 * `/public/assets/ai-video/` and replace a placeholder with the same shape as
 * the first entry below.
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
  { pending: true, tag: 'AI Video Production', title: 'AI product spot' },
  { pending: true, tag: 'AI Video Production', title: 'Synthetic presenter ad' },
];
