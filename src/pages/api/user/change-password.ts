import { getSession } from 'next-auth/react';

import { hashPassword, verifyPassword } from '@/lib/auth';
import MongoDbClient from "../../../apis/mongodb";
import {MongoServerError} from "mongodb";
import {NextApiRequest, NextApiResponse} from "next";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PATCH') {
    return;
  }

  const session = await getSession({ req: req });

  if (!session) {
    res.status(401).json({ message: 'Not authenticated!' });
    return;
  }

  const userEmail = session.user?.email;
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;


  const client = new MongoDbClient('users');
  try {
    await client.connect();
    const user: any = await client.findOne({email: userEmail});

    if (!user) {
      res.status(404).json({ message: 'User not found.' });
      return;
    }

    const currentPassword = user.password;

    const passwordsAreEqual = await verifyPassword(oldPassword, currentPassword);

    if (!passwordsAreEqual) {
      res.status(403).json({ message: 'Invalid password.' });
      return;
    }

    const hashedPassword = await hashPassword(newPassword);

    await client.update({ email: userEmail }, { $set: { password: hashedPassword } });

    res.status(200).json({ message: 'Password updated!' });

  } catch (error) {
    if (error instanceof MongoServerError) {
      console.log(`Error worth logging: ${error}`);
    }

    return null;
  } finally {
    await client.close();
  }
}

export default handler;
