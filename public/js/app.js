"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let allCategories = [];
let currentCategory = null;
let currentQuestionIndex = 0;
let score = 0;
let unanswered = 0;
let timer;
let userName = "";
const welcomePage = document.getElementById("welcome-page");
const quizPage = document.getElementById("quiz-page");
const scorePage = document.getElementById("score-page");
const startQuizBtn = document.getElementById("start-quiz-btn");
const userNameInput = document.getElementById("username");
const topicOptionsContainer = document.getElementById("topic-options-container");
const questionCounterEl = document.getElementById("question-counter");
const progressBarEl = document.getElementById("progress-bar-fill");
const timerEl = document.getElementById("timer-value");
const questionTextEl = document.getElementById("question-text");
const answerOptionsContainer = document.getElementById("answer-options");
const nextQuestionBtn = document.getElementById("next-question-btn");
const skipQuestionBtn = document.getElementById("skip-question-btn");
const exitQuizBtn = document.getElementById("exit-quiz-btn");
const userProfileAvatar = document.getElementById("user-profile-avatar");
const userProfileName = document.getElementById("user-profile-name");
const scorePercentageEl = document.getElementById("score-percentage");
const scoreFeedbackMessageEl = document.getElementById("score-feedback-message");
const summaryTotalQuestionsEl = document.getElementById("summary-total-questions");
const summaryCorrectEl = document.getElementById("summary-correct");
const summaryIncorrectEl = document.getElementById("summary-incorrect");
const summaryUnansweredEl = document.getElementById("summary-unanswered");
const scoreMainContent = document.querySelector("#score-page .score-main-content");
const scoreMainHeadingEl = document.getElementById("score-main-heading");
const scoreSubHeadingEl = document.getElementById("score-sub-heading");
const rulesLink = document.getElementById("rules-link");
const rulesModal = document.getElementById("rules-modal");
const modalCloseBtn = document.getElementById("modal-close-btn");
const restartBtn = document.getElementById("restart-btn");
function loadCategories() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch("questions.json");
            if (!response.ok)
                throw new Error(`HTTP error! Status: ${response.status}`);
            const data = yield response.json();
            allCategories = data.categories;
            displayTopics();
        }
        catch (error) {
            console.error("Could not load categories:", error);
            welcomePage.innerHTML =
                "<h2>Sorry, could not load the quiz. Please try again later.</h2>";
        }
    });
}
function displayTopics() {
    topicOptionsContainer.innerHTML = "";
    allCategories.forEach((category) => {
        const topicId = `topic-${category.id}`;
        const topicDiv = document.createElement("div");
        topicDiv.className = "topic-option";
        const input = document.createElement("input");
        input.type = "radio";
        input.id = topicId;
        input.name = "topic";
        input.value = category.id;
        const label = document.createElement("label");
        label.htmlFor = topicId;
        label.textContent = category.name;
        topicDiv.append(input, label);
        topicOptionsContainer.appendChild(topicDiv);
    });
}
function handleStartQuiz() {
    userName = userNameInput.value.trim();
    const selectedTopic = document.querySelector('input[name="topic"]:checked');
    if (!userName) {
        alert("Please enter your full name.");
        return;
    }
    if (!selectedTopic) {
        alert("Please select a topic to continue.");
        return;
    }
    currentCategory =
        allCategories.find((cat) => cat.id === selectedTopic.value) || null;
    if (!currentCategory) {
        alert("Selected topic is invalid.");
        return;
    }
    currentQuestionIndex = 0;
    score = 0;
    unanswered = 0;
    welcomePage.classList.add("hidden");
    scorePage.classList.add("hidden");
    quizPage.classList.remove("hidden");
    showQuestion();
}
function showQuestion() {
    if (!currentCategory ||
        currentQuestionIndex >= currentCategory.questions.length) {
        showScore();
        return;
    }
    const question = currentCategory.questions[currentQuestionIndex];
    const totalQuestions = currentCategory.questions.length;
    questionCounterEl.textContent = `${currentQuestionIndex + 1} / ${totalQuestions}`;
    progressBarEl.style.width = `${((currentQuestionIndex + 1) / totalQuestions) * 100}%`;
    questionTextEl.textContent = `${currentQuestionIndex + 1}. ${question.question}`;
    answerOptionsContainer.innerHTML = "";
    skipQuestionBtn.hidden = false;
    question.options.forEach((optionText) => {
        const optionId = `option-${optionText.charAt(0)}`;
        const optionDiv = document.createElement("div");
        optionDiv.className = "answer-option";
        const input = document.createElement("input");
        input.type = "radio";
        input.id = optionId;
        input.name = "answer";
        input.value = optionText.charAt(0);
        const label = document.createElement("label");
        label.htmlFor = optionId;
        label.textContent = optionText;
        input.addEventListener("change", () => handleAnswerSelection(input, question.correctAnswer));
        optionDiv.append(input, label);
        answerOptionsContainer.appendChild(optionDiv);
    });
    startTimer();
}
function handleAnswerSelection(selectedInput, correctAnswer) {
    var _a;
    clearInterval(timer);
    answerOptionsContainer
        .querySelectorAll('input[type="radio"]')
        .forEach((radio) => (radio.disabled = true));
    // Add this line to disable the skip button
    skipQuestionBtn.hidden = true;
    const parentDiv = selectedInput.closest(".answer-option");
    if (selectedInput.value === correctAnswer) {
        parentDiv === null || parentDiv === void 0 ? void 0 : parentDiv.classList.add("correct");
    }
    else {
        parentDiv === null || parentDiv === void 0 ? void 0 : parentDiv.classList.add("incorrect");
        const correctOption = document.querySelector(`input[value="${correctAnswer}"]`);
        (_a = correctOption === null || correctOption === void 0 ? void 0 : correctOption.closest(".answer-option")) === null || _a === void 0 ? void 0 : _a.classList.add("correct");
    }
}
function moveToNextQuestion(wasSkipped = false) {
    clearInterval(timer);
    if (wasSkipped) {
        unanswered++;
    }
    else {
        const selectedAnswer = document.querySelector('input[name="answer"]:checked');
        if (selectedAnswer) {
            const question = currentCategory.questions[currentQuestionIndex];
            if (selectedAnswer.value === question.correctAnswer) {
                score++;
            }
        }
        else {
            unanswered++;
        }
    }
    currentQuestionIndex++;
    showQuestion();
}
function startTimer() {
    let timeLeft = 10;
    timerEl.textContent = `0:${String(timeLeft).padStart(2, "0")}`;
    clearInterval(timer);
    timer = window.setInterval(() => {
        timeLeft--;
        if (timeLeft >= 0) {
            timerEl.textContent = `0:${String(timeLeft).padStart(2, "0")}`;
        }
        else {
            clearInterval(timer);
            moveToNextQuestion(true);
        }
    }, 1000);
}
function showScore() {
    quizPage.classList.add("hidden");
    scorePage.classList.remove("hidden");
    const totalQuestions = currentCategory.questions.length;
    const incorrect = totalQuestions - score - unanswered;
    const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
    userProfileName.textContent = userName;
    userProfileAvatar.textContent = userName.charAt(0).toUpperCase();
    scorePercentageEl.textContent = `${percentage}%`;
    summaryTotalQuestionsEl.textContent = String(totalQuestions);
    summaryCorrectEl.textContent = String(score);
    summaryIncorrectEl.textContent = String(incorrect);
    summaryUnansweredEl.textContent = String(unanswered);
    if (percentage >= 50) {
        scoreMainContent.classList.remove("low-score");
        scoreMainHeadingEl.textContent = "C O N G R A T U L A T I O N";
        scoreSubHeadingEl.textContent = "You successfully completed the Quiz";
        scoreFeedbackMessageEl.style.display = "block";
        scoreFeedbackMessageEl.textContent = "Great job!";
    }
    else {
        scoreMainContent.classList.add("low-score");
        scoreMainHeadingEl.textContent = "Keep Practicing!";
        scoreSubHeadingEl.textContent =
            "You successfully completed the Quiz but you need to";
        scoreFeedbackMessageEl.style.display = "none";
    }
}
function resetQuiz() {
    scorePage.classList.add("hidden");
    quizPage.classList.add("hidden");
    welcomePage.classList.remove("hidden");
    userNameInput.value = "";
    const checkedTopic = document.querySelector('input[name="topic"]:checked');
    if (checkedTopic) {
        checkedTopic.checked = false;
    }
}
document.addEventListener("DOMContentLoaded", () => {
    loadCategories();
    startQuizBtn.addEventListener("click", handleStartQuiz);
    nextQuestionBtn.addEventListener("click", () => moveToNextQuestion(false));
    skipQuestionBtn.addEventListener("click", () => moveToNextQuestion(true));
    exitQuizBtn.addEventListener("click", resetQuiz);
    restartBtn.addEventListener("click", resetQuiz);
    rulesLink.addEventListener("click", (e) => {
        e.preventDefault();
        rulesModal.classList.remove("hidden");
    });
    modalCloseBtn.addEventListener("click", () => {
        rulesModal.classList.add("hidden");
    });
    rulesModal.addEventListener("click", (e) => {
        if (e.target === rulesModal) {
            rulesModal.classList.add("hidden");
        }
    });
});
