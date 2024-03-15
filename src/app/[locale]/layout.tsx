import { getServerSession } from "next-auth";
import Link from "next/link";
import { Toaster } from "react-hot-toast";
import Logout from "./logout";

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const session = await getServerSession();
  return (
    <html lang={locale}>
      <body>
        <nav>
          {!!session && <Logout></Logout>}
          {!session && <Link href="/login"></Link>}
        </nav>
        {children}
        <Toaster position="top-right"></Toaster>
      </body>
    </html>
  );
}
