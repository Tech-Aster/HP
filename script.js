// ========== 株式会社テックアスター — script.js ==========


// ========== 1. ヘッダースクロール ==========
function initHeroStars() {
    const sky = document.querySelector('.hero-sky');
    if (!sky) return;

    const starPoints = [4, 8, 10, 12];
    const starColors = [
        { color: '#ff7043', glow: 'rgba(255, 112, 67, 0.6)' },
        { color: '#f43f5e', glow: 'rgba(244, 63, 94, 0.6)' },
        { color: '#ffffff', glow: 'rgba(255, 255, 255, 0.55)' },
        { color: '#c084fc', glow: 'rgba(192, 132, 252, 0.6)' }
    ];

    const createStarShape = pointCount => {
        const vertices = [];
        for (let i = 0; i < pointCount * 2; i++) {
            const angle = (i * Math.PI) / pointCount - Math.PI / 2;
            const radius = i % 2 === 0 ? 50 : 23;
            const x = 50 + Math.cos(angle) * radius;
            const y = 50 + Math.sin(angle) * radius;
            vertices.push(`${x.toFixed(1)}% ${y.toFixed(1)}%`);
        }
        return `polygon(${vertices.join(', ')})`;
    };

    const starCount = 18;
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('span');
        const duration = 3 + Math.random() * 4;
        const color = starColors[Math.floor(Math.random() * starColors.length)];
        const points = starPoints[Math.floor(Math.random() * starPoints.length)];
        const setRandomPosition = () => {
            star.style.setProperty('--star-x', `${Math.random() * 96 + 2}%`);
            star.style.setProperty('--star-y', `${Math.random() * 96 + 2}%`);
        };

        star.className = 'hero-sky__star';
        star.style.setProperty('--star-shape', createStarShape(points));
        star.style.setProperty('--star-color', color.color);
        star.style.setProperty('--star-glow-color', color.glow);
        star.style.setProperty('--star-size', `${(3.5 + Math.random() * 6.5).toFixed(1)}px`);
        star.style.setProperty('--star-glow', `${(4 + Math.random() * 8)}px`);
        star.style.setProperty('--twinkle-duration', `${duration.toFixed(2)}s`);
        star.style.setProperty('--twinkle-delay', `-${(Math.random() * duration).toFixed(2)}s`);
        setRandomPosition();
        star.addEventListener('animationiteration', setRandomPosition);
        sky.appendChild(star);
    }
}

function initRepresentativeNetwork() {
    const svg = document.querySelector('.representative-intro__network');
    if (!svg) return;

    const namespace = 'http://www.w3.org/2000/svg';
    const starsGroup = svg.querySelector('.representative-intro__stars');
    const connectionsGroup = svg.querySelector('.representative-intro__connections');
    if (!starsGroup || !connectionsGroup) return;

    const colors = [
        { fill: '#ff7043', glow: 'rgba(255, 112, 67, 0.9)' },
        { fill: '#f43f5e', glow: 'rgba(244, 63, 94, 0.9)' },
        { fill: '#ffffff', glow: 'rgba(255, 255, 255, 0.9)' },
        { fill: '#c084fc', glow: 'rgba(192, 132, 252, 0.9)' }
    ];
    const shapes = [
        { points: 4, inner: 0.16, scaleX: 0.72, scaleY: 1.5 },
        { points: 4, inner: 0.32, scaleX: 1, scaleY: 1 },
        { points: 5, inner: 0.42, scaleX: 1, scaleY: 1 },
        { points: 6, inner: 0.38, scaleX: 1, scaleY: 1 },
        { points: 8, inner: 0.5, scaleX: 1, scaleY: 1 },
        { points: 10, inner: 0.58, scaleX: 1, scaleY: 1 }
    ];
    const randomBetween = (min, max) => min + Math.random() * (max - min);
    const createStarPath = (shape, radius) => {
        const coordinates = [];
        for (let i = 0; i < shape.points * 2; i++) {
            const angle = (i * Math.PI) / shape.points - Math.PI / 2;
            const pointRadius = radius * (i % 2 === 0 ? 1 : shape.inner);
            const x = Math.cos(angle) * pointRadius * shape.scaleX;
            const y = Math.sin(angle) * pointRadius * shape.scaleY;
            coordinates.push(`${i === 0 ? 'M' : 'L'}${x.toFixed(2)} ${y.toFixed(2)}`);
        }
        return `${coordinates.join(' ')} Z`;
    };

    const stars = Array.from({ length: 36 }, () => {
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        const color = colors[Math.floor(Math.random() * colors.length)];
        const x = randomBetween(14, 806);
        const y = randomBetween(12, 148);
        const radius = randomBetween(2.4, 4.2);
        const element = document.createElementNS(namespace, 'path');

        element.setAttribute('class', 'representative-intro__star');
        element.setAttribute('d', createStarPath(shape, radius));
        element.setAttribute('transform', `translate(${x.toFixed(2)} ${y.toFixed(2)})`);
        element.setAttribute('fill', color.fill);
        element.style.filter = `drop-shadow(0 0 4px ${color.glow})`;
        element.style.opacity = '0';
        starsGroup.appendChild(element);

        return {
            x,
            y,
            element,
            phase: randomBetween(0, Math.PI * 2),
            speed: randomBetween(0.65, 1.2),
            opacity: 0
        };
    });

    const order = stars.map((_, index) => index);
    for (let i = order.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [order[i], order[j]] = [order[j], order[i]];
    }

    const connections = [];
    for (let i = 0; i < order.length; i++) {
        const from = stars[order[i]];
        const to = stars[order[(i + 1) % order.length]];
        const line = document.createElementNS(namespace, 'line');
        line.setAttribute('x1', from.x.toFixed(2));
        line.setAttribute('y1', from.y.toFixed(2));
        line.setAttribute('x2', to.x.toFixed(2));
        line.setAttribute('y2', to.y.toFixed(2));
        line.style.opacity = '0';
        connectionsGroup.appendChild(line);
        connections.push({ element: line, from, to });
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        stars.forEach(star => { star.element.style.opacity = '0.8'; });
        connections.forEach(connection => { connection.element.style.opacity = '0.28'; });
        return;
    }

    const animate = timestamp => {
        const elapsed = timestamp / 1000;
        stars.forEach(star => {
            const wave = (Math.sin(elapsed * star.speed + star.phase) + 1) / 2;
            star.opacity = Math.max(0, (wave - 0.12) / 0.88);
            star.element.style.opacity = star.opacity.toFixed(3);
        });
        connections.forEach(connection => {
            const opacity = Math.min(connection.from.opacity, connection.to.opacity) * 0.45;
            connection.element.style.opacity = opacity.toFixed(3);
        });
        requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
}

function initHeader() {
    const header = document.getElementById('header');
    if (!header || header.classList.contains('header--scrolled')) return;
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
    initHeroStars();
    initRepresentativeNetwork();
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
