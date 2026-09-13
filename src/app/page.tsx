import { Navbar } from "@/components/navbar";
import { ScrollSceneClient } from "@/components/3d/scroll-scene-client";
import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Services } from "@/components/sections/services";
import { Projects } from "@/components/sections/projects";
import { Contact } from "@/components/sections/contact";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <ScrollSceneClient />
      <main className="relative min-h-dvh bg-transparent">
        {/* HERO SECTION */}
        <Hero />

        {/* ABOUT ME SECTION */}
        <About />

        {/* SERVICES / CAPABILITIES SECTION */}
        <Services />

        {/* FEATURED PROJECTS (EXPANDABLE BENTO CARDS) */}
        <Projects />

        {/* CONTACT SECTION */}
        <Contact />
      </main>
      {/* SIGNATURE FOOTER */}
      <Footer />
    </>
  );
}
