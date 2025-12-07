import { Metadata } from "next";
import MerchandisePage from "./components/MerchandisePage";


export const metadata: Metadata = {
  title: "ALSA LC UNSRAT - Merchandise",
  description:
    "Merchandise page of ALSA LC UNSRAT official website. Explore and purchase official ALSA LC UNSRAT merchandise.",
};

export default function Merchandise(){
  return <MerchandisePage/>
}