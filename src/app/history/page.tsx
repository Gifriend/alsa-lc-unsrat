import { Metadata } from "next";
import HistoryPage from "./components/HistoryPage";


export const metadata: Metadata = {
  title: "ALSA LC UNSRAT - History",
  description:
    "History page of ALSA LC UNSRAT official website. Learn about the history and milestones of ALSA LC UNSRAT.",
};

export default function History(){
  return <HistoryPage/>
}