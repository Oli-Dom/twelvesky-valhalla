import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { DownloadButton } from "./ui/downloadButton";

export function Hero(){
    return(
        <section className="relative h-[600px] overflow-hidden">
        <Image
          src="/images/banner1.png"
          alt="Twelsky Valhalla Hero"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 hero-gradient flex flex-col items-center justify-center text-center p-6">
          <p className="max-w-[600px] text-lg md:text-xl text-white/90 mb-8">
            Embark on an epic journey through mystical realms. Battle
            legendary foes and claim your place among the gods.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
          <DownloadButton/>
            <Link href="/login">
              <Button variant="outline" size="lg" className="fire-button">
                Play Now
              </Button>
            </Link>
          </div>
        </div>
      </section>
    )
}