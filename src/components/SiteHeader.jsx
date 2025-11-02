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

  const closeMenu = () => setMenuOpen(false);

  // Fechar com ESC quando aberto (acessibilidade)
  React.useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e) => { if (e.key === "Escape") setMenuOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <header className="header">
      <div className="container header-wrap">
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

        <nav
          id="mainmenu"
          className={`nav-row ${menuOpen ? "is-open" : ""}`}
          aria-label="Navegação principal"
        >
          <ul className="nav-list">
            <li><Link activeClassName="is-active" to="/plano" onClick={closeMenu}>Plano Anual</Link></li>
            <li><Link activeClassName="is-active" to="/app/reader" onClick={closeMenu}>Leitura</Link></li>
            <li><Link activeClassName="is-active" to="/devocionais/" onClick={closeMenu}>Devocionais</Link></li>
            <li><Link activeClassName="is-active" to="/app/busca" onClick={closeMenu}>Busca</Link></li>
            <li><Link activeClassName="is-active" to="/pedido-oracao" onClick={closeMenu}>Pedido de Oração</Link></li>
            <li><Link activeClassName="is-active" to="/criar-imagem" onClick={closeMenu}>Criar Imagem</Link></li>
            <li><Link activeClassName="is-active" to="/contato" onClick={closeMenu}>Contato</Link></li>
            <li><Link activeClassName="is-active" to="/sobre" onClick={closeMenu}>Sobre a IFAD</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
