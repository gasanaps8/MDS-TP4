// As seis etapas do Scrum, pela ordem definida na US-05.
// "estado" é um de: "concluida" | "atual" | "futura" — reflete o progresso
// da equipa, independente de qual tab está aberta no momento (US-06).
// NOTA: ajusta os estados conforme o progresso real da equipa fica à medida
// que as tabs (US-07 a US-12) forem sendo construídas.
const ETAPAS = [
  { id: "release-planning", nome: "Release Planning", estado: "concluida" },
  { id: "sprint-planning", nome: "Sprint Planning", estado: "atual" },
  { id: "daily-scrum", nome: "Daily Scrum", estado: "futura" },
  { id: "development", nome: "Development", estado: "futura" },
  { id: "sprint-review", nome: "Sprint Review", estado: "futura" },
  { id: "sprint-retrospective", nome: "Sprint Retrospective", estado: "futura" },
];

// Índice (em ETAPAS) da tab atualmente aberta. Começa na etapa marcada
// como "atual", ou na primeira se nenhuma estiver marcada.
let indiceAtivo = Math.max(
  ETAPAS.findIndex((etapa) => etapa.estado === "atual"),
  0
);

// US-05 + US-06: o mapa de progresso É a lista de tabs — cada etapa-btn
// funciona simultaneamente como marcador de progresso (concluída/atual/
// futura) e como tab (role="tab", destaca-se quando é a aberta no momento).
function renderMapaEtapas() {
  const mapa = document.getElementById("mapa-etapas");
  if (!mapa) return;

  mapa.innerHTML = ETAPAS.map(
    (etapa, indice) => `
      <li class="etapa ${etapa.estado}" role="presentation">
        <button
          type="button"
          class="etapa-btn"
          id="tab-${etapa.id}"
          role="tab"
          data-etapa="${etapa.id}"
          aria-controls="painel-${etapa.id}"
          aria-selected="${indice === indiceAtivo}"
          tabindex="${indice === indiceAtivo ? "0" : "-1"}"
        >
          <span class="etapa-numero">${indice + 1}</span>
          <span class="etapa-nome">${etapa.nome}</span>
        </button>
      </li>`
  ).join("");

  mapa.querySelectorAll(".etapa-btn").forEach((botao) => {
    botao.addEventListener("click", () => selecionarEtapa(botao.dataset.etapa));
  });
}

// US-06: um painel de conteúdo por etapa; só o painel ativo fica visível.
// O conteúdo real de cada etapa vive em CONTEUDO_ETAPAS (conteudo-etapas.js,
// US-07 a US-12); enquanto uma etapa não tiver entrada lá, mostra-se um
// placeholder.
function renderPaineis() {
  const paineis = document.getElementById("painel-etapas");
  if (!paineis) return;

  paineis.innerHTML = ETAPAS.map((etapa, indice) => {
    // Nota: CONTEUDO_ETAPAS é "const" (definida em conteudo-etapas.js), por
    // isso não aparece em "window" — tem de se referenciar diretamente.
    const gerarConteudo =
      typeof CONTEUDO_ETAPAS !== "undefined" && CONTEUDO_ETAPAS[etapa.id];
    const corpo = gerarConteudo
      ? gerarConteudo()
      : `<!-- TODO (US-08...US-12): substituir pelo conteúdo real desta etapa -->
         <p>${etapa.nome}: conteúdo desta etapa ainda em construção.</p>`;

    return `
      <div
        class="painel-etapa"
        id="painel-${etapa.id}"
        role="tabpanel"
        aria-labelledby="tab-${etapa.id}"
        ${indice === indiceAtivo ? "" : "hidden"}
      >${corpo}</div>`;
  }).join("");

  if (typeof inicializarConteudoEtapas === "function") inicializarConteudoEtapas();
}

// Atualiza apenas o estado visual (sem reconstruir o HTML todo), para
// alternar de tab de forma leve ao clicar/navegar.
function atualizarEstadoAtivo() {
  const etapaAtiva = ETAPAS[indiceAtivo];

  document.querySelectorAll(".etapa-btn").forEach((botao) => {
    const ativa = botao.dataset.etapa === etapaAtiva.id;
    botao.setAttribute("aria-selected", String(ativa));
    botao.tabIndex = ativa ? 0 : -1;
  });

  document.querySelectorAll(".painel-etapa").forEach((painel) => {
    painel.hidden = painel.id !== `painel-${etapaAtiva.id}`;
  });
}

function selecionarEtapa(id) {
  const indice = ETAPAS.findIndex((etapa) => etapa.id === id);
  if (indice === -1) return;

  indiceAtivo = indice;
  atualizarEstadoAtivo();

  const contentor = document.getElementById("painel-etapas");
  if (contentor) contentor.scrollIntoView({ behavior: "smooth", block: "start" });
}

function etapaSeguinte(delta) {
  const total = ETAPAS.length;
  const novoIndice = (indiceAtivo + delta + total) % total;
  selecionarEtapa(ETAPAS[novoIndice].id);
}

document.addEventListener("DOMContentLoaded", () => {
  renderMapaEtapas();
  renderPaineis();

  const btnAventura = document.getElementById("btn-aventura");
  const secaoEtapas = document.getElementById("etapas");
  const mapa = document.getElementById("mapa-etapas");
  if (btnAventura && secaoEtapas) {
    btnAventura.addEventListener("click", () => {
      secaoEtapas.scrollIntoView({ behavior: "smooth", block: "start" });
      // dá sempre um sinal visual, mesmo que a página já esteja toda visível
      // e o scroll não produza nenhuma mudança percetível
      if (mapa) {
        mapa.classList.remove("destaque");
        // forçar reflow para a animação poder reiniciar se se clicar outra vez
        void mapa.offsetWidth;
        mapa.classList.add("destaque");
      }
    });
  }

  // US-06: navegação por botões "anterior" / "seguinte", além de clicar
  // diretamente numa etapa/tab no mapa de progresso.
  const btnAnterior = document.getElementById("tab-anterior");
  const btnSeguinte = document.getElementById("tab-seguinte");
  if (btnAnterior) btnAnterior.addEventListener("click", () => etapaSeguinte(-1));
  if (btnSeguinte) btnSeguinte.addEventListener("click", () => etapaSeguinte(1));
});
