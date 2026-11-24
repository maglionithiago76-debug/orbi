// Orbi particle scene: thousands of WebGL points that morph between the business's own objects. No dependencies, no image files.
// <section class="pt" data-formas="dente,implante" data-modo="vento"> morphs with scroll; data-auto on the holder morphs by time instead.
(() => {
  // silhouettes in a 100x100 box; "|r" strokes of width r instead of a fill; several parts allowed, "-" parts are cut out
  const F = {
    dente: [["M50 24C38 12 16 14 15 38c-1 14 7 22 9 34 2 10 3 20 9 20 8 0 7-28 17-28s9 28 17 28c6 0 7-10 9-20 2-12 10-20 9-34C84 14 62 12 50 24z"]],
    implante: [["M34 8h32l5 22H29z"], ["M40 33h20v7H40z"], ["M33 43h34l-1 8H34zM34 54h32l-1 8H35zM36 65h28l-2 8H38zM39 76h22l-4 8H43zM45 87h10l-5 8z"]],
    sorriso: [["M6 34q44 22 88 0q-4 48-44 48T6 34z"], ["-M16 46q34 14 68 0l-2 6q-32 13-64 0z"]],
    gota: [["M50 4C62 26 80 44 80 64a30 30 0 0 1-60 0C20 44 38 26 50 4z"]],
    flor: [0, 72, 144, 216, 288].map((a) => ["M50 46C34 34 34 10 50 4c16 6 16 30 0 42z", a]).concat([["M50 42a8 8 0 1 0 .1 0z"]]),
    folha: [["M50 4C82 24 86 62 50 92 14 62 18 24 50 4z"], ["-M49 20h2v72h-2z"]],
    pata: [["M50 48c-16 0-28 18-28 30 0 14 14 14 28 10 14 4 28 4 28-10 0-12-12-30-28-30z"], ["M18 34a9 12 0 1 0 .1 0zM38 10a10 14 0 1 0 .1 0zM62 10a10 14 0 1 0 .1 0zM82 34a9 12 0 1 0 .1 0z"]],
    coracao: [["M50 90C18 66 6 50 6 34a22 22 0 0 1 44-8 22 22 0 0 1 44 8c0 16-12 32-44 56z"]],
    cruz: [["M36 8h28v28h28v28H64v28H36V64H8V36h28z"]],
    osso: [["M20 41h60v18H20z"], ["M17 26a12 12 0 1 0 .1 0zM17 50a12 12 0 1 0 .1 0zM83 26a12 12 0 1 0 .1 0zM83 50a12 12 0 1 0 .1 0z"]],
    casa: [["M50 8L94 46H82v44H18V46H6z"], ["-M40 90V64a10 10 0 0 1 20 0v26z"]],
    engrenagem: [0, 45, 90, 135, 180, 225, 270, 315].map((a) => ["M42 4h16l3 20H39z", a]).concat([["M50 16a34 34 0 1 0 .1 0z"], ["-M50 35a15 15 0 1 0 .1 0z"]]),
    chave: [["M24 62L62 24l14 14-38 38z"], ["M72 4a24 24 0 1 0 .1 0z"], ["-M74 24L96-2 110 14 84 36z"], ["M26 58a17 17 0 1 0 .1 0z"], ["-M26 68a7 7 0 1 0 .1 0z"]],
    pneu: [["M50 4a46 46 0 1 0 .1 0z"], ["-M50 20a30 30 0 1 0 .1 0z"], ["M50 26a24 24 0 1 0 .1 0z"], ...[0, 72, 144, 216, 288].map((a) => ["-M50 30a6 6 0 1 0 .1 0z", a])],
    navalha: [["M4 58L62 14q16 0 20 10L46 56q-18 8-42 2z"], ["M62 14l18-12 8 4-8 14z"], ["M42 52l8-10 46 44q2 10-8 12z"]],
    tesoura: [["M44 62L72 2q8 8 4 18L54 64zM56 62L28 2q-8 8-4 18l22 44z"], ["M30 58a18 18 0 1 0 .1 0zM70 58a18 18 0 1 0 .1 0z"], ["-M30 66a10 10 0 1 0 .1 0zM70 66a10 10 0 1 0 .1 0z"]],
    bigode: [["M50 42C40 30 22 34 18 48 14 58 6 58 2 52c2 20 34 24 48 6 14 18 46 14 48-6-4 6-12 6-16-4C78 34 60 30 50 42z"]],
    pizza: [["M10 18q40-18 80 0L50 96z"], ["-M36 28a7 7 0 1 0 .1 0zM62 30a7 7 0 1 0 .1 0zM50 52a7 7 0 1 0 .1 0z"]],
    tomate: [["M50 24C20 14 6 34 8 56c2 24 22 36 42 36s40-12 42-36c2-22-12-42-42-32z"], ["-M50 20l-4 12-14-4 10 10-6 10 14-6 14 6-6-10 10-10-14 4z"]],
    chama: [["M52 2c4 20 30 32 28 60a30 32 0 0 1-60 0c0-16 8-24 14-32 2 10 6 12 10 12 4-12-2-26 8-40z"], ["-M50 58c8 10 12 14 10 22a10 10 0 0 1-20 0c0-8 6-12 10-22z"]],
    burger: [["M8 42C10 14 90 14 92 42z"], ["M6 46q11 10 22 2 11 10 22 2 11 8 22-2 11 8 22-2v6H6z"], ["M8 56h84v12H8z"], ["M10 72h80q0 16-14 16H24q-14 0-14-16z"]],
    batata: [["M22 46h56l-8 48H30z"], ["M24 14h9v28h-9zM36 6h9v36h-9zM48 12h9v30h-9zM60 4h9v38h-9zM71 18h8v24h-8z"]],
  };
  const N = innerWidth < 700 ? 9000 : 16000, S = 220;
  const pontos = (nome, n) => {
    const c = document.createElement("canvas"); c.width = c.height = S;
    const x = c.getContext("2d", { willReadFrequently: true });
    for (const [d, a] of F[nome]) {
      x.save(); x.scale(S / 100, S / 100);
      if (a) { x.translate(50, 50); x.rotate(a * Math.PI / 180); x.translate(-50, -50); }
      const fora = d[0] === "-"; x.globalCompositeOperation = fora ? "destination-out" : "source-over";
      x.fill(new Path2D(fora ? d.slice(1) : d)); x.restore();
    }
    const px = x.getImageData(0, 0, S, S).data, dist = new Float32Array(S * S), dentro = [];
    const D = (i, j) => (i < 0 || j < 0 || i >= S || j >= S ? 0 : dist[j * S + i]);
    for (let j = 0; j < S; j++) for (let i = 0; i < S; i++) dist[j * S + i] = px[(j * S + i) * 4 + 3] > 128 ? 1e3 : 0;
    for (let j = 0; j < S; j++) for (let i = 0; i < S; i++) dist[j * S + i] = Math.min(D(i, j), D(i - 1, j) + 1, D(i, j - 1) + 1, D(i - 1, j - 1) + 1.4);
    for (let j = S - 1; j >= 0; j--) for (let i = S - 1; i >= 0; i--) dist[j * S + i] = Math.min(D(i, j), D(i + 1, j) + 1, D(i, j + 1) + 1, D(i + 1, j + 1) + 1.4);
    for (let k = 0; k < S * S; k++) if (dist[k] > 0) dentro.push(k);
    const out = new Float32Array(n * 3);
    for (let k = 0; k < n; k++) {
      let p = dentro[(Math.random() * dentro.length) | 0];
      if (k % 3 === 0) for (let t = 0; t < 8 && dist[p] > 3; t++) p = dentro[(Math.random() * dentro.length) | 0]; // denser outline
      const h = Math.min(1, dist[p] / 26), z = Math.sqrt(1 - (1 - h) ** 2) * 0.3;   // inflate: thick in the middle, thin on the rim
      out[k * 3] = ((p % S) + Math.random()) / S * 2 - 1;
      out[k * 3 + 1] = 1 - (((p / S) | 0) + Math.random()) / S * 2;
      out[k * 3 + 2] = (Math.random() < 0.5 ? -1 : 1) * z + (Math.random() - 0.5) * 0.03;
    }
    return out;
  };
  const MODOS = { vento: 0, explode: 1, gira: 2, cai: 3 };
  const VS = `attribute vec3 a,b;attribute vec4 r;uniform float t,m,modo,dpr,esc;uniform vec2 res,mouse;varying float v,q;
void main(){float g=clamp(m*1.6-r.x*.6,0.,1.);g=g*g*(3.-2.*g);vec3 p=mix(a,b,g);float w=sin(g*3.14159);vec3 d=r.yzw*2.-1.;
if(modo<.5)p+=w*vec3(.9+d.x*.7,d.y*.6,d.z*.8);else if(modo<1.5)p+=w*normalize(d+.001)*(.5+r.x);
else if(modo<2.5){float s=w*(2.+r.x*2.);p.xz=mat2(cos(s),-sin(s),sin(s),cos(s))*p.xz*(1.+w*.7);p.y+=w*d.y*.5;}
else p+=w*vec3(d.x*.35,-1.1*r.x+d.y*.3,d.z*.6);
p+=.012*sin(t*1.3+d*9.);
if(r.w>.95)p+=d*.35*(1.+.2*sin(t+r.x*9.));
float y=sin(t*.35)*.5+mouse.x*.35,x=mouse.y*.22;
p.xz=mat2(cos(y),-sin(y),sin(y),cos(y))*p.xz;p.yz=mat2(cos(x),-sin(x),sin(x),cos(x))*p.yz;
float z=3.4-p.z;vec2 s=p.xy*esc*(res.y>res.x*1.2?1.15:1.)*3.4/z;gl_Position=vec4(s*min(res.x,res.y)/res,0.,1.);
gl_PointSize=dpr*(1.4+r.y*2.)*3.4/z*(r.z>.97?2.:1.);v=clamp(.78+p.z*.8,.4,1.);q=r.z;}`;
  const FS = `precision mediump float;varying float v,q;uniform vec3 c1,c2;void main(){float d=length(gl_PointCoord-.5);if(d>.5)discard;
gl_FragColor=vec4(mix(c1,c2,smoothstep(.55,.95,q)),v*smoothstep(.5,.2,d));}`;
  const rgb = (el, prop) => { const s = document.createElement("i"); s.style.color = `var(${prop})`; s.hidden = true; el.append(s); const c = getComputedStyle(s).color.match(/[\d.]+/g).slice(0, 3).map((v) => v / 255); s.remove(); return c; };
  function cena(el) {
    const cv = el.querySelector("canvas"), gl = cv.getContext("webgl", { alpha: true, antialias: false, premultipliedAlpha: false, powerPreference: "low-power" });
    if (!gl) { el.classList.add("ptcl--sem"); return; }
    const nomes = el.dataset.formas.split(","), auto = "auto" in el.dataset, falas = [...el.querySelectorAll(".ptcl__fala")];
    const reduz = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pr = gl.createProgram();
    for (const [tp, src] of [[gl.VERTEX_SHADER, VS], [gl.FRAGMENT_SHADER, FS]]) { const s = gl.createShader(tp); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) console.error(gl.getShaderInfoLog(s)); gl.attachShader(pr, s); }
    gl.linkProgram(pr); gl.useProgram(pr);
    const buf = (d) => { const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, d, gl.STATIC_DRAW); return b; };
    const liga = (n, b, k) => { const l = gl.getAttribLocation(pr, n); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.enableVertexAttribArray(l); gl.vertexAttribPointer(l, k, gl.FLOAT, false, 0, 0); };
    const formas = nomes.map((n) => buf(pontos(n, N))), rnd = new Float32Array(N * 4).map(Math.random);
    liga("r", buf(rnd), 4);
    const U = (n) => gl.getUniformLocation(pr, n), u = { t: U("t"), m: U("m"), res: U("res"), mouse: U("mouse") };
    gl.uniform1f(U("modo"), MODOS[el.dataset.modo] || 0); gl.uniform1f(U("esc"), +el.dataset.escala || 0.7);
    gl.uniform3fv(U("c1"), rgb(el, "--pt1")); gl.uniform3fv(U("c2"), rgb(el, "--pt2"));
    gl.enable(gl.BLEND); gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    let vis = false, raf = 0, mx = 0, my = 0, ax = 0, ay = 0, pos = 0, ini = performance.now(), fala = -1;
    const dpr = Math.min(devicePixelRatio || 1, 2); gl.uniform1f(U("dpr"), dpr);
    const tam = () => { cv.width = cv.clientWidth * dpr; cv.height = cv.clientHeight * dpr; gl.viewport(0, 0, cv.width, cv.height); gl.uniform2f(u.res, cv.width, cv.height); if (vis && reduz) quadro(performance.now()); };
    const n = formas.length;
    function alvo(now) {
      if (auto) { if (reduz) return 0; const s = (now - ini) / 3600; const k = Math.floor(s), f = s - k; return k + Math.min(1, Math.max(0, (f - 0.45) / 0.55)); }
      const r = el.getBoundingClientRect(), p = Math.min(1, Math.max(0, -r.top / (r.height - innerHeight))) * (n - 1);
      const k = Math.min(n - 2, Math.floor(p)), f = p - k;
      return k + Math.min(1, Math.max(0, (f - 0.25) / 0.5));
    }
    function quadro(now) {
      const a = alvo(now); pos = auto || reduz ? a : pos + (a - pos) * 0.14;
      ax += (mx - ax) * 0.06; ay += (my - ay) * 0.06;
      let k = Math.floor(pos), m = pos - k;
      if (!auto && k >= n - 1) { k = n - 2; m = 1; }
      if (reduz) m = Math.round(m);
      liga("a", formas[k % n], 3); liga("b", formas[(k + 1) % n], 3);
      gl.uniform1f(u.t, reduz ? 0 : (now - ini) / 1000); gl.uniform1f(u.m, m); gl.uniform2f(u.mouse, ax, ay);
      gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT); gl.drawArrays(gl.POINTS, 0, N);
      const q = Math.round(pos) % n; if (q !== fala) { fala = q; falas.forEach((f, i) => f.classList.toggle("on", i === q)); }
    }
    const laco = (now) => { quadro(now); raf = vis && !(reduz && auto) ? requestAnimationFrame(laco) : 0; };
    new IntersectionObserver(([e]) => { vis = e.isIntersecting; if (vis && !raf) raf = requestAnimationFrame(laco); }).observe(el);
    new ResizeObserver(tam).observe(cv); tam(); quadro(ini);
    addEventListener("pointermove", (e) => { mx = e.clientX / innerWidth * 2 - 1; my = e.clientY / innerHeight * 2 - 1; }, { passive: true });
    cv.addEventListener("webglcontextlost", () => { vis = false; el.classList.add("ptcl--sem"); });
    el.classList.add("ptcl--ok");
  }
  document.querySelectorAll("[data-formas]").forEach((el) => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { io.disconnect(); cena(el); } }, { rootMargin: "600px 0px" }); io.observe(el);
  });
})();
