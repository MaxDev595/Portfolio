/* ============================================================
   SCROLL ANIMATIONS
   <script src="/js/scroll-animations.js"></script>
   ============================================================ */

(function () {
    'use strict';

    const style = document.createElement('style');
    style.textContent = `
    [data-anim] {
      will-change: transform, opacity;
      transition-property: opacity, transform, filter;
      transition-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
      transition-duration: 0.85s;
    }

    [data-anim="fade-up"] {
      opacity: 0;
      transform: translateY(60px);
    }
    [data-anim="fade-left"] {
      opacity: 0;
      transform: translateX(-60px);
    }
    [data-anim="fade-right"] {
      opacity: 0;
      transform: translateX(60px);
    }
    [data-anim="scale-in"] {
      opacity: 0;
      transform: scale(0.82);
      filter: blur(4px);
    }

    /* Заголовки — просто fade-up, никакого clip-path */
    [data-anim="heading"] {
      opacity: 0;
      transform: translateY(30px);
      transition-duration: 0.7s;
    }

    [data-anim].is-visible {
      opacity: 1;
      transform: none;
      filter: none;
    }

    [data-delay="100"] { transition-delay: 0.10s; }
    [data-delay="200"] { transition-delay: 0.20s; }
    [data-delay="300"] { transition-delay: 0.30s; }
    [data-delay="400"] { transition-delay: 0.40s; }
    [data-delay="500"] { transition-delay: 0.50s; }
    [data-delay="600"] { transition-delay: 0.60s; }

    #scroll-progress {
      position: fixed;
      top: 0;
      left: 0;
      height: 3px;
      width: 0%;
      background: linear-gradient(90deg, #ff4d5a, #4d8bff);
      z-index: 99999;
      border-radius: 0 2px 2px 0;
      transition: width 0.1s linear;
      pointer-events: none;
    }

    .split-letter {
      display: inline-block;
      opacity: 0;
      transform: translateY(30px) rotate(4deg);
      transition: opacity 0.5s cubic-bezier(0.22,1,0.36,1),
                  transform 0.5s cubic-bezier(0.22,1,0.36,1);
    }
    .split-letter.is-visible {
      opacity: 1;
      transform: none;
    }

    .skill_item {
      transform-style: preserve-3d;
      transition: transform 0.3s ease, border-color 0.2s ease, box-shadow 0.2s ease;
    }

    @keyframes borderPulse {
      0%,100% { box-shadow: 0 0 0 0 rgba(77,139,255,0); }
      50%      { box-shadow: 0 0 0 6px rgba(77,139,255,0.12); }
    }
    .border-pulse {
      animation: borderPulse 3s ease infinite;
    }

    .section-enter {
      opacity: 0;
      transform: translateY(40px);
      transition: opacity 1s cubic-bezier(0.22,1,0.36,1),
                  transform 1s cubic-bezier(0.22,1,0.36,1);
    }
    .section-enter.is-visible {
      opacity: 1;
      transform: none;
    }

    .skill-bar-wrap {
      height: 3px;
      background: rgba(255,255,255,0.07);
      border-radius: 3px;
      margin-top: 6px;
      overflow: hidden;
    }
    .skill-bar-fill {
      height: 100%;
      width: 0%;
      border-radius: 3px;
      background: linear-gradient(90deg, #ff4d5a, #4d8bff);
      transition: width 1.2s cubic-bezier(0.22,1,0.36,1);
    }

    /* Проджект карточки — въезд снизу со scale */
    .projects-card {
      opacity: 0;
      transform: translateY(60px) scale(0.97);
      transition:
        opacity   0.8s cubic-bezier(0.22, 1, 0.36, 1),
        transform 0.8s cubic-bezier(0.22, 1, 0.36, 1);
    }
    .projects-card.is-visible {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  `;
    document.head.appendChild(style);

    /* SCROLL PROGRESS BAR */
    const progressBar = document.createElement('div');
    progressBar.id = 'scroll-progress';
    document.body.prepend(progressBar);

    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        const total = document.documentElement.scrollHeight - window.innerHeight;
        progressBar.style.width = (scrolled / total * 100).toFixed(2) + '%';
    }, { passive: true });

    /* UNIVERSAL IntersectionObserver */
    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

    function assignAnim(selector, anim, delayStep = 0, startDelay = 0) {
        document.querySelectorAll(selector).forEach((el, i) => {
            if (!el.dataset.anim) {
                el.dataset.anim = anim;
                const d = startDelay + i * delayStep;
                if (d > 0) el.dataset.delay = String(d);
            }
            io.observe(el);
        });
    }

    /* Заголовки секций */
    assignAnim('.section--heading', 'heading');

    /* About */
    assignAnim('.about-text', 'fade-left', 0, 0);
    assignAnim('.about-card', 'fade-right', 0, 100);

    /* Скилл-айтемы */
    document.querySelectorAll('.skill_item').forEach((el, i) => {
        el.dataset.anim = 'scale-in';
        el.dataset.delay = String(Math.min(i * 80, 600));
        io.observe(el);
    });

    /* Проджект карточки — stagger */
    document.querySelectorAll('.projects-card').forEach((el, i) => {
        el.style.transitionDelay = `${i * 150}ms`;
        io.observe(el);
    });

    /* Контакты */
    assignAnim('.contacts-social', 'fade-left', 0, 0);
    assignAnim('.contacts-form-wrapper', 'fade-right', 0, 150);
    assignAnim('.social-link', 'fade-up', 80, 0);

    /* Футер */
    assignAnim('.footer-section', 'fade-up', 120, 0);
    assignAnim('.footer-bottom', 'fade-up', 0, 200);

    /* SPLIT TEXT для hero */
    function splitTextAnimate(selector) {
        document.querySelectorAll(selector).forEach(el => {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = el.innerHTML;
            el.innerHTML = '';

            tempDiv.childNodes.forEach(node => {
                if (node.nodeType === Node.TEXT_NODE) {
                    node.textContent.split('').forEach((char, i) => {
                        const span = document.createElement('span');
                        span.className = 'split-letter';
                        span.textContent = char === ' ' ? '\u00A0' : char;
                        span.style.transitionDelay = `${i * 28}ms`;
                        el.appendChild(span);
                    });
                } else if (node.nodeType === Node.ELEMENT_NODE) {
                    const wrapper = document.createElement('span');
                    wrapper.className = 'split-letter';
                    wrapper.innerHTML = node.outerHTML;
                    wrapper.style.transitionDelay = `${el.children.length * 28}ms`;
                    el.appendChild(wrapper);
                }
            });

            const splitIo = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        el.querySelectorAll('.split-letter').forEach(s => s.classList.add('is-visible'));
                        splitIo.unobserve(el);
                    }
                });
            }, { threshold: 0.3 });

            splitIo.observe(el);
        });
    }

    splitTextAnimate('.text--hero--title');
    splitTextAnimate('.text--hero--subtitle');

    /* 3D TILT */
    function addTilt(selector, strength = 8) {
        document.querySelectorAll(selector).forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const r = card.getBoundingClientRect();
                const x = (e.clientX - r.left) / r.width - 0.5;
                const y = (e.clientY - r.top) / r.height - 0.5;
                card.style.transform = `
                    perspective(900px)
                    rotateY(${x * strength}deg)
                    rotateX(${-y * strength}deg)
                    translateY(-6px)
                    scale(1.01)
                `;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
                card.style.transition = 'transform 0.6s cubic-bezier(0.22,1,0.36,1)';
                setTimeout(() => card.style.transition = '', 600);
            });
        });
    }

    addTilt('.projects-card', 5);
    addTilt('.about-text', 4);
    addTilt('.about-card', 4);
    addTilt('.contacts-social', 3);
    addTilt('.contacts-form-wrapper', 3);

    /* SKILL PROGRESS BARS */
    const skillLevels = {
        'HTML': 95, 'CSS': 88, 'React': 82, 'SASS': 78,
        'Next.js': 72, 'Vite.js': 80, 'Git': 85,
    };

    document.querySelectorAll('.skill_item').forEach(item => {
        const nameEl = item.querySelector('.skill_item-name');
        if (!nameEl) return;
        const level = skillLevels[nameEl.textContent.trim()];
        if (!level) return;

        const wrap = document.createElement('div');
        wrap.className = 'skill-bar-wrap';
        const fill = document.createElement('div');
        fill.className = 'skill-bar-fill';
        wrap.appendChild(fill);
        item.appendChild(wrap);

        const barIo = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    setTimeout(() => { fill.style.width = level + '%'; }, 200);
                    barIo.unobserve(item);
                }
            });
        }, { threshold: 0.5 });
        barIo.observe(item);
    });

    /* BORDER PULSE */
    const formWrapper = document.querySelector('.contacts-form-wrapper');
    if (formWrapper) {
        formWrapper.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('focus', () => formWrapper.classList.add('border-pulse'));
            input.addEventListener('blur', () => formWrapper.classList.remove('border-pulse'));
        });
    }

    /* MAGNETIC */
    function addMagnetic(selector, pull = 0.35) {
        document.querySelectorAll(selector).forEach(btn => {
            btn.addEventListener('mousemove', e => {
                const r = btn.getBoundingClientRect();
                const dx = e.clientX - (r.left + r.width / 2);
                const dy = e.clientY - (r.top + r.height / 2);
                btn.style.transform = `translate(${dx * pull}px, ${dy * pull}px)`;
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = '';
                btn.style.transition = 'transform 0.5s cubic-bezier(0.22,1,0.36,1)';
                setTimeout(() => btn.style.transition = '', 500);
            });
        });
    }

    addMagnetic('.btn_hero', 0.3);
    addMagnetic('.form-submit', 0.25);
    addMagnetic('.footer-social-icon', 0.4);

    /* STAGGER social links */
    document.querySelectorAll('.social-link').forEach((el, i) => {
        el.style.transitionDelay = `${i * 80}ms`;
    });

    /* SECTION ПОЯВЛЕНИЕ */
    document.querySelectorAll('section:not(#home), footer').forEach(el => {
        el.classList.add('section-enter');
        const secIo = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    el.classList.add('is-visible');
                    secIo.unobserve(el);
                }
            });
        }, { threshold: 0.05 });
        secIo.observe(el);
    });

})();
