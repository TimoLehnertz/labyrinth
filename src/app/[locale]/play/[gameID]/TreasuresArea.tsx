import React from "react";
import { components } from "@/app/backend";
import { GameState, Treasure } from "labyrinth-game-logic";
import TreasureCard from "./TreasureCard";

type GamePlayer = components["schemas"]["PlayerPlaysGame"];

interface Props {
  gamePlayer: GamePlayer;
  gameState: GameState;
}
export default function GamePlayerArea({ gamePlayer, gameState }: Props) {
  const playerState = gameState.allPlayerStates.getPlayerState(
    gamePlayer.playerIndex
  );
  const foundTreasures: Treasure[] = [];
  for (let i = 0; i < playerState.foundTreasureCount; i++) {
    foundTreasures.push(playerState.getFoundTreasure(i));
  }
  return (
    <div className="flex flex-col items-center justify-start gap-4 mt-4">
      <div className="flex flex-row justify-evenly max-w-72 gap-4 items-center">
        {playerState.currentTreasure === null ? (
          <p>Return to your home point to win!</p>
        ) : (
          <>
            <p className="text-right">Find this treasure:</p>
            <TreasureCard large={true} treasure={playerState.currentTreasure} />
            <p>Remaining: {playerState.remainingTreasureCount - 1}</p>
          </>
        )}
      </div>
      {foundTreasures.length > 0 ? (
        <div>
          <p className="text-center mb-2">Found Treasures</p>
          <div className="grid grid-flow-col gap-4">
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
