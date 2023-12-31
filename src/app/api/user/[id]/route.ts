import axios, { AxiosError } from 'axios';
import { eq } from 'drizzle-orm';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { db } from '@/db';
import { usersSchema } from '@/db/schema';
import { logtoUserEndPoint } from '@/lib/logto';
import getKey from '@/lib/logtoManagementApiKey';
import { verifyAdmin } from '@/lib/verifyUser';
import type LogtoUser from '@/types/logtoUser';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Verify if the user is an admin
    const { isAdmin } = await verifyAdmin(request);

    if (!isAdmin) {
      return NextResponse.json(
        {
          error: 'Ви не маєте прав для перегляду користувачів',
        },
        { status: 403 }
      );
    }

    const { id } = params;
    if (!id) {
      return NextResponse.json(
        {
          error: 'Невалідний ідентифікатор користувача',
        },
        { status: 400 }
      );
    }

    const user = await db.query.usersSchema.findFirst({
      where: eq(usersSchema.id, id),
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

    if (!user) {
      return NextResponse.json(
        {
          error: 'Помилка пошуку користувача',
        },
        { status: 404 }
      );
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

    return NextResponse.json(
      {
        ...user,
        email: logtoUsers.primaryEmail,
        username: logtoUsers.username,
        avatar: logtoUsers.avatar,
      },
      { status: 200 }
    );
  } catch (err) {
    if (err instanceof AxiosError) {
      return NextResponse.json(
        {
          error: 'Помилка сервера. Не вдалось отримати користувача. Спробуйте ще раз',
          error_code: err.response?.status,
          error_message: err.message,
        },
        { status: 500 }
      );
    }
    return NextResponse.json({ error: 'Помилка сервера' }, { status: 500 });
  }
}
