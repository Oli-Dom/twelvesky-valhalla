import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Newspaper } from "lucide-react";
import { newsData } from "@/consts/newsData";
export function News() {
  return (
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {newsData.map((article) => (
            <div
              key={article.slug}
              className="bg-card rounded-lg overflow-hidden shadow-lg news-card border border-primary/20"
            >
              <div className="relative h-48">
                <Image
                  src={article.coverImage.logo}
                  alt={article.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6 flex flex-col h-full">
                <div className="text-sm text-muted-foreground mb-2">
                  {article.date}
                </div>
                <h3 className="text-xl font-bold mb-2">{article.title}</h3>
                <p className="text-muted-foreground mb-4 flex-1">
                  {article.excerpt}
                </p>
                <Link href={`/news/${article.slug}`}>
                  <Button variant="link" className="p-0 h-auto text-primary">
                    Read More
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
