"use client";
import { components } from "@/app/backend";
import { client, User } from "@/app/clientAPI";
import React, { useEffect, useState } from "react";
import { useGame } from "./lobby/GameSettings";
import { useRouter } from "next/navigation";
import { useEntity } from "@/app/utils/UseEntity";
import GamePlayerArea from "./GamePlayerArea";
import { Game, GameState, Move } from "labyrinth-game-logic";
import LabyrinthMoveCreator from "@/app/_components/Labyrinth/LabyrinthMoveCreator";
import toast from "react-hot-toast";
import SecondaryButton from "@/app/_components/buttons/SecondaryButton";
import TreasuresArea from "./TreasuresArea";

type GamePlayer = components["schemas"]["PlayerPlaysGame"];
type DbGame = components["schemas"]["Game"];

const botNames: string[] = [
  "Bot Bobert",
  "Botzilla",
  "Botsworth",
  "Botimus Prime",
  "Botch McBotface",
  "Botrick",
  "Botrickson",
  "Botley",
  "Botilda",
  "Botanica",
  "Botamus",
  "Botrickard",
  "Botley McBotface",
  "Botley McBotterson",
  "Botley Von Bottington",
  "Botley Botson",
  "Botford",
  "Botilda Bottington",
  "Bottington McBotface",
  "Botastic",
];

export function getPlayerNameElem(gamePlayer: GamePlayer) {
  if (gamePlayer.botType === "player") {
    return <span>{gamePlayer.user?.username}</span>;
  } else {
    return (
      <span>
        {botNames[gamePlayer.playerIndex]}
        <span className="text-orange-400"> (Bot)</span>
      </span>
    );
  }
}

interface Props {
  initialGame: DbGame;
  user: User;
  ownPlayerIndex: number | null;
}
export default function LabyrinthGameUI({
  initialGame,
  user,
  ownPlayerIndex,
}: Props) {
  const [dbGame, updateGame, allowChange, allowEdit] = useGame(
    initialGame,
    user
  );

  const [gamePlayers] = useEntity<GamePlayer>("game", "getPlayers", dbGame.id);
  const router = useRouter();
  const gameState = Game.buildFromString(dbGame.gameState).gameState;
  if (!dbGame.started) {
    router.push(`/play/${dbGame.id}/lobby`);
  }
  const onMove = async (move: Move) => {
    if (ownPlayerIndex === null) {
      return;
    }
    const res = await client.api.POST("/game/move", {
      params: {
        query: {
          game: dbGame.id,
        },
      },
      body: {
        collectedTreasure: move.collectedTreasure?.id ?? null,
        from: move.from,
        to: move.to,
        fromShiftPosition: move.fromShiftPosition,
        toShiftPosition: move.toShiftPosition,
        playerIndex: ownPlayerIndex,
        rotateBeforeShift: move.rotateBeforeShift,
      },
    });
    if (res.error) {
      toast.error(res.error.message);
    }
  };

  let playerToMove: GamePlayer | null = null;
  let ownPlayer: GamePlayer | null = null;
  for (const gamePlayer of gamePlayers) {
    if (
      gamePlayer.playerIndex === gameState.allPlayerStates.playerIndexToMove
    ) {
      playerToMove = gamePlayer;
    }
    if (gamePlayer.userID === user.id) {
      ownPlayer = gamePlayer;
    }
  }
  const myTurn = playerToMove?.userID === user.id;
  return (
    <div>
      <p>Players</p>
      <GamePlayerArea
        gamePlayers={gamePlayers}
        playerToMove={gameState.allPlayerStates.playerIndexToMove}
      />
      <LabyrinthMoveCreator
        onMove={onMove}
        gameState={gameState}
        ownPlayerIndex={ownPlayerIndex}
      ></LabyrinthMoveCreator>
      <div className="bg-slate-700 flex items-center p-1 justify-between mt-2">
        <div className="flex gap-2">
          <SecondaryButton>Prev</SecondaryButton>
          <SecondaryButton>Next</SecondaryButton>
          <span>{gameState.historyMoves.length} Moves</span>
        </div>
        <p className="text-xl">
          {myTurn ? (
            <>Its your turn</>
          ) : (
            <>{playerToMove && getPlayerNameElem(playerToMove)} is to move</>
          )}
        </p>
      </div>
      {ownPlayer !== null ? (
        <TreasuresArea gamePlayer={ownPlayer} gameState={gameState} />
      ) : (
        <></>
      )}
    </div>
  );
}
