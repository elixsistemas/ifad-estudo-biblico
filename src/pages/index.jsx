import * as React from "react";
import { Link } from "gatsby";
import SiteHeader from "../components/SiteHeader";
import SEO from "../components/SEO";
export const Head = ({ location }) => <SEO pathname={location.pathname} />;

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="container">
        <header className="hero">
          <h1>Estudo Bíblico IFAD</h1>
          <p className="note">Leitura diária e plano anual com progresso.</p>
          <div className="cta">
            <Link className="btn" to="/plano">Plano Anual</Link>
            <Link className="btn outline" to="/app/reader">Leitura</Link>
          </div>
        </header>

        <section style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginTop:24}}>
          <div className="card">
            <h3>Leitura Guiada</h3>
            <p>Escolha livro, capítulo e verso. Quando aberto pelo plano, os botões avança/retrocedem entre as leituras do dia.</p>
          </div>
          <div className="card">
            <h3>Pedidos de Oração</h3>
            <p>Envie pedidos para a equipe pastoral.</p>
            <Link className="btn" to="/pedido-oracao">Enviar pedido</Link>
          </div>
        </section>
      </main>
    </>
  );
}
