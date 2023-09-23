import { ISubscription } from '@/models/Subscription';

export default function getNonExistSubscriptions(
  allSubscriptions: ISubscription[],
  userSubscription: ISubscription[]
): ISubscription[] {
  const existSubscriptionsIDs = userSubscription.map((x) => x._id);
  const nonExistsSubscriptionIDs = allSubscriptions
    .map((x) => x._id)
    .filter((x) => !existSubscriptionsIDs.includes(x));

  const nonExistSubscriptions: ISubscription[] = [];

  for (const subID of nonExistsSubscriptionIDs) {
    const sub = allSubscriptions.find((x) => x._id === subID);
    if (sub) {
      nonExistSubscriptions.push(sub);
    }
  }

  return nonExistSubscriptions;
}
