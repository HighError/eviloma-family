import type { subscriptionsSchema } from '@/db/schema';

export default function getNonExistSubscriptions(
  allSubscriptions: (typeof subscriptionsSchema.$inferSelect)[],
  userSubscription: (typeof subscriptionsSchema.$inferSelect)[]
): (typeof subscriptionsSchema.$inferSelect)[] {
  const existSubscriptionsIDs = userSubscription.map((x) => x.id);
  const nonExistsSubscriptionIDs = allSubscriptions
    .map((x) => x.id)
    .filter((x) => !existSubscriptionsIDs.includes(x));

  const nonExistSubscriptions: (typeof subscriptionsSchema.$inferSelect)[] = [];

  for (const subID of nonExistsSubscriptionIDs) {
    const sub = allSubscriptions.find((x) => x.id === subID);
    if (sub) {
      nonExistSubscriptions.push(sub);
    }
  }

  return nonExistSubscriptions.sort((a, b) => {
    return a.title.localeCompare(b.title);
  });
}
