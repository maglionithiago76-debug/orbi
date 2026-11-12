// Orbi models: shared behaviour (order bag, booking, filters, porte prices, WhatsApp preview, smooth scroll).
// The page's own scenes live in <slug>/cena.js as window.cena(), run here before Lenis (pins first).
const S = JSON.parse(document.getElementById("site").textContent);
const { gsap, ScrollTrigger, Lenis } = window;
gsap.registerPlugin(ScrollTrigger);
const reduz = matchMedia("(prefers-reduced-motion: reduce)").matches;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const brl = (v) => "R$ " + v.toFixed(2).replace(".", ",");
const ORBI_WA = "https://wa.me/5511927013668?text=" + encodeURIComponent("Oi! Vi o modelo " + S.nome + " e quero um site assim pra minha empresa.");
const itens = Object.fromEntries(S.menu.map((m) => [m.id, m]));
let porte = S.portes ? S.portes[0].k : null;
const precoDe = (m) => (m.precos ? m.precos[porte] : m.preco || 0);

function mostrarMensagem(txt) {
  const d = $("#modelo");
  $(".bolha-wa", d).textContent = txt;
  $("[data-orbi]", d).href = ORBI_WA;
  $("#sacola-painel")?.close();
  d.showModal();
}

function pedido() {
  const bar = $(".sacola"), painel = $("#sacola-painel"), sacola = {};
  const total = () => Object.entries(sacola).reduce((a, [id, q]) => a + itens[id].preco * q, 0);
  let opc = S.opcoes[0];
  if (new URLSearchParams(location.search).get("mesa")) opc = S.opcoes.find((o) => o.k === "Na mesa") || opc;
  const pintar = () => {
    $$("[data-ctl]").forEach((el) => {
      const id = el.dataset.ctl, q = sacola[id] || 0;
      el.innerHTML = q ? `<span class="qtd"><button data-menos="${id}" aria-label="Tirar um">−</button><span>${q}</span><button data-mais="${id}" aria-label="Mais um">+</button></span>`
        : `<button class="mais" data-mais="${id}">Adicionar</button>`;
    });
    const n = Object.values(sacola).reduce((a, b) => a + b, 0);
    bar.classList.toggle("on", n > 0);
    $("[data-n]", bar).textContent = `${n} ${n === 1 ? "item" : "itens"} · ${brl(total())}`;
    $(".itens", painel).innerHTML = Object.entries(sacola).map(([id, q]) => `<li><span>${q}× ${itens[id].nome}</span><b>${brl(itens[id].preco * q)}</b></li>`).join("") || "<li>Nada ainda.</li>";
    $$("[data-opc]", painel).forEach((b) => b.setAttribute("aria-pressed", b.dataset.opc === opc.k));
    const campo = $("[data-campo]", painel);
    campo.hidden = !opc.campo; $("span", campo).textContent = opc.campo || "";
    $("[data-taxa]", painel).textContent = opc.taxa ? `${opc.k}: ${brl(opc.taxa)}` : "";
    $("[data-total]", painel).textContent = brl(total() + (opc.taxa || 0));
  };
  document.addEventListener("click", (e) => {
    const a = e.target.closest("[data-mais]"), b = e.target.closest("[data-menos]"), p = e.target.closest("[data-pedir]");
    if (a) { sacola[a.dataset.mais] = (sacola[a.dataset.mais] || 0) + 1; pintar(); }
    if (b) { const id = b.dataset.menos; sacola[id]--; if (!sacola[id]) delete sacola[id]; pintar(); }
    if (p) { e.preventDefault(); sacola[p.dataset.pedir] = (sacola[p.dataset.pedir] || 0) + 1; pintar(); painel.showModal(); }
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

function agenda() {
  const sec = $(".agenda"), esc = { serv: null, dia: null, hora: null, extra: false }, dias = [];
  for (let d = new Date(), i = 0; dias.length < 6 && i < 14; i++) {
    const x = new Date(d.getFullYear(), d.getMonth(), d.getDate() + i);
    const ultima = +S.horas[S.horas.length - 1].split(":")[0];
    if (i === 0 && new Date().getHours() >= ultima) continue;
    if (S.dias.includes(x.getDay())) dias.push(x);
  }
  const nomeDia = (x) => (x.toDateString() === new Date().toDateString() ? "Hoje" : x.toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit" }).replace(".", ""));
  $("[data-dias]", sec).innerHTML = dias.map((x, i) => `<button class="chip" data-dia="${i}" aria-pressed="false">${nomeDia(x)}</button>`).join("");
  $("[data-horas]", sec).innerHTML = S.horas.map((h) => `<button class="chip" data-hora="${h}" aria-pressed="false">${h}</button>`).join("");
  const total = () => (esc.serv ? precoDe(itens[esc.serv]) : 0) + (esc.extra && S.extra ? S.extra.preco : 0);
  const pintar = () => {
    $$("[data-serv]", sec).forEach((b) => b.setAttribute("aria-pressed", b.dataset.serv === esc.serv));
    $$("[data-dia]", sec).forEach((b) => b.setAttribute("aria-pressed", +b.dataset.dia === esc.dia));
    $$("[data-hora]", sec).forEach((b) => b.setAttribute("aria-pressed", b.dataset.hora === esc.hora));
    $("[data-r-serv]", sec).textContent = esc.serv ? itens[esc.serv].nome : "—";
    $("[data-r-dia]", sec).textContent = esc.dia !== null ? nomeDia(dias[esc.dia]) : "—";
    $("[data-r-hora]", sec).textContent = esc.hora || "—";
    const rp = $("[data-r-porte]", sec); if (rp) rp.textContent = S.portes.find((p) => p.k === porte).label;
    const re = $("[data-r-extra]", sec); if (re) re.textContent = esc.extra ? "Sim" : "Não";
    const rt = $("[data-r-total]", sec); if (rt) rt.textContent = brl(total());
    document.dispatchEvent(new CustomEvent("agenda", { detail: esc }));
  };
  document.addEventListener("click", (e) => {
    const g = e.target.closest("[data-agendar]");
    if (g) { esc.serv = g.dataset.agendar; pintar(); }
    if (!sec.contains(e.target)) return;
    const s = e.target.closest("[data-serv]"), d = e.target.closest("[data-dia]"), h = e.target.closest("[data-hora]");
    if (s) esc.serv = s.dataset.serv; if (d) esc.dia = +d.dataset.dia; if (h) esc.hora = h.dataset.hora;
    pintar();
  });
  const ex = $("#f-extra", sec); if (ex) ex.addEventListener("change", () => { esc.extra = ex.checked; pintar(); });
  document.addEventListener("porte", pintar);
  $("[data-confirmar]", sec).addEventListener("click", () => {
    if (!esc.serv || esc.dia === null || !esc.hora) { $(".resumo small", sec).textContent = "Escolha o serviço, o dia e o horário."; return; }
    const d = dias[esc.dia].toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "2-digit" });
    mostrarMensagem(`Olá, ${S.nome}! Quero agendar:\n${itens[esc.serv].nome}${porte ? " · porte " + porte : ""}\n${d}, às ${esc.hora}${esc.extra && S.extra ? "\n" + S.extra.label + ": sim" : ""}${S.semPreco ? "" : "\nTotal: " + brl(total())}`);
  });
  pintar();
}

function filtros() {
  $$("[data-filtro]").forEach((b) => b.addEventListener("click", () => {
    $$("[data-filtro]").forEach((x) => x.setAttribute("aria-pressed", x === b));
    $$("[data-cat]").forEach((li) => { li.hidden = !(b.dataset.filtro === "todos" || li.dataset.cat === b.dataset.filtro); });
    ScrollTrigger.refresh();
  }));
  $$("[data-porte]").forEach((b) => b.addEventListener("click", () => {
    porte = b.dataset.porte;
    $$("[data-porte]").forEach((x) => x.setAttribute("aria-pressed", x.dataset.porte === porte));
    $$("[data-preco]").forEach((el) => { el.textContent = brl(precoDe(itens[el.dataset.preco])); });
    document.dispatchEvent(new Event("porte"));
  }));
}

function nav() {
  const el = $(".nav"); let ult = 0;
  ScrollTrigger.create({ start: 0, end: "max", onUpdate: (s) => { const y = s.scroll(); el.classList.toggle("some", y > ult && y > innerHeight * 0.4); ult = y; } });
}

window.kit = { gsap, ScrollTrigger, reduz, $, $$, brl, S };
try { window.cena && window.cena(window.kit); } catch (e) { console.error("cena", e); }
filtros();
if (S.modo === "pedido") pedido(); else agenda();
nav();
$$("dialog [data-fechar]").forEach((b) => b.addEventListener("click", () => b.closest("dialog").close()));
if (!reduz && Lenis) {
  const lenis = new Lenis({ anchors: true, lerp: 0.1 });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0);
  $$("dialog").forEach((d) => new MutationObserver(() => (d.open ? lenis.stop() : lenis.start())).observe(d, { attributes: true, attributeFilter: ["open"] }));
}
document.fonts && document.fonts.ready.then(() => ScrollTrigger.refresh());
addEventListener("load", () => ScrollTrigger.refresh());
