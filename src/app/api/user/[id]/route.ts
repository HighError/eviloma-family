import axios, { AxiosError } from 'axios';
import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

import dbConnect from '@/lib/dbConnect';
import { logtoUserEndPoint } from '@/lib/logto';
import getKey from '@/lib/logtoManagementApiKey';
import { verifyAdmin } from '@/lib/verifyUser';
import User from '@/models/User';
import LogtoUser from '@/types/logtoUser';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Verify if the user is an admin
    const { isAdmin } = await verifyAdmin(request);

    if (!isAdmin) {
      return NextResponse.json(
        {
          error: 'Ви не маєте прав для перегляду користувачів',
        },
        { status: 403 }
      );
    }

    const id = params.id;
    if (!id || !mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        {
          error: 'Невалідний ідентифікатор користувача',
        },
        { status: 400 }
      );
    }

    await dbConnect();

    const user = await User.findById(id).populate('subscriptions').populate('transactions');

    if (!user) {
      return NextResponse.json(
        {
          error: 'Помилка пошуку користувача',
        },
        { status: 404 }
      );
    }

    const token = await getKey();

    if (!token) {
      // Return a 500 Internal Server Error response if the token is not valid
      return NextResponse.json(
        { error: 'Авторизація не виконана. Зверніться до адміністратора' },
        { status: 500 }
      );
    }

    const response = await axios.get(`${logtoUserEndPoint}/${user.sub}`, {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    });

    const logtoUsers: LogtoUser = response.data;

    return NextResponse.json(
      {
        id: user._id,
        sub: logtoUsers.id,
        avatar: logtoUsers.avatar,
        username: logtoUsers.username,
        email: logtoUsers.primaryEmail,
        balance: user.balance,
        paymentLink: user.paymentLink,
        subscriptions: user.subscriptions,
        transactions: user.transactions,
      },
      { status: 200 }
    );
  } catch (err) {
    if (err instanceof AxiosError) {
      return NextResponse.json(
        {
          error: 'Помилка сервера. Не вдалось отримати користувача. Спробуйте ще раз',
          error_code: err.response?.status,
          error_message: err.message,
        },
        { status: 500 }
      );
    }
    return NextResponse.json({ error: 'Помилка сервера' }, { status: 500 });
  }
}
