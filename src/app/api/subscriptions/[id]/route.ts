import mongoose, { ObjectId } from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

import { verifyAdmin } from '@/lib/verifyUser';
import Subscription from '@/models/Subscription';
import User from '@/models/User';

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

    const id = params.id;
    if (!id || !mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        {
          error: 'Невалідний ідентифікатор підписки',
        },
        { status: 400 }
      );
    }

    const { title, date, cost } = await request.json();
    if (!title || !date || (!cost && cost !== 0)) {
      return NextResponse.json(
        {
          error: 'Відсутній один або декілька параметрів',
        },
        { status: 400 }
      );
    }

    const sub = await Subscription.findById(id);

    if (!sub) {
      return NextResponse.json(
        {
          error: 'Підписку не знайдено',
        },
        { status: 400 }
      );
    }

    sub.title = title;
    sub.date = date;
    sub.cost = cost;

    await sub.save();

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

    const id = params.id;
    if (!id || !mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        {
          error: 'Невалідний ідентифікатор підписки',
        },
        { status: 400 }
      );
    }

    const users = (await User.find({})).filter((u) => u.subscriptions.includes(id));

    for await (const user of users) {
      user.subscriptions = user.subscriptions.filter((x: ObjectId[]) => x.toString() !== id);
      await user.save();
    }

    await Subscription.findByIdAndDelete(id);

    return NextResponse.json({}, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Помилка сервера' }, { status: 500 });
  }
}
