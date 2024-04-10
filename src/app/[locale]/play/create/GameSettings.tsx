import {
  Board,
  CardRatios,
  Game,
  GameSetup,
  TreasureCardChances,
} from "labyrinth-game-logic";
import React, { ChangeEvent, useEffect, useState } from "react";
import { activities, animalNames } from "./animals";
import CardRatiosSettings from "./CardRatiosSettings";
import TreasureDistributionSettings from "./TreasureDistributionSettings";
import Labyrinth from "@/app/_components/Labyrinth/Labyrinth";
import PrimaryButton from "@/app/_components/buttons/PrimaryButton";

function getSizeOptions() {
  const validSizes = Board.getValidSizes(14);
  return validSizes.map((size, i) => {
    return (
      <option value={size} key={i}>
        {size}
      </option>
    );
  });
}

function generateRandomSeed() {
  const animal1Index = Math.floor(Math.random() * 0.999 * animalNames.length);
  const activityIndex = Math.floor(Math.random() * 0.999 * activities.length);
  const animal2Index = Math.floor(Math.random() * 0.999 * animalNames.length);
  return `A ${animalNames[animal1Index].toLowerCase()} ${activities[activityIndex]} ${animalNames[animal2Index].toLowerCase()}`;
}

interface Props {
  readonly: boolean;
}

export default function GameSettings({ readonly }: Props) {
  const [gameSetup, setGameSetup] = useState<GameSetup>(Game.getDefaultSetup());

  useEffect(() => {
    const newGameSetup = { ...gameSetup };
    newGameSetup.seed = generateRandomSeed();
    setGameSetup(newGameSetup);
  }, []);

  const cardRatiosChanged = (cardRatios: CardRatios) => {
    const newGameSetup = { ...gameSetup };
    newGameSetup.cardsRatio = cardRatios;
    setGameSetup(newGameSetup);
  };
  const treasureDistributionChanged = (
    treasureCardChances: TreasureCardChances
  ) => {
    const newGameSetup = { ...gameSetup };
    newGameSetup.treasureCardChances = treasureCardChances;
    setGameSetup(newGameSetup);
  };

  const widthChanged = (event: ChangeEvent<HTMLSelectElement>) => {
    const newGameSetup = { ...gameSetup };
    newGameSetup.boardWidth = parseInt(event.target.value);
    setGameSetup(newGameSetup);
  };

  const heightChanged = (event: ChangeEvent<HTMLSelectElement>) => {
    const newGameSetup = { ...gameSetup };
    newGameSetup.boardWidth = parseInt(event.target.value);
    newGameSetup.playerCount = Board.getMaxPlayerCount(
      newGameSetup.boardWidth,
      newGameSetup.boardHeight
    );
    setGameSetup(newGameSetup);
  };

  const regenerateSeed = () => {
    const newGameSetup = { ...gameSetup };
    newGameSetup.seed = generateRandomSeed();
    newGameSetup.playerCount = Board.getMaxPlayerCount(
      newGameSetup.boardWidth,
      newGameSetup.boardHeight
    );
    setGameSetup(newGameSetup);
  };

  const seedChanged = (event: ChangeEvent<HTMLInputElement>) => {
    const newGameSetup = { ...gameSetup };
    newGameSetup.seed = event.target.value;
    setGameSetup(newGameSetup);
  };
  return (
    <div>
      <details>
        <summary>Advanced game settings</summary>
        <br />
        <CardRatiosSettings
          readonly={readonly}
          value={gameSetup.cardsRatio}
          onChange={cardRatiosChanged}
        />
        <br />
        <TreasureDistributionSettings
          readonly={readonly}
          value={gameSetup.treasureCardChances}
          onChange={treasureDistributionChanged}
        />
      </details>
      <br />
      <p className="text-xl text-center">Map editor</p>
      <br />
      <div className="flex flex-row space-x-10 justify-center">
        <div className="flex flex-col space-y-2">
          <div>
            <label htmlFor="width" className="mr-2">
              Width
            </label>
            <select
              name="width"
              id="width"
              onChange={widthChanged}
              className="text-black"
            >
              {getSizeOptions()}
            </select>
          </div>
          <div>
            <label htmlFor="height" className="mr-2">
              height
            </label>
            <select
              name="height"
              id="height"
              onChange={heightChanged}
              className="text-black"
            >
              {getSizeOptions()}
            </select>
          </div>
        </div>
        <div>{gameSetup.playerCount} Players</div>
      </div>
      <br />
      <div className="flex flex-col gap-2">
        <label htmlFor="seed" className="text-xl text-center">
          Seed
        </label>
        <input
          type="text"
          className="w-72 bg-gray-800 text-white p-2 rounded"
          value={gameSetup.seed}
          onChange={seedChanged}
        />
        <PrimaryButton type="button" onClick={regenerateSeed}>
          Regenerate
        </PrimaryButton>
      </div>
      <div className="flex flex-row justify-center mt-10">
        <Labyrinth
          seed={gameSetup.seed}
          boardWidth={gameSetup.boardWidth}
          boardHeight={gameSetup.boardHeight}
        ></Labyrinth>
      </div>
    </div>
  );
}
