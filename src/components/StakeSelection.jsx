import { useNavigate } from "react-router-dom";
import styled from "styled-components";

export function StakeSelection({ setStake }) {
  const navigate = useNavigate();

  const stakeOptions = [
    { amount: 10, status: "Playing", win: 193 },
    { amount: 20, status: "0:49", win: 255 },
    { amount: 30, status: "None", win: null },
    { amount: 50, status: "None", win: null },
    { amount: 100, status: "None", win: null },
    { amount: 150, status: "None", win: null },
    { amount: 200, status: "None", win: null },
  ];

  const handleJoinClick = (stakeAmount) => {
    setStake(stakeAmount); // Save the selected stake
    navigate("/number-grid"); // Redirect to number grid
  };

  return (
    <Container>
      <Header>
        <UserInfo>
          <Username>miki714</Username>
          <Balance>ETB 0.00</Balance>
        </UserInfo>
        <Nav>
          <NavLink onClick={() => navigate("/")}>Home</NavLink>
          <NavLink>Contact</NavLink>
          <NavLink>Amharic</NavLink>
        </Nav>
      </Header>

      <Title>Please Choose Your Stake</Title>

      <StakeTable>
        <TableHeader>
          <TableHeaderCell>Stake</TableHeaderCell>
          <TableHeaderCell>Starts in</TableHeaderCell>
          <TableHeaderCell>Possible Win</TableHeaderCell>
          <TableHeaderCell>Join</TableHeaderCell>
        </TableHeader>

        <TableBody>
          {stakeOptions.map((stake, index) => (
            <TableRow key={index}>
              <TableCell>{stake.amount} rm</TableCell>
              <TableCell>
                {stake.status === "None" ? "None" : stake.status}
              </TableCell>
              <TableCell>
                {stake.win ? (
                  <WinAmount>© {stake.win} Birr</WinAmount>
                ) : (
                  <NoWin>🔴 -</NoWin>
                )}
              </TableCell>
              <TableCell>
                <JoinButton
                  onClick={() => handleJoinClick(stake.amount)}
                  disabled={stake.status === "None"}
                >
                  Join ➤
                </JoinButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </StakeTable>
    </Container>
  );
}

// Styled components (same as previous example)
const Container = styled.div`
  font-family: "Arial", sans-serif;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const Username = styled.span`
  font-weight: bold;
`;

const Balance = styled.span`
  background-color: #4caf50;
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
`;

const Nav = styled.nav`
  display: flex;
  gap: 15px;
`;

const NavLink = styled.a`
  color: #333;
  text-decoration: none;
  cursor: pointer;
`;

const Title = styled.h1`
  text-align: center;
  font-size: 1.5rem;
  margin-bottom: 20px;
`;

const StakeTable = styled.div`
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  background-color: #4caf50;
  color: white;
  font-weight: bold;
  padding: 12px 15px;
`;

const TableHeaderCell = styled.div`
  text-align: center;
`;

const TableBody = styled.div``;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  padding: 12px 15px;
  border-bottom: 1px solid #eee;
  align-items: center;

  &:nth-child(even) {
    background-color: #f9f9f9;
  }
`;

const TableCell = styled.div`
  text-align: center;
  padding: 8px;
`;

const WinAmount = styled.span`
  color: #4caf50;
  font-weight: bold;
`;

const NoWin = styled.span`
  color: #f44336;
`;

const JoinButton = styled.button`
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 5px;
  margin: 0 auto;

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;
