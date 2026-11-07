// Raiz do projeto, calculada a partir da localização deste script (js/components.js)
const BASE = new URL("../", document.currentScript.src);

class AppNavbar extends HTMLElement {
  connectedCallback() {
    const links = [
      { texto: "Início", href: "index.html" },
      { texto: "Sobre", href: "html/sobre.html" },
    ];

    const atual = location.pathname;
    const linksHtml = links
      .map(({ texto, href }) => {
        const url = new URL(href, BASE);
        const ativo =
          atual === url.pathname ||
          (href === "index.html" && atual === new URL("./", BASE).pathname)
            ? ' class="ativo"'
            : "";
        return `<a href="${url.href}"${ativo}>${texto}</a>`;
      })
      .join("");

    const xp = sessionStorage.getItem("xp") ?? "0";

    this.innerHTML = `
      <header class="navbar">
        <a class="logo" href="${new URL("index.html", BASE).href}">
          <span class="logo-icon">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="6" x2="10" y1="11" y2="11"/><line x1="8" x2="8" y1="9" y2="13"/><line x1="15" x2="15.01" y1="12" y2="12"/><line x1="18" x2="18.01" y1="10" y2="10"/><path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z"/></svg>
          </span>
          <span class="logo-texto">Agile Quest</span>
        </a>
        <nav>${linksHtml}</nav>
        <div class="xp-badge">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526"/><circle cx="12" cy="8" r="6"/></svg>
          <strong><span id="xp">${xp}</span> XP</strong>
        </div>
      </header>`;
  }
}

customElements.define("app-navbar", AppNavbar);
