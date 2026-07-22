/**
 * Site-wide behaviour: fade page transitions, inertial scrolling,
 * scroll-triggered reveals and the animated stat counters.
 */

const reduceMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

/* -- Anti-flash reveal + cross-page fade ---------------------------------- */

function pageTransitions() {
  const ready = () => document.body?.classList.add('ml-ready');

  if (document.readyState !== 'loading') requestAnimationFrame(ready);
  else document.addEventListener('DOMContentLoaded', () => requestAnimationFrame(ready));
  window.addEventListener('load', ready);
  setTimeout(ready, 1200); // Failsafe: never leave the page invisible.

  // Restoring from bfcache re-shows a page we faded out on the way out.
  window.addEventListener('pageshow', (e) => {
    if (e.persisted) {
      document.body?.classList.remove('ml-leaving');
      ready();
    }
  });

  if (reduceMotion()) return;

  document.addEventListener(
    'click',
    (e) => {
      const target = e.target as Element | null;
      const link = target?.closest?.('a[href]') as HTMLAnchorElement | null;
      if (!link) return;

      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || link.target === '_blank') return;
      if (/^(https?:|mailto:|tel:)/.test(href)) return;
      // Modifier-clicks and middle-clicks must keep their native behaviour.
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || (e as MouseEvent).button !== 0) return;

      e.preventDefault();
      document.body.classList.remove('ml-ready');
      document.body.classList.add('ml-leaving');
      setTimeout(() => {
        window.location.href = href;
      }, 250);
    },
    true
  );
}

/* -- Inertial scrolling ---------------------------------------------------- */

async function smoothScroll() {
  if (reduceMotion()) return;

  const { default: Lenis } = await import('lenis');
  const lenis = new Lenis({
    duration: 1.05,
    smoothWheel: true,
    syncTouch: false,
    wheelMultiplier: 1,
    easing: (t: number) => 1 - Math.pow(1 - t, 3),
  });

  const raf = (time: number) => {
    lenis.raf(time);
    requestAnimationFrame(raf);
  };
  requestAnimationFrame(raf);

  document.addEventListener('click', (e) => {
    const target = e.target as Element | null;
    const link = target?.closest?.('a[href^="#"]') as HTMLAnchorElement | null;
    const hash = link?.getAttribute('href');
    if (!hash || hash.length < 2) return;
    const el = document.querySelector(hash);
    if (!el) return;
    e.preventDefault();
    lenis.scrollTo(el as HTMLElement, { offset: -80 });
  });
}

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

  targets.forEach((el) => io.observe(el));
}

pageTransitions();
reveals();
pauseOffscreenAnimations();
void smoothScroll();
