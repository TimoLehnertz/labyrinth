import React from "react";
import { components } from "@/app/backend";
import { GameState, Treasure } from "labyrinth-game-logic";
import TreasureCard from "./TreasureCard";
import { client } from "@/app/clientAPI";
import { playerIndexToColor } from "@/app/_components/Labyrinth/PathTileElem";
import { getBotName, parseBotType } from "./LabyrinthGameUI";

type GamePlayer = components["schemas"]["PlayerPlaysGame"];

interface Props {
  gamePlayer: GamePlayer;
  gameState: GameState;
}
export default function GamePlayerArea({ gamePlayer, gameState }: Props) {
  const user = client.useUser();
  const isSelf =
    gamePlayer.userID !== null &&
    gamePlayer.userID === user?.id &&
    gamePlayer.playerName === null;
  const playerState = gameState.allPlayerStates.getPlayerState(
    gamePlayer.playerIndex
  );
  const foundTreasures: Treasure[] = [];
  for (let i = 0; i < playerState.foundTreasureCount; i++) {
    foundTreasures.push(playerState.getFoundTreasure(i));
  }
  const playerName =
    gamePlayer.playerName ??
    gamePlayer.user?.username ??
    getBotName(gamePlayer.id);
  return (
    <div className="flex flex-col items-center justify-start gap-4 mt-4">
      {!isSelf ? (
        <p>
          You&apos;re watching{" "}
          <span className="bg-slate-800 rounded">{playerName}</span>&apos;s
          treasures
        </p>
      ) : (
        <p>Your treasures:</p>
      )}
      <div className="flex flex-row justify-evenly max-w-72 gap-4 items-center">
        {playerState.currentTreasure === null ? (
          <p className="text-xl">
            {isSelf ? (
              <>
                Return to your <b>home point</b> to win!
              </>
            ) : (
              <>
                Player must return to the{" "}
                {playerIndexToColor(gamePlayer.playerIndex)} homeposition to win
              </>
            )}
          </p>
        ) : (
          <>
            <p className="text-right">
              {isSelf ? (
                <>Find this treasure next:</>
              ) : (
                <>Searching for this treasure</>
              )}
            </p>
            <TreasureCard large={true} treasure={playerState.currentTreasure} />
            {playerState.remainingTreasureCount === 1 ? (
              <p>This is the last one</p>
            ) : (
              <p className="flex gap-2 items-center">
                <span className="p-1 bg-neutral-700 rounded-md">
                  {playerState.remainingTreasureCount}
                </span>
                <span>Remaining</span>
              </p>
            )}
          </>
        )}
      </div>
      {foundTreasures.length > 0 ? (
        <div>
          <p className="text-center mb-2">
            {foundTreasures.length} Found Treasures
          </p>
          <div className="grid grid-cols-4 gap-4">
            {foundTreasures.map((treasure) => (
              <TreasureCard
                key={treasure.id}
                large={false}
                treasure={treasure}
              />
            ))}
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
