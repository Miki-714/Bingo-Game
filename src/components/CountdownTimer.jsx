import styled, { keyframes } from "styled-components";

const pulse = keyframes`
  0% { transform: scale(1); }
  100% { transform: scale(1.1); }
`;

export const CountdownTimer = ({ timeLeft }) => {
  const seconds = timeLeft % 60;

  return (
    <CountdownContainer>
      <TimeUnit>
        <AnimatedTimeValue>
          {seconds.toString().padStart(2, "0")}
        </AnimatedTimeValue>{" "}
      </TimeUnit>
    </CountdownContainer>
  );
};

const CountdownContainer = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  width: 100%;
  gap: 16px;
  margin: 20px 0;
`;

const TimeUnit = styled.div`
  width: 64px;
`;

const TimeValue = styled.div`
  background: #4f46e5;
  padding: 16px 8px;
  border-radius: 8px;
  overflow: hidden;
  font-family: "Cormorant", serif;
  font-weight: 600;
  font-size: 1.5rem;
  color: white;
  text-align: center;
`;

const AnimatedTimeValue = styled(TimeValue)`
  animation: ${pulse} 1s infinite alternate;
`;

const TimeLabel = styled.p`
  font-family: "Cormorant", serif;
  font-size: 1.125rem;
  font-weight: 500;
  color: #111827;
  margin-top: 4px;
  text-align: center;
`;

const TimeSeparator = styled.div`
  font-family: "Manrope", sans-serif;
  font-weight: 600;
  font-size: 1.5rem;
  color: #111827;
  margin-top: 16px;
`;
