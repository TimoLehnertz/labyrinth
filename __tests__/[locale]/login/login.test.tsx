import { expect, test } from "vitest";
import { login } from "#root/src/serverActions/login/login.jsx";

function findKey(obj: object, prop: string): any {
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const element = obj[key as keyof object];
      if (key === prop) {
        return element;
      }
      if (typeof element === "object") {
        const found = findKey(element, key);
        if (found) {
          return found;
        }
      }
    }
  }
  return undefined;
}

function t(prop: string): string | "" {
  const en = require("#root/messages/en.json");
  return findKey(en, prop) ?? "";
}

test("login", async function () {
  const formData: FormData = new FormData();
  formData.append("password", "12345678");
  formData.append("email", "123");
  const response = await login({}, formData);
  expect(response.message).toBe(t("invalid-email-format"));
});
