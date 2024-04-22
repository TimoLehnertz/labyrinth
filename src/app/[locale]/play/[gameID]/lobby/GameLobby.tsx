"use client";
import { components } from "@/app/backend";
import { useEntity } from "@/app/utils/UseEntity";
import React, { useEffect, useState } from "react";
import GamePlayer from "./GamePlayer";
import PrimaryButton from "@/app/_components/buttons/PrimaryButton";
import SecondaryButton from "@/app/_components/buttons/SecondaryButton";
import { client } from "@/app/clientAPI";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

type GamePlayer = components["schemas"]["PlayerPlaysGame"];
type Game = components["schemas"]["Game"];
type BotType = components["schemas"]["PlayerPlaysGame"]["botType"];

interface Props {
  game: Game;
}
export default function GameLobby({ game }: Props) {
  const router = useRouter();
  const [gamePlayers] = useEntity<GamePlayer>("game", "getPlayers", game.id);
  const user = client.useUser();
  const [isReady, setReady] = useState<boolean>(false);
  const [isJoined, setJoined] = useState<boolean>(false);
  const [isFull, setFull] = useState<boolean>(false);
  const [ownPlayer, setOwnPlayer] = useState<GamePlayer | null>(null);
  const [isHost, setHost] = useState(false);

  useEffect(() => {
    setJoined(false);
    setFull(gamePlayers.length >= JSON.parse(game.gameSetup).playerCount);
    setHost(game.ownerUserID === user?.id);
    for (const gamePlayer of gamePlayers) {
      if (gamePlayer.userID === user?.id) {
        setJoined(true);
        setReady(gamePlayer.ready);
        setOwnPlayer(gamePlayer);
        break;
      }
    }
  }, [gamePlayers, game, user?.id]);

  const toggleReady = async () => {
    const res = await client.api.PUT("/game/ready", {
      params: {
        query: {
          game: game.id,
          ready: !isReady,
        },
      },
    });
    if (res.error) {
      toast.error("an error occurred");
    }
  };
  const leave = async () => {
    if (ownPlayer === null) {
      return;
    }
    const res = await client.api.DELETE("/game/leave", {
      params: {
        query: {
          gameID: game.id,
          userIndex: ownPlayer.playerIndex,
        },
      },
    });
    if (res.error) {
      toast("an error occured");
    } else {
      //   router.push("/");
    }
  };
  const join = async () => {
    const res = await client.api.POST("/game/join", {
      params: {
        query: {
          gameID: game.id,
        },
      },
    });
    if (res.error) {
      toast("an error occured");
    }
  };
  const addBot = async (botType: BotType) => {
    if (botType === null) {
      return;
    }
    const res = await client.api.POST("/game/addBot", {
      params: {
        query: {
          botType,
          gameID: game.id,
        },
      },
    });
    if (res.error) {
      toast(res.error.message);
    }
  };
  return (
    <div className="bg-gray-700 p-3">
      <div className="flex flex-row justify-between">
        <h2 className="text-xl text-center">Lobby</h2>
        {isJoined ? (
          <SecondaryButton onClick={leave}>Leave</SecondaryButton>
        ) : !isFull ? (
          <PrimaryButton onClick={join}>Join</PrimaryButton>
        ) : (
          <></>
        )}
      </div>
      <div className="flex flex-col gap-2">
        {gamePlayers.map((player, i) => (
          <GamePlayer gamePlayer={player} game={game} key={i}></GamePlayer>
        ))}
      </div>
      <div className="mt-5 flex gap-2">
        {isJoined ? (
          <PrimaryButton onClick={toggleReady}>
            {isReady ? "Ready" : "Not ready"}
          </PrimaryButton>
        ) : (
          <></>
        )}
        {isJoined && isHost && !isFull ? (
          <>
            <SecondaryButton
              className="ml-4"
              onClick={() => addBot("weak_bot")}
            >
              Add weak bot
            </SecondaryButton>
            <SecondaryButton onClick={() => addBot("medium_bot")}>
              Add medium bot
            </SecondaryButton>
            <SecondaryButton onClick={() => addBot("strong_bot")}>
              Add strong bot
            </SecondaryButton>
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
