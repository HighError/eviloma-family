import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

import dbConnect from '@/lib/dbConnect';
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
    const { id, suma, date } = await request.json();
    const user = await User.findOne({ sub: id }).populate('transactions');
    if (!user) {
      return NextResponse.json({ error: 'Користувача не знайдено' }, { status: 400 });
    }

    const newTransaction = new Transaction({
      title: 'Поповнення рахунку',
      category: 'Deposit',
      suma: suma,
      date: new Date(date * 1000),
    });

    await newTransaction.save();

    user.balance += suma;
    user.transactions.push(newTransaction);
    await user.save();

    if (user.telegramID) {
      const notificationData = {
        chat_id: user.telegramID,
        text: `Ваш баланс поповнено на ${(suma / 100).toFixed(2)} грн!☺️`,
      };
      await axios.post(
        `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`,
        notificationData
      );
    }
    return NextResponse.json({}, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Помилка сервера' }, { status: 500 });
  }
}
