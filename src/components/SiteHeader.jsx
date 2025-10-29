import * as React from "react";
import { Link } from "gatsby";
import logo from "../images/logo.png";

export default function SiteHeader() {
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
      <div className="container" style={{display:"flex",alignItems:"center",gap:12}}>
        <Link to="/" className="brand" style={{display:"inline-flex",alignItems:"center",gap:10}}>
          <img src={logo} alt="IFAD" />
          <strong>Estudo Bíblico IFAD</strong>
        </Link>
        <nav className="right">
          <Link to="/plano">Plano Anual</Link>
          <Link to="/app/reader">Leitura</Link>
          <Link to="/app/busca">Busca</Link>
          <Link to="/criar-imagem">Criar imagem</Link>
          <Link to="/pedido-oracao">Pedido de Oração</Link>
          <Link to="/contato">Contato</Link>
          <button className="theme-switch" onClick={() => setTheme(t=>t==="dark"?"light":"dark")}>
            {theme==="dark" ? "🌙 Escuro" : "☀️ Claro"}
          </button>
        </nav>
      </div>
    </header>
  );
}
