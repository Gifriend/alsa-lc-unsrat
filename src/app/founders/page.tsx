import { Metadata } from "next";
import FoundersPage from "./components/FounderPage";


export const metadata: Metadata = {
  title: "ALSA LC UNSRAT - Founders",
  description:
    "Founders page of ALSA LC UNSRAT official website. Learn about the founders of ALSA LC UNSRAT.",
};  

export default function Founder(){
  return <FoundersPage/>
}