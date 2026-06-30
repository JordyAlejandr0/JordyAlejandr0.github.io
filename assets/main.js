/* ── THUMBNAIL FALLBACK ─────────────────────────────────── */
document.querySelectorAll('.ratio-v .project-bg').forEach(el => {
  const style = el.getAttribute('style') || '';
  // Skip local images
  if (!style.includes('img.youtube.com')) return;
  const match = style.match(/vi\/([^/]+)\/maxresdefault/);
  if (!match) return;
  const id = match[1];
  const img = new Image();
  img.onload = () => { if (img.naturalWidth <= 120) tryFallback(el, id); };
  img.onerror = () => tryFallback(el, id);
  img.src = `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
});

function tryFallback(el, id) {
  const img2 = new Image();
  img2.onload = () => { el.style.backgroundImage = `url('https://img.youtube.com/vi/${id}/hqdefault.jpg')`; };
  img2.onerror = () => { el.style.backgroundImage = 'linear-gradient(135deg, #111 0%, #1a1a1a 100%)'; };
  img2.src = `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
}

/* ── CURSOR ─────────────────────────────────────────────── */
const dot = document.getElementById('cursorDot');
let mx = 0, my = 0, cx = 0, cy = 0;

document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

(function loop() {
  cx += (mx - cx) * .18;
  cy += (my - cy) * .18;
  dot.style.left = cx + 'px';
  dot.style.top  = cy + 'px';
  requestAnimationFrame(loop);
})();

document.querySelectorAll('[data-project]').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('on-project'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('on-project'));
});
document.querySelectorAll('a, button').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('on-link'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('on-link'));
});

/* ── LOADER ─────────────────────────────────────────────── */
setTimeout(() => {
  const l = document.getElementById('loader');
  l.classList.add('out');
  setTimeout(() => { l.style.display = 'none'; }, 700);
}, 3200);

/* ── LANGUAGE SWITCH ────────────────────────────────────── */
let currentLang = 'es';

function setLang(lang) {
  currentLang = lang;
  document.querySelectorAll('[data-es][data-en]').forEach(el => {
    const val = el.getAttribute('data-' + lang);
    if (val !== null) el.innerHTML = val;
  });
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.textContent.trim().toLowerCase() === lang);
  });
  document.documentElement.lang = lang;
}

/* ── VIDEO MODAL ────────────────────────────────────────── */
function openVideo(id, label) {
  document.getElementById('modalFrame').src =
    'https://www.youtube.com/embed/' + id + '?autoplay=1&modestbranding=1&rel=0&color=white';
  document.getElementById('modalLabel').textContent = label;
  document.getElementById('modal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modal').classList.remove('open');
  document.getElementById('modalFrame').src = '';
  document.body.style.overflow = '';
}

document.getElementById('modal').addEventListener('click', function(e) {
  if (e.target === this) closeModal();
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// Wire up play buttons
document.querySelectorAll('[data-project]').forEach(card => {
  const btn = card.querySelector('.play-btn');
  if (!btn) return;
  btn.addEventListener('click', e => {
    e.stopPropagation();
    const id    = card.dataset.yt;
    const label = card.querySelector('.project-name')?.textContent || '';
    openVideo(id, label);
  });
});

/* ── MOBILE MENU ────────────────────────────────────────── */
function toggleMobileMenu() {
  document.getElementById('mobileMenu').classList.toggle('open');
}
function closeMobileMenu() {
  document.getElementById('mobileMenu').classList.remove('open');
}

/* ── NAV SCROLL ─────────────────────────────────────────── */
window.addEventListener('scroll', () => {
  document.getElementById('nav').classList.toggle('scrolled', window.scrollY > 80);
}, { passive: true });

/* ── SCROLL REVEAL ──────────────────────────────────────── */
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: .08 });

document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
