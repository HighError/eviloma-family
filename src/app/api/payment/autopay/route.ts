import axios from 'axios';
import { eq, lte, sql } from 'drizzle-orm';
import moment from 'moment';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { db } from '@/db';
import { subscriptionsSchema, transactionsSchema, usersSchema } from '@/db/schema';

async function sendTelegramMessage(
  user: typeof usersSchema.$inferSelect,
  subscription: typeof subscriptionsSchema.$inferSelect
) {
  if (!user.telegramID) {
    return;
  }
  const telegramData = {
    chat_id: user.telegramID,
    text: `✅ <b>ОПЛАТА ПІДПИСКИ</b>\n🔖 Назва підписки: <i>${
      subscription.title
    }</i>\n💰 Сумма щомісячного платежу: <i>${(subscription.cost / 100).toFixed(
      2
    )} грн.</i>\n💵 Залишок: <i>${((user.balance - subscription.cost) / 100).toFixed(
      2
    )} грн.</i>\n\n<i>P.S.  Дякуємо, що користуєтесь нашими послугами🥰</i>`,
    parse_mode: 'HTML',
  };
  await axios
    .post(`https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`, telegramData)
    .catch((_) => {});
}

export async function POST(request: NextRequest) {
  try {
    const authorization = request.headers.get('Authorization');

    if (!authorization || authorization !== `Bearer ${process.env.PAYMENT_API_KEY}`) {
      return NextResponse.json(
        {
          error: 'Авторизація не виконана.',
        },
        { status: 403 }
      );
    }

    await db.transaction(async (tx) => {
      const subscriptions = await tx.query.subscriptionsSchema.findMany({
        where: lte(subscriptionsSchema.date, new Date()),
        with: {
          users: true,
        },
      });
      subscriptions.forEach(async (subscription) => {
        subscription.users.forEach(async (userToSub) => {
          const user = await tx.query.usersSchema.findFirst({
            where: eq(usersSchema.id, userToSub.userId ?? '-1'),
          });
          if (user) {
            await tx
              .update(usersSchema)
              .set({ balance: sql`${usersSchema.balance} - ${subscription.cost}` })
              .where(eq(usersSchema.id, user.id));
            await tx.insert(transactionsSchema).values({
              title: 'Поповнення рахунку',
              category: 'Deposit',
              suma: -subscription.cost,
              date: new Date(),
              user: user.id,
            });
            await sendTelegramMessage(user, subscription);
          }
        });
        await tx
          .update(subscriptionsSchema)
          .set({ date: moment(new Date(subscription.date)).add(1, 'month').toDate() })
          .where(eq(subscriptionsSchema.id, subscription.id));
      });
    });

    return NextResponse.json({}, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: 'Помилка сервера' }, { status: 500 });
  }
}
