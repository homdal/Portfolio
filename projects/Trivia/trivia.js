let currentQuestion; //changes which question is displayed
let numberOfQue; //stores the number of the questions
let score = 0; //adds up points for correctly answered questions
let questionArray; //stores the questions

const getRandom = (min, max) => {
  //get random number
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const getQuestions = async (queNum, category, diff) => {
  //get questions from api
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
  //display the question and answer options in the HTML
  let randomCorrect = getRandom(1, 4); //randomize a number to make the correct answer location change everytime
  let question = document.querySelector("#question");
  numberOfQue = results.length;
  let ansArray = document.querySelectorAll(".answer"); //get all the answer buttons
  let incorrectIndex = 0; //reset the index for the wrong answer array
  for (let answer of ansArray) {
    //clear the buttons from previous text and events
    answer.innerHTML = "";
    answer.removeEventListener("click", handleCorrect);
    answer.removeEventListener("click", handleWrong);
  }
  if (results[currentQuestion]) {
    question.innerHTML = results[currentQuestion].question; //display the question
    document.querySelector(`#answr${randomCorrect}`).innerHTML =
      results[currentQuestion].correct_answer; //use the random number from before to display the correct answer in a random button out of the 4
    document
      .querySelector(`#answr${randomCorrect}`)
      .addEventListener("click", handleCorrect); //add event to the correct answer
    for (answer of ansArray) {
      if (!answer.innerHTML) {
        //check which buttons are still empty so it can add the wrong answers in
        answer.addEventListener("click", handleWrong); //add wrong answer event
        answer.innerHTML =
          results[currentQuestion].incorrect_answers[incorrectIndex];
        incorrectIndex++; //move up in the wrong answers array
      }
    }
  }
};

const handleCorrect = () => {
  //runs if the user chooses the correct answer
  currentQuestion++; //used get next question
  score += 10; //increase score
  if (currentQuestion == numberOfQue) {
    //check if that was the last question
    let question = document.querySelector("#question");
    question.innerHTML = `That was the final question, your score is: ${score}.`;
    return;
  } else {
    //if not run the next question
    runTrivia(questionArray);
  }
};
const handleWrong = () => {
  //runs if the user chooses the wrong answer
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
