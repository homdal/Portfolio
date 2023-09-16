let whoPlayNow; // variable that helps decide who's turn it is
let winner = ["", , "", "H", "A", "S", "W", "O", "N"]; //array used to display the winner
let draw = ["N", "", "O", "", "", "", "W", "I", "N"]; //array used in case of a draw
let cellClicks = 0; //variable that helps track the number of cells that were used
const sound1 = new Audio("audio/sound1.mp3"); //sound effects
const sound2 = new Audio("audio/sound2.mp3");
const sound3 = new Audio("audio/sound3.mp3");
const sound4 = new Audio("audio/sound4.mp3");

const ifEndGame = () => {
  //function that checks if someone has already won

  let whoWonTheGame; //variable that will change if someone has won

  let cells = document.querySelectorAll("#gameDiv > div"); //get all the game cells

  //this loop checks if there are any 3 matching symbols in any column
  for (let i = 0; i <= 2; i++) {
    if (
      cells[i].innerHTML == cells[i + 3].innerHTML &&
      cells[i + 3].innerHTML == cells[i + 6].innerHTML &&
      cells[i].innerHTML
    ) {
      whoWonTheGame = cells[i].innerHTML;
      flicker(i, i + 3, i + 6);
    }
  }

  //this loop checks if there are any 3 matching symbols in any row
  for (let i = 0; i < 9; i += 3) {
    if (
      cells[i].innerHTML == cells[i + 1].innerHTML &&
      cells[i + 1].innerHTML == cells[i + 2].innerHTML &&
      cells[i].innerHTML
    ) {
      whoWonTheGame = cells[i].innerHTML;
      flicker(i, i + 1, i + 2);
    }
  }

  //a condition to check if there are any 3 matching symbols diagonally
  let i = 0;
  if (
    cells[i].innerHTML == cells[i + 4].innerHTML &&
    cells[i + 4].innerHTML == cells[i + 8].innerHTML &&
    cells[i].innerHTML
  ) {
    whoWonTheGame = cells[i].innerHTML;
    flicker(i, i + 4, i + 8);
  }
  i = 2;
  if (
    cells[i].innerHTML == cells[i + 2].innerHTML &&
    cells[i + 2].innerHTML == cells[i + 4].innerHTML &&
    cells[i].innerHTML
  ) {
    whoWonTheGame = cells[i].innerHTML;
    flicker(i, i + 2, i + 4);
  }

  //condition to check if someone won the game or if it's a draw
  setTimeout(() => {
    //gives time for flicker to finish
    if (whoWonTheGame) {
      winner[1] = whoWonTheGame;
      let xWins;
      let oWins;
      let scoreArray = [];
      if (loadScore() != null) {
        scoreArray = loadScore();
        xWins = scoreArray[0];
        oWins = scoreArray[1];
      } else {
        xWins = 0;
        oWins = 0;
      }
      setTimeout(() => {
        //win function wipes the board clean, this times it so that it fits the flicker effects
        if (whoWonTheGame == "X") {
          win(winner);
          xWins++;
          setScore(xWins, oWins);
        } else {
          win(winner);
          oWins++;
          setScore(xWins, oWins);
        }
      }, 300);
    }
    let cells = document.querySelectorAll("#gameDiv > div");
    for (let cell of cells) {
      if (!cell.innerHTML) {
        //check for empty cells
        return;
      } else if (!whoWonTheGame && cellClicks == 9) {
        //if all cells are full and there is no winner
        flicker(1, 1, 1);
        cellClicks = 0; //reset cell click number
        setTimeout(() => {
          //win function wipes the board clean, this times it so that it fits the flicker effects
          win(draw);
        }, 1700);
      }
    }
  }, 2000);
};

const win = (winnerOrDraw) => {
  //function that displays who won or if it's a draw by using the arrays "winner" and "draw"
  let cells = document.querySelectorAll("#gameDiv > div");
  let timer = 200; //variable to increase delay in the timeout
  let arrIndex = 0; //array index
  if (!winnerOrDraw[0]) {
    //checks which array has been recieved, if first cell is empty then "winner" if not then "draw"
    cells.forEach((cell) => (cell.innerHTML = "")); //clear the cells
    sound3.play();
    for (let cell of cells) {
      let arrayValue = winnerOrDraw[arrIndex];
      setTimeout(() => {
        //timing that changes for each cell on the board
        let span = document.createElement("span");
        span.innerHTML = arrayValue;
        span.setAttribute("class", "rotate");
        cell.classList.add("flip-vertical-left"); //causes animation
        cell.setAttribute("id", "winner");
        setTimeout(() => {
          //more timing to fit the animation
          cell.appendChild(span);
        }, 200);
      }, timer);
      timer += 200; //increase time for each cell so they change in order
      arrIndex++;
    }
    setTimeout(() => {
      //wait for win function to finish and bring back event listener
      document
        .querySelector("#playAgainBtn")
        .addEventListener("click", handleNewGame);
      document
        .querySelector("#reset")
        .addEventListener("click", handleClearScore);
    }, 2200);
    localStorage.removeItem("saveGame"); //delete saved game since it is no longer needed after someone won or if it is a draw
    localStorage.removeItem("whosTurn"); //delete who's turn it was
  } else {
    cells.forEach((cell) => (cell.innerHTML = ""));
    sound4.play();
    for (let cell of cells) {
      let arrayValue = winnerOrDraw[arrIndex];
      setTimeout(() => {
        let span = document.createElement("span");
        span.innerHTML = arrayValue;
        span.setAttribute("class", "rotate");
        cell.classList.add("flip-vertical-left");
        cell.setAttribute("id", "draw");
        setTimeout(() => {
          cell.appendChild(span);
        }, 200);
      }, timer);
      timer += 200;
      arrIndex++;
    }
    setTimeout(() => {
      //wait for win function to finish and bring back event listener
      document
        .querySelector("#playAgainBtn")
        .addEventListener("click", handleNewGame);
      document
        .querySelector("#reset")
        .addEventListener("click", handleClearScore);
    }, 2200);
    localStorage.removeItem("saveGame");
    localStorage.removeItem("whosTurn");
  }
};

const flicker = (i, i2, i3) => {
  //function that adds effects when the ifEndGame function finds 3 matching letters
  let cells = document.querySelectorAll("#gameDiv > div");
  let whosTurn = document.querySelector("#whosTurn");
  whosTurn.innerHTML = "&nbsp;";
  document
    .querySelector("#playAgainBtn")
    .removeEventListener("click", handleNewGame); //remove event listener from button so it doesn't ruin win function
  document
    .querySelector("#reset")
    .removeEventListener("click", handleClearScore); //remove event listener from button so it doesn't ruin win function
  cells.forEach((cell) => cell.removeEventListener("click", handleClickXO));
  if (i != i2) {
    let repeat = 3;
    let interval = setInterval(() => {
      cells[i].setAttribute("id", "winner");
      cells[i2].setAttribute("id", "winner");
      cells[i3].setAttribute("id", "winner");
      setTimeout(() => {
        cells[i].removeAttribute("id", "winner");
        cells[i2].removeAttribute("id", "winner");
        cells[i3].removeAttribute("id", "winner");
      }, 500);
      repeat--;
      if (repeat == 0) {
        clearInterval(interval);
      }
    }, 600);
  } else {
    let repeat = 2;
    let interval = setInterval(() => {
      cells.forEach((cell) => cell.setAttribute("id", "draw"));
      setTimeout(() => {
        cells.forEach((cell) => cell.removeAttribute("id", "draw"));
      }, 500);
      repeat--;
      if (repeat == 0) {
        clearInterval(interval);
      }
    }, 600);
  }
};

const handleClickXO = (myE) => {
  //function that determines what happens upon clicking one of the cells in the board.
  let whosTurn = document.querySelector("#whosTurn");
  if (myE.target.innerHTML) {
    //check if cell is full
    return; //if it is then end the function
  }
  cellClicks++;
  myE.target.classList.add("flip-vertical-right"); //causes the cell to do a flip animation
  whoPlayNow == "X" ? sound1.play() : sound2.play(); //plays a sound depending on who's is playing

  setTimeout(() => {
    let saveArray = [];
    myE.target.innerHTML = whoPlayNow; //based on who is playing add the corresponding letter to the cell
    whoPlayNow == "X" ? (whoPlayNow = "O") : (whoPlayNow = "X"); //change who's turn it is
    whosTurn.innerHTML = `${whoPlayNow} Goes Now!`; //display who's turn it is
    let cells = document.querySelectorAll("#gameDiv > div");
    for (let cell of cells) {
      //save the game automatically on each click
      saveArray.push(cell.innerHTML);
      let saveString = JSON.stringify(saveArray);
      localStorage.setItem("saveGame", saveString); //saves the cell contents
      localStorage.setItem("whosTurn", whoPlayNow); //saves who's turn it was
    }
    ifEndGame();
  }, 100);
};

const handleNewGame = () => {
  //starts a new game
  localStorage.removeItem("saveGame"); //delete saved game since a new one has been made
  localStorage.removeItem("whosTurn");
  whoPlayNow = "X"; // x always goes first at the start of the game by the rules
  whosTurn.innerHTML = `${whoPlayNow} Goes Now!`;
  cellClicks = 0;
  let cells = document.querySelectorAll("#gameDiv > div");
  for (let cell of cells) {
    cell.addEventListener("click", handleClickXO); //add events to the cells
    cell.classList.remove("flip-vertical-right");
    cell.classList.remove("flip-vertical-left"); //remove unnecessary classes and ids from previous games
    cell.removeAttribute("id", "winner");
    cell.removeAttribute("id", "draw");
    cell.innerHTML = ""; //clear the cells
  }
};
const volumeControl = (value) => {
  //function to set the volume of the sounds
  let volume = value / 10;
  sound1.volume = volume;
  sound2.volume = volume;
  sound3.volume = volume;
  sound4.volume = volume;
};

const setScore = (xScore, oScore) => {
  //changes the score in the HTML elements
  let xWins = document.querySelector("#xScore");
  let oWins = document.querySelector("#oScore");
  let saveScore = [];
  xWins.innerHTML = xScore;
  oWins.innerHTML = oScore;
  saveScore = [...saveScore, xScore, oScore];
  let stringSave = JSON.stringify(saveScore);
  localStorage.setItem("score", stringSave);
};

const loadScore = () => {
  //load saved score from local storage
  let getSavedScore = localStorage.getItem("score");
  let scoreArray = JSON.parse(getSavedScore);
  return scoreArray;
};

const handleClearScore = () => {
  //clears saved score from local storage
  const check = confirm("Are you sure you want to reset?"); //a prompt to check in case of user misclick
  if (check) {
    localStorage.removeItem("score");
    setScore(0, 0);
  } else {
    return;
  }
};

const initPageLoad = () => {
  let cells = document.querySelectorAll("#gameDiv > div");
  let whosTurn = document.querySelector("#whosTurn");
  let scoreBoard = document.querySelector("#scoreBoard");
  let xWins = document.querySelector("#xScore");
  let oWins = document.querySelector("#oScore");
  let volumeSlider = document.querySelector("#volume");
  let playAgainButton = document.querySelector("#playAgainBtn");
  let resetScoreButton = document.querySelector("#reset");
  let speaker = document.querySelector("#speakerImg");
  let getSavedGame = localStorage.getItem("saveGame");
  let getWhosTurn = localStorage.getItem("whosTurn");
  let saveArray = JSON.parse(getSavedGame);
  let saveArrayIndex = 0;
  let sound = true;
  if (
    !cells ||
    cells.length != 9 ||
    !whosTurn ||
    !scoreBoard ||
    !xWins ||
    !oWins ||
    !volumeSlider ||
    !playAgainButton ||
    !resetScoreButton ||
    !speaker
  ) {
    //check if all cells exist
    return;
  }
  if (saveArray && getWhosTurn) {
    //check if there is a saved game
    for (let cell of cells) {
      if (saveArray[saveArrayIndex]) {
        cell.innerHTML = saveArray[saveArrayIndex];
      } else {
        cell.innerHTML = "";
        cell.addEventListener("click", handleClickXO);
      }
      saveArrayIndex++;
      whoPlayNow = getWhosTurn;
    }
  } else {
    for (let cell of cells) {
      cell.addEventListener("click", handleClickXO); //add events to the cells
      cell.innerHTML = ""; //clear the cells in case that they are not
      whoPlayNow = "X";
    }
  }

  let { value } = document.querySelector("#volume");
  value = 2;
  volumeControl(value);
  volumeSlider.addEventListener("click", () => {
    let { value } = document.querySelector("#volume");
    if (value == 0) {
      speaker.setAttribute("src", "images/speakerM.png");
      sound = false;
    } else {
      speaker.setAttribute("src", "images/speaker.png");
      sound = true;
    }
    volumeControl(value);
  });
  speaker.addEventListener("click", () => {
    let slider = document.querySelector("#volume");
    if (sound) {
      speaker.setAttribute("src", "images/speakerM.png");
      slider.value = 0;
      volumeControl(0);
      sound = false;
    } else {
      speaker.setAttribute("src", "images/speaker.png");
      slider.value = 2;
      volumeControl(2);
      sound = true;
    }
  });
  document
    .querySelector("#playAgainBtn")
    .addEventListener("click", handleNewGame);
  document.querySelector("#reset").addEventListener("click", handleClearScore);

  // x always goes first at the start of the game by the rules
  whosTurn.innerHTML = `${whoPlayNow} Goes Now!`;
};

window.addEventListener("load", () => {
  initPageLoad();
  let scoreArray = [];
  if (loadScore() != null) {
    //checks if there is a save
    scoreArray = loadScore();
    setScore(scoreArray[0], scoreArray[1]);
  } else {
    setScore(0, 0); //in case there is no save then set score to 0
  }
});
