import * as React from "react";
import SiteHeader from "../components/SiteHeader";

export default function Contato(){
  const [erro,setErro]=React.useState("");

  function onSubmit(e){
    const f=e.target, nome=f.nome.value.trim(), msg=f.mensagem.value.trim();
    if(!nome || msg.length<5){
      e.preventDefault();
      setErro("Preencha nome e uma mensagem válida.");
    } else {
      // evita duplo envio se usuário clicar repetido:
      f.querySelector('button[type="submit"]').disabled = true;
    }
  }

  return (
    <>
      <SiteHeader />
      <main className="container">
        <h1>Contato</h1>
        {erro && <p className="alert" role="alert">{erro}</p>}

        <form
          name="contato"
          method="POST"
          action="/sucesso/"                 // ✅ redireciona após envio
          data-netlify="true"
          netlify-honeypot="bot-field"
          onSubmit={onSubmit}
          className="form"
        >
          <input type="hidden" name="form-name" value="contato" />
          <input type="hidden" name="assunto" value="Contato via site IFAD" />
          <input type="hidden" name="origem" value="/contato" />

          <p className="hidden">
            <label>Não preencher: <input name="bot-field" /></label>
          </p>

          <div className="field"><label htmlFor="nome">Nome</label><input id="nome" name="nome" required /></div>
          <div className="field"><label htmlFor="email">E-mail</label><input id="email" name="email" type="email" required /></div>
          <div className="field"><label htmlFor="assunto">Assunto</label><input id="assunto" name="assunto_usuario" /></div>
          <div className="field"><label htmlFor="mensagem">Mensagem</label><textarea id="mensagem" name="mensagem" rows={6} required /></div>

          {/* reCAPTCHA opcional: habilite também no painel Netlify (Forms > reCAPTCHA) */}
          {/* <div data-netlify-recaptcha="true"></div> */}

          <button className="btn" type="submit">Enviar</button>
        </form>
      </main>
    </>
  );
}
