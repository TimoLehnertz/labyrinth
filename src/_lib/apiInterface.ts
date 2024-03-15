import { RegisterReturn, registerSchema } from "../app/api/register/route";

export async function register(
  data: typeof registerSchema._input
): Promise<RegisterReturn> {
  const response = await fetch("/api/register", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "content-type": "application/json",
    },
    cache: "no-store",
  });
  return (await response.json()) as RegisterReturn;
}
