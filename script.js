gsap.registerPlugin(SplitText, CustomEase, ScrollTrigger);

// ====================
// Lenis smooth scroll
// ====================
const lenis = new Lenis();
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

// ============================================================
// CUSTOM CURSOR
// ============================================================
const cursorDot = document.getElementById("cursor-dot");
const cursorRing = document.getElementById("cursor-ring");
let mouseX = 0,
  mouseY = 0,
  ringX = 0,
  ringY = 0;

document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorDot.style.left = mouseX + "px";
  cursorDot.style.top = mouseY + "px";
});

function animateCursor() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  cursorRing.style.left = ringX + "px";
  cursorRing.style.top = ringY + "px";
  requestAnimationFrame(animateCursor);
}
animateCursor();

document
  .querySelectorAll("a, button, .skill-card, .project-card, .ach-card, .badge")
  .forEach((el) => {
    el.addEventListener("mouseenter", () =>
      document.body.classList.add("hovering"),
    );
    el.addEventListener("mouseleave", () =>
      document.body.classList.remove("hovering"),
    );
  });

// ============================================================
// NAV
// ============================================================
const navToggler = document.querySelector(".nav-toggler");
const navBgs = document.querySelectorAll(".nav-bg");
let isMenuOpen = false,
  isAnimating = false;

const navTl = gsap.timeline({
  paused: true,
  onComplete: () => {
    isAnimating = false;
  },
  onReverseComplete: () => {
    gsap.set(linkBlocks.join(", "), { y: "100%" });
    isAnimating = false;
  },
});

navToggler.addEventListener("click", () => {
  if (isAnimating) return;
  isAnimating = true;
  navToggler.classList.toggle("open");
  if (!isMenuOpen) {
    navTl.play();
    animateLinksIn();
  } else {
    navTl.reverse();
  }
  isMenuOpen = !isMenuOpen;
});

navTl.to(navBgs, {
  scaleY: 1,
  duration: 0.75,
  stagger: 0.1,
  ease: "power3.inOut",
});
navTl.to(
  ".nav-items",
  {
    clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
    duration: 0.75,
    ease: "power3.inOut",
  },
  "-=0.6",
);

const splitLinks = SplitText.create(".nav-items a", {
  type: "lines",
  mask: "lines",
  linesClass: "line",
});

const linkBlocks = [
  ".nav-socials .line, .nav-legal .line",
  ".nav-primary-links .line",
  ".nav-secondary-links .line",
];

function animateLinksIn() {
  linkBlocks.forEach((selector) => {
    gsap.fromTo(
      selector,
      { y: "100%" },
      {
        y: "0%",
        duration: 0.75,
        stagger: 0.05,
        ease: "power3.out",
        delay: 0.85,
      },
    );
  });
}

// ============================================================
// LOADER
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  CustomEase.create("hop", "0.9,0,0.1,1");
  document.body.style.overflow = "hidden";

  const counterEl = document.querySelector(".preloader-counter h1");
  const counterContainer = document.querySelector(".preloader-counter");
  const progressBar = document.querySelector(".progress-bar");
  const progressFill = document.querySelector(".progress");
  const heroWrap = document.getElementById("hero-wrap");

  gsap.set(heroWrap, {
    clipPath: "polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)",
  });

  const counter = { value: 0 };

  const loaderTl = gsap.timeline({
    onComplete: () => {
      document.body.style.overflow = "";
      initNavShery();
      gsap.to("nav", {
        opacity: 1,
        pointerEvents: "all",
        duration: 0.6,
        ease: "power2.out",
      });
    },
  });

  loaderTl.to(
    counterContainer,
    {
      scale: 1,
      duration: 0.6,
      ease: "power3.out",
      transformOrigin: "left bottom",
    },
    0,
  );
  loaderTl.to(progressBar, { scaleX: 1, duration: 0.4, ease: "power2.out" }, 0);
  loaderTl.to(
    counter,
    {
      value: 100,
      duration: 2.5,
      ease: "power2.inOut",
      onUpdate: () => {
        const val = Math.floor(counter.value);
        counterEl.textContent = val;
        gsap.set(progressFill, { scaleX: val / 100 });
      },
    },
    0.3,
  );

  loaderTl.add(() => {
    const counterSplit = SplitText.create(counterEl, {
      type: "chars",
      charsClass: "digit",
      mask: "chars",
    });
    gsap.to(counterSplit.chars, {
      y: "-120%",
      duration: 0.55,
      ease: "power3.in",
      stagger: 0.06,
    });
    gsap.to(".loader-label", {
      y: "-120%",
      opacity: 0,
      duration: 0.4,
      ease: "power3.in",
      delay: 0.1,
    });
  }, "+=0.3");

  loaderTl.to(
    progressBar,
    { opacity: 0, duration: 0.3, ease: "power2.in" },
    "-=0.2",
  );
  loaderTl.to(
    counterContainer,
    { yPercent: -120, opacity: 0, duration: 0.5, ease: "power3.in" },
    "-=0.1",
  );
  loaderTl.to(
    heroWrap,
    {
      clipPath: "polygon(35% 35%, 65% 35%, 65% 65%, 35% 65%)",
      duration: 1.1,
      ease: "hop",
      onStart: () => {
        setTimeout(() => counterContainer.remove(), 200);
      },
    },
    "-=0.1",
  );
  loaderTl.to(heroWrap, {
    clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
    duration: 1.4,
    ease: "hop",
  });
  loaderTl.add(() => {
    heroWrap.classList.add("loaded");
  }, "-=0.6");
});

function initNavShery() {
  Shery.makeMagnet(".nav-toggler", {
    mouseFollower: true,
    text: "Menu",
    ease: "cubic-bezier(0.23, 1, 0.320, 1)",
    duration: 1,
  });
  Shery.textAnimate(".nav-logo", {
    style: 1,
    y: 10,
    delay: 0.1,
    duration: 2,
    ease: "cubic-bezier(0.23, 1, 0.320, 1)",
    multiplier: 0.1,
  });
}

// ============================================================
// HERO — Three.js shader + cursor trail + water ripples
// ============================================================
(function () {
  const wrap = document.getElementById("hero-wrap");
  const shaderCanvas = document.getElementById("hero-canvas");
  const trailCanvas = document.getElementById("trail-canvas");
  const rippleCanvas = document.getElementById("ripple-canvas");
  const tCtx = trailCanvas.getContext("2d");
  const rCtx = rippleCanvas.getContext("2d");

  let W = wrap.offsetWidth || 800;
  let H = wrap.offsetHeight || 600;

  function resize() {
    W = wrap.offsetWidth;
    H = wrap.offsetHeight;
    trailCanvas.width = W;
    trailCanvas.height = H;
    rippleCanvas.width = W;
    rippleCanvas.height = H;
    renderer.setSize(W, H);
    uniforms.uResolution.value.set(W, H);
  }

  trailCanvas.width = W;
  trailCanvas.height = H;
  rippleCanvas.width = W;
  rippleCanvas.height = H;

  const renderer = new THREE.WebGLRenderer({
    canvas: shaderCanvas,
    antialias: true,
    alpha: false,
  });
  renderer.setSize(W, H);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
  camera.position.z = 1;

  const vert = `varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position,1.0); }`;
  const frag = `
    precision highp float;
    varying vec2 vUv;
    uniform float uTime;
    uniform vec2 uMouse;
    uniform vec2 uResolution;
    uniform float uHover;
    vec2 hash2(vec2 p){
      p=vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3)));
      return -1.0+2.0*fract(sin(p)*43758.5453123);
    }
    float noise(vec2 p){
      vec2 i=floor(p),f=fract(p),u=f*f*(3.0-2.0*f);
      return mix(mix(dot(hash2(i),f),dot(hash2(i+vec2(1,0)),f-vec2(1,0)),u.x),
                 mix(dot(hash2(i+vec2(0,1)),f-vec2(0,1)),dot(hash2(i+vec2(1,1)),f-vec2(1,1)),u.x),u.y);
    }
    float fbm(vec2 p){
      float v=0.0,a=0.5;
      mat2 rot=mat2(cos(0.5),sin(0.5),-sin(0.5),cos(0.5));
      for(int i=0;i<6;i++){ v+=a*noise(p); p=rot*p*2.0+vec2(100.0); a*=0.5; }
      return v;
    }
    vec3 palette(float t,vec3 a,vec3 b,vec3 c,vec3 d){return a+b*cos(6.28318*(c*t+d));}
    void main(){
      vec2 asp=vec2(uResolution.x/uResolution.y,1.0);
      vec2 uv=(vUv-0.5)*asp;
      vec2 mouse=(uMouse-0.5)*asp;
      float dist=length(uv-mouse);
      float t=uTime*0.18;
      vec2 p=uv*2.5+vec2(sin(t*.7+uv.y),cos(t*.5+uv.x))*.3;
      float n1=fbm(p+t*.4+mouse*1.5*uHover);
      float n2=fbm(p*1.3-t*.3+vec2(n1));
      float n3=fbm(p+n1+n2+vec2(sin(t),cos(t))*.5);
      float f=(n1*.5+n2*.3+n3*.2)*.5+.5;
      vec3 c1=palette(f+t*.1,vec3(.1,.05,.12),vec3(.3,.2,.4),vec3(1,1,1),vec3(0,.15,.30));
      vec3 c2=palette(f*1.3+t*.07+.5,vec3(.05,.1,.15),vec3(.3,.25,.3),vec3(1,.9,1),vec3(.3,.6,.8));
      vec3 col=mix(c1,c2,sin(f*3.14+t)*.5+.5);
      col+=vec3(0,.45,.5)*exp(-dist*3.5)*.6*uHover;
      col+=vec3(.3,.05,.6)*exp(-dist*5.)*.4*uHover;
      float rg=exp(-length(uv)*1.2)*(fbm(vec2(atan(uv.y,uv.x)*.5,length(uv))*3.+t)*.5+.5)*.4;
      col+=vec3(0,.35,.4)*rg+vec3(.25,0,.5)*rg*.6;
      col*=smoothstep(1.2,.3,length(uv*.9))*1.3;
      col=clamp(col,0.,1.); col=pow(col,vec3(.85));
      gl_FragColor=vec4(col,1.0);
    }
  `;

  const uniforms = {
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uResolution: { value: new THREE.Vector2(W, H) },
    uHover: { value: 0 },
  };
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2),
    new THREE.ShaderMaterial({
      vertexShader: vert,
      fragmentShader: frag,
      uniforms,
    }),
  );
  scene.add(mesh);

  let mx = W / 2,
    my = H / 2;
  let targetMouse = new THREE.Vector2(0.5, 0.5);
  let currentMouse = new THREE.Vector2(0.5, 0.5);
  let targetHover = 0,
    isInside = false,
    stoppedTimer = null;

  const TRAIL_LEN = 28;
  const trail = [];
  for (let i = 0; i < TRAIL_LEN; i++)
    trail.push({ x: W / 2, y: H / 2, age: 0 });
  const cursor = { x: W / 2, y: H / 2, tx: W / 2, ty: H / 2, scale: 1 };
  const ripples = [];

  function addRipple(x, y, big) {
    ripples.push({
      x,
      y,
      r: 0,
      maxR: big ? 160 : 90,
      alpha: big ? 0.7 : 0.55,
      speed: big ? 3.2 : 2.5,
      color: big ? [0, 240, 255] : [123, 47, 255],
      rings: big ? 3 : 2,
      phase: 0,
      lensDistort: big ? 1 : 0.6,
    });
    if (big) {
      setTimeout(
        () =>
          ripples.push({
            x: x + (Math.random() - 0.5) * 10,
            y: y + (Math.random() - 0.5) * 10,
            r: 0,
            maxR: 110,
            alpha: 0.4,
            speed: 2.8,
            color: [255, 45, 120],
            rings: 2,
            phase: 0.3,
            lensDistort: 0.5,
          }),
        80,
      );
      setTimeout(
        () =>
          ripples.push({
            x: x + (Math.random() - 0.5) * 8,
            y: y + (Math.random() - 0.5) * 8,
            r: 0,
            maxR: 80,
            alpha: 0.35,
            speed: 2.2,
            color: [240, 192, 64],
            rings: 1,
            phase: 0,
            lensDistort: 0.3,
          }),
        180,
      );
    }
  }

  wrap.addEventListener("mousemove", (e) => {
    const rect = wrap.getBoundingClientRect();
    mx = e.clientX - rect.left;
    my = e.clientY - rect.top;
    targetMouse.set(mx / W, 1 - my / H);
    targetHover = 1;
    isInside = true;
    cursor.tx = mx;
    cursor.ty = my;
    if (stoppedTimer) clearTimeout(stoppedTimer);
    stoppedTimer = setTimeout(() => {
      if (isInside) addRipple(mx, my, false);
    }, 900);
  });
  wrap.addEventListener("mouseleave", () => {
    targetHover = 0;
    isInside = false;
    targetMouse.set(0.5, 0.5);
    if (stoppedTimer) clearTimeout(stoppedTimer);
  });
  wrap.addEventListener("mouseenter", (e) => {
    const rect = wrap.getBoundingClientRect();
    cursor.x = e.clientX - rect.left;
    cursor.y = e.clientY - rect.top;
    cursor.tx = cursor.x;
    cursor.ty = cursor.y;
  });
  wrap.addEventListener("click", (e) => {
    const rect = wrap.getBoundingClientRect();
    addRipple(e.clientX - rect.left, e.clientY - rect.top, true);
    cursor.scale = 1.6;
    setTimeout(() => (cursor.scale = 1), 200);
  });
  wrap.addEventListener(
    "touchmove",
    (e) => {
      e.preventDefault();
      const rect = wrap.getBoundingClientRect();
      const t = e.touches[0];
      mx = t.clientX - rect.left;
      my = t.clientY - rect.top;
      targetMouse.set(mx / W, 1 - my / H);
      cursor.tx = mx;
      cursor.ty = my;
      targetHover = 1;
      isInside = true;
    },
    { passive: false },
  );
  wrap.addEventListener("touchend", (e) => {
    const rect = wrap.getBoundingClientRect();
    if (e.changedTouches[0])
      addRipple(
        e.changedTouches[0].clientX - rect.left,
        e.changedTouches[0].clientY - rect.top,
        true,
      );
    targetHover = 0;
    isInside = false;
  });

  function spawnParticle() {
    const c = document.getElementById("particles");
    if (!c) return;
    const p = document.createElement("div");
    p.className = "particle";
    const sz = Math.random() * 3 + 1;
    const cols = [
      "rgba(0,240,255,",
      "rgba(123,47,255,",
      "rgba(255,45,120,",
      "rgba(240,192,64,",
    ];
    const cl = cols[Math.floor(Math.random() * cols.length)];
    p.style.cssText = `width:${sz}px;height:${sz}px;left:${Math.random() * 100}%;bottom:-10px;background:${cl}0.8);box-shadow:0 0 ${sz * 3}px ${cl}0.4);animation-duration:${Math.random() * 8 + 6}s;animation-delay:${Math.random() * 3}s;`;
    c.appendChild(p);
    setTimeout(() => p.remove(), 14000);
  }
  setInterval(spawnParticle, 700);
  for (let i = 0; i < 6; i++) spawnParticle();

  function drawTrail() {
    tCtx.clearRect(0, 0, W, H);
    for (let i = trail.length - 1; i > 0; i--) {
      trail[i].x = trail[i - 1].x;
      trail[i].y = trail[i - 1].y;
    }
    trail[0].x += (cursor.x - trail[0].x) * 0.35;
    trail[0].y += (cursor.y - trail[0].y) * 0.35;
    if (!isInside) return;
    for (let i = 0; i < trail.length - 1; i++) {
      const t0 = trail[i],
        t1 = trail[i + 1];
      const prog = 1 - i / trail.length;
      const alpha = prog * prog * 0.55;
      const width = prog * 4.5 + 0.5;
      tCtx.beginPath();
      tCtx.moveTo(t0.x, t0.y);
      tCtx.lineTo(t1.x, t1.y);
      const hue = 180 + (1 - prog) * 120;
      tCtx.strokeStyle = `hsla(${hue},100%,65%,${alpha})`;
      tCtx.lineWidth = width;
      tCtx.lineCap = "round";
      tCtx.shadowColor = `hsla(${hue},100%,70%,${alpha * 0.8})`;
      tCtx.shadowBlur = 8;
      tCtx.stroke();
    }
    for (let i = 0; i < trail.length; i += 4) {
      const pt = trail[i];
      const prog = 1 - i / trail.length;
      const radius = prog * 3.5;
      const alpha = prog * prog * 0.7;
      const grad = tCtx.createRadialGradient(
        pt.x,
        pt.y,
        0,
        pt.x,
        pt.y,
        radius * 2.5,
      );
      grad.addColorStop(0, `rgba(0,240,255,${alpha})`);
      grad.addColorStop(0.5, `rgba(123,47,255,${alpha * 0.5})`);
      grad.addColorStop(1, "rgba(0,0,0,0)");
      tCtx.beginPath();
      tCtx.arc(pt.x, pt.y, radius * 2.5, 0, Math.PI * 2);
      tCtx.fillStyle = grad;
      tCtx.shadowBlur = 0;
      tCtx.fill();
    }
    cursor.x += (cursor.tx - cursor.x) * 0.18;
    cursor.y += (cursor.ty - cursor.y) * 0.18;
    const sc = cursor.scale || 1;
    const dotR = 5 * sc;
    const ringR = 20 * sc;
    tCtx.beginPath();
    tCtx.arc(cursor.x, cursor.y, ringR, 0, Math.PI * 2);
    tCtx.strokeStyle = "rgba(0,240,255,0.55)";
    tCtx.lineWidth = 1;
    tCtx.shadowColor = "rgba(0,240,255,0.4)";
    tCtx.shadowBlur = 12;
    tCtx.stroke();
    const dotGrad = tCtx.createRadialGradient(
      cursor.x,
      cursor.y,
      0,
      cursor.x,
      cursor.y,
      dotR,
    );
    dotGrad.addColorStop(0, "rgba(255,255,255,1)");
    dotGrad.addColorStop(0.4, "rgba(0,240,255,1)");
    dotGrad.addColorStop(1, "rgba(123,47,255,0)");
    tCtx.beginPath();
    tCtx.arc(cursor.x, cursor.y, dotR, 0, Math.PI * 2);
    tCtx.fillStyle = dotGrad;
    tCtx.shadowColor = "rgba(0,240,255,0.9)";
    tCtx.shadowBlur = 20;
    tCtx.fill();
    tCtx.shadowBlur = 0;
  }

  function drawRipples() {
    rCtx.clearRect(0, 0, W, H);
    for (let i = ripples.length - 1; i >= 0; i--) {
      const rp = ripples[i];
      rp.r += rp.speed;
      rp.phase += 0.08;
      const progress = rp.r / rp.maxR;
      if (progress >= 1) {
        ripples.splice(i, 1);
        continue;
      }
      const fade = Math.sin(progress * Math.PI);
      const [r, g, b] = rp.color;
      for (let ring = 0; ring < rp.rings; ring++) {
        const ringOffset = ring * 18;
        const ringR = rp.r - ringOffset;
        if (ringR <= 0) continue;
        const ringFade = fade * (1 - ring * 0.3) * rp.alpha;
        rCtx.beginPath();
        rCtx.ellipse(rp.x, rp.y, ringR, ringR * 0.38, 0, 0, Math.PI * 2);
        rCtx.strokeStyle = `rgba(${r},${g},${b},${ringFade * 0.9})`;
        rCtx.lineWidth = 1.5 - ring * 0.3;
        rCtx.shadowColor = `rgba(${r},${g},${b},${ringFade * 0.6})`;
        rCtx.shadowBlur = 10;
        rCtx.stroke();
        if (ring === 0) {
          const lensGrad = rCtx.createRadialGradient(
            rp.x,
            rp.y - ringR * 0.1,
            0,
            rp.x,
            rp.y,
            ringR,
          );
          lensGrad.addColorStop(
            0,
            `rgba(${r},${g},${b},${ringFade * 0.06 * rp.lensDistort})`,
          );
          lensGrad.addColorStop(
            0.4,
            `rgba(${r},${g},${b},${ringFade * 0.04 * rp.lensDistort})`,
          );
          lensGrad.addColorStop(
            0.8,
            `rgba(${r},${g},${b},${ringFade * 0.12 * rp.lensDistort})`,
          );
          lensGrad.addColorStop(1, `rgba(${r},${g},${b},0)`);
          rCtx.save();
          rCtx.scale(1, 0.38);
          rCtx.beginPath();
          rCtx.arc(rp.x, rp.y / 0.38, ringR, 0, Math.PI * 2);
          rCtx.fillStyle = lensGrad;
          rCtx.shadowBlur = 0;
          rCtx.fill();
          rCtx.restore();
        }
        rCtx.beginPath();
        rCtx.ellipse(
          rp.x,
          rp.y,
          ringR * 0.95,
          ringR * 0.36,
          0,
          Math.PI * 1.1,
          Math.PI * 1.9,
        );
        rCtx.strokeStyle = `rgba(255,255,255,${ringFade * 0.3})`;
        rCtx.lineWidth = 0.8;
        rCtx.shadowBlur = 0;
        rCtx.stroke();
      }
      if (progress < 0.15) {
        const splashR = (1 - progress / 0.15) * 8;
        const splashGrad = rCtx.createRadialGradient(
          rp.x,
          rp.y,
          0,
          rp.x,
          rp.y,
          splashR,
        );
        splashGrad.addColorStop(
          0,
          `rgba(255,255,255,${(1 - progress / 0.15) * 0.9})`,
        );
        splashGrad.addColorStop(
          0.5,
          `rgba(${r},${g},${b},${(1 - progress / 0.15) * 0.6})`,
        );
        splashGrad.addColorStop(1, "rgba(0,0,0,0)");
        rCtx.beginPath();
        rCtx.arc(rp.x, rp.y, splashR, 0, Math.PI * 2);
        rCtx.fillStyle = splashGrad;
        rCtx.fill();
      }
      if (progress < 0.3) {
        const numDrops = 8;
        for (let d = 0; d < numDrops; d++) {
          const angle = (d / numDrops) * Math.PI * 2 + rp.phase;
          const dropDist = rp.r * 0.6 * (progress / 0.3);
          const x1 = rp.x + Math.cos(angle) * dropDist * 0.6,
            y1 = rp.y + Math.sin(angle) * dropDist * 0.22;
          const x2 = rp.x + Math.cos(angle) * dropDist,
            y2 = rp.y + Math.sin(angle) * dropDist * 0.38;
          const dAlpha = (1 - progress / 0.3) * 0.5 * rp.alpha;
          rCtx.beginPath();
          rCtx.moveTo(x1, y1);
          rCtx.lineTo(x2, y2);
          rCtx.strokeStyle = `rgba(${r},${g},${b},${dAlpha})`;
          rCtx.lineWidth = 1;
          rCtx.shadowBlur = 4;
          rCtx.shadowColor = `rgba(${r},${g},${b},${dAlpha})`;
          rCtx.stroke();
        }
      }
      rCtx.shadowBlur = 0;
    }
  }

  function animate() {
    requestAnimationFrame(animate);
    currentMouse.x += (targetMouse.x - currentMouse.x) * 0.07;
    currentMouse.y += (targetMouse.y - currentMouse.y) * 0.07;
    uniforms.uMouse.value.copy(currentMouse);
    uniforms.uHover.value += (targetHover - uniforms.uHover.value) * 0.05;
    uniforms.uTime.value += 0.016;
    renderer.render(scene, camera);
    drawTrail();
    drawRipples();
  }
  animate();

  const ro = new ResizeObserver(resize);
  ro.observe(wrap);
})();

// ============================================================
// EXPERIENCE TIMELINE — horizontal scroll
// ============================================================
const tlOuter = document.getElementById("tl-outer");
const tlPin = document.getElementById("tl-pin");
const tlTrack = document.getElementById("tl-track");
const tlSpine = document.getElementById("tl-spine");
const tlSfill = document.getElementById("tl-spine-fill");
const tlPfill = document.getElementById("tl-pfill");
const tlCurEl = document.getElementById("tl-cur");
const tlHint = document.getElementById("tl-hint");
const tlSlots = Array.from(document.querySelectorAll(".tl-slot"));
const tlCards = Array.from(document.querySelectorAll(".tl-card"));
const tlN = tlSlots.length;
let travelX = 0;

function tlInit() {
  const tw = tlTrack.scrollWidth;
  tlSpine.style.width = tw + "px";
  travelX =
    tw - window.innerWidth + parseFloat(getComputedStyle(tlTrack).paddingLeft);
  tlOuter.style.height = travelX + window.innerHeight + "px";
}
tlInit();

ScrollTrigger.create({
  trigger: tlOuter,
  start: "top 80%",
  once: true,
  onEnter() {
    gsap.fromTo(
      ".tl-eyebrow",
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
    );
    gsap.fromTo(
      ".tl-h2",
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", delay: 0.08 },
    );
    gsap.to(tlHint, { opacity: 1, duration: 0.5, delay: 1 });
    tlRevealCard(0);
    tlSlots[0].classList.add("lit");
  },
});

function tlRevealCard(i) {
  const card = tlCards[i];
  const isBelow = tlSlots[i].classList.contains("below");
  gsap.fromTo(
    card,
    { opacity: 0, y: isBelow ? -20 : 20 },
    { opacity: 1, y: 0, duration: 0.55, ease: "power3.out" },
  );
}

gsap.to(tlTrack, {
  x: () => -travelX,
  ease: "none",
  scrollTrigger: {
    trigger: tlOuter,
    start: "top top",
    end: () => `+=${travelX}`,
    scrub: 1.2,
    pin: tlPin,
    pinSpacing: false,
    anticipatePin: 1,
    invalidateOnRefresh: true,
    onUpdate(self) {
      const p = self.progress;
      tlPfill.style.width = p * 100 + "%";
      tlSfill.style.width = p * 100 + "%";
      if (p > 0.02) tlHint.style.opacity = "0";
      const active = Math.min(Math.floor(p * tlN + 0.2), tlN - 1);
      tlCurEl.textContent = active + 1;
      tlSlots.forEach((slot, i) => {
        const wasLit = slot.classList.contains("lit");
        const shouldLit = i <= active;
        if (shouldLit && !wasLit) {
          slot.classList.add("lit");
          tlRevealCard(i);
        } else if (!shouldLit && wasLit) {
          slot.classList.remove("lit");
          const isBelow = slot.classList.contains("below");
          gsap.to(tlCards[i], {
            opacity: 0,
            y: isBelow ? -20 : 20,
            duration: 0.3,
          });
        }
      });
    },
  },
});

tlCards.forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    gsap.to(card, {
      rotateX: -y * 6,
      rotateY: x * 6,
      duration: 0.25,
      ease: "power1.out",
      transformPerspective: 800,
    });
  });
  card.addEventListener("mouseleave", () => {
    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.55,
      ease: "elastic.out(1,0.6)",
    });
  });
});

window.addEventListener("resize", () => {
  tlInit();
  ScrollTrigger.refresh(true);
});

// ============================================================
// SKILL SECTION — cinematic stacked cards
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  const skillCards = document.querySelectorAll(".sticky-cards .card");
  const totalCards = skillCards.length;
  const skillCurEl = document.getElementById("skill-cur");

  const cardYStep = 14;
  const cardScaleStep = 0.055;

  skillCards.forEach((card, i) => {
    gsap.set(card, {
      xPercent: -50,
      yPercent: -50,
      y: i * cardYStep,
      scale: 1 - i * cardScaleStep,
      transformOrigin: "center bottom",
    });
  });

  const segmentSize = 1 / totalCards;
  const pinDuration = window.innerHeight * 6;

  ScrollTrigger.create({
    trigger: ".sticky-cards",
    start: "top top",
    end: `+=${pinDuration}px`,
    pin: true,
    pinSpacing: true,
    scrub: 1.2,
    // ── FIX: call ScrollTrigger.refresh after this pin is created
    // so the work section below re-calculates its start position correctly
    onRefresh() {
      ScrollTrigger.getAll()
        .filter(
          (st) => st.vars.trigger === document.getElementById("work-section"),
        )
        .forEach((st) => st.refresh());
    },
    onUpdate: (self) => {
      const progress = self.progress;
      const activeIndex = Math.min(
        Math.floor(progress / segmentSize),
        totalCards - 1,
      );
      const segProgress = (progress - activeIndex * segmentSize) / segmentSize;

      if (skillCurEl)
        skillCurEl.textContent = String(activeIndex + 1).padStart(2, "0");

      skillCards.forEach((card, i) => {
        if (i < activeIndex) {
          gsap.set(card, {
            yPercent: -50,
            y: -window.innerHeight * 0.55,
            rotationX: 28,
            scale: 0.88,
            opacity: 0,
            filter: "blur(6px)",
          });
        } else if (i === activeIndex) {
          const exitY = -window.innerHeight * 0.55;
          gsap.set(card, {
            yPercent: -50,
            y: gsap.utils.interpolate(0, exitY, segProgress),
            rotationX: gsap.utils.interpolate(0, 28, segProgress),
            scale: gsap.utils.interpolate(1, 0.88, segProgress),
            opacity: gsap.utils.interpolate(1, 0, segProgress),
            filter: `blur(${gsap.utils.interpolate(0, 6, segProgress)}px)`,
          });
        } else {
          const behindIndex = i - activeIndex;
          gsap.set(card, {
            yPercent: -50,
            y: gsap.utils.interpolate(
              behindIndex * cardYStep,
              (behindIndex - 1) * cardYStep,
              segProgress,
            ),
            rotationX: 0,
            scale: gsap.utils.interpolate(
              1 - behindIndex * cardScaleStep,
              1 - (behindIndex - 1) * cardScaleStep,
              segProgress,
            ),
            opacity: 1,
            filter: "blur(0px)",
          });
        }
      });
    },
  });
});

// ============================================================
// WORK SECTION — capsule expand + card scroll
// ──────────────────────────────────────────────────────────
// FIX: All measurements (vw, vh, targetW, targetH, card init)
// are now inside a function called AFTER ScrollTrigger.refresh,
// so the pinned skill section's extra scroll height is already
// accounted for when work section calculates its positions.
// ============================================================
function initWorkSection() {
  const workSection = document.getElementById("work-section");
  const workCapsule = document.getElementById("capsule");
  const workLetters = document.getElementById("workLetters");
  const workCards = document.querySelectorAll(".work-card");
  const workContainer = document.getElementById("cardsContainer");
  const workScrollHint = document.getElementById("scrollHint");

  // ── FIX: read dimensions inside the function, not at parse time ──
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const targetW = vw * 0.96;
  const targetH = vh * 0.92;

  // ── FIX: set initial card positions here, after refresh ──
  gsap.set(workCards, { x: (i) => 1400 + i * 120, opacity: 0 });

  ScrollTrigger.create({
    trigger: workSection,
    start: "top top",
    end: "bottom bottom",
    scrub: 1,
    onUpdate(self) {
      const p = self.progress;

      // Phase 1 (0 → 0.35): Capsule expands, letters fade
      const phase1 = Math.min(p / 0.35, 1);
      const eased1 = gsap.parseEase("power2.inOut")(phase1);
      const curW = gsap.utils.interpolate(200, targetW, eased1);
      const curH = gsap.utils.interpolate(520, targetH, eased1);
      const curR = gsap.utils.interpolate(999, 28, eased1);

      gsap.set(workCapsule, { width: curW, height: curH, borderRadius: curR });

      const letterOpacity = 1 - Math.min(phase1 * 1.6, 1);
      const letterScale = 1 + eased1 * 0.3;
      gsap.set(workLetters, { opacity: letterOpacity, scale: letterScale });
      document.querySelector(".capsule-ring").style.opacity = 1 - eased1;
      workScrollHint.style.opacity = 1 - Math.min(p / 0.1, 1);

      // Phase 2 (0.35 → 0.5): Cards fade in
      const phase2 = Math.max(0, Math.min((p - 0.35) / 0.15, 1));
      gsap.set(workContainer, { opacity: phase2 });
      workContainer.style.pointerEvents = phase2 > 0 ? "auto" : "none";

      // Phase 3 (0.5 → 1.0): Cards scroll horizontally
      if (p >= 0.5) {
        const slideP = (p - 0.5) / 0.5;
        const maxShift =
          (vw + 340 * workCards.length + 32 * (workCards.length - 1)) * 0.72;
        workCards.forEach((card, i) => {
          const cardP = Math.max(0, Math.min(slideP - i * 0.04, 1));
          const startX = 1400 + i * 120;
          const endX = -(maxShift * 0.7) - i * 372;
          gsap.set(card, {
            x: gsap.utils.interpolate(startX, endX, cardP),
            opacity: 1,
          });
        });
      } else {
        workCards.forEach((card, i) => gsap.set(card, { x: 1400 + i * 120 }));
      }
    },
  });
}

// ── Run work section init after a full ScrollTrigger refresh
//    so the skill section's pinSpacing is baked into page heights ──
ScrollTrigger.addEventListener("refresh", function onFirstRefresh() {
  ScrollTrigger.removeEventListener("refresh", onFirstRefresh);
  initWorkSection();
});

// ============================================================
// MATTER.JS — physics pill tags
// ──────────────────────────────────────────────────────────
// BUG FIX: The original code passed body setup statements
// (setAngle, bodies.push, World.add, setTimeout) as extra
// arguments to Matter.Bodies.rectangle() which silently
// ignored them — body was never stored or added to the world.
// Also, mouseConstraint was created inside the forEach loop
// so it was recreated for every object. Fixed below.
// ============================================================
// (function initMatterJS() {
//   const container = document.querySelector("#skill .object-container");
//   if (!container) return;

//   // Only init when section enters viewport
//   ScrollTrigger.create({
//     trigger: container,
//     start: "top bottom",
//     once: true,
//     onEnter: () => setupPhysics(container),
//   });
// })();

// function setupPhysics(container) {
//   const {
//     Engine,
//     Runner,
//     Bodies,
//     Body,
//     World,
//     Mouse,
//     MouseConstraint,
//     Events,
//   } = Matter;

//   const engine = Engine.create();
//   engine.gravity.y = 1;

//   const containerRect = container.getBoundingClientRect();
//   const W = containerRect.width;
//   const H = containerRect.height;
//   const T = 200; // wall thickness

//   // Walls
//   const walls = [
//     Bodies.rectangle(W / 2, H + T / 2, W + T * 2, T, { isStatic: true }), // floor
//     Bodies.rectangle(-T / 2, H / 2, T, H + T * 2, { isStatic: true }), // left
//     Bodies.rectangle(W + T / 2, H / 2, T, H + T * 2, { isStatic: true }), // right
//   ];
//   World.add(engine.world, walls);

//   // ── FIX: Build bodies correctly — separate statements ──
//   const bodiesData = [];
//   const objects = container.querySelectorAll(".object");

//   objects.forEach((obj, index) => {
//     const objRect = obj.getBoundingClientRect();
//     const bw = objRect.width;
//     const bh = objRect.height;
//     const startX = Math.random() * (W - bw) + bw / 2;
//     const startY = -300 - index * 180;

//     const body = Bodies.rectangle(startX, startY, bw, bh, {
//       restitution: 0.45,
//       friction: 0.15,
//       frictionAir: 0.02,
//       density: 0.002,
//       chamfer: { radius: 24 }, // rounded corners to match pill CSS
//     });

//     // FIX: setAngle AFTER body is created, as a separate call
//     Body.setAngle(body, (Math.random() - 0.5) * Math.PI);

//     World.add(engine.world, body);
//     bodiesData.push({ body, element: obj, width: bw, height: bh });
//   });

//   // Add ceiling after 3 s so objects settle first
//   setTimeout(() => {
//     const topWall = Bodies.rectangle(W / 2, -T / 2, W + T * 2, T, {
//       isStatic: true,
//     });
//     World.add(engine.world, topWall);
//   }, 3000);

//   // ── FIX: single mouse constraint, created once outside forEach ──
//   const mouse = Mouse.create(container);
//   // Remove scroll interference
//   mouse.element.removeEventListener("mousewheel", mouse.mousewheel);
//   mouse.element.removeEventListener("DOMMouseScroll", mouse.mousewheel);

//   const mc = MouseConstraint.create(engine, {
//     mouse,
//     constraint: { stiffness: 0.6, render: { visible: false } },
//   });
//   World.add(engine.world, mc);
//   mc.mouse.element.oncontextmenu = () => false;

//   // Preserve inertia during drag
//   let dragging = null,
//     origInertia = null;
//   Events.on(mc, "startdrag", ({ body }) => {
//     dragging = body;
//     if (dragging) {
//       origInertia = dragging.inertia;
//       Body.setInertia(dragging, Infinity);
//       Body.setVelocity(dragging, { x: 0, y: 0 });
//       Body.setAngularVelocity(dragging, 0);
//     }
//   });
//   Events.on(mc, "enddrag", () => {
//     if (dragging) {
//       Body.setInertia(dragging, origInertia || 1);
//       dragging = null;
//       origInertia = null;
//     }
//   });

//   function clamp(v, lo, hi) {
//     return Math.max(lo, Math.min(hi, v));
//   }

//   Events.on(engine, "beforeUpdate", () => {
//     if (!dragging) return;
//     const found = bodiesData.find((b) => b.body === dragging);
//     if (!found) return;
//     Body.setPosition(dragging, {
//       x: clamp(dragging.position.x, found.width / 2, W - found.width / 2),
//       y: clamp(dragging.position.y, found.height / 2, H - found.height / 2),
//     });
//     Body.setVelocity(dragging, {
//       x: clamp(dragging.velocity.x, -20, 20),
//       y: clamp(dragging.velocity.y, -20, 20),
//     });
//   });

//   container.addEventListener("mouseleave", () => {
//     mc.constraint.bodyB = null;
//     mc.constraint.pointB = null;
//   });
//   document.addEventListener("mouseup", () => {
//     mc.constraint.bodyB = null;
//     mc.constraint.pointB = null;
//   });

//   const runner = Runner.create();
//   Runner.run(runner, engine);

//   // Sync DOM positions with physics bodies every frame
//   function syncPositions() {
//     bodiesData.forEach(({ body, element, width, height }) => {
//       const x = clamp(body.position.x - width / 2, 0, W - width);
//       const y = clamp(body.position.y - height / 2, -height * 3, H - height);
//       element.style.left = x + "px";
//       element.style.top = y + "px";
//       element.style.transform = `rotate(${body.angle}rad)`;
//     });
//     requestAnimationFrame(syncPositions);
//   }
//   syncPositions();
// }

// ============================================================
// STICKY FOOTER — ExoApe layer-reveal pattern
// ─ Footer is position:fixed at bottom (z-index 0)
// ─ #scroll-main sits above it (z-index 1)
// ─ #footer-spacer at end of scroll-main = footer height
// ─ As user scrolls to page bottom, scroll-main slides off
//   and the fixed footer is revealed underneath
// ============================================================

(function initFooter() {
  const footer = document.getElementById("site-footer");
  const spacer = document.getElementById("footer-spacer");
  const workSticky = document.querySelector("#work-section .work-sticky");
  const backTop = document.getElementById("backToTop");

  // Match spacer height to footer height so reveal is 1:1
  function syncSpacerHeight() {
    const fh = footer.offsetHeight;
    spacer.style.height = fh + "px";
  }
  syncSpacerHeight();
  window.addEventListener("resize", syncSpacerHeight);

  // ── Footer content reveal animations ────────────────────
  // These run once when the footer starts to become visible
  // (i.e. when the user has scrolled most of the way through
  //  the spacer block that sits at the bottom of scroll-main)

  const footerRevealTl = gsap.timeline({ paused: true });

  footerRevealTl
    // eyebrow line
    .to(
      ".footer-eyebrow",
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "power3.out",
      },
      0,
    )
    // big title lines stagger
    .to(
      ".fbt-line",
      {
        opacity: 1,
        y: 0,
        duration: 1.05,
        ease: "expo.out",
        stagger: 0.12,
      },
      0.1,
    )
    // CTA button
    .to(
      ".footer-cta-btn",
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "expo.out",
      },
      0.5,
    )
    // divider rule
    .to(
      ".footer-rule",
      {
        opacity: 1,
        duration: 0.9,
        ease: "power2.out",
      },
      0.6,
    )
    // info grid columns
    .to(
      ".footer-grid",
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "expo.out",
      },
      0.75,
    )
    // bottom bar
    .to(
      ".footer-bar",
      {
        opacity: 1,
        duration: 0.7,
        ease: "power2.out",
      },
      0.9,
    );

  // ── Trigger: watch scroll-main's bottom edge ─────────────
  // When the spacer (= footer ghost) enters the viewport,
  // the footer is starting to be revealed → play animations.

  ScrollTrigger.create({
    trigger: spacer,
    start: "top 90%",
    once: true,
    onEnter() {
      footerRevealTl.play();
    },
  });

  // ── ExoApe layer-peel: work section scales down ──────────
  // As the user scrolls into the footer spacer zone,
  // the work section (last real section) shrinks slightly,
  // making it feel like the footer "peels" out from below.

  if (workSticky) {
    ScrollTrigger.create({
      trigger: spacer,
      start: "top bottom",
      end: "bottom bottom",
      scrub: 1.4,
      onUpdate(self) {
        const p = self.progress;
        const scale = 1 - p * 0.055;
        const br = p * 20;
        gsap.set(workSticky, {
          scale,
          borderRadius: br,
          transformOrigin: "bottom center",
          filter: `brightness(${1 - p * 0.18})`,
        });
      },
    });
  }

  // ── Back to top ──────────────────────────────────────────
  if (backTop) {
    backTop.addEventListener("click", () => {
      // Use the existing lenis instance (defined in script.js)
      if (typeof lenis !== "undefined") {
        lenis.scrollTo(0, { duration: 2 });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });

    // Show/hide with scroll position
    window.addEventListener("scroll", () => {
      // backTop visibility handled through footer visibility naturally
    });
  }
})();

// ======================================================= Theme
// ============================================================
// THEME SWITCHER — Ink Burst reveal with GSAP
// Paste this at the VERY END of your script.js,
// replacing the previous initThemeSwitcher block.
// ============================================================
(function initThemeSwitcher() {
  const root = document.documentElement;
  const navLogo = document.querySelector(".nav-logo");

  // Inject the full-screen ink overlay
  const overlay = document.createElement("div");
  overlay.id = "theme-ink-overlay";
  document.body.appendChild(overlay);

  let isLight = false;
  let isSwitching = false;

  navLogo.style.cursor = "pointer";
  navLogo.title = "Toggle theme";

  navLogo.addEventListener("click", () => {
    if (isSwitching) return;
    isSwitching = true;

    // Origin = centre of the nav logo icon
    const rect = navLogo.getBoundingClientRect();
    const originX = rect.left + rect.width / 2;
    const originY = rect.top + rect.height / 2;
    const xPct = ((originX / window.innerWidth) * 100).toFixed(2) + "%";
    const yPct = ((originY / window.innerHeight) * 100).toFixed(2) + "%";

    // Destination theme colour floods the overlay
    const nextBg = isLight ? "#050507" : "#F4F2EE";
    overlay.style.background = nextBg;

    // Spawn splatter particles around the icon
    spawnInkParticles(originX, originY, nextBg);

    // Max radius = viewport diagonal converted to a percentage
    const diag = Math.sqrt(window.innerWidth ** 2 + window.innerHeight ** 2);
    const maxR =
      ((diag / Math.min(window.innerWidth, window.innerHeight)) * 72).toFixed(
        1,
      ) + "%";

    // Phase 1 — ink floods outward from icon
    gsap.fromTo(
      overlay,
      { clipPath: `circle(0% at ${xPct} ${yPct})` },
      {
        clipPath: `circle(${maxR} at ${xPct} ${yPct})`,
        duration: 0.75,
        ease: "power2.inOut",
        onComplete() {
          // Swap theme at full-screen coverage (user sees nothing)
          isLight = !isLight;
          applyTheme(isLight);

          // Phase 2 — ink retracts back to icon
          gsap.to(overlay, {
            clipPath: `circle(0% at ${xPct} ${yPct})`,
            duration: 0.6,
            ease: "power2.inOut",
            onComplete() {
              isSwitching = false;
            },
          });
        },
      },
    );
  });

  // ── Apply / remove class + save preference ──────────────
  function applyTheme(light) {
    if (light) {
      root.classList.add("light-theme");
      localStorage.setItem("theme", "light");
    } else {
      root.classList.remove("light-theme");
      localStorage.setItem("theme", "dark");
    }
    // Let ScrollTrigger recalculate after layout shift
    ScrollTrigger.refresh();
  }

  // ── Splatter particles ──────────────────────────────────
  function spawnInkParticles(cx, cy, color) {
    const count = 18;
    for (let i = 0; i < count; i++) {
      const p = document.createElement("div");
      p.className = "theme-ink-particle";
      const size = Math.random() * 22 + 6;
      const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.7;
      const dist = Math.random() * 100 + 20;

      Object.assign(p.style, {
        width: size + "px",
        height: size + "px",
        background: color,
        left: cx - size / 2 + "px",
        top: cy - size / 2 + "px",
        opacity: "0",
      });
      document.body.appendChild(p);

      gsap.to(p, {
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist,
        opacity: 0.85,
        duration: 0.25,
        ease: "power2.out",
        onComplete() {
          gsap.to(p, {
            opacity: 0,
            scale: 0.2,
            duration: 0.4,
            ease: "power2.in",
            onComplete: () => p.remove(),
          });
        },
      });
    }
  }

  // ── Restore saved preference on page load ───────────────
  if (localStorage.getItem("theme") === "light") {
    isLight = true;
    root.classList.add("light-theme"); // instant — no animation on load
  }
})();
