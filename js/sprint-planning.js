// US-08 – Sprint Planning: simulador de Planning Poker + mini-quiz

/* ---------- Dados ---------- */
const BARALHO = [0, 1, 2, 3, 5, 8, 13, 20, "?", "☕"];
const NUMEROS = BARALHO.filter((v) => typeof v === "number");
const CAPACIDADE = 13; // velocity média da equipa (story points por Sprint)

const COLEGAS = [
  { nome: "Ana", avatar: "👩‍💻" },
  { nome: "Rui", avatar: "👨‍💻" },
  { nome: "Marta", avatar: "👩‍🔧" },
  { nome: "Tiago", avatar: "🧑‍💻" },
];

const HISTORIAS = [
  {
    id: "US-1",
    texto: "Como cliente, quero ver o menu para escolher o que pedir.",
    ronda1: [2, 3, 2, 3],
  },
  {
    id: "US-2",
    texto: "Como cliente, quero pagar com MB Way para não precisar de dinheiro.",
    ronda1: [3, 13, 8, 5],
    ronda2: [8, 8, 8, 8],
    discussao: {
      baixo: "Já existe uma API do MB Way, é só integrar.",
      alto: "Temos de tratar pagamentos falhados, segurança e testes com o banco.",
    },
  },
  {
    id: "US-3",
    texto: "Como barista, quero ver os pedidos em fila para os preparar por ordem.",
    ronda1: [5, 5, 3, 5],
  },
  {
    id: "US-4",
    texto: "Como cliente, quero acumular pontos de fidelização a cada compra.",
    ronda1: [2, 8, 5, 13],
    ronda2: [8, 8, 8, 8],
    discussao: {
      baixo: "É só um contador de pontos por cliente.",
      alto: "Precisamos de regras de recompensas, histórico e de evitar fraudes.",
    },
  },
  {
    id: "US-5",
    texto: "Como gerente, quero ver relatórios de vendas para decidir o stock.",
    ronda1: [8, 8, 13, 8],
  },
];

const OBJETIVOS = [
  {
    texto: "Permitir que um cliente veja o menu e pague o seu pedido pela app.",
    correto: true,
    feedback: "Boa escolha! É um objetivo único, focado no valor para o cliente, e dá coerência aos itens escolhidos.",
  },
  {
    texto: "Fazer a US-1, a US-2 e a US-3.",
    correto: false,
    feedback: "Isto é só uma lista de tarefas. O Sprint Goal deve explicar porquê a Sprint é valiosa.",
  },
  {
    texto: "Melhorar a app.",
    correto: false,
    feedback: "Demasiado vago: no fim da Sprint ninguém conseguiria dizer se foi cumprido.",
  },
];

const PERGUNTAS = [
  {
    pergunta: "Quais são os resultados da Sprint Planning?",
    opcoes: ["O Product Backlog completo", "O Sprint Goal e o Sprint Backlog", "O relatório de velocity", "O incremento do produto"],
    certa: 1,
    explicacao: "A Sprint Planning produz o Sprint Goal e o Sprint Backlog (itens selecionados + plano).",
  },
  {
    pergunta: "No Planning Poker, porque é que todos revelam as cartas ao mesmo tempo?",
    opcoes: ["Para ser mais rápido", "Porque o Scrum Master assim decide", "Para evitar que as estimativas sejam influenciadas pelas dos outros (ancoragem)", "Para calcular a média automaticamente"],
    certa: 2,
    explicacao: "Revelar em simultâneo evita o efeito de ancoragem: ninguém copia a estimativa do colega mais experiente.",
  },
  {
    pergunta: "Qual é a duração máxima da Sprint Planning para uma Sprint de um mês?",
    opcoes: ["15 minutos", "2 horas", "8 horas", "1 dia e meio"],
    certa: 2,
    explicacao: "Segundo o Scrum Guide, a timebox é de, no máximo, 8 horas para uma Sprint de um mês.",
  },
];

/* ---------- XP e toast ---------- */
function ganharXP(valor, chave) {
  // chave evita ganhar XP repetido pela mesma atividade
  if (chave) {
    if (sessionStorage.getItem(chave)) return false;
    sessionStorage.setItem(chave, "1");
  }
  const total = Number(sessionStorage.getItem("xp") ?? 0) + valor;
  sessionStorage.setItem("xp", String(total));
  const el = document.getElementById("xp");
  if (el) el.textContent = total;
  return true;
}

let toastTimer;
function mostrarToast(texto) {
  const toast = document.getElementById("toast");
  toast.textContent = texto;
  toast.classList.add("visivel");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("visivel"), 3500);
}

/* ---------- Utilitários ---------- */
const indice = (v) => NUMEROS.indexOf(v);

function divergem(votos) {
  const nums = votos.filter((v) => typeof v === "number");
  if (nums.length < 2) return false;
  return indice(Math.max(...nums)) - indice(Math.min(...nums)) > 2;
}

function consenso(votos) {
  // mediana dos votos numéricos, arredondada para cima para uma carta do baralho
  const nums = votos.filter((v) => typeof v === "number").sort((a, b) => a - b);
  const mediana = nums[Math.floor(nums.length / 2)];
  return NUMEROS.find((n) => n >= mediana) ?? mediana;
}

function carta(valor, { escondida = false, extra = "" } = {}) {
  return `<div class="carta ${escondida ? "" : "virada"} ${extra}">
    <div class="carta-face carta-verso" aria-hidden="true">?</div>
    <div class="carta-face carta-frente">${valor ?? ""}</div>
  </div>`;
}

/* ---------- Simulador ---------- */
const sim = document.getElementById("simulador");
const estado = {
  passo: 1,
  historia: 0,
  ronda: 1,
  meuVoto: null,
  revelado: false,
  estimativas: {}, // id -> pontos
  selecionadas: new Set(),
};

function atualizarStepper() {
  document.querySelectorAll(".stepper li").forEach((li) => {
    const n = Number(li.dataset.passo);
    li.classList.toggle("ativo", n === estado.passo);
    li.classList.toggle("feito", n < estado.passo);
    if (n === estado.passo) li.setAttribute("aria-current", "step");
    else li.removeAttribute("aria-current");
  });
}

function render() {
  atualizarStepper();
  if (estado.passo === 1) renderEstimar();
  else if (estado.passo === 2) renderPlanear();
  else if (estado.passo === 3) renderObjetivo();
  else renderFinal();
}

function votosBots(h) {
  return estado.ronda === 2 && h.ronda2 ? h.ronda2 : h.ronda1;
}

function renderEstimar() {
  const h = HISTORIAS[estado.historia];
  const bots = votosBots(h);
  const todos = [...bots, estado.meuVoto];
  const haDivergencia = estado.revelado && estado.ronda === 1 && divergem(todos) && h.ronda2;

  let resultado = "";
  if (estado.revelado) {
    if (haDivergencia) {
      const nums = bots.map((v, i) => ({ v, i }));
      const baixo = nums.reduce((a, b) => (b.v < a.v ? b : a));
      const alto = nums.reduce((a, b) => (b.v > a.v ? b : a));
      resultado = `
        <div class="discussao">
          <h4>💬 As estimativas divergem muito! Hora de discutir.</h4>
          <p><strong>${COLEGAS[baixo.i].avatar} ${COLEGAS[baixo.i].nome} (${baixo.v}):</strong> "${h.discussao.baixo}"</p>
          <p><strong>${COLEGAS[alto.i].avatar} ${COLEGAS[alto.i].nome} (${alto.v}):</strong> "${h.discussao.alto}"</p>
          <button class="btn-sec" data-acao="ronda2">Votar outra vez (2.ª ronda)</button>
        </div>`;
    } else {
      const valor = consenso(todos);
      const meu = typeof estado.meuVoto === "number" ? estado.meuVoto : null;
      const diff = meu !== null && meu !== valor ? ` A tua estimativa foi ${meu}. Se discordas muito, numa equipa real explicarias porquê.` : "";
      resultado = `
        <div class="consenso">
          <h4>✅ Consenso alcançado: <span class="pontos">${valor} pontos</span></h4>
          <p>A equipa usa a mediana das estimativas.${diff}</p>
          <button class="btn-primario btn-pequeno" data-acao="proxima" data-valor="${valor}">
            ${estado.historia < HISTORIAS.length - 1 ? "Próxima história →" : "Ver resumo →"}
          </button>
        </div>`;
    }
  }

  sim.innerHTML = `
    <p class="progresso-hist">História ${estado.historia + 1} de ${HISTORIAS.length}${estado.ronda === 2 ? " · 2.ª ronda" : ""}</p>
    <div class="historia"><span class="tag">${h.id}</span> ${h.texto}</div>

    <div class="mesa">
      ${COLEGAS.map((c, i) => `
        <div class="jogador">
          ${carta(bots[i], { escondida: !estado.revelado })}
          <span>${c.avatar} ${c.nome}</span>
        </div>`).join("")}
      <div class="jogador eu">
        ${carta(estado.meuVoto, { escondida: estado.meuVoto === null })}
        <span>🫵 Tu</span>
      </div>
    </div>

    ${estado.revelado ? "" : `
      <p class="instrucao">Escolhe a tua carta (story points):</p>
      <div class="baralho" role="group" aria-label="Baralho de Planning Poker">
        ${BARALHO.map((v) => `
          <button class="carta-btn" data-voto="${v}" aria-pressed="${estado.meuVoto === v}"
            aria-label="${v === "?" ? "Não sei" : v === "☕" ? "Preciso de uma pausa" : `Carta ${v} pontos`}">${v}</button>`).join("")}
      </div>
      <button class="btn-primario btn-pequeno" data-acao="revelar" ${estado.meuVoto === null ? "disabled" : ""}
        title="Todos revelam ao mesmo tempo para evitar o efeito de ancoragem">Revelar cartas</button>
    `}
    ${resultado}
  `;
}

function renderResumoTabela() {
  return `
    <table class="tabela">
      <thead><tr><th>História</th><th>Pontos</th></tr></thead>
      <tbody>
        ${HISTORIAS.map((h) => `<tr><td><span class="tag">${h.id}</span> ${h.texto}</td><td class="pontos">${estado.estimativas[h.id]}</td></tr>`).join("")}
      </tbody>
    </table>`;
}

function totalSelecionado() {
  return [...estado.selecionadas].reduce((s, id) => s + estado.estimativas[id], 0);
}

function renderPlanear() {
  const total = totalSelecionado();
  const excede = total > CAPACIDADE;
  const pct = Math.min(100, (total / CAPACIDADE) * 100);

  sim.innerHTML = `
    <h3>Product Backlog estimado</h3>
    ${renderResumoTabela()}

    <h3>🎒 Enche a mochila da Sprint</h3>
    <p>Capacidade da equipa: <strong>${CAPACIDADE} pontos</strong> (velocity média das últimas Sprints). Seleciona as histórias que entram no Sprint Backlog.</p>

    <div class="mochila ${excede ? "excede" : ""}">
      <div class="mochila-barra" role="progressbar" aria-valuemin="0" aria-valuemax="${CAPACIDADE}" aria-valuenow="${total}" aria-label="Pontos selecionados">
        <div class="mochila-cheio" style="width:${pct}%"></div>
      </div>
      <span class="mochila-texto">${total} / ${CAPACIDADE} pontos</span>
    </div>
    ${excede ? `<p class="aviso">⚠️ Excedeste a capacidade! Comprometer-se com trabalho a mais leva a Sprints falhadas e horas extra.</p>` : ""}

    <div class="lista-escolha">
      ${HISTORIAS.map((h) => `
        <label class="escolha">
          <input type="checkbox" data-hist="${h.id}" ${estado.selecionadas.has(h.id) ? "checked" : ""}>
          <span><span class="tag">${h.id}</span> ${h.texto}</span>
          <span class="pontos">${estado.estimativas[h.id]} pts</span>
        </label>`).join("")}
    </div>

    <button class="btn-primario btn-pequeno" data-acao="para-objetivo" ${total === 0 || excede ? "disabled" : ""}>Continuar →</button>
  `;
}

function renderObjetivo() {
  sim.innerHTML = `
    <h3>Qual é o melhor Sprint Goal?</h3>
    <p>O Sprint Goal responde ao <strong>porquê</strong> desta Sprint ser valiosa.</p>
    <div class="opcoes" role="group" aria-label="Opções de Sprint Goal">
      ${OBJETIVOS.map((o, i) => `<button class="opcao" data-objetivo="${i}">${o.texto}</button>`).join("")}
    </div>
    <div id="feedback-objetivo"></div>
  `;
}

function renderFinal() {
  const objetivo = OBJETIVOS.find((o) => o.correto).texto;
  const escolhidas = HISTORIAS.filter((h) => estado.selecionadas.has(h.id));
  sim.innerHTML = `
    <div class="resultado-final">
      <h3>🏁 Resultado da tua Sprint Planning</h3>
      <p><strong>Sprint Goal:</strong> ${objetivo}</p>
      <p><strong>Sprint Backlog (${totalSelecionado()} / ${CAPACIDADE} pontos):</strong></p>
      <ul>${escolhidas.map((h) => `<li><span class="tag">${h.id}</span> ${h.texto} <span class="pontos">${estado.estimativas[h.id]} pts</span></li>`).join("")}</ul>
      <p class="nota">Falta ainda o <strong>como</strong>: os Developers dividem cada item em tarefas (normalmente de um dia ou menos).</p>
      <button class="btn-sec" data-acao="recomecar">↻ Recomeçar simulação</button>
    </div>
  `;
  if (ganharXP(25, "us08-simulador")) mostrarToast("🎉 +25 XP · Simulação concluída!");
}

sim.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn || btn.disabled) return;

  if (btn.dataset.voto !== undefined) {
    const v = btn.dataset.voto;
    estado.meuVoto = isNaN(Number(v)) ? v : Number(v);
    render();
    // mantém o foco na carta escolhida (navegação por teclado)
    return sim.querySelector(`[data-voto="${v}"]`)?.focus();
  }

  const h = HISTORIAS[estado.historia];
  switch (btn.dataset.acao) {
    case "revelar":
      estado.revelado = true;
      break;
    case "ronda2":
      estado.ronda = 2;
      estado.revelado = false;
      estado.meuVoto = null;
      break;
    case "proxima":
      estado.estimativas[h.id] = Number(btn.dataset.valor);
      if (estado.ronda === 2 || !h.ronda2) mostrarToast("🤝 Consenso alcançado!");
      estado.historia++;
      estado.ronda = 1;
      estado.revelado = false;
      estado.meuVoto = null;
      if (estado.historia >= HISTORIAS.length) estado.passo = 2;
      break;
    case "para-objetivo":
      estado.passo = 3;
      break;
    case "recomecar":
      Object.assign(estado, { passo: 1, historia: 0, ronda: 1, meuVoto: null, revelado: false, estimativas: {} });
      estado.selecionadas.clear();
      break;
  }

  if (btn.dataset.objetivo !== undefined) {
    const o = OBJETIVOS[Number(btn.dataset.objetivo)];
    const fb = document.getElementById("feedback-objetivo");
    fb.innerHTML = `<p class="${o.correto ? "certo" : "errado"}">${o.correto ? "✅" : "❌"} ${o.feedback}</p>
      ${o.correto ? `<button class="btn-primario btn-pequeno" data-acao="final">Ver resultado →</button>` : ""}`;
    return;
  }
  if (btn.dataset.acao === "final") estado.passo = 4;

  render();
});

sim.addEventListener("change", (e) => {
  const id = e.target.dataset.hist;
  if (!id) return;
  e.target.checked ? estado.selecionadas.add(id) : estado.selecionadas.delete(id);
  render();
  // devolve o foco à checkbox depois de redesenhar
  sim.querySelector(`[data-hist="${id}"]`)?.focus();
});

/* ---------- Quiz ---------- */
const quiz = document.getElementById("quiz");
const quizEstado = { atual: 0, acertos: 0, respondida: false };

function renderQuiz() {
  if (quizEstado.atual >= PERGUNTAS.length) {
    const ganhou = ganharXP(50, "us08-quiz");
    quiz.innerHTML = `
      <div class="resultado-final">
        <h3>${quizEstado.acertos === PERGUNTAS.length ? "🏆" : "📘"} Acertaste ${quizEstado.acertos} de ${PERGUNTAS.length}</h3>
        <p>${ganhou ? "Ganhaste +50 XP e o badge <strong>Mestre do Planning Poker</strong>!" : "Já tinhas ganho o XP deste quiz."}</p>
        <button class="btn-sec" data-quiz="repetir">↻ Repetir quiz</button>
      </div>`;
    if (ganhou) mostrarToast("🏅 Badge desbloqueado: Mestre do Planning Poker (+50 XP)");
    return;
  }
  const p = PERGUNTAS[quizEstado.atual];
  quiz.innerHTML = `
    <p class="progresso-hist">Pergunta ${quizEstado.atual + 1} de ${PERGUNTAS.length}</p>
    <h3>${p.pergunta}</h3>
    <div class="opcoes" role="group" aria-label="Opções de resposta">
      ${p.opcoes.map((o, i) => `<button class="opcao" data-resposta="${i}">${o}</button>`).join("")}
    </div>
    <div id="feedback-quiz"></div>`;
}

quiz.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  if (btn.dataset.quiz === "repetir") {
    Object.assign(quizEstado, { atual: 0, acertos: 0, respondida: false });
    return renderQuiz();
  }
  if (btn.dataset.quiz === "seguinte") {
    quizEstado.atual++;
    quizEstado.respondida = false;
    return renderQuiz();
  }
  if (btn.dataset.resposta !== undefined && !quizEstado.respondida) {
    quizEstado.respondida = true;
    const p = PERGUNTAS[quizEstado.atual];
    const escolha = Number(btn.dataset.resposta);
    const certo = escolha === p.certa;
    if (certo) quizEstado.acertos++;

    quiz.querySelectorAll(".opcao").forEach((b, i) => {
      b.disabled = true;
      if (i === p.certa) b.classList.add("certo");
      else if (i === escolha) b.classList.add("errado");
    });
    document.getElementById("feedback-quiz").innerHTML = `
      <p class="${certo ? "certo" : "errado"}">${certo ? "✅ Certo!" : "❌ Não é bem assim."} ${p.explicacao}</p>
      <button class="btn-primario btn-pequeno" data-quiz="seguinte">${quizEstado.atual < PERGUNTAS.length - 1 ? "Seguinte →" : "Ver resultado →"}</button>`;
    document.querySelector('[data-quiz="seguinte"]').focus();
  }
});

render();
renderQuiz();
