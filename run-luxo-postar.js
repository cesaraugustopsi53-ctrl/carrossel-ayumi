// ============================================================
// CARROSSEL — Medo de Postar é Luxo v1 — @thais_ayumi
// Copy Squad: copy agressiva, identificação brutal
// Distribuição: imagem → texto → imagem → texto → imagem → CTA
// Rosto sempre no topo, texto sempre na base (sem sobreposição)
// ============================================================

const { htmlImagem, htmlTexto, HANDLE, gerarImagem, baixarImagem, fetchImagemUrl, cropImageComBgPos } = require('./gerar-carrossel-ayumi');
// bgHeight + sharp crop: fotos reais são pré-cortadas no servidor
// bgPosition Y% → offset do crop na foto original
//   '50% 0%'  → mostra do topo (rosto no terço superior)
//   '50% 20%' → começa 20% abaixo do topo
const puppeteer = require('puppeteer');
const fs   = require('fs');
const path = require('path');

const GITHUB_RAW = 'https://raw.githubusercontent.com/cesaraugustopsi53-ctrl/carrossel-ayumi/main/fotos-thais';
const FOTOS_GITHUB = {
  retrato1:  `${GITHUB_RAW}/thais-retrato-1.jpg`,
  trabalho:  `${GITHUB_RAW}/thais-trabalho.jpg`,
};

async function resolverImagem(s, outputDir) {
  if (s._fotoKey) {
    try {
      console.log(`[${s.numero}] Foto real: ${s._fotoKey}`);
      return await fetchImagemUrl(FOTOS_GITHUB[s._fotoKey]);
    } catch(e) {
      console.log(`[${s.numero}] GitHub falhou, usando FLUX`);
    }
  }
  if (s.imagemPrompt) {
    console.log(`[${s.numero}] FLUX...`);
    const url = await gerarImagem(s.imagemPrompt);
    const p = path.join(outputDir, `img-${s.numero}.jpg`);
    await baixarImagem(url, p);
    return 'data:image/jpeg;base64,' + fs.readFileSync(p).toString('base64');
  }
  return null;
}

// ── SLIDES — Copy Squad v3 ────────────────────────────────────
const SLIDES = [
  {
    numero: 1,
    layout: 'imagem',
    tag: '',
    headline: 'Medo de postar no Instagram é luxo de quem já é rico.',
    corpo: '',
    _fotoKey: 'retrato1',
    bgPosition: '50% 36%',
    bgHeight: '900px',
  },
  {
    numero: 2,
    layout: 'texto',
    tag: '',
    headline: 'Quem já tem nome, posicionamento e liberdade financeira pode ter medo.',
    corpo: 'Pode ficar quieta.\nPode escolher não aparecer.\nEla já chegou.',
  },
  {
    numero: 3,
    layout: 'texto',
    tag: '',
    headline: 'Você ainda não chegou.',
    corpo: 'Seu posicionamento ainda não está claro.\nSua liberdade financeira ainda não existe.\nE você está com medo de postar.',
  },
  {
    numero: 4,
    layout: 'imagem',
    tag: '',
    headline: 'O Instagram não pede dinheiro.\nPede coragem.',
    corpo: '',
    imagemPrompt: 'Cinematic editorial portrait, a young female psychologist sitting alone at her desk in a dimly lit office at night, staring blankly at her phone with zero notifications, empty appointment book open in front of her, single warm desk lamp casting Rembrandt lighting on her face, expression of quiet frustration and exhaustion, elegant professional clothes, no text overlay zone at bottom third, shallow depth of field f/1.8, desaturated warm tones, 35mm film grain, deeply emotional, high contrast',
  },
  {
    numero: 5,
    layout: 'texto',
    tag: '',
    headline: 'Enquanto você espera o momento certo de aparecer...',
    corpo: 'Outra profissional de saúde postou.\nSe posicionou.\nConstruiu autoridade.\nSem pagar um centavo.',
  },
  {
    numero: 6,
    layout: 'texto',
    tag: '',
    headline: 'O Instagram orgânico é a única ferramenta gratuita que constrói posicionamento real.',
    corpo: 'Não precisa de verba.\nNão precisa de editor.\nPrecisa que você apareça.',
  },
  {
    numero: 7,
    layout: 'imagem',
    tag: '',
    headline: 'Invisibilidade digital não é humildade.\nÉ escolha de continuar desvalorizada.',
    corpo: '',
    imagemPrompt: 'Powerful cinematic portrait, a female doctor in scrubs sitting in a hospital break room at 3am after a long shift, head resting on her hand, staring at her phone trying to record a video for Instagram but unable to start, exhaustion and quiet defeat in her expression, harsh cold fluorescent light above, warm practical light from phone screen on her face, blurred hospital corridor visible through glass behind her, no text zone at bottom third, 35mm film grain, f/1.4 bokeh, high contrast chiaroscuro, deeply emotional',
  },
  {
    numero: 8,
    layout: 'texto',
    tag: '',
    headline: 'Você passou anos se especializando.',
    corpo: 'Fez faculdade. Fez especialização.\nAtende com excelência.\nE continua cobrando menos do que merece\nporque ninguém sabe quem você é.',
  },
  {
    numero: 9,
    layout: 'texto',
    tag: '',
    headline: 'O problema não é sua competência.\nÉ que você é invisível.',
    corpo: 'E você escolhe ser invisível\ntoda vez que deixa o medo\ndecidír por você.',
  },
  {
    numero: 10,
    layout: 'imagem',
    tag: 'Grupo VIP',
    headline: 'Se você quer se posicionar e ter liberdade financeira sem tráfego pago, entre no Grupo VIP.',
    corpo: 'Link na bio.\nOu me manda uma DM: "QUERO".',
    _fotoKey: 'trabalho',
    bgPosition: '50% 55%',
    bgHeight: '880px',
  },
];

const LEGENDA = `Medo de postar é luxo de quem já é rico.

Você ainda não chegou.

Enquanto você espera o momento certo de aparecer, outra profissional de saúde postou, se posicionou, construiu autoridade e conquistou a liberdade financeira que você quer. Sem pagar um centavo.

O Instagram orgânico é gratuito. Não pede verba. Pede coragem.

Invisibilidade digital não é humildade. É escolha de continuar cobrando menos do que você merece — sendo boa no que faz, mas desconhecida por quem precisa de você.

Se você quer se posicionar, ser reconhecida e ter liberdade financeira sem tráfego pago: entre no Grupo VIP da mentoria.

Link na bio. Ou me manda um "QUERO" no direct.

#posicionamentodigital #mulheresdeasaude #psicologadigital #nutricionistadigital #medicadigital #presencadigital #liberdadefinanceira #marketingparamulheres #empreendedorismodigital #visibilidadedigital`;

// ── MAIN ─────────────────────────────────────────────────────
async function main() {
  const outputDir = 'C:/Users/cesar/carrossel-ayumi/output/luxo-postar-v1';
  const pngDir    = path.join(outputDir, 'png');
  fs.mkdirSync(pngDir, { recursive: true });

  const total = SLIDES.length;
  console.log('\n🔥 Gerando carrossel "Medo de Postar é Luxo" — @thais_ayumi\n');

  // Carrega imagens
  const imgs = {};
  for (const s of SLIDES) {
    if (s._fotoKey || s.imagemPrompt) {
      imgs[s.numero] = await resolverImagem(s, outputDir);
    }
  }

  // Pré-corte sharp para fotos reais com bgHeight definido
  for (const s of SLIDES) {
    if (s.bgHeight && imgs[s.numero]) {
      imgs[s.numero] = await cropImageComBgPos(imgs[s.numero], s.bgHeight, s.bgPosition||'50% 0%');
      console.log(`[${s.numero}] Foto cortada para topo ${s.bgHeight}`);
    }
  }

  // Gera HTMLs
  const htmls = {};
  for (const s of SLIDES) {
    htmls[s.numero] = s.layout === 'imagem'
      ? htmlImagem(s.numero, total, imgs[s.numero] || '', s.tag || '', s.headline, s.corpo || '', s.bgPosition || '', s.bgHeight || '')
      : htmlTexto(s.numero, total, s.tag || '', s.headline, s.corpo || '', s.nota || '');
    fs.writeFileSync(path.join(outputDir, `slide-${s.numero}.html`), htmls[s.numero]);
  }

  // Exporta PNGs
  console.log('\n📸 Exportando PNGs...');
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  for (const s of SLIDES) {
    const pngPath = path.join(pngDir, `slide-${String(s.numero).padStart(2, '0')}.png`);
    const page = await browser.newPage();
    await page.setViewport({ width: 1080, height: 1350, deviceScaleFactor: 1 });
    await page.setContent(htmls[s.numero], { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 2000));
    await page.screenshot({ path: pngPath, clip: { x: 0, y: 0, width: 1080, height: 1350 } });
    await page.close();
    console.log(`  Slide ${s.numero} pronto`);
  }
  await browser.close();

  fs.writeFileSync(path.join(outputDir, 'legenda.txt'), LEGENDA, 'utf8');
  console.log('\n─── LEGENDA ──────────────────────────────────────────');
  console.log(LEGENDA);
  console.log(`\n✅ PNGs em: ${pngDir}`);
}

main().catch(console.error);
