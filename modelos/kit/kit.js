// Orbi model kit: 3D tunnel of the business's own photos, highlights that open full screen,
// wired manifesto, process strip, menu index (order bag or booking), photo sky, giant footer name.
// Each page carries its data in <script id="site" type="application/json">.
import * as THREE from "../../vendor/three.module.min.js";

const S = JSON.parse(document.getElementById("site").textContent);
const { gsap, ScrollTrigger, Lenis } = window;
gsap.registerPlugin(ScrollTrigger);
const reduz = matchMedia("(prefers-reduced-motion: reduce)").matches;
const fino = matchMedia("(pointer: fine)").matches;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const brl = (v) => "R$ " + v.toFixed(2).replace(".", ",");
const css = getComputedStyle(document.documentElement);
const BASE = new THREE.Color(css.getPropertyValue("--base").trim());
const ORBI_WA = "https://wa.me/5511927013668?text=" + encodeURIComponent("Oi! Vi o modelo " + S.nome + " e quero um site assim pra minha empresa.");

/* ---------- fit giant names to a width ---------- */
function encaixar() {
  $$("[data-encaixe]").forEach((el) => {
    el.style.fontSize = "100px";
    const alvo = el.dataset.encaixe === "cheio" ? el.parentElement.clientWidth : innerWidth * (innerWidth <= 760 ? 0.92 : 0.5);
    el.style.fontSize = (100 * alvo) / el.scrollWidth + "px";
  });
  const n = $(".tunel__nome");
  if (n) document.documentElement.style.setProperty("--nome-h", n.offsetHeight * 0.85 + "px");
}

/* ---------- nav ---------- */
function nav() {
  const el = $(".nav"); let ult = 0;
  const flut = $(".flutua");
  ScrollTrigger.create({ start: 0, end: "max", onUpdate: (s) => {
    const y = s.scroll(), desce = y > ult;
    el.classList.toggle("some", desce && y > innerHeight * 0.5);
    el.classList.toggle("veu", !desce && y > innerHeight * 0.5);
    if (flut) flut.classList.toggle("on", y > innerHeight * 12 && !$(".sacola.on"));
    ult = y;
  }});
}

/* ---------- 1 · tunnel ---------- */
const rng = (s) => () => { s |= 0; s = (s + 0x6D2B79F5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const smooth = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const lerp = (a, b, t) => a + (b - a) * t;

function tunel() {
  const sec = $(".tunel"), canvas = $("canvas", sec);
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setClearColor(BASE, 1);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(BASE, 9, 44);
  const camera = new THREE.PerspectiveCamera(50, 1, 0.05, 120);
  let sujo = true, retrato = false;
  const loader = new THREE.TextureLoader();
  const tex = (src, cb) => { const t = loader.load(src, (x) => { cb && cb(x); sujo = true; }); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t; };
  const geo = new THREE.PlaneGeometry(1, 1);
  const mat = (map) => {
    const m = new THREE.MeshBasicMaterial({ map, transparent: true, depthWrite: false, side: THREE.DoubleSide });
    m.userData.bias = { value: 0 };
    m.onBeforeCompile = (sh) => {
      sh.uniforms.uBias = m.userData.bias;
      sh.fragmentShader = "uniform float uBias;\n" + sh.fragmentShader.replace("#include <map_fragment>",
        "vec4 sampledDiffuseColor = texture2D( map, vMapUv, uBias );\ndiffuseColor *= sampledDiffuseColor;");
    };
    m.customProgramCacheKey = () => "kit-bias";
    return m;
  };

  const texs = S.pecas.map((p) => tex(p.src));
  const planos = [], N = 72, r = rng(11);
  for (let i = 0; i < N; i++) {
    const k = i % S.pecas.length, p = S.pecas[k];
    const m = new THREE.Mesh(geo, mat(texs[k]));
    const h = 1.1 + r() * 1.2;
    m.scale.set(h * (p.w / p.h), h, 1);
    m.userData = { ang: i * 2.39996 + (r() - 0.5) * 0.5, raio: 3.5 + r() * 2.1, z: 3.5 - (i / (N - 1)) * 87, canto: i < 10 };
    scene.add(m); planos.push(m);
  }
  const posicionar = () => planos.forEach((m) => {
    const { ang, raio, z, canto } = m.userData;
    let x = Math.cos(ang) * raio * (retrato ? 0.72 : 1.45), y = Math.sin(ang) * raio * (retrato ? 1.55 : 1);
    if (canto && x < 0 && y < 0) x = -x;
    m.position.set(x, y, z); m.rotation.set(Math.sin(ang) * 0.28, -Math.cos(ang) * 0.32, 0);
  });

  const PROF = [-14, -36, -58].slice(0, S.destaques.length), Z_FIM = -78;
  const destaques = S.destaques.map((d, k) => {
    const t = tex(d.img, (x) => {
      const a = x.image.width / x.image.height;
      if (d.fit === "contain") {
        const s = 0.86, sx = a > 1.5 ? 1 / s : (1.5 / a) / s, sy = a > 1.5 ? (a / 1.5) / s : 1 / s;
        x.wrapS = x.wrapT = THREE.ClampToEdgeWrapping;
        x.repeat.set(sx, sy); x.offset.set((1 - sx) / 2, (1 - sy) / 2);
      } else if (a > 1.5) { x.repeat.set(1.5 / a, 1); x.offset.set((1 - 1.5 / a) / 2, 0); }
      else { x.repeat.set(1, a / 1.5); x.offset.set(0, (1 - a / 1.5) / 2); }
      x.needsUpdate = true;
    });
    const m = new THREE.Mesh(geo, mat(t));
    m.userData = { ang: [0.6, 2.5, 4.1][k], z: PROF[k] };
    scene.add(m); return m;
  });
  const st = { z: 6, puxar: PROF.map(() => 0), fade: PROF.map(() => 1) };
  const fov = () => (retrato ? 62 : 50);
  const cobrir = () => {
    const t = 2 * Math.tan(THREE.MathUtils.degToRad(fov() / 2)), a = camera.aspect;
    return retrato ? 6 / (0.9 * t * a) : 0.94 * Math.min(4 / t, 6 / (t * a));
  };
  const medir = () => {
    const w = sec.clientWidth, h = sec.clientHeight;
    retrato = w / h < 0.8; camera.aspect = w / h; camera.fov = fov(); camera.updateProjectionMatrix();
    renderer.setSize(w, h, false); posicionar(); sujo = true;
  };
  medir(); addEventListener("resize", medir);

  const mouse = { x: 0, y: 0, cx: 0, cy: 0 };
  if (fino && !reduz) addEventListener("pointermove", (e) => { mouse.x = (e.clientX / innerWidth) * 2 - 1; mouse.y = -((e.clientY / innerHeight) * 2 - 1); });
  let camZ = 6;
  gsap.ticker.add(() => {
    const dz = st.z - camZ; camZ += dz * (reduz ? 1 : 0.14); if (Math.abs(dz) < 1e-4) camZ = st.z;
    const pux = Math.max(...st.puxar), f = 1 - pux * 0.92;
    const dmx = mouse.x * 0.55 * f - mouse.cx, dmy = mouse.y * 0.35 * f - mouse.cy;
    mouse.cx += dmx * 0.06; mouse.cy += dmy * 0.06;
    if (!sujo && Math.abs(dz) < 1e-4 && Math.abs(dmx) < 1e-4 && Math.abs(dmy) < 1e-4) return;
    sujo = false;
    camera.position.set(mouse.cx, mouse.cy, camZ); camera.lookAt(mouse.cx * 0.3, mouse.cy * 0.3, camZ - 12);
    for (const m of planos) {
      const d = camZ - m.position.z;
      m.material.opacity = (d <= 0 ? 0 : smooth(0.4, 2.2, d)) * (1 - pux * 0.9);
      m.visible = m.material.opacity > 0.003;
      m.material.userData.bias.value = d < 6 ? (6 - Math.max(d, 0)) * 0.45 : d > 22 ? Math.min(3, (d - 22) * 0.12) : 0;
    }
    destaques.forEach((m, k) => {
      const p = smooth(0, 1, st.puxar[k]), { ang, z } = m.userData;
      const wx = Math.cos(ang) * 4.4 * (retrato ? 0.72 : 1.45), wy = Math.sin(ang) * 4.4 * (retrato ? 1.55 : 1);
      m.position.set(lerp(wx, 0, p), lerp(wy, 0, p), z);
      const s = lerp(0.36, 1, p); m.scale.set(6 * s, 4 * s, 1);
      m.rotation.set(lerp(Math.sin(ang) * 0.28, 0, p), lerp(-Math.cos(ang) * 0.32, 0, p), 0);
      const d = camZ - z;
      m.material.opacity = d <= 0 ? 0 : smooth(0.05, 0.6, d) * st.fade[k];
      m.visible = m.material.opacity > 0.003;
      m.material.userData.bias.value = p > 0.5 ? 0 : d > 22 ? Math.min(3, (d - 22) * 0.12) : 0;
    });
    renderer.render(scene, camera);
  });

  const caixas = $$(".caso", sec);
  const tl = gsap.timeline({ defaults: { ease: "none" } });
  tl.to($$(".tunel__frase, .tunel__nome, .tunel__dica, .tunel__local", sec), { y: -30, autoAlpha: 0, duration: 0.9 });
  let z = 6;
  PROF.forEach((pz, k) => {
    tl.to(st, { z: pz + 10, duration: (z - pz - 10) / 9 });
    tl.to(st.puxar, { [k]: 1, duration: 1.3, ease: "power2.inOut" });
    tl.to(st, { z: () => pz + cobrir(), duration: 1.3, ease: "power2.inOut" }, "<");
    tl.set(caixas[k], { autoAlpha: 1 });
    tl.fromTo($$("[data-in]", caixas[k]), { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, stagger: 0.06, ease: "power2.out" });
    tl.to({}, { duration: 1 });
    tl.to($$("[data-in]", caixas[k]), { opacity: 0, duration: 0.3 });
    tl.set(caixas[k], { autoAlpha: 0 });
    tl.to(st, { z: pz - 0.6, duration: 0.9, ease: "power2.in" });
    tl.to(st.fade, { [k]: 0, duration: 0.25 }, "-=0.25");
    tl.set(st.puxar, { [k]: 0 });
    z = pz - 0.6;
  });
  tl.to(st, { z: Z_FIM, duration: (z - Z_FIM) / 9 });
  tl.to($(".tunel__fim", sec), { autoAlpha: 1, duration: 0.6 }, "-=0.4");
  tl.to({}, { duration: 0.6 });
  const barra = $(".tunel__progresso i", sec);
  ScrollTrigger.create({ trigger: sec, start: "top top", end: () => "+=" + innerHeight * 9, pin: true, scrub: true, animation: tl,
    invalidateOnRefresh: true, onUpdate: (s) => { barra.style.transform = `scaleX(${s.progress})`; sujo = true; } });
}

/* ---------- 2 · manifesto ---------- */
function manifesto() {
  const sec = $(".manif"), p = $(".manifesto", sec);
  const partir = (no) => [...no.childNodes].forEach((n) => {
    if (n.nodeType === 3) {
      const f = document.createDocumentFragment();
      n.textContent.split(/(\s+)/).forEach((t) => { if (!t) return; if (/^\s+$/.test(t)) f.appendChild(document.createTextNode(t)); else { const s = document.createElement("span"); s.className = "w"; s.textContent = t; f.appendChild(s); } });
      n.replaceWith(f);
    } else if (n.dataset && n.dataset.ancora !== undefined) partir(n);
    else if (n.classList) n.classList.add("w");
  });
  partir(p);
  const pal = $$(".w", p);
  if (!reduz) gsap.from(pal, { yPercent: 45, opacity: 0, stagger: 0.022, duration: 0.6, ease: "power2.out", scrollTrigger: { trigger: p, start: "top 80%" } });
  const svg = $(".manif__fios", sec), notas = $$(".nota", sec), anc = $$("[data-ancora]", p);
  let fios = [];
  const desenhar = () => {
    if (innerWidth <= 760) return;
    svg.innerHTML = "";
    const b = sec.getBoundingClientRect(), mg = $(".manif__margem", sec).getBoundingClientRect(), pr = p.getBoundingClientRect();
    fios = anc.map((a, i) => {
      const w0 = $(".w", a), topo = w0.offsetTop;
      const linha = pal.filter((w) => Math.abs(w.offsetTop - topo) < 6);
      const fx = pr.left - b.left + Math.max(...linha.map((w) => w.offsetLeft + w.offsetWidth)) + 10;
      const y = pr.top - b.top + topo + w0.offsetHeight * 0.55;
      const nota = notas[i]; nota.style.top = y - mg.top + b.top - 10 + "px";
      const nx = mg.left - b.left + parseFloat(getComputedStyle(nota).left) + 4, mx = (fx + nx) / 2;
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", `M${fx},${y} C${mx},${y + 40} ${mx},${y + 32} ${nx},${y + 2}`);
      svg.appendChild(path);
      const L = path.getTotalLength(); path.style.strokeDasharray = L; path.style.strokeDashoffset = reduz ? 0 : L;
      if (reduz) nota.style.opacity = 1;
      return { path, L, nota };
    });
  };
  desenhar();
  ScrollTrigger.addEventListener("refresh", desenhar);
  if (!reduz) ScrollTrigger.create({ trigger: sec, start: "top 60%", end: "bottom 75%", scrub: true, onUpdate: (s) => fios.forEach((f, i) => {
    const t = Math.min(1, Math.max(0, s.progress * 3 - i * 0.6));
    f.path.style.strokeDashoffset = f.L * (1 - t); f.nota.style.opacity = t > 0.95 ? 1 : 0;
  }) });
}

/* ---------- 3 · process strip ---------- */
function metodo() {
  const sec = $(".metodo"), tira = $(".tira", sec), qs = $$(".quadro", sec), et = $$(".regua__etapas li", sec), fio = $(".regua__fio i", sec);
  const at = (i) => { qs.forEach((q, j) => q.classList.toggle("ativo", j === i)); et.forEach((e, j) => e.classList.toggle("ativo", j === i)); };
  at(0);
  gsap.to(tira, { x: () => -Math.max(0, tira.scrollWidth - innerWidth), ease: "none", scrollTrigger: { trigger: sec, start: "top top",
    end: () => "+=" + innerHeight * 2.4, pin: true, scrub: true, invalidateOnRefresh: true,
    onUpdate: (s) => { fio.style.transform = `scaleX(${s.progress})`; at(Math.min(3, Math.floor(s.progress * 4))); } } });
}

/* ---------- WhatsApp preview modal (it's a model: the message goes nowhere real) ---------- */
function mostrarMensagem(txt) {
  const d = $("#modelo");
  $(".bolha-wa", d).textContent = txt;
  $("[data-orbi]", d).href = ORBI_WA;
  $("#sacola-painel")?.close();
  d.showModal();
}

/* ---------- 4 · menu: order bag ---------- */
const itens = Object.fromEntries(S.menu.map((m) => [m.id, m]));
const sacola = {};
let porte = S.portes ? S.portes[0].k : null;
const precoDe = (m) => (m.precos ? m.precos[porte] : m.preco);

function pedido() {
  const bar = $(".sacola"), painel = $("#sacola-painel");
  const total = () => Object.entries(sacola).reduce((a, [id, q]) => a + itens[id].preco * q, 0);
  let opc = S.opcoes[0];
  if (new URLSearchParams(location.search).get("mesa")) opc = S.opcoes.find((o) => o.k === "Na mesa") || opc;
  const pintar = () => {
    $$("[data-ctl]").forEach((el) => {
      const q = sacola[el.dataset.ctl] || 0;
      el.innerHTML = q ? `<span class="qtd"><button data-menos="${el.dataset.ctl}" aria-label="Tirar um">−</button><span>${q}</span><button data-mais="${el.dataset.ctl}" aria-label="Mais um">+</button></span>`
        : `<button class="mais" data-mais="${el.dataset.ctl}">Adicionar</button>`;
    });
    const n = Object.values(sacola).reduce((a, b) => a + b, 0);
    bar.classList.toggle("on", n > 0);
    $(".flutua")?.classList.toggle("on", false);
    $("[data-n]", bar).textContent = `${n} ${n === 1 ? "item" : "itens"} · ${brl(total())}`;
    $(".itens", painel).innerHTML = Object.entries(sacola).map(([id, q]) => `<li><span>${q}× ${itens[id].nome}</span><b>${brl(itens[id].preco * q)}</b></li>`).join("") || "<li>Nada ainda.</li>";
    $$("[data-opc]", painel).forEach((b) => b.setAttribute("aria-pressed", b.dataset.opc === opc.k));
    const campo = $("[data-campo]", painel);
    campo.hidden = !opc.campo; $("span", campo).textContent = opc.campo || "";
    $("[data-taxa]", painel).textContent = opc.taxa ? `${opc.k}: ${brl(opc.taxa)}` : "";
    $("[data-total]", painel).textContent = brl(total() + (opc.taxa || 0));
  };
  window.addAoPedido = (id) => { sacola[id] = (sacola[id] || 0) + 1; pintar(); painel.showModal(); };
  document.addEventListener("click", (e) => {
    const a = e.target.closest("[data-mais]"), b = e.target.closest("[data-menos]");
    if (a) { sacola[a.dataset.mais] = (sacola[a.dataset.mais] || 0) + 1; pintar(); }
    if (b) { const id = b.dataset.menos; sacola[id]--; if (!sacola[id]) delete sacola[id]; pintar(); }
    const o = e.target.closest("[data-opc]"); if (o) { opc = S.opcoes.find((x) => x.k === o.dataset.opc); pintar(); }
  });
  $("button", bar).addEventListener("click", () => painel.showModal());
  $("[data-enviar]", painel).addEventListener("click", () => {
    if (!Object.keys(sacola).length) return;
    const nome = $("#f-nome").value.trim(), extra = $("#f-campo").value.trim(), obs = $("#f-obs").value.trim();
    const linhas = Object.entries(sacola).map(([id, q]) => `${q}x ${itens[id].nome} · ${brl(itens[id].preco * q)}`);
    mostrarMensagem(`Olá, ${S.nome}! Quero fazer um pedido:\n${linhas.join("\n")}\n\n${opc.k}${extra ? ": " + extra : ""}${opc.taxa ? " (" + brl(opc.taxa) + ")" : ""}\nTotal: ${brl(total() + (opc.taxa || 0))}${nome ? "\nNome: " + nome : ""}${obs ? "\nObs.: " + obs : ""}`);
  });
  pintar();
}

/* ---------- 4b · booking ---------- */
function agenda() {
  const sec = $(".agenda");
  const esc = { serv: null, dia: null, hora: null, extra: false };
  const dias = [];
  for (let d = new Date(), i = 0; dias.length < 6 && i < 14; i++) {
    const x = new Date(d.getFullYear(), d.getMonth(), d.getDate() + i);
    if (S.dias.includes(x.getDay())) dias.push(x);
  }
  const nomeDia = (x, i) => (i === 0 && x.toDateString() === new Date().toDateString() ? "Hoje" : x.toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit" }).replace(".", ""));
  $("[data-dias]", sec).innerHTML = dias.map((x, i) => `<button class="chip" data-dia="${i}" aria-pressed="false">${nomeDia(x, i)}</button>`).join("");
  $("[data-horas]", sec).innerHTML = S.horas.map((h) => `<button class="chip" data-hora="${h}" aria-pressed="false">${h}</button>`).join("");
  const total = () => (esc.serv ? precoDe(itens[esc.serv]) : 0) + (esc.extra && S.extra ? S.extra.preco : 0);
  const pintar = () => {
    $$("[data-serv]", sec).forEach((b) => b.setAttribute("aria-pressed", b.dataset.serv === esc.serv));
    $$("[data-dia]", sec).forEach((b) => b.setAttribute("aria-pressed", +b.dataset.dia === esc.dia));
    $$("[data-hora]", sec).forEach((b) => b.setAttribute("aria-pressed", b.dataset.hora === esc.hora));
    $("[data-r-serv]", sec).textContent = esc.serv ? itens[esc.serv].nome : "—";
    $("[data-r-dia]", sec).textContent = esc.dia !== null ? nomeDia(dias[esc.dia], esc.dia) : "—";
    $("[data-r-hora]", sec).textContent = esc.hora || "—";
    const rp = $("[data-r-porte]", sec); if (rp) rp.textContent = S.portes.find((p) => p.k === porte).label;
    const re = $("[data-r-extra]", sec); if (re) re.textContent = esc.extra ? "Sim" : "Não";
    $("[data-r-total]", sec).textContent = brl(total());
  };
  window.escolherServico = (id) => { esc.serv = id; pintar(); };
  sec.addEventListener("click", (e) => {
    const s = e.target.closest("[data-serv]"), d = e.target.closest("[data-dia]"), h = e.target.closest("[data-hora]");
    if (s) esc.serv = s.dataset.serv; if (d) esc.dia = +d.dataset.dia; if (h) esc.hora = h.dataset.hora;
    pintar();
  });
  const ex = $("#f-extra", sec); if (ex) ex.addEventListener("change", () => { esc.extra = ex.checked; pintar(); });
  document.addEventListener("porte", pintar);
  $("[data-confirmar]", sec).addEventListener("click", () => {
    if (!esc.serv || esc.dia === null || !esc.hora) { $(".resumo small", sec).textContent = "Escolha o serviço, o dia e o horário."; return; }
    const d = dias[esc.dia].toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "2-digit" });
    mostrarMensagem(`Olá, ${S.nome}! Quero agendar:\n${itens[esc.serv].nome}${porte ? " · porte " + porte : ""}\n${d}, às ${esc.hora}${esc.extra && S.extra ? "\n" + S.extra.label + ": sim" : ""}\nTotal: ${brl(total())}`);
  });
  pintar();
}

/* ---------- menu index: filters, porte prices, follower ---------- */
function indice() {
  const sec = $(".menu");
  $$("[data-filtro]", sec).forEach((b) => b.addEventListener("click", () => {
    $$("[data-filtro]", sec).forEach((x) => x.setAttribute("aria-pressed", x === b));
    $$(".linha", sec).forEach((li) => { li.hidden = !(b.dataset.filtro === "todos" || li.dataset.cat === b.dataset.filtro); });
    ScrollTrigger.refresh();
  }));
  $$("[data-porte]", sec).forEach((b) => b.addEventListener("click", () => {
    porte = b.dataset.porte;
    $$("[data-porte]", sec).forEach((x) => x.setAttribute("aria-pressed", x === b));
    $$("[data-preco]", sec).forEach((el) => { const m = itens[el.dataset.preco]; el.textContent = brl(precoDe(m)); });
    document.dispatchEvent(new Event("porte"));
  }));
  $$("[data-agendar]").forEach((b) => b.addEventListener("click", () => { window.escolherServico(b.dataset.agendar); }));
  $$("[data-pedir]").forEach((b) => b.addEventListener("click", (e) => { e.preventDefault(); window.addAoPedido(b.dataset.pedir); }));
  if (!fino || reduz) return;
  const foto = $(".seguidor", sec);
  const qx = gsap.quickTo(foto, "x", { duration: 0.55, ease: "power3" }), qy = gsap.quickTo(foto, "y", { duration: 0.55, ease: "power3" });
  let dentro = false;
  const ul = $(".linhas", sec);
  ul.addEventListener("pointermove", (e) => { qx(e.clientX + 120); qy(e.clientY - foto.offsetHeight / 2); });
  $$(".linha", ul).forEach((li) => li.addEventListener("pointerenter", (e) => {
    if (!li.dataset.img) { gsap.to(foto, { opacity: 0, duration: 0.2 }); return; }
    foto.src = li.dataset.img;
    if (!dentro) gsap.set(foto, { x: e.clientX + 120, y: e.clientY - foto.offsetHeight / 2 });
    dentro = true;
    gsap.to(foto, { opacity: 1, scale: 1, rotation: (Math.random() - 0.5) * 10, duration: 0.4, ease: "power3.out" });
  }));
  ul.addEventListener("pointerleave", () => { dentro = false; gsap.to(foto, { opacity: 0, scale: 0.6, duration: 0.35 }); });
}

/* ---------- 5 · photo sky + footer ---------- */
function ceu() {
  const sec = $(".ceu-sec"), box = $(".ceu", sec);
  const pos = [[4, 8, 15, 1], [78, 6, 10, 0.6], [86, 42, 13, 1], [2, 52, 10, 0.5], [12, 80, 12, 0.8], [70, 78, 11, 0.7], [30, 4, 7, 0.3], [58, 2, 6, 0.25], [40, 88, 7, 0.35], [92, 70, 6, 0.3], [20, 30, 6, 0.3], [66, 46, 7, 0.4]];
  pos.forEach(([x, y, w, p], i) => {
    const src = S.pecas[(i * 5) % S.pecas.length].src;
    const img = new Image(); img.src = src; img.alt = ""; img.loading = "lazy";
    Object.assign(img.style, { left: x + "%", top: y + "%", width: w + "vw", opacity: 0.45 + p * 0.55, filter: `blur(${(1 - p) * 6}px)` });
    box.appendChild(img);
    if (!reduz) gsap.fromTo(img, { y: 160 * p }, { y: -160 * p, ease: "none", scrollTrigger: { trigger: sec, start: "top bottom", end: "bottom top", scrub: true } });
  });
  if (!reduz) gsap.from(".rodape__nome", { yPercent: 40, ease: "none", scrollTrigger: { trigger: ".rodape", start: "top bottom", end: "bottom bottom", scrub: true } });
}

/* ---------- init (pins before Lenis) ---------- */
encaixar();
try { tunel(); } catch (e) { console.error("tunel", e); }
manifesto(); metodo(); indice();
if (S.modo === "pedido") pedido(); else agenda();
ceu(); nav();
$$("dialog [data-fechar]").forEach((b) => b.addEventListener("click", () => b.closest("dialog").close()));
let lenis = null;
if (!reduz && Lenis) {
  lenis = new Lenis({ anchors: true, lerp: 0.1 });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0);
  $$("dialog").forEach((d) => { new MutationObserver(() => (d.open ? lenis.stop() : lenis.start())).observe(d, { attributes: true, attributeFilter: ["open"] }); });
}
const refazer = () => { encaixar(); ScrollTrigger.refresh(); };
document.fonts && document.fonts.ready.then(refazer);
addEventListener("load", refazer);
addEventListener("resize", () => encaixar());
