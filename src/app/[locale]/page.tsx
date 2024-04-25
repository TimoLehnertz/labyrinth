import Labyrinth from "../_components/Labyrinth/Labyrinth";

export default function Index() {
  return (
    <div className="p-2">
      <h1 className="text-center text-2xl mt-10">The crazy Labyrinth</h1>
      <div className="flex flex-row justify-center mt-10">
        <Labyrinth boardHeight={7} boardWidth={7} seed="seed"></Labyrinth>
      </div>
    </div>
  );
}
