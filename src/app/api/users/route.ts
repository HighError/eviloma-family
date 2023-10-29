import axios, { AxiosError } from 'axios';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { db } from '@/db';
import getKey from '@/lib/logtoManagementApiKey';
import { verifyAdmin } from '@/lib/verifyUser';
import type FullUser from '@/types/fullUser';
import type LogtoUser from '@/types/logtoUser';

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

    const databaseUsers = await db.query.usersSchema.findMany({
      with: {
        subscriptions: {
          columns: {},
          with: {
            subscription: true,
          },
        },
        transactions: true,
      },
    });

    const token = await getKey();

    if (!token) {
      return NextResponse.json(
        { error: 'Авторизація не виконана. Зверніться до адміністратора' },
        { status: 500 }
      );
    }

    const response = await axios.get(logtoUserEndPoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Parse logto users and create a list of users with additional information
    const logtoUsers: LogtoUser[] = response.data;
    const users: FullUser[] = [];

    databaseUsers.forEach((x) => {
      const logtoUser = logtoUsers.find((y) => y.id === x.id);
      if (logtoUser && x.id) {
        const fullUser: FullUser = {
          ...x,
          email: logtoUser.primaryEmail,
          username: logtoUser.username,
          avatar: logtoUser.avatar,
          subscriptions: x.subscriptions.map((y) => ({ subscription: y.subscription! })),
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
