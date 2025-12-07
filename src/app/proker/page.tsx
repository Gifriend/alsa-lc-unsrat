import { Metadata } from "next";
import ProkerPage from "./components/ProkerPage";

export const metadata: Metadata = {
  title: "ALSA LC UNSRAT - Proker",
  description:
    "Proker page of ALSA LC UNSRAT official website. Explore our programs and activities.",
};

export default function Proker(){
  return <ProkerPage/>
}