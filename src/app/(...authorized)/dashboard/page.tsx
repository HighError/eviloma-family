import { Grid } from "@mantine/core";
import { dehydrate } from "@tanstack/react-query";
import type { Metadata } from "next/types";

import Hydrate from "@/components/Hydrate";
import BalanceCard from "@/components/cards/BalanceCard";
import ProfileCard from "@/components/cards/ProfileCard";
import SubscriptionsCard from "@/components/cards/SubscriptionsCard";
import TelegramCard from "@/components/cards/TelegramCard";
import TransactionsCard from "@/components/cards/TransactionsCard";
import getQueryClient from "@/utils/get-query-client";
import { getLogtoContext } from "@/utils/logto";

const PAGE_TITLE = "Інформаційна дошка";
export const metadata: Metadata = {
  title: PAGE_TITLE,
  openGraph: {
    title: PAGE_TITLE,
  },
};

export default async function Page() {
  const { userInfo } = await getLogtoContext({ fetchUserInfo: true });

  const queryClient = getQueryClient();

  if (!userInfo) {
    return <div />;
  }
  return (
    <Hydrate state={dehydrate(queryClient)}>
      <Grid grow>
        <ProfileCard userInfo={userInfo} />
        <BalanceCard />
        <TelegramCard />
        <SubscriptionsCard />
        <TransactionsCard />
      </Grid>
    </Hydrate>
  );
}
