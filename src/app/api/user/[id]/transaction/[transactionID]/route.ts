import { and, eq } from 'drizzle-orm';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { db } from '@/db';
import { transactionsSchema } from '@/db/schema';
import { verifyAdmin } from '@/lib/verifyUser';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; transactionID: string } }
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

    const { id, transactionID } = params;
    if (!id) {
      return NextResponse.json(
        {
          error: 'Невалідний ідентифікатор користувача',
        },
        { status: 400 }
      );
    }

    if (!transactionID) {
      return NextResponse.json(
        {
          error: 'Невалідний ідентифікатор транзакції',
        },
        { status: 400 }
      );
    }

    await db
      .delete(transactionsSchema)
      .where(and(eq(transactionsSchema.id, transactionID), eq(transactionsSchema.user, id)));

    return NextResponse.json({}, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Помилка сервера' }, { status: 500 });
  }
}
