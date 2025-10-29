import * as React from "react";
import SiteHeader from "../components/SiteHeader";
import ImageComposer from "../spa/ImageComposer";

export default function CriarImagem(){
  return (
    <>
      <SiteHeader />
      <main className="container">
        <h1>Criar imagem com versículo</h1>
        <p className="note">Escolha um fundo (ou cor sólida), digite o versículo e baixe a arte em PNG.</p>
        <ImageComposer />
      </main>
    </>
  );
}
