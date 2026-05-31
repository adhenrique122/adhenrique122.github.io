const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function createParticles(count) {
  const intro = document.getElementById('intro');
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.classList.add('particle');
    const size = Math.random() * 4 + 2;
    p.style.cssText = `width:${size}px;height:${size}px;left:${Math.random()*100}vw;animation-duration:${Math.random()*12+10}s;animation-delay:-${Math.random()*15}s;opacity:${Math.random()*.6+.2}`;
    intro.appendChild(p);
    setTimeout(() => p.remove(), 25000);
  }
}

window.addEventListener('load', () => {
  const isMobile = window.innerWidth < 768;
  const particleCount = isMobile ? 15 : 45;
  createParticles(particleCount);

  const title    = document.getElementById('introTitle');
  const subtitle = document.getElementById('introSubtitle');

  setTimeout(() => {
    title.style.cssText = 'transition:all 1.8s ease;opacity:1;transform:translateY(0)';
  }, 400);

  setTimeout(() => {
    subtitle.style.cssText = 'transition:all 1.6s ease;opacity:1';
  }, 1100);

  setTimeout(() => {
    document.body.classList.add('loaded');
  }, 3200);
});

document.addEventListener('DOMContentLoaded', () => {
  const observer = new IntersectionObserver(
    entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
    { threshold: 0.1 }
  );
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  const btn   = document.getElementById('signupBtn');
  const input = btn.previousElementSibling;

  btn.addEventListener('click', () => {
    if (!EMAIL_RE.test(input.value.trim())) {
      input.classList.add('error');
      const prev = input.placeholder;
      input.placeholder = 'Please enter a valid email…';
      setTimeout(() => { input.classList.remove('error'); input.placeholder = prev; }, 2500);
      return;
    }
    btn.textContent = '✓ 4 Chapters Sent!';
    btn.classList.add('success');
    btn.disabled    = true;
    input.value     = '';
    input.disabled  = true;
  });
});
