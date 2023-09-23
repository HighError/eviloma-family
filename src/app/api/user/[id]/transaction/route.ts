import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

import dbConnect from '@/lib/dbConnect';
import { verifyAdmin } from '@/lib/verifyUser';
import Transaction from '@/models/Transaction';
import User from '@/models/User';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
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

    const { title, category, date, suma } = await request.json();

    if (!title || !category || !date || !suma) {
      return NextResponse.json(
        {
          error: 'Один або декілька параметрів відсутні',
        },
        { status: 400 }
      );
    }

    await dbConnect();

    const user = await User.findById(id).populate('transactions');

    if (!user) {
      return NextResponse.json(
        {
          error: 'Помилка пошуку користувача',
        },
        { status: 404 }
      );
    }

    const transaction = new Transaction({ title, category, date, suma });

    await transaction.save();

    user.transactions.push(transaction);

    user.balance += suma;

    await user.save();

    return NextResponse.json({}, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Помилка сервера' }, { status: 500 });
  }
}
