import * as React from "react";
import SiteHeader from "../components/SiteHeader";

export default function Sucesso(){
  return (
    <>
      <SiteHeader />
      <main className="container">
        <h1>Recebemos sua mensagem ✅</h1>
        <p>Obrigado! Em breve entraremos em contato.</p>
        <p><a className="btn" href="/plano">Voltar ao Plano</a></p>
      </main>
    </>
  );
}
