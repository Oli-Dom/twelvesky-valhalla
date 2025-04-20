import { MainNav } from "@/components/main-nav";
import { Hero } from "@/components/hero";
import { Features } from "@/components/features";
import { News } from "@/components/news";
import { CTA } from "@/components/cta";

import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <main className="flex-1">
        <Hero />

        <Features />

        <News />

        <CTA />
      </main>
      <Footer />
    </div>
  );
}
