/* ── ZEBA MANSOORI — main.js v4 ──────────── */
document.addEventListener('DOMContentLoaded', () => {

  /* ── SMOOTH SCROLL (Lenis-style CSS approach) ─ */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ── NAV SCROLL ─────────────────────────── */
  const nav = document.getElementById('nav');
  const bt  = document.getElementById('bt');
  let ticking = false;

  const onScroll = () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const y = window.scrollY;
        if (nav) nav.classList.toggle('sc', y > 50);
        if (bt)  bt.classList.toggle('show', y > 600);
        ticking = false;
      });
      ticking = true;
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  if (bt) bt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ── MOBILE MENU ────────────────────────── */
  const ham    = document.getElementById('ham');
  const mob    = document.getElementById('mob');
  const mclose = document.getElementById('mclose');
  const closeMenu = () => {
    if (mob) { mob.classList.remove('open'); document.body.style.overflow = ''; }
  };
  if (ham && mob) {
    ham.addEventListener('click', () => { mob.classList.add('open'); document.body.style.overflow = 'hidden'; });
    if (mclose) mclose.addEventListener('click', closeMenu);
    mob.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  }

  /* ── ACTIVE NAV ─────────────────────────── */
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mob-nav a').forEach(a => {
    const href = a.getAttribute('href');
    if (href && (href === path || href.endsWith(path))) a.classList.add('active');
  });

  /* ── SCROLL REVEAL (IntersectionObserver) ─ */
  const revObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        revObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.05, rootMargin: '0px 0px -30px 0px' });

  document.querySelectorAll('.rev').forEach(el => revObs.observe(el));

  /* ── STAGGER GROUPS ──────────────────────── */
  // Auto-stagger child cards inside grid containers
  document.querySelectorAll(
    '.svc-grid, .agents-grid, .why-grid, .del-grid, .pricing-grid, .skills-grid, .val-grid, .facts, .cways'
  ).forEach(grid => {
    grid.querySelectorAll('.rev:not([class*="d1"]):not([class*="d2"]):not([class*="d3"])').forEach((el, i) => {
      if (!el.classList.contains('d1') && !el.classList.contains('d2') && !el.classList.contains('d3')) {
        el.style.transitionDelay = (i * 0.08) + 's';
      }
    });
  });

  /* ── CARD HOVER GLOW (cursor follow) ────── */
  document.querySelectorAll('.svc-card, .pcard, .agent-card, .why-item, .del-item, .price-card, .val-item, .skill-cat, .cs-stat').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mx', x + '%');
      card.style.setProperty('--my', y + '%');
    });
  });

  /* ── FAQ ────────────────────────────────── */
  document.querySelectorAll('.faq-q').forEach(q => {
    q.addEventListener('click', () => {
      const item   = q.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  /* ── CONTACT FORM ───────────────────────── */
  const form    = document.getElementById('contactForm');
  const sbtn    = document.getElementById('submitBtn');
  const success = document.getElementById('formSuccess');
  const errBox  = document.getElementById('formError');
  const formCon = document.getElementById('formContainer');

  if (form && sbtn) {
    form.addEventListener('submit', async e => {
      e.preventDefault();
      if (errBox) errBox.style.display = 'none';

      const name    = document.getElementById('inputName')?.value.trim();
      const phone   = document.getElementById('inputPhone')?.value.trim();
      const email   = document.getElementById('inputEmail')?.value.trim();
      const message = document.getElementById('inputMessage')?.value.trim();

      if (!name || !phone || !email || !message) {
        if (errBox) { errBox.textContent = 'Please fill all required fields.'; errBox.style.display = 'block'; }
        return;
      }

      sbtn.textContent = 'Sending…'; sbtn.disabled = true;

      try {
        const res = await fetch(form.action, {
          method: 'POST', body: new FormData(form), headers: { 'Accept': 'application/json' }
        });
        if (res.ok) {
          if (formCon) formCon.style.display = 'none';
          if (success) success.style.display = 'block';
        } else throw new Error();
      } catch {
        if (errBox) {
          errBox.innerHTML = 'Something went wrong. Please <a href="https://wa.me/918595882978" style="color:#06b6d4;text-decoration:underline">WhatsApp me</a> directly.';
          errBox.style.display = 'block';
        }
        sbtn.textContent = 'Send Message →'; sbtn.disabled = false;
      }
    });
  }

  /* ── MARQUEE PAUSE ON HOVER ─────────────── */
  const mtrack = document.querySelector('.m-track');
  if (mtrack) {
    mtrack.addEventListener('mouseenter', () => mtrack.style.animationPlayState = 'paused');
    mtrack.addEventListener('mouseleave', () => mtrack.style.animationPlayState = 'running');
  }

  /* ── TYPING EFFECT ON HERO ───────────────── */
  const heroTags = document.getElementById('heroTagline');
  if (heroTags) {
    const phrases = ['Web Design · AI Agents · SEO', 'Mobile-First · Fast · Modern', 'Coaching Institutes · More Admissions'];
    let pi = 0, ci = 0, del = false;
    const tick = () => {
      const cur = phrases[pi];
      if (!del) {
        heroTags.textContent = cur.slice(0, ++ci);
        if (ci === cur.length) { del = true; setTimeout(tick, 2200); return; }
      } else {
        heroTags.textContent = cur.slice(0, --ci);
        if (ci === 0) { del = false; pi = (pi + 1) % phrases.length; }
      }
      setTimeout(tick, del ? 40 : 70);
    };
    setTimeout(tick, 1000);
  }

});

/* ── CUSTOM CURSOR ─────────────────────── */
const cursorDot = document.getElementById('cursorDot');
if (cursorDot) {
  document.addEventListener('mousemove', e => {
    cursorDot.style.transform = `translate(${e.clientX - 5}px, ${e.clientY - 5}px)`;
  });
  document.querySelectorAll('a, button, .price-btn, .hero-btn-primary, .hero-btn-secondary').forEach(el => {
    el.addEventListener('mouseenter', () => cursorDot.classList.add('hovered'));
    el.addEventListener('mouseleave', () => cursorDot.classList.remove('hovered'));
  });
}

/* ── VIDEO / PHOTO LOGIC ─────────────── */
const heroVideo = document.getElementById('heroVideo');
const heroFallback = document.getElementById('heroFallbackImg');
if (heroVideo) {
  heroVideo.addEventListener('canplay', () => {
    heroVideo.style.display = 'block';
    if (heroFallback) heroFallback.style.display = 'none';
  });
  heroVideo.addEventListener('error', () => {
    heroVideo.style.display = 'none';
    if (heroFallback) heroFallback.style.display = 'block';
  });
}

/* ── HERO TYPING ─────────────────────── */
const tagEl = document.querySelector('.hero-roles');
// keep static, looks cleaner for cinematic style
