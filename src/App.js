import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Card from './components/Card';
import Board from './components/Board';
import { cardPatterns } from './config/tempPatterns';
import './App.css';

const cardImages = [
  { id: 1, name: 'Carta 1', src: 'cards/card1.png', temple: 0, rank: 0 },
  { id: 2, name: 'Reina_Euphemia', src: 'cards/card2.png', temple: 5, rank: 3 },
  { id: 3, name: 'Carta 3', src: 'cards/card3.png', temple: 0, rank: 0 },
  { id: 4, name: 'Carta 4', src: 'cards/card4.png', temple: 0, rank: 0 },
  { id: 5, name: 'Infanteria_Juliana', src: 'cards/card5.png', temple: 2, rank: 1 },
  { id: 6, name: 'Carta 6', src: 'cards/card6.png', temple: 0, rank: 0 },
  { id: 7, name: 'Mike_Sawyer', src: 'cards/card7.png', temple: 2, rank: 2 },
  { id: 8, name: 'Ave_reconocimiento', src: 'cards/card8.png', temple: 0, rank: 0 },
  { id: 9, name: 'Carta 9', src: 'cards/card9.png', temple: 0, rank: 0 },
  { id: 10, name: 'Carta 10', src: 'cards/card10.png', temple: 0, rank: 0 },
  { id: 11, name: 'Mechanostiff', src: 'cards/card11.png', temple: 2, rank: 1 },
  { id: 12, name: 'Carta 12', src: 'cards/card12.png', temple: 0, rank: 0 },
  { id: 13, name: 'Carta 13', src: 'cards/card13.png', temple: 0, rank: 0 },
  { id: 14, name: 'Carta 14', src: 'cards/card14.png', temple: 0, rank: 0 },
  { id: 15, name: 'Carta 15', src: 'cards/card15.png', temple: 0, rank: 0 },
  { id: 16, name: 'Carta 16', src: 'cards/card16.png', temple: 0, rank: 0 },
];

function App() {
  const [hand, setHand] = useState([]);
  const [board, setBoard] = useState(Array(15).fill(null));
  const [lineScores, setLineScores] = useState([
    { player1: 0, player2: 0 },
    { player1: 0, player2: 0 },
    { player1: 0, player2: 0 }
  ]);
  const [totalScores, setTotalScores] = useState({ player1: 0, player2: 0 });
  const [currentPlayer, setCurrentPlayer] = useState(1);

  useEffect(() => {
    const shuffled = cardImages.sort(() => 0.5 - Math.random());
    setHand(shuffled.slice(0, 5));

    const initialBoard = Array(15).fill(null).map((_, index) => {
      if (index % 5 === 0 || (index + 1) % 5 === 0) {
        return { name: 'InitialCard', temple: 0, rank: 1, player: (index % 5 === 0) ? 1 : 2 };
      }
      return null;
    });
    setBoard(initialBoard);
  }, []);

  const handleDrop = (item, monitor, index) => {
    const updatedBoard = [...board];
    const cardIndex = hand.findIndex(card => card.name === item.name);
    const card = hand[cardIndex];

    if (updatedBoard[index]?.isOriginal) {
      alert("La carta no se puede colocar en esta casilla.");
      return;
    }

    if (card.rank === 1 && updatedBoard[index]?.rank !== 1 && updatedBoard[index]?.rank !== 2 && updatedBoard[index]?.rank !== 3 && index % 5 !== 0 && (index + 1) % 5 !== 0) {
      alert("La carta de rango 1 se puede colocar en casillas con rango 1, 2 o 3, pero no en las casillas vacías ni en las primeras casillas de rango 1.");
      return;
    }

    if (card.rank === 2 && updatedBoard[index]?.rank !== 2 && (index % 5 !== 0 || updatedBoard[index]?.rank !== 2) && ((index + 1) % 5 !== 0 || updatedBoard[index]?.rank !== 2)) {
      alert("La carta de rango 2 solo se puede colocar en casillas con rango 2 o en las primeras casillas de rango 2.");
      return;
    }

    // Verificación para carta de rango 3
if (card.rank === 3 && updatedBoard[index]?.rank !== 3 && (index % 5 !== 0 || updatedBoard[index]?.rank !== 3) && ((index + 1) % 5 !== 0 || updatedBoard[index]?.rank !== 3)) {
  alert("La carta de rango 3 solo se puede colocar en casillas con rango 3 o en las primeras casillas de rango 3.");
  return;
}

    updatedBoard[index] = { ...card, isOriginal: true, player: currentPlayer };

    const pattern = cardPatterns[card.name];
    if (pattern) {
      const transformedPattern = currentPlayer === 2 ? pattern.map(({ x, y, number }) => ({ x: -x, y, number })) : pattern;
      transformedPattern.forEach(({ x, y, number }) => {
        const targetIndex = index + y * 5 + x;
        if (targetIndex >= 0 && targetIndex < 15) {
          const targetCell = updatedBoard[targetIndex];
          if (!targetCell?.isOriginal) {
            const currentRank = targetCell?.rank || 0;
            updatedBoard[targetIndex] = {
              ...targetCell,
              isAffected: true,
              rank: Math.min(currentRank + number, 3),
              player: targetCell?.player || currentPlayer
            };
          }
        }
      });
    }

    setBoard(updatedBoard);
    setHand(prevHand => prevHand.filter((_, idx) => idx !== cardIndex));

    calculateLineScores(updatedBoard);
  };

  const calculateLineScores = (updatedBoard) => {
    const newLineScores = [
      { player1: 0, player2: 0 },
      { player1: 0, player2: 0 },
      { player1: 0, player2: 0 }
    ];

    for (let i = 0; i < 15; i++) {
      const cell = updatedBoard[i];
      const lineIndex = Math.floor(i / 5);
      if (cell && cell.temple) {
        if (cell.player === 1) {
          newLineScores[lineIndex].player1 += cell.temple;
        } else if (cell.player === 2) {
          newLineScores[lineIndex].player2 += cell.temple;
        }
      }
    }

    const newTotalScores = { player1: 0, player2: 0 };
    newLineScores.forEach((line) => {
      newTotalScores.player1 += line.player1;
      newTotalScores.player2 += line.player2;
    });

    setLineScores(newLineScores);
    setTotalScores(newTotalScores);
  };

  const endTurn = () => {
    setCurrentPlayer(prevPlayer => (prevPlayer === 1 ? 2 : 1));
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="App">
        <h1>¡Bienvenido al juego de cartas!</h1>
        <div className="board">
          {board.map((cell, index) => (
            <Board
              key={index}
              index={index}
              handleDrop={(item, monitor) => handleDrop(item, monitor, index)}
              content={cell}
            />
          ))}
        </div>
        <div className="hand">
          {hand.map(card => (
            <Card key={card.id} name={card.name} imgSrc={card.src} />
          ))}
        </div>
        <button onClick={() => setHand([...hand, ...cardImages.sort(() => 0.5 - Math.random()).slice(0, 1)])}>
          Draw Card
        </button>
        <button onClick={endTurn}>
          Pasar Turno
        </button>
        <div className="scores">
          <div>
            <h3>Línea Superior</h3>
            <p>Jugador 1: {lineScores[0].player1}</p>
            <p>Jugador 2: {lineScores[0].player2}</p>
          </div>
          <div>
            <h3>Línea Media</h3>
            <p>Jugador 1: {lineScores[1].player1}</p>
            <p>Jugador 2: {lineScores[1].player2}</p>
          </div>
          <div>
            <h3>Línea Inferior</h3>
            <p>Jugador 1: {lineScores[2].player1}</p>
            <p>Jugador 2: {lineScores[2].player2}</p>
          </div>
          <div>
            <h3>Puntaje Total</h3>
            <p>Jugador 1: {totalScores.player1}</p>
            <p>Jugador 2: {totalScores.player2}</p>
          </div>
        </div>
        <h2>Turno del Jugador: {currentPlayer}</h2>
      </div>
    </DndProvider>
  );
}

export default App;
