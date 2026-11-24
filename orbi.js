// Orbi homepage: first-screen entrance, model clips that play only while visible, the live demo
// (a real model inside a phone or a laptop screen), the opening-hours line and the fitted footer name.
(() => {
  const d = document, reduz = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const get = (id) => d.getElementById(id);
  requestAnimationFrame(() => d.body.classList.add("pronto"));

  /* ---------- model clips: load and play only while on screen, stay as a still for reduced motion ---------- */
  const clips = [...d.querySelectorAll("video[data-src]")];
  if (!reduz && "IntersectionObserver" in window) {
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      const v = e.target;
      if (e.isIntersecting) { if (!v.src) v.src = v.dataset.src; v.play().catch(() => {}); } else v.pause();
    }), { threshold: 0.25 });
    // after the page is interactive, so the clips never compete with the first paint
    const ligar = () => clips.forEach((v) => io.observe(v));
    if (d.readyState === "complete") setTimeout(ligar, 600); else addEventListener("load", () => setTimeout(ligar, 600));
  }

  /* ---------- live demo ---------- */
  const device = get("device"), tela = get("tela"), form = get("controles"), abrir = get("abrir");
  const palco = device && device.parentElement;
  function caber() {
    if (!device) return;
    const pc = form.v.value === "pc";
    const vw = pc ? 1280 : 390, vh = pc ? 800 : 844;            // the page size the model is rendered at
    const box = palco.getBoundingClientRect(), frame = pc ? 16 : 20;
    const s = Math.min((box.width - frame) / vw, (box.height - frame) / vh);
    tela.style.width = vw + "px"; tela.style.height = vh + "px";
    tela.style.transform = "scale(" + s + ")";
    device.style.width = vw * s + frame + "px";
    device.style.height = vh * s + frame + "px";
    device.classList.toggle("is-desk", pc);
  }
  function trocar() {
    const m = form.querySelector("input[name=m]:checked");
    abrir.href = m.value;
    tela.title = "Modelo " + m.dataset.nome + " funcionando";
    if (tela.dataset.on) tela.src = m.value; else tela.dataset.src = m.value;
  }
  if (device) {
    const pedido = new URLSearchParams(location.search).get("m");   // ?m=oficina opens the demo on that niche
    const alvo = pedido && form.querySelector('input[name=m][value="modelos/' + pedido.replace(/[^a-z]/g, "") + '/"]');
    if (alvo) alvo.checked = true;
    form.addEventListener("change", (e) => { if (e.target.name === "m") trocar(); caber(); });
    addEventListener("resize", caber);
    trocar(); caber();
    // the model itself loads only when the demo is about to show
    const ligar = () => { if (tela.dataset.on) return; tela.dataset.on = "1"; tela.src = tela.dataset.src; };
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { ligar(); io.disconnect(); } }, { rootMargin: "600px 0px" });
      io.observe(palco);
    } else ligar();
    if (alvo) setTimeout(() => get("demo").scrollIntoView(), 300);
  }

  /* ---------- "respondendo agora" on weekdays 9h to 18h, Brasília time ---------- */
  const agora = get("agora");
  if (agora) {
    try {
      const p = new Intl.DateTimeFormat("en-US", { timeZone: "America/Sao_Paulo", weekday: "short", hour: "numeric", hour12: false }).formatToParts(new Date());
      const dia = p.find((x) => x.type === "weekday").value, h = +p.find((x) => x.type === "hour").value;
      const util = !["Sat", "Sun"].includes(dia);
      agora.textContent = util && h >= 9 && h < 18 ? "Respondendo agora" : "Deixe a mensagem: a gente responde no próximo dia útil";
    } catch (e) { /* keeps the plain line */ }
  }

  /* ---------- footer name spans the page ---------- */
  const nome = get("nome");
  function ajustar() {
    if (!nome) return;
    const p = nome.parentElement;
    p.style.fontSize = "100px";
    const w = nome.getBoundingClientRect().width;
    if (w) p.style.fontSize = Math.floor((100 * p.clientWidth) / w * 0.985) + "px";
  }
  ajustar(); addEventListener("resize", ajustar);
  if (d.fonts && d.fonts.ready) d.fonts.ready.then(ajustar);
})();
