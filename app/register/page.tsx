
import { Metadata } from "next";
import RegisterPage from "@/components/pages/registerPage";
export const metadata: Metadata = {
  title: 'Register',
};

export default function Page(){
  return(
    <div>
      <RegisterPage/>
    </div>
  )
}