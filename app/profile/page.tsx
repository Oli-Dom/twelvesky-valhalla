import { Metadata } from "next";
import ProfilePage from "@/components/pages/profilePage";
export const metadata: Metadata = {
  title: 'Profile',
};

export default function Page(){
  return(
    <div>
      <ProfilePage/>
    </div>
  )
}