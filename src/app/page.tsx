import { Loader } from "@/components/experience/loader";
import { Nav } from "@/components/experience/nav";
import { CosmosClient } from "@/components/experience/cosmos-client";
import { Grain } from "@/components/experience/grain";
import { HeroLayer } from "@/components/experience/hero-layer";
import { Constellation } from "@/components/experience/constellation";
import { ProjectStage } from "@/components/experience/project-stage";
import { ScrollScript } from "@/components/experience/scroll-script";
import { Contact } from "@/components/experience/contact";
import { ABOUT_TEXT } from "@/data/constellation";

/**
 * The page is a script, not a stack of sections.
 *
 * Everything the reader sees lives in fixed layers (the cosmos canvas, the
 * hero text, the constellation, the project cards) and is driven by how far
 * they have scrolled. The elements below inside <main> are mostly empty
 * spacers that give each act its length; their `data-phase` names are what
 * ScrollScript turns into progress. The only in-flow content is the contact
 * section at the end and the screen-reader text.
 */
export default function Home() {
  return (
    <>
      <Loader />
      <Nav />
      <CosmosClient />
      <Grain />
      <HeroLayer name="Sofiyan Shaikh" sub={["Generative AI", "Code", "Web"]} tag="Follow the star." />
      <Constellation />
      <ProjectStage />
      <ScrollScript />

      <main>
        <section id="hero" data-phase="hero" className="phase-h-100">
          <h1 className="sr-only">
            Sofiyan Shaikh — B.Tech CSE (AI &amp; ML) student, Generative AI with IBM
          </h1>
        </section>
        <div data-phase="traverse" className="phase-h-200" aria-hidden="true" />
        <section id="about" data-phase="about" className="phase-h-400">
          <p className="sr-only">{ABOUT_TEXT}</p>
        </section>
        <section id="projects" data-phase="projHeader" className="phase-h-100">
          <h2 className="sr-only">Projects</h2>
        </section>
        <div data-phase="proj1" className="phase-h-150" aria-hidden="true" />
        <div data-phase="proj2" className="phase-h-150" aria-hidden="true" />
        <div data-phase="proj3" className="phase-h-150" aria-hidden="true" />
        <div data-phase="tail" className="phase-h-70" aria-hidden="true" />
        <div data-phase="outro" className="phase-h-160" aria-hidden="true" />
        <Contact />
      </main>
    </>
  );
}
