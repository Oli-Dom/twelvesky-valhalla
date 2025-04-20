import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Newspaper } from "lucide-react";

export function News(){
    return(
        <section className="py-16 bg-muted/50">
        <div className="container">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-primary">LATEST NEWS</h2>
            <Link href="/news">
              <Button variant="outline" className="fire-button">
                <Newspaper className="mr-2 h-4 w-4" />
                View All News
              </Button>
            </Link>
          </div>
          {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card rounded-lg overflow-hidden shadow-lg news-card border border-primary/20">
              <div className="relative h-48">
                <Image src="/images/banner5.png" alt="News Image" fill className="object-cover" />
              </div>
              <div className="p-6">
                <div className="text-sm text-muted-foreground mb-2">April 15, 2025</div>
                <h3 className="text-xl font-bold mb-2">The Crimson Crusade Update</h3>
                <p className="text-muted-foreground mb-4">
                  New dungeons, weapons, and the fearsome Crimson Lord await brave warriors.
                </p>
                <Link href="/news/crimson-crusade">
                  <Button variant="link" className="p-0 h-auto text-primary">
                    Read More
                  </Button>
                </Link>
              </div>
            </div>
          </div> */}

          <h1>No current news</h1>
        </div>
      </section>
    )
}