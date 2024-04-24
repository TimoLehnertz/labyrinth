import { components } from "@/app/backend";
import { AllPlayerStates, GameState } from "labyrinth-game-logic";
import React from "react";
import { getBotName } from "./LabyrinthGameUI";

type GamePlayer = components["schemas"]["PlayerPlaysGame"];
type BotType = components["schemas"]["PlayerPlaysGame"]["botType"];

interface PlayerResult {
  gamePlayer: GamePlayer;
  foundTreasures: number;
  place: number;
}

function generateResults(
  gameState: GameState,
  gamePlayers: GamePlayer[]
): PlayerResult[] {
  const results: PlayerResult[] = [];
  let winner: PlayerResult | null = null;
  for (const gamePlayer of gamePlayers) {
    const playerState = gameState.allPlayerStates.getPlayerState(
      gamePlayer.playerIndex
    );
    const isWinner = gameState.getWinnerIndex() === gamePlayer.playerIndex;
    const result: PlayerResult = {
      foundTreasures: playerState.foundTreasureCount,
      gamePlayer,
      place: 1,
    };
    if (isWinner) {
      winner = result;
    } else {
      results.push(result);
    }
  }
  results.sort((a, b) => b.foundTreasures - a.foundTreasures);
  if (winner !== null) {
    results.unshift(winner);
  }
  let place = 2;
  let lastTreasureCount = -1;
  for (let i = 1; i < results.length; i++) {
    const result = results[i];
    if (result.foundTreasures !== lastTreasureCount) {
      lastTreasureCount = result.foundTreasures;
      place = i + 1;
    }
    results[i].place = place;
  }
  return results;
}

interface Props {
  gameState: GameState;
  gamePlayers: GamePlayer[];
}
export default function GameResults({ gameState, gamePlayers }: Props) {
  const results = generateResults(gameState, gamePlayers);
  const winner = results[0];
  return (
    <div className="p-4">
      <p className="text-center p-4 text-2xl">
        <b>Game results</b>
      </p>
      <p className="text-center">
        <b className="text-xl text-amber-400">
          {winner?.gamePlayer.user?.username ??
            getBotName(winner?.gamePlayer.id ?? "")}
        </b>{" "}
        <span>Won the game!</span>
      </p>
      <div className="flex justify-center">
        <div className="mt-2 flex flex-col ">
          {results.map((result, i) => (
            <div
              key={i}
              className="odd:bg-gray-700 p-1 flex justify-between gap-10 rounded"
            >
              <div className="flex gap-2">
                <div>#{result.place}</div>
                <div
                  className={
                    (result.place === 1
                      ? "text-amber-400"
                      : result.place === 2
                        ? "text-neutral-200"
                        : result.place === 3
                          ? "text-amber-700"
                          : "") + " text-lg"
                  }
                >
                  {result.gamePlayer.user?.username ??
                    getBotName(result.gamePlayer.id ?? "")}
                </div>
              </div>
              <div className="text-right">
                found{" "}
                <span className="bg-neutral-500 rounded p-1">
                  {result.place === 1
                    ? "all " + result.foundTreasures
                    : result.foundTreasures}
                </span>{" "}
                treasures
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
