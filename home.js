// Orbi homepage motion: tunnel of model screenshots (Three.js), manifesto wires,
// film strip, index follower, price sky. Structure adapted from the Margem bundle (ProfitizeBuild).
import * as THREE from "./vendor/three.module.min.js";

const { gsap, ScrollTrigger, Lenis } = window;
gsap.registerPlugin(ScrollTrigger);
const reduz = matchMedia("(prefers-reduced-motion: reduce)").matches;
const ponteiroFino = matchMedia("(pointer: fine)").matches;
const FUNDO = 0xC8FF3D;
const WA = "https://wa.me/5511927013668?text=";

/* ---------- data ---------- */
const casos = [
  { nome: "Brasa Burger", nicho: "Hamburgueria", f: "comida", url: "modelos/hamburgueria/", img: "img/tunel/d-brasa.webp", mini: "img/tunel/i-brasa.webp",
    meta: "Modelo · Hamburgueria · pedido no WhatsApp", resumo: "Os lanches saem da parede e abrem em tela cheia. O pedido chega pronto no WhatsApp." },
  { nome: "Navalha Club", nicho: "Barbearia", f: "beleza", url: "modelos/barbearia/", img: "img/tunel/d-navalha.webp", mini: "img/tunel/i-navalha.webp",
    meta: "Modelo · Barbearia · agenda em 3 toques", resumo: "Corte, barba e combo em cena, com agenda de horário que confirma no WhatsApp." },
  { nome: "Cantina Rossi", nicho: "Restaurante", f: "comida", url: "modelos/cardapio/", img: "img/tunel/d-rossi.webp", mini: "img/tunel/i-rossi.webp",
    meta: "Modelo · Restaurante · cardápio com preços", resumo: "Do forno a lenha até a mesa, com o cardápio inteiro e o pedido pelo celular." },
  { nome: "Pelúcia Pet", nicho: "Pet shop", f: "pets", url: "modelos/petshop/", img: "img/tunel/d-pelucia.webp", mini: "img/tunel/i-pelucia.webp",
    meta: "Modelo · Pet shop · preço pelo porte", resumo: "Banho, tosa e leva e traz, com preço pelo porte e agendamento em um minuto." },
];

/* ---------- smooth scroll ---------- */
let lenis = null;
function ligarLenis() {
  if (reduz || !Lenis) return;
  lenis = new Lenis({ anchors: true, lerp: 0.1 });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}

/* ---------- nav hides on scroll down ---------- */
function nav() {
  const el = document.getElementById("nav");
  let ultimo = 0;
  ScrollTrigger.create({ start: 0, end: "max", onUpdate: (s) => {
    const y = s.scroll();
    const desce = y > ultimo;
    el.classList.toggle("some", desce && y > innerHeight * 0.5);
    el.classList.toggle("veu", !desce && y > innerHeight * 0.5);
    ultimo = y;
  }});
}

/* ---------- 1 · tunnel ---------- */
function rng(seed) { return () => { seed |= 0; seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const smooth = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const lerp = (a, b, t) => a + (b - a) * t;

async function tunel() {
  const sec = document.getElementById("tunel");
  const canvas = sec.querySelector("canvas");
  const pecas = await fetch("img/tunel/pecas.json").then((r) => r.json());

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setClearColor(FUNDO, 1);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(FUNDO, 9, 44);
  const camera = new THREE.PerspectiveCamera(50, 1, 0.05, 120);
  camera.position.set(0, 0, 6);

  let sujo = true;
  const loader = new THREE.TextureLoader();
  const tex = (src) => { const t = loader.load(src, () => { sujo = true; }); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t; };
  const texturas = pecas.map((p) => tex(p.src));
  const geo = new THREE.PlaneGeometry(1, 1);

  function material(map) {
    const m = new THREE.MeshBasicMaterial({ map, transparent: true, depthWrite: false, side: THREE.DoubleSide });
    m.userData.bias = { value: 0 };
    m.onBeforeCompile = (sh) => {
      sh.uniforms.uBias = m.userData.bias;
      sh.fragmentShader = "uniform float uBias;\n" + sh.fragmentShader.replace("#include <map_fragment>",
        "vec4 sampledDiffuseColor = texture2D( map, vMapUv, uBias );\ndiffuseColor *= sampledDiffuseColor;");
    };
    m.customProgramCacheKey = () => "orbi-bias";
    return m;
  }

  let retrato = false;
  const planos = [];
  const N = 78, r = rng(7);
  for (let i = 0; i < N; i++) {
    const k = i % pecas.length, p = pecas[k];
    const ang = i * 2.39996 + (r() - 0.5) * 0.5;
    const raio = 3.5 + r() * 2.1;
    const z = 3.5 - (i / (N - 1)) * 99.5;
    const h = 1.05 + r() * 1.15;
    const mesh = new THREE.Mesh(geo, material(texturas[k]));
    mesh.scale.set(h * (p.w / p.h), h, 1);
    mesh.userData = { ang, raio, z, fogeCanto: i < 10 };
    scene.add(mesh); planos.push(mesh);
  }
  function posicionar() {
    for (const m of planos) {
      const { ang, raio, z, fogeCanto } = m.userData;
      let x = Math.cos(ang) * raio * (retrato ? 0.72 : 1.45);
      let y = Math.sin(ang) * raio * (retrato ? 1.55 : 1);
      if (fogeCanto && x < 0 && y < 0) x = -x;
      m.position.set(x, y, z);
      m.rotation.set(Math.sin(ang) * 0.28, -Math.cos(ang) * 0.32, 0);
    }
  }

  const PROF = [-14, -33, -52, -71], Z_FIM = -88;
  const destaques = casos.map((c, k) => {
    const mesh = new THREE.Mesh(geo, material(tex(c.img)));
    const ang = [0.6, 2.5, 4.0, 5.4][k];
    mesh.userData = { ang, z: PROF[k] };
    scene.add(mesh);
    return mesh;
  });
  const st = { z: 6, puxar: [0, 0, 0, 0], fade: [1, 1, 1, 1] };

  function poseDestaques() {
    destaques.forEach((m, k) => {
      const p = smooth(0, 1, st.puxar[k]);
      const { ang, z } = m.userData;
      const wx = Math.cos(ang) * 4.4 * (retrato ? 0.72 : 1.45), wy = Math.sin(ang) * 4.4 * (retrato ? 1.55 : 1);
      m.position.set(lerp(wx, 0, p), lerp(wy, 0, p), z);
      const s = lerp(0.36, 1, p);
      m.scale.set(6 * s, 4 * s, 1);
      m.rotation.set(lerp(Math.sin(ang) * 0.28, 0, p), lerp(-Math.cos(ang) * 0.32, 0, p), 0);
    });
  }

  const fov = () => (retrato ? 62 : 50);
  function cobrir() {
    const t = 2 * Math.tan(THREE.MathUtils.degToRad(fov() / 2)), a = camera.aspect;
    if (retrato) return 6 / (0.9 * t * a);
    return 0.94 * Math.min(4 / t, 6 / (t * a));
  }

  function medir() {
    const w = sec.clientWidth, h = sec.clientHeight;
    retrato = w / h < 0.8;
    camera.aspect = w / h; camera.fov = fov(); camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
    posicionar(); sujo = true;
  }
  medir();

  // mouse parallax
  const mouse = { x: 0, y: 0, cx: 0, cy: 0 };
  if (ponteiroFino && !reduz) addEventListener("pointermove", (e) => { mouse.x = (e.clientX / innerWidth) * 2 - 1; mouse.y = -((e.clientY / innerHeight) * 2 - 1); });

  let camZ = 6;
  function quadro() {
    const alvo = st.z;
    const k = reduz ? 1 : 0.14;
    const dz = alvo - camZ;
    camZ += dz * k;
    if (Math.abs(dz) < 1e-4) camZ = alvo;
    const forcaPux = 1 - Math.max(...st.puxar) * 0.92;
    const mx = mouse.x * 0.55 * forcaPux, my = mouse.y * 0.35 * forcaPux;
    const dmx = mx - mouse.cx, dmy = my - mouse.cy;
    mouse.cx += dmx * 0.06; mouse.cy += dmy * 0.06;
    const mexeu = Math.abs(dz) > 1e-4 || Math.abs(dmx) > 1e-4 || Math.abs(dmy) > 1e-4;
    if (!mexeu && !sujo) return;
    sujo = false;
    camera.position.set(mouse.cx, mouse.cy, camZ);
    camera.lookAt(mouse.cx * 0.3, mouse.cy * 0.3, camZ - 12);
    const pux = Math.max(...st.puxar);
    for (const m of planos) {
      const d = camZ - m.position.z;
      m.material.opacity = (d <= 0 ? 0 : smooth(0.4, 2.2, d)) * (1 - pux * 0.88);
      m.visible = m.material.opacity > 0.003;
      m.material.userData.bias.value = d < 6 ? (6 - Math.max(d, 0)) * 0.45 : d > 22 ? Math.min(3, (d - 22) * 0.12) : 0;
    }
    poseDestaques();
    destaques.forEach((m, k) => {
      const d = camZ - m.position.z;
      m.material.opacity = d <= 0 ? 0 : smooth(0.05, 0.6, d) * st.fade[k];
      m.visible = m.material.opacity > 0.003;
      m.material.userData.bias.value = st.puxar[k] > 0.5 ? 0 : d > 22 ? Math.min(3, (d - 22) * 0.12) : 0;
    });
    renderer.render(scene, camera);
  }
  gsap.ticker.add(quadro);
  addEventListener("resize", () => { medir(); });

  // case overlays
  const wrap = sec.querySelector(".casos");
  const caixas = casos.map((c, k) => {
    const el = document.createElement("div");
    el.className = "caso";
    el.innerHTML = `<p class="caso__num" data-in>0${k + 1} / 0${casos.length}</p>
      <div class="caso__base"><div><p class="caso__meta" data-in>${c.meta}</p>
      <h3 class="caso__nome" data-in>${c.nome}</h3><p class="caso__resumo" data-in>${c.resumo}</p></div>
      <a class="pilula pilula--tinta" data-in href="${c.url}">Abrir o modelo →</a></div>`;
    wrap.appendChild(el);
    return el;
  });

  // scrubbed timeline
  const hero = sec.querySelectorAll(".tunel__frase, .tunel__marca, .tunel__dica, .tunel__local");
  const tl = gsap.timeline({ defaults: { ease: "none" } });
  tl.to(hero, { y: -30, autoAlpha: 0, duration: 0.9 });
  let z = 6;
  PROF.forEach((pz, k) => {
    const ate = pz + 10;
    tl.to(st, { z: ate, duration: (z - ate) / 9 });
    tl.to(st.puxar, { [k]: 1, duration: 1.3, ease: "power2.inOut" }, ">");
    tl.to(st, { z: () => pz + cobrir(), duration: 1.3, ease: "power2.inOut" }, "<");
    tl.set(caixas[k], { autoAlpha: 1 });
    tl.fromTo(caixas[k].querySelectorAll("[data-in]"), { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, stagger: 0.06, ease: "power2.out" });
    tl.to({}, { duration: 1 });
    tl.to(caixas[k].querySelectorAll("[data-in]"), { opacity: 0, duration: 0.3 });
    tl.set(caixas[k], { autoAlpha: 0 });
    tl.to(st, { z: pz - 0.6, duration: 0.9, ease: "power2.in" });
    tl.to(st.fade, { [k]: 0, duration: 0.25 }, "-=0.25");
    tl.set(st.puxar, { [k]: 0 });
    z = pz - 0.6;
  });
  tl.to(st, { z: Z_FIM, duration: (z - Z_FIM) / 9 });
  tl.to(".tunel__fim", { autoAlpha: 1, duration: 0.6 }, "-=0.4");
  tl.to({}, { duration: 0.6 });

  const barra = sec.querySelector(".tunel__progresso i");
  ScrollTrigger.create({
    trigger: sec, start: "top top", end: () => "+=" + innerHeight * 11, pin: true, scrub: true,
    animation: tl, invalidateOnRefresh: true,
    onUpdate: (s) => { barra.style.transform = `scaleX(${s.progress})`; sujo = true; },
  });
}

/* ---------- 2 · manifesto with wired notes ---------- */
function estudio() {
  const sec = document.getElementById("estudio");
  const p = sec.querySelector(".manifesto");
  // split words (keep inline photos and anchors)
  const partir = (no) => {
    [...no.childNodes].forEach((n) => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach((t) => {
          if (!t) return;
          if (/^\s+$/.test(t)) frag.appendChild(document.createTextNode(t));
          else { const s = document.createElement("span"); s.className = "w"; s.textContent = t; frag.appendChild(s); }
        });
        n.replaceWith(frag);
      } else if (n.dataset && n.dataset.ancora !== undefined) {
        partir(n);
      } else if (n.classList && (n.classList.contains("foto-linha") || n.classList.contains("chip-wa"))) {
        n.classList.add("w");
      }
    });
  };
  partir(p);
  const palavras = p.querySelectorAll(".w");
  if (!reduz) {
    gsap.from(palavras, { yPercent: 45, opacity: 0, stagger: 0.022, duration: 0.6, ease: "power2.out",
      scrollTrigger: { trigger: p, start: "top 80%" } });
  }

  const svg = sec.querySelector(".estudio__fios");
  const notas = [...sec.querySelectorAll(".nota")];
  const ancoras = [...p.querySelectorAll("[data-ancora]")];
  let fios = [];
  function desenhar() {
    if (innerWidth <= 760) return;
    svg.innerHTML = "";
    const base = sec.getBoundingClientRect();
    const margem = sec.querySelector(".estudio__margem").getBoundingClientRect();
    const pr = p.getBoundingClientRect();
    const todas = [...palavras];
    fios = ancoras.map((a, i) => {
      const w0 = a.querySelector(".w");
      const topo = w0.offsetTop;
      const linha = todas.filter((w) => Math.abs(w.offsetTop - topo) < 6);
      const fimX = pr.left - base.left + Math.max(...linha.map((w) => w.offsetLeft + w.offsetWidth)) + 10;
      const y = pr.top - base.top + topo + w0.offsetHeight * 0.55;
      const nota = notas[i];
      nota.style.top = (y - margem.top + base.top - 10) + "px";
      const nx = margem.left - base.left + parseFloat(getComputedStyle(nota).left) + 3;
      const ny = y + 2;
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      const mx = (fimX + nx) / 2;
      path.setAttribute("d", `M${fimX},${y} C${mx},${y + 40} ${mx},${ny + 30} ${nx},${ny}`);
      svg.appendChild(path);
      const L = path.getTotalLength();
      path.style.strokeDasharray = L; path.style.strokeDashoffset = reduz ? 0 : L;
      return { path, L, nota };
    });
    if (reduz) notas.forEach((n) => (n.style.opacity = 1));
  }
  desenhar();
  ScrollTrigger.addEventListener("refresh", desenhar);
  document.fonts && document.fonts.ready.then(() => { desenhar(); });
  if (!reduz) {
    ScrollTrigger.create({ trigger: sec, start: "top 60%", end: "bottom 70%", scrub: true, onUpdate: (s) => {
      fios.forEach((f, i) => {
        const t = Math.min(1, Math.max(0, s.progress * 3 - i * 0.6));
        f.path.style.strokeDashoffset = f.L * (1 - t);
        f.nota.style.opacity = t > 0.95 ? 1 : 0;
        f.nota.style.transition = "opacity .3s";
      });
    }});
  }
}

/* ---------- 3 · film strip ---------- */
function metodo() {
  const sec = document.getElementById("como");
  const tira = sec.querySelector(".tira");
  const quadros = [...sec.querySelectorAll(".quadro")];
  const etapas = [...sec.querySelectorAll(".regua__etapas li")];
  const fio = sec.querySelector(".regua__fio i");
  const ativar = (i) => { quadros.forEach((q, j) => q.classList.toggle("ativo", j === i)); etapas.forEach((e, j) => e.classList.toggle("ativo", j === i)); };
  ativar(0);
  const dist = () => Math.max(0, tira.scrollWidth - innerWidth);
  gsap.to(tira, { x: () => -dist(), ease: "none",
    scrollTrigger: { trigger: sec, start: "top top", end: () => "+=" + innerHeight * 2.6, pin: true, scrub: true, invalidateOnRefresh: true,
      onUpdate: (s) => { fio.style.transform = `scaleX(${s.progress})`; ativar(Math.min(3, Math.floor(s.progress * 4))); } } });
}

/* ---------- 4 · index ---------- */
function indice() {
  const sec = document.getElementById("modelos");
  const ul = sec.querySelector(".linhas");
  ul.innerHTML = casos.map((c, i) => `<li class="linha" data-f="${c.f}"><a href="${c.url}" data-img="${c.mini}">
    <span class="l-num">0${i + 1}</span><span class="l-nome">${c.nome}</span><span class="l-nicho">${c.nicho} · ${c.resumo.split(".")[0]}.</span>
    <span class="l-abrir">Abrir →</span><img class="l-mini" src="${c.mini}" alt="" loading="lazy" width="64" height="64"></a></li>`).join("");
  const conta = sec.querySelector(".indice__conta span");
  sec.querySelectorAll(".filtros button").forEach((b) => b.addEventListener("click", () => {
    sec.querySelectorAll(".filtros button").forEach((x) => { x.setAttribute("aria-pressed", x === b); x.classList.toggle("pilula--tinta", x === b); });
    let n = 0;
    ul.querySelectorAll(".linha").forEach((li) => { const ok = b.dataset.f === "todos" || li.dataset.f === b.dataset.f; li.hidden = !ok; n += ok; });
    conta.textContent = n;
    ScrollTrigger.refresh();
  }));

  if (!ponteiroFino || reduz) return;
  const foto = sec.querySelector(".seguidor");
  const qx = gsap.quickTo(foto, "x", { duration: 0.55, ease: "power3" });
  const qy = gsap.quickTo(foto, "y", { duration: 0.55, ease: "power3" });
  let dentro = false;
  ul.addEventListener("pointermove", (e) => { qx(e.clientX + 140); qy(e.clientY - foto.offsetHeight / 2); });
  ul.querySelectorAll("a").forEach((a) => {
    a.addEventListener("pointerenter", (e) => {
      foto.src = a.dataset.img;
      if (!dentro) { gsap.set(foto, { x: e.clientX + 140, y: e.clientY - foto.offsetHeight / 2 }); }
      dentro = true;
      gsap.to(foto, { opacity: 1, scale: 1, rotation: (Math.random() - 0.5) * 10, duration: 0.4, ease: "power3.out" });
    });
  });
  ul.addEventListener("pointerleave", () => { dentro = false; gsap.to(foto, { opacity: 0, scale: 0.6, duration: 0.35 }); });
}

/* ---------- 5 · price sky ---------- */
function ceu() {
  const sec = document.getElementById("preco");
  const ceu = sec.querySelector(".ceu");
  const fotos = [
    ["t01", 4, 8, 15, 1], ["t09", 78, 6, 9, 0.6], ["t05", 86, 40, 13, 1], ["t17", 2, 52, 9, 0.5], ["t12", 12, 80, 12, 0.8],
    ["t22", 70, 78, 10, 0.7], ["t03", 30, 4, 7, 0.3], ["t26", 58, 2, 6, 0.25], ["t14", 40, 88, 7, 0.35], ["t19", 92, 70, 6, 0.3],
    ["t07", 20, 30, 6, 0.3], ["t24", 66, 46, 7, 0.4], ["t11", 46, 70, 5, 0.2], ["t20", 50, 16, 5, 0.2],
  ];
  fotos.forEach(([id, x, y, w, prof]) => {
    const img = new Image();
    img.src = `img/tunel/${id}.webp`; img.alt = ""; img.loading = "lazy";
    Object.assign(img.style, { left: x + "%", top: y + "%", width: w + "vw", opacity: 0.45 + prof * 0.55, filter: `blur(${(1 - prof) * 6}px)` });
    ceu.appendChild(img);
    if (!reduz) gsap.fromTo(img, { y: 160 * prof }, { y: -160 * prof, ease: "none", scrollTrigger: { trigger: sec, start: "top bottom", end: "bottom top", scrub: true } });
  });
}

/* ---------- footer wordmark ---------- */
function rodape() {
  if (reduz) return;
  gsap.from(".rodape__marca", { yPercent: 40, ease: "none", scrollTrigger: { trigger: ".rodape", start: "top bottom", end: "bottom bottom", scrub: true } });
}

/* ---------- init: pins before Lenis ---------- */
(async () => {
  try { await tunel(); } catch (e) { console.error("tunel", e); }
  estudio();
  metodo();
  indice();
  ceu();
  rodape();
  nav();
  ligarLenis();
  if (lenis) lenis.resize();
  document.fonts && document.fonts.ready.then(() => ScrollTrigger.refresh());
  addEventListener("load", () => ScrollTrigger.refresh());
})();
