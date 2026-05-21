/* ============================================================
   THINKWILD STUDIOS — Script
   ============================================================ */

// ===== NAV THEME (dark/light based on current section) =====
const nav = document.getElementById('nav');
const navSections = document.querySelectorAll('[data-nav]');

function updateNavTheme() {
  const scrollY = window.scrollY + 1;
  let currentTheme = 'dark';

  navSections.forEach(section => {
    const top = section.offsetTop;
    if (scrollY >= top) {
      currentTheme = section.dataset.nav;
    }
  });

  if (currentTheme === 'light') {
    nav.classList.add('is-light');
  } else {
    nav.classList.remove('is-light');
  }
}

window.addEventListener('scroll', updateNavTheme, { passive: true });
updateNavTheme();

// ===== MOBILE MENU =====
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
let menuOpen = false;

function toggleMenu(open) {
  menuOpen = open;
  hamburger.classList.toggle('is-open', open);
  mobileMenu.classList.toggle('is-open', open);
  hamburger.setAttribute('aria-expanded', String(open));
  mobileMenu.setAttribute('aria-hidden', String(!open));
  document.body.style.overflow = open ? 'hidden' : '';
}

hamburger.addEventListener('click', () => toggleMenu(!menuOpen));

document.querySelectorAll('.mobile-menu__link').forEach(link => {
  link.addEventListener('click', () => toggleMenu(false));
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && menuOpen) toggleMenu(false);
});

// ===== SCROLL REVEAL =====
const reveals = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -48px 0px'
});

reveals.forEach(el => revealObserver.observe(el));

// ===== STAT COUNT-UP =====
function countUp(el) {
  const target = parseInt(el.dataset.count, 10);
  const suffix = el.dataset.suffix || '';
  const duration = 2400;
  const start = performance.now();

  function tick(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target) + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat__num[data-count]').forEach(countUp);
      statObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });

document.querySelectorAll('.manifesto__stats').forEach(el => statObserver.observe(el));

// ===== IMAGE LIGHTBOX =====
(function () {
  const galleryImgs = Array.from(document.querySelectorAll('.proj-gallery__item img'));
  if (!galleryImgs.length) return;

  // Build DOM
  const lb = document.createElement('div');
  lb.className = 'img-lightbox';
  lb.setAttribute('aria-hidden', 'true');
  lb.innerHTML = `
    <div class="img-lightbox__backdrop"></div>
    <div class="img-lightbox__frame">
      <img class="img-lightbox__img" src="" alt="">
    </div>
    <button class="img-lightbox__close" aria-label="Close">
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M1 1L17 17M17 1L1 17" stroke="currentColor" stroke-width="1.5"/>
      </svg>
    </button>
    <button class="img-lightbox__prev" aria-label="Previous">&#8592;</button>
    <button class="img-lightbox__next" aria-label="Next">&#8594;</button>
    <div class="img-lightbox__counter"></div>
  `;
  document.body.appendChild(lb);

  const lbImg     = lb.querySelector('.img-lightbox__img');
  const lbCounter = lb.querySelector('.img-lightbox__counter');
  let current = 0;

  function show(index) {
    current = (index + galleryImgs.length) % galleryImgs.length;
    const src = galleryImgs[current].src;
    lbImg.src = src;
    lbImg.alt = galleryImgs[current].alt;
    lbCounter.textContent = (current + 1) + ' / ' + galleryImgs.length;
  }

  function open(index) {
    show(index);
    lb.classList.add('is-open');
    lb.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    lb.classList.remove('is-open');
    lb.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  galleryImgs.forEach((img, i) => {
    img.parentElement.addEventListener('click', () => open(i));
  });

  lb.querySelector('.img-lightbox__backdrop').addEventListener('click', close);
  lb.querySelector('.img-lightbox__close').addEventListener('click', close);
  lb.querySelector('.img-lightbox__prev').addEventListener('click', () => show(current - 1));
  lb.querySelector('.img-lightbox__next').addEventListener('click', () => show(current + 1));

  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('is-open')) return;
    if (e.key === 'Escape')      close();
    if (e.key === 'ArrowLeft')   show(current - 1);
    if (e.key === 'ArrowRight')  show(current + 1);
  });
})();

// ===== REEL LIGHTBOX =====
const reelBtn = document.getElementById('reelBtn');
const reelModal = document.getElementById('reelModal');
const reelFrame = document.getElementById('reelFrame');
const reelClose = document.getElementById('reelClose');
const reelBackdrop = document.getElementById('reelBackdrop');
const REEL_SRC = 'https://player.vimeo.com/video/1190169628?autoplay=1&title=0&byline=0&portrait=0';

function openReel() {
  reelFrame.src = REEL_SRC;
  reelModal.classList.add('is-open');
  reelModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeReel() {
  reelModal.classList.remove('is-open');
  reelModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  // Delay src clear so the fade-out plays before video stops
  setTimeout(() => { reelFrame.src = ''; }, 350);
}

if (reelBtn) {
  reelBtn.addEventListener('click', openReel);
  reelClose.addEventListener('click', closeReel);
  reelBackdrop.addEventListener('click', closeReel);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && reelModal.classList.contains('is-open')) closeReel();
  });
}

// ===== PROJECTS FILTER + SEARCH — multi-category, AND-combined =====
(function initProjectsFilter() {
  const buttons = document.querySelectorAll('.filter-btn');
  const cards   = document.querySelectorAll('.projects-grid .proj');
  if (!buttons.length || !cards.length) return;

  const search   = document.getElementById('projectsSearch');
  const clearBtn = document.querySelector('.projects-search__clear');
  const grid     = document.querySelector('.projects-grid__inner');

  let activeFilter = 'all';
  let query = '';

  // Pre-compute a lowercased search corpus per card (tag + client + name + cats + slug)
  const corpus = new Map();
  cards.forEach(card => {
    const text = (card.textContent || '').replace(/\s+/g, ' ').trim();
    const cats = card.dataset.category || '';
    const link = card.querySelector('a');
    const href = link ? link.getAttribute('href') || '' : '';
    const slug = href.replace(/^.*\//, '').replace(/\.html$/, '').replace(/-/g, ' ');
    corpus.set(card, (text + ' ' + cats + ' ' + slug).toLowerCase());
  });

  // Empty state node (lives inside the grid so it spans all columns)
  let empty = null;
  if (grid) {
    empty = document.createElement('div');
    empty.className = 'projects-empty';
    empty.innerHTML = 'No projects matched. Try a <em>different</em> search or category.';
    empty.hidden = true;
    grid.appendChild(empty);
  }

  function apply() {
    let visible = 0;
    cards.forEach(card => {
      const cats = (card.dataset.category || '').split(/\s+/);
      const filterMatch = activeFilter === 'all' || cats.includes(activeFilter);
      const text = corpus.get(card) || '';
      const queryMatch = !query || text.includes(query);
      const show = filterMatch && queryMatch;
      card.style.display = show ? '' : 'none';
      if (show) visible++;
    });
    if (empty) empty.hidden = visible > 0;
    if (clearBtn) clearBtn.hidden = !query;
  }

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      activeFilter = btn.dataset.filter;
      apply();
    });
  });

  if (search) {
    search.addEventListener('input', () => {
      query = search.value.trim().toLowerCase();
      apply();
    });
    search.addEventListener('keydown', e => {
      if (e.key === 'Escape' && query) {
        search.value = '';
        query = '';
        apply();
      }
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (search) { search.value = ''; search.focus(); }
      query = '';
      apply();
    });
  }
})();

// ===== LOGO MARQUEE — fill & clone for seamless infinite scroll =====
function setupLogoMarquee() {
  const tracks = document.querySelectorAll('.logo-row__track');
  if (!tracks.length) return;

  const viewportW = window.innerWidth;
  const minInnerW = viewportW * 1.1 + 100;

  tracks.forEach(track => {
    if (!track.dataset.pillTemplate) {
      const firstInner = track.querySelector('.logo-row__inner');
      if (!firstInner) return;
      track.dataset.pillTemplate = firstInner.innerHTML;
    }

    // Pause animation while we rebuild
    const prevAnim = track.style.animation;
    track.style.animation = 'none';

    // Reset: source inner with the original pill set
    track.innerHTML = '';
    const source = document.createElement('div');
    source.className = 'logo-row__inner';
    source.innerHTML = track.dataset.pillTemplate;
    track.appendChild(source);

    const originalPills = Array.from(source.children);
    if (!originalPills.length) return;

    // Pre-clone: always tile the original set 3 more times so the source
    // is wide enough on any typical viewport regardless of measurement timing.
    for (let n = 0; n < 3; n++) {
      originalPills.forEach(pill => source.appendChild(pill.cloneNode(true)));
    }

    // Force a reflow so offsetWidth is accurate
    void source.offsetWidth;

    // For ultra-wide screens, keep adding sets until source > viewport buffer
    let safety = 0;
    while (source.offsetWidth < minInnerW && safety < 30) {
      originalPills.forEach(pill => source.appendChild(pill.cloneNode(true)));
      safety++;
    }

    // Duplicate source once — the -50% transform now loops seamlessly
    const clone = source.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    track.appendChild(clone);

    // Resume animation
    void track.offsetWidth;
    track.style.animation = prevAnim;
  });
}

// Run after images are loaded so scrollWidth is accurate
if (document.readyState === 'complete') {
  setupLogoMarquee();
} else {
  window.addEventListener('load', setupLogoMarquee);
}

// Only rebuild on actual WIDTH changes. iOS Safari fires resize when
// the address bar collapses/expands (height-only change) — rebuilding
// the marquee mid-scroll caused the 2nd row to flicker / mis-render.
let logoResizeTimer;
let lastLogoViewportW = window.innerWidth;
window.addEventListener('resize', () => {
  if (window.innerWidth === lastLogoViewportW) return;
  lastLogoViewportW = window.innerWidth;
  clearTimeout(logoResizeTimer);
  logoResizeTimer = setTimeout(setupLogoMarquee, 200);
});

// ===== SMOOTH ANCHOR SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 68;
    const top = target.getBoundingClientRect().top + window.scrollY - navH;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});
