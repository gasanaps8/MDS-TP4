// Raiz do projeto, calculada a partir da localização deste script (js/components.js)
// Assim os links funcionam tanto em index.html como em html/*.html
const BASE = new URL("../", document.currentScript.src);

class AppNavbar extends HTMLElement {
  connectedCallback() {
    const links = [
      { texto: "Início", href: "index.html" },
      { texto: "Sobre", href: "html/sobre.html" },
    ];

    const atual = location.pathname;
    const html = links
      .map(({ texto, href }) => {
        const url = new URL(href, BASE);
        const ativo = atual === url.pathname ? ' class="ativo"' : "";
        return `<a href="${url.href}"${ativo}>${texto}</a>`;
      })
      .join("");

    this.innerHTML = `<header><nav>${html}</nav></header>`;
  }
}

class AppFooter extends HTMLElement {
  connectedCallback() {
    const ano = new Date().getFullYear();
    this.innerHTML = `<footer><p>&copy; ${ano}</p></footer>`;
  }
}

customElements.define("app-navbar", AppNavbar);
customElements.define("app-footer", AppFooter);
