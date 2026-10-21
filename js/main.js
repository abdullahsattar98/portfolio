/* abdullahsattar.online homepage
   Signature: the visitor's path. One lime line, drawn by the scroll, that
   wanders in the hero, is rebuilt from scattered dots in the problem act,
   threads the steps, and comes down as a zigzag that pops open into the
   contact card. */
(() => {
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const FINE = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const ease = t => 1 - Math.pow(1 - t, 3);
  const easeIO = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const hasGsap = !!window.gsap;
  const ANIM = hasGsap && !RM;
  if (hasGsap) { gsap.registerPlugin(ScrollTrigger); gsap.config({ nullTargetWarn: false }); }

  /* ---------- smooth scroll ---------- */
  let lenis = null;
  if (!RM && window.Lenis && hasGsap) {
    lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1 });
    window._lenis = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  const goTo = (target) => {
    let el = target === '#top' ? document.body : $(target);
    if (!el) return;
    let offset = -20;
    // "Book a free call" lands on the contact card itself, so the zigzag finishes and the card opens
    if (target === '#contact') { el = $('#pop'); offset = -Math.round(innerHeight * .12); }
    if (lenis) lenis.scrollTo(el === document.body ? 0 : el, { offset: el === document.body ? 0 : offset, duration: 1.4 });
    else if (el === document.body) window.scrollTo({ top: 0 });
    else el.scrollIntoView();
  };
  $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (!id.startsWith('#') || id.length < 2) return; // WhatsApp links get a real address later
    e.preventDefault();
    closeMenu();
    goTo(id);
    if (id !== '#top') history.replaceState(null, '', id);
    if (id === '#contact') setTimeout(() => $('#f-name').focus({ preventScroll: true }), lenis ? 1500 : 50);
  }));

  /* ---------- nav ---------- */
  const nav = $('#nav');
  const setNav = () => nav.classList.toggle('is-solid', scrollY > 40);
  addEventListener('scroll', setNav, { passive: true }); setNav();
  const menuBtn = $('#menuBtn'), menu = $('#mobileMenu');
  function closeMenu() { if (!menu || menu.hidden) return; menu.hidden = true; menuBtn.setAttribute('aria-expanded', 'false'); menuBtn.querySelector('.sr').textContent = 'Open menu'; lenis && lenis.start(); }
  menuBtn.addEventListener('click', () => {
    const open = menu.hidden;
    menu.hidden = !open;
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.querySelector('.sr').textContent = open ? 'Close menu' : 'Open menu';
    if (open) { lenis && lenis.stop(); menu.querySelector('a').focus(); } else lenis && lenis.start();
  });
  addEventListener('keydown', e => { if (e.key === 'Escape') { closeMenu(); } });

  /* ---------- the path ---------- */
  const rel = (el, sec) => {
    let x = 0, y = 0, e = el;
    while (e && e !== sec) { x += e.offsetLeft; y += e.offsetTop; e = e.offsetParent; }
    return { x, y, w: el.offsetWidth, h: el.offsetHeight, r: x + el.offsetWidth, b: y + el.offsetHeight };
  };
  // Catmull-Rom through points, as cubic beziers
  const spline = pts => {
    let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
      const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
      const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
      d += ` C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
    }
    return d;
  };
  // phone: the line hugs one screen edge with a gentle wave, so it never runs through text
  const edgeHug = (w, h, x, amp) => {
    const pts = [[x, -30]];
    for (let y = 120; y < h; y += 240) pts.push([x + (pts.length % 2 ? amp : -amp), y]);
    pts.push([x, h + 30]);
    return pts;
  };
  // his cutout, measured without the centring transform
  const meRect = sec => {
    const img = $('.hero__me', sec), st = rel($('#heroStage'), sec);
    const w = img.offsetWidth, h = img.offsetHeight;
    const x = st.x + img.offsetLeft - w / 2, y = st.y + img.offsetTop;
    return { x, y, w, h, r: x + w, b: y + h };
  };
  const builders = {
    hero(sec, w, h) {
      const m = meRect(sec);
      const foot = rel($('.hero__foot', sec), sec), ctas = rel($('.hero__ctas', sec), sec);
      const L = -sec.offsetLeft - 40;
      const stacked = w < 901;
      const copyR = Math.max(rel($('.hero__title', sec), sec).r, rel($('.hero__sub', sec), sec).r) + 28;
      const P = (x, y) => { const p = [m.x + m.w * x, m.y + m.h * y]; if (!stacked) p[0] = Math.max(p[0], copyR); return p; };
      const base = (ctas.b + foot.y) / 2;
      if (stacked) return [
        [L, m.y + m.h * .7], P(.3, .86), P(1.06, .78), P(1.12, .4), P(.78, -.04), P(.36, 0), P(.06, .3), P(0, .6), [L - 20, m.y + m.h * .82],
      ];
      return [
        [L, stacked ? m.y + m.h * .9 : base + 6],
        stacked ? [w * .2, m.y + m.h * .95] : [ctas.r + 40, base - 4],
        P(.30, .93), P(1.08, .84), P(1.14, .40), P(.78, -.04), P(.36, 0), P(.08, .30), P(0, .62),
        [m.x + m.w * .1, h + 30],
      ];
    },
    process(sec, w, h) {
      const head = rel($('.process__head', sec), sec);
      const steps = $$('.step', sec).map(s => rel(s, sec));
      const phone = w < 761, tab = w < 1101;
      const top0 = Math.min(...steps.map(s => s.y));
      const pts = phone || tab ? [[w * .45, -30], [w - 10, head.b + 30]] : [[w * .56, -30], [w * .56, head.y + head.h * .5], [w * .32, (head.b + top0) / 2]];
      if (phone) {
        const z = [[w - 8, -30], [w - 8, head.b + 6]];
        steps.forEach((s, i) => z.push([i % 2 ? w * .1 : w * .9, s.y + s.h * .5]));
        z.push([w * .5, h + 30]);
        return z;
      }
      if (tab) {
        steps.forEach((s, i) => pts.push([i % 2 ? w - 10 : 10, s.y + s.h * .5]));
      } else {
        const top = Math.min(...steps.map(s => s.y)) - 46, bot = Math.max(...steps.map(s => s.b)) + 46;
        pts.push([steps[0].x - 30, (top + bot) / 2]);
        for (let i = 0; i < steps.length - 1; i++) pts.push([(steps[i].r + steps[i + 1].x) / 2, i % 2 ? top : bot]);
        pts.push([steps[3].r + 30, (top + bot) / 2]);
      }
      pts.push([w * .5, h + 30]);
      return pts;
    },
  };
  const paths = [];
  $$('[data-path]').forEach(sec => {
    const kind = sec.dataset.path;
    const svgs = $$(':scope > .path', sec);
    paths.push({ sec, kind, svgs, els: svgs.map(s => s.querySelector('path')), len: 1, p: RM ? 1 : 0 });
  });
  function buildPaths() {
    paths.forEach(o => {
      const w = o.sec.offsetWidth, h = o.sec.offsetHeight;
      const d = spline(builders[o.kind](o.sec, w, h));
      const st = o.kind === 'hero' ? rel($('#heroStage'), o.sec) : null;
      o.svgs.forEach(svg => svg.setAttribute('viewBox', st && svg.closest('#heroStage') ? `${st.x} ${st.y} ${st.w} ${st.h}` : `0 0 ${w} ${h}`));
      o.els.forEach(el => el.setAttribute('d', d));
      o.len = o.els[0].getTotalLength();
      o.els.forEach(el => { el.style.strokeDasharray = `${o.len} ${o.len}`; });
      if (o.kind === 'hero') {
        // the front copy only shows where the line crosses his chest
        const front = $('.hero .path--front');
        const s = meRect(o.sec);
        let cp = front.querySelector('clipPath');
        if (!cp) {
          front.insertAdjacentHTML('afterbegin', '<defs><clipPath id="chest"><rect/></clipPath></defs>');
          cp = front.querySelector('clipPath');
          front.querySelector('path').setAttribute('clip-path', 'url(#chest)');
        }
        const r = cp.querySelector('rect');
        r.setAttribute('x', -5000); r.setAttribute('y', s.y + s.h * .58); r.setAttribute('width', 10000); r.setAttribute('height', s.h);
      }
      drawPath(o);
    });
    buildZig();
  }
  function drawPath(o) { o.els.forEach(el => { el.style.strokeDashoffset = (o.len * (1 - o.p)).toFixed(1); }); }
  const heroPath = paths.find(o => o.kind === 'hero');
  // hero: the same path is drawn three times, behind the arch, between the arch and him, and in front of his chest
  if (heroPath) $$('#heroStage > .path').forEach(f => { heroPath.svgs.push(f); heroPath.els.push(f.querySelector('path')); });

  /* ---------- hero intro + the scene that floats on its own ---------- */
  let heroIntro = RM ? 1 : 0, heroScroll = 0;
  const setHeroPath = () => { if (!heroPath || RM) return; heroPath.p = clamp(.5 * heroIntro + .5 * heroScroll); drawPath(heroPath); };
  if (ANIM && $('.hero')) {
    const tl = gsap.timeline({ delay: .15 });
    tl.from('.hero__title .line > span', { yPercent: 110, duration: 1, ease: 'power3.out', stagger: .09 })
      .from('.pill', { opacity: 0, y: 12, duration: .6, ease: 'power2.out' }, '<')
      .from(['.hero__sub', '.hero__ctas'], { opacity: 0, y: 18, duration: .8, ease: 'power2.out', stagger: .08 }, '-=.55')
      .from('.hero__arch', { scaleY: .6, transformOrigin: '50% 100%', opacity: 0, duration: 1.1, ease: 'power3.out' }, .2)
      .from('.hero__me', { opacity: 0, yPercent: 5, duration: 1.1, ease: 'power3.out' }, .35)
      .from('.hero__chip', { opacity: 0, yPercent: 40, duration: .8, ease: 'power3.out' }, .9)
      .to({ v: 0 }, { v: 1, duration: 1.8, ease: 'power2.inOut', onUpdate() { heroIntro = this.targets()[0].v; setHeroPath(); } }, .5);
    const heroEl = $('.hero');
    ScrollTrigger.create({ trigger: '.hero', start: 'top top', end: 'bottom top', onUpdate: s => { heroScroll = s.progress; setHeroPath(); } });

    // The layers drift in a slow circle all the time, like a hand moving the cursor.
    // On a computer the real cursor adds to it.
    const layers = $$('[data-depth]').map(l => ({ x: gsap.quickSetter(l, 'x', 'px'), y: gsap.quickSetter(l, 'y', 'px'), d: +l.dataset.depth }));
    let px = 0, py = 0, cx = 0, cy = 0;
    if (FINE) {
      const hero = $('.hero');
      hero.addEventListener('pointermove', e => { px = e.clientX / innerWidth - .5; py = e.clientY / innerHeight - .5; });
      hero.addEventListener('pointerleave', () => { px = 0; py = 0; });
    }
    gsap.ticker.add(() => {
      if (scrollY > heroEl.offsetHeight) return;
      const t = gsap.ticker.time;
      const ax = Math.sin(t * .62) * .42 + Math.sin(t * .23) * .08;
      const ay = Math.cos(t * .62) * .3;
      cx += (ax + px * .9 - cx) * .05;
      cy += (ay + py * .9 - cy) * .05;
      layers.forEach(l => { l.x(cx * 44 * l.d); l.y(cy * 28 * l.d); });
    });
  }

  /* ---------- problem: dots leave, then become the path ---------- */
  const canvas = $('#dots');
  const prob = { q: 0, on: false };
  if (canvas && !RM) {
    const ctx = canvas.getContext('2d');
    let W = 0, H = 0, DPR = 1, N = 0, dots = [];
    const lines = $$('.pl');
    const LIME = '#C6F432', INK = [16, 18, 16];
    const rnd = (a, b) => a + Math.random() * (b - a);
    function size() {
      DPR = Math.min(devicePixelRatio || 1, 2);
      W = canvas.clientWidth; H = canvas.clientHeight;
      canvas.width = W * DPR; canvas.height = H * DPR;
      N = W < 761 ? 900 : 2200;
      dots = Array.from({ length: N }, (_, i) => {
        const hx = rnd(-.05, 1.05) * W, hy = rnd(.06, .94) * H;
        const cx = hx - W / 2, cy = hy - H / 2, m = Math.hypot(cx, cy) || 1;
        const u = i / (N - 1);
        return {
          hx, hy, ox: cx / m, oy: cy / m, out: rnd(.35, 1.1) * Math.max(W, H) * .55,
          u, ph: rnd(0, 6.28), sp: rnd(.4, 1.2), r: rnd(1.4, 3), j: rnd(-1, 1), d: rnd(0, .35),
        };
      });
    }
    const pathY = (u, flat) => {
      const base = H * .64;
      const wave = Math.sin(u * Math.PI * 3.2 + .6) * H * .09 + Math.sin(u * Math.PI * 7.1) * H * .025;
      return base + wave * (1 - flat);
    };
    // Timing: each beat gets its own stretch of scroll, with rests in between
    const T = { leave: [0, .14], line1: .13, line2: [.16, .56], gather: [.18, .6], flat: [.56, .76], solid: [.64, .82], line3: .78 };
    function frame(t) {
      if (!prob.on) return;
      const q = prob.q, time = t / 1000;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      ctx.clearRect(0, 0, W, H);
      const span = (r, v) => clamp((v - r[0]) / (r[1] - r[0]));
      const leave = ease(span(T.leave, q));              // visitors drift away
      const gather = easeIO(span(T.gather, q));          // they come back onto one path
      const flat = easeIO(span(T.flat, q));              // the path straightens
      const solid = span(T.solid, q);                    // and becomes the lime line
      if (solid > 0) {
        ctx.beginPath();
        const x0 = -.04 * W, x1 = 1.04 * W, steps = 80, upto = Math.ceil(steps * solid);
        for (let k = 0; k <= upto; k++) { const u = k / steps; const x = x0 + (x1 - x0) * u; const y = pathY(u, flat); k ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
        ctx.strokeStyle = LIME; ctx.lineWidth = W < 761 ? 12 : 20; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.stroke();
      }
      for (const p of dots) {
        const g = clamp((gather - p.d * .6) / (1 - p.d * .6));
        const drift = Math.sin(time * p.sp + p.ph);
        const lx = p.hx + p.ox * p.out * leave + drift * 6, ly = p.hy + p.oy * p.out * leave + Math.cos(time * p.sp + p.ph) * 6;
        const tx = (-.04 + 1.08 * p.u) * W, ty = pathY(p.u, flat) + p.j * (W < 761 ? 7 : 11) * (1 - flat * .8);
        const x = lx + (tx - lx) * g, y = ly + (ty - ly) * g;
        let a = (1 - leave * .55) * (1 - g) + g;
        a *= 1 - solid * .9;
        if (a <= .01) continue;
        ctx.fillStyle = `rgba(${INK[0]},${INK[1]},${INK[2]},${(a * .85).toFixed(3)})`;
        const r = p.r * (1 - g * .3);
        ctx.fillRect(x - r / 2, y - r / 2, r, r);
      }
      // copy
      const show = (el, a, b, f = .05) => { const k = Math.min(clamp((q - a) / f), clamp((b - q) / f)); el.style.opacity = k.toFixed(3); el.style.transform = `translateY(${((1 - k) * 18 * (q < a + f ? 1 : -1)).toFixed(1)}px)`; };
      show(lines[0], -1, T.line1);
      show(lines[1], T.line2[0], T.line2[1]);
      const k3 = clamp((q - T.line3) / .07);
      lines[2].style.opacity = k3.toFixed(3);
      lines[2].style.transform = `translateY(calc(-22vh + ${((1 - k3) * 18).toFixed(1)}px))`;
      requestAnimationFrame(frame);
    }
    size();
    addEventListener('resize', () => { size(); });
    if (hasGsap) {
      ScrollTrigger.create({
        trigger: '.problem', start: 'top top', end: 'bottom bottom',
        onUpdate: s => { prob.q = s.progress; },
      });
      ScrollTrigger.create({
        trigger: '.problem', start: 'top bottom', end: 'bottom top',
        onToggle: s => { prob.on = s.isActive; if (prob.on) requestAnimationFrame(frame); },
      });
    }
  }

  /* ---------- work: panels stack, screens tilt up out of 3D ---------- */
  const stack = $('.stack');
  const panels = $$('.panel');
  if (stack && ANIM) {
    const desk = () => innerWidth > 900;
    const gap = () => parseFloat(getComputedStyle(stack).rowGap) || 0;
    const stickTop = i => desk() ? innerHeight * .12 + i * 14 : 78 + i * 10;
    panels.forEach((p, i) => p.style.setProperty('--i', i));
    // sticky panels report their stuck position, so measure where each one sits in the normal flow
    const natTop = i => {
      let y = stack.getBoundingClientRect().top + scrollY;
      for (let j = 0; j < i; j++) y += panels[j].offsetHeight + gap();
      return y;
    };
    $$('.work__head > *').forEach(el => gsap.fromTo(el, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } }));
    panels.forEach((p, i) => {
      const tilt = $('.tilt', p);
      // 3D tilt only while the panel comes in; at rest the screen has no transform at all, so it stays sharp
      const flat = () => gsap.set(tilt, { clearProps: 'transform' });
      gsap.fromTo(tilt, { rotateX: 30, rotateY: -10, y: 90, transformPerspective: 1600 }, {
        rotateX: 0, rotateY: 0, y: 0, ease: 'none',
        scrollTrigger: { start: () => natTop(i) - innerHeight, end: () => natTop(i) - innerHeight * .3, scrub: true, invalidateOnRefresh: true, onLeave: flat, onRefresh: s => { if (s.progress === 1) flat(); } },
      });
      gsap.fromTo($('.panel__body', p), { opacity: 0, y: 50 }, {
        opacity: 1, y: 0, ease: 'none',
        scrollTrigger: { start: () => natTop(i) - innerHeight * .85, end: () => natTop(i) - innerHeight * .4, scrub: true, invalidateOnRefresh: true },
      });
      // the panel underneath settles back as the next one slides over it
      if (i < panels.length - 1) {
        gsap.fromTo(p, { '--dim': 0 }, {
          '--dim': 1, ease: 'none',
          scrollTrigger: { start: () => natTop(i + 1) - innerHeight, end: () => natTop(i + 1) - stickTop(i + 1), scrub: true, invalidateOnRefresh: true },
        });
      }
    });
  }

  /* ---------- admin screens: tabs (or a click on a screen behind) bring it to the front ---------- */
  const shots = $('#shots');
  if (shots) {
    const tabs = $$('[role="tab"]', shots), items = $$('.shots__item', shots);
    let cur = 0, auto = null;
    const show = (k, focus) => {
      cur = (k + items.length) % items.length;
      items.forEach((it, n) => { it.dataset.d = (n - cur + items.length) % items.length; it.setAttribute('aria-hidden', n === cur ? 'false' : 'true'); });
      tabs.forEach((t, n) => { t.setAttribute('aria-selected', String(n === cur)); t.tabIndex = n === cur ? 0 : -1; });
      if (focus) tabs[cur].focus();
    };
    const stop = () => { clearInterval(auto); auto = null; };
    tabs.forEach((t, n) => {
      t.addEventListener('click', () => { stop(); show(n); });
      t.addEventListener('keydown', e => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); stop(); show(cur + (e.key === 'ArrowRight' ? 1 : -1), true); }
      });
    });
    items.forEach((it, n) => it.addEventListener('click', () => { if (n !== cur) { stop(); show(n); } }));
    show(0);
    // while nobody has touched it, it steps through the screens on its own
    if (!RM && 'IntersectionObserver' in window) {
      let touched = false;
      shots.addEventListener('pointerdown', () => { touched = true; stop(); });
      new IntersectionObserver(([e]) => {
        if (e.isIntersecting && !touched && !auto) auto = setInterval(() => show(cur + 1), 3800);
        else if (!e.isIntersecting) stop();
      }, { threshold: .5 }).observe(shots);
    }
  }

  // cursor label
  const cursor = $('#cursor');
  if (FINE && cursor && hasGsap) {
    const cx = gsap.quickTo(cursor, 'x', { duration: .45, ease: 'power3' }), cy = gsap.quickTo(cursor, 'y', { duration: .45, ease: 'power3' });
    addEventListener('pointermove', e => { cx(e.clientX); cy(e.clientY); });
    $$('[data-cursor]').forEach(el => {
      el.addEventListener('pointerenter', () => { cursor.firstElementChild.dataset.label = el.dataset.cursor; cursor.classList.add('is-on'); });
      el.addEventListener('pointerleave', () => cursor.classList.remove('is-on'));
    });
  }

  /* ---------- grow: Lusion style. The small picture travels from the left and grows to the whole window ---------- */
  const frameEl = $('#growFrame');
  if (frameEl && ANIM) {
    const over = $('.grow__over'), intro = $('.grow__intro'), sticky = $('.grow__sticky');
    let gut = 40;
    const measure = () => { gut = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--gut')) || 0; if (!gut) gut = Math.max(20, Math.min(64, innerWidth * .04)); };
    measure(); addEventListener('resize', measure);
    // set the small starting state right away, so the picture never shows full size before the section pins
    const paint = q => {
      const W = sticky.clientWidth, H = sticky.clientHeight;
      const g = easeIO(clamp((q - .05) / .55));
      if (W > 900) {
        // a small copy of the whole picture on the left, text on the right
        const s0 = Math.min(.44, 660 / W);
        const x0 = gut, y0 = (H - H * s0) / 2;
        const sc = s0 + (1 - s0) * g;
        const arc = Math.sin(g * Math.PI) * H * .035;
        frameEl.style.clipPath = '';
        frameEl.style.transform = `translate(${(x0 * (1 - g)).toFixed(2)}px, ${(y0 * (1 - g) - arc).toFixed(2)}px) scale(${sc.toFixed(4)})`;
        frameEl.style.borderRadius = `${(22 * (1 - g) / sc).toFixed(2)}px`;
      } else {
        // phone and tablet: text on top, the picture below it opens up
        const st = [54, 6, 7, 6];
        const v = st.map(n => (n * (1 - g)).toFixed(2));
        frameEl.style.transform = '';
        frameEl.style.borderRadius = '';
        frameEl.style.clipPath = `inset(${v[0]}% ${v[1]}% ${v[2]}% ${v[3]}% round ${(18 * (1 - g)).toFixed(1)}px)`;
      }
      const k = clamp((q - .02) / .24);
      intro.style.opacity = (1 - k).toFixed(3);
      intro.style.translate = W > 900 ? `${(70 * k).toFixed(1)}px 0` : `0 ${(-30 * k).toFixed(1)}px`;
      const o = clamp((q - .6) / .14);
      over.style.opacity = o.toFixed(3);
      over.style.transform = `translateY(${((1 - o) * 30).toFixed(1)}px)`;
    };
    paint(0);
    ScrollTrigger.create({
      trigger: '.grow', start: 'top top', end: 'bottom bottom', scrub: true, invalidateOnRefresh: true,
      onUpdate: s => paint(s.progress),
      onRefresh: s => paint(s.progress),
    });
  }

  /* ---------- build: tiles rise in and tilt toward the cursor ---------- */
  if (ANIM) {
    $$('.build__head > *, .voices__head > *, .process__head > *').forEach(el => gsap.fromTo(el, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } }));
    $$('.tile').forEach((t, i) => gsap.fromTo(t, { opacity: 0, y: 70, rotateX: 12, transformPerspective: 900 }, { opacity: 1, y: 0, rotateX: 0, duration: 1.1, delay: (i % 4) * .07, ease: 'power3.out', scrollTrigger: { trigger: t, start: 'top 92%', once: true } }));
    if (FINE) $$('.tile').forEach(t => {
      const rx = gsap.quickTo(t, 'rotateX', { duration: .6, ease: 'power3' }), ry = gsap.quickTo(t, 'rotateY', { duration: .6, ease: 'power3' });
      gsap.set(t, { transformPerspective: 900 });
      t.addEventListener('pointermove', e => { const b = t.getBoundingClientRect(); ry(((e.clientX - b.left) / b.width - .5) * 9); rx(-((e.clientY - b.top) / b.height - .5) * 9); });
      t.addEventListener('pointerleave', () => { rx(0); ry(0); });
    });
    $$('.voice').forEach((v, i) => gsap.fromTo(v, { opacity: 0, y: 60, rotate: i % 2 ? 1.5 : -1.5 }, { opacity: 1, y: 0, rotate: 0, duration: 1.1, delay: i * .08, ease: 'power3.out', scrollTrigger: { trigger: '.voices__grid', start: 'top 85%', once: true } }));
    $$('.qa').forEach((q, i) => gsap.fromTo(q, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: .8, delay: i * .05, ease: 'power3.out', scrollTrigger: { trigger: '.faq__list', start: 'top 85%', once: true } }));
  }

  /* ---------- why: the sentence lights up as you read ---------- */
  const say = $('#whySay');
  if (say) {
    const words = say.textContent.trim().split(/\s+/);
    say.innerHTML = `<span class="sr">${say.textContent.trim()}</span><span aria-hidden="true">` + words.map(w => `<span class="w">${w}</span>`).join(' ') + '</span>';
    if (ANIM) {
      gsap.to($$('.w', say), { opacity: 1, ease: 'none', stagger: .1, scrollTrigger: { trigger: say, start: 'top 78%', end: 'bottom 48%', scrub: true } });
      $$('.why__list li').forEach(li => gsap.fromTo(li, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: .9, ease: 'power3.out', scrollTrigger: { trigger: li, start: 'top 90%', once: true } }));
    }
  }

  /* ---------- story ---------- */
  if (ANIM) {
    gsap.fromTo('.story__photo img', { yPercent: -8 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: '.story__grid', start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.fromTo('.story__photo', { clipPath: 'inset(12% 8% 12% 8% round 22px)' }, { clipPath: 'inset(0% 0% 0% 0% round 22px)', ease: 'power2.out', scrollTrigger: { trigger: '.story__grid', start: 'top 85%', end: 'top 30%', scrub: true } });
    gsap.fromTo('.about > *', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1, stagger: .1, ease: 'power3.out', scrollTrigger: { trigger: '.about', start: 'top 85%', once: true } });
  }
  $$('[data-count]').forEach(el => {
    const end = +el.dataset.count;
    if (!ANIM) { el.textContent = end; return; }
    const o = { v: 0 };
    gsap.to(o, { v: end, duration: 1.6, ease: 'power2.out', onUpdate: () => { el.textContent = Math.round(o.v); }, scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
  });

  /* ---------- process ---------- */
  if (ANIM) {
    $$('.step').forEach((s, i) => gsap.from(s, { opacity: 0, y: 80, duration: 1.1, delay: i * .08, ease: 'power3.out', scrollTrigger: { trigger: '.steps', start: 'top 85%', once: true } }));
    gsap.from('.close__title', { opacity: 0, y: 60, duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: '.close', start: 'top 70%', once: true } });
  }
  const processPath = paths.find(o => o.kind === 'process');
  if (processPath && ANIM) ScrollTrigger.create({ trigger: processPath.sec, start: 'top 80%', end: 'bottom 70%', onUpdate: s => { processPath.p = s.progress; drawPath(processPath); } });

  /* ---------- faq ---------- */
  let refreshT;
  $$('.qa').forEach(qa => {
    const btn = $('.qa__q', qa);
    btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') !== 'true';
      btn.setAttribute('aria-expanded', String(open));
      qa.classList.toggle('is-open', open);
      // later triggers (the zigzag) move when an answer opens
      if (hasGsap) { clearTimeout(refreshT); refreshT = setTimeout(() => ScrollTrigger.refresh(), 500); }
    });
  });

  /* ---------- close: the zigzag comes down and pops open into the contact card ---------- */
  const close = $('.close'), zig = $('.zig'), zigPath = zig && $('path', zig), pop = $('#pop');
  const zigState = { len: 1, p: RM ? 1 : 0 };
  function buildZig() {
    if (!zig) return;
    const w = close.offsetWidth, h = close.offsetHeight, phone = w < 761;
    const t = rel($('.close__title'), close), l = rel($('.close__lede'), close), c = rel(pop, close);
    zig.setAttribute('viewBox', `0 0 ${w} ${h}`);
    const right = Math.min(w - 10, t.r + (phone ? 6 : 40));
    // a soft start that comes in from the section above, then sharp zigzags down to the card
    let d = spline([[w * (phone ? .9 : .8), -30], [right, t.y + t.h * .2], [right, t.b + 10]]);
    const y0 = l.b + 30, y1 = c.y, n = phone ? 3 : 4;
    const xs = phone ? [w * .12, w * .88] : [w * .3, w * .7];
    for (let k = 1; k <= n; k++) d += ` L${xs[k % 2].toFixed(1)} ${(y0 + (y1 - y0 - 40) * (k / n)).toFixed(1)}`;
    d += ` L${(w / 2).toFixed(1)} ${y1.toFixed(1)}`;
    zigPath.setAttribute('d', d);
    zigState.len = zigPath.getTotalLength();
    zigPath.style.strokeDasharray = `${zigState.len} ${zigState.len}`;
    zigPath.style.strokeDashoffset = (zigState.len * (1 - zigState.p)).toFixed(1);
  }
  if (pop && ANIM) {
    const flash = $('.pop__flash', pop);
    const kids = $$('.form > *', pop);
    // tween plain numbers and write the clip-path ourselves (browsers rewrite equal sides, which breaks a string tween)
    const cl = { side: 49.5, bottom: 99, r: 20 };
    const clip = () => { pop.style.clipPath = cl.side + cl.bottom === 0 ? '' : `inset(0% ${cl.side.toFixed(2)}% ${cl.bottom.toFixed(2)}% ${cl.side.toFixed(2)}% round ${cl.r.toFixed(1)}px)`; };
    clip();
    gsap.set(flash, { opacity: 1 });
    gsap.set(kids, { opacity: 0, y: 24 });
    const popTl = gsap.timeline({ paused: true })
      .to(cl, { side: 0, bottom: 97.6, duration: .42, ease: 'power3.inOut', onUpdate: clip })
      .to(cl, { bottom: 0, r: 30, duration: .7, ease: 'expo.out', onUpdate: clip })
      .to(flash, { opacity: 0, duration: .5, ease: 'power2.out' }, '-=.45')
      .to(kids, { opacity: 1, y: 0, duration: .55, stagger: .035, ease: 'power3.out' }, '-=.4');
    let opened = false;
    const open = () => { if (!opened) { opened = true; popTl.timeScale(1).play(); } };
    const shut = () => { if (opened) { opened = false; popTl.timeScale(1.8).reverse(); } };
    pop.addEventListener('focusin', () => { open(); popTl.progress(1); });
    ScrollTrigger.create({
      trigger: close, start: 'top 75%', endTrigger: pop, end: 'top 72%', invalidateOnRefresh: true,
      onUpdate: s => {
        zigState.p = s.progress;
        zigPath.style.strokeDashoffset = (zigState.len * (1 - s.progress)).toFixed(1);
        if (s.progress > .985) open(); else if (s.progress < .7 && !pop.contains(document.activeElement)) shut();
      },
    });
  }

  /* ---------- contact form: checks the two required fields, then opens the visitor's email app ---------- */
  const form = $('#contactForm');
  if (form) {
    const status = $('#formStatus');
    const setErr = (input, msg) => {
      const err = $('#e-' + input.id.slice(2));
      input.setAttribute('aria-invalid', msg ? 'true' : 'false');
      if (err) err.textContent = msg || '';
    };
    const checks = {
      'f-name': v => v.trim() ? '' : 'Please enter your name.',
      'f-email': v => !v.trim() ? 'Please enter your email.' : (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'This email looks incomplete. Check it has an @ and a domain, like name@gmail.com.'),
    };
    Object.keys(checks).forEach(id => {
      const el = $('#' + id);
      el.addEventListener('blur', () => { if (el.value) setErr(el, checks[id](el.value)); });
      el.addEventListener('input', () => { if (el.getAttribute('aria-invalid') === 'true') setErr(el, checks[id](el.value)); });
    });
    form.addEventListener('submit', e => {
      e.preventDefault();
      let first = null;
      Object.keys(checks).forEach(id => { const el = $('#' + id), m = checks[id](el.value); setErr(el, m); if (m && !first) first = el; });
      if (first) { first.focus(); return; }
      const f = new FormData(form), g = k => (f.get(k) || '').toString().trim();
      const body = [
        `Name: ${g('name')}`, `Email: ${g('email')}`,
        g('phone') && `Mobile or WhatsApp: ${g('phone')}`,
        g('business') && `Business: ${g('business')}`,
        g('need') && `Needs: ${g('need')}`,
        g('site') && `Current website: ${g('site')}`,
        g('message') && `\n${g('message')}`,
      ].filter(Boolean).join('\n');
      const subject = `Free call: ${g('business') || g('name')}`;
      location.href = `mailto:contact@abdullahsattar.online?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      status.textContent = 'Your email app should open with the message ready. Press send there and I will reply soon.';
      status.classList.add('is-ok');
    });
  }

  /* ---------- phone: the admin card keeps its feature list behind a button ---------- */
  $$('.panel__more').forEach(b => b.addEventListener('click', () => {
    const panel = b.closest('.panel'), open = !panel.classList.contains('is-open');
    panel.classList.toggle('is-open', open);
    b.setAttribute('aria-expanded', String(open));
    b.textContent = open ? 'Hide the list' : 'See what it does';
    if (hasGsap) ScrollTrigger.refresh();
  }));

  /* ---------- hand-drawn sketches draw themselves in ---------- */
  const doodles = $$('.doodle');
  if (doodles.length) {
    if (RM || !('IntersectionObserver' in window)) doodles.forEach(d => d.classList.add('is-drawn'));
    else {
      const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-drawn'); io.unobserve(e.target); } }), { threshold: .6 });
      doodles.forEach(d => io.observe(d));
    }
  }

  /* ---------- simple reveals for the inner pages ---------- */
  if (ANIM) {
    $$('[data-reveal]').forEach(el => gsap.fromTo(el, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } }));
    $$('[data-stagger]').forEach(g => gsap.fromTo(g.children, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: .9, stagger: .08, ease: 'power3.out', scrollTrigger: { trigger: g, start: 'top 85%', once: true } }));
    $$('.page-hero [data-in]').forEach((el, i) => gsap.fromTo(el, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1, delay: .1 + i * .08, ease: 'power3.out' }));
  }
  // timelines: the lime line grows down as you read
  $$('.tl').forEach(t => {
    const bar = $('.tl__bar', t);
    if (!bar) return;
    if (!ANIM) { bar.style.transform = 'scaleY(1)'; return; }
    gsap.fromTo(bar, { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: t, start: 'top 70%', end: 'bottom 60%', scrub: true } });
  });

  /* ---------- services hero: a ribbon of strings twisting in 3D behind the work stack ---------- */
  const strings = $('#strings');
  if (strings) {
    const ctx = strings.getContext('2d');
    let w = 0, h = 0, dpr = 1, run = false, mx = .5, my = .5, tx = .5, ty = .5;
    const N = 24;
    const fitS = () => { dpr = Math.min(devicePixelRatio || 1, 2); w = strings.clientWidth; h = strings.clientHeight; strings.width = Math.round(w * dpr); strings.height = Math.round(h * dpr); };
    const drawS = t => {
      mx += (tx - mx) * .05; my += (ty - my) * .05;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const band = Math.min(h * .46, 380), f = 900;
      // strings fade out on the left, so the headline sits on a calm background
      const fade = (a, rgb) => { const g = ctx.createLinearGradient(w * .28, 0, w * .6, 0); g.addColorStop(0, `rgba(${rgb},0)`); g.addColorStop(1, `rgba(${rgb},${a})`); return g; };
      for (let i = 0; i < N; i++) {
        const o = (i / (N - 1) - .5) * band, mid = i === N >> 1;
        ctx.beginPath();
        for (let k = 0; k <= 140; k++) {
          const u = k / 140;
          const cy = h * (.98 - .72 * u) + Math.sin(u * 4.5 + t * .35) * h * .035 + (my - .5) * h * .08 * Math.sin(u * Math.PI);
          const th = u * 3.4 + t * .22 + (mx - .5) * 1.4;
          const x = -w * .05 + u * w * 1.1, y = cy + o * Math.cos(th), z = o * Math.sin(th) * 1.4;
          const p = f / (f + z);
          const X = w / 2 + (x - w / 2) * p, Y = cy + (y - cy) * p;
          k ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y);
        }
        ctx.lineWidth = mid ? 2.5 : 1;
        ctx.strokeStyle = mid ? fade(.95, '160,205,20') : fade((.07 + .1 * (1 - Math.abs(o) / band * 2)).toFixed(3), '16,18,16');
        ctx.stroke();
      }
    };
    const loopS = now => { if (!run) return; drawS(now / 1000); requestAnimationFrame(loopS); };
    fitS(); drawS(2);
    addEventListener('resize', () => { fitS(); drawS(performance.now() / 1000); });
    if (FINE) addEventListener('pointermove', e => { tx = e.clientX / innerWidth; ty = e.clientY / innerHeight; }, { passive: true });
    if (!RM && 'IntersectionObserver' in window) new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !run) { run = true; requestAnimationFrame(loopS); } else if (!e.isIntersecting) run = false;
    }).observe(strings);
  }

  /* the stack of sites turns a little toward the cursor */
  const stackIn = $('.stack3d__in');
  if (stackIn && ANIM && FINE) {
    gsap.set(stackIn, { rotateX: 7, rotateY: -15 });
    const rx = gsap.quickTo(stackIn, 'rotateX', { duration: 1.2, ease: 'power3' }), ry = gsap.quickTo(stackIn, 'rotateY', { duration: 1.2, ease: 'power3' });
    $('.svc-hero').addEventListener('pointermove', e => { ry(-15 + (e.clientX / innerWidth - .5) * 12); rx(7 - (e.clientY / innerHeight - .5) * 8); });
  }

  /* service cards: the page inside each window scrolls only while the card is on screen */
  const svcShots = $$('.shot');
  if (svcShots.length && !RM && 'IntersectionObserver' in window) {
    const io2 = new IntersectionObserver(es => es.forEach(e => e.target.classList.toggle('is-on', e.isIntersecting)), { threshold: .35 });
    svcShots.forEach(s => io2.observe(s));
  }

  /* how I build: the steps move sideways while you scroll down, the lime thread fills as you pass each step */
  const steps = $('#bsteps');
  if (steps && ANIM) {
    steps.classList.add('is-pinned');
    const track = $('.bsteps__track', steps), items = $$('.bstep', steps);
    const dist = () => Math.max(0, track.scrollWidth - innerWidth);
    const light = () => {
      const mark = innerWidth * (innerWidth < 760 ? .5 : .62);
      const gap = parseFloat(getComputedStyle(steps).getPropertyValue('--sg')) || 30;
      items.forEach(it => {
        const r = $('.bstep__n', it).getBoundingClientRect();
        it.classList.toggle('is-lit', r.left < mark);
        it.style.setProperty('--p', clamp((mark - r.left) / (r.width + gap)).toFixed(3));
      });
    };
    // a short hold at the start, so the heading is read before the steps slide in
    gsap.timeline({ scrollTrigger: { trigger: steps, start: 'top top', end: () => '+=' + (dist() + innerHeight * .25), pin: true, scrub: true, invalidateOnRefresh: true, onUpdate: light, onRefresh: light } })
      .to({}, { duration: .12 })
      .to(track, { x: () => -dist(), ease: 'none', duration: 1 });
    light();
  }

  /* ---------- about hero: the photo drifts up a little slower than the page ---------- */
  const abImg = $('.ab-hero__photo img');
  if (abImg && ANIM) gsap.fromTo(abImg, { yPercent: 0 }, { yPercent: -8, ease: 'none', scrollTrigger: { trigger: '.ab-hero', start: 'top top', end: 'bottom top', scrub: true } });

  /* about story: the step nearest the middle of the screen picks the picture */
  const story2 = $('.story2');
  if (story2) {
    const shotsS = $$('.sm', story2), ticks = $$('.story2__ticks li', story2), itemsS = $$('.tl__item', story2);
    let cur = -1;
    const show = i => {
      if (i === cur) return; cur = i;
      shotsS.forEach((s, k) => { s.classList.toggle('is-on', k === i); s.classList.toggle('is-past', k < i); });
      ticks.forEach((t, k) => t.classList.toggle('is-on', k <= i));
      itemsS.forEach((t, k) => t.classList.toggle('is-on', k === i));
    };
    show(0);
    // the last step whose top has passed the marker line is the current one
    const pick = () => {
      const mark = innerHeight * (innerWidth < 900 ? .72 : .62);
      let i = 0;
      itemsS.forEach((it, k) => { if (it.getBoundingClientRect().top < mark) i = k; });
      show(i);
    };
    if (hasGsap) ScrollTrigger.create({ trigger: story2, start: 'top bottom', end: 'bottom top', onUpdate: pick, onRefresh: pick });
    else addEventListener('scroll', pick, { passive: true });
  }

  /* marketer checks: a pin and its line light up together */
  const audit = $('.audit');
  if (audit) {
    const hot = n => $$('[data-pin]', audit).forEach(el => el.classList.toggle('is-hot', el.dataset.pin === n));
    $$('[data-pin]', audit).forEach(el => {
      el.addEventListener('pointerenter', () => hot(el.dataset.pin));
      el.addEventListener('pointerleave', () => hot(null));
      if (el.tagName === 'BUTTON') { el.addEventListener('focus', () => hot(el.dataset.pin)); el.addEventListener('blur', () => hot(null)); el.addEventListener('click', () => hot(el.dataset.pin)); }
    });
    // without a cursor, the pins take turns
    if (!FINE && !RM && 'IntersectionObserver' in window) {
      let k = 0, timer = null;
      new IntersectionObserver(([e]) => {
        if (e.isIntersecting && !timer) timer = setInterval(() => { k = k % 5 + 1; hot(String(k)); }, 1800);
        else if (!e.isIntersecting) { clearInterval(timer); timer = null; hot(null); }
      }, { threshold: .4 }).observe($('.audit__grid', audit));
    }
  }

  /* ---------- contact hero: the chat types itself out, then starts again ---------- */
  const chat = $('.chat');
  if (chat && !RM) {
    const msgs = $$('.b', chat), typing = $('.chat__typing', chat);
    chat.classList.add('is-live');
    let step = 0, t = null, on = false;
    const tick = () => {
      if (!on) return;
      if (step === 0) msgs.forEach(m => m.classList.remove('is-in'));
      if (step < msgs.length) {
        // the other side "types" before each incoming message
        const m = msgs[step], wait = m.classList.contains('b--in') ? 1200 : 900;
        if (m.classList.contains('b--in')) { chat.insertBefore(typing, m); typing.classList.add('is-in'); }
        t = setTimeout(() => { typing.classList.remove('is-in'); m.classList.add('is-in'); step++; t = setTimeout(tick, 900); }, wait);
      } else { step = 0; t = setTimeout(tick, 4200); }
    };
    if ('IntersectionObserver' in window) new IntersectionObserver(([e]) => {
      on = e.isIntersecting;
      if (on && !t) tick(); else if (!on) { clearTimeout(t); t = null; }
    }).observe(chat);
  }

  /* ---------- footer globe: a wireframe earth that turns slowly ---------- */
  const globe = $('#globe');
  if (globe) {
    const g = globe.getContext('2d');
    const rad = d => d * Math.PI / 180;
    // home and the first client
    const pins = [[30.04, 72.35], [25.2, 55.27]];
    let rot = 0, size = 0, dpr = 1, running = false, last = 0;
    const fit = () => { dpr = Math.min(devicePixelRatio || 1, 2); size = globe.clientWidth; globe.width = globe.height = Math.round(size * dpr); };
    const tilt = rad(-18);
    const proj = (lat, lon, R, c) => {
      const la = rad(lat), lo = rad(lon) + rot;
      const x = Math.cos(la) * Math.sin(lo), y = Math.sin(la), z = Math.cos(la) * Math.cos(lo);
      const y2 = y * Math.cos(tilt) - z * Math.sin(tilt), z2 = y * Math.sin(tilt) + z * Math.cos(tilt);
      return [c + x * R, c - y2 * R, z2];
    };
    const line = (pts, R, c) => {
      // front half brighter than the back half
      for (const front of [false, true]) {
        g.beginPath(); let on = false;
        for (const [lat, lon] of pts) {
          const [x, y, z] = proj(lat, lon, R, c);
          if ((z >= 0) === front) { on ? g.lineTo(x, y) : g.moveTo(x, y); on = true; } else on = false;
        }
        g.strokeStyle = front ? 'rgba(233,237,228,.22)' : 'rgba(233,237,228,.07)';
        g.stroke();
      }
    };
    const draw = () => {
      const c = size / 2, R = size * .46;
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.clearRect(0, 0, size, size);
      g.lineWidth = 1;
      for (let lon = 0; lon < 180; lon += 15) { const p = []; for (let lat = -90; lat <= 90; lat += 4) p.push([lat, lon]); line(p, R, c); const q = []; for (let lat = -90; lat <= 90; lat += 4) q.push([lat, lon + 180]); line(q, R, c); }
      for (let lat = -75; lat <= 75; lat += 15) { const p = []; for (let lon = 0; lon <= 360; lon += 4) p.push([lat, lon]); line(p, R, c); }
      g.beginPath(); g.arc(c, c, R, 0, Math.PI * 2); g.strokeStyle = 'rgba(233,237,228,.18)'; g.stroke();
      // an arc between the pins, lifted off the surface
      const a = proj(...pins[0], R, c), b = proj(...pins[1], R, c);
      if (a[2] > -.1 && b[2] > -.1) {
        const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, dx = mx - c, dy = my - c, k = 1.25;
        g.beginPath(); g.moveTo(a[0], a[1]); g.quadraticCurveTo(c + dx * k, c + dy * k, b[0], b[1]);
        g.strokeStyle = 'rgba(198,244,50,.75)'; g.lineWidth = 2; g.stroke();
      }
      const t = performance.now() / 1000;
      pins.forEach(([la, lo], i) => {
        const [x, y, z] = proj(la, lo, R, c);
        if (z < 0) return;
        const pulse = (t * .7 + i * .5) % 1;
        g.beginPath(); g.arc(x, y, 4 + pulse * 14, 0, Math.PI * 2); g.strokeStyle = `rgba(198,244,50,${(.6 * (1 - pulse)).toFixed(3)})`; g.lineWidth = 1.5; g.stroke();
        g.beginPath(); g.arc(x, y, 4.5, 0, Math.PI * 2); g.fillStyle = '#C6F432'; g.fill();
      });
    };
    const loop = now => {
      if (!running) return;
      rot += Math.min(.05, (now - last) / 1000) * .12; last = now;
      draw(); requestAnimationFrame(loop);
    };
    fit();
    // start with the Gulf and Pakistan facing the viewer
    rot = rad(-64);
    draw();
    addEventListener('resize', () => { fit(); draw(); });
    if (!RM && 'IntersectionObserver' in window) new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !running) { running = true; last = performance.now(); requestAnimationFrame(loop); }
      else if (!e.isIntersecting) running = false;
    }).observe(globe);
  }

  /* ---------- WhatsApp ---------- */
  const waNum = (document.body.dataset.waNumber || '').replace(/\D/g, '');
  const waText = encodeURIComponent("Hi Abdullah, I found your website and I'd like to talk about a website for my business.");
  $$('[data-wa]').forEach(a => {
    if (!waNum) return; // no number yet: the links fall back to the contact form
    a.href = `https://wa.me/${waNum}?text=${waText}`;
    a.target = '_blank'; a.rel = 'noopener';
  });
  const wa = $('#waBtn');
  if (wa) {
    // shows after the first screen; hides over the footer, which has its own WhatsApp box
    const foot = $('.foot');
    const setWa = () => wa.classList.toggle('is-hidden', scrollY < innerHeight * .6 || (foot && foot.getBoundingClientRect().top < innerHeight * .75));
    addEventListener('scroll', setWa, { passive: true }); setWa();
  }

  buildPaths();
  if (hasGsap) {
    ScrollTrigger.addEventListener('refresh', buildPaths);
    addEventListener('load', () => ScrollTrigger.refresh());
    document.fonts && document.fonts.ready.then(() => ScrollTrigger.refresh());
  } else addEventListener('resize', buildPaths);
})();
