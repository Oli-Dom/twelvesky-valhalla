import { PatchNote } from "@/types/patchNotesType";



export const patchNotesData: PatchNote[] = [
  {
    id: 1,
    title: "Patch Notes 1.0",
    excerpt: "Patch Notes 1.0",
    coverImage: {
      logo: "/images/patchNotes/patch-notes-1.png",
    },
    contentImage: null,
    date: "March 16, 2025",
    slug: "patch-note-1.0",
  content: [
      "Fixed original Launcher (Please download again if you deleted it, check announcements)",
      "Added new Enchant Colors to Elite Weapons",
      "Adjusted FPS cap",
      "Adjusted some things to further test delay issues",
      "Random Spawn Timers and more spread out Valhalla Guards in Yanggok Valley",
      "Closed down portals that were not meant to be open",
      "Closed all SOS maps except Infernal Island for further testing",
      "Adjusted Item Mall prices",
      "Readjusted the Free Rare gear to have proper skills",
      "Odawa Issue will be Fixed",
      "Raw PvP drops will be available",
      "Testing out a few things with FPS",
      "Adjusted intervals on Yang Mobs to be slightly lower",
      "Remove Yang Boss for the time being",
      "You can run Valhalla and another server now",
      "War Adjustments",
      " FFA every 4 hours",
      " Rewards +15, +10, and +5 War Points For Top 3",
      " Gain +5 WP For fully attending war",
      "Regular War",
      " +3 War Points For Attending War",
      "Mini Boss Adjustments",
      " Blacked out the HP",
      " Greed now Gives +5 PK",
      "Odawa Cave",
      "  Drops Items Added",
      "  No Longer a Premium Map"
    ],
  },
] as const;
