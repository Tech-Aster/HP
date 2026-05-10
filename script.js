// ========== TechAster LP — script.js ==========

// ========== 1. スクロール進行バー ==========
function initScrollProgress() {
    const bar = document.getElementById('scrollProgress');
    if (!bar) return;
    window.addEventListener('scroll', () => {
        const total = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.width = (total > 0 ? (window.scrollY / total) * 100 : 0) + '%';
    }, { passive: true });
}

// ========== 2. ヘッダースクロール ==========
function initHeader() {
    const header = document.getElementById('header');
    if (!header) return;
    window.addEventListener('scroll', () => {
        header.classList.toggle('header--scrolled', window.scrollY > 30);
    }, { passive: true });
}

// ========== 3. アクティブナビ ==========
function initActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.navbar__menu a[href^="#"]');
    if (!sections.length || !navLinks.length) return;

    const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                navLinks.forEach(a => {
                    a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
                });
            }
        });
    }, { threshold: 0.4 });

    sections.forEach(s => obs.observe(s));
}

// ========== 4. フェードインObserver ==========
function initFadeIn() {
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.fade-in').forEach(el => obs.observe(el));
}

// ========== 5. カウンターアニメーション ==========
function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    if (isNaN(target)) return;
    const dur = 1600;
    const start = performance.now();
    function step(now) {
        const t = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = Math.floor(eased * target);
        if (t < 1) requestAnimationFrame(step);
        else el.textContent = target;
    }
    requestAnimationFrame(step);
}

function initCounters() {
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.querySelectorAll('[data-target]').forEach(animateCounter);
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stats-section, .hero-section__trust').forEach(el => obs.observe(el));
}

// ========== 6. ハンバーガーメニュー ==========
function initMobileNav() {
    const toggle = document.getElementById('navToggle');
    const navbar = document.querySelector('.navbar');
    const menu = document.getElementById('primaryNav');
    if (!toggle || !navbar || !menu) return;

    toggle.addEventListener('click', () => {
        const open = navbar.classList.toggle('navbar--open');
        toggle.setAttribute('aria-expanded', String(open));
        if (open) {
            const first = menu.querySelector('a');
            if (first) first.focus();
        }
    });

    menu.addEventListener('click', e => {
        if (e.target.closest('a')) {
            navbar.classList.remove('navbar--open');
            toggle.setAttribute('aria-expanded', 'false');
        }
    });

    document.addEventListener('click', e => {
        if (!navbar.contains(e.target) && navbar.classList.contains('navbar--open')) {
            navbar.classList.remove('navbar--open');
            toggle.setAttribute('aria-expanded', 'false');
        }
    });
}

// ========== 7. スムーススクロール ==========
function initSmoothScroll() {
    const OFFSET = 80;
    document.addEventListener('click', e => {
        const link = e.target.closest('a[href^="#"]');
        if (!link) return;
        const id = link.getAttribute('href').slice(1);
        if (!id) return;
        const target = document.getElementById(id);
        if (!target) return;
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - OFFSET;
        window.scrollTo({ top, behavior: 'smooth' });
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
    });
}

// ========== 8. ケーススタディフィルター ==========
function initCaseFilter() {
    const buttons = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.case-card');
    if (!buttons.length || !cards.length) return;

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => {
                b.classList.remove('filter-btn--active');
                b.setAttribute('aria-selected', 'false');
            });
            btn.classList.add('filter-btn--active');
            btn.setAttribute('aria-selected', 'true');

            const filter = btn.dataset.filter;
            cards.forEach(card => {
                const show = filter === 'all' || card.dataset.category === filter;
                card.classList.toggle('hidden', !show);
                card.style.animation = show ? 'none' : '';
            });
        });
    });
}

// ========== 9. フローティングCTAボタン ==========
function initFloatingCta() {
    const cta = document.getElementById('floatingCta');
    if (!cta) return;
    window.addEventListener('scroll', () => {
        cta.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
}

// ========== 10. フォーム処理 ==========
function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone) {
    if (!phone.trim()) return true;
    return /^[\d\-+() ]+$/.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

function showFormMessage(msg, type) {
    const el = document.getElementById('form-message');
    if (!el) return;
    el.textContent = msg;
    el.className = `form-message ${type}`;
    el.hidden = false;
    setTimeout(() => { el.hidden = true; }, 6000);
}

async function handleFormSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);

    if (!validateEmail(data.get('email') || '')) {
        showFormMessage('有効なメールアドレスを入力してください。', 'error');
        return;
    }
    if (!validatePhone(data.get('phone') || '')) {
        showFormMessage('有効な電話番号を入力してください。', 'error');
        return;
    }

    const btn = form.querySelector('button[type="submit"]');
    if (btn) { btn.disabled = true; btn.textContent = '送信中...'; }

    await new Promise(r => setTimeout(r, 800));

    showFormMessage('お問い合わせを受け付けました。担当者より1営業日以内にご連絡いたします。', 'success');
    form.reset();
    const msgEl = document.getElementById('form-message');
    if (msgEl) msgEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    if (btn) { btn.disabled = false; btn.innerHTML = '送信する <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M2 8l11-5-5 11-1.5-4.5L2 8z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>'; }
}

function initForm() {
    const form = document.getElementById('contactForm');
    if (form) form.addEventListener('submit', handleFormSubmit);
}

// ========== 11. 統計バーアニメーション ==========
function initStatBars() {
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    document.querySelectorAll('.stat-card').forEach(el => obs.observe(el));
}

// ========== 12. 初期化 ==========
document.addEventListener('DOMContentLoaded', () => {
    initScrollProgress();
    initHeader();
    initActiveNav();
    initFadeIn();
    initCounters();
    initMobileNav();
    initSmoothScroll();
    initCaseFilter();
    initFloatingCta();
    initForm();
    initStatBars();
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { validateEmail, validatePhone };
}
