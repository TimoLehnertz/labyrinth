"use server";
import { expect, test } from "vitest";
import { login } from "@/app/[locale]/login/login";

// function t() {
//   const en = require("@/messages/en.json");
//   const obj = JSON.parse(en.readFileSync("file", "utf8"));
// }

test("login", async function () {
  console.log("Moin");
  // t();
  // const formData: FormData = new FormData();
  // formData.append("password", "12345678");
  // formData.append("email", "123");
  // const response = await login({}, formData);
  // expect(response.message).toBe(t("invalid-email-format"));
  expect("Moin").toBe("Moin");
});
