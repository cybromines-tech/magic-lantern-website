/**
 * Site-wide behaviour: scroll-triggered reveals and the animated stat
 * counters. Scrolling itself is native — the compositor owns it, so it stays
 * smooth even while the WebGL scene or page hydration is busy on the main
 * thread.
 *
 * Navigation is handled by Astro's <ClientRouter>, which swaps the document in
 * place. This module is a bundled script, so it evaluates exactly once for the
 * whole session — anything that must apply to each new page hangs off
 * `astro:page-load`, and anything bound to `window`/`document` is registered
 * once here because those objects survive a swap.
 */

const reduceMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

/* -- Anchor links ----------------------------------------------------------- */

/* The fixed-nav offset comes from `scroll-padding-top` in global.css, which
   applies to both this handler and native anchor jumps.
   Delegated on `document`, so it keeps working across page swaps. */
document.addEventListener('click', (e) => {
  const target = e.target as Element | null;
  const link = target?.closest?.('a[href^="#"]') as HTMLAnchorElement | null;
  const hash = link?.getAttribute('href');
  if (!hash || hash.length < 2) return;
  const el = document.querySelector(hash);
  if (!el) return;
  e.preventDefault();
  // scrollIntoView ignores prefers-reduced-motion on its own; honour it here.
  el.scrollIntoView({ behavior: reduceMotion() ? 'auto' : 'smooth' });
});

/* -- Reveals + stat counters ---------------------------------------------- */

function countUp(el: HTMLElement) {
  const raw = el.dataset.count ?? '';
  const target = parseInt(raw, 10) || 0;
  const suffix = raw.replace(/[0-9]/g, '');
  const duration = 1400;
  const t0 = performance.now();

  const step = (now: number) => {
    const p = Math.min((now - t0) / duration, 1);
    // Cubic ease-out: fast start, soft landing on the final number.
    el.textContent = Math.floor((1 - Math.pow(1 - p, 3)) * target) + suffix;
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

/**
 * countUp() overwrites textContent, so the [data-count] target must be the
 * leaf holding the number — never the revealed wrapper around it.
 */
function counterTargets(root: HTMLElement): HTMLElement[] {
  const targets = Array.from(root.querySelectorAll<HTMLElement>('[data-count]'));
  if (root.dataset.count) targets.push(root);
  return targets;
}

/** Observers belong to one page's DOM; they're torn down before the next swap. */
let observers: IntersectionObserver[] = [];

function reveals() {
  const items = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
  if (!items.length) return;

  if (reduceMotion() || !('IntersectionObserver' in window)) {
    items.forEach((el) => counterTargets(el).forEach(countUp));
    return;
  }

  const show = (el: HTMLElement, animate: boolean) => {
    if (!animate) el.style.transition = 'none';
    el.style.opacity = '1';
    el.style.transform = 'none';
    counterTargets(el).forEach(countUp);
  };

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target as HTMLElement;
        io.unobserve(el);
        show(el, true);
      }
    },
    {
      /* A small threshold plus a bottom rootMargin starts the reveal just
         before the element reaches the viewport, so it is already settled by
         the time it is properly on screen. A bare 0.18 threshold also never
         fires for anything taller than ~5x the viewport. */
      threshold: 0.01,
      rootMargin: '0px 0px -12% 0px',
    }
  );
  observers.push(io);

  requestAnimationFrame(() => {
    items.forEach((el, i) => {
      const rect = el.getBoundingClientRect();

      /* Anything already at or above the viewport on load — a reload restoring
         a mid-page scroll position, or a back-navigation — must not be hidden.
         It would stay blank until the visitor happened to scroll back up
         through it, which reads as an animation that never fired. */
      if (rect.top < window.innerHeight) {
        show(el, false);
        return;
      }

      // Stagger caps at 0.3s so long sections don't crawl in.
      const delay = Math.min(i * 0.05, 0.3);
      el.style.opacity = '0';
      el.style.transform = 'translateY(26px)';
      el.style.transition = `opacity .7s var(--ease-out) ${delay}s, transform .7s var(--ease-out) ${delay}s`;
      io.observe(el);
    });
  });
}

/**
 * Long-running CSS animations (the marquee) keep the compositor busy even when
 * scrolled far off screen. Pause them, and only promote them to their own layer
 * while they are actually visible.
 */
function pauseOffscreenAnimations() {
  const targets = document.querySelectorAll<HTMLElement>('[data-animate-in-view]');
  if (!targets.length || !('IntersectionObserver' in window)) return;

  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      const el = entry.target as HTMLElement;
      el.style.animationPlayState = entry.isIntersecting ? 'running' : 'paused';
      el.style.willChange = entry.isIntersecting ? 'transform' : 'auto';
    }
  });
  observers.push(io);

  targets.forEach((el) => io.observe(el));
}

/* -- Rotating payoff words -------------------------------------------------- */

/** Timers belong to one page's DOM; they're cleared before the next swap. */
let rotateTimers: number[] = [];

function wordRotators() {
  if (reduceMotion()) return; // The first word stays put.

  document.querySelectorAll<HTMLElement>('[data-rotate]').forEach((rotator) => {
    const words = Array.from(rotator.children) as HTMLElement[];
    if (words.length < 2) return;

    let index = 0;
    rotateTimers.push(
      window.setInterval(() => {
        const current = words[index]!;
        index = (index + 1) % words.length;
        const next = words[index]!;

        // Leave upward, so the incoming word appears to push the old one out.
        current.classList.remove('is-active');
        current.classList.add('is-leaving');
        rotateTimers.push(
          window.setTimeout(() => current.classList.remove('is-leaving'), 650)
        );
        next.classList.add('is-active');
      }, 3200)
    );
  });
}

/* -- Reel tiles + modal ---------------------------------------------------- */

/**
 * Drives every <VideoTile> and the single <ReelModal> on a page. Tiles in
 * `poster` mode hold nothing but an image, so the observers below simply find
 * no work to do — the cost is paid only by pages that loop previews in place.
 */

let previewObserver: IntersectionObserver | null = null;
let warmObserver: IntersectionObserver | null = null;

function reelModal(): HTMLElement | null {
  return document.querySelector<HTMLElement>('[data-reel-modal]');
}

function previews(): HTMLVideoElement[] {
  return Array.from(document.querySelectorAll<HTMLVideoElement>('[data-reel-open] video'));
}

/* Calling play() on a cold video mid-scroll stalls the main thread for the
   whole fetch + demuxer spin-up (measured at 0.4–1.2s per reel). Warm the
   pipeline while the tile is still far below the fold: start the fetch and
   run a muted play/pause so the decoder is initialised, making the
   on-screen play() a cheap resume. */
function warmPreview(video: HTMLVideoElement) {
  video.preload = 'auto';
  video
    .play()
    .then(() => {
      const rect = video.getBoundingClientRect();
      const onScreen = rect.bottom > 0 && rect.top < window.innerHeight;
      if (!onScreen) video.pause();
    })
    .catch(() => {});
}

/* Resumes only the previews that are actually in the viewport. */
function resumePreviews() {
  for (const video of previews()) {
    const rect = video.getBoundingClientRect();
    if (rect.bottom > 0 && rect.top < window.innerHeight) video.play().catch(() => {});
  }
}

function closeReel() {
  const modal = reelModal();
  if (!modal || modal.hidden) return;
  modal.hidden = true;
  document.documentElement.style.removeProperty('overflow');
  modal.querySelector<HTMLVideoElement>('video')?.pause();
  /* Dropping the src is the only way to stop an embed's audio — we cannot
     reach into a cross-origin frame to pause it. */
  const frame = modal.querySelector<HTMLIFrameElement>('[data-reel-frame]');
  if (frame) {
    frame.hidden = true;
    frame.removeAttribute('src');
    frame.style.removeProperty('height');
  }
  resumePreviews();
}

/**
 * Instagram's embed measures itself and posts the result to its parent — the
 * message its own embeds.js listens for. A landscape reel is far shorter than
 * a portrait one, so without this the frame keeps its fallback height and
 * leaves a white void under the video.
 */
window.addEventListener('message', (e) => {
  if (e.origin !== 'https://www.instagram.com') return;
  const frame = reelModal()?.querySelector<HTMLIFrameElement>('[data-reel-frame]');
  if (!frame || frame.hidden || e.source !== frame.contentWindow) return;

  let payload: unknown;
  try {
    payload = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
  } catch {
    return; // Not one of ours; Instagram posts other traffic through here too.
  }

  const message = payload as { type?: string; details?: { height?: unknown } };
  if (message?.type !== 'MEASURE') return;
  const height = Number(message.details?.height);
  if (!Number.isFinite(height) || height <= 0) return;
  /* Still capped, so a tall post cannot push the footer off screen. */
  frame.style.height = `min(${Math.ceil(height)}px, 74vh)`;
});

function openReel(tile: HTMLElement) {
  const modal = reelModal();
  if (!modal) return;
  const full = modal.querySelector<HTMLVideoElement>('video');
  const frame = modal.querySelector<HTMLIFrameElement>('[data-reel-frame]');
  if (!full) return;

  const { full: src, embed, poster, href, aspect, tag, title } = tile.dataset;
  modal.querySelector('[data-reel-tag]')!.textContent = tag ?? '';
  modal.querySelector('[data-reel-title]')!.textContent = title ?? '';
  modal.querySelector<HTMLAnchorElement>('[data-reel-link]')!.href = href ?? '#';

  const dialog = modal.querySelector('.reelModal__dialog')!;
  dialog.classList.toggle('reelModal__dialog--embed', !!embed);
  /* An embed brings its own chrome, so it gets its own dialog size rather
     than the portrait video one. */
  dialog.classList.toggle('reelModal__dialog--portrait', !embed && aspect === 'portrait');

  modal.hidden = false;
  document.documentElement.style.overflow = 'hidden';
  previews().forEach((v) => v.pause());

  if (embed) {
    full.pause();
    full.hidden = true;
    if (frame) {
      frame.hidden = false;
      /* Back to the CSS fallback until this post reports its own height. */
      frame.style.removeProperty('height');
      /* Instagram does not autoplay a cross-origin embed; the visitor taps
         play once inside the frame. */
      frame.src = `https://www.instagram.com/reel/${embed}/embed/`;
    }
    return;
  }

  if (frame) {
    frame.hidden = true;
    frame.removeAttribute('src');
  }
  full.hidden = false;

  if (full.getAttribute('src') !== src) {
    full.src = src ?? '';
    full.poster = poster ?? '';
  }

  full.currentTime = 0;
  full.muted = false;
  full.volume = 1;
  full.play().catch(() => {
    /* If the browser refuses sound-on playback, the controls are visible
       and one tap starts it. */
  });
}

/* Delegated on `document`, so these survive page swaps. */
document.addEventListener('click', (e) => {
  const target = e.target as Element | null;
  const tile = target?.closest?.('[data-reel-open]') as HTMLElement | null;
  if (tile) openReel(tile);
  else if (target?.closest?.('[data-reel-close]')) closeReel();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeReel();
});

function reelPreviews() {
  const items = previews();
  if (!items.length) return;

  /* Muted inline previews only run while their tile is actually on screen. */
  previewObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const video = entry.target as HTMLVideoElement;
        if (entry.isIntersecting && reelModal()?.hidden !== false) video.play().catch(() => {});
        else video.pause();
      }
    },
    { threshold: 0.25 }
  );
  items.forEach((v) => previewObserver!.observe(v));

  warmObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        warmObserver?.unobserve(entry.target);
        warmPreview(entry.target as HTMLVideoElement);
      }
    },
    /* Fires roughly a viewport-and-a-half before the tile is reached. */
    { rootMargin: '0px 0px 1400px 0px' }
  );
  items.forEach((v) => warmObserver!.observe(v));
}

/* -- Lifecycle ------------------------------------------------------------- */

// Fires on the first load and after every client-side navigation.
document.addEventListener('astro:page-load', () => {
  reveals();
  pauseOffscreenAnimations();
  wordRotators();
  reelPreviews();
});

document.addEventListener('astro:before-swap', () => {
  observers.forEach((io) => io.disconnect());
  observers = [];
  rotateTimers.forEach((id) => window.clearInterval(id));
  rotateTimers = [];
  previewObserver?.disconnect();
  previewObserver = null;
  warmObserver?.disconnect();
  warmObserver = null;
  /* The modal (and its scroll lock) must not survive into the next page. */
  closeReel();
});
