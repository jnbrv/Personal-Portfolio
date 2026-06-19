/* ═══════════════════════════════════════════
   JOANA L. BRAVO — PORTFOLIO  |  script.js
═══════════════════════════════════════════ */

const $ = (s, ctx = document) => ctx.querySelector(s);
const $$ = (s, ctx = document) => [...ctx.querySelectorAll(s)];

/* ── Nav order ───────────────────────────── */
const NAV_ORDER = ['index.html','about.html','resume.html','projects.html','contact.html'];
function pageIndex(href) {
  const f = href.split('/').pop() || 'index.html';
  const i = NAV_ORDER.indexOf(f);
  return i === -1 ? 0 : i;
}
function currentPageIndex() {
  const f = location.pathname.split('/').pop() || 'index.html';
  return pageIndex(f);
}

/* ── Project image lists (hardcoded) ─────── */
const PROJECT_DATA = {
  svs: {
    label: 'SVS Korean Beauty Salon Management System',
    images: [
      'images/beauty_salon/appointments.png',
      'images/beauty_salon/dashboard.png',
      'images/beauty_salon/profile.png',
      'images/beauty_salon/reviews.png',
      'images/beauty_salon/services.png',
      'images/beauty_salon/signup.png',
      'images/beauty_salon/stylist.png',
      'images/beauty_salon/svs - landing page.png',
      'images/beauty_salon/svs_landingpage.png',
      'images/beauty_salon/svs_landingpage(1).png',
      'images/beauty_salon/svs_login.png',
    ]
  },
  procook: {
    label: 'PRO COOK',
    images: [
      'images/procook/procook-admin.png',
      'images/procook/procook-admindashboard.png',
      'images/procook/procook-coderequest.png',
      'images/procook/procook-forgotpassword.png',
      'images/procook/procook-login.png',
      'images/procook/procook-recipeverification.png',
      'images/procook/procook-report.png',
      'images/procook/procook-signup.png',
      'images/procook/procook-usermanagement.png',
      'images/procook/procook.png',
      'images/procook/procook1.png',
      'images/procook/procook2.png',
      'images/procook/procook3.png',
      'images/procook/procook4.png',
      'images/procook/procook5.png',
      'images/procook/procook6.png',
      'images/procook/procook7.png',
    ]
  },
  nestnova: {
    label: 'NESTNOVA',
    images: [
      'images/nestnova/landing page.png',
      'images/nestnova/postingAProperty.png',
      'images/nestnova/saveListing.png',
      'images/nestnova/searchProperty.png',
    ]
  },
  canteen: {
    label: 'Canteen Food Ordering System',
    images: [
      'images/canteen/12.png',
      'images/canteen/adobo.png',
      'images/canteen/Checkout (2).png',
      'images/canteen/Checkout (3).png',
      'images/canteen/Checkout.png',
      'images/canteen/confirmation.png',
      'images/canteen/DASHBOARD.png',
      'images/canteen/food dashboard.png',
      'images/canteen/LOGIN.png',
      'images/canteen/Sign up (2).png',
      'images/canteen/Sign up (3).png',
      'images/canteen/Sign up.png',
    ]
  },
  yume: {
    label: 'yUM-e: Online Food Ordering System',
    images: [
      'images/yum-e/interface.png',
      'images/yum-e/login.png',
      'images/yum-e/yum-e_admin.png',
      'images/yum-e/yum-e_inventory.png',
    ]
  },
  pneumonia: {
    label: 'Pneumonia Classification System',
    images: []
  }
};

/* ── 1. PAGE SLIDE TRANSITIONS ───────────── */
function initTransitions() {
  const wrapper = $('.page-wrapper');
  if (!wrapper) return;
  bindPageLinks();
  const dir = sessionStorage.getItem('navDirection');
  if (dir === 'back') document.body.classList.add('going-back');
  sessionStorage.removeItem('navDirection');
}

function bindPageLinks() {
  $$('.nav-link, .page-link').forEach(link => {
    if (link._bound) return;
    link._bound = true;
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('http') ||
          href.startsWith('mailto') || href.startsWith('tel')) return;
      e.preventDefault();
      const goingBack = pageIndex(href) < currentPageIndex();
      const wrapper   = $('.page-wrapper');
      if (wrapper) wrapper.classList.add(goingBack ? 'slide-exit-right' : 'slide-exit-left');
      sessionStorage.setItem('navDirection', goingBack ? 'back' : 'forward');
      setTimeout(() => { window.location.href = href; }, 360);
    });
  });
}

/* ── 2. SCROLL REVEAL ────────────────────── */
function initReveal() {
  const els = $$('.reveal, .reveal-left, .reveal-right');
  if (!els.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        $$('.skill-fill', entry.target).forEach(animateBar);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.13, rootMargin: '0px 0px -32px 0px' });
  els.forEach(el => obs.observe(el));
}

/* ── 3. SKILL BARS ───────────────────────── */
function animateBar(bar) {
  requestAnimationFrame(() => { bar.style.width = (bar.dataset.width || 0) + '%'; });
}
function initSkillBars() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        $$('.skill-fill', entry.target).forEach(animateBar);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  $$('.skill-bar-list').forEach(el => obs.observe(el));
}

/* ── 4. NAV SHRINK ───────────────────────── */
function initNavShrink() {
  const nav = $('.nav-wrapper');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.style.top = window.scrollY > 50 ? '8px' : '16px';
  }, { passive: true });
}

/* ── 5. HERO PARALLAX ────────────────────── */
function initHeroParallax() {
  const hero = $('.hero-section');
  if (!hero) return;
  hero.addEventListener('mousemove', e => {
    const r = hero.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width  - 0.5;
    const y = (e.clientY - r.top)  / r.height - 0.5;
    const photo = $('.hero-photo-wrap', hero);
    if (photo) photo.style.transform = `translate(${x * -10}px, ${y * -10}px)`;
    $$('.hero-deco', hero).forEach((d, i) => {
      d.style.transform = `translate(${x*(i+1)*12}px, ${y*(i+1)*12}px)`;
    });
  });
  hero.addEventListener('mouseleave', () => {
    const photo = $('.hero-photo-wrap', hero);
    if (photo) photo.style.transform = '';
    $$('.hero-deco', hero).forEach(d => d.style.transform = '');
  });
}

/* ── 6. CARD TILT ────────────────────────── */
function initCardTilt() {
  $$('.proj-card, .project-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width  - 0.5) * 10;
      const y = ((e.clientY - r.top)  / r.height - 0.5) * -10;
      card.style.transform = `translateY(-6px) rotateX(${y}deg) rotateY(${x}deg)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
}

/* ── 7. TICKER ───────────────────────────── */
function initTicker() {
  const inner = $('.ticker-inner');
  if (!inner) return;
  inner.addEventListener('mouseenter', () => inner.style.animationPlayState = 'paused');
  inner.addEventListener('mouseleave', () => inner.style.animationPlayState = 'running');
}

/* ── 8. CONTACT FORM ─────────────────────── */
function initContactForm() {
  const form = $('#contact-form');
  if (!form) return;
  const status = $('#form-status');
  const shakeStyle = document.createElement('style');
  shakeStyle.textContent = `@keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-8px)}40%{transform:translateX(8px)}60%{transform:translateX(-5px)}80%{transform:translateX(5px)}}`;
  document.head.appendChild(shakeStyle);

  form.addEventListener('submit', e => {
    e.preventDefault();
    const name  = $('#cf-name').value.trim();
    const email = $('#cf-email').value.trim();
    const msg   = $('#cf-msg').value.trim();
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
    btn.innerHTML = 'Sending… <i class="fa-solid fa-spinner fa-spin"></i>';
    btn.disabled = true;
    setTimeout(() => {
      setStatus('Message sent! 🎉 I\'ll get back to you soon.', 'success');
      form.reset();
      btn.innerHTML = 'Send Message <i class="fa-solid fa-paper-plane"></i>';
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

/* ── 9. GALLERY MODAL ────────────────────── */
function initGalleryModal() {
  const modal    = $('#gallery-modal');
  const closeBtn = $('#gallery-close');
  const titleEl  = $('#gallery-title');
  const gridEl   = $('#gallery-grid');
  const emptyEl  = $('#gallery-empty');
  if (!modal) return;

  $$('[data-project]').forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => openGallery(card.dataset.project));
  });

  function openGallery(key) {
    const data = PROJECT_DATA[key];
    if (!data) return;
    titleEl.textContent   = data.label;
    gridEl.innerHTML      = '';
    emptyEl.style.display = 'none';

    if (!data.images.length) {
      emptyEl.style.display = 'block';
    } else {
      data.images.forEach(src => {
        const img = document.createElement('img');
        img.src     = src;
        img.alt     = data.label;
        img.loading = 'lazy';
        img.addEventListener('click', () => openLightbox(src, data.label));
        img.onerror = () => img.remove();
        gridEl.appendChild(img);
      });
    }

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  closeBtn && closeBtn.addEventListener('click', closeGallery);
  modal.addEventListener('click', e => { if (e.target === modal) closeGallery(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeGallery(); closeCertModal(); closeLightbox(); }
  });

  function closeGallery() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
}

/* ── 10. IMAGE LIGHTBOX ──────────────────── */
function openLightbox(src, alt) {
  let lb = $('#img-lightbox');
  if (!lb) {
    lb = document.createElement('div');
    lb.id = 'img-lightbox';
    lb.innerHTML = `<div class="lb-inner"><button class="lb-close" aria-label="Close"><i class="fa-solid fa-xmark"></i></button><img src="" alt="" /></div>`;
    document.body.appendChild(lb);
    const s = document.createElement('style');
    s.textContent = `
      #img-lightbox{position:fixed;inset:0;background:rgba(0,0,0,.92);z-index:9999;display:flex;align-items:center;justify-content:center;opacity:0;pointer-events:none;transition:opacity .3s ease;padding:24px;}
      #img-lightbox.open{opacity:1;pointer-events:all;}
      .lb-inner{position:relative;max-width:92vw;max-height:92vh;}
      .lb-inner img{max-width:100%;max-height:88vh;border-radius:12px;box-shadow:0 24px 80px rgba(0,0,0,.6);display:block;}
      .lb-close{position:absolute;top:-18px;right:-18px;width:40px;height:40px;border-radius:50%;background:#fff;border:none;font-size:1.1rem;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,.3);}
    `;
    document.head.appendChild(s);
    lb.addEventListener('click', e => { if (e.target === lb) closeLightbox(); });
    lb.querySelector('.lb-close').addEventListener('click', closeLightbox);
  }
  lb.querySelector('img').src = src;
  lb.querySelector('img').alt = alt;
  lb.classList.add('open');
}
function closeLightbox() {
  const lb = $('#img-lightbox');
  if (lb) lb.classList.remove('open');
}

/* ── 11. CERT PDF MODAL ──────────────────── */
function initCertModal() {
  const modal    = $('#cert-modal');
  const closeBtn = $('#cert-modal-close');
  const iframe   = $('#cert-iframe');
  if (!modal || !iframe) return;

  $$('[data-pdf]').forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => {
      iframe.src = card.dataset.pdf;
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  closeBtn && closeBtn.addEventListener('click', closeCertModal);
  modal.addEventListener('click', e => { if (e.target === modal) closeCertModal(); });
}
function closeCertModal() {
  const modal  = $('#cert-modal');
  const iframe = $('#cert-iframe');
  if (modal)  modal.classList.remove('open');
  if (iframe) iframe.src = '';
  document.body.style.overflow = '';
}

/* ── INIT ────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initTransitions();
  initReveal();
  initSkillBars();
  initNavShrink();
  initHeroParallax();
  initCardTilt();
  initTicker();
  initContactForm();
  initGalleryModal();
  initCertModal();
});
