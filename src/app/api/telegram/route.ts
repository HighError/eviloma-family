import moment from 'moment';
import { NextRequest, NextResponse } from 'next/server';

import dbConnect from '@/lib/dbConnect';
import generateTokenKey from '@/lib/tokenGenerator';
import { verifyAuth } from '@/lib/verifyUser';
import TempToken, { ITempToken } from '@/models/TempToken';
import User from '@/models/User';

const serverErrorMessage = 'Помилка сервера';
const authorizationErrorMessage = 'Авторизація не виконана.';
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const { isAuthenticated, claims } = await verifyAuth(request);
    if (!isAuthenticated) {
      return NextResponse.json({ error: authorizationErrorMessage }, { status: 403 });
    }

    const newToken = new TempToken({
      user: claims?.sub ?? '',
      token: generateTokenKey(16),
      date: new Date(),
    });

    await newToken.save();

    return NextResponse.json(
      {
        token: newToken.token,
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
    await dbConnect();

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

    const tokenObject: ITempToken | null = await TempToken.findOne({ token });

    if (!tokenObject) {
      return NextResponse.json(
        {
          error: 'Невалідний токен',
        },
        { status: 400 }
      );
    }

    const experiencedDate = moment(new Date(tokenObject.date)).add(20, 'minutes');

    if (experiencedDate.isBefore(new Date())) {
      return NextResponse.json(
        {
          error: 'Токен вже не актуальний',
        },
        { status: 400 }
      );
    }

    const telegramUser = await User.findOne({ telegramID: telegramID });

    if (telegramUser) {
      return NextResponse.json(
        {
          error: 'Такий телеграмм користувач вже зареєстрований',
        },
        { status: 400 }
      );
    }

    const user = await User.findOne({ sub: tokenObject.user });

    if (!user) {
      return NextResponse.json(
        {
          error: 'Користувача не знайдено',
        },
        { status: 400 }
      );
    }

    user.telegramID = telegramID;

    await user.save();
    await TempToken.findByIdAndDelete(tokenObject._id);

    return NextResponse.json({}, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: serverErrorMessage }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await dbConnect();
    const { isAuthenticated, claims } = await verifyAuth(request);
    if (!isAuthenticated || !claims) {
      return NextResponse.json({ error: authorizationErrorMessage }, { status: 403 });
    }

    const user = await User.findOne({ sub: claims.sub });

    user.telegramID = null;

    await user.save();

    return NextResponse.json({}, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: serverErrorMessage }, { status: 500 });
  }
}
