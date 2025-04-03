import { useState, useEffect, useCallback, useRef } from "react";

export function useBingoGame() {
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [calledNumbers, setCalledNumbers] = useState(new Set());
  const [timeLeft, setTimeLeft] = useState(59);
  const [isCalling, setIsCalling] = useState(false);
  const [currentCall, setCurrentCall] = useState(null);
  const [hasWon, setHasWon] = useState(false);
  const [markedNumbers, setMarkedNumbers] = useState(new Set(["FREE"]));
  const [currentCallMarked, setCurrentCallMarked] = useState(false);
  const callingInterval = useRef(null);
  const [audio] = useState(() => new Audio("/sounds/ding.mp3"));
  const [allNumbersCalled, setAllNumbersCalled] = useState(false);

  const generateCard = useCallback((seed) => {
    const ranges = [
      [1, 15],
      [16, 30],
      [31, 45],
      [46, 60],
      [61, 75],
    ];
    return ranges.map(([min], col) =>
      Array(5)
        .fill()
        .map((_, row) =>
          col === 2 && row === 2 ? "FREE" : min + ((seed + col * 5 + row) % 15)
        )
    );
  }, []);

  const checkPattern = useCallback((card, marks, pattern) => {
    const isMarked = (col, row) =>
      card[col][row] === "FREE" || marks.has(card[col][row]);

    const patterns = {
      line: () => {
        for (let i = 0; i < 5; i++) {
          if ([0, 1, 2, 3, 4].every((j) => isMarked(j, i))) return true;
          if ([0, 1, 2, 3, 4].every((j) => isMarked(i, j))) return true;
        }
        return (
          [0, 1, 2, 3, 4].every((i) => isMarked(i, i)) ||
          [0, 1, 2, 3, 4].every((i) => isMarked(i, 4 - i))
        );
      },
      corners: () =>
        isMarked(0, 0) && isMarked(0, 4) && isMarked(4, 0) && isMarked(4, 4),
      blackout: () =>
        [0, 1, 2, 3, 4].every((row) =>
          [0, 1, 2, 3, 4].every((col) => isMarked(col, row))
        ),
      x: () =>
        [0, 1, 2, 3, 4].every((i) => isMarked(i, i)) &&
        [0, 1, 2, 3, 4].every((i) => isMarked(i, 4 - i)),
    };

    return patterns[pattern]?.() || false;
  }, []);

  const startCallingNumbers = useCallback(() => {
    setIsCalling(true);
    let availableNumbers = Array.from({ length: 75 }, (_, i) => i + 1);

    callingInterval.current = setInterval(() => {
      if (availableNumbers.length === 0 || hasWon) {
        clearInterval(callingInterval.current);
        setIsCalling(false);
        setAllNumbersCalled(availableNumbers.length === 0);
        return;
      }

      const randomNum = availableNumbers.splice(
        Math.floor(Math.random() * availableNumbers.length),
        1
      )[0];

      setCurrentCall(randomNum);
      setCalledNumbers((prev) => new Set([...prev, randomNum]));
      setCurrentCallMarked(false);
    }, 5000);

    return () => clearInterval(callingInterval.current);
  }, [hasWon]);

  useEffect(() => {
    if (!selectedNumber) return;

    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
      return () => clearTimeout(timer);
    } else if (!isCalling && !hasWon && !allNumbersCalled) {
      startCallingNumbers();
    }
  }, [
    selectedNumber,
    timeLeft,
    isCalling,
    hasWon,
    startCallingNumbers,
    allNumbersCalled,
  ]);

  const callNumber = (num) => {
    clearInterval(callingInterval.current);
    setSelectedNumber(num);
    setCalledNumbers(new Set());
    setTimeLeft(5);
    setIsCalling(false);
    setCurrentCall(null);
    setHasWon(false);
    setMarkedNumbers(new Set(["FREE"]));
    setCurrentCallMarked(false);
    setAllNumbersCalled(false);
  };

  const markNumber = (number) => {
    if (number === "FREE") {
      setMarkedNumbers((prev) => {
        const newSet = new Set(prev);
        newSet.has(number) ? newSet.delete(number) : newSet.add(number);
        return newSet;
      });
      return true;
    }

    if (number === currentCall) {
      setCurrentCallMarked(true);
      setMarkedNumbers((prev) => {
        const newSet = new Set(prev);
        newSet.has(number) ? newSet.delete(number) : newSet.add(number);
        return newSet;
      });
      return true;
    }

    return false;
  };

  const claimBingo = useCallback(
    (pattern, card) => {
      if (currentCall && !currentCallMarked) {
        return false;
      }

      const isValid = checkPattern(card, markedNumbers, pattern);
      if (isValid) {
        setHasWon(true);
        clearInterval(callingInterval.current);
        audio.play();
      }
      return isValid;
    },
    [markedNumbers, currentCall, currentCallMarked, audio, checkPattern]
  );

  return {
    selectedNumber,
    calledNumbers,
    currentCall,
    timeLeft,
    isCalling,
    hasWon,
    allNumbersCalled,
    generateCard,
    callNumber,
    claimBingo,
    markNumber,
    markedNumbers,
  };
}
