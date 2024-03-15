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

        // const salt = bcrypt.genSaltSync(10);
        // const hash = bcrypt.hashSync(result.data.password, salt);
        // console.log(hash, user.password);
        // console.log(result.data.password);

        if (!bcrypt.compareSync(result.data.password, user.password)) {
          console.log("wrong password");
          return null;
        }
        console.log("login");
        return {
          id: user.id,
          email: user.email,
        };
      },
    }),
  ],
});

export { handler as GET, handler as POST };
