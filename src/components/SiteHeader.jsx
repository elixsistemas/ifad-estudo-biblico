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

  // carrega tema salvo
  React.useEffect(() => {
    if (typeof document !== "undefined") {
      const saved = localStorage.getItem("theme");
      if (saved) setTheme(saved);
    }
  }, []);

  // aplica tema
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

  // ao mudar para desktop, fecha dropdown
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const onResize = () => {
      if (window.innerWidth >= 769) setMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const ThemeButton = ({ className = "" }) => (
    <button
      className={`theme-switch ${className}`}
      onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
      aria-label="Alternar tema claro/escuro"
      type="button"
    >
      {theme === "dark" ? "🌙 Escuro" : "☀️ Claro"}
    </button>
  );

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="site-header">
      <div className="site-header__inner">
        {/* Topbar centralizada (logo no centro; ações à direita) */}
        <div className="topbar">
          <div aria-hidden /> {/* coluna esquerda vazia do grid */}

          <Link
            to="/"
            className="brand"
            aria-label="Página inicial"
            onClick={closeMenu}
          >
            <StaticImage
              src="../images/logo.png"
              alt="IFAD"
              height={36}
              placeholder="blurred"
            />
            <strong className="brand__title">Estudo Bíblico IFAD</strong>
          </Link>

          <div className="topbar__actions">
            {/* Tema no topo (desktop) */}
            <ThemeButton className="theme-switch--top" />
            <button
              className="nav-toggle"
              aria-expanded={menuOpen}
              aria-controls="main-nav"
              onClick={() => setMenuOpen((v) => !v)}
              type="button"
            >
              ☰ Menu
            </button>
          </div>
        </div>

        {/* Navegação em pílulas (desktop); dropdown (mobile) */}
        <nav
          id="main-nav"
          className={`mainnav ${menuOpen ? "is-open" : ""}`}
          aria-label="Navegação principal"
          aria-hidden={!menuOpen && typeof window !== "undefined" && window.innerWidth < 769}
        >
          <div className="mainnav__row">
            <Link activeClassName="is-active" to="/plano" onClick={closeMenu}>
              Plano Anual
            </Link>
            <Link activeClassName="is-active" to="/app/reader" onClick={closeMenu}>
              Leitura
            </Link>
            <Link activeClassName="is-active" to="/app/busca" onClick={closeMenu}>
              Busca
            </Link>
            <Link activeClassName="is-active" to="/criar-imagem" onClick={closeMenu}>
              Criar Imagem
            </Link>
            <Link activeClassName="is-active" to="/devocionais/" onClick={closeMenu}>
              Devocionais
            </Link>
            <Link activeClassName="is-active" to="/pedido-oracao" onClick={closeMenu}>
              Pedido de Oração
            </Link>
            <Link activeClassName="is-active" to="/contato" onClick={closeMenu}>
              Contato
            </Link>
            <Link activeClassName="is-active" to="/sobre" onClick={closeMenu}>
              Sobre a IFAD
            </Link>

            {/* Tema dentro do menu somente no mobile (CSS oculta no desktop) */}
            <div className="theme-slot-mobile">
              <ThemeButton />
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
