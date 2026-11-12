// Conteúdo educativo de cada etapa (US-07 a US-12).
// Cada entrada de CONTEUDO_ETAPAS é uma função que devolve o HTML interno
// do painel dessa etapa; quando uma etapa ainda não tem conteúdo próprio,
// renderPaineis() (em main.js) usa o placeholder genérico.
const CONTEUDO_ETAPAS = {};
 
// --- Mini-quiz: gerador reutilizável (até 3 perguntas de escolha múltipla) ---
 
function renderMiniQuiz(idPrefix, titulo, perguntas) {
  const linhas = perguntas
    .map(
      (pergunta, indicePergunta) => `
        <li class="quiz-pergunta" data-correta="${pergunta.correta}">
          <p class="quiz-enunciado">${indicePergunta + 1}. ${pergunta.enunciado}</p>
          <ul class="quiz-opcoes">
            ${pergunta.opcoes
              .map(
                (opcao, indiceOpcao) => `
                  <li>
                    <label>
                      <input type="radio" name="${idPrefix}-p${indicePergunta}" value="${indiceOpcao}">
                      ${opcao}
                    </label>
                  </li>`
              )
              .join("")}
          </ul>
          <p class="quiz-feedback" aria-live="polite"></p>
        </li>`
    )
    .join("");
 
  return `
    <div class="mini-quiz" id="quiz-${idPrefix}">
      <h4>🧩 Mini-quiz: ${titulo}</h4>
      <ol class="quiz-perguntas">${linhas}</ol>
      <button type="button" class="quiz-verificar">Verificar respostas</button>
      <p class="quiz-resultado" aria-live="polite"></p>
    </div>`;
}
 
function inicializarMiniQuiz(idPrefix) {
  const quiz = document.getElementById(`quiz-${idPrefix}`);
  if (!quiz || quiz.dataset.inicializado) return;
  quiz.dataset.inicializado = "true";
 
  const botao = quiz.querySelector(".quiz-verificar");
  const resultado = quiz.querySelector(".quiz-resultado");
  const perguntas = quiz.querySelectorAll(".quiz-pergunta");
 
  botao.addEventListener("click", () => {
    let acertos = 0;
    let respondidas = 0;
 
    perguntas.forEach((pergunta) => {
      const correta = pergunta.dataset.correta;
      const selecionada = pergunta.querySelector("input:checked");
      const feedback = pergunta.querySelector(".quiz-feedback");
      const opcaoCorreta = pergunta.querySelector(`input[value="${correta}"]`);
      pergunta.classList.remove("correta", "incorreta");
      pergunta
        .querySelectorAll(".opcao-correta")
        .forEach((el) => el.classList.remove("opcao-correta"));
      feedback.textContent = "";
 
      if (!selecionada) return;
      respondidas += 1;
 
      if (selecionada.value === correta) {
        acertos += 1;
        pergunta.classList.add("correta");
        feedback.textContent = "✅ Certo";
      } else {
        pergunta.classList.add("incorreta");
        feedback.textContent = "❌ Errado — a opção correta está assinalada a verde.";
        opcaoCorreta.closest("label").classList.add("opcao-correta");
      }
    });
 
    if (respondidas < perguntas.length) {
      resultado.textContent = "Responde a todas as perguntas antes de verificar.";
      return;
    }
 
    resultado.textContent = `Acertaste ${acertos} de ${perguntas.length}.`;
  });
}
 
// --- US-07: Release Planning ---
 
CONTEUDO_ETAPAS["release-planning"] = () => `
  <h3>📦 Release Planning</h3>
 
  <div class="etapa-grelha">
    <div class="etapa-cartao">
      <h4>O que é</h4>
      <p>
        A Release Planning é o momento em que a equipa e o Product Owner
        olham para o produto a médio prazo e decidem que valor querem
        entregar nas próximas semanas ou meses, agrupando esse trabalho em
        várias sprints até à próxima entrega relevante ao cliente.
      </p>
    </div>
    <div class="etapa-cartao">
      <h4>Objetivo</h4>
      <p>
        Alinhar todos sobre o rumo do produto: que funcionalidades fazem
        parte da próxima release, por que ordem e com que calendarização
        aproximada, sem entrar no detalhe de implementação de cada sprint.
      </p>
    </div>
    <div class="etapa-cartao">
      <h4>Participantes</h4>
      <p>
        Product Owner (traz a visão e as prioridades), Scrum Master
        (facilita a conversa) e a Equipa de Desenvolvimento (dá a
        perspetiva de esforço e viabilidade técnica). Stakeholders podem
        ser consultados, mas não decidem o plano.
      </p>
    </div>
    <div class="etapa-cartao">
      <h4>Resultados</h4>
      <p>
        Um roadmap ou calendário aproximado da release, com os principais
        marcos de entrega e uma lista de funcionalidades priorizadas —
        uma previsão a rever ao longo do caminho, não um compromisso
        rígido.
      </p>
    </div>
  </div>
 
  <h4>Roadmap ilustrativo</h4>
  <ol class="roadmap">
    <li><span class="roadmap-marco">1</span>Visão &amp; objetivo da release</li>
    <li><span class="roadmap-marco">2</span>Priorização do backlog</li>
    <li><span class="roadmap-marco">3</span>Estimativa de esforço</li>
    <li><span class="roadmap-marco">4</span>Calendarização por sprints</li>
  </ol>
 
  <h4>🎮 Gamificar a Release Planning</h4>
  <ul class="lista-gamificacao">
    <li>
      <strong>Mapa do tesouro:</strong> representar o roadmap como um mapa
      de aventura, em que cada marco de entrega é uma "ilha" a desbloquear.
    </li>
    <li>
      <strong>Leilão de prioridades:</strong> dar à equipa um orçamento
      fictício de "pontos" para "comprar" as funcionalidades que acham
      mais importantes, revelando onde está o verdadeiro consenso.
    </li>
    <li>
      <strong>Apostas de estimativa:</strong> cada elemento aposta
      informalmente quantas sprints vai demorar cada bloco de trabalho,
      antes de se discutir em grupo — torna visíveis os desvios de opinião.
    </li>
  </ul>
 
  ${renderMiniQuiz("release-planning", "Release Planning", [
    {
      enunciado: "Qual é o principal objetivo da Release Planning?",
      opcoes: [
        "Definir o calendário aproximado de entregas de valor ao longo de várias sprints",
        "Detalhar linha a linha o código a escrever na sprint atual",
        "Substituir a necessidade de haver Sprint Planning",
      ],
      correta: 0,
    },
    {
      enunciado: "Quem participa tipicamente na Release Planning?",
      opcoes: [
        "Apenas o Product Owner, sozinho",
        "Product Owner, Scrum Master e Equipa de Desenvolvimento",
        "Só os stakeholders externos ao projeto",
      ],
      correta: 1,
    },
    {
      enunciado: "Qual destes é um resultado típico da Release Planning?",
      opcoes: [
        "O backlog detalhado da sprint atual, pronto para desenvolver",
        "Um relatório financeiro anual da empresa",
        "Um roadmap/calendário aproximado com os principais marcos de entrega",
      ],
      correta: 2,
    },
  ])}
`;
 
// --- Scrum Poker: atividade interativa reutilizável ---
// O utilizador escolhe uma carta (estimativa) para cada item do backlog;
// o total é comparado com a capacidade da equipa, para perceber se o
// conjunto escolhido é realista para a sprint.
 
const CARTAS_SCRUM_POKER = [1, 2, 3, 5, 8, 13, 21, "☕"];
 
function renderScrumPoker(idPrefix, itens, capacidade) {
  const linhasItens = itens
    .map(
      (nome, indice) => `
        <li class="poker-item" data-item="${indice}">
          <p class="poker-item-nome">${nome}</p>
          <div class="poker-cartas">
            ${CARTAS_SCRUM_POKER.map(
              (valor) => `<button type="button" class="poker-carta" data-valor="${valor}">${valor}</button>`
            ).join("")}
          </div>
        </li>`
    )
    .join("");
 
  return `
    <div class="scrum-poker" id="poker-${idPrefix}" data-capacidade="${capacidade}">
      <ul class="poker-itens">${linhasItens}</ul>
      <div class="poker-resumo">
        <p class="poker-total">
          Total estimado: <strong><span class="poker-total-valor">0</span></strong> pontos
          (capacidade da equipa: ${capacidade})
        </p>
        <p class="poker-mensagem" aria-live="polite"></p>
        <button type="button" class="poker-repor">Repor votos</button>
      </div>
    </div>`;
}
 
function inicializarScrumPoker(idPrefix) {
  const poker = document.getElementById(`poker-${idPrefix}`);
  if (!poker || poker.dataset.inicializado) return;
  poker.dataset.inicializado = "true";
 
  const capacidade = Number(poker.dataset.capacidade);
  const valores = {}; // indice do item -> valor numérico escolhido
 
  const totalValorEl = poker.querySelector(".poker-total-valor");
  const mensagemEl = poker.querySelector(".poker-mensagem");
 
  function recalcular() {
    const total = Object.values(valores).reduce((soma, v) => soma + v, 0);
    totalValorEl.textContent = total;
 
    if (Object.keys(valores).length === 0) {
      mensagemEl.textContent = "";
    } else if (total <= capacidade) {
      mensagemEl.textContent = "✅ Cabe confortavelmente na sprint.";
    } else {
      mensagemEl.textContent =
        "⚠️ Ultrapassa a capacidade da equipa — considera deixar algum item para a sprint seguinte.";
    }
  }
 
  poker.querySelectorAll(".poker-item").forEach((item) => {
    const indice = item.dataset.item;
 
    item.querySelectorAll(".poker-carta").forEach((carta) => {
      carta.addEventListener("click", () => {
        item
          .querySelectorAll(".poker-carta")
          .forEach((c) => c.classList.remove("selecionada"));
        carta.classList.add("selecionada");
 
        const valorNumerico = Number(carta.dataset.valor);
        // a carta "☕" (pausa para discutir) não entra na soma
        valores[indice] = Number.isNaN(valorNumerico) ? 0 : valorNumerico;
        recalcular();
      });
    });
  });
 
  poker.querySelector(".poker-repor").addEventListener("click", () => {
    Object.keys(valores).forEach((indice) => delete valores[indice]);
    poker
      .querySelectorAll(".poker-carta.selecionada")
      .forEach((carta) => carta.classList.remove("selecionada"));
    recalcular();
  });
}
 
// --- US-08: Sprint Planning ---
 
CONTEUDO_ETAPAS["sprint-planning"] = () => `
  <h3>🏃 Sprint Planning</h3>
 
  <div class="etapa-grelha">
    <div class="etapa-cartao">
      <h4>O que é</h4>
      <p>
        A Sprint Planning é o evento que abre cada sprint: a equipa olha
        para o topo do Product Backlog e decide o que vai fazer e como vai
        fazê-lo durante o período da sprint.
      </p>
    </div>
    <div class="etapa-cartao">
      <h4>Objetivo</h4>
      <p>
        Definir o <strong>Sprint Goal</strong> (o porquê da sprint) e
        construir o <strong>Sprint Backlog</strong> — os itens
        selecionados do Product Backlog, já com um plano inicial para os
        entregar.
      </p>
    </div>
    <div class="etapa-cartao">
      <h4>Participantes</h4>
      <p>
        Product Owner (apresenta e esclarece os itens prioritários),
        Scrum Master (facilita o evento) e a Equipa de Desenvolvimento
        (estima o esforço e decide o que consegue comprometer-se a
        entregar).
      </p>
    </div>
    <div class="etapa-cartao">
      <h4>Resultados</h4>
      <p>
        Um Sprint Goal claro e um Sprint Backlog com os itens
        selecionados, prontos para a equipa começar a trabalhar.
      </p>
    </div>
  </div>
 
  <h4>🃏 Scrum Poker: estima o esforço</h4>
  <p>
    Escolhe uma carta para cada item do Product Backlog abaixo. A carta
    "☕" representa "preciso de discutir mais antes de estimar" — não entra
    na soma. No fim, compara o total com a capacidade da equipa para
    perceberes se o conjunto de itens é realista para a sprint.
  </p>
 
  ${renderScrumPoker(
    "sprint-planning",
    [
      "Login de utilizador",
      "Pesquisa de produtos",
      "Carrinho de compras",
      "Notificações por email",
      "Página de perfil",
    ],
    20
  )}
 
  <h4>🎮 Gamificar a Sprint Planning</h4>
  <ul class="lista-gamificacao">
    <li>
      <strong>Scrum Poker com temporizador:</strong> dá 30 segundos para
      cada pessoa escolher a carta antes de todos revelarem em simultâneo —
      mantém o ritmo e evita que uma opinião influencie as outras.
    </li>
    <li>
      <strong>Cartão coringa "pausa para discutir":</strong> torna visível,
      em qualquer altura, quando alguém sente que falta informação para
      estimar com confiança.
    </li>
    <li>
      <strong>Barómetro de confiança:</strong> depois de fechado o Sprint
      Goal, cada elemento vota de 1 a 5 o quão confiante está em alcançá-lo
      — torna riscos visíveis logo no início da sprint.
    </li>
  </ul>
 
  ${renderMiniQuiz("sprint-planning", "Sprint Planning", [
    {
      enunciado: "O que é definido durante a Sprint Planning?",
      opcoes: [
        "O roadmap da próxima release",
        "O Sprint Goal e o Sprint Backlog",
        "As ações da próxima Retrospective",
      ],
      correta: 1,
    },
    {
      enunciado: "No Scrum Poker, para que servem as cartas?",
      opcoes: [
        "Para estimar o esforço relativo de cada item do backlog",
        "Para votar na permanência do Product Owner",
        "Para decidir a duração da sprint",
      ],
      correta: 0,
    },
    {
      enunciado:
        "Porque é importante comparar a soma das estimativas com a capacidade da equipa?",
      opcoes: [
        "Para calcular o orçamento do projeto",
        "Para decidir o preço de venda do produto",
        "Para perceber se os itens escolhidos são realistas para a sprint",
      ],
      correta: 2,
    },
  ])}
`;
 
// --- US-09: Daily Scrum ---
// Critérios de aceitação cumpridos nesta entrada:
//  (a) explica 5 pontos, cada um com subtítulo: conceito, objetivo,
//      participantes, duração (15 minutos) e resultado;
//  (b) inclui uma infografia (com legenda/título) sobre a Daily Scrum;
//  (c) inclui um mini-quiz opcional com um máximo de 3 perguntas;
//  (d) inclui uma secção "Gamificação" própria.
 
CONTEUDO_ETAPAS["daily-scrum"] = () => `
  <h3>🌀 Daily Scrum</h3>
 
  <div class="etapa-grelha">
    <div class="etapa-cartao">
      <h4>Conceito</h4>
      <p>
        A Daily Scrum é um evento diário, com duração fixa (timebox), em que
        a Equipa de Desenvolvimento inspeciona o progresso em direção ao
        Sprint Goal e ajusta o Sprint Backlog para o dia seguinte, se
        necessário.
      </p>
    </div>
    <div class="etapa-cartao">
      <h4>Objetivo</h4>
      <p>
        Sincronizar a equipa: cada elemento partilha o que fez, o que vai
        fazer e que impedimentos encontra, para identificar obstáculos cedo
        e ajustar o plano de trabalho do dia.
      </p>
    </div>
    <div class="etapa-cartao">
      <h4>Participantes</h4>
      <p>
        A Equipa de Desenvolvimento conduz o evento; o Scrum Master garante
        que acontece e se mantém dentro do tempo; o Product Owner pode
        assistir, mas normalmente não participa ativamente.
      </p>
    </div>
    <div class="etapa-cartao">
      <h4>Duração</h4>
      <p>
        15 minutos, timeboxed — independentemente do tamanho da equipa, o
        evento não deve ultrapassar este limite.
      </p>
    </div>
    <div class="etapa-cartao">
      <h4>Resultado</h4>
      <p>
        Um plano atualizado para as próximas 24 horas e os impedimentos
        identificados, que o Scrum Master ou a equipa tratam de resolver
        fora do evento.
      </p>
    </div>
  </div>
 
  <figure class="etapa-infografia">
    <div class="infografia-relogio" aria-hidden="true">⏱️<br><strong>15 min</strong></div>
    <ol class="infografia-passos">
      <li>
        <span class="infografia-icone" aria-hidden="true">📋</span>
        <strong>O que fiz ontem?</strong>
        <p>Para ajudar a equipa a progredir em direção ao Sprint Goal.</p>
      </li>
      <li>
        <span class="infografia-icone" aria-hidden="true">🎯</span>
        <strong>O que vou fazer hoje?</strong>
        <p>Para ajudar a equipa a progredir em direção ao Sprint Goal.</p>
      </li>
      <li>
        <span class="infografia-icone" aria-hidden="true">🚧</span>
        <strong>Tenho algum impedimento?</strong>
        <p>Algo que me impeça, a mim ou à equipa, de alcançar o Sprint Goal.</p>
      </li>
    </ol>
    <figcaption>
      Os três pilares da Daily Scrum — respondidos por cada elemento da
      equipa, em conjunto, em até 15 minutos.
    </figcaption>
  </figure>
 
  <h4>🎮 Gamificar a Daily Scrum</h4>
  <ul class="lista-gamificacao">
    <li>
      <strong>Bastão da palavra:</strong> um objeto (ou emoji, numa versão
      digital) passa de pessoa a pessoa — só quem o tem pode falar, o que
      mantém o ritmo e evita interrupções.
    </li>
    <li>
      <strong>Cronómetro visível:</strong> uma barra de progresso dos 15
      minutos, que muda de cor (verde → amarelo → vermelho) à medida que o
      tempo passa, para tornar o timebox visível a todos.
    </li>
    <li>
      <strong>Selo "sem impedimentos escondidos":</strong> reconhecer quem
      reporta impedimentos cedo e com clareza — o incentivo é relatar
      bloqueios depressa, nunca escondê-los para "parecer bem".
    </li>
  </ul>
 
  ${renderMiniQuiz("daily-scrum", "Daily Scrum", [
    {
      enunciado: "Qual é a duração máxima da Daily Scrum?",
      opcoes: ["15 minutos", "30 minutos", "1 hora"],
      correta: 0,
    },
    {
      enunciado: "Quem conduz a Daily Scrum?",
      opcoes: [
        "O Product Owner",
        "A Equipa de Desenvolvimento",
        "Apenas os stakeholders",
      ],
      correta: 1,
    },
    {
      enunciado: "Qual é o principal objetivo da Daily Scrum?",
      opcoes: [
        "Sincronizar a equipa e identificar impedimentos cedo",
        "Fazer a revisão do incremento com os stakeholders",
        "Definir todo o Sprint Backlog a partir do zero",
      ],
      correta: 0,
    },
  ])}
`;
 
// --- US-11: Sprint Review ---
 
CONTEUDO_ETAPAS["sprint-review"] = () => `
  <h3>🔍 Sprint Review</h3>
 
  <div class="etapa-grelha">
    <div class="etapa-cartao">
      <h4>Conceito</h4>
      <p>
        Sprint Review é um dos últimos eventos da sprint, 
        em que a equipa apresenta o Incremento concluído
        aos stakeholders e todos avaliam o que foi entregue.
      </p>
    </div>
    <div class="etapa-cartao">
      <h4>Objetivo</h4>
      <p>
        Recolher feedback sobre o Incremento e decidir, em conjunto, como
        adaptar o Product Backlog. Não é uma simples apresentação: é uma
        sessão de trabalho colaborativa.
      </p>
    </div>
    <div class="etapa-cartao">
      <h4>Participantes</h4>
      <p>
        A Scrum Team (Product Owner, Scrum Master e Equipa de
        Desenvolvimento) e os stakeholders convidados, que dão feedback
        sobre o que veem.
      </p>
    </div>
    <div class="etapa-cartao">
      <h4>Duração</h4>
      <p>
        No máximo 4 horas para uma sprint de um mês; nas sprints mais
        curtas, o evento é proporcionalmente mais curto.
      </p>
    </div>
    <div class="etapa-cartao">
      <h4>Resultado</h4>
      <p>
        Um Product Backlog revisto e atualizado, com o feedback dos
        stakeholders incorporado e, se necessário, uma previsão ajustada
        para as próximas sprints.
      </p>
    </div>
  </div>
 
  <figure class="etapa-infografia">
    <div class="infografia-relogio" aria-hidden="true">🔍<br><strong>Review</strong></div>
    <ol class="infografia-passos">
      <li>
        <span class="infografia-icone" aria-hidden="true">🖥️</span>
        <strong>Demonstrar o Incremento</strong>
        <p>A equipa mostra o que ficou concluído (Done) na sprint.</p>
      </li>
      <li>
        <span class="infografia-icone" aria-hidden="true">💬</span>
        <strong>Recolher feedback</strong>
        <p>Os stakeholders comentam, questionam e sugerem melhorias.</p>
      </li>
      <li>
        <span class="infografia-icone" aria-hidden="true">🔄</span>
        <strong>Adaptar o Product Backlog</strong>
        <p>O Product Owner reordena e ajusta os itens com base no que aprendeu.</p>
      </li>
    </ol>
    <figcaption>
      O ciclo da Sprint Review — mostrar, ouvir e adaptar, para a próxima
      sprint começar com um backlog mais ajustado à realidade.
    </figcaption>
  </figure>
 
  <h4>🎮 Gamificar a Sprint Review</h4>
  <ul class="lista-gamificacao">
    <li>
      <strong>Feira de demonstrações:</strong> cada funcionalidade ganha
      uma "banca" e os stakeholders circulam, experimentam e atribuem
      estrelas (1 a 5) — torna a review mais interativa e menos passiva.
    </li>
    <li>
      <strong>Moedas de feedback:</strong> cada stakeholder recebe um
      número limitado de moedas fictícias para "investir" nas
      funcionalidades que querem ver evoluir — revela as verdadeiras
      prioridades para o Product Backlog.
    </li>
    <li>
      <strong>Quadro de conquistas:</strong> as funcionalidades concluídas
      e o Sprint Goal alcançado são celebrados como "conquistas
      desbloqueadas", reforçando a motivação da equipa.
    </li>
  </ul>
 
  ${renderMiniQuiz("sprint-review", "Sprint Review", [
    {
      enunciado: "Qual é o principal objetivo da Sprint Review?",
      opcoes: [
        "Inspecionar o Incremento e recolher feedback para adaptar o Product Backlog",
        "Avaliar o desempenho individual de cada elemento da equipa",
        "Planear em detalhe a sprint seguinte",
      ],
      correta: 0,
    },
    {
      enunciado: "Quem participa na Sprint Review?",
      opcoes: [
        "Apenas a Equipa de Desenvolvimento",
        "A Scrum Team e os stakeholders convidados",
        "Só o Scrum Master e o Product Owner",
      ],
      correta: 1,
    },
    {
      enunciado: "Qual é um resultado típico da Sprint Review?",
      opcoes: [
        "A lista de melhorias de processo para a próxima sprint",
        "O Sprint Backlog da sprint seguinte",
        "Um Product Backlog atualizado com base no feedback recebido",
      ],
      correta: 2,
    },
  ])}
`;
 
// --- Pop-ups "saber mais": termos destacados que abrem uma caixa com a definição ---
// Uso: renderTermo("chave", "texto visível") dentro do HTML de uma etapa.
// A definição de cada termo vive em TERMOS_POPUP.
 
const TERMOS_POPUP = {
  "sprint-backlog": {
    titulo: "Sprint Backlog",
    texto:
      "É a lista de itens do Product Backlog escolhidos para a sprint, mais o plano da equipa para os entregar. Pertence à Equipa de Desenvolvimento e vai sendo atualizado durante a sprint.",
  },
  "daily-scrum": {
    titulo: "Daily Scrum",
    texto:
      "Reunião diária de 15 minutos em que a Equipa de Desenvolvimento verifica o progresso rumo ao Sprint Goal e ajusta o plano para as próximas 24 horas.",
  },
  incremento: {
    titulo: "Incremento",
    texto:
      "É um passo concreto rumo ao Sprint Goal. Cada incremento soma-se a todos os anteriores e tem de estar utilizável, mesmo que o Product Owner decida não o lançar logo.",
  },
  "definition-of-done": {
    titulo: "Definition of Done",
    texto:
      "Descrição formal, acordada pela equipa, do que tem de ser verdade para um item se poder considerar concluído. Se um item não cumpre a Definition of Done, não é um incremento e volta ao Product Backlog.",
  },
};
 
function renderTermo(chave, texto) {
  return `<button type="button" class="termo" data-termo="${chave}">${texto}</button>`;
}
 
function inicializarPopups() {
  if (document.body.dataset.popupsInicializados) return;
  document.body.dataset.popupsInicializados = "true";
 
  const dialogo = document.createElement("dialog");
  dialogo.className = "popup-termo";
  dialogo.setAttribute("aria-labelledby", "popup-termo-titulo");
  dialogo.innerHTML = `
    <h4 id="popup-termo-titulo"></h4>
    <p class="popup-termo-texto"></p>
    <button type="button" class="popup-termo-fechar">Fechar</button>`;
  document.body.appendChild(dialogo);
 
  const tituloEl = dialogo.querySelector("#popup-termo-titulo");
  const textoEl = dialogo.querySelector(".popup-termo-texto");
 
  dialogo
    .querySelector(".popup-termo-fechar")
    .addEventListener("click", () => dialogo.close());
  // clicar fora da caixa também fecha
  dialogo.addEventListener("click", (evento) => {
    if (evento.target === dialogo) dialogo.close();
  });
 
  document.addEventListener("click", (evento) => {
    const botao = evento.target.closest(".termo");
    if (!botao) return;
    const termo = TERMOS_POPUP[botao.dataset.termo];
    if (!termo) return;
    tituloEl.textContent = termo.titulo;
    textoEl.textContent = termo.texto;
    dialogo.showModal();
  });
}
 
// --- US-10: Development ---
 
CONTEUDO_ETAPAS["development"] = () => `
  <h3>💻 Development</h3>
 
  <div class="etapa-grelha">
    <div class="etapa-cartao">
      <h4>Desenvolvimento durante a Sprint</h4>
      <p>
        Depois da Sprint Planning, a equipa trabalha nos itens do
        ${renderTermo("sprint-backlog", "Sprint Backlog")} até ao fim da
        sprint. Não há um "chefe" que distribui tarefas: a equipa
        organiza-se sozinha e sincroniza-se na
        ${renderTermo("daily-scrum", "Daily Scrum")}.
      </p>
    </div>
    <div class="etapa-cartao">
      <h4>Incremento</h4>
      <p>
        O ${renderTermo("incremento", "Incremento")} é o resultado utilizável
        da sprint: a soma de todos os itens concluídos, juntamente com os
        incrementos das sprints anteriores. Funciona, está integrado e
        pode ser mostrado ao cliente.
      </p>
    </div>
    <div class="etapa-cartao">
      <h4>Definition of Done</h4>
      <p>
        A ${renderTermo("definition-of-done", "Definition of Done")} é a
        lista que a equipa acorda para saber quando um item está mesmo
        pronto. Um item só conta para o Incremento se cumprir todos os
        pontos dessa lista.
      </p>
    </div>
  </div>
 
  <h4>📊 Infografia: da tarefa ao Incremento</h4>
  <figure class="infografia-dod">
    <div class="dod-fluxo">
      <div class="dod-passo">
        <span class="dod-passo-icone" aria-hidden="true">📝</span>
        <strong>Item do Sprint Backlog</strong>
        <span>Ex.: "Criar o footer da página"</span>
      </div>
      <span class="dod-seta" aria-hidden="true">➜</span>
      <div class="dod-passo dod-passo-checklist">
        <span class="dod-passo-icone" aria-hidden="true">✅</span>
        <strong>Definition of Done</strong>
        <ul class="dod-lista">
          <li>Código revisto por outro membro</li>
          <li>Testado no browser (telemóvel e computador)</li>
          <li>Integrado no ramo <code>dev</code></li>
          <li>Publicado no Netlify</li>
          <li>Critérios de aceitação cumpridos</li>
        </ul>
      </div>
      <span class="dod-seta" aria-hidden="true">➜</span>
      <div class="dod-passo dod-passo-resultado">
        <span class="dod-passo-icone" aria-hidden="true">🎁</span>
        <strong>Incremento</strong>
        <span>Parte do produto, pronta a mostrar na Sprint Review</span>
      </div>
    </div>
    <figcaption>
      Um item só entra no Incremento depois de cumprir todos os pontos da
      Definition of Done. Se falhar um só ponto, volta ao Product Backlog.
    </figcaption>
  </figure>
 
  <h4>🎮 Gamificar o desenvolvimento</h4>
  <ul class="lista-gamificacao">
    <li>
      <strong>Checklist de selos:</strong> cada ponto da Definition of Done
      dá um selo; um item só fica "dourado" quando reúne todos os selos —
      torna o conceito de "concluído" visível e partilhado.
    </li>
    <li>
      <strong>Quadro de missões:</strong> apresentar o Sprint Backlog como
      um quadro de missões (a fazer, em curso, concluída), onde a equipa
      avança as cartas em conjunto.
    </li>
    <li>
      <strong>Barra de progresso do Sprint Goal:</strong> uma barra que
      enche à medida que os itens passam a "Done", para a equipa ver
      quanto falta, sem competição entre pessoas.
    </li>
  </ul>
 
  ${renderMiniQuiz("development", "Development", [
    {
      enunciado: "O que é o Incremento?",
      opcoes: [
        "A lista de tarefas ainda por fazer na sprint",
        "O resultado utilizável da sprint, que soma os itens concluídos",
        "O relatório que o Scrum Master entrega no fim da sprint",
      ],
      correta: 1,
    },
    {
      enunciado: "Quando é que um item pode ser considerado concluído?",
      opcoes: [
        "Quando o developer acha que acabou o seu código",
        "Quando o Product Owner tem pressa de o ter",
        "Quando cumpre todos os pontos da Definition of Done",
      ],
      correta: 2,
    },
    {
      enunciado: "O que acontece a um item que não cumpre a Definition of Done?",
      opcoes: [
        "Volta ao Product Backlog e não entra no Incremento",
        "Entra no Incremento com um aviso",
        "É apagado do projeto",
      ],
      correta: 0,
    },
  ])}
`;
 
// Depois de os painéis serem inseridos no DOM (ver main.js), inicializa os
// mini-quizzes e atividades interativas das etapas que já têm conteúdo
// próprio.
function inicializarConteudoEtapas() {
  Object.keys(CONTEUDO_ETAPAS).forEach((id) => inicializarMiniQuiz(id));
  inicializarScrumPoker("sprint-planning");
  inicializarPopups();
}
 