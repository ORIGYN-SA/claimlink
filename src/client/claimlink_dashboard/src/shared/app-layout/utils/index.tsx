import type { ReactNode } from "react";
import Icon from "@shared/ui/icons";

const navItems: {
  title: string;
  url: string;
  icon: ReactNode;
}[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: <Icon.Redeem />,
  },
  {
    title: "Collections",
    url: "/collections",
    icon: <Icon.Earn />,
  },
  {
    title: "Templates",
    url: "/templates",
    icon: <Icon.Govern />,
  },
  {
    title: "Mint Certificate",
    url: "/mint_certificate",
    icon: <Icon.Wallet width={24} />,
  },
  {
    title: "Mint NFT",
    url: "/mint_nft",
    icon: <Icon.Speedometer width={24} />,
  },
  {
    title: "Account",
    url: "/account",
    icon: <Icon.Wallet width={24} />,
  },
];

export default navItems;
