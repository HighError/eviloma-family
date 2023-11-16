import axios from 'axios';
import { eq, sql } from 'drizzle-orm';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { db } from '@/db';
import { transactionsSchema, usersSchema } from '@/db/schema';

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
    const { id, suma } = await request.json();

    if (!id || !suma) {
      return NextResponse.json(
        {
          error: 'Один або декілька параметрів відсутні',
        },
        { status: 400 }
      );
    }

    await db.insert(transactionsSchema).values({
      title: 'Поповнення рахунку',
      category: 'Deposit',
      suma,
      date: new Date(),
      user: id,
    });

    const user = await db
      .update(usersSchema)
      .set({ balance: sql`${usersSchema.balance} + ${suma}` })
      .where(eq(usersSchema.id, id))
      .returning();

    if (user[0].telegramID) {
      const notificationData = {
        chat_id: user[0].telegramID,
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
