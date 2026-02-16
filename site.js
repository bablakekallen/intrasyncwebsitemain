/* ================================================================
   IntraSync Industrial — Shared Site JavaScript
   ================================================================ */

(function () {
    'use strict';

    // ===== GSAP Fallback Detection =====
    function checkGSAP() {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
            document.body.classList.add('no-gsap');
            return false;
        }
        return true;
    }

    // ===== Mobile Hamburger Menu =====
    function initMobileNav() {
        const header = document.querySelector('.site-header');
        if (!header) return;

        // Create hamburger button
        const hamburger = document.createElement('button');
        hamburger.className = 'hamburger-btn md-hidden';
        hamburger.setAttribute('aria-label', 'Open navigation menu');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.innerHTML = '<span class="hamburger-line"></span><span class="hamburger-line"></span><span class="hamburger-line"></span>';

        // Only show on mobile
        hamburger.style.cssText = 'display:none;';
        const mq = window.matchMedia('(max-width: 767px)');
        function toggleHamburgerVisibility(e) {
            hamburger.style.display = e.matches ? 'flex' : 'none';
        }
        mq.addEventListener('change', toggleHamburgerVisibility);
        toggleHamburgerVisibility(mq);

        // Insert hamburger into header
        const headerActions = header.querySelector('.flex.items-center.gap-4');
        if (headerActions) {
            headerActions.appendChild(hamburger);
        }

        // Gather nav links
        const desktopNav = header.querySelector('nav');
        const navLinks = desktopNav ? Array.from(desktopNav.querySelectorAll('a')) : [];

        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'mobile-nav-overlay';
        document.body.appendChild(overlay);

        // Create drawer
        const drawer = document.createElement('div');
        drawer.className = 'mobile-nav-drawer';
        drawer.setAttribute('role', 'dialog');
        drawer.setAttribute('aria-label', 'Navigation menu');

        // Drawer header
        const drawerHeader = document.createElement('div');
        drawerHeader.style.cssText = 'padding:1.25rem 1.5rem;border-bottom:1px solid #e5e7eb;display:flex;justify-content:space-between;align-items:center;';
        drawerHeader.innerHTML = '<span style="font-weight:700;font-size:1.125rem;color:#1f2937;">Menu</span>';

        const closeBtn = document.createElement('button');
        closeBtn.setAttribute('aria-label', 'Close menu');
        closeBtn.style.cssText = 'width:32px;height:32px;display:flex;align-items:center;justify-content:center;border-radius:8px;border:none;background:#f3f4f6;cursor:pointer;font-size:1.25rem;color:#6b7280;';
        closeBtn.textContent = '\u2715';
        drawerHeader.appendChild(closeBtn);
        drawer.appendChild(drawerHeader);

        // Drawer nav links
        const drawerNav = document.createElement('nav');
        drawerNav.setAttribute('aria-label', 'Mobile navigation');
        navLinks.forEach(function (link) {
            const a = document.createElement('a');
            a.href = link.href;
            a.className = 'nav-link';
            a.textContent = link.textContent.trim();
            if (link.classList.contains('active') || isActivePage(link.getAttribute('href'))) {
                a.classList.add('active');
            }
            drawerNav.appendChild(a);
        });
        drawer.appendChild(drawerNav);

        // Drawer CTA
        const ctaLink = header.querySelector('a[href*="contact"]');
        if (ctaLink) {
            const mobileCta = document.createElement('a');
            mobileCta.href = ctaLink.href;
            mobileCta.className = 'mobile-cta';
            mobileCta.textContent = 'Get Started';
            drawer.appendChild(mobileCta);
        }

        document.body.appendChild(drawer);

        // Toggle logic
        function openMenu() {
            hamburger.classList.add('active');
            hamburger.setAttribute('aria-expanded', 'true');
            overlay.classList.add('active');
            drawer.classList.add('active');
            document.body.classList.add('nav-open');
        }

        function closeMenu() {
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            overlay.classList.remove('active');
            drawer.classList.remove('active');
            document.body.classList.remove('nav-open');
        }

        hamburger.addEventListener('click', function () {
            if (drawer.classList.contains('active')) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        overlay.addEventListener('click', closeMenu);
        closeBtn.addEventListener('click', closeMenu);

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && drawer.classList.contains('active')) {
                closeMenu();
            }
        });

        // Close on nav link click
        drawerNav.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', closeMenu);
        });
    }

    // ===== Header Scroll Behavior =====
    function initHeaderScroll() {
        const header = document.querySelector('.site-header');
        if (!header) return;

        var lastScrollY = 0;
        var ticking = false;

        function onScroll() {
            lastScrollY = window.scrollY;
            if (!ticking) {
                requestAnimationFrame(function () {
                    if (lastScrollY > 50) {
                        header.classList.add('site-header--scrolled');
                    } else {
                        header.classList.remove('site-header--scrolled');
                    }
                    ticking = false;
                });
                ticking = true;
            }
        }

        window.addEventListener('scroll', onScroll, { passive: true });
    }

    // ===== Active Nav Link Detection =====
    function isActivePage(href) {
        if (!href) return false;
        var currentPath = window.location.pathname;
        var linkPath = href.replace(/^\.\.\//, '').replace(/^\.\//, '');

        // Normalize paths
        if (currentPath.endsWith('/')) currentPath += 'index.html';
        var currentFile = currentPath.split('/').pop();

        return currentFile === linkPath;
    }

    function initActiveNavLinks() {
        document.querySelectorAll('.nav-link').forEach(function (link) {
            var href = link.getAttribute('href');
            if (isActivePage(href)) {
                link.classList.add('active');
                link.style.color = '#1d4ed8';
            }
        });
    }

    // ===== GSAP ScrollTrigger Animations =====
    function initScrollAnimations() {
        if (!checkGSAP()) return;

        gsap.registerPlugin(ScrollTrigger);

        // Animate individual elements
        var animationClasses = [
            { selector: '.gs-fade-up', props: { y: 40, opacity: 0 } },
            { selector: '.gs-fade-down', props: { y: -40, opacity: 0 } },
            { selector: '.gs-fade-left', props: { x: -40, opacity: 0 } },
            { selector: '.gs-fade-right', props: { x: 40, opacity: 0 } },
            { selector: '.gs-scale-in', props: { scale: 0.8, opacity: 0 } }
        ];

        animationClasses.forEach(function (anim) {
            document.querySelectorAll(anim.selector).forEach(function (el) {
                var delay = parseFloat(el.getAttribute('data-delay')) || 0;
                var duration = parseFloat(el.getAttribute('data-duration')) || 0.8;

                gsap.fromTo(el, anim.props, {
                    y: 0,
                    x: 0,
                    scale: 1,
                    opacity: 1,
                    duration: duration,
                    delay: delay,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: el,
                        start: 'top bottom-=80',
                        toggleActions: 'play none none none',
                        once: true
                    }
                });
            });
        });

        // Stagger containers
        document.querySelectorAll('.gs-stagger-container').forEach(function (container) {
            var items = container.querySelectorAll('.gs-stagger-item');
            if (items.length === 0) return;

            gsap.fromTo(items,
                { y: 30, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.6,
                    stagger: 0.1,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: container,
                        start: 'top bottom-=60',
                        toggleActions: 'play none none none',
                        once: true
                    }
                }
            );
        });

        // Parallax elements
        document.querySelectorAll('[data-parallax]').forEach(function (el) {
            var speed = parseFloat(el.getAttribute('data-parallax')) || 0.2;
            gsap.to(el, {
                yPercent: speed * 100,
                ease: 'none',
                scrollTrigger: {
                    trigger: el,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true
                }
            });
        });
    }

    // ===== Animated Counters =====
    function initCounters() {
        var counters = document.querySelectorAll('[data-counter]');
        if (counters.length === 0) return;

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        counters.forEach(function (el) { observer.observe(el); });
    }

    function animateCounter(el) {
        var target = parseFloat(el.getAttribute('data-counter'));
        var duration = parseInt(el.getAttribute('data-counter-duration')) || 2000;
        var prefix = el.getAttribute('data-counter-prefix') || '';
        var suffix = el.getAttribute('data-counter-suffix') || '';
        var decimals = parseInt(el.getAttribute('data-counter-decimals')) || 0;

        var startTime = null;
        var startValue = 0;

        function easeOutExpo(t) {
            return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
        }

        function step(timestamp) {
            if (!startTime) startTime = timestamp;
            var progress = Math.min((timestamp - startTime) / duration, 1);
            var easedProgress = easeOutExpo(progress);
            var current = startValue + (target - startValue) * easedProgress;

            el.textContent = prefix + current.toFixed(decimals) + suffix;

            if (progress < 1) {
                requestAnimationFrame(step);
            }
        }

        requestAnimationFrame(step);
    }

    // ===== Smooth Scroll for Anchor Links =====
    function initSmoothScroll() {
        document.addEventListener('click', function (e) {
            var link = e.target.closest('a[href^="#"]');
            if (!link) return;

            var targetId = link.getAttribute('href');
            if (targetId === '#') return;

            var target = document.querySelector(targetId);
            if (!target) return;

            e.preventDefault();

            var headerHeight = document.querySelector('.site-header')
                ? document.querySelector('.site-header').offsetHeight
                : 0;

            var targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight - 20;

            if (typeof gsap !== 'undefined') {
                gsap.to(window, {
                    scrollTo: { y: targetPosition, autoKill: true },
                    duration: 0.8,
                    ease: 'power2.inOut'
                });
            } else {
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
        });
    }

    // ===== 3D Tilt Effect =====
    function initTiltEffect() {
        // Skip on touch devices
        if ('ontouchstart' in window) return;

        document.querySelectorAll('[data-tilt]').forEach(function (el) {
            var maxTilt = parseFloat(el.getAttribute('data-tilt-max')) || 8;

            el.addEventListener('mousemove', function (e) {
                var rect = el.getBoundingClientRect();
                var x = e.clientX - rect.left;
                var y = e.clientY - rect.top;
                var centerX = rect.width / 2;
                var centerY = rect.height / 2;

                var rotateX = ((y - centerY) / centerY) * -maxTilt;
                var rotateY = ((x - centerX) / centerX) * maxTilt;

                el.style.transform = 'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-4px)';
            });

            el.addEventListener('mouseleave', function () {
                el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
                el.style.transition = 'transform 0.5s ease';
                setTimeout(function () { el.style.transition = ''; }, 500);
            });
        });
    }

    // ===== Reading Progress Bar =====
    function initReadingProgress() {
        var progressBar = document.querySelector('.reading-progress');
        if (!progressBar) return;

        window.addEventListener('scroll', function () {
            var scrollTop = window.scrollY;
            var docHeight = document.documentElement.scrollHeight - window.innerHeight;
            var progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            progressBar.style.width = Math.min(progress, 100) + '%';
        }, { passive: true });
    }

    // ===== Interactive Checklist (Verify page) =====
    function initChecklist() {
        var checklist = document.querySelector('.interactive-checklist');
        if (!checklist) return;

        var items = checklist.querySelectorAll('.checklist-item');
        var progressFill = checklist.querySelector('.checklist-progress-fill');
        var stamp = checklist.querySelector('.qc-stamp');
        var totalItems = items.length;

        items.forEach(function (item) {
            item.addEventListener('click', function () {
                item.classList.toggle('checked');
                updateProgress();
            });
        });

        function updateProgress() {
            var checked = checklist.querySelectorAll('.checklist-item.checked').length;
            var pct = totalItems > 0 ? (checked / totalItems) * 100 : 0;

            if (progressFill) {
                progressFill.style.width = pct + '%';
            }

            if (stamp) {
                if (checked === totalItems && totalItems > 0) {
                    stamp.classList.add('visible');
                } else {
                    stamp.classList.remove('visible');
                }
            }
        }
    }

    // ===== Workflow Stepper (Verify page) =====
    function initWorkflowStepper() {
        var steps = document.querySelectorAll('.workflow-step');
        var details = document.querySelectorAll('.workflow-detail');
        if (steps.length === 0) return;

        steps.forEach(function (step) {
            step.addEventListener('click', function () {
                var targetId = step.getAttribute('data-step');

                // Toggle active state
                steps.forEach(function (s) { s.classList.remove('active'); });
                details.forEach(function (d) { d.classList.remove('active'); });

                step.classList.add('active');
                var detail = document.getElementById('step-detail-' + targetId);
                if (detail) detail.classList.add('active');
            });
        });

        // Activate first step
        if (steps[0]) steps[0].click();
    }

    // ===== Before/After Comparison Slider =====
    function initComparisonSlider() {
        var sliders = document.querySelectorAll('.comparison-slider');
        sliders.forEach(function (slider) {
            var afterLayer = slider.querySelector('.comparison-after');
            var divider = slider.querySelector('.comparison-divider');
            var handle = slider.querySelector('.comparison-handle');
            if (!afterLayer || !divider || !handle) return;

            var isDragging = false;

            function setPosition(x) {
                var rect = slider.getBoundingClientRect();
                var pct = Math.max(0, Math.min(100, ((x - rect.left) / rect.width) * 100));
                afterLayer.style.clipPath = 'inset(0 0 0 ' + pct + '%)';
                divider.style.left = pct + '%';
                handle.style.left = pct + '%';
            }

            slider.addEventListener('mousedown', function (e) {
                isDragging = true;
                setPosition(e.clientX);
            });

            window.addEventListener('mousemove', function (e) {
                if (isDragging) {
                    e.preventDefault();
                    setPosition(e.clientX);
                }
            });

            window.addEventListener('mouseup', function () {
                isDragging = false;
            });

            // Touch support
            slider.addEventListener('touchstart', function (e) {
                isDragging = true;
                setPosition(e.touches[0].clientX);
            }, { passive: true });

            slider.addEventListener('touchmove', function (e) {
                if (isDragging) {
                    setPosition(e.touches[0].clientX);
                }
            }, { passive: true });

            slider.addEventListener('touchend', function () {
                isDragging = false;
            });
        });
    }

    // ===== FAQ Accordion =====
    function initFaqAccordion() {
        document.querySelectorAll('.faq-question').forEach(function (question) {
            question.addEventListener('click', function () {
                var item = question.closest('.faq-item');
                if (!item) return;

                var answer = item.querySelector('.faq-answer');
                var isOpen = item.classList.contains('open');

                // Close all others
                document.querySelectorAll('.faq-item.open').forEach(function (openItem) {
                    if (openItem !== item) {
                        openItem.classList.remove('open');
                        var openAnswer = openItem.querySelector('.faq-answer');
                        if (openAnswer) openAnswer.style.maxHeight = '0';
                    }
                });

                // Toggle current
                if (isOpen) {
                    item.classList.remove('open');
                    if (answer) answer.style.maxHeight = '0';
                } else {
                    item.classList.add('open');
                    if (answer) answer.style.maxHeight = answer.scrollHeight + 'px';
                }
            });
        });
    }

    // ===== Module Filter (Modules page) =====
    function initModuleFilter() {
        var filterBtns = document.querySelectorAll('.filter-tab');
        if (filterBtns.length === 0) return;

        filterBtns.forEach(function (btn) {
            btn.addEventListener('click', function () {
                var filter = btn.getAttribute('data-filter');

                // Update active tab
                filterBtns.forEach(function (b) { b.classList.remove('active'); });
                btn.classList.add('active');

                var cards = document.querySelectorAll('[data-category]');

                cards.forEach(function (card) {
                    var category = card.getAttribute('data-category');
                    var shouldShow = filter === 'all' || category === filter;

                    if (typeof gsap !== 'undefined') {
                        if (shouldShow) {
                            card.style.display = '';
                            gsap.fromTo(card,
                                { opacity: 0, scale: 0.9, y: 20 },
                                { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: 'power2.out' }
                            );
                        } else {
                            gsap.to(card, {
                                opacity: 0, scale: 0.9, duration: 0.3,
                                onComplete: function () { card.style.display = 'none'; }
                            });
                        }
                    } else {
                        card.style.display = shouldShow ? '' : 'none';
                    }
                });
            });
        });
    }

    // ===== Partner Filter (Robotics page) =====
    function initPartnerFilter() {
        var filterBtns = document.querySelectorAll('.partner-filter-tab');
        if (filterBtns.length === 0) return;

        filterBtns.forEach(function (btn) {
            btn.addEventListener('click', function () {
                var filter = btn.getAttribute('data-filter');

                filterBtns.forEach(function (b) { b.classList.remove('active'); });
                btn.classList.add('active');

                var sections = document.querySelectorAll('[data-partner-category]');

                sections.forEach(function (section) {
                    var category = section.getAttribute('data-partner-category');
                    var shouldShow = filter === 'all' || category === filter;

                    if (typeof gsap !== 'undefined') {
                        if (shouldShow) {
                            section.style.display = '';
                            gsap.fromTo(section,
                                { opacity: 0, y: 20 },
                                { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
                            );
                        } else {
                            gsap.to(section, {
                                opacity: 0, duration: 0.3,
                                onComplete: function () { section.style.display = 'none'; }
                            });
                        }
                    } else {
                        section.style.display = shouldShow ? '' : 'none';
                    }
                });
            });
        });
    }

    // ===== Copyright Year Update =====
    function updateCopyrightYear() {
        document.querySelectorAll('footer').forEach(function (footer) {
            var textNodes = footer.querySelectorAll('*');
            textNodes.forEach(function (el) {
                if (el.children.length === 0 && el.textContent.match(/\u00a9\s*20\d{2}|Copyright\s*20\d{2}/)) {
                    el.textContent = el.textContent.replace(/20\d{2}/, new Date().getFullYear());
                }
            });
        });
    }

    // ===== SVG Path Drawing Animation (Robotics page) =====
    function initSVGPathDrawing() {
        var svg = document.querySelector('.animated-flow-svg');
        if (!svg || typeof gsap === 'undefined') return;

        var paths = svg.querySelectorAll('.draw-path');
        var dots = svg.querySelectorAll('.travel-dot');
        var boxes = svg.querySelectorAll('.flow-box');

        // Set initial state for paths
        paths.forEach(function (path) {
            var length = path.getTotalLength();
            path.style.strokeDasharray = length;
            path.style.strokeDashoffset = length;
        });

        // Create timeline
        var tl = gsap.timeline({
            scrollTrigger: {
                trigger: svg.closest('section') || svg,
                start: 'top center+=100',
                toggleActions: 'play none none none',
                once: true
            }
        });

        // Fade in left boxes
        var leftBoxes = svg.querySelectorAll('.flow-box-left');
        tl.fromTo(leftBoxes,
            { opacity: 0, x: -20 },
            { opacity: 1, x: 0, duration: 0.5, stagger: 0.1 }
        );

        // Draw paths
        tl.to(paths, {
            strokeDashoffset: 0,
            duration: 1.2,
            stagger: 0.15,
            ease: 'power2.inOut'
        }, '-=0.2');

        // Pulse center
        var centerBox = svg.querySelector('.flow-box-center');
        if (centerBox) {
            tl.fromTo(centerBox,
                { opacity: 0, scale: 0.8 },
                { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.5)' },
                '-=0.5'
            );
        }

        // Fade in right boxes
        var rightBoxes = svg.querySelectorAll('.flow-box-right');
        tl.fromTo(rightBoxes,
            { opacity: 0, x: 20 },
            { opacity: 1, x: 0, duration: 0.5, stagger: 0.1 },
            '-=0.3'
        );

        // Animate dots along paths
        dots.forEach(function (dot) {
            tl.to(dot, { opacity: 1, duration: 0.2 }, '-=0.1');
        });
    }

    // ===== Initialize Everything =====
    document.addEventListener('DOMContentLoaded', function () {
        initMobileNav();
        initHeaderScroll();
        initActiveNavLinks();
        initSmoothScroll();
        initCounters();
        initTiltEffect();
        initReadingProgress();
        initChecklist();
        initWorkflowStepper();
        initComparisonSlider();
        initFaqAccordion();
        initModuleFilter();
        initPartnerFilter();
        updateCopyrightYear();

        // Wait for GSAP to be ready (it's loaded with defer)
        if (typeof gsap !== 'undefined') {
            initScrollAnimations();
            initSVGPathDrawing();
        } else {
            // GSAP might not be loaded yet if deferred
            window.addEventListener('load', function () {
                if (checkGSAP()) {
                    initScrollAnimations();
                    initSVGPathDrawing();
                }
            });
        }

        // Reading progress bar (blog posts)
        var progressBar = document.getElementById('readingProgress');
        if (progressBar) {
            window.addEventListener('scroll', function () {
                var docHeight = document.documentElement.scrollHeight - window.innerHeight;
                if (docHeight > 0) {
                    progressBar.style.width = (window.scrollY / docHeight) * 100 + '%';
                }
            });
        }
    });

})();
