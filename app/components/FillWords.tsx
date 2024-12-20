// /game/FillWords.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useMyContext } from '../context/MyProvider';

const FillWords: React.FC = () => {
  const { setIsDown } = useMyContext(); // Access context state
  const [clickedButtons, setClickedButtons] = useState<{ [key: number]: boolean }>({});
  const [questionNumber, setQuestionNumber] = useState(0);
  const [matchedLetters, setMatchedLetters] = useState<string[]>([]);

  const data = ['run', 'yellow', 'green'];

  const generateAlphabets = (): { id: number; alphabet: string }[] => {
    return Array.from({ length: 26 }, (_, index) => ({
      id: index + 1,
      alphabet: String.fromCharCode(97 + index),
    }));
  };

  const alphabetArray = generateAlphabets();

  const clickLetter = (letter: string, id: number) => {
    setClickedButtons((prev) => ({ ...prev, [id]: true }));

    if (data[questionNumber].includes(letter)) {
      setMatchedLetters((prev) => {
        const updatedLetters = [...prev, letter];

        if (Array.from(data[questionNumber]).every((char) => updatedLetters.includes(char))) {
          if (questionNumber < data.length - 1) {
            setTimeout(() => {
              setQuestionNumber(questionNumber + 1);
              setMatchedLetters([]);
              setClickedButtons({});
              setIsDown(false);  // Reset 'isDown' when moving to the next question
            }, 500);
          } else {
            console.log('All questions completed!');
          }
        }
        return updatedLetters;
      });
      setIsDown(false); // Reset isDown when a correct letter is clicked
    } else {
      setIsDown(true); // Mark as incomplete if the letter doesn't match
      setTimeout(()=>setIsDown(false),300)
    }
  };

  const handleKeyPress = (event: KeyboardEvent) => {
    const letter = event.key.toLowerCase();
    const foundItem = alphabetArray.find((item) => item.alphabet === letter);

    if (foundItem && !clickedButtons[foundItem.id]) {
      clickLetter(foundItem.alphabet, foundItem.id);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [clickedButtons]);

  return (
    <div className='absolute top-0'>
      <div className="bg-orange-200 w-[800px] flex flex-row gap-2 flex-wrap justify-center items-center">
        {alphabetArray.map((item) => (
          <button
            key={item.id}
            className={`w-[50px] h-[50px] flex justify-center items-center ${
              clickedButtons[item.id] ? 'bg-red-300' : 'bg-green-300'
            }`}
            onClick={() => clickLetter(item.alphabet, item.id)}
            disabled={clickedButtons[item.id]}
          >
            <p className="text-xl">{item.alphabet}</p>
          </button>
        ))}
      </div>

      <div className="bg-orange-200 w-[800px] flex flex-row gap-2 flex-wrap justify-start items-center">
        {Array.from(data[questionNumber]).map((char, charIndex) => (
          <input
            key={charIndex}
            type="text"
            value={matchedLetters.includes(char) ? char : ''}
            className="bg-blue-200 p-2 w-[40px] text-center"
            disabled
          />
        ))}
      </div>
    </div>
  );
};

export default FillWords;
