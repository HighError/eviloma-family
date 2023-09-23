import mongoose, { ObjectId } from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

import dbConnect from '@/lib/dbConnect';
import { verifyAdmin } from '@/lib/verifyUser';
import Transaction from '@/models/Transaction';
import User from '@/models/User';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; transactionID: string } }
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

    const { id, transactionID } = params;
    if (!id || !mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        {
          error: 'Невалідний ідентифікатор користувача',
        },
        { status: 400 }
      );
    }

    if (!transactionID || !mongoose.isValidObjectId(transactionID)) {
      return NextResponse.json(
        {
          error: 'Невалідний ідентифікатор транзакції',
        },
        { status: 400 }
      );
    }

    await dbConnect();

    const user = (await User.find({})).filter((u) => u.transactions.includes(transactionID))[0];

    if (!user) {
      return NextResponse.json(
        {
          error: 'Помилка пошуку користувача',
        },
        { status: 404 }
      );
    }

    user.transactions = user.transactions.filter((x: ObjectId[]) => x.toString() !== transactionID);

    await user.save();

    await Transaction.findByIdAndDelete(transactionID);

    return NextResponse.json({}, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: 'Помилка сервера' }, { status: 500 });
  }
}
