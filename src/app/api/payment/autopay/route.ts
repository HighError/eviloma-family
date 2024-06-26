import dayjs from "dayjs";
import { eq, lte, sql } from "drizzle-orm";
import { map } from "lodash";
import { type NextRequest, NextResponse } from "next/server";

import { ForbiddenError } from "@/classes/ApiError";
import db from "@/db";
import { subscriptions as subscriptionsSchema, transactions, users } from "@/db/schema";
import apiErrorHandler from "@/utils/api/api-error-handler";
import sendSubPaymentNotification from "@/utils/telegram/sub-payment";

export async function POST(req: NextRequest) {
  try {
    const authorization = req.headers.get("Authorization");

    if (!authorization || authorization !== `Bearer ${process.env.PAYMENT_API_KEY}`) {
      throw ForbiddenError();
    }

    const logs = await db.transaction(async (tx) => {
      const subscriptions = await tx.query.subscriptions.findMany({
        where: lte(subscriptionsSchema.date, new Date()),
        with: {
          users: {
            columns: {},
            with: {
              user: true,
            },
          },
        },
      });

      return Promise.all(
        map(subscriptions, async (subscription) => {
          await tx
            .update(subscriptionsSchema)
            .set({
              date: dayjs()
                .add(1, "month")
                .set("hours", 0)
                .set("minutes", 0)
                .set("seconds", 0)
                .set("milliseconds", 0)
                .toDate(),
            })
            .where(eq(subscriptionsSchema.id, subscription.id));
          const subscriptionTransactionsLogs = await Promise.all(
            map(subscription.users, async ({ user }) => {
              const transaction = await tx
                .insert(transactions)
                .values({
                  title: `Автоплатіж за ${subscription.title}`,
                  suma: -subscription.price,
                  category: subscription.category,
                  user: user.id,
                })
                .returning();
              await tx
                .update(users)
                .set({ balance: sql`balance - ${subscription.price}` })
                .where(eq(users.id, user.id));
              if (user.telegramID) {
                await sendSubPaymentNotification(user, subscription);
              }
              return {
                id: user.id,
                transactionId: transaction[0]?.id ?? "",
                username: user.username,
                email: user.email,
                balanceBefore: user.balance,
                telegram: !!user.telegramID,
              };
            }),
          );
          return {
            subscription: {
              id: subscription.id,
              title: subscription.title,
              price: subscription.price,
            },
            logs: subscriptionTransactionsLogs,
          };
        }),
      );
    });
    return NextResponse.json({ status: "success", logs }, { status: 200 });
  } catch (error) {
    return apiErrorHandler(req, error);
  }
}
