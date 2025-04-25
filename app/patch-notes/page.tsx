"use client"

import { Button } from "@/components/ui/button"
import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"
import { CalendarDays, FileText } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useEffect, useState } from "react"
import Loading from "./loading"
export default function PatchNotesPage() {


  // const patchNotes = [
  //   {
  //     id: "v2.5.0",
  //     version: "2.5.0",
  //     name: "The Crimson Crusade",
  //     date: "April 15, 2025",
  //     highlights: [
  //       "New Crimson Crusade storyline with 15 main quests",
  //       "Added the Crimson Lord raid boss",
  //       "5 new legendary weapons and armor sets",
  //       "New zone: The Burning Wastes",
  //     ],
  //     sections: [
  //       {
  //         title: "New Content",
  //         items: [
  //           "Added Crimson Crusade main storyline with 15 quests",
  //           "New zone: The Burning Wastes with 3 new dungeons",
  //           "Added Crimson Lord raid boss with unique mechanics",
  //           "5 new legendary weapons and 3 new armor sets",
  //           "New mount: Infernal Warhorse",
  //           "Added 20 side quests in the new zone",
  //         ],
  //       },
  //       {
  //         title: "Class Changes",
  //         items: [
  //           "Warrior: Increased Whirlwind damage by 10%",
  //           "Mage: Reduced Fireball cooldown by 2 seconds",
  //           "Archer: Fixed an issue with Piercing Shot not applying debuffs",
  //           "Paladin: Divine Shield now provides 20% damage reduction",
  //           "Necromancer: Summoned minions now scale better with player level",
  //         ],
  //       },
  //       {
  //         title: "Bug Fixes",
  //         items: [
  //           "Fixed an issue where players could get stuck in certain terrain",
  //           "Resolved a crash that occurred when entering the Ancient Temple",
  //           "Fixed incorrect item stats on several legendary items",
  //           "Resolved an issue with guild bank permissions",
  //           "Fixed animation glitches with certain mounts",
  //         ],
  //       },
  //     ],
  //   },
    
  // ]

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
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl text-primary gold-glow">Patch Notes</h1>
              <p className="max-w-[700px] text-muted-foreground md:text-xl">
                Detailed information about game updates, balance changes, and bug fixes.
              </p>
            </div>

            <div className="space-y-8">
              {/* {patchNotes.map((patch) => (
                <div key={patch.id} className="bg-card rounded-lg shadow-lg border border-primary/20 overflow-hidden">
                  <div className="p-6 border-b border-border">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <h2 className="text-2xl font-bold text-primary">
                          {patch.version} - {patch.name}
                        </h2>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <CalendarDays className="mr-2 h-4 w-4" />
                          {patch.date}
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="fire-button">
                        <FileText className="mr-2 h-4 w-4" />
                        Full Patch Notes
                      </Button>
                    </div>

                    <div className="mt-4">
                      <h3 className="font-medium mb-2">Highlights:</h3>
                      <ul className="space-y-1 list-disc list-inside text-muted-foreground">
                        {patch.highlights.map((highlight, index) => (
                          <li key={index}>{highlight}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <Accordion type="single" collapsible className="w-full">
                    {patch.sections.map((section, index) => (
                      <AccordionItem key={index} value={`section-${index}`}>
                        <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/50">
                          {section.title}
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-4 pt-2">
                          <ul className="space-y-2 list-disc list-inside text-muted-foreground">
                            {section.items.map((item, itemIndex) => (
                              <li key={itemIndex}>{item}</li>
                            ))}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              ))} */}

              <h1>No current patch notes</h1>
            </div>

            <div className="mt-12 flex justify-center">
              <Button variant="outline" className="fire-button">
                View Older Patch Notes
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
