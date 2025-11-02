import * as React from "react";
import SiteHeader from "../components/SiteHeader";
import Seo from "../components/SEO";

export const Head = ({ location }) => (
  <Seo
    title="Sobre a IFAD"
    description="Conheça a história, missão e ministérios da Igreja Filadélfia Assembleia de Deus."
    pathname={location.pathname}
  />
);

export default function SobrePage() {
  return (
    <>
      <SiteHeader />
      <main className="container">
        <header className="hero">
          <h1>Sobre a Igreja Evangélica Pentecostal Família Aliança de Um Novo Tempo (IFAD)</h1>
          <p className="note">
            Uma comunidade cristã comprometida com o ensino bíblico, a adoração e o serviço ao próximo.
          </p>
        </header>

        <section style={{ display: "grid", gap: 20, marginTop: 32 }}>
          <article className="card">
            <h2>Quem somos</h2>
            <p>
              A IFAD nasceu com o propósito de ser um ponto de encontro para famílias que desejam crescer
              espiritualmente e viver o evangelho de Jesus de forma prática. Reunimos pessoas de diferentes
              gerações e contextos que encontram na igreja um lugar seguro para compartilhar a fé e aprender a
              Bíblia.
            </p>
            <p>
              Somos uma igreja evangélica pentecostal e mantemos como base de fé as Escrituras Sagradas,
              crendo na salvação em Cristo, na atuação do Espírito Santo e na responsabilidade de anunciar o
              evangelho até os confins da Terra.
            </p>
          </article>

          <article className="card">
            <h2>Missão e valores</h2>
            <ul style={{ margin: "12px 0 0", paddingLeft: 20, lineHeight: 1.6 }}>
              <li><strong>Adoração:</strong> Cultos vibrantes e centrados na presença de Deus.</li>
              <li><strong>Formação bíblica:</strong> Ensino consistente para crianças, jovens e adultos.</li>
              <li><strong>Comunhão:</strong> Relacionamentos saudáveis que geram cuidado mútuo.</li>
              <li><strong>Serviço:</strong> Ações sociais e missionárias que impactam nossa região.</li>
            </ul>
          </article>

          <article className="card">
            <h2>Nossa história</h2>
            <p>
              A IFAD teve início em 30 de janeiro de 2022, com sede na Rua jefe, 460, Jd. Cristina, Guarulhos - SP,
               e, ao longo dos anos, se estruturou com liderança capacitada e um espaço acolhedor para receber a comunidade.
              Cada etapa dessa história foi marcada pela fidelidade de Deus e pela dedicação de homens e mulheres que 
              abraçaram o chamado para fazer discípulos.
            </p>
            <p>
              Hoje continuamos avançando com projetos de evangelismo, discipulado e cuidado pastoral, buscando
              que cada pessoa encontre propósito e desenvolva seus dons para a glória do Senhor.
            </p>
          </article>

          <article className="card">
            <h2>Ministérios em ação</h2>
            <p>
              Para atender às diferentes faixas etárias, contamos com ministérios de crianças, adolescentes, jovens,
              homens, mulheres e casais, além de grupos de louvor, intercessão, ação social e missões. Cada equipe é 
              formada por voluntários treinados que servem com alegria e trabalham em unidade com a liderança pastoral.
            </p>
            <p>
              Também incentivamos pequenos grupos de estudo bíblico ao longo do mês, promovendo acompanhamento pessoal 
              e crescimento contínuo na Palavra.
            </p>
          </article>

          <article className="card">
            <h2>Horários e localização</h2>
            <p>
              Nossas principais celebrações acontecem aos domingos, às 18h, com programação especial para crianças.
              Durante a semana, realizamos o culto de ensinamento às quartas-feiras, às 19h30.
            </p>
            <p>
              Endereço: Rua Jefe, 460 – Jardim Cristina, Guarulhos/SP. Estamos próximos ao terminal São João.
            </p>
          </article>

          <article className="card">
            <h2>Como participar</h2>
            <p>
              Se deseja conhecer mais sobre a IFAD, visitar um culto ou servir em algum ministério, entre em contato
              com nossa equipe pastoral. Será um prazer caminhar com você, apresentar nossos cursos e ajudá-lo a
              encontrar um espaço para desenvolver seus dons.
            </p>
            <p>
              Utilize a página de contato para enviar uma mensagem ou procure-nos em nossas redes sociais. Estamos
              à disposição para orar, aconselhar e celebrar com você cada passo de fé.
            </p>
          </article>
        </section>
      </main>
    </>
  );
}