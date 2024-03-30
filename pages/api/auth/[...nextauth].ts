import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import prisma from '@/prisma/client';
import NextAuth, { DefaultSession } from 'next-auth';


export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        username: { label: "Username", type: "text" },
        password:  { label: "Password", type: "password" }
      },
      authorize: async (credentials, req) => {
        // console.log("new loging", credentials)

        if (!credentials) return null;
        
        const user = await prisma.user.findUnique({
          where: { username: credentials.username }
        });

        // console.log("user", user)

        if (user && bcrypt.compareSync(credentials.password, user.password_hash)) {
          return {
            id: user.id.toString(),
            username: user.username,
            email: user.email
          };
        }
        console.log("Authentication failed");

        return null;
      }
    })
  ],
  callbacks: {
    async session({ session, token }) {
      // console.log("session", session, token	)
      if (token.sub) {
        session.user.id = token.sub; 
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
});
