import React, { useState } from "react";
import { Game, TreasureCardChances } from "labyrinth-game-logic";
import NumberInput from "@/app/_components/NumberInput";
import SecondaryButton from "@/app/_components/buttons/SecondaryButton";

interface Props {
  value: TreasureCardChances;
  readonly: boolean;
  onChange?: (cardsRatio: TreasureCardChances) => void;
}
export default function TreasureDistributionSettings({
  value,
  readonly,
  onChange,
}: Props) {
  const [treasureChances, setTreasureChances] =
    useState<TreasureCardChances>(value);
  const lChanged = (value: number) => {
    let newTreasureChances = { ...treasureChances };
    newTreasureChances.lCardTreasureChance = value / 100;
    setTreasureChances(newTreasureChances);
    onChange?.(newTreasureChances);
  };
  const tChanged = (value: number) => {
    let newTreasureChances = { ...treasureChances };
    newTreasureChances.tCardTreasureChance = value / 100;
    setTreasureChances(newTreasureChances);
    onChange?.(newTreasureChances);
  };
  const streightChanged = (value: number) => {
    let newTreasureChances = { ...treasureChances };
    newTreasureChances.streightCardTreasureChance = value / 100;
    setTreasureChances(newTreasureChances);
    onChange?.(newTreasureChances);
  };
  const fixChanged = (value: number) => {
    let newTreasureChances = { ...treasureChances };
    newTreasureChances.fixCardTreasureChance = value / 100;
    setTreasureChances(newTreasureChances);
    onChange?.(newTreasureChances);
  };
  const reset = () => {
    const defaultSetup = Game.getDefaultSetup();
    setTreasureChances(defaultSetup.treasureCardChances);
  };
  return (
    <div>
      <p className="text-xl text-center mb-2">Treasure card chances</p>
      <div className="flex flex-col space-y-4">
        <NumberInput
          label="Fix cards"
          name="ratio-l"
          value={Math.round(treasureChances.fixCardTreasureChance * 100)}
          isPercent={true}
          onChange={fixChanged}
          readonly={readonly}
        ></NumberInput>
        <NumberInput
          label="L cards"
          name="ratio-t"
          value={Math.round(treasureChances.lCardTreasureChance * 100)}
          isPercent={true}
          onChange={lChanged}
          readonly={readonly}
        ></NumberInput>
        <NumberInput
          label="Straight cards"
          name="ratio-straight"
          value={Math.round(treasureChances.streightCardTreasureChance * 100)}
          isPercent={true}
          onChange={streightChanged}
          readonly={readonly}
        ></NumberInput>
        <NumberInput
          label="T cards"
          name="ratio-straight"
          value={Math.round(treasureChances.tCardTreasureChance * 100)}
          isPercent={true}
          onChange={tChanged}
          readonly={readonly}
        ></NumberInput>
        <SecondaryButton type="button" onClick={reset}>
          Reset to default
        </SecondaryButton>
      </div>
    </div>
  );
}
