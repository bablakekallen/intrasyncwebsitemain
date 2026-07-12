/* ============================================
   CastLogic Modern Interactions
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // --- Scroll Reveal (Intersection Observer) ---
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger').forEach(el => {
        revealObserver.observe(el);
    });

    // --- Animated Counters ---
    function animateCounter(el) {
        const target = parseInt(el.getAttribute('data-target'));
        const suffix = el.getAttribute('data-suffix') || '';
        const prefix = el.getAttribute('data-prefix') || '';
        const duration = 2000;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(eased * target);
            el.textContent = prefix + current.toLocaleString() + suffix;

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }
        requestAnimationFrame(update);
    }

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                entry.target.classList.add('counted');
                animateCounter(entry.target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));

    // --- Header scroll behavior ---
    const header = document.querySelector('header');
    if (header) {
        let lastScroll = 0;
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            if (currentScroll > 100) {
                header.classList.add('shadow-md');
                header.style.borderBottomColor = 'transparent';
            } else {
                header.classList.remove('shadow-md');
                header.style.borderBottomColor = '';
            }
            lastScroll = currentScroll;
        }, { passive: true });
    }

    // --- Mobile menu toggle ---
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('open');
            document.body.classList.toggle('overflow-hidden');
        });
    }

    // --- Smooth scroll for anchor links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // --- Video placeholder click to play ---
    document.querySelectorAll('.video-placeholder[data-video]').forEach(placeholder => {
        placeholder.addEventListener('click', () => {
            const videoUrl = placeholder.getAttribute('data-video');
            if (videoUrl) {
                const iframe = document.createElement('iframe');
                iframe.src = videoUrl + '?autoplay=1';
                iframe.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;border:none;border-radius:1rem;';
                iframe.allow = 'autoplay; fullscreen';
                placeholder.innerHTML = '';
                placeholder.style.paddingTop = '56.25%'; // 16:9
                placeholder.appendChild(iframe);
            }
        });
    });

});
