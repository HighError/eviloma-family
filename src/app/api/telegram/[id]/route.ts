import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

import dbConnect from '@/lib/dbConnect';
import { logtoUserEndPoint } from '@/lib/logto';
import getKey from '@/lib/logtoManagementApiKey';
import { ITransaction } from '@/models/Transaction';
import User from '@/models/User';
import FullUser from '@/types/fullUser';
import LogtoUser from '@/types/logtoUser';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authorization = request.headers.get('Authorization');
    await dbConnect();

    if (!authorization || authorization !== `Bearer ${process.env.TELEGRAM_API_KEY}`) {
      return NextResponse.json(
        {
          error: 'Авторизація не виконана.',
        },
        { status: 403 }
      );
    }
    if (!params.id) {
      return NextResponse.json(
        {
          error: 'Невалідний ідентифікатор користувача',
        },
        { status: 400 }
      );
    }
    const user = await User.findOne({ telegramID: params.id })
      .populate('subscriptions')
      .populate('transactions');

    if (!user) {
      return NextResponse.json({ error: 'Користувача не знайдено' }, { status: 400 });
    }
    const token = await getKey();

    if (!token) {
      // Return a 500 Internal Server Error response if the token is not valid
      return NextResponse.json(
        { error: 'Авторизація не виконана. Зверніться до адміністратора' },
        { status: 500 }
      );
    }

    const response = await axios.get(`${logtoUserEndPoint}/${user.sub}`, {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    });

    const logtoUsers: LogtoUser = response.data;

    const data: FullUser = {
      id: user._id,
      sub: logtoUsers.id,
      avatar: logtoUsers.avatar,
      username: logtoUsers.username,
      email: logtoUsers.primaryEmail,
      balance: user.balance,
      paymentLink: user.paymentLink,
      telegramID: user.telegramID,
      subscriptions: user.subscriptions,
      transactions: user.transactions
        .sort(
          (a: ITransaction, b: ITransaction) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        )
        .slice(0, 5),
    };
    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: 'Помилка сервера' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const authorization = request.headers.get('Authorization');
    if (!authorization || authorization !== `Bearer ${process.env.TELEGRAM_API_KEY}`) {
      return NextResponse.json(
        {
          error: 'Авторизація не виконана.',
        },
        { status: 403 }
      );
    }

    const user = await User.findOne({ telegramID: params.id });

    if (!user) {
      return NextResponse.json({ error: 'Користувача не знайдено' }, { status: 400 });
    }

    user.telegramID = null;

    await user.save();

    return NextResponse.json({}, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Помилка сервера' }, { status: 500 });
  }
}
