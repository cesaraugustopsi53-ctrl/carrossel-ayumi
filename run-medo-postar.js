// ============================================================
// CARROSSEL — Medo de Postar v1 — @thais_ayumi
// Copy Squad aplicado + Princípios Virais P1-P10
// Imagens: GitHub raw URLs (fotos reais) ou FLUX fallback
// ============================================================

const { htmlImagem, htmlTexto, HANDLE, gerarImagem, baixarImagem, fetchImagemUrl } = require('./gerar-carrossel-ayumi');
const puppeteer = require('puppeteer');
const fs   = require('fs');
const path = require('path');

// ── URLS DAS FOTOS NO GITHUB ─────────────────────────────────
// Depois que as fotos forem upadas, trocar os valores abaixo:
const GITHUB_RAW = 'https://raw.githubusercontent.com/cesaraugustopsi53-ctrl/carrossel-ayumi/main/fotos-thais';

const FOTOS_GITHUB = {
  retrato1:  `${GITHUB_RAW}/thais-retrato-1.jpg`,   // blazer vinho, sofá
  trabalho:  `${GITHUB_RAW}/thais-trabalho.jpg`,    // laptop + caneca
  retrato2:  `${GITHUB_RAW}/thais-retrato-2.jpg`,   // close-up rosto
};

// FLUX fallback (caso GitHub ainda não tenha as fotos)
const FLUX_FALLBACK = {
  retrato1:  'Portrait of confident Japanese-Brazilian woman therapist in 30s, elegant minimal office, natural window light, sitting at desk with books, warm cream and green tones, editorial fashion photography style, sharp focus on face showing quiet strength, film grain, Vogue Brazil aesthetic, portrait 4:5 format',
  trabalho:  'Elegant woman in cream dress at kitchen counter holding ceramic mug, open MacBook beside her, abstract art print in background, warm natural morning light, gold accessories, editorial lifestyle photography, no text, portrait 4:5 format, highly detailed',
  retrato2:  'Close-up portrait of confident Japanese-Brazilian woman therapist, elegant burgundy blazer, warm expression, cream curtain background, soft afternoon light, gold earrings, editorial photography, no text, portrait 4:5 format, highly detailed',
};

// ── SLIDES (Copy Squad) ──────────────────────────────────────
const SLIDES = [
  {
    numero: 1,
    layout: 'imagem',
    tag: '',
    headline: 'Você não tem medo de postar.\nVocê tem medo de continuar assim.',
    corpo: 'Mal remunerada. Desvalorizada.\nInvisível para quem mais precisa de você.',
    _fotoKey: 'retrato1',
  },
  {
    numero: 2,
    layout: 'texto',
    tag: '',
    headline: 'Você tem mais formação que 90% dos perfis que o algoritmo está entregando agora.',
    corpo: 'Mais horas de supervisão. Mais anos de análise pessoal.\nMais rigor clínico. E ainda assim, invisível.',
  },
  {
    numero: 3,
    layout: 'texto',
    tag: '',
    headline: 'A sua colega com menos formação está sendo escolhida.',
    corpo: 'Não porque ela é melhor clínica.\nMas porque ela aparece.\nE você ainda está esperando o momento certo.',
  },
  {
    numero: 4,
    layout: 'imagem',
    tag: 'A virada',
    headline: 'O Instagram não documenta quem chegou.\nEle constrói quem está chegando.',
    corpo: 'Toda especialista reconhecida hoje\ncomeçou a postar antes de se sentir pronta.',
    _fotoKey: 'trabalho',
  },
  {
    numero: 5,
    layout: 'texto',
    tag: 'Por que você trava',
    headline: 'O medo de postar não é sobre o Instagram.',
    corpo: 'É sobre ser vista de verdade.\nE descobrir que ser vista muda tudo:\na sua agenda, a sua renda, o seu valor percebido.',
  },
  {
    numero: 6,
    layout: 'texto',
    tag: '3 sinais de que você está travada',
    headline: 'Você já passou por algum desses?',
    corpo: '1. Agenda com horários vazios que você não sabe como preencher.\n2. Tabela de preços que você tem vergonha de divulgar.\n3. Perfil no Instagram que você abre, fecha, e não posta nada.',
  },
  {
    numero: 7,
    layout: 'imagem',
    tag: 'O que muda',
    headline: 'Quando você aprende a aparecer com intenção,\na fila não é mais você esperando paciente.\nÉ você escolhendo quem atender.',
    corpo: 'Posicionamento digital não é vaidade.\nÉ o caminho entre você e quem precisa de você.',
    _fotoKey: 'retrato2',
  },
  {
    numero: 8,
    layout: 'texto',
    tag: '',
    headline: 'Eu tinha 200 mulheres na fila de espera.\nE ainda me sentia invisível digitalmente.',
    corpo: 'Porque agenda cheia não é o mesmo que reconhecimento.\nFoi quando entendi que o Instagram poderia ampliar,\nnão substituir, a minha autoridade clínica.',
  },
  {
    numero: 9,
    layout: 'texto',
    tag: '',
    headline: 'Você não precisa virar criadora de conteúdo.\nVocê precisa aprender a ser encontrada.',
    corpo: 'Existe uma diferença enorme entre postar todo dia\ne aparecer com estratégia.\nÉ isso que eu quero te mostrar.',
  },
  {
    numero: 10,
    layout: 'texto',
    tag: 'Grupo VIP',
    headline: 'Se você se reconheceu em algum slide aqui,\nvocê tem um lugar reservado.',
    corpo: 'Acesse o link na bio e entre para o Grupo VIP\nda Mentoria Ayumi antes de fechar as vagas.\nNão é para todas. É para você, que já entendeu.',
    nota: '@thais_ayumi — Link na bio.',
  },
];

const LEGENDA = `Você não tem medo de postar. Você tem medo de continuar assim.

Mal remunerada para o nível de formação que você tem. Agenda que não reflete o quanto você é boa clínica. E um Instagram que você abre, fecha, e não consegue usar a seu favor.

Esse carrossel é para a psicanalista, a psicoterapeuta, a médica que tem mais horas de supervisão do que a maioria dos perfis que o algoritmo entrega. Mas ainda está invisível para quem precisa de você.

Salva esse post. E manda para uma colega que está travada para aparecer.

O link na bio está aberto para o Grupo VIP da Mentoria. Por pouco tempo.

#psicologadigital #terapeutadigital #posicionamentodigital #psicanalista #presencadigital #agendacheia #marketingparasaude #psicologaempreendedora #mentoriaparaprofissionaisdesaude #visibilidadedigital`;

// ── RESOLVER IMAGEM (GitHub raw → FLUX fallback) ─────────────
async function resolverImagem(fotoKey, outputDir, numero) {
  const url = FOTOS_GITHUB[fotoKey];
  try {
    console.log(`[${numero}] Buscando foto do GitHub: ${path.basename(url)}`);
    const b64 = await fetchImagemUrl(url);
    console.log(`[${numero}] Foto do GitHub carregada`);
    return b64;
  } catch (e) {
    console.log(`[${numero}] GitHub indisponível — gerando via FLUX...`);
    const fluxUrl = await gerarImagem(FLUX_FALLBACK[fotoKey]);
    const p = path.join(outputDir, `img-${numero}.jpg`);
    await baixarImagem(fluxUrl, p);
    return 'data:image/jpeg;base64,' + fs.readFileSync(p).toString('base64');
  }
}

// ── MAIN ─────────────────────────────────────────────────────
async function main() {
  const outputDir = 'C:/Users/cesar/carrossel-ayumi/output/medo-postar-v1';
  const pngDir    = path.join(outputDir, 'png');
  fs.mkdirSync(pngDir, { recursive: true });

  const total = SLIDES.length;
  console.log('\n✨ Gerando carrossel "Medo de Postar" — @thais_ayumi\n');

  // Pré-carrega todas as imagens
  const imgs = {};
  for (const s of SLIDES) {
    if (s._fotoKey) {
      imgs[s.numero] = await resolverImagem(s._fotoKey, outputDir, s.numero);
    }
  }

  // Gera HTMLs
  const htmls = {};
  for (const s of SLIDES) {
    htmls[s.numero] = s.layout === 'imagem'
      ? htmlImagem(s.numero, total, imgs[s.numero] || '', s.tag || '', s.headline, s.corpo || '')
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
  console.log('──────────────────────────────────────────────────────\n');
  console.log(`✅ PNGs em: ${pngDir}`);
}

main().catch(console.error);
