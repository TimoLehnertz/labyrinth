import React, { useState } from "react";
import { CardRatios, Game, TileType } from "labyrinth-game-logic";
import NumberInput from "@/app/_components/NumberInput";
import SecondaryButton from "@/app/_components/buttons/SecondaryButton";

function scale(ratio: CardRatios, keep: TileType): CardRatios {
  // Get the value to preserve
  let preservedValue: number;
  switch (keep) {
    case TileType.L:
      preservedValue = ratio.lCards;
      break;
    case TileType.STREIGHT:
      preservedValue = ratio.streightCards;
      break;
    case TileType.T:
      preservedValue = ratio.tCards;
      break;
  }

  let totalSum = ratio.streightCards + ratio.tCards + ratio.lCards;

  // Calculate the total sum of the other values
  let othersSum = 0;
  switch (keep) {
    case TileType.L:
      othersSum = ratio.streightCards + ratio.tCards;
      break;
    case TileType.STREIGHT:
      othersSum = ratio.lCards + ratio.tCards;
      break;
    case TileType.T:
      othersSum = ratio.streightCards + ratio.lCards;
      break;
  }
  if (othersSum === 0) {
    ratio.lCards += keep === TileType.L ? 0 : 0.1;
    ratio.tCards += keep === TileType.T ? 0 : 0.1;
    ratio.streightCards += keep === TileType.STREIGHT ? 0 : 0.1;
    return scale(ratio, keep);
  }
  const scaling = (1 - preservedValue) / othersSum;
  switch (keep) {
    case TileType.L:
      return {
        lCards: ratio.lCards,
        streightCards: ratio.streightCards * scaling,
        tCards: ratio.tCards * scaling,
      };
    case TileType.STREIGHT:
      return {
        lCards: ratio.lCards * scaling,
        streightCards: ratio.streightCards,
        tCards: ratio.tCards * scaling,
      };
    case TileType.T:
      return {
        lCards: ratio.lCards * scaling,
        streightCards: ratio.streightCards * scaling,
        tCards: ratio.tCards,
      };
  }
}

interface Props {
  value: CardRatios;
  readonly: boolean;
  onChange?: (cardsRatio: CardRatios) => void;
}
export default function CardRatiosSettings({
  value,
  readonly,
  onChange,
}: Props) {
  const [cardsRatio, setCardsRatio] = useState<CardRatios>(value);
  const lChanged = (value: number) => {
    let newRatio = { ...cardsRatio };
    newRatio.lCards = value / 100;
    newRatio = scale(newRatio, TileType.L);
    setCardsRatio(newRatio);
    onChange?.(newRatio);
  };
  const tChanged = (value: number) => {
    let newRatio = { ...cardsRatio };
    newRatio.tCards = value / 100;
    newRatio = scale(newRatio, TileType.T);
    setCardsRatio(newRatio);
    onChange?.(newRatio);
  };
  const streightChanged = (value: number) => {
    let newRatio = { ...cardsRatio };
    newRatio.streightCards = value / 100;
    newRatio = scale(newRatio, TileType.STREIGHT);
    setCardsRatio(newRatio);
    onChange?.(newRatio);
  };
  const reset = () => {
    const defaultSetup = Game.getDefaultSetup();
    setCardsRatio(defaultSetup.cardsRatio);
  };
  return (
    <div>
      <p className="text-xl text-center mb-2">Ratio of cards</p>
      <div className="flex flex-col space-y-4">
        <NumberInput
          label="L cards"
          name="ratio-l"
          value={Math.round(cardsRatio.lCards * 100)}
          isPercent={true}
          onChange={lChanged}
          readonly={readonly}
        ></NumberInput>
        <NumberInput
          label="T cards"
          name="ratio-t"
          value={Math.round(cardsRatio.tCards * 100)}
          isPercent={true}
          onChange={tChanged}
          readonly={readonly}
        ></NumberInput>
        <NumberInput
          label="Straight cards"
          name="ratio-straight"
          value={Math.round(cardsRatio.streightCards * 100)}
          isPercent={true}
          onChange={streightChanged}
          readonly={readonly}
        ></NumberInput>
        <SecondaryButton type="button" onClick={reset}>
          Reset to default
        </SecondaryButton>
      </div>
    </div>
  );
}
