import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ------------------------------------------------------------------
   Section theming: the page background travels Ivory → Pale → Forest
   as the visitor scrolls into sections marked with data-theme.
------------------------------------------------------------------- */
const THEMES: Record<string, string> = {
  light: '#F6F4EE',
  pale: '#E6EEE8',
  dark: '#073D32',
};

function applyTheme(name: string) {
  document.body.classList.toggle('is-dark', name === 'dark');
  gsap.to(document.body, {
    backgroundColor: THEMES[name] ?? THEMES.light,
    duration: reduced ? 0 : 0.8,
    ease: 'power2.out',
    overwrite: true,
  });
}

function initThemes() {
  document.querySelectorAll<HTMLElement>('[data-theme]').forEach((el) => {
    ScrollTrigger.create({
      trigger: el,
      start: 'top 55%',
      end: 'bottom 55%',
      onToggle: (self) => self.isActive && applyTheme(el.dataset.theme!),
    });
  });
}

/* ------------------------------------------------------------------
   Loader & page transitions: the equity-node mark assembles, then the
   forest curtain lifts. Internal navigation drops it again before leaving.
------------------------------------------------------------------- */
const curtain = document.querySelector<HTMLElement>('[data-curtain]');
let markReady: () => void;
/** Resolves when the curtain has started lifting; use it to start intro motion. */
export const pageReady = new Promise<void>((r) => (markReady = r));

if (curtain) {
  curtain.style.animation = 'none'; // JS is alive: disable the CSS failsafe
  if (reduced) {
    curtain.style.display = 'none';
    markReady!();
  } else {
    const firstVisit = !sessionStorageGet('uems:seen');
    sessionStorageSet('uems:seen', '1');
    const tl = gsap.timeline({ onComplete: () => (curtain.style.display = 'none') });
    if (firstVisit) {
      tl.from(curtain.querySelectorAll('.c-node'), { scale: 0, duration: 0.5, stagger: 0.08, ease: 'back.out(2.5)' })
        .from(curtain.querySelectorAll('.c-edge'), { strokeDashoffset: 280, duration: 0.8, ease: 'power2.inOut' }, 0.1)
        .from(curtain.querySelector('.c-hub'), { scale: 0, duration: 0.7, ease: 'elastic.out(1,0.5)' }, 0.35)
        .from(curtain.querySelector('.curtain__word'), { opacity: 0, y: 8, duration: 0.5 }, 0.4)
        .to({}, { duration: 0.15 });
    } else {
      tl.to({}, { duration: 0.15 });
    }
    tl.add(() => markReady!())
      .to(curtain, { yPercent: -100, duration: 0.9, ease: 'expo.inOut' });
  }

  const leave = (href: string) => {
    curtain.style.display = 'flex';
    gsap.fromTo(
      curtain,
      { yPercent: 100 },
      { yPercent: 0, duration: 0.6, ease: 'expo.inOut', onComplete: () => void (window.location.href = href) },
    );
  };

  document.addEventListener('click', (e) => {
    if (reduced || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = (e.target as HTMLElement).closest('a');
    if (!a || a.target || a.hasAttribute('download')) return;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin || url.pathname === location.pathname) return;
    e.preventDefault();
    leave(url.href);
  });

  // Back/forward cache restores the page with the curtain down, so lift it.
  window.addEventListener('pageshow', (e) => {
    if (e.persisted) gsap.set(curtain, { display: 'none', yPercent: -100 });
  });
}

function sessionStorageGet(k: string) {
  try {
    return sessionStorage.getItem(k);
  } catch {
    return null;
  }
}
function sessionStorageSet(k: string, v: string) {
  try {
    sessionStorage.setItem(k, v);
  } catch {
    /* storage unavailable, so the loader simply plays every time */
  }
}

/* ------------------------------------------------------------------
   Nav: hide on scroll down, reveal on scroll up
------------------------------------------------------------------- */
const navEl = document.querySelector<HTMLElement>('[data-nav]');
let lastY = 0;
window.addEventListener(
  'scroll',
  () => {
    const y = window.scrollY;
    navEl?.classList.toggle('is-hidden', y > lastY && y > 200);
    lastY = y;
  },
  { passive: true },
);

/* ------------------------------------------------------------------
   Mobile menu
------------------------------------------------------------------- */
const toggle = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
const menu = document.querySelector<HTMLElement>('[data-menu]');
function setMenu(open: boolean) {
  if (!toggle || !menu) return;
  toggle.setAttribute('aria-expanded', String(open));
  menu.hidden = !open;
  document.body.style.overflow = open ? 'hidden' : '';
  if (open && !reduced) {
    gsap.from(menu.querySelectorAll('a'), {
      yPercent: 60,
      opacity: 0,
      stagger: 0.06,
      duration: 0.7,
      ease: 'expo.out',
    });
  }
}
toggle?.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
menu?.querySelectorAll('[data-menu-link]').forEach((a) => a.addEventListener('click', () => setMenu(false)));

/* ------------------------------------------------------------------
   Custom cursor with contextual labels (data-cursor="EXPLORE →")
------------------------------------------------------------------- */
const cursor = document.querySelector<HTMLElement>('[data-cursor-el]');
const label = document.querySelector<HTMLElement>('[data-cursor-label]');
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

if (cursor && label && finePointer && !reduced) {
  document.documentElement.classList.add('has-cursor');
  document.body.classList.add('has-cursor');
  const ring = cursor.querySelector('.cursor__ring')!;
  const dot = cursor.querySelector('.cursor__dot')!;
  const rx = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power3.out' });
  const ry = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power3.out' });
  const dx = gsap.quickTo(dot, 'x', { duration: 0.08 });
  const dy = gsap.quickTo(dot, 'y', { duration: 0.08 });

  window.addEventListener('pointermove', (e) => {
    cursor.classList.add('is-live');
    rx(e.clientX);
    ry(e.clientY);
    dx(e.clientX);
    dy(e.clientY);
  });

  const setLabel = (text: string | null) => {
    cursor.classList.toggle('is-label', !!text);
    if (text) label.textContent = text;
  };

  document.addEventListener('pointerover', (e) => {
    const t = (e.target as HTMLElement).closest<HTMLElement>('[data-cursor]');
    setLabel(t ? t.dataset.cursor! : null);
  });
  // Components (e.g. the canvas network) can set labels directly.
  window.addEventListener('uems:cursor', (e) => setLabel((e as CustomEvent<string | null>).detail));
}

/* ------------------------------------------------------------------
   Line-by-line headline reveals: <h2 data-reveal> with .split-line>span
   and simple fade-ups on [data-fade]
------------------------------------------------------------------- */
function initReveals() {
  if (reduced) return;
  document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
    gsap.from(el.querySelectorAll('.split-line > span'), {
      yPercent: 110,
      duration: 1.2,
      ease: 'expo.out',
      stagger: 0.08,
      scrollTrigger: { trigger: el, start: 'top 85%' },
    });
  });

  document.querySelectorAll<HTMLElement>('[data-fade]').forEach((el) => {
    gsap.from(el, {
      y: 36,
      opacity: 0,
      duration: 1.1,
      ease: 'expo.out',
      delay: Number(el.dataset.fade) || 0,
      scrollTrigger: { trigger: el, start: 'top 88%' },
    });
  });
}

/* ScrollTriggers refresh in creation order, so page-wide triggers are created
   only after every component has set up its pinned sections (module scripts
   all run before DOMContentLoaded). */
function initPageTriggers() {
  initThemes();
  initReveals();
  ScrollTrigger.refresh();
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initPageTriggers);
else setTimeout(initPageTriggers, 0);
window.addEventListener('load', () => ScrollTrigger.refresh());
document.fonts?.ready.then(() => ScrollTrigger.refresh());
