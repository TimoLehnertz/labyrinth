import { Toaster } from "react-hot-toast";
import Header from "../_components/header";
import "./globals.css";
import SideBar from "../_components/sideBar";
import Link from "next/link";
import { server } from "../serverAPI";
import { components } from "../backend";
import SecondaryButton from "../_components/buttons/SecondaryButton";

type Game = components["schemas"]["Game"];

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const isLoggedIn = await server.isLoggedIn();
  let ownGames: Game[] = [];
  if (isLoggedIn) {
    const res = await server.api.GET("/game/ownGames");
    if (res.data) {
      ownGames = res.data;
    }
  }
  return (
    <html lang={locale}>
      <body className="dark:text-white dark:bg-neutral-900 bg-white text-black transition-colors">
        <Header></Header>
        <div className="relative">
          <SideBar>
            <ul>
              {isLoggedIn && (
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
            {isLoggedIn && ownGames.length > 0 && (
              <>
                <p className="mt-4 mb-1">Own games</p>
                <div className="flex flex-col gap-2">
                  {ownGames.map((game, i) => (
                    <SecondaryButton key={i} href={`/play/${game.id}`}>
                      {"#" + i + (game.started ? " started" : " lobby")}
                    </SecondaryButton>
                  ))}
                </div>
              </>
            )}
          </SideBar>
          <main className="p-4 sm:ml-64">{children}</main>
        </div>
        <Toaster position="top-right"></Toaster>
      </body>
    </html>
  );
}
