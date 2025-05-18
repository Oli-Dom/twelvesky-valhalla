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
    content:
      [
      "Fixed original Launcher (please download again if you deleted it; see announcements)",
      "Added new enchant colours to Elite weapons",
      "Adjusted FPS cap",
      "Adjusted some things to further test delay issues",
      "Random spawn timers and more spread-out Valhalla Guards in Yanggok Valley",
      "Closed down portals that were not meant to be open",
      "Closed all SOS maps except Infernal Island for further testing",
      "Adjusted Item Mall prices",
    ],
  },
] as const;
