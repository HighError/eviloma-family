import { eq, sql } from 'drizzle-orm';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { db } from '@/db';
import { transactionsSchema, usersSchema } from '@/db/schema';
import { verifyAdmin } from '@/lib/verifyUser';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
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

    const { title, category, date, suma } = await request.json();

    if (!title || !category || !date || !suma) {
      return NextResponse.json(
        {
          error: 'Один або декілька параметрів відсутні',
        },
        { status: 400 }
      );
    }

    const user = await db.query.usersSchema.findFirst({ where: eq(usersSchema.id, id) });

    if (!user) {
      return NextResponse.json(
        {
          error: 'Помилка пошуку користувача',
        },
        { status: 404 }
      );
    }

    await db.insert(transactionsSchema).values({
      title,
      category,
      date: new Date(date),
      suma,
      user: id,
    });
    await db
      .update(usersSchema)
      .set({ balance: sql`balance + ${suma}` })
      .where(eq(usersSchema.id, id));

    return NextResponse.json({}, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Помилка сервера' }, { status: 500 });
  }
}
