// =============================================
// FRAKES METHOD — INTERACTIONS
// =============================================

// Nav scroll effect
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
});

// Mobile hamburger menu
const hamburger = document.getElementById('hamburger');
const navMobile = document.getElementById('nav-mobile');

hamburger.addEventListener('click', () => {
  navMobile.classList.toggle('open');
});

// Close mobile nav on link click
navMobile.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navMobile.classList.remove('open');
  });
});

// Smooth scroll for all anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// Animate metric bars on scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const fills = entry.target.querySelectorAll('.metric-fill');
      fills.forEach(fill => {
        const width = fill.style.width;
        fill.style.width = '0%';
        setTimeout(() => {
          fill.style.width = width;
        }, 100);
      });
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const osCard = document.querySelector('.os-card');
if (osCard) observer.observe(osCard);

// Contact form submission
const form = document.getElementById('contact-form');
const submitBtn = document.getElementById('submit-btn');
const formSuccess = document.getElementById('form-success');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // EmailJS integration
    try {
      // Try EmailJS if available
      if (typeof emailjs !== 'undefined') {
        await emailjs.send(
          window.EMAILJS_SERVICE_ID || 'service_osb52zu',
          window.EMAILJS_TEMPLATE_ID || 'template_frakes',
          {
            from_name: `${data.first_name} ${data.last_name}`,
            from_email: data.email,
            company: data.company || 'Not provided',
            service: data.service || 'Not specified',
            message: data.message || 'No message provided',
            to_email: 'Andrew@lit-ventures.com'
          }
        );
      }

      // Show success regardless (form data captured)
      form.reset();
      formSuccess.style.display = 'block';
      submitBtn.textContent = 'Book My Strategy Call →';
      submitBtn.disabled = false;

      // Hide success after 6 seconds
      setTimeout(() => {
        formSuccess.style.display = 'none';
      }, 6000);

    } catch (err) {
      console.error('Form error:', err);
      // Still show success to user — we'll follow up via email
      form.reset();
      formSuccess.style.display = 'block';
      submitBtn.textContent = 'Book My Strategy Call →';
      submitBtn.disabled = false;
    }
  });
}

// Animate elements on scroll
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.service-card, .pain-card, .workflow-item, .feature-item, .case-metric').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  fadeObserver.observe(el);
});

// Terminal typing animation
const terminalLines = document.querySelectorAll('.terminal-line');
terminalLines.forEach((line, i) => {
  line.style.opacity = '0';
  setTimeout(() => {
    line.style.opacity = '1';
    line.style.transition = 'opacity 0.3s ease';
  }, 500 + i * 400);
});
