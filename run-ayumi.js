// ============================================================
// RUN — Carrossel Grupo VIP Mentoria Ayumi — v2 (viral)
// Copy reescrita: cenas concretas, identificação imediata
// ============================================================

const { gerarCarrosselAyumi } = require('./gerar-carrossel-ayumi');

const SLIDES = [
  {
    numero: 1,
    layout: 'imagem',
    tag: '',
    headline: 'Você tem anos de estudo, sessões que transformam vidas e uma agenda que não reflete nem metade disso.',
    corpo: 'Para a psicóloga, médica ou terapeuta que já se perguntou por que uma conta rasa tem mais seguidores do que a dela.',
    imagemPrompt: 'Cinematic photograph, late evening light, a woman hands resting on a closed laptop on a wooden desk, beside the laptop a physical planner open to a weekly spread with mostly empty appointment slots, a cold cup of coffee, soft warm lamp in the background, muted tones of beige and sage green, shallow depth of field, no faces, no text, editorial photography style, portrait 4:5 format, highly detailed'
  },
  {
    numero: 2,
    layout: 'texto',
    tag: 'você conhece essa noite',
    headline: 'Quinta-feira à noite. Você abre o Instagram para postar. E fecha sem ter postado nada.',
    corpo: 'Não porque você não tem o que dizer.\nVocê tem mais do que qualquer pessoa que segue.\nNinguém te ensinou como dizer de um jeito que faz alguém parar.',
  },
  {
    numero: 3,
    layout: 'texto',
    tag: '',
    headline: 'Você domina a teoria. Sabe conduzir uma sessão. Não sabe o que escrever no post de amanhã.',
    corpo: 'A faculdade te preparou para o consultório.\nNão te preparou para a janela de 3 segundos em que alguém decide se vai te seguir.\nEssas são duas habilidades completamente diferentes. A segunda dá para aprender.',
  },
  {
    numero: 4,
    layout: 'imagem',
    tag: '',
    headline: 'A sua futura paciente está no Instagram agora mesmo. O que ela encontra quando chega no seu perfil?',
    corpo: 'Ela está procurando por alguém exatamente como você.\nEla quer marcar uma consulta. Ela está pronta para pagar.\nEla só precisa chegar até você.',
    imagemPrompt: 'Cinematic overhead shot, a smartphone lying face up on a white marble surface, screen softly glowing, beside it a stethoscope coiled naturally and a small succulent plant, natural morning light from a window casting long shadows, muted warm tones, no faces, no text, no logos, clean and minimal editorial photography, portrait 4:5 format, highly detailed'
  },
  {
    numero: 5,
    layout: 'texto',
    tag: 'a prova viva',
    headline: 'Sou psicanalista. Tenho 100 mil seguidores. E 200 mulheres esperando por uma vaga na minha agenda.',
    corpo: 'Não virei influencer. Não dancei para câmera. Não abri minha vida pessoal.\nAprendi a me comunicar com precisão sobre o meu trabalho.\nE quando fiz isso, o Instagram virou a principal fonte de clientes da minha clínica.',
  },
  {
    numero: 6,
    layout: 'texto',
    tag: '',
    headline: 'A colega que você admira no Instagram não é melhor profissional do que você.',
    corpo: 'Ela aprendeu uma coisa que você ainda não aprendeu:\ncomo fazer com que o texto que ela escreve faça alguém sentir que foi descrita.\nQuando você aprende isso, a agenda muda.',
  },
  {
    numero: 7,
    layout: 'imagem',
    tag: 'a mentoria',
    headline: 'Mentoria de posicionamento digital para psicólogas, médicas e terapeutas.',
    corpo: 'Grupo pequeno. Acompanhamento próximo. Resultado real.',
    imagemPrompt: 'Cinematic photograph, a woman forearm resting on a desk, holding a white ceramic mug, in the background slightly out of focus a monitor showing a calendar with every slot filled in, bookshelves with psychology and medical books, warm afternoon light, sage green and warm beige tones, no faces, no text, depth of field, professional editorial style, portrait 4:5 format, highly detailed'
  },
  {
    numero: 8,
    layout: 'texto',
    tag: 'Grupo VIP',
    headline: 'Antes de abrir para todo mundo, vou abrir para poucas.',
    corpo: 'O Grupo VIP é a lista de espera exclusiva da minha mentoria.\nQuem está lá sabe antes de qualquer divulgação, tem condições especiais e garante a vaga antes de qualquer anúncio.\nAs últimas turmas fecharam antes de sair do VIP.',
  },
  {
    numero: 9,
    layout: 'texto',
    tag: '',
    headline: 'Você não precisa virar influencer. Você precisa ser encontrada por quem já está te procurando.',
    corpo: 'Existe uma mulher agora, neste momento, digitando no Instagram algo que descreve exatamente o que você trata.\nEla quer marcar uma consulta. Ela está pronta para pagar.\nA pergunta não é se ela existe. É se o seu perfil está no caminho dela.',
  },
  {
    numero: 10,
    layout: 'texto',
    tag: 'lista de espera VIP',
    headline: 'Entre para o Grupo VIP.',
    corpo: 'Clique no link da bio e reserve o seu lugar na lista de espera.\nAs vagas da próxima turma saem primeiro para quem está aqui.\nDecida agora.',
    nota: '@thais_ayumi — Link na bio.'
  }
];

const LEGENDA = `Quinta-feira à noite. Você abre o Instagram para postar. E fecha sem ter postado nada.

Não porque você não tem o que dizer. Você tem mais do que qualquer pessoa que você segue. É porque ninguém te ensinou como dizer de um jeito que faz alguém parar e pensar: "é exatamente isso que eu preciso."

Existe uma paciente agora, neste momento, pesquisando no Instagram alguém exatamente como você. Ela está pronta para marcar uma consulta. A pergunta é: o seu perfil está no caminho dela?

Se você já fechou o Instagram sem postar nada e foi dormir com aquela sensação de que ficou pra trás, esse carrossel é pra você. Marca uma colega que merecia ter uma agenda cheia e ainda não entendeu por que não tem.

Grupo VIP aberto. Link na bio.

#psicologadigital #posicionamentodigital #terapeutadigital #psicanalista #marketingparasaude #agendacheia #psicologaempreendedora #medicaempreendedora #mentoriaparaprofissionaisdesaude #posicionamentoonline`;

gerarCarrosselAyumi(SLIDES, 'grupo-vip-v2', LEGENDA).then(() => {
  console.log('\nCarrossel Ayumi v2 finalizado!');
}).catch(console.error);
