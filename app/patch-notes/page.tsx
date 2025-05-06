import { Metadata } from "next";
import PatchNotesPage from "@/components/pages/patchNotesPage";
export const metadata : Metadata = {
  title: "Patch Notes"
}

export default function Page(){
  return(
    <div>
      <PatchNotesPage/>
    </div>
  )
}