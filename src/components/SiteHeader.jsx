import * as React from "react";
import { Link } from "gatsby";
import { StaticImage } from "gatsby-plugin-image";

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [theme, setTheme] = React.useState(
    typeof document !== "undefined"
      ? document.documentElement.getAttribute("data-theme") || "light"
      : "light"
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

  // ESC fecha menu
  React.useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e) => e.key === "Escape" && setMenuOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const ThemeButton = ({ className = "" }) => (
    <button
      className={`theme-switch ${className}`}
      onClick={() => setTheme(t => (t === "dark" ? "light" : "dark"))}
      aria-label="Alternar tema claro/escuro"
    >
      {theme === "dark" ? "🌙 Escuro" : "☀️ Claro"}
    </button>
  );

  return (
    <header className="site-header">
      <div className="site-header__inner">
        {/* faixa superior */}
        <div className="topbar">
          <Link to="/" className="brand" aria-label="Página inicial" onClick={() => setMenuOpen(false)}>
            <StaticImage src="../images/logo.png" alt="IFAD" height={36} placeholder="blurred" />
            <strong className="brand__title">Estudo Bíblico IFAD</strong>
          </Link>

          <div className="topbar__actions">
            {/* Tema no topo só em telas >= 769px */}
            <ThemeButton className="theme-switch--top" />
            <button
              className="nav-toggle"
              aria-expanded={menuOpen}
              aria-controls="main-nav"
              onClick={() => setMenuOpen(v => !v)}
            >
              ☰ Menu
            </button>
          </div>
        </div>

        {/* navegação: desktop = linha de pílulas; mobile = drop-down */}
        <nav id="main-nav" className={`mainnav ${menuOpen ? "is-open" : ""}`} aria-label="Navegação principal">
          <div className="mainnav__row">
            <Link activeClassName="is-active" to="/plano" onClick={() => setMenuOpen(false)}>Plano Anual</Link>
            <Link activeClassName="is-active" to="/app/reader" onClick={() => setMenuOpen(false)}>Leitura</Link>
            <Link activeClassName="is-active" to="/app/busca" onClick={() => setMenuOpen(false)}>Busca</Link>
            <Link activeClassName="is-active" to="/criar-imagem" onClick={() => setMenuOpen(false)}>Criar Imagem</Link>
            <Link activeClassName="is-active" to="/devocionais/" onClick={() => setMenuOpen(false)}>Devocionais</Link>
            <Link activeClassName="is-active" to="/pedido-oracao" onClick={() => setMenuOpen(false)}>Pedido de Oração</Link>
            <Link activeClassName="is-active" to="/contato" onClick={() => setMenuOpen(false)}>Contato</Link>
            <Link activeClassName="is-active" to="/sobre" onClick={() => setMenuOpen(false)}>Sobre</Link>

            {/* Tema dentro do menu só no mobile */}
            <div className="theme-slot-mobile">
              <ThemeButton />
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
