import { and, eq } from 'drizzle-orm';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { db } from '@/db';
import { userOnSubscriptions } from '@/db/schema';
import { verifyAdmin } from '@/lib/verifyUser';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; subID: string } }
) {
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

    const { id, subID } = params;
    if (!id) {
      return NextResponse.json(
        {
          error: 'Невалідний ідентифікатор користувача',
        },
        { status: 400 }
      );
    }
    if (!subID) {
      return NextResponse.json(
        {
          error: 'Невалідний ідентифікатор підписки',
        },
        { status: 400 }
      );
    }

    await db.insert(userOnSubscriptions).values({
      userId: id,
      subscriptionId: subID,
    });

    return NextResponse.json({}, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Помилка сервера' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; subID: string } }
) {
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

    const { id, subID } = params;
    if (!id) {
      return NextResponse.json(
        {
          error: 'Невалідний ідентифікатор користувача',
        },
        { status: 400 }
      );
    }

    if (!subID) {
      return NextResponse.json(
        {
          error: 'Невалідний ідентифікатор підписки',
        },
        { status: 400 }
      );
    }

    await db
      .delete(userOnSubscriptions)
      .where(
        and(eq(userOnSubscriptions.userId, id), eq(userOnSubscriptions.subscriptionId, subID))
      );

    return NextResponse.json({}, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Помилка сервера' }, { status: 500 });
  }
}
