import * as React from "react";
import SiteHeader from "../components/SiteHeader";

export default function Contato(){
  const [erro,setErro]=React.useState("");
  function onSubmit(e){
    const f=e.target, nome=f.nome.value.trim(), msg=f.mensagem.value.trim();
    if(!nome || msg.length<5){ e.preventDefault(); setErro("Preencha nome e uma mensagem válida."); }
  }
  return (
    <>
      <SiteHeader />
      <main className="container">
        <h1>Contato</h1>
        {erro && <p className="alert">{erro}</p>}
        <form name="contato" method="POST" data-netlify="true" netlify-honeypot="bot-field" onSubmit={onSubmit} className="form">
          <input type="hidden" name="form-name" value="contato" />
          <p className="hidden"><label>Não preencher: <input name="bot-field" /></label></p>

          <div className="field"><label htmlFor="nome">Nome</label><input id="nome" name="nome" required /></div>
          <div className="field"><label htmlFor="email">E-mail</label><input id="email" name="email" type="email" required /></div>
          <div className="field"><label htmlFor="assunto">Assunto</label><input id="assunto" name="assunto" /></div>
          <div className="field"><label htmlFor="mensagem">Mensagem</label><textarea id="mensagem" name="mensagem" rows={6} required /></div>

          <button className="btn" type="submit">Enviar</button>
        </form>
      </main>
    </>
  );
}
