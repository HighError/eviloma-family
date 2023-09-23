import axios, { AxiosError } from 'axios';
import { NextRequest, NextResponse } from 'next/server';

import dbConnect from '@/lib/dbConnect';
import getKey from '@/lib/logtoManagementApiKey';
import { verifyAdmin } from '@/lib/verifyUser';
import User, { IUser } from '@/models/User';
import FullUser from '@/types/fullUser';
import LogtoUser from '@/types/logtoUser';

const logtoUserEndPoint = `${process.env.LOGTO_ENDPOINT}api/users`;

export async function GET(request: NextRequest) {
  try {
    // Verify if the user is an admin
    const { isAdmin } = await verifyAdmin(request);

    if (!isAdmin) {
      return NextResponse.json(
        {
          error: 'Ви не маєте прав для створення підписки',
        },
        { status: 403 }
      );
    }

    // Connect to the database
    await dbConnect();

    // Get all users from the database
    const databaseUsers: IUser[] | null = await User.find({})
      .populate('subscriptions')
      .populate('transactions');

    // Get token for management API
    const token = await getKey();

    // Check if token is valid
    if (!token) {
      // Return a 500 Internal Server Error response if the token is not valid
      return NextResponse.json(
        { error: 'Авторизація не виконана. Зверніться до адміністратора' },
        { status: 500 }
      );
    }

    // Get logto users using the token
    const response = await axios.get(logtoUserEndPoint, {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    });

    // Parse logto users and create a list of users with additional information
    const logtoUsers: LogtoUser[] = response.data;
    const users: FullUser[] = [];

    databaseUsers.map((x) => {
      const logtoUser = logtoUsers.find((y) => y.id === x.sub);
      if (logtoUser && x._id) {
        const fullUser: FullUser = {
          id: x._id,
          sub: logtoUser.id,
          username: logtoUser.username,
          email: logtoUser.primaryEmail,
          avatar: logtoUser.avatar,
          balance: x.balance,
          paymentLink: x.paymentLink,
          telegramID: x.telegramID,
          subscriptions: x.subscriptions,
          transactions: x.transactions,
        };
        users.push(fullUser);
      }
    });

    return NextResponse.json(users, { status: 200 });
  } catch (err) {
    if (err instanceof AxiosError) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Помилка сервера' }, { status: 500 });
  }
}
