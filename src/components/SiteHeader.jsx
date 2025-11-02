import * as React from "react";
import { Link } from "gatsby";
import { StaticImage } from "gatsby-plugin-image";

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [theme, setTheme] = React.useState(
    typeof document !== "undefined"
      ? document.documentElement.getAttribute("data-theme") || "dark"
      : "dark"
  );

  React.useEffect(() => {
    if (typeof document !== "undefined") {
      const saved = localStorage.getItem("theme");
      if (saved) setTheme(saved);
    }
  }, []);

  React.useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", theme);
      localStorage.setItem("theme", theme);
    }
  }, [theme]);

  // fecha o menu ao navegar
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="header">
      <div className="container header-wrap">
        {/* Linha 1: marca centralizada + switches */}
        <div className="brand-row">
          <Link to="/" className="brand" onClick={closeMenu}>
            <StaticImage
              src="../images/logo.png"
              alt="IFAD"
              height={44}
              placeholder="blurred"
              className="brand-logo"
            />
            <div className="brand-text">
              <strong className="brand-bottom">Estudo Bíblico IFAD</strong>
            </div>
          </Link>

          <div className="header-actions">
            {/* Toggle mobile (visível só no mobile via CSS) */}
            <button
              className="nav-toggle"
              aria-expanded={menuOpen}
              aria-controls="mainmenu"
              onClick={() => setMenuOpen(v => !v)}
            >
              ☰ Menu
            </button>

            <button
              className="theme-switch"
              onClick={() => setTheme(t => (t === "dark" ? "light" : "dark"))}
              aria-label="Alternar tema claro/escuro"
            >
              {theme === "dark" ? "🌙 Escuro" : "☀️ Claro"}
            </button>
          </div>
        </div>

        {/* Linha 2: nav em pílulas; no mobile aparece só quando aberto */}
        <nav
          id="mainmenu"
          className={`nav-row ${menuOpen ? "is-open" : ""}`}
          aria-label="Navegação principal"
        >
          <ul className="nav-list" onClick={closeMenu}>
            <li><Link activeClassName="is-active" to="/plano">Plano Anual</Link></li>
            <li><Link activeClassName="is-active" to="/app/reader">Leitura</Link></li>
            <li><Link activeClassName="is-active" to="/devocionais/">Devocionais</Link></li>
            <li><Link activeClassName="is-active" to="/app/busca">Busca</Link></li>
            <li><Link activeClassName="is-active" to="/pedido-oracao">Pedido de Oração</Link></li>
            <li><Link activeClassName="is-active" to="/criar-imagem">Criar Imagem</Link></li>
            <li><Link activeClassName="is-active" to="/contato">Contato</Link></li>
            <li><Link activeClassName="is-active" to="/sobre">Sobre a IFAD</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
