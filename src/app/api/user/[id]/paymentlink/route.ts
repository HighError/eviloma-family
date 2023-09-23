import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

import dbConnect from '@/lib/dbConnect';
import isValidUrl from '@/lib/isValidUrl';
import { verifyAdmin } from '@/lib/verifyUser';
import User from '@/models/User';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
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

    const { url } = await request.json();

    await dbConnect();

    const user = await User.findById(id);

    if (!user) {
      return NextResponse.json(
        {
          error: 'Помилка пошуку користувача',
        },
        { status: 404 }
      );
    }

    if (!url) {
      user.paymentLink = '';
    } else if (isValidUrl(url)) {
      user.paymentLink = url;
    } else {
      return NextResponse.json(
        {
          error: 'Невалідний URL',
        },
        { status: 400 }
      );
    }

    await user.save();

    return NextResponse.json({}, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Помилка сервера' }, { status: 500 });
  }
}
