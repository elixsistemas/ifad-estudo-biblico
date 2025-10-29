import * as React from "react";
import SiteHeader from "../components/SiteHeader";
import Seo from "../components/SEO";
export const Head = ({ location }) => <Seo pathname={location.pathname} />;

export default function PedidoOracao(){
  const [erro,setErro]=React.useState("");

  function onSubmit(e){
    const f=e.target, nome=f.nome.value.trim(), pedido=f.pedido.value.trim();
    if(!nome || pedido.length<10){
      e.preventDefault();
      setErro("Nome e pedido (mínimo 10 caracteres) são obrigatórios.");
    } else {
      f.querySelector('button[type="submit"]').disabled = true;
    }
  }

  return (
    <>
      <SiteHeader />
      <main className="container">
        <h1>Pedido de Oração</h1>
        <p className="note">Seu pedido será recebido pela equipe pastoral.</p>
        {erro && <p className="alert" role="alert">{erro}</p>}

        <form
          name="pedido-oracao"
          method="POST"
          action="/sucesso" 
          data-netlify="true"
          netlify-honeypot="bot-field"
          onSubmit={onSubmit}
          className="form"
        >
          <input type="hidden" name="form-name" value="pedido-oracao" />
          <input type="hidden" name="assunto" value="Pedido de Oração — IFAD" />
          <input type="hidden" name="origem" value="/pedido-oracao" />

          <p className="hidden"><label>Não preencher: <input name="bot-field" /></label></p>

          <div className="field"><label htmlFor="nome">Nome completo</label><input id="nome" name="nome" required /></div>
          <div className="field"><label htmlFor="email">E-mail (opcional)</label><input id="email" name="email" type="email" /></div>
          <div className="field"><label htmlFor="fone">Telefone/WhatsApp (opcional)</label><input id="fone" name="fone" /></div>
          <div className="field"><label htmlFor="igreja">Igreja/Congregação (opcional)</label><input id="igreja" name="igreja" /></div>
          <div className="field"><label htmlFor="pedido">Pedido de oração</label><textarea id="pedido" name="pedido" required minLength={10} rows={6} /></div>
          <div className="field"><label><input type="checkbox" name="consent" required /> &nbsp;Autorizo o uso das informações enviadas para acompanhamento pastoral.</label></div>

          {/* <div data-netlify-recaptcha="true"></div> */}

          <button className="btn" type="submit">Enviar pedido</button>
        </form>
      </main>
    </>
  );
}
