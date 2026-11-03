document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("nome");
  const btn = document.getElementById("btn");
  const mensagem = document.getElementById("mensagem");

  // Ler o valor guardado (funciona em qualquer página)
  const nomeGuardado = sessionStorage.getItem("nome");
  if (mensagem) {
    mensagem.textContent = nomeGuardado
      ? `Olá, ${nomeGuardado}!`
      : "Ainda não guardaste nenhum nome.";
  }

  // Guardar o valor (só existe na página inicial)
  if (btn && input) {
    input.value = nomeGuardado || "";
    btn.addEventListener("click", () => {
      sessionStorage.setItem("nome", input.value.trim());
      mensagem.textContent = `Olá, ${input.value.trim()}! Guardado.`;
    });
  }
});
