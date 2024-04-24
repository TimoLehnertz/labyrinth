import { server } from "../../serverAPI";
import Form from "./form";
import { redirect } from "next/navigation";

export default async function RegisterPage() {
  if (await server.isLoggedIn()) {
    redirect("/");
  }
  return (
    <div className="flex justify-center pt-10">
      <div className="bg-neutral-100 dark:bg-neutral-700 rounded-xl p-5 shadow-md">
        <h1 className="mb-4 text-lg text-center">Register a new account</h1>
        <Form />
      </div>
    </div>
  );
}
