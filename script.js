// ============================================
// CharMinder Portfolio - Scroll Evolution Engine
// ============================================

(function () {
    'use strict';

    // --- Fire Particles ---
    const particlesContainer = document.getElementById('particles-container');
    const PARTICLE_COUNT = 25;

    function createParticle() {
        const particle = document.createElement('div');
        particle.classList.add('fire-particle');

        const size = Math.random() * 6 + 2;
        const x = Math.random() * 100;
        const duration = Math.random() * 6 + 4;
        const delay = Math.random() * 6;
        const hue = Math.random() * 40 + 10; // orange-yellow range

        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.left = x + '%';
        particle.style.bottom = '-10px';
        particle.style.background = `hsl(${hue}, 90%, 55%)`;
        particle.style.boxShadow = `0 0 ${size * 2}px hsl(${hue}, 90%, 55%)`;
        particle.style.animationDuration = duration + 's';
        particle.style.animationDelay = delay + 's';

        particlesContainer.appendChild(particle);
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        createParticle();
    }

    // --- Evolution Stage Tracking ---
    const sections = {
        charmander: document.getElementById('charmander-section'),
        charmeleon: document.getElementById('charmeleon-section'),
        charizard: document.getElementById('charizard-section'),
    };

    const evoFlash1 = document.getElementById('evo-flash-1');
    const evoFlash2 = document.getElementById('evo-flash-2');

    const evoDots = document.querySelectorAll('.evo-dot');
    const evoLineFills = document.querySelectorAll('.evo-line-fill');

    function getScrollProgress() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        return docHeight > 0 ? scrollTop / docHeight : 0;
    }

    function getCurrentStage(progress) {
        if (progress < 0.3) return 0;   // Charmander
        if (progress < 0.65) return 1;  // Charmeleon
        return 2;                        // Charizard
    }

    function updateEvoTracker(progress) {
        const stage = getCurrentStage(progress);

        evoDots.forEach(function (dot, i) {
            dot.classList.remove('active', 'completed');
            if (i < stage) {
                dot.classList.add('completed');
            } else if (i === stage) {
                dot.classList.add('active');
            }
        });

        // Fill the lines between dots
        evoLineFills.forEach(function (fill, i) {
            if (i < stage) {
                fill.style.height = '100%';
            } else if (i === stage) {
                // Partial fill based on progress within the stage
                var stageProgress;
                if (stage === 0) {
                    stageProgress = progress / 0.3;
                } else if (stage === 1) {
                    stageProgress = (progress - 0.3) / 0.35;
                } else {
                    stageProgress = 1;
                }
                fill.style.height = Math.min(stageProgress * 100, 100) + '%';
            } else {
                fill.style.height = '0%';
            }
        });
    }

    // --- Evolution Flash Visibility ---
    function checkEvoFlash(element) {
        var rect = element.getBoundingClientRect();
        var windowHeight = window.innerHeight;
        if (rect.top < windowHeight * 0.8 && rect.bottom > 0) {
            element.classList.add('visible');
        }
    }

    // --- Scroll Reveal ---
    function initRevealElements() {
        // Add reveal class to elements that should animate in
        var revealSelectors = [
            '.pokedex-card',
            '.skills-grid',
            '.project-card',
            '.contact-section',
            '.legendary-card',
        ];

        revealSelectors.forEach(function (selector) {
            document.querySelectorAll(selector).forEach(function (el) {
                el.classList.add('reveal');
            });
        });
    }

    function checkReveals() {
        document.querySelectorAll('.reveal').forEach(function (el) {
            var rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.85) {
                el.classList.add('visible');
            }
        });
    }

    // --- Timeline Items ---
    function checkTimeline() {
        document.querySelectorAll('.timeline-item').forEach(function (item) {
            var rect = item.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.85) {
                item.classList.add('visible');
            }
        });
    }

    // --- Stat Bars Animation ---
    var statsAnimated = false;

    function checkStatBars() {
        if (statsAnimated) return;

        var statsBody = document.querySelector('.stats-body');
        if (!statsBody) return;

        var rect = statsBody.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.8) {
            statsAnimated = true;
            document.querySelectorAll('.stat-fill').forEach(function (bar) {
                var value = bar.getAttribute('data-value');
                // Slight stagger
                setTimeout(function () {
                    bar.style.width = value + '%';
                }, Math.random() * 300);
            });
        }
    }

    // --- Tail Flame Intensity ---
    var tailFlame = document.getElementById('tail-flame');

    function updateFlameIntensity(progress) {
        if (!tailFlame) return;
        // Flame gets bigger as you scroll
        var scale = 1 + progress * 0.8;
        var blur = 1 + progress * 3;
        tailFlame.style.transform = 'scale(' + scale + ')';
        tailFlame.style.filter = 'blur(' + blur + 'px)';
    }

    // --- Side Nav Click Handlers ---
    document.querySelectorAll('.evo-stage').forEach(function (stage) {
        stage.addEventListener('click', function () {
            var target = stage.getAttribute('data-stage');
            var section = sections[target];
            if (section) {
                section.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // --- Particle intensity based on scroll ---
    function updateParticleIntensity(progress) {
        var opacity = 0.3 + progress * 0.7;
        particlesContainer.style.opacity = opacity;
    }

    // --- Main Scroll Handler ---
    var ticking = false;

    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(function () {
                var progress = getScrollProgress();

                updateEvoTracker(progress);
                updateFlameIntensity(progress);
                updateParticleIntensity(progress);

                checkEvoFlash(evoFlash1);
                checkEvoFlash(evoFlash2);
                checkReveals();
                checkTimeline();
                checkStatBars();

                ticking = false;
            });
            ticking = true;
        }
    }

    // --- Init ---
    function init() {
        initRevealElements();

        // Initial check
        onScroll();

        window.addEventListener('scroll', onScroll, { passive: true });

        // Resize handler
        window.addEventListener('resize', function () {
            onScroll();
        }, { passive: true });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
