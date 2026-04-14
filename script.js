gsap.registerPlugin(SplitText, CustomEase, ScrollTrigger);

const lenis = new Lenis();
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

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
      document.body.classList.remove("loading");
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

  // const navImg = document.querySelector(".nav-image");
  // if (navImg) {
  //   Shery.imageEffect(".nav-image", { style: 1 });
  // }

  // Shery.imageEffect(".nav-image", {
  //   style: 2 /*OR 5 for different variant */,
  //   debug: true,
  // });
}

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
    uniforms.uResolution.value.set(W, H);
    renderer.setSize(W, H);
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

  function heroAnimate() {
    requestAnimationFrame(heroAnimate);
    currentMouse.x += (targetMouse.x - currentMouse.x) * 0.07;
    currentMouse.y += (targetMouse.y - currentMouse.y) * 0.07;
    uniforms.uMouse.value.copy(currentMouse);
    uniforms.uHover.value += (targetHover - uniforms.uHover.value) * 0.05;
    uniforms.uTime.value += 0.016;
    renderer.render(scene, camera);
    drawTrail();
    drawRipples();
  }
  heroAnimate();

  const ro = new ResizeObserver(resize);
  ro.observe(wrap);
})();

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

document.addEventListener("DOMContentLoaded", () => {
  const skillCards = document.querySelectorAll(".sticky-cards .card");
  const totalCards = skillCards.length;
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

function initWorkSection() {
  const workSection = document.getElementById("work-section");
  const workCapsule = document.getElementById("capsule");
  const workLetters = document.getElementById("workLetters");
  const workCards = document.querySelectorAll(".work-card");
  const workContainer = document.getElementById("cardsContainer");
  const workScrollHint = document.getElementById("scrollHint");

  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const targetW = vw * 0.96;
  const targetH = vh * 0.92;

  gsap.set(workCards, { x: (i) => 1400 + i * 120, opacity: 0 });

  ScrollTrigger.create({
    trigger: workSection,
    start: "top top",
    end: "bottom bottom",
    scrub: 1,
    onUpdate(self) {
      const p = self.progress;
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

      const phase2 = Math.max(0, Math.min((p - 0.35) / 0.15, 1));
      gsap.set(workContainer, { opacity: phase2 });
      workContainer.style.pointerEvents = phase2 > 0 ? "auto" : "none";

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

ScrollTrigger.addEventListener("refresh", function onFirstRefresh() {
  ScrollTrigger.removeEventListener("refresh", onFirstRefresh);
  initWorkSection();
});

(function initMatterJS() {
  const section = document.querySelector("#skills");
  const container = section ? section.querySelector(".object-container") : null;
  if (!container) return;

  ScrollTrigger.create({
    trigger: section,
    start: "top 85%",
    once: true,
    onEnter: () => setupPhysics(container, section),
  });
})();

function setupPhysics(container, section) {
  const {
    Engine,
    Runner,
    Bodies,
    Body,
    World,
    Mouse,
    MouseConstraint,
    Events,
  } = Matter;

  const engine = Engine.create();
  engine.gravity.y = 1;

  const sectionRect = section.getBoundingClientRect();
  const W = sectionRect.width;
  const H = sectionRect.height;
  const T = 200;

  const walls = [
    Bodies.rectangle(W / 2, H + T / 2, W + T * 2, T, { isStatic: true }),
    Bodies.rectangle(-T / 2, H / 2, T, H + T * 2, { isStatic: true }),
    Bodies.rectangle(W + T / 2, H / 2, T, H + T * 2, { isStatic: true }),
  ];
  World.add(engine.world, walls);

  const bodiesData = [];
  const objects = container.querySelectorAll(".object");

  objects.forEach((obj, index) => {
    obj.style.position = "absolute";
    obj.style.left = "0px";
    obj.style.top = "0px";
    const objRect = obj.getBoundingClientRect();
    const bw = Math.max(objRect.width, 80);
    const bh = Math.max(objRect.height, 40);
    const startX = Math.random() * (W - bw - 40) + bw / 2 + 20;
    const startY = -150 - index * 120;

    const body = Bodies.rectangle(startX, startY, bw, bh, {
      restitution: 0.4,
      friction: 0.18,
      frictionAir: 0.025,
      density: 0.002,
      chamfer: { radius: Math.min(bh / 2, 28) },
    });
    Body.setAngle(body, (Math.random() - 0.5) * 0.8);
    World.add(engine.world, body);
    bodiesData.push({ body, element: obj, width: bw, height: bh });
  });

  setTimeout(() => {
    const topWall = Bodies.rectangle(W / 2, -T / 2, W + T * 2, T, {
      isStatic: true,
    });
    World.add(engine.world, topWall);
  }, 2500);

  const mouse = Mouse.create(section);
  mouse.element.removeEventListener("mousewheel", mouse.mousewheel);
  mouse.element.removeEventListener("DOMMouseScroll", mouse.mousewheel);

  const containerOffset = { x: container.offsetLeft, y: container.offsetTop };
  mouse.offset = { x: -containerOffset.x, y: -containerOffset.y };

  const mc = MouseConstraint.create(engine, {
    mouse,
    constraint: { stiffness: 0.55, render: { visible: false } },
  });
  World.add(engine.world, mc);

  let dragging = null,
    origInertia = null;
  Events.on(mc, "startdrag", ({ body }) => {
    dragging = body;
    if (dragging) {
      origInertia = dragging.inertia;
      Body.setInertia(dragging, Infinity);
      Body.setVelocity(dragging, { x: 0, y: 0 });
      Body.setAngularVelocity(dragging, 0);
    }
  });
  Events.on(mc, "enddrag", () => {
    if (dragging) {
      Body.setInertia(dragging, origInertia || 1);
      dragging = null;
      origInertia = null;
    }
  });

  function clamp(v, lo, hi) {
    return Math.max(lo, Math.min(hi, v));
  }

  Events.on(engine, "beforeUpdate", () => {
    if (!dragging) return;
    const found = bodiesData.find((b) => b.body === dragging);
    if (!found) return;
    Body.setPosition(dragging, {
      x: clamp(
        dragging.position.x,
        found.width / 2 + 4,
        W - found.width / 2 - 4,
      ),
      y: clamp(
        dragging.position.y,
        found.height / 2 + 4,
        H - found.height / 2 - 4,
      ),
    });
    Body.setVelocity(dragging, {
      x: clamp(dragging.velocity.x, -18, 18),
      y: clamp(dragging.velocity.y, -18, 18),
    });
  });

  section.addEventListener("mouseleave", () => {
    mc.constraint.bodyB = null;
    mc.constraint.pointB = null;
  });
  document.addEventListener("mouseup", () => {
    mc.constraint.bodyB = null;
    mc.constraint.pointB = null;
  });

  const runner = Runner.create();
  Runner.run(runner, engine);

  function syncPositions() {
    bodiesData.forEach(({ body, element, width, height }) => {
      const x = clamp(body.position.x - width / 2, 0, W - width);
      const y = clamp(body.position.y - height / 2, -height * 4, H - height);
      element.style.left = x + "px";
      element.style.top = y + "px";
      element.style.transform = `rotate(${body.angle}rad)`;
    });
    requestAnimationFrame(syncPositions);
  }
  syncPositions();
}

(function initFooter() {
  const footer = document.getElementById("site-footer");
  const spacer = document.getElementById("footer-spacer");
  const workSticky = document.querySelector("#work-section .work-sticky");
  const backTop = document.getElementById("backToTop");

  function syncSpacerHeight() {
    spacer.style.height = footer.offsetHeight + "px";
  }
  syncSpacerHeight();
  window.addEventListener("resize", syncSpacerHeight);

  const footerRevealTl = gsap.timeline({ paused: true });
  footerRevealTl
    .to(
      ".footer-eyebrow",
      { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" },
      0,
    )
    .to(
      ".fbt-line",
      { opacity: 1, y: 0, duration: 1.05, ease: "expo.out", stagger: 0.12 },
      0.1,
    )
    .to(
      ".video-container video",
      { opacity: 1, y: 0, duration: 1.05, ease: "expo.out" },
      0.3,
    )
    .to(
      ".why-marquee",
      { opacity: 1, y: 0, duration: 1.05, ease: "expo.out" },
      0.4,
    )
    .to(
      ".footer-cta-btn",
      { opacity: 1, y: 0, duration: 0.8, ease: "expo.out" },
      0.5,
    )
    .to(".footer-rule", { opacity: 1, duration: 0.9, ease: "power2.out" }, 0.6)
    .to(
      ".footer-grid",
      { opacity: 1, y: 0, duration: 0.8, ease: "expo.out" },
      0.75,
    )
    .to(".footer-bar", { opacity: 1, duration: 0.7, ease: "power2.out" }, 0.9);

  ScrollTrigger.create({
    trigger: spacer,
    start: "top 90%",
    once: true,
    onEnter() {
      footerRevealTl.play();
    },
  });

  if (workSticky) {
    ScrollTrigger.create({
      trigger: spacer,
      start: "top bottom",
      end: "bottom bottom",
      scrub: 1.4,
      onUpdate(self) {
        const p = self.progress;
        gsap.set(workSticky, {
          scale: 1 - p * 0.055,
          borderRadius: p * 20,
          transformOrigin: "bottom center",
          filter: `brightness(${1 - p * 0.18})`,
        });
      },
    });
  }

  if (backTop) {
    backTop.addEventListener("click", () => {
      if (typeof lenis !== "undefined") {
        lenis.scrollTo(0, { duration: 2 });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  }
})();

(function initThemeSwitcher() {
  const root = document.documentElement;
  const navLogo = document.querySelector(".nav-logo");

  const overlay = document.createElement("div");
  overlay.id = "theme-ink-overlay";
  document.body.appendChild(overlay);

  let isLight = false,
    isSwitching = false;
  navLogo.style.cursor = "pointer";
  navLogo.title = "Toggle theme";

  navLogo.addEventListener("click", () => {
    if (isSwitching) return;
    isSwitching = true;
    const rect = navLogo.getBoundingClientRect();
    const originX = rect.left + rect.width / 2;
    const originY = rect.top + rect.height / 2;
    const xPct = ((originX / window.innerWidth) * 100).toFixed(2) + "%";
    const yPct = ((originY / window.innerHeight) * 100).toFixed(2) + "%";
    const nextBg = isLight ? "#050507" : "#F4F2EE";
    overlay.style.background = nextBg;
    spawnInkParticles(originX, originY, nextBg);
    const diag = Math.sqrt(window.innerWidth ** 2 + window.innerHeight ** 2);
    const maxR =
      ((diag / Math.min(window.innerWidth, window.innerHeight)) * 72).toFixed(
        1,
      ) + "%";

    gsap.fromTo(
      overlay,
      { clipPath: `circle(0% at ${xPct} ${yPct})` },
      {
        clipPath: `circle(${maxR} at ${xPct} ${yPct})`,
        duration: 0.75,
        ease: "power2.inOut",
        onComplete() {
          isLight = !isLight;
          applyTheme(isLight);
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

  function applyTheme(light) {
    if (light) {
      root.classList.add("light-theme");
      localStorage.setItem("theme", "light");
    } else {
      root.classList.remove("light-theme");
      localStorage.setItem("theme", "dark");
    }
    ScrollTrigger.refresh();
  }

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

  if (localStorage.getItem("theme") === "light") {
    isLight = true;
    root.classList.add("light-theme");
  }
})();

// (function initFooterParticles() {
//   const footerCanvas = document.querySelector("#webgl");
//   if (!footerCanvas) return;

//   // Create circular particle texture via offscreen canvas
//   function makeStarTexture() {
//     const size = 64;
//     const c = document.createElement("canvas");
//     c.width = c.height = size;
//     const ctx = c.getContext("2d");
//     const gradient = ctx.createRadialGradient(
//       size / 2,
//       size / 2,
//       0,
//       size / 2,
//       size / 2,
//       size / 2,
//     );
//     gradient.addColorStop(0, "rgba(255,255,255,1)");
//     gradient.addColorStop(0.3, "rgba(180,160,255,0.9)");
//     gradient.addColorStop(0.7, "rgba(100,80,200,0.4)");
//     gradient.addColorStop(1, "rgba(0,0,0,0)");
//     ctx.fillStyle = gradient;
//     ctx.beginPath();
//     ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
//     ctx.fill();
//     return new THREE.CanvasTexture(c);
//   }

//   const footerScene = new THREE.Scene();
//   const footerSizes = {
//     width: footerCanvas.offsetWidth || window.innerWidth,
//     height: footerCanvas.offsetHeight || window.innerHeight,
//   };

//   const footerCamera = new THREE.PerspectiveCamera(
//     75,
//     footerSizes.width / footerSizes.height,
//     0.1,
//     100,
//   );
//   footerCamera.position.z = 5;
//   footerScene.add(footerCamera);

//   const footerRenderer = new THREE.WebGLRenderer({
//     canvas: footerCanvas,
//     alpha: true,
//   });
//   footerRenderer.setSize(footerSizes.width, footerSizes.height);
//   footerRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

//   const starTexture = makeStarTexture();
//   const geo1 = new THREE.BufferGeometry();
//   const count1 = 1200;
//   const pos1 = new Float32Array(count1 * 3);
//   for (let i = 0; i < count1 * 3; i++) pos1[i] = (Math.random() - 0.5) * 14;
//   geo1.setAttribute("position", new THREE.BufferAttribute(pos1, 3));
//   const mat1 = new THREE.PointsMaterial({
//     size: 0.04,
//     map: starTexture,
//     transparent: true,
//     alphaTest: 0.01,
//     depthWrite: false,
//     sizeAttenuation: true,
//     color: new THREE.Color(0xc8c0ff),
//   });
//   footerScene.add(new THREE.Points(geo1, mat1));

//   // Layer 2 — mid stars (purple-blue)
//   const geo2 = new THREE.BufferGeometry();
//   const count2 = 400;
//   const pos2 = new Float32Array(count2 * 3);
//   for (let i = 0; i < count2 * 3; i++) pos2[i] = (Math.random() - 0.5) * 10;
//   geo2.setAttribute("position", new THREE.BufferAttribute(pos2, 3));
//   const mat2 = new THREE.PointsMaterial({
//     size: 0.07,
//     map: starTexture,
//     transparent: true,
//     alphaTest: 0.01,
//     depthWrite: false,
//     sizeAttenuation: true,
//     color: new THREE.Color(0x9070ff),
//   });
//   footerScene.add(new THREE.Points(geo2, mat2));

//   // Layer 3 — bright accent stars (cyan)
//   const geo3 = new THREE.BufferGeometry();
//   const count3 = 80;
//   const pos3 = new Float32Array(count3 * 3);
//   for (let i = 0; i < count3 * 3; i++) pos3[i] = (Math.random() - 0.5) * 8;
//   geo3.setAttribute("position", new THREE.BufferAttribute(pos3, 3));
//   const mat3 = new THREE.PointsMaterial({
//     size: 0.13,
//     map: starTexture,
//     transparent: true,
//     alphaTest: 0.01,
//     depthWrite: false,
//     sizeAttenuation: true,
//     color: new THREE.Color(0x06d6f0),
//   });
//   footerScene.add(new THREE.Points(geo3, mat3));

//   let mouseX = 0,
//     mouseY = 0;
//   window.addEventListener("mousemove", (e) => {
//     mouseX = e.clientX / footerSizes.width - 0.5;
//     mouseY = e.clientY / footerSizes.height - 0.5;
//   });

//   const clock = new THREE.Clock();

//   function footerAnimate() {
//     const t = clock.getElapsedTime();
//     // Slow galaxy rotation — each layer at different speeds
//     footerScene.children.forEach((obj, i) => {
//       if (obj.isPoints) {
//         obj.rotation.y = t * (0.02 + i * 0.008);
//         obj.rotation.x = t * 0.005;
//       }
//     });
//     // Subtle parallax from mouse
//     footerCamera.position.x += (mouseX * 1.5 - footerCamera.position.x) * 0.02;
//     footerCamera.position.y += (-mouseY * 1.5 - footerCamera.position.y) * 0.02;
//     footerRenderer.render(footerScene, footerCamera);
//     requestAnimationFrame(footerAnimate);
//   }
//   footerAnimate();

//   // Resize relative to footer element
//   const resizeObserver = new ResizeObserver(() => {
//     footerSizes.width = footerCanvas.offsetWidth;
//     footerSizes.height = footerCanvas.offsetHeight;
//     footerCamera.aspect = footerSizes.width / footerSizes.height;
//     footerCamera.updateProjectionMatrix();
//     footerRenderer.setSize(footerSizes.width, footerSizes.height);
//   });
//   resizeObserver.observe(footerCanvas.parentElement);
// })();

(function () {
  const cards = document.querySelectorAll(".hc");

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const idx = [...cards].indexOf(el);
        setTimeout(() => {
          el.style.transition =
            "opacity .65s ease, transform .65s cubic-bezier(.22,.68,0,1.2), border-color .35s, box-shadow .35s";
          el.classList.add("in-view");
        }, idx * 90);
        io.unobserve(el);
      });
    },
    { threshold: 0.1 },
  );

  cards.forEach((c) => io.observe(c));

  cards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transition = "border-color .35s, box-shadow .35s";
      card.style.transform = `translateY(-4px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg) scale(1.01)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transition =
        "transform .5s cubic-bezier(.22,.68,0,1.2), border-color .35s, box-shadow .35s";
      card.style.transform = "translateY(0) rotateX(0) rotateY(0) scale(1)";
    });
  });
})();

(function () {
  const canvas = document.getElementById("phone-canvas");
  if (!canvas) return;
  const parent = canvas.parentElement;

  const phoneRenderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  });
  phoneRenderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  phoneRenderer.shadowMap.enabled = true;
  phoneRenderer.shadowMap.type = THREE.PCFSoftShadowMap;
  phoneRenderer.toneMapping = THREE.ACESFilmicToneMapping;
  phoneRenderer.toneMappingExposure = 1.1;

  const phoneScene = new THREE.Scene();
  const phoneCamera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  phoneCamera.position.set(0, 1.8, 7.5);
  phoneCamera.lookAt(0, 0, 0);

  function phoneResize() {
    const w = parent.offsetWidth,
      h = parent.offsetHeight;
    phoneRenderer.setSize(w, h);
    phoneCamera.aspect = w / h;
    phoneCamera.updateProjectionMatrix();
  }
  phoneResize();
  window.addEventListener("resize", phoneResize);

  const phoneMat = new THREE.MeshStandardMaterial({
    color: 0x7c3aed,
    roughness: 0.28,
    metalness: 0.55,
  });
  const phoneDarkMat = new THREE.MeshStandardMaterial({
    color: 0x3b1a8a,
    roughness: 0.4,
    metalness: 0.4,
  });
  const dialMat = new THREE.MeshStandardMaterial({
    color: 0x5b21b6,
    roughness: 0.3,
    metalness: 0.6,
  });
  const holeMat = new THREE.MeshStandardMaterial({
    color: 0x0d0d1a,
    roughness: 0.9,
    metalness: 0,
  });
  const cordMat = new THREE.MeshStandardMaterial({
    color: 0x4c1d95,
    roughness: 0.7,
    metalness: 0.1,
  });

  phoneScene.add(new THREE.AmbientLight(0x7c3aed, 0.4));
  const keyLight = new THREE.DirectionalLight(0x06b6d4, 3.5);
  keyLight.position.set(4, 6, 4);
  keyLight.castShadow = true;
  phoneScene.add(keyLight);
  const fillLight = new THREE.DirectionalLight(0x7c3aed, 2);
  fillLight.position.set(-4, 2, 2);
  phoneScene.add(fillLight);
  const rimLight = new THREE.DirectionalLight(0x06b6d4, 1.5);
  rimLight.position.set(0, -3, -4);
  phoneScene.add(rimLight);
  const pointL = new THREE.PointLight(0x7c3aed, 8, 12);
  pointL.position.set(0, 3, 2);
  phoneScene.add(pointL);

  const phone = new THREE.Group();
  phoneScene.add(phone);

  const body = new THREE.Mesh(
    new THREE.BoxGeometry(3.2, 0.9, 2.2, 8, 4, 8),
    phoneMat,
  );
  body.castShadow = true;
  body.receiveShadow = true;
  phone.add(body);

  const slope = new THREE.Mesh(
    new THREE.BoxGeometry(3.0, 0.12, 1.5, 6, 2, 6),
    phoneDarkMat,
  );
  slope.position.set(0, 0.45, -0.1);
  slope.rotation.x = 0.18;
  phone.add(slope);

  const dialGroup = new THREE.Group();
  dialGroup.position.set(0.4, 0.52, 0.15);
  dialGroup.rotation.x = -0.2;
  phone.add(dialGroup);

  dialGroup.add(
    new THREE.Mesh(new THREE.CylinderGeometry(0.72, 0.72, 0.12, 48), dialMat),
  );
  const dialInner = new THREE.Mesh(
    new THREE.CylinderGeometry(0.52, 0.52, 0.14, 48),
    phoneDarkMat,
  );
  dialInner.position.y = 0.02;
  dialGroup.add(dialInner);
  const dialCenter = new THREE.Mesh(
    new THREE.CylinderGeometry(0.18, 0.18, 0.16, 24),
    phoneMat,
  );
  dialCenter.position.y = 0.03;
  dialGroup.add(dialCenter);

  for (let i = 0; i < 10; i++) {
    const angle = (i / 10) * Math.PI * 2 - Math.PI * 0.05;
    const hg = new THREE.Group();
    hg.position.set(Math.sin(angle) * 0.37, 0.055, Math.cos(angle) * 0.37);
    hg.add(
      new THREE.Mesh(
        new THREE.CylinderGeometry(0.065, 0.065, 0.18, 16),
        holeMat,
      ),
    );
    dialGroup.add(hg);
  }
  const peg = new THREE.Mesh(
    new THREE.CylinderGeometry(0.04, 0.04, 0.2, 12),
    phoneDarkMat,
  );
  peg.position.set(0.58, 0.06, 0);
  dialGroup.add(peg);

  const handset = new THREE.Group();
  handset.position.set(-0.55, 0.85, 0);
  handset.rotation.z = -0.3;
  handset.rotation.y = 0.15;
  phone.add(handset);

  const bar = new THREE.Mesh(
    new THREE.CylinderGeometry(0.16, 0.16, 2.6, 20),
    phoneDarkMat,
  );
  bar.rotation.z = Math.PI / 2;
  handset.add(bar);

  const ear = new THREE.Mesh(
    new THREE.SphereGeometry(0.28, 20, 16, 0, Math.PI * 2, 0, Math.PI * 0.6),
    phoneMat,
  );
  ear.position.set(1.35, 0, 0);
  ear.rotation.z = Math.PI * 0.5;
  handset.add(ear);

  const mouth = new THREE.Mesh(
    new THREE.SphereGeometry(0.28, 20, 16, 0, Math.PI * 2, 0, Math.PI * 0.6),
    phoneMat,
  );
  mouth.position.set(-1.35, 0, 0);
  mouth.rotation.z = -Math.PI * 0.5;
  handset.add(mouth);

  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (Math.abs(i) + Math.abs(j) > 1) continue;
      const d1 = new THREE.Mesh(
        new THREE.CylinderGeometry(0.025, 0.025, 0.06, 8),
        holeMat,
      );
      d1.position.set(1.38 + j * 0.1, i * 0.1, 0);
      d1.rotation.z = Math.PI / 2;
      handset.add(d1);
      const d2 = new THREE.Mesh(
        new THREE.CylinderGeometry(0.025, 0.025, 0.06, 8),
        holeMat,
      );
      d2.position.set(-1.38 + j * 0.1, i * 0.1, 0);
      d2.rotation.z = Math.PI / 2;
      handset.add(d2);
    }
  }

  const cordPts = [];
  for (let t = 0; t <= 1; t += 0.02) {
    const angle = t * 8 * Math.PI * 2;
    const x = -0.55 + t * 0.3;
    const y = 0.6 - t * 1.5 + Math.sin(t * Math.PI) * 0.3;
    const z = Math.cos(angle) * 0.15 * (1 - t * 0.3);
    const w = Math.sin(angle) * 0.15 * (1 - t * 0.3);
    cordPts.push(new THREE.Vector3(x + z, y, w));
  }
  const cordCurve = new THREE.CatmullRomCurve3(cordPts);
  phone.add(
    new THREE.Mesh(
      new THREE.TubeGeometry(cordCurve, 60, 0.04, 8, false),
      cordMat,
    ),
  );

  for (let i = 0; i < 3; i++) {
    const btn = new THREE.Mesh(
      new THREE.BoxGeometry(0.22, 0.08, 0.14, 2, 2, 2),
      phoneDarkMat,
    );
    btn.position.set(-1.0, 0.5, 0.4 - i * 0.45);
    phone.add(btn);
  }

  const floor = new THREE.Mesh(
    new THREE.CircleGeometry(5, 48),
    new THREE.ShadowMaterial({ opacity: 0.35 }),
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -0.8;
  floor.receiveShadow = true;
  phoneScene.add(floor);

  phoneScene.add(
    Object.assign(
      new THREE.Mesh(
        new THREE.CircleGeometry(1.2, 32),
        new THREE.MeshBasicMaterial({
          color: 0x7c3aed,
          transparent: true,
          opacity: 0.12,
        }),
      ),
      { rotation: { x: -Math.PI / 2 }, position: { y: -0.79 } },
    ),
  );

  phone.scale.setScalar(0.88);
  phone.position.set(0, -0.1, 0);
  phone.rotation.y = 0.4;
  phone.rotation.x = 0.08;

  let targetRY = 0.4,
    targetRX = 0.08;
  parent.addEventListener("mousemove", (e) => {
    const r = parent.getBoundingClientRect();
    const mx = ((e.clientX - r.left) / r.width - 0.5) * 2;
    const my = ((e.clientY - r.top) / r.height - 0.5) * 2;
    targetRY = 0.4 + mx * 0.45;
    targetRX = 0.08 - my * 0.2;
  });
  parent.addEventListener("mouseleave", () => {
    targetRY = 0.4;
    targetRX = 0.08;
  });

  let pt = 0;
  function phoneLoop() {
    requestAnimationFrame(phoneLoop);
    pt += 0.012;
    phone.rotation.y += (targetRY - phone.rotation.y) * 0.04;
    phone.rotation.x += (targetRX - phone.rotation.x) * 0.04;
    phone.position.y = -0.1 + Math.sin(pt) * 0.06;
    dialGroup.rotation.y = pt * 0.18;
    keyLight.intensity = 3.5 + Math.sin(pt * 1.3) * 0.5;
    pointL.intensity = 8 + Math.sin(pt * 0.9) * 2;
    phoneRenderer.render(phoneScene, phoneCamera);
  }
  phoneLoop();
})();

(function initContactForm() {
  const fm = document.getElementById("fm");
  const cc = document.getElementById("cc");
  if (!fm || !cc) return;

  fm.addEventListener("input", () => {
    const n = fm.value.length;
    cc.textContent = n + " / 500";
    cc.style.color = n > 430 ? "#f43f5e" : "#6b7280";
  });

  const sb = document.getElementById("sb");
  const formBody = document.getElementById("form-body");
  const ss = document.getElementById("ss");
  const rb = document.getElementById("rb");

  if (!sb || !formBody || !ss || !rb) return;

  sb.addEventListener("click", () => {
    const fields = [
      document.getElementById("fn"),
      document.getElementById("fe"),
      fm,
    ];
    let ok = true;
    fields.forEach((el) => {
      if (!el || !el.value.trim()) {
        if (el) {
          el.style.borderColor = "#f43f5e";
          setTimeout(() => (el.style.borderColor = ""), 1400);
        }
        ok = false;
      }
    });
    if (!ok) return;

    sb.innerHTML = "Sending…";
    sb.disabled = true;
    setTimeout(() => {
      formBody.style.transition = "opacity .4s";
      formBody.style.opacity = "0";
      setTimeout(() => {
        formBody.style.display = "none";
        ss.style.display = "flex";
        ss.style.opacity = "0";
        ss.style.transition = "opacity .45s";
        setTimeout(() => (ss.style.opacity = "1"), 30);
      }, 420);
    }, 1100);
  });

  rb.addEventListener("click", () => {
    ss.style.opacity = "0";
    setTimeout(() => {
      ss.style.display = "none";
      ["fn", "fe", "fs"].forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.value = "";
      });
      fm.value = "";
      cc.textContent = "0 / 500";
      formBody.style.display = "";
      formBody.style.opacity = "0";
      setTimeout(() => {
        formBody.style.transition = "opacity .4s";
        formBody.style.opacity = "1";
      }, 30);
      sb.innerHTML =
        'Send Message <svg viewBox="0 0 24 24" style="width:13px;height:13px;stroke:#fff;fill:none;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>';
      sb.disabled = false;
    }, 420);
  });
})();
