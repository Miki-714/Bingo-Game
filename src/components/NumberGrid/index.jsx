import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { CountdownTimer } from "../CountdownTimer";

export function NumberGrid({ callNumber, stake = 10, timeLeft }) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  // Create a 10x15 grid (10 rows, 15 columns)
  const numberGrid = [];
  for (let row = 0; row < 10; row++) {
    const rowNumbers = [];
    for (let col = 0; col < 15; col++) {
      rowNumbers.push(row * 15 + col + 1);
    }
    numberGrid.push(rowNumbers);
  }

  // Filter numbers based on search term
  const filteredNumbers = searchTerm
    ? numberGrid.map((row) =>
        row.filter((num) => num.toString().includes(searchTerm))
      )
    : numberGrid;

  // Highlight matching numbers
  const isNumberHighlighted = (num) => {
    return searchTerm && num.toString().includes(searchTerm);
  };

  return (
    <GridContainer>
      <Header>
        <StakeDisplay>{stake} Birr Per Card</StakeDisplay>
        <SearchContainer>
          <SearchInput
            type="text"
            placeholder="Type to search numbers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchContainer>
      </Header>
      {/* New Countdown Timer */}
      {timeLeft > 0 && (
        <TimerContainer>
          <CountdownTimer timeLeft={timeLeft} />
        </TimerContainer>
      )}

      <NumbersGrid>
        {filteredNumbers.map((row, rowIndex) => (
          <NumberRow key={rowIndex}>
            {row.map((num) => (
              <NumberButton
                key={num}
                onClick={() => {
                  callNumber(num);
                  navigate(`/card/${num}`);
                }}
                $highlight={isNumberHighlighted(num)}
                $empty={row.length === 0} // Hide empty rows
              >
                {num}
              </NumberButton>
            ))}
          </NumberRow>
        ))}
      </NumbersGrid>
    </GridContainer>
  );
}

// Styled components (updated with highlight styles)
const GridContainer = styled.div`
  font-family: Arial, sans-serif;
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f8f9fa;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 10px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const StakeDisplay = styled.div`
  font-weight: bold;
  font-size: 1.2rem;
  color: #2c3e50;
  min-width: 150px;
`;

const SearchContainer = styled.div`
  flex-grow: 1;
  margin: 0 20px;
  max-width: 400px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 20px;
  font-size: 1rem;
  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
  }
`;

const TimeDisplay = styled.div`
  color: #7f8c8d;
  font-size: 0.9rem;
  min-width: 150px;
  text-align: right;
`;

const NumbersGrid = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const NumberRow = styled.div`
  display: grid;
  grid-template-columns: repeat(15, 1fr);
  gap: 5px;
  margin-bottom: 5px;
  min-height: 40px; // Ensure consistent row height

  @media (max-width: 768px) {
    grid-template-columns: repeat(5, 1fr);
  }
`;

const NumberButton = styled.button`
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #dfe6e9;
  border-radius: 4px;
  background-color: ${(props) => (props.$highlight ? "#ffeaa7" : "white")};
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: ${(props) => (props.$highlight ? "bold" : "500")};
  color: ${(props) => (props.$highlight ? "#2d3436" : "#2c3e50")};
  transition: all 0.2s ease;
  ${(props) => props.$empty && "visibility: hidden;"}

  &:hover {
    background-color: #3498db;
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    font-size: 0.8rem;
    padding: 5px;
  }
`;
