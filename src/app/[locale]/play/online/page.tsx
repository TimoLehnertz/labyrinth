import React from "react";
import PrimaryButton from "@/app/_components/buttons/PrimaryButton";
import Labyrinth from "@/app/_components/Labyrinth/Labyrinth";

export default function page() {
  return (
    <div>
      <h1 className="text-3xl text-center">Play online</h1>
      <div className="flex justify-center mt-10">
        <div className="flex flex-row space-x-5">
          <PrimaryButton href="/play/create">Create game</PrimaryButton>
          <PrimaryButton href="/play/join">Join game</PrimaryButton>
        </div>
      </div>
      <div className="flex flex-row justify-center mt-10">
        <Labyrinth boardHeight={7} boardWidth={7} seed="ds"></Labyrinth>
      </div>
    </div>
  );
}
