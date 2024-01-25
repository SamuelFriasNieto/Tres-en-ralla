import { useState } from "react";
import confetti from 'canvas-confetti';
import {Square} from './components/Square'
import { TURNS, WINNER_COMBOS } from "./constants";

const board = Array(9).fill(null);

function App() {
  const [board, setBoard] = useState( () => {
    const boardFromStorage = window.localStorage.getItem('board')
    return boardFromStorage ? JSON.parse(boardFromStorage) :
    Array(9).fill(null)
  })
  const [turn, setTurn] = useState(() => {
    const turnFromStorage = window.localStorage.getItem('turn')
    return turnFromStorage ? turnFromStorage :
    TURNS.X
  })
  const [winner, setWinner] = useState(null)

  const checkWinner = (boardToCheck) => {
    for(const combo of WINNER_COMBOS) {
      const [a,b,c] = combo
      if(boardToCheck[a] && boardToCheck[a] === boardToCheck[b] && boardToCheck[b] === boardToCheck[c]) {
        return boardToCheck[a]
      }
    }

    return null
  }

  const checkEndGame = (boardToCheck)=> {
    if(!boardToCheck.includes(null)) {
      return true
    }
  }

  const updateBoard = (index) => {
    if (board[index] || winner) return
    const newBoard = [...board]
    newBoard[index] = turn
    setBoard(newBoard)
    const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X
    setTurn(newTurn)
    window.localStorage.setItem('board', JSON.stringify(newBoard))
    window.localStorage.setItem('turn', newTurn)
    const newWinner = checkWinner(newBoard)
    if(newWinner) {
      setWinner(newWinner)
      confetti()
    } else if(checkEndGame(newBoard)) {
      setWinner(false)
    }
    
  }

  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setTurn(winner === TURNS.X ? TURNS.O : TURNS.X)
    setWinner(null)
    window.localStorage.removeItem('board')
    window.localStorage.removeItem('turn')
  }


  return (
    <main className="board">
      <h1>Tres en ralla</h1>
      <button onClick={resetGame}>Reset</button>
      <section className="game">
        {
          board.map((_, index) => {
            return (
              <Square 
                key={index}
                index={index}
                updateBoard={updateBoard}
                >
                  {board[index]}
              </Square>
            )
          })
        }
      </section>

      <section className="turn">
        <Square isSelected = {turn===TURNS.X} >{TURNS.X}</Square>
        <Square isSelected = {turn===TURNS.O}>{TURNS.O}</Square>
      </section>

      {
        winner !== null && (
          <section className="winner">
            <div className="text">
              <h2>
                {winner===false ? 'Empate' : 'Ganó'}
              </h2>
              <header>
                {winner && <Square>{winner}</Square>}
              </header>
              <footer>
                <button onClick={resetGame}>Volver a jugar</button>
              </footer>
            </div>
          </section>
        )
      }
    </main>
  )
    
  
}

export default App
