import { Metadata } from "next";
import AchievementsPage from "./components/AhievementsPage";


export const metadata: Metadata = {
  title: "ALSA LC UNSRAT - Achievements",
  description:
    "Achievements page of ALSA LC UNSRAT official website. Discover the accomplishments and awards of ALSA LC UNSRAT.",
};

export default function Achievements(){
  return <AchievementsPage/>
}