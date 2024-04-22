"use client";
import { components } from "@/app/backend";
import { client, User } from "@/app/clientAPI";
import React, { useCallback, useEffect, useState } from "react";
import { useGame } from "./lobby/GameSettings";
import { useRouter } from "next/navigation";
import { useEntity } from "@/app/utils/UseEntity";
import GamePlayerArea from "./GamePlayerArea";
import {
  Game,
  GameState,
  Move,
  RandomNumberGenerator,
} from "labyrinth-game-logic";
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

type BotType = components["schemas"]["PlayerPlaysGame"]["botType"];

export function getBotName(playerID: string): string {
  const generator = new RandomNumberGenerator(playerID);
  const randomIndex = Math.floor(generator.rand() * botNames.length);
  return botNames[randomIndex];
}

export function parseBotType(botType: BotType) {
  switch (botType) {
    case "weak_bot":
      return "Weak bot";
    case "medium_bot":
      return "Medium bot";
    case "strong_bot":
      return "String bot";
    default:
      return "bot";
  }
}

export function getPlayerNameElem(gamePlayer: GamePlayer) {
  if (gamePlayer.botType === null && gamePlayer.user !== null) {
    return <span>{gamePlayer.user.username}</span>;
  } else {
    return (
      <span>
        {getBotName(gamePlayer.id)}
        <span className="text-orange-400">
          {" "}
          ({parseBotType(gamePlayer.botType)})
        </span>
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
  const [dbGame] = useGame(initialGame, user);
  const game = Game.buildFromString(dbGame.gameState);
  const router = useRouter();
  if (!dbGame.started) {
    router.push(`/play/${dbGame.id}/lobby`);
  }
  const [gamePlayers] = useEntity<GamePlayer>("game", "getPlayers", dbGame.id);
  const [isHistory, setHistory] = useState(false);
  const [displayGameStateStr, setDisplayGameStateStr] = useState<string>(
    JSON.stringify(game.gameState)
  );
  const displayGameState = GameState.create(JSON.parse(displayGameStateStr));
  const [displayMoveIndex, setDisplayMoveIndex] = useState(
    game.gameState.historyMoves.length
  );
  const [displayPlayer, setDisplayPlayer] = useState<GamePlayer | null>(null);

  if (dbGame.finished && !isHistory) {
    console.log("finished");
    setHistory(true);
  }

  // update the displayed game state based on the displayMoveIndex
  useEffect(() => {
    const undoMoves = game.gameState.historyMoves.length - displayMoveIndex;
    let newDisplayGameState = game.gameState;
    for (let i = 0; i < undoMoves; i++) {
      newDisplayGameState = newDisplayGameState.undoMove().newGameState;
    }
    const testGame = Game.buildFromSetup();
    setDisplayGameStateStr(JSON.stringify(newDisplayGameState));
    setHistory(undoMoves !== 0);
  }, [displayMoveIndex, game.gameState]);

  // Stay at live version of game if not viewed as history
  useEffect(() => {
    setDisplayMoveIndex((oldVal) => {
      if (oldVal === game.gameState.historyMoves.length - 1) {
        return game.gameState.historyMoves.length;
      } else {
        return oldVal;
      }
    });
  }, [game.gameState.historyMoves.length]);

  const nextMove = () => {
    if (displayMoveIndex >= game.gameState.historyMoves.length) {
      return;
    }
    setDisplayMoveIndex(displayMoveIndex + 1);
  };

  const prevMove = () => {
    if (displayMoveIndex === 0) {
      return;
    }
    setDisplayMoveIndex(displayMoveIndex - 1);
  };

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
      gamePlayer.playerIndex ===
      displayGameState.allPlayerStates.playerIndexToMove
    ) {
      playerToMove = gamePlayer;
    }
    if (gamePlayer.userID === user.id) {
      ownPlayer = gamePlayer;
    }
  }
  if (displayPlayer === null && ownPlayer !== null) {
    setDisplayPlayer(ownPlayer);
  }
  const playerClicked = (gamePlayer: GamePlayer) => {
    setDisplayPlayer(gamePlayer);
  };
  const myTurn = playerToMove?.userID === user.id;
  return (
    <div className="flex xl:flex-row flex-col justify-center xl:gap-2">
      <div className="flex-grow-[4] bg-neutral-800 p-1 rounded-md">
        <LabyrinthMoveCreator
          onMove={onMove}
          gameState={displayGameState}
          ownPlayerIndex={isHistory ? null : ownPlayerIndex}
        ></LabyrinthMoveCreator>
      </div>
      <div className="flex-grow-[2]">
        <div className="bg-slate-700 flex items-center gap-2 p-1 justify-start">
          <div className="flex gap-2">
            <SecondaryButton onClick={prevMove}>Prev</SecondaryButton>
            <SecondaryButton onClick={nextMove}>Next</SecondaryButton>
            {isHistory ? (
              <p>
                {displayGameState.historyMoves.length}/
                {game.gameState.historyMoves.length} Moves
              </p>
            ) : (
              <p>{game.gameState.historyMoves.length} Moves</p>
            )}
          </div>
          <p className="text-xl">
            {myTurn ? (
              <>Its your turn</>
            ) : (
              <>{playerToMove && getPlayerNameElem(playerToMove)} is to move</>
            )}
          </p>
        </div>
        <div>
          <GamePlayerArea
            gamePlayers={gamePlayers}
            playerToMove={displayGameState.allPlayerStates.playerIndexToMove}
            playerClicked={playerClicked}
          />
        </div>
        {displayPlayer !== null ? (
          <div className="mb-10">
            <TreasuresArea
              gamePlayer={displayPlayer}
              gameState={displayGameState}
            />
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
