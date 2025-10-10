import type { ReactNode } from "react";
import { LayoutGrid, Layers, Timer, ImagePlus, UserPlus, ScrollText, BookCopy } from "lucide-react";

const navItems: {
  title: string;
  url: string;
  icon: ReactNode;
}[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: <LayoutGrid />,
  },
  {
    title: "Collections",
    url: "/collections",
    icon: <Layers />,
  },
  {
    title: "Templates",
    url: "/templates",
    icon: <BookCopy/>,
  },
  {
    title: "Mint Certificate",
    url: "/mint_certificate",
    icon: <ScrollText />,
  },
  // {
  //   title: "Mint NFT",
  //   url: "/mint_nft",
  //   icon: <ImagePlus />,
  // },
  {
    title: "Campaigns",
    url: "/campaigns",
    icon: <Timer />,
  },
  {
    title: "Account",
    url: "/account",
    icon: <UserPlus />,
  }
];

export default navItems;
