document.addEventListener('DOMContentLoaded', () => {
    initLoadingScreen();
    initSmoothScroll();
    initNavbarScroll();
    initAnimations();
    initLangSwitcher();
    initCounters();
    initMarquee();
    initReveal();
    initActions();
    initStatus();
    initContactForm();
});

/* Wire up data-action buttons (replaces inline onclick so a strict CSP can block inline JS) */
function initActions() {
    document.querySelectorAll('[data-action]').forEach((el) => {
        el.addEventListener('click', () => {
            const action = el.dataset.action;
            if (action === 'scroll-download') scrollToDownload();
            else if (action === 'toggle-download') toggleDownloadMenu(el);
        });
    });
}

function initReveal() {
    const els = document.querySelectorAll('.reveal');
    if (!els.length) return;
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); obs.unobserve(en.target); } });
    }, { threshold: 0.15 });
    els.forEach(el => obs.observe(el));
}

function initCounters() {
    const els = document.querySelectorAll('[data-count]');
    if (!els.length) return;
    const fmt = (n) => n >= 1000 ? Math.round(n).toLocaleString('en-US') : (n % 1 ? n.toFixed(1) : n);
    const run = (el) => {
        const target = parseFloat(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        const dur = 1600, start = performance.now();
        const step = (t) => {
            const p = Math.min((t - start) / dur, 1);
            const e = 1 - Math.pow(1 - p, 3);
            el.textContent = fmt(target * e) + suffix;
            if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    };
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(en => { if (en.isIntersecting) { run(en.target); obs.unobserve(en.target); } });
    }, { threshold: 0.4 });
    els.forEach(el => obs.observe(el));
}

function initMarquee() {
    const a = document.getElementById('marqueeA');
    const b = document.getElementById('marqueeB');
    if (!a && !b) return;
    const names = ['Brailonn','bird','beckkrypt','batman','Bam','Baiozin','aprendiz','ant','Amxn41','Alex','ALEEEE','ctay','Mech Kiryu','KaT!N','NovaLua','zephyr','kael','riftwalker','synthex','pix','m0 chi','vortex','quillon','draco','nyx'];
    const acts = ['Playing ROBLOX','Active on Discord','Executing scripts','Playing Crosshair X','Recently','Just attached'];
    const chip = (name, i) => `<div class="user-chip"><div class="user-avatar">${name[0].toUpperCase()}</div><div><div class="user-name">${name}</div><div class="user-status">${acts[i % acts.length]}</div></div></div>`;
    const fill = (el, off) => {
        const set = names.map((n, i) => chip(n, i + off)).join('');
        el.innerHTML = `<div class="marquee-track">${set}${set}</div>`;
    };
    if (a) fill(a, 0);
    if (b) fill(b, 3);
}

function initLoadingScreen() {
    setTimeout(() => {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) loadingScreen.style.display = 'none';
    }, 3000);
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

function scrollToDownload() {
    const el = document.getElementById('download');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function toggleDownloadMenu(btn) {
    const box = btn.closest('.download-box');
    if (!box) return;
    const open = box.classList.toggle('open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
}

/* Status page: keep the "last updated" line honest instead of a static claim */
function initStatus() {
    const el = document.querySelector('.update-time');
    if (!el) return;
    let secs = 0;
    const render = () => {
        const label = secs < 5 ? 'Just now'
            : secs < 60 ? secs + 's ago'
            : Math.floor(secs / 60) + 'm ago';
        el.textContent = 'Last updated: ' + label + ' • Auto-refreshes every 60 seconds';
    };
    render();
    setInterval(() => { secs += 1; if (secs >= 60) secs = 0; render(); }, 1000);
}

/* Support page: handle the contact form client-side (no backend) without reloading the page */
function initContactForm() {
    const form = document.querySelector('.contact-form form');
    if (!form) return;
    let feedback = form.querySelector('.form-feedback');
    if (!feedback) {
        feedback = document.createElement('div');
        feedback.className = 'form-feedback';
        feedback.setAttribute('role', 'status');
        feedback.setAttribute('aria-live', 'polite');
        form.appendChild(feedback);
    }
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!form.checkValidity()) { form.reportValidity(); return; }
        feedback.textContent = 'Thanks! Your message has been noted — for the fastest reply, reach us on Discord.';
        feedback.classList.add('show');
        form.reset();
    });
}

function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 100) {
            navbar.style.background = 'rgba(6, 7, 10, 0.88)';
            navbar.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.55)';
        } else {
            navbar.style.background = 'rgba(8, 9, 12, 0.72)';
            navbar.style.boxShadow = 'none';
        }
    }, { passive: true });
}

function initAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -100px 0px' });

    document.querySelectorAll('.feature-card, .nav-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}

function initLangSwitcher() {
    const switcher = document.querySelector('.lang-switcher');
    if (!switcher) return;
    const button = switcher.querySelector('.lang-button');
    const sync = () => button.setAttribute('aria-expanded', switcher.classList.contains('open') ? 'true' : 'false');
    button.addEventListener('click', (e) => {
        e.stopPropagation();
        switcher.classList.toggle('open');
        sync();
    });
    document.addEventListener('click', (e) => {
        if (!switcher.contains(e.target)) { switcher.classList.remove('open'); sync(); }
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') { switcher.classList.remove('open'); sync(); }
    });
}

document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function (e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
        ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
        ripple.classList.add('ripple');
        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    });
});

const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }
    @keyframes ripple-animation {
        to { transform: scale(4); opacity: 0; }
    }
`;
document.head.appendChild(rippleStyle);
