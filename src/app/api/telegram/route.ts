import { eq } from 'drizzle-orm';
import moment from 'moment';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { db } from '@/db';
import { tempTokensSchema, usersSchema } from '@/db/schema';
import generateTokenKey from '@/lib/tokenGenerator';
import { verifyAuth } from '@/lib/verifyUser';

const serverErrorMessage = 'Помилка сервера';
const authorizationErrorMessage = 'Авторизація не виконана.';
export async function POST(request: NextRequest) {
  try {
    const { isAuthenticated, claims } = await verifyAuth(request);
    if (!isAuthenticated || !claims) {
      return NextResponse.json({ error: authorizationErrorMessage }, { status: 403 });
    }

    const newToken = await db
      .insert(tempTokensSchema)
      .values({
        token: generateTokenKey(16),
        user: claims.sub,
        validUntil: moment(new Date()).add(15, 'minutes').toDate(),
      })
      .returning();

    return NextResponse.json(
      {
        token: newToken[0].token,
      },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ error: serverErrorMessage }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authorization = request.headers.get('Authorization');

    if (!authorization || authorization !== `Bearer ${process.env.TELEGRAM_API_KEY}`) {
      return NextResponse.json(
        {
          error: authorizationErrorMessage,
        },
        { status: 403 }
      );
    }

    const { token, telegramID } = await request.json();

    if (!token || !telegramID) {
      return NextResponse.json(
        {
          error: 'Невалідний ідентифікатор користувача або токен',
        },
        { status: 400 }
      );
    }

    const tokenObject = await db.query.tempTokensSchema.findFirst({
      where: eq(tempTokensSchema.token, token),
    });

    if (!tokenObject) {
      return NextResponse.json(
        {
          error: 'Невалідний токен',
        },
        { status: 400 }
      );
    }

    const experiencedDate = moment(tokenObject.validUntil).add(15, 'minutes');

    if (experiencedDate.isBefore(new Date())) {
      return NextResponse.json(
        {
          error: 'Токен вже не актуальний',
        },
        { status: 400 }
      );
    }

    const telegramUser = await db.query.usersSchema.findFirst({
      where: eq(usersSchema.telegramID, telegramID),
    });

    if (telegramUser) {
      return NextResponse.json(
        {
          error: 'Такий телеграмм користувач вже зареєстрований',
        },
        { status: 400 }
      );
    }

    const user = await db
      .update(usersSchema)
      .set({ telegramID })
      .where(eq(usersSchema.id, tokenObject.user))
      .returning();

    if (!user || user.length === 0) {
      return NextResponse.json(
        {
          error: 'Користувача не знайдено',
        },
        { status: 400 }
      );
    }

    await db.delete(tempTokensSchema).where(eq(tempTokensSchema.id, tokenObject.id));

    return NextResponse.json({}, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: serverErrorMessage }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { isAuthenticated, claims } = await verifyAuth(request);
    if (!isAuthenticated || !claims) {
      return NextResponse.json({ error: authorizationErrorMessage }, { status: 403 });
    }

    await db.update(usersSchema).set({ telegramID: null }).where(eq(usersSchema.id, claims.sub));

    return NextResponse.json({}, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: serverErrorMessage }, { status: 500 });
  }
}
