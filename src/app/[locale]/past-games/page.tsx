import React from "react";
import { server } from "../../serverAPI";
import { redirect } from "next/navigation";
import TimeDiff from "../../_components/TimeDiff";
import Link from "next/link";

export default async function Page() {
  const games = await server.api.GET("/game/ownGames");
  if (games.error) {
    redirect("");
  }
  return (
    <div className="p-4">
      <h1 className="text-center text-xl mb-4">Past games</h1>
      <div className="flex justify-center">
        <div className="flex flex-col gap-1">
          {games.data.map((game, i) => (
            <Link
              href={
                game.started ? `/play/${game.id}` : `/play/${game.id}/lobby`
              }
              key={i}
              className="flex gap-4 odd:bg-slate-700 p-3 rounded"
            >
              <div>Game #{games.data.length - i}</div>
              <div
                className={
                  !game.started && !game.finished
                    ? "text-stone-100"
                    : game.started && !game.finished
                      ? "text-yellow-300"
                      : "text-lime-200"
                }
              >
                {!game.started
                  ? "Lobby"
                  : game.finished
                    ? "finished"
                    : "ongoing"}
              </div>
              <div>
                {game.finished ? "finished" : "started"}{" "}
                <TimeDiff date={new Date(game.startTime)} /> ago
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
