import axios from 'axios';
import { eq } from 'drizzle-orm';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { db } from '@/db';
import { usersSchema } from '@/db/schema';
import { logtoUserEndPoint } from '@/lib/logto';
import getKey from '@/lib/logtoManagementApiKey';
import type LogtoUser from '@/types/logtoUser';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authorization = request.headers.get('Authorization');

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
    const user = await db.query.usersSchema.findFirst({
      with: {
        subscriptions: {
          columns: {},
          with: {
            subscription: true,
          },
        },
        transactions: true,
      },
      where: eq(usersSchema.telegramID, params.id),
    });

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

    const response = await axios.get(`${logtoUserEndPoint}/${user.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const logtoUsers: LogtoUser = response.data;

    const data = {
      ...user,
      email: logtoUsers.primaryEmail,
      username: logtoUsers.username,
      avatar: logtoUsers.avatar,
      subscriptions: user.subscriptions.map((e) => e.subscription!),
    };
    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Помилка сервера' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authorization = request.headers.get('Authorization');
    if (!authorization || authorization !== `Bearer ${process.env.TELEGRAM_API_KEY}`) {
      return NextResponse.json(
        {
          error: 'Авторизація не виконана.',
        },
        { status: 403 }
      );
    }

    await db
      .update(usersSchema)
      .set({ telegramID: null })
      .where(eq(usersSchema.telegramID, params.id));

    return NextResponse.json({}, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Помилка сервера' }, { status: 500 });
  }
}
