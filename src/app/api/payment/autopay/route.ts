import axios from 'axios';
import moment from 'moment';
import { NextRequest, NextResponse } from 'next/server';

import dbConnect from '@/lib/dbConnect';
import Subscription, { ISubscription } from '@/models/Subscription';
import Transaction from '@/models/Transaction';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    const authorization = request.headers.get('Authorization');
    await dbConnect();

    if (!authorization || authorization !== `Bearer ${process.env.PAYMENT_API_KEY}`) {
      return NextResponse.json(
        {
          error: 'Авторизація не виконана.',
        },
        { status: 403 }
      );
    }

    const subscriptions: ISubscription[] =
      ((await Subscription.find()) as ISubscription[]).filter(
        (e) => new Date(e.date).getTime() < new Date().getTime()
      ) ?? [];

    await Promise.all(
      subscriptions.map(async (subscription) => {
        const users =
          (await User.find({ subscriptions: subscription })
            .populate('subscriptions')
            .populate('transactions')) ?? [];
        await Promise.all(
          users.map(async (user) => {
            const transaction = new Transaction({
              title: `Оплата підписки ${subscription.title}`,
              category: subscription.category,
              suma: -subscription.cost,
              date: new Date(),
            });
            await transaction.save();
            user.transactions.push(transaction);
            user.balance -= subscription.cost;
            await user.save();
            const data = {
              chat_id: user.telegramID,
              text: `✅ <b>ОПЛАТА ПІДПИСКИ</b>\n🔖 Назва підписки: <i>${
                subscription.title
              }</i>\n💰 Сумма щомісячного платежу: <i>${(subscription.cost / 100).toFixed(
                2
              )} грн.</i>\n\n<i>P.S.  Дякуємо, що користуєтесь нашими послугами🥰</i>`,
              parse_mode: 'HTML',
            };
            await axios.post(
              `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`,
              data
            );
          })
        );
        subscription.date = moment(new Date(subscription.date)).add(1, 'month').toDate();
        await subscription.save();
      })
    );

    return NextResponse.json({}, { status: 200 });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ error: 'Помилка сервера' }, { status: 500 });
  }
}
