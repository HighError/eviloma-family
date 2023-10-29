import { type LogtoContext } from '@logto/next';
import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { db } from '@/db';
import { usersSchema } from '@/db/schema';
import Axios from '@/lib/axios';

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

    if (!data.isAuthenticated || !data.claims) {
      return NextResponse.json({ isAuth: false }, { status: 200 });
    }

    const user = await db.query.usersSchema.findFirst({
      where: eq(usersSchema.id, data.claims.sub),
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
      await db.insert(usersSchema).values({ id: data.claims.sub });
      const newUser = await db.query.usersSchema.findFirst({
        where: eq(usersSchema.id, data.claims.sub),
        with: {
          subscriptions: {
            with: {
              subscription: true,
            },
          },
          transactions: true,
        },
      });
      return new NextResponse(
        JSON.stringify({
          isAuth: true,
          user: {
            ...newUser,
            email: data.claims.email,
            username: data.claims.username,
            avatar: data.claims.picture,
          },
        }),
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        isAuth: true,
        user: {
          ...user,
          email: data.claims.email,
          username: data.claims.username,
          avatar: data.claims.picture,
        },
      },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ error: 'Помилка сервера' }, { status: 500 });
  }
}
