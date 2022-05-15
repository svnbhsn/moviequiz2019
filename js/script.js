'use strict';

let questionNr = 0;
let playerPoints = 0;
let correctAnswerPoints = 10;
let currentQuestion;
let questions = [];
let selectedQuestions = [];

$.getJSON("questions.json", function (data) {

    $.each(data, function (key, val) {
        questions.push(val);

        shuffle(questions);

        selectedQuestions = questions.slice(0,5);

        console.log(selectedQuestions);
    });
});


function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }

// Frage + Antwortmöglichkeiten 
function showNextQuestion() {
    
        // Wenn es die letzte Frage ist
    if (questionNr == selectedQuestions.length - 1) {
        $("#btn-next").text("Zur Auswertung");
    }
    if (questionNr >= selectedQuestions.length) {
        quizResult();
    } else {
        $("#arrow").hide();
        $(".answer").removeClass("btn-warning btn-danger btn-success");
        $(".answer").addClass("btn-secondary");
        $("#btn-confirm").attr("disabled", "disabled");
        $("#btn-confirm").text("Bitte eine Antwort wählen ..");

        currentQuestion = selectedQuestions[questionNr];

        $("#question-number").text(questionNr + 1);

        $("#question-qoute").text(currentQuestion.qoute);
        $("#question-image").attr('src', currentQuestion.imgURL);
        $("#question-text").text(currentQuestion.question);
        $("#answer-a").text(currentQuestion.answers.A);
        $("#answer-b").text(currentQuestion.answers.B);
        $("#answer-c").text(currentQuestion.answers.C);
        $("#answer-d").text(currentQuestion.answers.D);

        $("#explain-img").attr('src', currentQuestion.explain.image);
        $("#rightAnswer").text(currentQuestion.explain.right);
        $("#explain-text").text(currentQuestion.explain.text);
    }

}

// Gibt die richtige Antwort zurück
function getRightAnswer() {
    return currentQuestion.right;
}


//------------------------------------
$("#btnStart").click(function () {
    $(".quiz-start").fadeOut(function () {
        startQuiz();
    });
});

function startQuiz() {
    $("#question").fadeIn(function () {
        $(this).removeAttr("hidden");
    });
    showNextQuestion();
}

function selectAnswer(id) {
    $(id).removeClass("btn-secondary");
    $(id).addClass("btn-warning");
}

function deselectAnswer(id) {
    $(id).removeClass("btn-warning");
    $(id).addClass("btn-secondary");
}

$("#btn-answer-a").click(function () {
    $("#btn-confirm").removeAttr("disabled");
    $("#btn-confirm").text("Antwort bestätigen!");
    selectAnswer("#btn-answer-a");
    deselectAnswer("#btn-answer-b");
    deselectAnswer("#btn-answer-c");
    deselectAnswer("#btn-answer-d");
});

$("#btn-answer-b").click(function () {
    $("#btn-confirm").removeAttr("disabled");
    $("#btn-confirm").text("Antwort bestätigen!");
    deselectAnswer("#btn-answer-a");
    selectAnswer("#btn-answer-b");
    deselectAnswer("#btn-answer-c");
    deselectAnswer("#btn-answer-d");
});
$("#btn-answer-c").click(function () {
    $("#btn-confirm").removeAttr("disabled");
    $("#btn-confirm").text("Antwort bestätigen!");
    deselectAnswer("#btn-answer-a");
    deselectAnswer("#btn-answer-b");
    selectAnswer("#btn-answer-c");
    deselectAnswer("#btn-answer-d");
});
$("#btn-answer-d").click(function () {
    $("#btn-confirm").removeAttr("disabled");
    $("#btn-confirm").text("Antwort bestätigen!");
    deselectAnswer("#btn-answer-a");
    deselectAnswer("#btn-answer-b");
    deselectAnswer("#btn-answer-c");
    selectAnswer("#btn-answer-d");
});

$("#btn-confirm").click(function () {
    checkAnswer();
});

// Auswertung einer Frage + Erklärungsfenster
function checkAnswer() {
    $("#btn-confirm").hide();
    $("#arrow").show();
    let rightAnswer = getRightAnswer();
    let selectedAnswer = $(".answer.btn-warning").text()[0];
    let selectedAnswerId = $(".answer.btn-warning").attr("id");
    $(".answer.btn-warning").removeClass("btn-warning");
    $(".answer.btn-secondary").removeClass("btn-secondary");
    if (selectedAnswer == rightAnswer) {
        // Richtig
        playerPoints += correctAnswerPoints;
        $("#" + selectedAnswerId).addClass("btn-success");
    } else {
        // Falsch
        $("#" + selectedAnswerId).addClass("btn-danger");
    }
    $("#explain-screen").removeAttr("hidden");
}

// Nächste Frage
$("#btn-next").click(function () {
    $("#explain-screen").attr("hidden", "hidden");
    $("#btn-confirm").show();
    questionNr++;
    showNextQuestion();

});

// Ende vom Quiz
function quizResult() {
    let resultImg;
    let resultText;

    $("#endpoints").text(playerPoints);
    $("#maxPoints").text(correctAnswerPoints * selectedQuestions.length);

    // Speichert Die erreichten Punkte in Webstorange
    if(localStorage.getItem("Zuerst Erreichte Punkte: ") != null) {
        localStorage.setItem("Neue Erreichte Punkte: ", playerPoints);
    } else {
        localStorage.setItem("Zuerst Erreichte Punkte: ", playerPoints);
    }

    // Ergebnis Bild und Text
    if (playerPoints === 50) {
        resultImg = $('<img src="img/result/r50.jpg" alt=""></img>');
        resultText = $("<h3></h3>").text("Hammer Leistung, du bist ein echter Film-Experte!");
    } else if (playerPoints >= 30 && playerPoints <= 40) {
        resultImg = $('<img src="img/result/r40.jpg" alt=""></img>');
        resultText = $("<h3></h3>").text("Super Leistung, da schaut jemand das Bonus Material!");
    } else {
        resultImg = $('<img src="img/result/r10.jpg" alt=""></img>');
        resultText = $("<h3></h3>").text("Zumindest hast du was dazu gelernt! :)");
    } 

    $("#result").append(resultImg, resultText);

    $("#question").fadeOut(function () {
        $("#gameOver-screen").removeAttr("hidden");
    });
}