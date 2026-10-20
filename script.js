// ========== 株式会社テックアスター — script.js ==========


// ========== 1. ヘッダースクロール ==========
function initHeader() {
    const header = document.getElementById('header');
    if (!header) return;
    window.addEventListener('scroll', () => {
        header.classList.toggle('header--scrolled', window.scrollY > 30);
    }, { passive: true });
}

// ========== 2. アクティブナビ ==========
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

// ========== 3. フェードインObserver ==========
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


// ========== 4. ハンバーガーメニュー ==========
function initMobileNav() {
    const toggle = document.getElementById('navToggle');
    const navbar = document.querySelector('.navbar');
    const menu = document.getElementById('primaryNav');
    if (!toggle || !navbar || !menu) return;

    toggle.addEventListener('click', () => {
        const open = navbar.classList.toggle('navbar--open');
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', open ? 'ナビゲーションを閉じる' : 'ナビゲーションを開く');
        if (open) {
            const first = menu.querySelector('a');
            if (first) first.focus();
        }
    });

    menu.addEventListener('click', e => {
        if (e.target.closest('a')) {
            navbar.classList.remove('navbar--open');
            toggle.setAttribute('aria-expanded', 'false');
            toggle.setAttribute('aria-label', 'ナビゲーションを開く');
        }
    });

    document.addEventListener('click', e => {
        if (!navbar.contains(e.target) && navbar.classList.contains('navbar--open')) {
            navbar.classList.remove('navbar--open');
            toggle.setAttribute('aria-expanded', 'false');
            toggle.setAttribute('aria-label', 'ナビゲーションを開く');
        }
    });
}

// ========== 5. スムーススクロール ==========
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



// ========== 6. フォーム処理 ==========
const MIN_FILL_SECONDS = 5;
let formLoadTime = 0;

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone) {
    if (!phone.trim()) return true;
    return /^[\d\-+() ]+$/.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

function showFormMessage(msg, type, autoHide) {
    const el = document.getElementById('form-message');
    if (!el) return;
    el.textContent = msg;
    el.className = `form-message ${type}`;
    el.hidden = false;
    el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    if (autoHide) setTimeout(() => { el.hidden = true; }, 8000);
}

// 必須項目・形式のチェック(問題があればメッセージを返す)
function validateContactForm(form, data) {
    const text = key => (data.get(key) || '').trim();
    if (!text('company_name')) return '企業名を入力してください。';
    if (!text('contact_name')) return 'ご担当者名を入力してください。';
    if (!validateEmail(text('email'))) return '有効なメールアドレスを入力してください。';
    if (!validatePhone(text('phone'))) return '有効な電話番号を入力してください。';
    if (!text('service_type')) return 'ご相談内容を選択してください。';
    if (!text('message')) return 'お問い合わせ内容を入力してください。';
    if (!form.privacy_agree.checked) return 'プライバシーポリシーへの同意が必要です。';
    return '';
}

async function handleFormSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);

    // ボット対策①：人には見えない欄が埋まっていたら送信しない
    if (data.get('_gotcha')) return;

    const error = validateContactForm(form, data);
    if (error) {
        showFormMessage(error, 'error');
        return;
    }

    // ボット対策②：表示直後の送信は待ってもらう(理由を表示する)
    const elapsed = (Date.now() - formLoadTime) / 1000;
    if (elapsed < MIN_FILL_SECONDS) {
        showFormMessage('入力内容を確認しています。数秒おいて、もう一度「送信する」を押してください。', 'error');
        return;
    }

    const btn = form.querySelector('button[type="submit"]');
    if (btn) { btn.disabled = true; btn.textContent = '送信中...'; }

    try {
        const res = await fetch(form.action, {
            method: 'POST',
            body: data,
            headers: { 'Accept': 'application/json' }
        });
        if (res.ok) {
            showFormMessage('お問い合わせを受け付けました。内容を確認し、ご連絡します。', 'success', true);
            form.reset();
            formLoadTime = Date.now();
        } else {
            showFormMessage('送信できませんでした。お手数ですが、info@techaster.com へ直接ご連絡ください。', 'error');
        }
    } catch {
        showFormMessage('送信できませんでした。お手数ですが、info@techaster.com へ直接ご連絡ください。', 'error');
    } finally {
        if (btn) { btn.disabled = false; btn.textContent = '送信する'; }
    }
}

function initForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    formLoadTime = Date.now();
    form.addEventListener('submit', handleFormSubmit);
}

// ========== 7. 初期化 ==========
document.addEventListener('DOMContentLoaded', () => {
    initHeader();
    initActiveNav();
    initFadeIn();
    initMobileNav();
    initSmoothScroll();
    initForm();
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { validateEmail, validatePhone };
}
