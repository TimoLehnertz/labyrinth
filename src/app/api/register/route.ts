import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/_lib/db";

export const registerSchema = z
  .object({
    username: z
      .string()
      .min(3, { message: "Username must have at least 3 characters" })
      .max(20, { message: "Username must be shorter that 20 characters" }),
    email: z.string().email({ message: "please enter a valid email" }),
    password: z
      .string()
      .min(8, { message: "Password must have at least 8 characters" }),
    confirmPassword: z.string(),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "The passwords did not match",
        path: ["confirmPassword"],
      });
    }
  });

export interface RegisterReturn {
  success: boolean;
  usernameExists?: boolean;
  emailExists?: boolean;
  message?: string;
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<RegisterReturn>> {
  const data = await request.json();
  const result = registerSchema.safeParse(data);
  if (!result.success) {
    return NextResponse.json({ success: false }, { status: 400 });
  }
  // check for username
  const usernameExists = await prisma.users.findMany({
    where: {
      username: result.data.username,
    },
  });
  if (usernameExists.length > 0) {
    return NextResponse.json(
      {
        success: false,
        usernameExists: true,
      },
      { status: 400 }
    );
  }
  // check for email
  const emailExists = await prisma.users.findMany({
    where: {
      email: result.data.email,
    },
  });
  if (emailExists.length > 0) {
    return NextResponse.json(
      {
        success: false,
        emailExists: true,
      },
      { status: 400 }
    );
  }
  // insert user
  // const hashedPassword = await hash(result.data.password, 10);
  const bcrypt = require("bcryptjs");
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(result.data.password, salt);
  await prisma.users.create({
    data: {
      email: result.data.email,
      username: result.data.username,
      password: hashedPassword,
    },
  });
  return NextResponse.json({
    success: true,
  });
}
