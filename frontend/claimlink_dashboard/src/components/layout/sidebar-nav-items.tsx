import type { ReactNode } from "react";
import { LayoutGrid, Layers, ScrollText, BookCopy } from "lucide-react";

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
    title: "Templates",
    url: "/templates",
    icon: <BookCopy />,
  },
  {
    title: "Collections",
    url: "/collections",
    icon: <Layers />,
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
  // {
  //   title: "Campaigns",
  //   url: "/campaigns",
  //   icon: <Timer />,
  // },
  // {
  //   title: "Account",
  //   url: "/account",
  //   icon: <UserPlus />,
  // }
];

export default navItems;
