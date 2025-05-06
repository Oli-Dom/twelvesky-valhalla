
import NewsPage from "@/components/pages/newsPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'News',
};


export default function Page(){
  return(
    <div>
      <NewsPage/>
    </div>
  )
}
