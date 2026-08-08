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

/* -- Lifecycle ------------------------------------------------------------- */

// Fires on the first load and after every client-side navigation.
document.addEventListener('astro:page-load', () => {
  reveals();
  pauseOffscreenAnimations();
  wordRotators();
});

document.addEventListener('astro:before-swap', () => {
  observers.forEach((io) => io.disconnect());
  observers = [];
  rotateTimers.forEach((id) => window.clearInterval(id));
  rotateTimers = [];
});
