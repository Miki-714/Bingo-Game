import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { CountdownTimer } from "../CountdownTimer";

export function BingoCard({
  generateCard,
  calledNumbers,
  currentCall,
  timeLeft,
  isCalling,
  hasWon,
  callNumber,
  claimBingo,
  markNumber,
  markedNumbers,
}) {
  const { number } = useParams();
  const navigate = useNavigate();
  const card = generateCard(Number(number));
  const [selectedPattern, setSelectedPattern] = useState("line");
  const [validationError, setValidationError] = useState("");
  const [highlightedNumber, setHighlightedNumber] = useState(null);

  useEffect(() => {
    if (currentCall) {
      setHighlightedNumber(currentCall);
      const timer = setTimeout(() => setHighlightedNumber(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [currentCall]);

  const toggleNumber = (num) => {
    markNumber(num);
  };

  const handleBingoClaim = () => {
    setValidationError("");
    const isValid = claimBingo(selectedPattern, card);

    if (!isValid) {
      setValidationError(
        "Bingo failed! You must mark the current number when called."
      );
      setTimeout(() => setValidationError(""), 3000);
    }
  };

  const handleNewGame = () => {
    callNumber(Math.floor(Math.random() * 150) + 1);
    navigate("/");
  };

  // Generate all 75 bingo numbers grouped by letter
  const allBingoNumbers = {
    B: Array.from({ length: 15 }, (_, i) => i + 1),
    I: Array.from({ length: 15 }, (_, i) => i + 16),
    N: Array.from({ length: 15 }, (_, i) => i + 31),
    G: Array.from({ length: 15 }, (_, i) => i + 46),
    O: Array.from({ length: 15 }, (_, i) => i + 61),
  };

  return (
    <LayoutContainer>
      <TopPanel>
        <LeftNumbersPanel>
          <AllNumbersTitle>All Bingo Numbers</AllNumbersTitle>
          <HorizontalNumbersGrid>
            {Object.entries(allBingoNumbers).map(([letter, numbers]) => (
              <NumberRow key={letter}>
                <RowHeader>{letter}</RowHeader>
                {numbers.map((num) => (
                  <HorizontalNumber
                    key={num}
                    $called={calledNumbers.has(num)}
                    $current={num === currentCall}
                  >
                    {num}
                  </HorizontalNumber>
                ))}
              </NumberRow>
            ))}
          </HorizontalNumbersGrid>
        </LeftNumbersPanel>

        <RightCurrentNumber>
          {isCalling && currentCall && (
            <CurrentNumberContainer>
              <CurrentNumberLabel>CURRENT NUMBER</CurrentNumberLabel>
              <CurrentNumberCircle
                $color={
                  letterColors[
                    currentCall <= 15
                      ? "B"
                      : currentCall <= 30
                      ? "I"
                      : currentCall <= 45
                      ? "N"
                      : currentCall <= 60
                      ? "G"
                      : "O"
                  ]
                }
              >
                {currentCall <= 15
                  ? "B"
                  : currentCall <= 30
                  ? "I"
                  : currentCall <= 45
                  ? "N"
                  : currentCall <= 60
                  ? "G"
                  : "O"}
                <CurrentNumber>{currentCall}</CurrentNumber>
              </CurrentNumberCircle>
            </CurrentNumberContainer>
          )}
        </RightCurrentNumber>
      </TopPanel>

      <BottomPanel>
        <Header>
          <Title>Bingo Card #{number}</Title>

          <GameStatus>
            {timeLeft > 0 ? (
              <CountdownTimer timeLeft={timeLeft} />
            ) : hasWon ? (
              <WinMessage>
                <Confetti>
                  {Array.from({ length: 30 }).map((_, i) => (
                    <ConfettiPiece key={i} $index={i} />
                  ))}
                </Confetti>
                BINGO! YOU WON!
              </WinMessage>
            ) : (
              <CurrentCall>
                {isCalling ? `Waiting for next number...` : "Game complete"}
              </CurrentCall>
            )}
          </GameStatus>
        </Header>

        <CardContainer>
          <CompactBingoGrid $hasWon={hasWon}>
            <CompactLetterRow>
              {["B", "I", "N", "G", "O"].map((l) => (
                <CompactLetterCell key={l}>{l}</CompactLetterCell>
              ))}
            </CompactLetterRow>

            {[0, 1, 2, 3, 4].map((row) => (
              <CompactNumberRow key={row}>
                {card.map((col, colIdx) => {
                  const num = col[row];
                  const isCalled = calledNumbers.has(num);
                  const isMarked = markedNumbers.has(num);
                  const isFree = num === "FREE";
                  const isHighlighted = num === highlightedNumber;
                  const isCurrent = num === currentCall;

                  return (
                    <CompactCell
                      key={`${colIdx}-${row}`}
                      $isFree={isFree}
                      $isMarked={isMarked}
                      $isCalled={isCalled}
                      $isHighlighted={isHighlighted}
                      $isCurrent={isCurrent}
                      onClick={() => toggleNumber(num)}
                    >
                      {isFree ? (
                        <FreeSpace>FREE</FreeSpace>
                      ) : (
                        <>
                          <NumberText>{num}</NumberText>
                          {isMarked && <MarkedOverlay />}
                        </>
                      )}
                      {isHighlighted && <PulseRing />}
                      {isCurrent && !isMarked && <CurrentIndicator />}
                    </CompactCell>
                  );
                })}
              </CompactNumberRow>
            ))}
          </CompactBingoGrid>
          {timeLeft > 0 && (
            <Controls>
              <ButtonGroup>
                <SecondaryButton onClick={() => navigate("/")}>
                  ← Back
                </SecondaryButton>
                <PrimaryButton onClick={() => console.log("Primary action")}>
                  Confirm Card
                </PrimaryButton>
              </ButtonGroup>
            </Controls>
          )}
          <CardShadow />
        </CardContainer>

        <Controls>
          {timeLeft === 0 && !hasWon && (
            <ClaimSection>
              <PatternSelect
                value={selectedPattern}
                onChange={(e) => setSelectedPattern(e.target.value)}
              >
                <option value="line">Straight Line</option>
                <option value="corners">Four Corners</option>
                <option value="blackout">Full House</option>
                <option value="x">X Pattern</option>
              </PatternSelect>
              <BingoButton onClick={handleBingoClaim}>BINGO!</BingoButton>
            </ClaimSection>
          )}

          {validationError && <ErrorMessage>{validationError}</ErrorMessage>}
        </Controls>

        {hasWon && (
          <NewGameButton onClick={handleNewGame}>New Game</NewGameButton>
        )}
      </BottomPanel>
    </LayoutContainer>
  );
}

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 20px;
`;

const PrimaryButton = styled.button`
  background: #27ae60;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  font-size: 1rem;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    background: #2ecc71;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: translateY(0);
  }
`;

const SecondaryButton = styled.button`
  background: #3498db;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  font-size: 1rem;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    background: #2980b9;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: translateY(0);
  }
`;
// Animations
const pulse = keyframes`
  0% { transform: scale(0.95); opacity: 0.7; }
  70% { transform: scale(1.3); opacity: 0; }
  100% { transform: scale(1.3); opacity: 0; }
`;

const pulseGlow = keyframes`
  0% { 
    box-shadow: 0 0 0 0 rgba(255, 87, 34, 0.7),
                0 0 0 0 rgba(255, 235, 59, 0.7); 
  }
  70% { 
    box-shadow: 0 0 0 15px rgba(255, 87, 34, 0),
                0 0 0 30px rgba(255, 235, 59, 0); 
  }
  100% { 
    box-shadow: 0 0 0 0 rgba(255, 87, 34, 0),
                0 0 0 0 rgba(255, 235, 59, 0); 
  }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
  100% { transform: translateY(0px); }
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const confettiFall = keyframes`
  0% { transform: translateY(-100px) rotate(0deg); opacity: 1; }
  100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
`;

// Layout Components
const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
`;

const TopPanel = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  gap: 1rem;
  height: auto;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const LeftNumbersPanel = styled.div`
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.3);
`;

const RightCurrentNumber = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const BottomPanel = styled.div`
  flex-grow: 1;
  position: relative;
`;

// Horizontal Numbers Grid
const HorizontalNumbersGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const NumberRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.3rem;
`;

const RowHeader = styled.div`
  font-weight: bold;
  font-size: 1rem;
  color: white;
  padding: 0.3rem 0.5rem;
  background: ${(props) =>
    props.children === "B"
      ? "#3498db"
      : props.children === "I"
      ? "#2ecc71"
      : props.children === "N"
      ? "#9b59b6"
      : props.children === "G"
      ? "#e67e22"
      : "#e74c3c"};
  border-radius: 20px;
  min-width: 24px;
  text-align: center;
  margin-right: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

const HorizontalNumber = styled.div`
  padding: 0.3rem 0.5rem;
  text-align: center;
  border-radius: 20px;
  font-size: 0.8rem;
  min-width: 24px;
  background: ${(props) =>
    props.$current
      ? "#e74c3c"
      : props.$called
      ? "#2ecc71"
      : "rgba(255,255,255,0.8)"};
  color: ${(props) =>
    props.$current ? "white" : props.$called ? "white" : "#2c3e50"};
  font-weight: ${(props) => (props.$current ? "bold" : "normal")};
  box-shadow: ${(props) =>
    props.$current
      ? "0 0 8px rgba(231, 76, 60, 0.6)"
      : props.$called
      ? "0 2px 4px rgba(46, 204, 113, 0.4)"
      : "0 1px 2px rgba(0,0,0,0.1)"};
  transition: all 0.2s ease;
  border: 1px solid
    ${(props) =>
      props.$current
        ? "#e74c3c"
        : props.$called
        ? "#27ae60"
        : "rgba(0,0,0,0.1)"};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

// Add this color mapping at the top of your styled components
const letterColors = {
  B: { primary: "#3498db", secondary: "#2980b9" }, // Blue
  I: { primary: "#2ecc71", secondary: "#27ae60" }, // Green
  N: { primary: "#9b59b6", secondary: "#8e44ad" }, // Purple
  G: { primary: "#e67e22", secondary: "#d35400" }, // Orange
  O: { primary: "#e74c3c", secondary: "#c0392b" }, // Red
};

const CurrentNumberContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  min-width: 150px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(5px);
  transform-style: preserve-3d;
  perspective: 1000px;
`;

const CurrentNumberLabel = styled.div`
  font-size: 1rem;
  color: #7f8c8d;
  margin-bottom: 0.5rem;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
`;

const CurrentNumberCircle = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: ${(props) =>
    props.$color
      ? `linear-gradient(145deg, ${props.$color.primary}, ${props.$color.secondary})`
      : "#3498db"};
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  font-weight: bold;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  animation: ${pulseGlow} 1.5s infinite, ${float} 3s ease-in-out infinite;
  position: relative;
  overflow: hidden;
  border: 3px solid #fff;
  transition: all 0.3s ease;
  transform: translateZ(20px);

  &::before {
    content: "";
    position: absolute;
    width: 110px;
    height: 110px;
    border-radius: 50%;
    border: 3px dashed rgba(255, 255, 255, 0.5);
    animation: ${spin} 10s linear infinite;
    box-sizing: border-box;
  }

  &:hover {
    transform: translateZ(30px) scale(1.05);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.4);
  }
`;

const CurrentNumber = styled.div`
  font-size: 2.2rem;
  font-weight: bold;
  margin-top: 5px;
`;

// Compact Bingo Card
const CardContainer = styled.div`
  position: relative;
  max-width: 320px;
  margin: 0 auto;
  perspective: 1000px;
`;

const CompactBingoGrid = styled.div`
  background: white;
  padding: 1rem;
  border-radius: 12px;
  border: ${(props) =>
    props.$hasWon ? "3px solid #27ae60" : "1px solid #dfe6e9"};
  margin: 0.5rem auto;
  max-width: 300px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
  transform-style: preserve-3d;
  transform: rotateX(5deg);
  transition: all 0.3s ease;
  position: relative;
  z-index: 2;
  background: linear-gradient(145deg, #ffffff, #f8f9fa);
  border: 1px solid rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(5px);

  &:hover {
    transform: rotateX(5deg) translateY(-5px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
  }
`;

const CardShadow = styled.div`
  position: absolute;
  bottom: -10px;
  left: 10%;
  right: 10%;
  height: 20px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  filter: blur(10px);
  z-index: 1;
`;

const CompactLetterRow = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 5px;
  margin-bottom: 8px;
`;

const CompactLetterCell = styled.div`
  text-align: center;
  font-weight: bold;
  font-size: 1.2rem;
  color: white;
  padding: 0.5rem 0;
  background: ${(props) =>
    props.children === "B"
      ? "#3498db"
      : props.children === "I"
      ? "#2ecc71"
      : props.children === "N"
      ? "#9b59b6"
      : props.children === "G"
      ? "#e67e22"
      : "#e74c3c"};
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
`;

const CompactNumberRow = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 5px;
  margin-bottom: 5px;
`;

const CompactCell = styled.div`
  position: relative;
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  background: ${(props) => {
    if (props.$isHighlighted) return "#ffebee";
    if (props.$isCurrent) return "#fff8e1";
    return props.$isMarked ? "#e8f5e9" : "#f5f5f5";
  }};
  border: 2px solid
    ${(props) => {
      if (props.$isHighlighted) return "#ef9a9a";
      if (props.$isCurrent) return "#ffd54f";
      return props.$isCalled ? "#81c784" : "#e0e0e0";
    }};
  border-radius: 8px;
  font-weight: ${(props) => (props.$isMarked ? "bold" : "normal")};
  color: ${(props) => {
    if (props.$isFree) return "#27ae60";
    if (props.$isHighlighted) return "#e53935";
    return props.$isCalled ? "#2e7d32" : "#424242";
  }};
  user-select: none;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s ease;
  transform-style: preserve-3d;
  box-shadow: ${(props) =>
    props.$isMarked ? "inset 0 0 10px rgba(0,0,0,0.1)" : "none"};

  &:hover {
    transform: translateY(-2px) translateZ(5px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    background: ${(props) => (props.$isMarked ? "#dcedc8" : "#eeeeee")};
  }

  &:active {
    transform: translateY(0) translateZ(0);
  }
`;

const NumberText = styled.div`
  position: relative;
  z-index: 2;
`;

const FreeSpace = styled.div`
  font-weight: bold;
  color: #27ae60;
  font-size: 0.9rem;
  text-align: center;
`;

const MarkedOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(46, 204, 113, 0.2);
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;

  &::after {
    content: "✓";
    color: #27ae60;
    font-size: 1.5rem;
    font-weight: bold;
  }
`;

const PulseRing = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  border: 2px solid #e74c3c;
  border-radius: 8px;
  animation: ${pulse} 1.5s ease-out infinite;
  pointer-events: none;
  z-index: 3;
`;

const CurrentIndicator = styled.div`
  position: absolute;
  top: 5px;
  right: 5px;
  width: 10px;
  height: 10px;
  background-color: #e74c3c;
  border-radius: 50%;
  z-index: 4;
  box-shadow: 0 0 5px #e74c3c;
`;

// Controls
const Controls = styled.div`
  margin: 1.5rem 0;
  text-align: center;
`;

const ClaimSection = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin: 1rem 0;
  flex-wrap: wrap;
`;

const PatternSelect = styled.select`
  padding: 0.6rem 1rem;
  border-radius: 8px;
  border: 2px solid #bdc3c7;
  font-size: 1rem;
  min-width: 180px;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.3);
  }
`;

const BingoButton = styled.button`
  background: linear-gradient(145deg, #27ae60, #2ecc71);
  color: white;
  border: none;
  padding: 0.6rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  font-size: 1rem;
  min-width: 120px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  &::after {
    content: "";
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(
      to bottom right,
      rgba(255, 255, 255, 0.3),
      rgba(255, 255, 255, 0)
    );
    transform: rotate(30deg);
    transition: all 0.3s ease;
  }

  &:hover::after {
    left: 100%;
  }
`;

const ErrorMessage = styled.div`
  color: #e74c3c;
  margin-top: 1rem;
  font-weight: bold;
  font-size: 1rem;
  padding: 0.5rem 1rem;
  background: rgba(231, 76, 60, 0.1);
  border-radius: 8px;
  display: inline-block;
  animation: ${pulse} 1.5s infinite;
`;

// Header
const Header = styled.header`
  text-align: center;
  margin-bottom: 1.5rem;
  position: relative;
`;

const Title = styled.h1`
  color: #2c3e50;
  margin: 0.5rem 0;
  font-size: 2rem;
  font-weight: 800;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  background: linear-gradient(90deg, #3498db, #9b59b6, #e74c3c);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-block;
`;

const GameStatus = styled.div`
  margin: 1rem 0;
`;

const Countdown = styled.div`
  color: #e67e22;
  font-weight: bold;
  font-size: 1.2rem;
  background: rgba(230, 126, 34, 0.1);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  display: inline-block;
`;

const WinMessage = styled.div`
  color: #27ae60;
  font-size: 1.5rem;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
  position: relative;
  padding: 1rem;
  background: rgba(39, 174, 96, 0.1);
  border-radius: 8px;
  display: inline-block;
  animation: ${float} 3s ease-in-out infinite;
`;

const CurrentCall = styled.div`
  color: #7f8c8d;
  font-size: 1rem;
  background: rgba(127, 140, 141, 0.1);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  display: inline-block;
`;

// Buttons
const BackButton = styled.button`
  background: rgba(52, 152, 219, 0.1);
  border: none;
  color: #3498db;
  cursor: pointer;
  font-size: 1rem;
  padding: 0.5rem 1rem;
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  border-radius: 8px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.3rem;

  &:hover {
    background: rgba(52, 152, 219, 0.2);
    transform: translateY(-50%) translateX(-2px);
  }
`;

const NewGameButton = styled.button`
  display: block;
  margin: 2rem auto 0;
  background: linear-gradient(145deg, #9b59b6, #8e44ad);
  color: white;
  border: none;
  padding: 0.8rem 2rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  font-size: 1.1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  &::after {
    content: "";
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(
      to bottom right,
      rgba(255, 255, 255, 0.3),
      rgba(255, 255, 255, 0)
    );
    transform: rotate(30deg);
    transition: all 0.3s ease;
  }

  &:hover::after {
    left: 100%;
  }
`;

const AllNumbersTitle = styled.h3`
  color: #2c3e50;
  text-align: center;
  margin-bottom: 1rem;
  font-size: 1.2rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

// Confetti
const Confetti = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 1;
`;

const ConfettiPiece = styled.div`
  position: absolute;
  width: 8px;
  height: 8px;
  background: ${(props) =>
    props.$index % 5 === 0
      ? "#3498db"
      : props.$index % 5 === 1
      ? "#2ecc71"
      : props.$index % 5 === 2
      ? "#e74c3c"
      : props.$index % 5 === 3
      ? "#f1c40f"
      : "#9b59b6"};
  top: 0;
  left: ${(props) => props.$index * 3}%;
  opacity: 0;
  animation: ${confettiFall} 3s ease-in ${(props) => props.$index * 0.1}s
    infinite;
  border-radius: ${(props) => (props.$index % 2 === 0 ? "50%" : "0")};
`;

export default BingoCard;
