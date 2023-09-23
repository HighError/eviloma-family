import { type LogtoContext } from '@logto/next';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import Axios from '@/lib/axios';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export async function GET() {
  try {
    const { data }: { data: LogtoContext } = await Axios.get(
      `${process.env.BASE_URL}/api/logto/user`,
      {
        headers: {
          Cookie: cookies().toString(),
        },
      }
    );

    if (!data.isAuthenticated) {
      return NextResponse.json({ isAuth: false }, { status: 200 });
    }

    await dbConnect();

    const user = await User.findOne({ sub: data.userInfo?.sub })
      .populate('subscriptions')
      .populate('transactions');

    if (!user) {
      const newUser = await new User({ sub: data.userInfo?.sub }).save();
      return NextResponse.json(
        {
          isAuth: true,
          isAdmin: newUser.isAdmin ?? false,
          id: newUser._id,
          sub: data.userInfo?.sub,
          email: data.userInfo?.email,
          username: data.userInfo?.username,
          avatar: data.userInfo?.picture,
          data: {
            paymentLink: newUser.paymentLink,
            balance: newUser.balance,
            subscriptions: newUser.subscriptions,
            transactions: newUser.transactions,
          },
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        isAuth: true,
        isAdmin: user.isAdmin ?? false,
        id: user._id,
        sub: data.userInfo?.sub,
        avatar: data.userInfo?.picture,
        username: data.userInfo?.username,
        email: data.userInfo?.email,
        data: {
          paymentLink: user.paymentLink,
          balance: user.balance,
          subscriptions: user.subscriptions,
          telegram: user.telegramID,
          transactions: user.transactions,
        },
      },
      { status: 200 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: 'Помилка сервера' }, { status: 500 });
  }
}
