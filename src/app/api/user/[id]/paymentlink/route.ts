import { eq } from 'drizzle-orm';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { db } from '@/db';
import { usersSchema } from '@/db/schema';
import isValidUrl from '@/lib/isValidUrl';
import { verifyAdmin } from '@/lib/verifyUser';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
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

    const { url } = await request.json();

    if (!url) {
      await db.update(usersSchema).set({ paymentLink: null }).where(eq(usersSchema.id, id));
    } else if (isValidUrl(url)) {
      await db.update(usersSchema).set({ paymentLink: url }).where(eq(usersSchema.id, id));
    } else {
      return NextResponse.json(
        {
          error: 'Невалідний URL',
        },
        { status: 400 }
      );
    }

    return NextResponse.json({}, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Помилка сервера' }, { status: 500 });
  }
}
