import { Hero } from "../components/home/Hero";
import { Features } from "../components/home/Features";
import { Stats } from "../components/home/Stats";
import { Team } from "../components/home/Team";
import { Contact } from "../components/home/Contact";

export function Home() {
  return (
    <div className="flex flex-col w-full overflow-hidden">
      <Hero />
      <Features />
      <Stats />
      <Team />
      <Contact />
    </div>
  );
}