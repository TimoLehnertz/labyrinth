"use client";
import React from "react";
import PrimaryButton from "@/app/_components/buttons/PrimaryButton";
import Labyrinth from "@/app/_components/Labyrinth/Labyrinth";
import { client } from "../../clientAPI";
import { useRouter } from "next/navigation";
import { Game } from "labyrinth-game-logic";
import { generateRandomSeed } from "./[gameID]/lobby/GameSettings";
import toast from "react-hot-toast";

export default function Page() {
  const router = useRouter();
  if (!client.useIsLoggedIn()) {
    router.push("/");
  }
  const startAIGame = async () => {
    const gameSetup = Game.getDefaultSetup();
    gameSetup.seed = generateRandomSeed();
    const res = await client.api.POST("/game", {
      body: {
        gameSetup,
        visibility: "private",
      },
    });
    if (res.error) {
      toast("Failed to create game");
    } else {
      router.push(`/play/${res.data.gameID}/lobby`);
    }
  };
  return (
    <div className="p-2">
      <h1 className="text-3xl text-center">Play the crazy labyrinth!</h1>
      <div className="flex justify-center mt-10">
        <div className="flex flex-col space-y-5 w-64">
          <PrimaryButton href="/play/online">Play online</PrimaryButton>
          <PrimaryButton onClick={startAIGame}>Challenge the AI</PrimaryButton>
        </div>
      </div>
      <div className="flex flex-row justify-center">
        <Labyrinth boardHeight={7} boardWidth={7} seed="seed"></Labyrinth>
      </div>
    </div>
  );
}
