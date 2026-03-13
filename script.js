// =============================================
// FRAKES METHOD CONSULTING — INTERACTIONS
// =============================================

// Nav scroll effect
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
});

// Mobile hamburger
const hamburger = document.getElementById('hamburger');
const navMobile = document.getElementById('nav-mobile');
hamburger.addEventListener('click', () => {
  navMobile.classList.toggle('open');
});
navMobile.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navMobile.classList.remove('open'));
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// Animate metric bars on scroll
const metricObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.metric-fill').forEach(fill => {
        const w = fill.style.width;
        fill.style.width = '0%';
        setTimeout(() => { fill.style.width = w; }, 100);
      });
      metricObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const osCard = document.querySelector('.os-card');
if (osCard) metricObserver.observe(osCard);

// Fade-in on scroll
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll(
  '.solution-card, .pain-card, .process-step, .feature-item, .case-metric, .form-section'
).forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(22px)';
  el.style.transition = `opacity 0.5s ease ${i * 0.05}s, transform 0.5s ease ${i * 0.05}s`;
  fadeObserver.observe(el);
});

// Checkbox item visual toggle
document.querySelectorAll('.checkbox-item input[type="checkbox"]').forEach(cb => {
  cb.addEventListener('change', function () {
    const item = this.closest('.checkbox-item');
    if (this.checked) {
      item.style.borderColor = 'var(--blue-700)';
      item.style.background = 'var(--blue-50)';
      item.style.color = 'var(--blue-700)';
    } else {
      item.style.borderColor = '';
      item.style.background = '';
      item.style.color = '';
    }
  });
});

// Contact form submission
const form = document.getElementById('intake-form');
const submitBtn = document.getElementById('submit-btn');
const formSuccess = document.getElementById('form-success');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Submitting...';
    submitBtn.disabled = true;

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Collect checkboxes (multiple values)
    const checkboxFields = {};
    form.querySelectorAll('input[type="checkbox"]:checked').forEach(cb => {
      if (!checkboxFields[cb.name]) checkboxFields[cb.name] = [];
      checkboxFields[cb.name].push(cb.value);
    });
    Object.assign(data, checkboxFields);

    try {
      if (typeof emailjs !== 'undefined') {
        await emailjs.send(
          window.EMAILJS_SERVICE_ID || 'service_osb52zu',
          window.EMAILJS_TEMPLATE_ID || 'template_frakes',
          {
            from_name: `${data.first_name} ${data.last_name}`,
            from_email: data.email,
            company: data.company || 'Not provided',
            service: data.service_interest || 'Not specified',
            message: JSON.stringify(data, null, 2),
            to_email: 'Andrew@lit-ventures.com'
          }
        );
      }

      form.reset();
      // Reset checkbox styles
      document.querySelectorAll('.checkbox-item').forEach(item => {
        item.style.borderColor = '';
        item.style.background = '';
        item.style.color = '';
      });

      formSuccess.style.display = 'flex';
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;

      formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });

    } catch (err) {
      console.error('Form error:', err);
      form.reset();
      formSuccess.style.display = 'flex';
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });
}
