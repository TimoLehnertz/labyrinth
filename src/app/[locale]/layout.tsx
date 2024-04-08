import { Toaster } from "react-hot-toast";
import Header from "../_components/header";
import "./globals.css";
import SideBar from "../_components/sideBar";
import Link from "next/link";

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const isLoggedin = false;
  return (
    <html lang={locale}>
      <body className="dark:text-white dark:bg-neutral-900 bg-white text-black transition-colors">
        <Header></Header>
        <div className="relative">
          <SideBar>
            <ul>
              {isLoggedin && (
                <>
                  <li>
                    <Link href="/friends">Friends</Link>
                  </li>
                  <li>
                    <Link href="/play">Play</Link>
                  </li>
                </>
              )}
            </ul>
          </SideBar>
          <main className="p-4 sm:ml-64">{children}</main>
        </div>
        <Toaster position="top-right"></Toaster>
      </body>
    </html>
  );
}
