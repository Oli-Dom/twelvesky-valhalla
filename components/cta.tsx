import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Download, Zap } from "lucide-react";
import { DownloadButton } from "./ui/downloadButton";

export function CTA() {
  return (
    <section className="py-16 bg-background relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <Image
          src="/images/banner4.png"
          alt="Background"
          fill
          className="object-cover"
        />
      </div>
      <div className="container relative z-10 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-primary gold-glow">
          YOUR LEGEND AWAITS
        </h2>
        <p className="max-w-[800px] mx-auto text-lg mb-8 text-muted-foreground">
          Join millions of players in the most immersive MMO RPG experience.
          Create your hero, forge alliances, and conquer the realm of TwelveSky
          Valhalla.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
         
          <DownloadButton/>
          <Link href="/login">
            <Button variant="outline" size="lg" className="fire-button">
              <Zap className="mr-2 h-5 w-5" />
              Play Free Now
            </Button>
          </Link>
          <Link href="https://discord.gg/gDvc7vcKww">
            <Button variant="outline" size="lg" className="fire-button">
              Join Our Discord
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
