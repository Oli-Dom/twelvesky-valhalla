"use client";

import { Button } from "@/components/ui/button";
import { MainNav } from "@/components/main-nav";
import { Footer } from "@/components/footer";
import { CalendarDays, FileText } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useEffect, useState } from "react";
import Loading from "@/components/loading/loading";
import { patchNotesData } from "@/consts/patchNotesData";

export default function PatchNotesPage() {
  const patchNotes = patchNotesData;

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
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl text-primary gold-glow">
                Patch Notes
              </h1>
              <p className="max-w-[700px] text-muted-foreground md:text-xl">
                Detailed information about game updates, balance changes, and
                bug fixes.
              </p>
            </div>

            <div className="space-y-8">
          {patchNotesData.map((patch) => (
        <div
          key={patch.id}
          className="bg-card rounded-lg shadow-lg border border-primary/20 overflow-hidden"
        >
          <div className="p-6 border-b border-border">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-primary">
                  {patch.title}
                </h2>
                <div className="flex items-center text-sm text-muted-foreground mt-1">
                  <CalendarDays className="mr-2 h-4 w-4" />
                  {patch.date}
                </div>
              </div>
           
            </div>

            <div className="mt-4">
              <img
                src={patch.coverImage.logo}
                alt={`${patch.title} cover`}
                
                className="rounded-md w-auto object-cover"
              />
            </div>

            <div className="mt-6">
              <h3 className="font-medium mb-2">Changes:</h3>
              <ul className="space-y-1 list-disc list-inside text-muted-foreground">
                {patch.content.map((line, index) => (
                  <li key={index}>{line}</li>
                ))}
              </ul>
            </div>
          </div>

          {patch.contentImage && (
            <div className="p-6">
              <img
                src={patch.contentImage.logo}
                width={patch.contentImage.width}
                height={patch.contentImage.height}
                alt="Content Visual"
                className="rounded w-full"
              />
            </div>
          )}
        </div>
      ))}
            </div>

          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
