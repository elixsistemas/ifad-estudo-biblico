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

  return (
    <header className="header">
      <div className="container" style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Link to="/" className="brand" style={{display:"inline-flex",alignItems:"center",gap:10}}>
          <StaticImage src="../images/logo.png" alt="IFAD" height={40} placeholder="blurred" />
          <strong>Estudo Bíblico IFAD</strong>
        </Link>

        {/* botão só visível no mobile via CSS */}
        <button
          className="nav-toggle"
          aria-expanded={menuOpen}
          aria-controls="main-nav"
          onClick={() => setMenuOpen(v => !v)}
        >
          ☰ Menu
        </button>

        <nav id="main-nav" className={`right${menuOpen ? " is-open" : ""}`}>
          <Link to="/plano" onClick={() => setMenuOpen(false)}>Plano Anual</Link>
          <Link to="/app/reader" onClick={() => setMenuOpen(false)}>Leitura</Link>
          <Link to="/app/busca" onClick={() => setMenuOpen(false)}>Busca</Link>
          <Link to="/criar-imagem" onClick={() => setMenuOpen(false)}>Criar Imagem</Link>
          <Link to="/devocionais/" onClick={() => setMenuOpen(false)}>Devocionais</Link>
          <Link to="/pedido-oracao" onClick={() => setMenuOpen(false)}>Pedido de Oração</Link>
          <Link to="/contato" onClick={() => setMenuOpen(false)}>Contato</Link>
          <button
            className="theme-switch"
            onClick={() => setTheme(t => (t === "dark" ? "light" : "dark"))}
          >
            {theme === "dark" ? "🌙 Escuro" : "☀️ Claro"}
          </button>
        </nav>
      </div>
    </header>
  );
}
