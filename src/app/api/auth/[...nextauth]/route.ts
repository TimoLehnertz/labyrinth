import prisma from "@/_lib/db";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { z } from "zod";

const authorizeSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const handler = NextAuth({
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials, req) {
        const result = authorizeSchema.safeParse(credentials);
        if (!result.success) {
          return null;
        }
        const user = await prisma.users.findFirst({
          where: {
            email: result.data.email,
          },
        });
        if (user === null) {
          console.log("no user");
          return null;
        }
        const bcrypt = require("bcryptjs");
        if (!bcrypt.compareSync(result.data.password, user.password)) {
          console.log("wrong password");
          return null;
        }
        return {
          id: user.id,
          email: user.email,
          name: user.username,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      // if (user.id) {
      //   token.id = user.id;
      // }
      // if (user.name) {
      //   token.username = user.name;
      // }
      // console.log("jwt", token, user);
      // return token;
      if (user) {
        return { ...token, ...user }; // Save id to token as docs says: https://next-auth.js.org/configuration/callbacks
      }
      return token;
    },

    session({ session, token }) {
      if (token.id && typeof token.id === "string") {
        session.user.id = token.id;
      }
      if (token.username && typeof token.username === "string") {
        session.user.username = token.username;
      }
      if (token.email && typeof token.email === "string") {
        session.user.email = token.email;
      }
      console.log("session callback", session, token);
      return session;
    },
  },
});

export { handler as GET, handler as POST };
