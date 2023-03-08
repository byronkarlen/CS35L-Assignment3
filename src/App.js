import React, { useState } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay, gameStage}) {
  const [lastSquareClicked, setLastSquareClicked] = useState(null);

  function handleClick(i) {
    if(calculateWinner(squares)) return;

    if(gameStage === "tic-tac-toe"){
      if (squares[i]) {
        return;
      }
      const nextSquares = squares.slice();
      if (xIsNext) {
        nextSquares[i] = 'X';
      } else {
        nextSquares[i] = 'O';
      }
      onPlay(nextSquares);
    }

    if(gameStage === "chorus-lapilli"){
      //If player hasnt yet selected one of his pieces
      if(lastSquareClicked === null){ 
        //If he correctly selects one of his 
        if((xIsNext ? squares[i] === 'X' : squares[i] === 'O')){
          setLastSquareClicked(i); 
        }
        //If he does not, do nothing
        else return;
      }
      //If the player has already selected one of his pieces
      else{    

        //If he can move his previously selected square here:
        if(canMoveHere(squares, lastSquareClicked, i)){
          const nextSquares = squares.slice();
          nextSquares[lastSquareClicked] = null; 
          xIsNext ? nextSquares[i] = 'X' : nextSquares[i] = 'O'
          onPlay(nextSquares);
        }
        //Restart the move
        setLastSquareClicked(null);  
      }
    }
  }

  const winner = calculateWinner(squares);
  let status = "";
  
  if (winner) {
    status += 'Player ' + (winner) + ', you won!';
  } 
  else {
    status += 'Player ' + (xIsNext ? 'X' : 'O') + ', your turn! ';

    if(gameStage === "chorus-lapilli"){
      if(lastSquareClicked === null){
        status += 'Please select a token.';
      }
      else{
        status += 'Please select a square to move your token to.';
      }
    }
  }

  return (
    <React.Fragment>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </React.Fragment>
  );
}

export default function Game() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [gameStage, setGameStage] = useState("tic-tac-toe");
  const [xIsNext, setXIsNext] = useState(true);

  function handlePlay(nextSquares) {
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
    if(nextStage(nextSquares)){
      setGameStage("chorus-lapilli");
    }
  }
  

  return (
    <React.Fragment>
      <h1>Chorus Lapilli</h1>
      <div className="game">
        <div className="game-board">
          <Board xIsNext={xIsNext} squares={squares} onPlay={handlePlay} gameStage={gameStage} />
        </div>
      </div>
      <br/><br/>
      <div class="game-notes">
        Notes:
        <ul>
          <li>During the first 3 moves, if you select a square that is taken (by an 'X' or an 'O')
            nothing will happen. 
          </li>
          <li>After the first 3 moves, if you try to move one of your tokens to a part of the board that 
            is not allowed (for any number of reasons), your turn will reset. </li> 
        </ul>
      </div>
    </React.Fragment>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function nextStage(squares){
  let xCount = 0;
  let oCount = 0; 
  for(let i = 0; i < squares.length; i++){
    if(squares[i] === 'X'){
      xCount++;
    }
    if(squares[i] === 'O'){
      oCount++;
    }
  }
  return (oCount === 3 && xCount === 3);
}

function canMoveHere(squares, s1, s2){
  //If s2 is not empty
  if(squares[s2] !== null) return false;
  if(!is1MoveAway(s1, s2)) return false;
  //If the player occupies the middle square and hasn't selected to move it
  if(squares[4] === squares[s1] && s1 !== 4){
    let proposedBoard = squares.slice();
    squares[s1] === 'X' ? proposedBoard[s2] = 'X' : proposedBoard[s2] = 'O';
    proposedBoard[s1] = null;
    return calculateWinner(proposedBoard); //return false if he doesn't win on this move
  }

  return true;
}

function is1MoveAway(start, finish){
  if(start % 3 === 0){ //If start is in first column:
    return (start-3 === finish || start-2 === finish || start+1 === finish || start+3 === finish || start+4 === finish);
  }
  if(start % 3 === 1){ //If start is in second column:
    return (start-4 === finish || start-3 === finish || start-2 === finish || start-1 === finish || start+1 === finish
      || start+2 === finish || start+3 === finish || start+4 === finish);
  }
  else{ //If start is in third column:
    return (start-4 === finish || start-3 === finish || start-1 === finish || start+2 === finish || start+3 === finish);
  }
}