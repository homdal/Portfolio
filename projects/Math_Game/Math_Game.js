const getRandomIntInclusive = (min, max) => {
  //get random number
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
};

let correctAnswer; //stores the correct answer of each equation to then compare to the user answer
let save = []; //stores correctly answered equations to save them into local storage

const anew = () => {
  //clear the input and remove classes before getting new equation
  document.querySelector("#answer").classList.remove("correct");
  document.querySelector("#answer").classList.remove("wrong");
  let answerInput = document.querySelector("#answer");
  let { value: from } = document.querySelector("#from");
  let { value: to } = document.querySelector("#to");
  answerInput.value = "";
  equation(from, to);
};

const equation = (from, to) => {
  //receives 2 numbers to use in the random function to generate a new equation
  let n1 = getRandomIntInclusive(from, to); //first number
  let n2 = getRandomIntInclusive(from, to); //second number
  let randomAction = getRandomIntInclusive(1, 4); //third number to randomly choose an action
  let action;
  if (randomAction == 1) {
    action = "+";
    correctAnswer = n1 + n2;
  }
  if (randomAction == 2) {
    action = "-";
    correctAnswer = n1 - n2;
  }
  if (randomAction == 3) {
    action = "*";
    correctAnswer = n1 * n2;
  }
  if (randomAction == 4) {
    action = "/";
    while (n1 % n2 != 0) {
      //choose only numbers that divide without remainder to make answering it easier
      n1 = getRandomIntInclusive(from, to);
      n2 = getRandomIntInclusive(from, to);
    }
    correctAnswer = n1 / n2;
  }
  document.querySelector("#quest").innerHTML = `${n1} ${action} ${n2} = `;
};

const checkAnswer = (answer) => {
  //compares user answer to correct answer
  if (answer == correctAnswer) {
    document.querySelector("#answer").classList.remove("wrong");
    document.querySelector("#answer").classList.add("correct");
    let equation = document.querySelector("#quest").innerHTML + answer;
    addToList(equation);
    setTimeout(anew, 2000);
  } else {
    document.querySelector("#answer").classList.add("wrong");
  }
};

const addToList = (equation) => {
  //adds solved equation to the list and saves it to local storage
  let list = document.querySelector("#list");
  let newItem = document.createElement("li");
  newItem.innerHTML = equation;
  list.appendChild(newItem);
  save = [...save, equation];
  let jsonStr = JSON.stringify(save);
  localStorage.setItem("solved", jsonStr);
};

const restoreSave = () => {
  //restores save from local storage
  save = [];
  let load = [];
  let jsonStr = localStorage.getItem("solved");
  load = JSON.parse(jsonStr);
  if (load) {
    for (let equation of load) {
      addToList(equation);
    }
  }
};

window.addEventListener("load", () => {
  document.querySelector("#form1").addEventListener("submit", (e) => {
    e.preventDefault();
  });
  let answer = document.querySelector("#answer");
  let from = document.querySelector("#from");
  let to = document.querySelector("#to");
  answer.value = "";
  from.value = 1;
  to.value = 10;
  equation(from.value, to.value);
  restoreSave();
  document.querySelector("#anBtn").addEventListener("click", () => {
    let { value: userAnswer } = document.querySelector("#answer");
    if (userAnswer) {
      checkAnswer(userAnswer);
    }
  });
  document.querySelector("#newBtn").addEventListener("click", () => {
    anew();
  });
});
