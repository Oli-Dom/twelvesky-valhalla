import { Metadata } from "next";
import StorePage from "@/components/pages/storePage";
export const metadata: Metadata = {
  title: 'Store',
};

export default function Page(){
  return(<div>
    <StorePage/>
  </div>
  )
}