import { Metadata } from "next";
import BODPage from "./components/BODPage";


export const metadata: Metadata = {
  title: "ALSA LC UNSRAT - BOD",
  description:
    "BOD page of ALSA LC UNSRAT official website. Learn about the Board of Directors of ALSA LC UNSRAT.",
};

export default function BOD(){
  return <BODPage/>
}