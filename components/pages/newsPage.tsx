"use client"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"
import { useEffect } from "react"
import { useState } from "react"
import { CalendarDays, ChevronRight } from "lucide-react"
import Loading from "@/components/loading/loading"
import { newsData } from "@/consts/newsData"

export default function NewsPage() {
    const newsArticles = newsData
 
   const [isLoading, setIsLoading] = useState(true);
 
   useEffect(() => {
     // Trigger loading every time component mounts
     const timer = setTimeout(() => {
       setIsLoading(false);
     }, 2000); // 3 seconds
 
     return () => clearTimeout(timer); // Cleanup on unmount
   }, []); // Empty dependency array means this runs once on every mount
 
   if (isLoading) return <Loading />;
 
   return (
     <div className="flex min-h-screen flex-col">
       <MainNav />
       <main className="flex-1">
         <section className="py-12 md:py-24 bg-muted/30">
           <div className="container px-4 md:px-6">
             <div className="flex flex-col items-center text-center space-y-4 mb-12">
               <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl text-primary gold-glow">Latest News</h1>
               <p className="max-w-[700px] text-muted-foreground md:text-xl">
                 Stay updated with the latest announcements, updates, and events in TwelveSky Valhalla.
               </p>
             </div>
 
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {newsArticles.map((article) => (
                 <Link key={article.id} href={`/news/${article.slug}`} className="group">
                   <div className="bg-card rounded-lg overflow-hidden shadow-lg news-card border border-primary/20 h-full flex flex-col">
                     <div className="relative h-48">
                       <Image
                         src={article.coverImage.logo || "/placeholder.svg"}
                         alt={article.title}
                         fill
                         className="object-cover transition-transform group-hover:scale-105"
                       />
                     </div>
                     <div className="p-6 flex flex-col flex-1">
                       <div className="flex items-center text-sm text-muted-foreground mb-2">
                         <CalendarDays className="mr-2 h-4 w-4" />
                         {article.date}
                       </div>
                       <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                         {article.title}
                       </h3>
                       <p className="text-muted-foreground mb-4 flex-1">{article.excerpt}</p>
                       <div className="flex items-center text-primary font-medium">
                         Read More
                         <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                       </div>
                     </div>
                   </div>
                 </Link>
               ))}
             </div>
 
             <div className="mt-12 flex justify-center">
               <Button variant="outline" className="fire-button">
                 Load More News
               </Button>
             </div>
           </div>
         </section>
       </main>
       <Footer />
     </div>
   )
 }
 