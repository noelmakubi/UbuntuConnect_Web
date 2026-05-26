// ========== DARK MODE ==========
function getPreferredTheme() {
  const stored = localStorage.getItem('theme');
  if (stored) return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  document.querySelectorAll('.theme-toggle svg').forEach(svg => {
    if (theme === 'dark') {
      svg.innerHTML = '<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>';
    } else {
      svg.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>';
    }
  });
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.classList.add('transitioning');
  setTheme(next);
  setTimeout(() => document.documentElement.classList.remove('transitioning'), 300);
}

const initialTheme = getPreferredTheme();
setTheme(initialTheme);

// ========== INIT I18N ==========
initI18n();

// ========== NAVBAR SCROLL EFFECT ==========
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  if (currentScroll > 100) {
    navbar.style.boxShadow = isDark ? '0 4px 24px rgba(0, 0, 0, 0.4)' : '0 4px 24px rgba(0, 0, 0, 0.08)';
  } else {
    navbar.style.boxShadow = 'none';
  }
  lastScroll = currentScroll;
});

// ========== COUNT UP ANIMATION ==========
function animateCountUp() {
  const counters = document.querySelectorAll('.count-up');
  const speed = 50;

  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-target'));
    const increment = Math.ceil(target / 30);
    let current = 0;

    const updateCount = () => {
      current += increment;
      if (current > target) {
        counter.textContent = target.toLocaleString();
        return;
      }
      counter.textContent = current.toLocaleString() + '+';
      requestAnimationFrame(updateCount);
    };

    updateCount();
  });
}

// ========== INTERSECTION OBSERVER ==========
const observerOptions = {
  threshold: 0.3,
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      if (entry.target.classList.contains('about-stats')) {
        animateCountUp();
      }
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

document.querySelectorAll('.feature-card, .stat, .about-content').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = '0.6s cubic-bezier(0.4, 0, 0.2, 1)';
  observer.observe(el);
});

document.querySelector('.about-stats') && observer.observe(document.querySelector('.about-stats'));

// ========== MODAL ==========
function downloadApk(e) {
  e.preventDefault();
  document.getElementById('apk-modal').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('apk-modal').classList.remove('active');
  document.body.style.overflow = '';
}

// Close modal on backdrop click
document.getElementById('apk-modal').addEventListener('click', (e) => {
  if (e.target === document.getElementById('apk-modal')) {
    closeModal();
  }
});

// Close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

function handleDownload(e) {
  e.preventDefault();
  const email = document.getElementById('email-input').value;
  // In production, send this to your backend to email the APK link
  alert(`Download link will be sent to ${email}`);
  closeModal();
}

function directDownload(e) {
  e.preventDefault();
  // In production, point this to the actual APK file
  alert('APK download started!');
  closeModal();
}

// ========== SMOOTH SCROLL FOR NAV LINKS ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
