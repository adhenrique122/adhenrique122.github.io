const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function createParticles(count) {
  const intro = document.getElementById('intro');
  if (!intro) return;
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

  if (title) {
    setTimeout(() => {
      title.style.cssText = 'transition:all 1.8s ease;opacity:1;transform:translateY(0)';
    }, 400);
  }

  if (subtitle) {
    setTimeout(() => {
      subtitle.style.cssText = 'transition:all 1.6s ease;opacity:1';
    }, 1100);
  }

  setTimeout(() => {
    document.body.classList.add('loaded');
    // Once intro is faded out (1.2s later), remove it entirely from DOM to free GPU/CPU resources
    setTimeout(() => {
      const intro = document.getElementById('intro');
      if (intro) intro.remove();
    }, 1200);
  }, 3200);
});

document.addEventListener('DOMContentLoaded', () => {
  const observer = new IntersectionObserver(
    entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
    { threshold: 0.1 }
  );
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  /* Newsletter form is now handled by ConvertKit / Kit */

  /* ==================== CAROUSEL PARALLAX ==================== */
  const obrasSection = document.getElementById('obras');
  if (obrasSection) {
    const wraps = obrasSection.querySelectorAll('.carousel-row-wrap');
    const windowH = window.innerHeight;

    // Cache section geometry — recalculate only on resize, not every scroll frame
    let sectionTop    = 0;
    let sectionHeight = 0;
    let isSectionVisible = false;
    let wasMobile = window.innerWidth < 768;

    function cacheSectionRect() {
      const rect    = obrasSection.getBoundingClientRect();
      sectionTop    = rect.top + window.scrollY;
      sectionHeight = rect.height;
    }
    cacheSectionRect();
    
    window.addEventListener('resize', () => {
      cacheSectionRect();
      const isMobile = window.innerWidth < 768;
      if (isMobile && !wasMobile) {
        // Reset translate transforms on mobile breakpoint crossover
        wraps.forEach(wrap => {
          wrap.style.transform = '';
        });
      }
      wasMobile = isMobile;
    }, { passive: true });

    // Only run parallax while section is in view
    const visibilityObserver = new IntersectionObserver(
      entries => { isSectionVisible = entries[0].isIntersecting; },
      { rootMargin: '100px 0px' }
    );
    visibilityObserver.observe(obrasSection);

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (window.innerWidth < 768) return; // Skip parallax on mobile viewports
      if (!isSectionVisible || ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const scrollY   = window.scrollY;
        const relTop    = sectionTop - scrollY;
        const wH        = window.innerHeight;
        if (relTop < wH && relTop + sectionHeight > 0) {
          const progress = (wH - relTop) / (wH + sectionHeight);
          wraps.forEach((wrap, i) => {
            const speed  = parseFloat(wrap.dataset.speed) || 1;
            const offset = (progress - 0.5) * 60 * speed * (i % 2 === 0 ? 1 : -1);
            wrap.style.transform = `translateX(${offset}px)`;
          });
        }
        ticking = false;
      });
    }, { passive: true });
  }

  /* ==================== SAGA CARD FLIP CONTROLLER ==================== */
  document.querySelectorAll('.saga-card').forEach(card => {
    let startX = 0;
    let startY = 0;
    let startTime = 0;

    card.addEventListener('pointerdown', e => {
      // Only handle primary button (left click) or touch/pen
      if (e.button !== 0 && e.pointerType === 'mouse') return;
      startX = e.clientX;
      startY = e.clientY;
      startTime = Date.now();
    });

    card.addEventListener('pointerup', e => {
      if (e.button !== 0 && e.pointerType === 'mouse') return;

      // Don't trigger if the click/tap was on a link or button
      if (e.target.closest('a') || e.target.closest('button')) {
        return;
      }

      const diffX = Math.abs(e.clientX - startX);
      const diffY = Math.abs(e.clientY - startY);
      const duration = Date.now() - startTime;

      // If moved more than 8px or held down for too long, it's a drag/scroll/hold
      if (diffX < 8 && diffY < 8 && duration < 350) {
        card.classList.toggle('flipped');
      }
    });
  });
});
