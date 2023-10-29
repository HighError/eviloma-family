import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { db } from '@/db';
import { subscriptionsSchema } from '@/db/schema';
import { verifyAdmin } from '@/lib/verifyUser';

export async function GET(request: NextRequest) {
  try {
    const { isAdmin } = await verifyAdmin(request);
    if (!isAdmin) {
      return NextResponse.json(
        {
          error: 'Ви не маєте прав для перегляду підписок',
        },
        { status: 403 }
      );
    }

    const subscriptions = await db.query.subscriptionsSchema.findMany();

    return NextResponse.json(subscriptions, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Помилка сервера' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { isAdmin } = await verifyAdmin(request);
    if (!isAdmin) {
      return NextResponse.json(
        {
          error: 'Ви не маєте прав для створення підписки',
        },
        { status: 403 }
      );
    }

    const { id, title, category, date, cost } = await request.json();
    if (!title || !date || (!cost && cost !== 0)) {
      return NextResponse.json(
        {
          error: 'Відсутній один або декілька параметрів',
        },
        { status: 400 }
      );
    }

    await db
      .insert(subscriptionsSchema)
      .values({ id, title, category, cost, date: new Date(date) });
    return NextResponse.json({}, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Помилка сервера' }, { status: 500 });
  }
}
