import { Navbar } from "@/components/navbar";
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
      <main className="relative min-h-screen bg-[#09090b]">
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
