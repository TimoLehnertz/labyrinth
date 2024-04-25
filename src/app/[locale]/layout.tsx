import { Toaster } from "react-hot-toast";
import Header from "../_components/header";
import "./globals.css";
import Link from "next/link";
import { server } from "../serverAPI";
import { components } from "../backend";
import SideBar from "../_components/sideBar";
import Image from "next/image";
import PrimaryButton from "../_components/buttons/PrimaryButton";

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
      ownGames = res.data.filter((game) => !game.finished);
    }
  }
  return (
    <html lang={locale}>
      <body className="dark:text-white dark:bg-neutral-900 bg-white text-black transition-colors">
        <Header></Header>
        <div className="relative">
          <SideBar>
            <div className="block sm:hidden mb-6">
              <Link href="/" className="flex items-center space-x-2">
                <Image src="/img/logo.webp" alt="Logo" width={50} height={50} />
                <p>The crazy labyrinth</p>
              </Link>
            </div>
            {isLoggedIn ? (
              <ul className="flex flex-col gap-2 mt-6 mb-6">
                <li>
                  <Link href="/friends">Friends</Link>
                </li>
                <li>
                  <Link href="/play">Play</Link>
                </li>
                <li>
                  <Link href="/past-games">past-games</Link>
                </li>
              </ul>
            ) : (
              <div>Please login or register to start playing</div>
            )}
            {isLoggedIn && ownGames.length > 0 && (
              <>
                <p className="mt-4 mb-2 text-center">Your ongoing games</p>
                <div className="flex flex-col gap-2">
                  {ownGames.map((game, i) => (
                    <PrimaryButton key={i} href={`/play/${game.id}`}>
                      {"#" + (i + 1) + (game.started ? " started" : " lobby")}
                    </PrimaryButton>
                  ))}
                </div>
              </>
            )}
          </SideBar>
          <main className="sm:ml-64">{children}</main>
        </div>
        <Toaster position="top-right"></Toaster>
      </body>
    </html>
  );
}
