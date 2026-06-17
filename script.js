/* ═══════════════════════════════════════════
   JOANA L. BRAVO — PORTFOLIO
   script.js  |  Shared across all pages
═══════════════════════════════════════════ */

// ─── Utilities ───────────────────────────────
const $ = (s, ctx = document) => ctx.querySelector(s);
const $$ = (s, ctx = document) => [...ctx.querySelectorAll(s)];

// ─── Nav order for slide direction ───────────
const NAV_ORDER = ['index.html', 'about.html', 'resume.html', 'projects.html', 'contact.html'];

function pageIndex(href) {
  const file = href.split('/').pop() || 'index.html';
  const idx  = NAV_ORDER.indexOf(file);
  return idx === -1 ? 0 : idx;
}

function currentPageIndex() {
  const file = location.pathname.split('/').pop() || 'index.html';
  return pageIndex(file);
}

// ─── 1. PAGE SLIDE TRANSITIONS ───────────────
function initTransitions() {
  const wrapper = $('.page-wrapper');
  if (!wrapper) return;

  // Mark active nav link
  const currentFile = location.pathname.split('/').pop() || 'index.html';
  $$('.nav-link').forEach(link => {
    const href = link.getAttribute('href').split('/').pop();
    if (href === currentFile || (currentFile === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // Intercept nav clicks
  $$('.nav-link, .page-link').forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('http')) return;

      e.preventDefault();
      const destIdx = pageIndex(href);
      const currIdx = currentPageIndex();
      const goingBack = destIdx < currIdx;

      // Exit animation
      if (goingBack) {
        wrapper.classList.add('slide-exit-right');
      } else {
        wrapper.classList.add('slide-exit-left');
      }

      // Store direction for the incoming page
      sessionStorage.setItem('navDirection', goingBack ? 'back' : 'forward');

      setTimeout(() => { window.location.href = href; }, 360);
    });
  });

  // Apply enter direction
  const dir = sessionStorage.getItem('navDirection');
  if (dir === 'back') {
    document.body.classList.add('going-back');
  }
  sessionStorage.removeItem('navDirection');
}

// ─── 2. SCROLL REVEAL ────────────────────────
function initReveal() {
  const els = $$('.reveal, .reveal-left, .reveal-right');
  if (!els.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Trigger skill bars if present
        $$('.skill-fill', entry.target).forEach(bar => animateBar(bar));
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.13, rootMargin: '0px 0px -32px 0px' });

  els.forEach(el => obs.observe(el));
}

// ─── 3. SKILL BARS ───────────────────────────
function animateBar(bar) {
  const w = bar.dataset.width || '0';
  requestAnimationFrame(() => { bar.style.width = w + '%'; });
}

function initSkillBars() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        $$('.skill-fill', entry.target).forEach(bar => animateBar(bar));
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  $$('.skill-bar-list').forEach(el => obs.observe(el));
}

// ─── 4. NAV SHRINK ───────────────────────────
function initNavShrink() {
  const nav = $('.nav-wrapper');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.style.top = window.scrollY > 50 ? '8px' : '16px';
  }, { passive: true });
}

// ─── 5. ACTIVE NAV (single-page sections) ────
function initActiveSectionNav() {
  const links    = $$('.nav-link[data-section]');
  const sections = $$('section[id]');
  if (!links.length || !sections.length) return;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY + 120;
    let current = sections[0].id;
    sections.forEach(s => { if (s.offsetTop <= scrollY) current = s.id; });
    links.forEach(l => l.classList.toggle('active', l.dataset.section === current));
  }, { passive: true });
}

// ─── 6. HERO PARALLAX ────────────────────────
function initHeroParallax() {
  const hero = $('.hero-section');
  if (!hero) return;
  hero.addEventListener('mousemove', e => {
    const r = hero.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width  - 0.5;
    const y = (e.clientY - r.top)  / r.height - 0.5;
    const photo = $('.hero-photo-wrap', hero);
    const deco  = $$('.hero-deco', hero);
    if (photo) photo.style.transform = `translate(${x * -10}px, ${y * -10}px)`;
    deco.forEach((d, i) => { d.style.transform = `translate(${x * (i+1) * 12}px, ${y * (i+1) * 12}px)`; });
  });
  hero.addEventListener('mouseleave', () => {
    const photo = $('.hero-photo-wrap', hero);
    if (photo) photo.style.transform = '';
    $$('.hero-deco', hero).forEach(d => d.style.transform = '');
  });
}

// ─── 7. PROJECT CARD TILT ────────────────────
function initCardTilt() {
  $$('.project-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width  - 0.5) * 10;
      const y = ((e.clientY - r.top)  / r.height - 0.5) * -10;
      card.style.transform = `translateY(-6px) rotateX(${y}deg) rotateY(${x}deg)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
}

// ─── 8. TICKER PAUSE ─────────────────────────
function initTicker() {
  const inner = $('.ticker-inner');
  if (!inner) return;
  inner.addEventListener('mouseenter', () => inner.style.animationPlayState = 'paused');
  inner.addEventListener('mouseleave', () => inner.style.animationPlayState = 'running');
}

// ─── 9. CONTACT FORM ─────────────────────────
function initContactForm() {
  const form = $('#contact-form');
  if (!form) return;
  const status = $('#form-status');

  // Inject shake keyframe once
  const s = document.createElement('style');
  s.textContent = `@keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-8px)}40%{transform:translateX(8px)}60%{transform:translateX(-5px)}80%{transform:translateX(5px)}}`;
  document.head.appendChild(s);

  form.addEventListener('submit', e => {
    e.preventDefault();
    const name  = form.querySelector('#cf-name').value.trim();
    const email = form.querySelector('#cf-email').value.trim();
    const msg   = form.querySelector('#cf-msg').value.trim();

    if (!name || !email || !msg) {
      setStatus('Please fill in your name, email, and message.', 'error');
      form.style.animation = 'shake 0.4s ease';
      form.addEventListener('animationend', () => { form.style.animation = ''; }, { once: true });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus('Please enter a valid email address.', 'error');
      return;
    }

    const btn = form.querySelector('button[type="submit"]');
    btn.textContent = 'Sending…';
    btn.disabled = true;

    setTimeout(() => {
      setStatus('Message sent! 🎉 I\'ll get back to you soon.', 'success');
      form.reset();
      btn.textContent = 'Send Message ↗';
      btn.disabled = false;
    }, 1400);
  });

  function setStatus(msg, type) {
    if (!status) return;
    status.textContent = msg;
    status.className = 'form-note ' + type;
    setTimeout(() => { status.textContent = ''; status.className = 'form-note'; }, 5000);
  }
}

// ─── 10. CERT LIGHTBOX ───────────────────────
function initCertLightbox() {
  const items = $$('.cert-card[data-src]');
  if (!items.length) return;

  const overlay = document.createElement('div');
  overlay.id = 'lightbox';
  overlay.innerHTML = `<div class="lb-inner"><button class="lb-close" aria-label="Close">✕</button><img src="" alt="Certificate" /></div>`;
  document.body.appendChild(overlay);

  const lbImg = overlay.querySelector('img');

  items.forEach(item => {
    item.style.cursor = 'zoom-in';
    item.addEventListener('click', () => {
      lbImg.src = item.dataset.src;
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  overlay.addEventListener('click', e => {
    if (e.target === overlay || e.target.classList.contains('lb-close')) closeLb();
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLb(); });

  function closeLb() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  // Inject lightbox styles
  const s = document.createElement('style');
  s.textContent = `
    #lightbox{position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:9999;display:flex;align-items:center;justify-content:center;opacity:0;pointer-events:none;transition:opacity .3s ease;}
    #lightbox.open{opacity:1;pointer-events:all;}
    .lb-inner{position:relative;max-width:90vw;max-height:90vh;}
    .lb-inner img{max-width:100%;max-height:88vh;border-radius:12px;box-shadow:0 24px 80px rgba(0,0,0,.6);}
    .lb-close{position:absolute;top:-16px;right:-16px;width:36px;height:36px;border-radius:50%;background:#fff;border:none;font-size:1rem;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,.3);}
  `;
  document.head.appendChild(s);
}

// ─── INIT ─────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initTransitions();
  initReveal();
  initSkillBars();
  initNavShrink();
  initActiveSectionNav();
  initHeroParallax();
  initCardTilt();
  initTicker();
  initContactForm();
  initCertLightbox();
});
