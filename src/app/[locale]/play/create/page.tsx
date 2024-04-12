"use client";
import React, { useEffect, useState } from "react";
import PrimaryButton from "@/app/_components/buttons/PrimaryButton";
import Labyrinth from "@/app/_components/Labyrinth/Labyrinth";
import { client } from "@/app/clientAPI";
import { Game } from "labyrinth-game-logic";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface VisibilityInterface {
  label: string;
  value: "public" | "private" | "friends";
  hint: string;
}

const options: VisibilityInterface[] = [
  { label: "Public", value: "public", hint: "Everybody can join your game" },
  {
    label: "Friends only",
    value: "friends",
    hint: "Only your friends and invited players can join",
  },
  {
    label: "Private",
    value: "private",
    hint: "Only invited players and players with your link can join",
  },
];

export default function Page() {
  const router = useRouter();
  const [visibility, setVisibility] = useState<VisibilityInterface>(options[0]);

//   useEffect(() => {
    
//   }, []);

  const visibilityChanged = (e: any) => {
    for (const option of options) {
      if (option.value === e.target.value) {
        setVisibility(option);
        return;
      }
    }
  };
  const create = async () => {
    const response = await client.api.POST("/game", {
      body: {
        visibility: visibility.value,
        gameSetup: Game.getDefaultSetup(),
      },
    });
    if (response.error) {
      toast.error("Game creation failed");
    }

    const gameID = response.data?.gameID;
    router.push(`/play/${gameID}`);
  };

  return (
    <div>
      <div className="flex flex-col space-y-5 items-start">
        <h1 className="text-3xl text-center">Create game</h1>
        <div className="flex flex-col space-y-3 justify-start items-start">
          <select
            name="visibility"
            id="visibility"
            onChange={visibilityChanged}
            className="text-black"
          >
            {options.map((e, i) => {
              return (
                <option key={i} value={e.value}>
                  {e.label}
                </option>
              );
            })}
          </select>
          <p>{visibility.hint}</p>
        </div>
        <p>Game settings can be set later</p>
      </div>
      <div className="flex flex-row justify-center mt-10">
        <Labyrinth boardHeight={7} boardWidth={7} seed="sd"></Labyrinth>
      </div>
      <div className="flex flex-col items-end mt-5 p-2">
        <PrimaryButton onClick={create}>Create game</PrimaryButton>
      </div>
    </div>
  );
}
