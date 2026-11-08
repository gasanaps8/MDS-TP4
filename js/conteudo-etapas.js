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
      pergunta.classList.remove("correta", "incorreta");

      if (!selecionada) return;
      respondidas += 1;

      if (selecionada.value === correta) {
        acertos += 1;
        pergunta.classList.add("correta");
      } else {
        pergunta.classList.add("incorreta");
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

// Depois de os painéis serem inseridos no DOM (ver main.js), inicializa os
// mini-quizzes das etapas que já têm conteúdo próprio.
function inicializarConteudoEtapas() {
  Object.keys(CONTEUDO_ETAPAS).forEach((id) => inicializarMiniQuiz(id));
}
