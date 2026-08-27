document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initTagFilter();
  initLikeButtons();
  initScrollReveal();
  initBackToTop();
});

function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle');
  if (!toggleBtn) return;

  const root = document.documentElement;
  const iconSpan = toggleBtn.querySelector('span');
  const saved = localStorage.getItem('jurnal-ngoding-theme');

  const applyTheme = (theme) => {
    root.setAttribute('data-theme', theme);
    const isDark = theme === 'dark';
    toggleBtn.setAttribute('aria-pressed', String(isDark));
    toggleBtn.setAttribute('aria-label', isDark ? 'Ganti ke mode terang' : 'Ganti ke mode gelap');
    if (iconSpan) iconSpan.textContent = isDark ? '☀️' : '🌙';
  };

  applyTheme(saved === 'dark' ? 'dark' : 'light');

  toggleBtn.addEventListener('click', () => {
    const current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem('jurnal-ngoding-theme', next);
  });
}

function initTagFilter() {
  const buttons = document.querySelectorAll('.filter-btn');
  const articles = document.querySelectorAll('#content article[data-tags]');
  const emptyState = document.getElementById('empty-state');
  if (!buttons.length || !articles.length) return;

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      buttons.forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');

      const filter = btn.dataset.filter;
      let visibleCount = 0;

      articles.forEach((article) => {
        const tags = (article.dataset.tags || '').split(' ');
        const show = filter === 'all' || tags.includes(filter);
        article.hidden = !show;
        if (show) visibleCount += 1;
      });

      if (emptyState) emptyState.hidden = visibleCount !== 0;
    });
  });
}

function initLikeButtons() {
  const likeButtons = document.querySelectorAll('.like-btn');
  if (!likeButtons.length) return;

  likeButtons.forEach((btn) => {
    const postId = btn.dataset.postId;
    const countEl = btn.querySelector('.like-count');
    const baseCount = parseInt(countEl.textContent, 10) || 0;
    const storageKey = `jurnal-ngoding-liked-${postId}`;
    const isLiked = localStorage.getItem(storageKey) === '1';

    const render = (liked) => {
      btn.classList.toggle('is-liked', liked);
      btn.setAttribute('aria-pressed', String(liked));
      countEl.textContent = String(baseCount + (liked ? 1 : 0));
    };

    render(isLiked);

    btn.addEventListener('click', () => {
      const nowLiked = !btn.classList.contains('is-liked');
      localStorage.setItem(storageKey, nowLiked ? '1' : '0');
      render(nowLiked);

      if (nowLiked) {
        btn.animate(
          [{ transform: 'scale(1)' }, { transform: 'scale(1.18)' }, { transform: 'scale(1)' }],
          { duration: 260, easing: 'ease-out' }
        );
      }
    });
  });
}

function initScrollReveal() {
  const targets = document.querySelectorAll('#content article, .profile-card, .side-box');
  if (!targets.length) return;

  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    targets.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  targets.forEach((el) => el.classList.add('reveal'));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  targets.forEach((el) => observer.observe(el));
}

function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  const toggleVisibility = () => {
    const shouldShow = window.scrollY > 320;
    btn.hidden = !shouldShow;
  };

  toggleVisibility();
  window.addEventListener('scroll', toggleVisibility, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
