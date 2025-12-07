import { Metadata } from "next";
import PublicationsPage from "./components/PublicationsPage";

export const metadata: Metadata = {
  title: "ALSA LC UNSRAT - Publications",
  description:
    "Publications page of ALSA LC UNSRAT official website. Explore our research papers, articles, and other publications.",
};
  

export default function Publications(){
  return <PublicationsPage/>
}