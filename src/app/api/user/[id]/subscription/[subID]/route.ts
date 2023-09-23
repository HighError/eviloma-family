import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

import dbConnect from '@/lib/dbConnect';
import { verifyAdmin } from '@/lib/verifyUser';
import Subscription from '@/models/Subscription';
import User, { IUser } from '@/models/User';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; subID: string } }
) {
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

    const subID = params.subID;
    if (!subID || !mongoose.isValidObjectId(subID)) {
      return NextResponse.json(
        {
          error: 'Невалідний ідентифікатор підписки',
        },
        { status: 400 }
      );
    }

    await dbConnect();

    const user = await User.findById(id).populate('subscriptions');

    if (!user) {
      return NextResponse.json(
        {
          error: 'Помилка пошуку користувача',
        },
        { status: 404 }
      );
    }

    const subscription = await Subscription.findById(subID);
    if (!subscription) {
      return NextResponse.json(
        {
          error: 'Помилка пошуку підписки',
        },
        { status: 404 }
      );
    }

    user.subscriptions.push(subscription);

    await user.save();

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

    const subID = params.subID;
    if (!subID || !mongoose.isValidObjectId(subID)) {
      return NextResponse.json(
        {
          error: 'Невалідний ідентифікатор підписки',
        },
        { status: 400 }
      );
    }

    await dbConnect();

    const user = await User.findById(id).populate('subscriptions');

    if (!user) {
      return NextResponse.json(
        {
          error: 'Помилка пошуку користувача',
        },
        { status: 404 }
      );
    }

    user.subscriptions = user.subscriptions.filter((x: IUser) => x._id.toString() !== subID);

    await user.save();

    return NextResponse.json({}, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Помилка сервера' }, { status: 500 });
  }
}
