import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import prisma from '@/prisma/client';


export default async function signup(req: NextApiRequest, res: NextApiResponse) {
    
  if (req.method === 'POST') {
    const { username, email, password } = req.body;

    try {
      // Check if the user already exists
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return res.status(409).json({ message: 'User already exists' });
      }

      // Hash the password
      const passwordHash = bcrypt.hashSync(password, 10);

      // Create the user
      const user = await prisma.user.create({
        data: {
          username,
          email,
          password_hash: passwordHash,
        },
      });

      return res.status(201).json({ message: 'User created successfully', user });
    } catch (error) {
      console.error('Signup error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
