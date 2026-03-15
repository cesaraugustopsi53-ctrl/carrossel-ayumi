// ============================================================
// GERADOR CARROSSEL — @thais_ayumi — Mentoria Ayumi
// Visual: vinho profundo + dourado + branco creme
// Estética: luxo, feminino, editorial, espaçado
// ============================================================

const https = require('https');
const http  = require('http');
const fs    = require('fs');
const path  = require('path');
const puppeteer = require('puppeteer');

const FAL_API_KEY = '4d8ed20f-cbe5-48a7-9ae2-c708c8b6189e:f6aa36d11d1f4457da34b6655d3df5d8';
const HANDLE = '@thais_ayumi';

// SVG logo inline (base64 para usar no HTML)
const LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 400" width="120" height="150">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#D4AF6E"/>
      <stop offset="40%" style="stop-color:#F0D080"/>
      <stop offset="70%" style="stop-color:#C9A84C"/>
      <stop offset="100%" style="stop-color:#A8843C"/>
    </linearGradient>
  </defs>
  <ellipse cx="160" cy="170" rx="110" ry="130" fill="none" stroke="url(#g)" stroke-width="1.5"/>
  <text x="160" y="200" font-family="Georgia,serif" font-size="96" font-weight="600" fill="url(#g)" text-anchor="middle" letter-spacing="-4">AM</text>
  <text x="160" y="340" font-family="Georgia,serif" font-size="26" font-weight="400" fill="url(#g)" text-anchor="middle" letter-spacing="3">Mentoria Ayumi</text>
</svg>`;

async function fetchImagemUrl(url) {
  return new Promise((resolve, reject) => {
    (url.startsWith('https') ? https : http).get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return fetchImagemUrl(res.headers.location).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        res.resume();
        return reject(new Error(`HTTP ${res.statusCode} para ${url}`));
      }
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => {
        const buf = Buffer.concat(chunks);
        resolve('data:image/jpeg;base64,' + buf.toString('base64'));
      });
    }).on('error', reject);
  });
}

const COMPOSICAO_PADRAO = ' — CINEMATIC COMPOSITION (mandatory): (1) Subject/face in UPPER 55% of frame, eyes near upper rule-of-thirds line at ~33% from top. (2) Lower 45% = deep shadow, naturally underexposed, empty negative space — NO detail in this zone, it receives text overlay. (3) Single directional light source: Rembrandt or side-lit, hard shadows, high contrast. (4) Shallow depth of field, background soft bokeh f/1.4. (5) Deep blacks, rich shadows, film grain visible. (6) Portrait 4:5, 1080x1350px. NO faces showing clearly — mood and atmosphere only.';

async function gerarImagem(prompt) {
  return new Promise((resolve, reject) => {
    const promptFinal = prompt + COMPOSICAO_PADRAO;
    const body = JSON.stringify({ prompt: promptFinal, image_size: { width: 1080, height: 1350 }, num_inference_steps: 28, guidance_scale: 3.5, num_images: 1, safety_tolerance: '5' });
    const req = https.request({ hostname: 'fal.run', path: '/fal-ai/flux-pro', method: 'POST',
      headers: { 'Authorization': `Key ${FAL_API_KEY}`, 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) }
    }, (res) => {
      let data = ''; res.on('data', c => data += c);
      res.on('end', () => { try { resolve(JSON.parse(data).images[0].url); } catch(e) { reject(e); } });
    });
    req.on('error', reject); req.write(body); req.end();
  });
}

async function baixarImagem(url, destino) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destino);
    (url.startsWith('https') ? https : http).get(url, (res) => {
      res.pipe(file); file.on('finish', () => { file.close(); resolve(destino); });
    }).on('error', reject);
  });
}

// ── TEMPLATE TEXTO PURO — vinho profundo + dourado ───────────
function htmlTexto(n, total, tag, headline, corpo, nota) {
  const fs_ = headline.length > 50 ? '84px' : headline.length > 36 ? '96px' : '110px';
  return `<!DOCTYPE html><html><head><meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Inter:wght@300;400;500&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1350px;overflow:hidden}
.slide{width:1080px;height:1350px;display:flex;flex-direction:column;justify-content:center;align-items:flex-start;
  padding:110px 110px 200px 110px;position:relative;
  /* Storaro: fonte de luz quente saindo do canto inferior esquerdo (vela/candelabro) */
  background:linear-gradient(150deg,#0d0408 0%,#1e0810 30%,#2a0f18 58%,#130610 100%)}

/* luz quente baixo-esquerda (candle light) + escuridão fria alto-direita */
.slide::after{content:'';position:absolute;inset:0;
  background:
    radial-gradient(ellipse 60% 50% at 8% 90%, rgba(200,120,40,.16) 0%, transparent 65%),
    radial-gradient(ellipse 55% 45% at 92% 10%, rgba(10,2,8,.75) 0%, transparent 65%);
  pointer-events:none}

/* linha lateral dourada — borda direita, respiro visual */
.slide::before{content:'';position:absolute;right:0;top:10%;bottom:10%;width:1px;
  background:linear-gradient(to bottom,transparent,rgba(212,175,110,0.55),transparent)}

/* vinheta cinematográfica — escurece bordas como lente anamórfica */
.vinheta{position:absolute;inset:0;z-index:4;pointer-events:none;
  background:radial-gradient(ellipse 88% 82% at 50% 42%, transparent 28%, rgba(8,1,6,.62) 100%)}

/* logo no topo direito */
.logo{position:absolute;top:60px;right:80px;width:80px;opacity:0.85;z-index:10}

.num{position:relative;z-index:10;font-family:'Inter',sans-serif;font-weight:400;font-size:12px;letter-spacing:.22em;
  color:rgba(212,175,110,0.55);margin-bottom:${tag?'18px':'48px'};text-transform:uppercase}
.tag{position:relative;z-index:10;font-family:'Inter',sans-serif;font-weight:400;font-size:11px;letter-spacing:.22em;
  text-transform:uppercase;color:#C9A84C;opacity:.8;margin-bottom:28px;display:${tag?'block':'none'}}

/* headline em Cormorant — elegante, serifada */
.headline{position:relative;z-index:10;font-family:'Cormorant Garamond',serif;font-weight:600;font-size:${fs_};line-height:1.05;
  color:#F5EDE3;letter-spacing:-.01em;margin-bottom:${corpo?'48px':'0'};max-width:840px;
  text-shadow:0 2px 40px rgba(0,0,0,.5)}

.divisor{position:relative;z-index:10;width:36px;height:1px;background:rgba(212,175,110,0.6);margin-bottom:36px;display:${corpo?'block':'none'}}

.corpo{position:relative;z-index:10;font-family:'Inter',sans-serif;font-weight:300;font-size:42px;line-height:1.6;
  color:rgba(240,232,220,0.96);max-width:860px;white-space:pre-line;display:${corpo?'block':'none'}}

.nota{position:absolute;bottom:88px;left:110px;right:180px;z-index:10;
  font-family:'Cormorant Garamond',serif;font-weight:400;font-style:italic;font-size:18px;
  color:rgba(212,175,110,0.65);display:${nota?'block':'none'}}

.handle{position:absolute;bottom:80px;right:80px;z-index:10;
  font-family:'Inter',sans-serif;font-weight:400;font-size:17px;letter-spacing:.08em;
  color:rgba(212,175,110,0.5)}

.bar{position:absolute;bottom:0;left:0;z-index:10;height:1px;width:${(n/total)*100}%;
  background:linear-gradient(to right,transparent,rgba(212,175,110,0.6))}
</style></head><body><div class="slide">
<div class="vinheta"></div>
<div class="logo">${LOGO_SVG}</div>
<div class="num">${String(n).padStart(2,'0')} / ${String(total).padStart(2,'0')}</div>
${tag?`<div class="tag">${tag}</div>`:''}
<div class="headline">${headline}</div>
${corpo?`<div class="divisor"></div><div class="corpo">${corpo}</div>`:''}
${nota?`<div class="nota">${nota}</div>`:''}
<div class="handle">${HANDLE}</div>
<div class="bar"></div>
<!-- grain cinematográfico via canvas (Khondji / Deakins style) -->
<canvas id="g" style="position:absolute;inset:0;opacity:.032;pointer-events:none;z-index:9;mix-blend-mode:soft-light"></canvas>
</div>
<script>(function(){const c=document.getElementById('g');c.width=1080;c.height=1350;const x=c.getContext('2d'),d=x.createImageData(1080,1350);for(let i=0;i<d.data.length;i+=4){const v=~~(Math.random()*255);d.data[i]=d.data[i+1]=d.data[i+2]=v;d.data[i+3]=255;}x.putImageData(d,0,0);})();</script>
</body></html>`;
}

// ── TEMPLATE IMAGEM — foto elegante, overlay vinho ───────────
// bgPosition: controla enquadramento da foto dentro do container parcial
//   'top center'    → FLUX (sujeito já está no topo por COMPOSICAO_PADRAO)
//   '50% 5%'        → foto real — mostra topo da foto (rosto)
// bgHeight: altura do container de imagem (partial-height approach)
//   null/''         → imagem full-bleed (FLUX — já composicionado)
//   '820px'         → container parcial — os 530px restantes = brand bg + gradiente suave
// Regra de ouro: olhos/rosto no terço superior do slide (0–33% do topo = 0–445px)
// Math: container=820px, img=1080×1350, cover → overflow Y=530px
//   bgPos Y=0% → mostra px 0-820 da foto | Y=50% → px 265-1085 | Y=100% → px 530-1350
function htmlImagem(n, total, img64, tag, headline, corpo, bgPosition, bgHeight) {
  const fs_ = headline.length > 50 ? '80px' : headline.length > 36 ? '92px' : '106px';
  const bgPos = bgPosition || 'top center';
  const imgH  = bgHeight   || '100%';
  const hasBgH = !!bgHeight;
  // Fade começa 160px antes do fim do container de imagem
  const fadeTop = hasBgH ? `calc(${imgH} - 160px)` : '55%';
  return `<!DOCTYPE html><html><head><meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Inter:wght@300;400;500&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1350px;overflow:hidden}
/* brand dark vinho — fica visível na zona abaixo da imagem parcial */
.slide{position:relative;width:1080px;height:1350px;display:flex;flex-direction:column;justify-content:flex-end;
  background:linear-gradient(150deg,#0d0408 0%,#1e0810 30%,#2a0f18 58%,#130610 100%)}

/* container de imagem — height parcial quando bgHeight definido */
.bg{position:absolute;top:0;left:0;right:0;height:${imgH};
  background-image:url('${img64}');
  background-size:cover;background-position:${bgPos};
  filter:brightness(.78) saturate(.88)}

/* fade cinematográfico: conecta imagem ao fundo brand com gradiente suave */
.bg-fade{position:absolute;left:0;right:0;top:${fadeTop};height:280px;z-index:2;
  background:linear-gradient(to bottom,
    transparent 0%,
    rgba(19,6,16,.55) 30%,
    rgba(13,4,8,.88) 65%,
    rgba(10,3,6,1.0) 100%
  )}

/* overlay clássico: base densa para texto legível */
.ov{position:absolute;inset:0;
  background:linear-gradient(
    to top,
    rgba(20,5,12,1.0)  0%,
    rgba(20,5,12,0.97) 18%,
    rgba(20,5,12,0.85) 35%,
    rgba(20,5,12,0.08) 52%,
    rgba(20,5,12,0.02) 68%,
    transparent        100%
  )}

/* vinheta cinematográfica — escurece bordas, isola o sujeito */
.vinheta{position:absolute;inset:0;z-index:4;pointer-events:none;
  background:radial-gradient(ellipse 88% 78% at 50% 35%, transparent 25%, rgba(8,1,6,.58) 100%)}

/* logo topo direito */
.logo{position:absolute;top:52px;right:72px;width:80px;opacity:.8;z-index:10}

.content{position:relative;z-index:10;padding:0 110px 148px;width:100%}
.num{font-family:'Inter',sans-serif;font-weight:400;font-size:12px;letter-spacing:.22em;
  color:rgba(212,175,110,.6);margin-bottom:${tag?'16px':'32px'};text-transform:uppercase}
.tag{font-family:'Inter',sans-serif;font-weight:400;font-size:11px;letter-spacing:.22em;
  text-transform:uppercase;color:#C9A84C;opacity:.8;margin-bottom:20px;display:${tag?'block':'none'}}
.headline{font-family:'Cormorant Garamond',serif;font-weight:600;font-size:${fs_};line-height:1.05;
  color:#F5EDE3;letter-spacing:-.01em;margin-bottom:${corpo?'28px':'0'};max-width:840px;
  text-shadow:0 2px 30px rgba(0,0,0,.6)}
.divisor{width:36px;height:1px;background:rgba(212,175,110,.6);margin-bottom:24px;display:${corpo?'block':'none'}}
.corpo{font-family:'Inter',sans-serif;font-weight:300;font-size:40px;line-height:1.6;
  color:rgba(240,220,200,.92);max-width:860px;
  text-shadow:0 1px 20px rgba(0,0,0,.9);
  display:${corpo?'block':'none'};margin-bottom:40px}
.handle{position:absolute;bottom:72px;right:80px;z-index:10;
  font-family:'Inter',sans-serif;font-weight:400;font-size:17px;letter-spacing:.08em;
  color:rgba(212,175,110,.5)}
.bar{position:absolute;bottom:0;left:0;z-index:10;height:1px;
  width:${(n/total)*100}%;background:linear-gradient(to right,transparent,rgba(212,175,110,.6))}
</style></head><body><div class="slide">
<div class="bg"></div><div class="bg-fade"></div><div class="ov"></div>
<div class="vinheta"></div>
<div class="logo">${LOGO_SVG}</div>
<div class="content">
<div class="num">${String(n).padStart(2,'0')} / ${String(total).padStart(2,'0')}</div>
${tag?`<div class="tag">${tag}</div>`:''}
<div class="headline">${headline}</div>
${corpo?`<div class="divisor"></div><div class="corpo">${corpo}</div>`:''}
</div>
<div class="handle">${HANDLE}</div>
<div class="bar"></div>
<!-- grain cinematográfico -->
<canvas id="g" style="position:absolute;inset:0;opacity:.028;pointer-events:none;z-index:11;mix-blend-mode:soft-light"></canvas>
</div>
<script>(function(){const c=document.getElementById('g');c.width=1080;c.height=1350;const x=c.getContext('2d'),d=x.createImageData(1080,1350);for(let i=0;i<d.data.length;i+=4){const v=~~(Math.random()*255);d.data[i]=d.data[i+1]=d.data[i+2]=v;d.data[i+3]=255;}x.putImageData(d,0,0);})();</script>
</body></html>`;
}

async function htmlParaPng(html, pngPath, browser) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1350, deviceScaleFactor: 1 });
  await page.setContent(html, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: pngPath, clip: { x:0, y:0, width:1080, height:1350 } });
  await page.close();
}

async function gerarCarrosselAyumi(slides, pastaSlug, legenda) {
  const outputDir = path.join('C:/Users/cesar/carrossel-ayumi/output', pastaSlug);
  const pngDir = path.join(outputDir, 'png');
  fs.mkdirSync(pngDir, { recursive: true });
  const total = slides.length;
  console.log(`\n✨ Gerando ${total} slides — "${pastaSlug}"\n`);

  const imgs = {};
  for (const s of slides) {
    if (s.layout === 'imagem' && s.imagemPrompt) {
      console.log(`[${s.numero}] FLUX...`);
      const url = await gerarImagem(s.imagemPrompt);
      const p = path.join(outputDir, `img-${s.numero}.jpg`);
      await baixarImagem(url, p);
      imgs[s.numero] = 'data:image/jpeg;base64,' + fs.readFileSync(p).toString('base64');
      console.log(`[${s.numero}] imagem pronta`);
    }
  }

  const htmls = {};
  for (const s of slides) {
    htmls[s.numero] = s.layout === 'texto'
      ? htmlTexto(s.numero, total, s.tag||'', s.headline, s.corpo||'', s.nota||'')
      : htmlImagem(s.numero, total, imgs[s.numero]||'', s.tag||'', s.headline, s.corpo||'', s.bgPosition||'', s.bgHeight||'');
    fs.writeFileSync(path.join(outputDir, `slide-${s.numero}.html`), htmls[s.numero]);
  }

  console.log('\n📸 Exportando PNGs...');
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  for (const s of slides) {
    const pngPath = path.join(pngDir, `slide-${String(s.numero).padStart(2,'0')}.png`);
    await htmlParaPng(htmls[s.numero], pngPath, browser);
    console.log(`Slide ${s.numero} pronto`);
  }
  await browser.close();
  if (legenda) {
    fs.writeFileSync(path.join(outputDir, 'legenda.txt'), legenda, 'utf8');
    console.log('\n─── LEGENDA DO POST ───────────────────────────────');
    console.log(legenda);
    console.log('───────────────────────────────────────────────────\n');
  }
  console.log(`\n✅ PNGs em: ${pngDir}`);
  return pngDir;
}

module.exports = { gerarCarrosselAyumi, htmlTexto, htmlImagem, HANDLE, gerarImagem, baixarImagem, fetchImagemUrl };
