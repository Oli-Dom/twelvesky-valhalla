import { notFound } from "next/navigation";
import { newsData } from "@/consts/newsData";
import Image from "next/image";
import { MainNav } from "@/components/main-nav";
import { Footer } from "@/components/footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'News',
};

export default async function NewsArticlePage({
  params,
}: {
  params: { slug: string };
}) {


  const resolvedParams = await params; // Await the params object
  const slug = resolvedParams.slug;
  const article = newsData.find((article) => article.slug === slug);

  if (!article) {
    notFound();
  }

  return (
    <div>
      <MainNav />
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-extrabold tracking-tight leading-tight mb-4 text-primary">
          {article.title}
        </h1>

        <p className="text-sm text-muted-foreground mb-6">
          Published on <span className="font-bold">{article.date}</span>
        </p>
        <article className="prose prose-lg prose-invert text-muted-foreground">
          <p>{article.content}</p>
        </article>
        <div className="mt-8">
          <Image
            src={article.contentImage.logo}
            alt={article.title}
            width={article.contentImage.width}
            height={article.contentImage.height}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
}
