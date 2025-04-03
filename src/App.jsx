import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { BingoCard } from "./components/BingoCard";
import { NumberGrid } from "./components/NumberGrid";
import { StakeSelection } from "./components/StakeSelection";
import { useBingoGame } from "./hooks/useBingoGame";
import { useState } from "react";
import "./index.css";

function App() {
  const {
    selectedNumber,
    calledNumbers,
    currentCall,
    timeLeft,
    isCalling,
    hasWon,
    generateCard,
    callNumber,
    claimBingo,
    markNumber,
    markedNumbers,
  } = useBingoGame();

  const [stake, setStake] = useState(null);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<StakeSelection setStake={setStake} />} />
        <Route
          path="/number-grid"
          element={<NumberGrid callNumber={callNumber} stake={stake} />}
        />
        <Route
          path="/card/:number"
          element={
            <BingoCard
              generateCard={generateCard}
              calledNumbers={calledNumbers}
              currentCall={currentCall}
              timeLeft={timeLeft}
              isCalling={isCalling}
              hasWon={hasWon}
              callNumber={callNumber}
              claimBingo={claimBingo}
              markNumber={markNumber}
              markedNumbers={markedNumbers}
              stake={stake}
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
