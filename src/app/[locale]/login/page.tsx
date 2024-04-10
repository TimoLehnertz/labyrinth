import { server } from "../../serverAPI";
import Form from "./form";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  if (await server.isLoggedIn()) {
    redirect("/");
  }
  return (
    <div className="flex justify-center">
      <div className="bg-neutral-100 dark:bg-neutral-800 rounded-xl p-5 shadow-md">
        <h1 className="mb-4 text-lg text-center">Register a new account</h1>
        <Form />
      </div>
    </div>
  );
}
