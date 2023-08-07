import {hashPassword} from '@/lib/auth';
import MongoDbClient from "../../../apis/mongodb";
import {MongoServerError} from "mongodb";
import {NextApiRequest, NextApiResponse} from "next";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return;
  }

  const data = req.body;

  const {email, password} = data;

  if (
    !email ||
    !email.includes('@') ||
    !password ||
    password.trim().length < 7
  ) {
    res.status(422).json({
      message:
        'Invalid input - password should also be at least 7 characters long.',
    });
    return;
  }

  const client = new MongoDbClient('users');
  try {
    await client.connect();
    const existingUser = await client.findOne({email: email});

    if (existingUser) {
      res.status(422).json({message: 'User exists already!'});
      return;
    }

    const hashedPassword = await hashPassword(password);

    await client.insert({email: email, password: hashedPassword});

    res.status(201).json({message: 'Created user!'});

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
