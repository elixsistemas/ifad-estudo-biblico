import * as React from "react";
import SiteHeader from "../components/SiteHeader";
import Seo from "../components/SEO";

export const Head = ({ location }) => (
  <Seo
    title="Sobre a IFAD"
    description="Conheça a história, missão e valores da Igreja Evangélica Pentecostal Família Aliança de Um Novo Tempo (IFAD), em Guarulhos/SP."
    pathname={location.pathname}
  />
);

export default function SobrePage() {
  return (
    <>
      <SiteHeader />

      <main className="container">
        {/* HERO */}
        <header className="hero-sobre" aria-labelledby="page-title">
          <p className="kicker">Igreja Evangélica Pentecostal</p>

          <h1 id="page-title" className="page-title">
            Família Aliança de Um Novo Tempo <span className="sigla">(IFAD)</span>
          </h1>

          <p className="page-sub">
            Uma comunidade cristã comprometida com o ensino bíblico, a adoração e o serviço ao próximo.
          </p>
        </header>

        {/* CONTEÚDO */}
        <section className="content-grid" style={{ display: "grid", gap: 20, marginTop: 24 }}>
          <article className="card">
            <h2>Quem somos</h2>
            <p>
              A IFAD nasceu com o propósito de ser <strong>um ponto de encontro</strong> para famílias que desejam
              <strong> crescer espiritualmente</strong> e viver o evangelho de Jesus de forma prática. Reunimos pessoas
              de diferentes gerações e contextos, em um lugar seguro para compartilhar a fé e aprender a Bíblia.
            </p>
            <p>
              Somos uma igreja evangélica pentecostal e temos como base de fé as Escrituras Sagradas — crendo na
              salvação em Cristo, na atuação do Espírito Santo e na responsabilidade de anunciar o evangelho.
            </p>
          </article>

          <section className="grid-3">
            <article className="card">
              <h3>Missão</h3>
              <p>Proclamar o evangelho e fortalecer famílias na Palavra.</p>
            </article>
            <article className="card">
              <h3>Visão</h3>
              <p>Ser uma comunidade de fé que transforma vidas com amor.</p>
            </article>
            <article className="card">
              <h3>Valores</h3>
              <ul style={{ margin: "6px 0 0", paddingLeft: 18, lineHeight: 1.6 }}>
                <li>Adoração centrada em Cristo</li>
                <li>Formação bíblica consistente</li>
                <li>Comunhão e cuidado mútuo</li>
                <li>Serviço e ação social</li>
              </ul>
            </article>
          </section>

          <article className="card">
            <h2>Nossa história</h2>
            <p>
              A IFAD teve início em 30 de janeiro de 2022, na Rua Jefe, 460, Jardim Cristina, Guarulhos/SP. Ao longo
              do tempo, estruturamos uma liderança capacitada e um espaço acolhedor para receber a comunidade. Cada
              etapa foi marcada pela fidelidade de Deus e pela dedicação de homens e mulheres que abraçaram o chamado
              para fazer discípulos.
            </p>
            <p>
              Seguimos avançando com evangelismo, discipulado e cuidado pastoral, para que cada pessoa encontre
              propósito e desenvolva seus dons para a glória do Senhor.
            </p>
          </article>

          <article className="card">
            <h2>Ministérios em ação</h2>
            <p>
              Atendemos diferentes faixas etárias com ministérios de crianças, adolescentes, jovens, homens, mulheres
              e casais, além de louvor, intercessão, ação social e missões. As equipes são compostas por voluntários
              treinados que servem em unidade com a liderança pastoral.
            </p>
            <p>
              Incentivamos pequenos grupos de estudo bíblico ao longo do mês, promovendo acompanhamento pessoal e
              crescimento contínuo na Palavra.
            </p>
          </article>

          <article className="card">
            <h2>Horários e localização</h2>
            <p>
              Celebração aos <strong>domingos, às 18h</strong> (com programação infantil).{" "}
              Culto de ensinamento às <strong>quartas, às 19h30</strong>.
            </p>
            <p>
              <strong>Endereço:</strong> Rua Jefe, 460 – Jardim Cristina, Guarulhos/SP (próximo ao terminal São João).
            </p>
          </article>

          <article className="card">
            <h2>Como participar</h2>
            <p>
              Quer visitar um culto, conhecer nossos cursos ou servir em algum ministério? Fale com nossa equipe
              pastoral — será um prazer caminhar com você e ajudar no desenvolvimento dos seus dons.
            </p>
            <p>
              Use a <a href="/contato">página de contato</a> para enviar uma mensagem ou procure-nos nas redes sociais.
              Estamos à disposição para orar, aconselhar e celebrar com você cada passo de fé.
            </p>
          </article>
        </section>
      </main>
    </>
  );
}
