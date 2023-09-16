let correctAnswer;
let currentQuestion;
let numberOfQue;
let score = 0;
let questionArray;

const getRandom = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
};
const getQuestions = async (queNum, category, diff) => {
  try {
    let data = await axios.get(
      `https://opentdb.com/api.php?amount=${queNum}&category=${category}&difficulty=${diff}&type=multiple`
    );
    questionArray = await data.data.results;
    runTrivia(questionArray);
  } catch (error) {
    console.log(error);
  }
};

const runTrivia = (results) => {
  let randomCorrect = getRandom(1, 4);
  let question = document.querySelector("#question");
  numberOfQue = results.length;
  let ansArray = document.querySelectorAll(".answer");
  let incorrectIndex = 0;
  for (let answer of ansArray) {
    answer.innerHTML = "";
    answer.removeEventListener("click", handleCorrect);
    answer.removeEventListener("click", handleWrong);
  }
  if (results[currentQuestion]) {
    question.innerHTML = results[currentQuestion].question;
    document.querySelector(`#answr${randomCorrect}`).innerHTML =
      results[currentQuestion].correct_answer;
    document
      .querySelector(`#answr${randomCorrect}`)
      .addEventListener("click", handleCorrect);
    for (answer of ansArray) {
      if (!answer.innerHTML) {
        answer.addEventListener("click", handleWrong);
        answer.innerHTML =
          results[currentQuestion].incorrect_answers[incorrectIndex];
        incorrectIndex++;
      }
    }
  }
};

const handleCorrect = () => {
  currentQuestion++;
  score += 10;
  if (currentQuestion == numberOfQue) {
    let question = document.querySelector("#question");
    question.innerHTML = `That was the final question, your score is: ${score}.`;
    return;
  } else {
    runTrivia(questionArray);
  }
};
const handleWrong = () => {
  console.log("I AM RUNNING");
  currentQuestion++;
  if (currentQuestion == numberOfQue) {
    let question = document.querySelector("#question");
    question.innerHTML = `That was the final question, your final score is: ${score}.`;
    return;
  } else {
    runTrivia(questionArray);
  }
};

window.addEventListener("load", () => {
  let queNum = document.querySelector("#queNum");
  currentQuestion = 0;
  queNum.value = 1;
  document.querySelector("#submit").addEventListener("click", () => {
    let { value: queNum } = document.querySelector("#queNum");
    let { value: category } = document.querySelector("#category");
    let { value: diff } = document.querySelector("#difficulty");
    score = 0;
    currentQuestion = 0;
    getQuestions(queNum, category, diff);
  });
});
