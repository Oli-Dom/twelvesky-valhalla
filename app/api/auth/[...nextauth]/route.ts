import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getUserByEmail } from "@/lib/db";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Find user by email using direct MySQL query
        const user = await getUserByEmail(credentials.email);

        if (!user) {
          console.log("User not found");
          return null;
        }

        if (user.isVerified === 0) {
          throw new Error("AccountNotVerified")
          
        }

        // Direct password comparison (no hashing)
        const passwordMatch = user.uPassword === credentials.password;

        if (!passwordMatch) {
          console.log("Password does not match");
          return null;
        }

        // Return user data in the format NextAuth expects

        return {
          id: user.uUserIdx.toString(),
          email: user.uEmail,
          name: user.uID,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
    signUp: "/register",
    error: "/login",
  },
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
