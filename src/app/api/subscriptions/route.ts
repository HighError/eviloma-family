import { NextRequest, NextResponse } from 'next/server';

import { verifyAdmin } from '@/lib/verifyUser';
import Subscription, { ISubscription } from '@/models/Subscription';

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

    const subscriptions: ISubscription[] = await Subscription.find({});

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

    const { title, category, date, cost } = await request.json();
    if (!title || !category || !date || (!cost && cost !== 0)) {
      return NextResponse.json(
        {
          error: 'Відсутній один або декілька параметрів',
        },
        { status: 400 }
      );
    }

    const newSubs = new Subscription({ title, category, date, cost });

    await newSubs.save();
    return NextResponse.json({}, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Помилка сервера' }, { status: 500 });
  }
}
