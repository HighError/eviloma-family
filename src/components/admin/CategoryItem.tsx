import { Banknote, CircleHelp } from "lucide-react";

import SpotifyIcon from "@/icons/Spotify";
import YoutubeIcon from "@/icons/Youtube";
import type { SUBSCRIPTION_CATEGORIES, TRANSACTION_CATEGORIES } from "@/utils/consts";

import SelectItemWithIcon from "./SelectItemWithIcon";

interface IProps {
  category: (typeof SUBSCRIPTION_CATEGORIES)[number] | (typeof TRANSACTION_CATEGORIES)[number];
}

export function getCategoryData(category: IProps["category"]) {
  switch (category) {
    case "Youtube":
      return {
        label: "Youtube",
        icon: <YoutubeIcon width={24} height={24} fill="#ff0000" />,
      };
    case "Spotify":
      return {
        label: "Spotify",
        icon: <SpotifyIcon width={24} height={24} fill="#1DB954" />,
      };
    case "Deposit":
      return {
        label: "Deposit",
        icon: <Banknote width={24} height={24} className="text-[var(--mantine-color-violet-5)]" />,
      };
    default:
      return {
        label: "Інше",
        icon: <CircleHelp />,
      };
  }
}

export default function CategorySelectItem({ category }: IProps) {
  const data = getCategoryData(category);

  return <SelectItemWithIcon icon={data.icon} label={data.label} />;
}
