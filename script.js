// =============================================
//  FRAKES METHOD CONSULTING — script.js
// =============================================

// --- NAV SCROLL EFFECT ---
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
});

// --- MOBILE NAV ---
const hamburger = document.getElementById('hamburger');
const navMobile = document.getElementById('nav-mobile');
hamburger.addEventListener('click', () => {
  navMobile.classList.toggle('open');
});
navMobile.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navMobile.classList.remove('open'));
});

// --- SMOOTH SCROLL ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// --- SCROLL REVEAL ---
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// --- CHECKBOX VISUAL TOGGLE ---
document.querySelectorAll('.checkbox-item input[type="checkbox"]').forEach(cb => {
  cb.addEventListener('change', function() {
    const item = this.closest('.checkbox-item');
    if (this.checked) {
      item.style.borderColor = 'rgba(37,99,235,0.5)';
      item.style.background = 'rgba(37,99,235,0.12)';
    } else {
      item.style.borderColor = '';
      item.style.background = '';
    }
  });
});

// --- MULTI-STEP FORM ---
let currentStep = 1;
const totalSteps = 5;

function updateProgress(step) {
  document.querySelectorAll('.form-step-tab').forEach((tab, idx) => {
    const tabStep = idx + 1;
    tab.classList.remove('active', 'completed');
    if (tabStep === step) tab.classList.add('active');
    else if (tabStep < step) tab.classList.add('completed');
  });
}

function showStep(step) {
  document.querySelectorAll('.form-section').forEach(sec => sec.classList.remove('active'));
  const target = document.querySelector(`.form-section[data-section="${step}"]`);
  if (target) target.classList.add('active');
  updateProgress(step);
  currentStep = step;
  const formWrap = document.querySelector('.intake-form-wrap');
  if (formWrap) formWrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function nextStep(fromStep) {
  const section = document.querySelector(`.form-section[data-section="${fromStep}"]`);
  const required = section.querySelectorAll('[required]');
  let valid = true;
  required.forEach(field => {
    if (!field.value.trim()) {
      field.style.borderColor = 'rgba(239,68,68,0.6)';
      field.style.boxShadow = '0 0 0 3px rgba(239,68,68,0.12)';
      valid = false;
      field.addEventListener('input', () => {
        field.style.borderColor = '';
        field.style.boxShadow = '';
      }, { once: true });
    }
  });
  if (!valid) return;
  if (fromStep < totalSteps) showStep(fromStep + 1);
}

function prevStep(fromStep) {
  if (fromStep > 1) showStep(fromStep - 1);
}

// --- FORM SUBMIT ---
const form = document.getElementById('intake-form');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = document.getElementById('submit-btn');
    btn.textContent = 'Submitting...';
    btn.disabled = true;
    btn.style.opacity = '0.7';

    setTimeout(() => {
      const formWrap = document.querySelector('.intake-form-wrap');
      formWrap.innerHTML = `
        <div style="padding:72px 40px;text-align:center;">
          <div style="font-size:52px;margin-bottom:20px;">✅</div>
          <h3 style="font-family:'Barlow',sans-serif;font-size:28px;font-weight:800;color:#fff;margin-bottom:12px;">Application Received</h3>
          <p style="font-size:16px;color:#94A3B8;line-height:1.7;max-width:420px;margin:0 auto 32px;">We review every application personally. You'll hear from Andrew within 24 hours.</p>
          <div style="display:inline-flex;align-items:center;gap:8px;background:rgba(34,197,94,0.12);border:1px solid rgba(34,197,94,0.3);border-radius:100px;padding:8px 20px;font-size:13px;font-weight:600;color:#4ADE80;">
            <span style="width:7px;height:7px;background:#22C55E;border-radius:50%;box-shadow:0 0 8px #22C55E;display:inline-block;"></span>
            Submitted successfully
          </div>
        </div>
      `;
    }, 1200);
  });
}

// --- COUNTER ANIMATION ---
function animateCounter(el, target, duration) {
  duration = duration || 1800;
  const start = performance.now();
  const update = (time) => {
    const elapsed = time - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target).toLocaleString();
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const raw = el.textContent.replace(/[^0-9]/g, '');
      if (raw) animateCounter(el, parseInt(raw));
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.hero-stat-num span, .proof-metric-num').forEach(el => {
  counterObserver.observe(el);
});
