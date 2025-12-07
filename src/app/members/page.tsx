import { Metadata } from "next";
import MembersPage from "./components/MemberPage";


export const metadata: Metadata = {
  title: "ALSA LC UNSRAT - Members",
  description:
    "Members page of ALSA LC UNSRAT official website. Meet the members of ALSA LC UNSRAT.",
};

export default function Member(){
  return <MembersPage/>
}