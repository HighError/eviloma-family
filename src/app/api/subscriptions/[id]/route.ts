import { eq } from 'drizzle-orm';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { db } from '@/db';
import { subscriptionsSchema } from '@/db/schema';
import { verifyAdmin } from '@/lib/verifyUser';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { isAdmin } = await verifyAdmin(request);
    if (!isAdmin) {
      return NextResponse.json(
        {
          error: 'Ви немаєте прав для оновлення підписки',
        },
        { status: 403 }
      );
    }

    const { id } = params;
    const { title, date, cost } = await request.json();
    if (!id || !title || !date || (!cost && cost !== 0)) {
      return NextResponse.json(
        {
          error: 'Відсутній один або декілька параметрів',
        },
        { status: 400 }
      );
    }

    const sub = await db
      .update(subscriptionsSchema)
      .set({ id, title, date: new Date(date), cost })
      .where(eq(subscriptionsSchema.id, id))
      .returning();

    if (!sub) {
      return NextResponse.json(
        {
          error: 'Підписку не знайдено',
        },
        { status: 400 }
      );
    }

    return NextResponse.json({}, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Помилка сервера' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { isAdmin } = await verifyAdmin(request);
    if (!isAdmin) {
      return NextResponse.json(
        {
          error: 'Ви немаєте прав для видалення підписки',
        },
        { status: 403 }
      );
    }

    const { id } = params;
    if (!id) {
      return NextResponse.json(
        {
          error: 'Невалідний ідентифікатор підписки',
        },
        { status: 400 }
      );
    }

    await db.delete(subscriptionsSchema).where(eq(subscriptionsSchema.id, id));

    return NextResponse.json({}, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Помилка сервера' }, { status: 500 });
  }
}
