import { Metadata } from "next";
import ResourcesPage from "./components/ResourcesPage";


export const metadata: Metadata = {
  title: "ALSA LC UNSRAT - Resources",
  description:
    "Resources page of ALSA LC UNSRAT official website. Access official documents and other valuable resources.",
};

export default function Resources(){
  return <ResourcesPage/>
}