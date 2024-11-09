import UserModel from '@/model/User';
import { getServerSession } from 'next-auth/next';
import dbConnect from '@/lib/dbConnect';
import { User } from 'next-auth';
import { Message } from '@/model/User';
import { NextRequest } from 'next/server';
import { authOptions } from '../../auth/[...nextauth]/options';

export async function DELETE(
  request: Request,
  { params }: { params: { messageid: string } }
) {
  const messageId = params.messageid;
  await dbConnect();
  const session = await getServerSession(authOptions);
  const _user: User = session?.user;
  if (!session || !_user) {
    return Response.json(
      { success: false, message: 'Not authenticated' },
      { status: 401 }
    );
  }

  try {
    const updateResult = await UserModel.updateOne(
      { _id: _user._id },
      { $pull: { messages: { _id: messageId } } }
    );

    if (updateResult.modifiedCount === 0) {
      return Response.json(
        { message: 'Message not found or already deleted', success: false },
        { status: 404 }
      );
    }

    const payload = {
      algorithm: "CMA-ES",
      iterations: 10,
      min_similarity: 0.3,
      minimize: false,
      num_molecules: 10,
      particles: 30,
      property_name: "QED",
      smi: "CCN(CC)C(=O)[C@@]1(C)Nc2c(ccc3ccccc23)C[C@H]1N(C)C",
    };

    const API_KEY =
      "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";
    const invokeUrl =
      "https://health.api.nvidia.com/v1/biology/nvidia/molmim/generate";
    const response = await fetch(invokeUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    console.log(await response.json());

    return Response.json(
      { message: 'Message deleted', success: true },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      { message: 'Error deleting message', success: false },
      { status: 500 }
    );
  }
}
