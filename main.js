/* ============================================
   TECNOTOTAL — MAIN.JS  (Premium)
   ============================================ */

const WA_NUMBER = "528116360046";

/* Arrancar de inmediato */
initLoader();

/* ── LOADER ─────────────────────────────────────────── */
function initLoader() {
    const loader = document.getElementById('loader');
    const arc    = document.getElementById('loaderArc');
    const pct    = document.getElementById('loaderPct');
    if (!loader) { boot(); return; }

    const TOTAL = 144.5; // 2π × 23 (radio del SVG)
    const steps = [22, 45, 68, 88, 100];
    let i = 0;

    function next() {
        if (i >= steps.length) {
            setTimeout(() => {
                loader.classList.add('out');
                setTimeout(() => { loader.remove(); }, 1000);
                boot();
            }, 320);
            return;
        }
        const p = steps[i++];
        if (arc) arc.style.strokeDashoffset = TOTAL - (TOTAL * p / 100);
        if (pct) pct.textContent = p + '%';
        setTimeout(next, i === 1 ? 320 : 260);
    }

    setTimeout(next, 200);
}

/* ── BOOT ───────────────────────────────────────────── */
function boot() {
    if (typeof lucide !== 'undefined') lucide.createIcons();

    initCursor();
    initScrollLine();
    initNavbar();
    initMobileMenu();
    initHeroCanvas();
    initHeroReveal();
    initScrollReveal();
    initCardGlow();
    initTilt();
    initMagnetic();
    initCounters();
    initTypewriter();
    initForm();
    initFAB();

    /* GSAP parallax (opcional) */
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        gsap.to('.hero-center', {
            y: -50, opacity: .6, ease: 'none',
            scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.2 }
        });
    }
}

/* ── CURSOR ─────────────────────────────────────────── */
function initCursor() {
    const dot  = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');
    if (!dot || !ring || window.matchMedia('(pointer:coarse)').matches) return;

    let mx = 0, my = 0, rx = 0, ry = 0;
    document.addEventListener('mousemove', e => {
        mx = e.clientX; my = e.clientY;
        dot.style.transform = `translate(${mx}px,${my}px)`;
    });
    (function lp() {
        rx += (mx - rx) * 0.1; ry += (my - ry) * 0.1;
        ring.style.transform = `translate(${rx}px,${ry}px)`;
        requestAnimationFrame(lp);
    })();
    document.querySelectorAll('a,button,.svc-card,input,select,textarea').forEach(el => {
        el.addEventListener('mouseenter', () => ring.classList.add('hover'));
        el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
    });
    document.addEventListener('mousedown', () => ring.classList.add('click'));
    document.addEventListener('mouseup',   () => ring.classList.remove('click'));
}

/* ── SCROLL LINE ────────────────────────────────────── */
function initScrollLine() {
    const line = document.getElementById('scroll-line');
    if (!line) return;
    window.addEventListener('scroll', () => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        if (max > 0) line.style.width = (window.scrollY / max * 100) + '%';
    }, { passive: true });
}

/* ── NAVBAR ─────────────────────────────────────────── */
function initNavbar() {
    const nav = document.getElementById('navbar');
    if (!nav) return;
    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });
}

/* ── MOBILE MENU ────────────────────────────────────── */
function initMobileMenu() {
    const btn  = document.getElementById('hamburger');
    const menu = document.getElementById('mobileMenu');
    if (!btn || !menu) return;
    btn.addEventListener('click', () => {
        const open = menu.classList.toggle('open');
        btn.classList.toggle('open', open);
        document.body.style.overflow = open ? 'hidden' : '';
    });
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
        menu.classList.remove('open');
        btn.classList.remove('open');
        document.body.style.overflow = '';
    }));
}

/* ── HERO CANVAS — DOT GRID CON GLOW ───────────────── */
function initHeroCanvas() {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let dots = [], mouse = { x: -999, y: -999 }, time = 0;

    function resize() {
        canvas.width  = canvas.offsetWidth  || window.innerWidth;
        canvas.height = canvas.offsetHeight || window.innerHeight;
        buildDots();
    }

    function buildDots() {
        dots = [];
        const sp = 46;
        const cols = Math.ceil(canvas.width  / sp) + 1;
        const rows = Math.ceil(canvas.height / sp) + 1;
        for (let r = 0; r < rows; r++)
            for (let c = 0; c < cols; c++)
                dots.push({ x: c * sp, y: r * sp, ph: Math.random() * Math.PI * 2, spd: .4 + Math.random() * .6 });
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        time += 0.012;
        for (const d of dots) {
            const dx = mouse.x - d.x, dy = mouse.y - d.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            const prox = Math.max(0, 1 - dist / 190);
            const pulse = Math.sin(time * d.spd + d.ph) * .5 + .5;
            const opacity = .07 + pulse * .06 + prox * .72;
            const size = 1.5 + prox * 4.5 + pulse * .4;

            ctx.beginPath();
            ctx.arc(d.x, d.y, size, 0, Math.PI * 2);

            if (prox > 0.04) {
                ctx.fillStyle = `rgba(21, 101, 192, ${opacity})`;
            } else {
                ctx.fillStyle = `rgba(70, 72, 90, ${opacity})`;
            }
            ctx.fill();
        }
        requestAnimationFrame(draw);
    }

    const hero = document.getElementById('hero');
    if (hero) {
        hero.addEventListener('mousemove', e => {
            const r = canvas.getBoundingClientRect();
            mouse.x = e.clientX - r.left;
            mouse.y = e.clientY - r.top;
        });
        hero.addEventListener('mouseleave', () => { mouse.x = -999; mouse.y = -999; });
    }

    new ResizeObserver(resize).observe(hero || document.body);
    resize();
    draw();
}

/* ── HERO REVEAL ────────────────────────────────────── */
function initHeroReveal() {
    const badge  = document.getElementById('heroBadge');
    const words  = document.querySelectorAll('.hw');
    const sub    = document.getElementById('heroSub');
    const ctas   = document.getElementById('heroCtas');
    const stats  = document.getElementById('heroStats');
    const scroll = document.querySelector('.hero-scroll-hint');

    setTimeout(() => badge?.classList.add('in'),  700);
    words.forEach((w, i) => setTimeout(() => w.classList.add('in'), 1000 + i * 180));
    setTimeout(() => sub?.classList.add('in'),    1600);
    setTimeout(() => ctas?.classList.add('in'),   1750);
    setTimeout(() => stats?.classList.add('in'),  1900);
    setTimeout(() => scroll?.classList.add('in'), 2300);
}

/* ── SCROLL REVEAL (IntersectionObserver) ───────────── */
function initScrollReveal() {
    const io = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -48px 0px' });

    document.querySelectorAll('.reveal-up').forEach(el => io.observe(el));
}

/* ── MOUSE GLOW EN CARDS ────────────────────────────── */
function initCardGlow() {
    document.querySelectorAll('.svc-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const r = card.getBoundingClientRect();
            card.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
            card.style.setProperty('--my', ((e.clientY - r.top)  / r.height * 100) + '%');
        });
    });
}

/* ── TILT SUAVE EN CARDS ────────────────────────────── */
function initTilt() {
    document.querySelectorAll('.svc-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const r = card.getBoundingClientRect();
            const x = (e.clientX - r.left) / r.width  - .5;
            const y = (e.clientY - r.top)  / r.height - .5;
            card.style.transform = `perspective(800px) rotateX(${y * -4}deg) rotateY(${x * 4}deg) translateY(-3px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transition = 'transform .6s cubic-bezier(.34,1.56,.64,1), border-color .4s';
            card.style.transform  = '';
            setTimeout(() => card.style.transition = '', 600);
        });
    });
}

/* ── MAGNETIC ───────────────────────────────────────── */
function initMagnetic() {
    document.querySelectorAll('.magnetic').forEach(el => {
        el.addEventListener('mousemove', e => {
            const r  = el.getBoundingClientRect();
            const dx = (e.clientX - r.left - r.width  / 2) * 0.25;
            const dy = (e.clientY - r.top  - r.height / 2) * 0.25;
            el.style.transform = `translate(${dx}px,${dy}px)`;
        });
        el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });
}

/* ── CONTADORES ─────────────────────────────────────── */
function initCounters() {
    const nums = document.querySelectorAll('.stat-num[data-target]');
    if (!nums.length) return;

    const io = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (!e.isIntersecting) return;
            const el     = e.target;
            const target = parseFloat(el.dataset.target);
            const prefix = el.dataset.prefix || '';
            const suffix = el.dataset.suffix || '';
            const dec    = target % 1 !== 0 ? 1 : 0;
            const dur    = 1600;
            const t0     = performance.now();

            function tick(now) {
                const p = Math.min((now - t0) / dur, 1);
                el.textContent = prefix + (target * (1 - Math.pow(1 - p, 3))).toFixed(dec) + suffix;
                if (p < 1) requestAnimationFrame(tick);
            }
            requestAnimationFrame(tick);

            /* Barra */
            const bar = el.closest('.stat-item')?.querySelector('.stat-bar');
            if (bar) {
                bar.style.setProperty('--w', bar.dataset.w || 100);
                setTimeout(() => bar.classList.add('go'), 80);
            }
            io.unobserve(el);
        });
    }, { threshold: 0.5 });

    nums.forEach(el => io.observe(el));
}

/* ── TYPEWRITER CÍCLICO ─────────────────────────────── */
function initTypewriter() {
    const tw    = document.getElementById('heroTw');
    const word  = document.getElementById('htCycle');
    const word2 = document.getElementById('twWord');

    const words = [
        'Seguridad',
        'Redes',
        'Energía Solar',
        'Control de Acceso',
        'Cómputo',
        'Alarmas',
    ];

    let idx = 0, char = 0, deleting = false;

    function tick() {
        const current = words[idx];

        if (!deleting) {
            char++;
            const slice = current.slice(0, char);
            if (word)  word.textContent  = slice;
            if (word2) word2.textContent = slice;
            if (char === current.length) {
                setTimeout(() => { deleting = true; tick(); }, 2000);
                return;
            }
            setTimeout(tick, 75);
        } else {
            char--;
            const slice = current.slice(0, char);
            if (word)  word.textContent  = slice;
            if (word2) word2.textContent = slice;
            if (char === 0) {
                deleting = false;
                idx = (idx + 1) % words.length;
                setTimeout(tick, 350);
                return;
            }
            setTimeout(tick, 42);
        }
    }

    if (tw) tw.classList.add('in');
    tick();
}

/* ── FORMULARIO → WHATSAPP ──────────────────────────── */
function initForm() {
    const form = document.getElementById('waForm');
    if (!form) return;

    form.addEventListener('submit', async e => {
        e.preventDefault();
        const btn     = document.getElementById('submitBtn');
        const bsNorm  = btn?.querySelector('.bst-normal');
        const bsLoad  = btn?.querySelector('.bst-loading');
        const nombre  = document.getElementById('nombre')?.value.trim();
        const empresa = document.getElementById('empresa')?.value.trim();
        const servicio = document.getElementById('servicio')?.value;
        const mensaje = document.getElementById('mensaje')?.value.trim();

        if (!nombre || !servicio || !mensaje) { shake(form); return; }

        if (btn)    btn.disabled = true;
        if (bsNorm) bsNorm.style.display = 'none';
        if (bsLoad) bsLoad.style.display = 'flex';

        await new Promise(r => setTimeout(r, 700));

        let txt = `*NUEVO CONTACTO — TecnoTotal*\n\n*Nombre:* ${nombre}\n`;
        if (empresa) txt += `*Empresa:* ${empresa}\n`;
        txt += `*Servicio:* ${servicio}\n\n*Mensaje:*\n${mensaje}`;

        window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(txt)}`, '_blank');

        if (btn)    btn.disabled = false;
        if (bsNorm) bsNorm.style.display = 'flex';
        if (bsLoad) bsLoad.style.display = 'none';
        form.reset();
    });
}

function shake(el) {
    const s = [8,-6,5,-4,2,0]; let i = 0;
    const iv = setInterval(() => {
        el.style.transform = `translateX(${s[i]}px)`;
        if (++i >= s.length) { clearInterval(iv); el.style.transform = ''; }
    }, 45);
}

/* ── FAB WHATSAPP ───────────────────────────────────── */
function initFAB() {
    const fab = document.getElementById('fabWa');
    if (!fab) return;
    fab.addEventListener('click', e => {
        e.preventDefault();
        window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('Hola, me interesa conocer sus servicios.')}`, '_blank');
    });
}
