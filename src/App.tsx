import { useCallback, useState } from "react";
import { Nav } from "./components/Nav";
import { Oracle, OracleTrigger } from "./components/Oracle";
import { Hero } from "./sections/Hero";
import { Missions } from "./sections/Missions";
import { NeuralGrid } from "./sections/NeuralGrid";
import { FlightLog } from "./sections/FlightLog";
import { Uplink } from "./sections/Uplink";

export default function App() {
  const [oracleOpen, setOracleOpen] = useState(false);
  const openOracle = useCallback(() => setOracleOpen(true), []);
  const closeOracle = useCallback(() => setOracleOpen(false), []);

  return (
    <div className="min-h-screen bg-void text-ink">
      <a
        href="#missions"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[110] focus:rounded-md focus:bg-bio focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:font-bold focus:text-void"
      >
        Skip to missions
      </a>

      <Nav onOracle={openOracle} />

      <main>
        <Hero onOracle={openOracle} />
        <Missions />
        <NeuralGrid />
        <FlightLog />
        <Uplink />
      </main>

      <OracleTrigger onOpen={openOracle} hidden={oracleOpen} />
      <Oracle open={oracleOpen} onClose={closeOracle} />
    </div>
  );
}
