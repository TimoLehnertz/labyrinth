"use server";
import { PrismaClient } from "@prisma/client";
import { getTranslations } from "next-intl/server";
import { z } from "zod";

export async function login(
  prevState: any,
  formData: FormData
): Promise<{ message?: string; loggedIn: boolean }> {
  const t = await getTranslations();

  const schema = z.object({
    password: z.string(),
    email: z
      .string()
      .email(t("invalid-email-format"))
      .max(320, t("invalid-email-format")),
  });
  const data = schema.safeParse(formData);
  if (!data.success) {
    return {
      message: data.error.message,
      loggedIn: false,
    };
  }

  const prisma = new PrismaClient();
  const users = await prisma.users.findMany({
    where: {
      email: data.data.email,
    },
  });
  if (users.length === 0) {
    return {
      loggedIn: false,
      message: t("userPasswordIncorrect"),
    };
  } else {
    return {
      loggedIn: true,
    };
  }
}
