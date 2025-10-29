import * as React from "react";
import { Router, Link } from "@gatsbyjs/reach-router";
import Reader from "../../spa/Reader";
import Busca from "../../spa/Busca";
import SiteHeader from "../../components/SiteHeader";
import SEO from "../../components/SEO";
export const Head = ({ location }) => <SEO pathname={location.pathname} />;

export default function AppRoot() {
  return (
    <>
      <SiteHeader />
      <main className="container">
        <nav className="tabs">
          <Link to="/app/reader">Leitura</Link>
          <Link to="/app/busca">Busca</Link>
        </nav>
        <Router basepath="/app">
          <Reader path="/reader" />
          <Busca path="/busca" />
        </Router>
      </main>
    </>
  );
}
