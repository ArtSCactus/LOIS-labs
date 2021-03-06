var testMas;
var testNum;
var tests = ['A|D',
    '(A&B)',
    '(D&!(A&C))',
    '(0|1)',
    '(A|B|C)',
    '(A&B)|((B&C)|(C&D))',
    '(E|(D&(A|0)))',
    '(A|(C|((D&A)|(C&D))))',
    'A'];

document.addEventListener("DOMContentLoaded", start);

function start() {
    testMas = tests;
    testNum = 0;
    showTest();
}

function goToStandart() {
    document.location.href = "index.html";
}

function showTest() {
    document.getElementById("formula").value = tests[testNum];
}

function test() {
    var radBtns = document.getElementsByName("radio_button");
    var checkedNum;
    var correctAnswer;
    var checkedAnswer;
    var result;

    try {

        for (var i = 0; i < radBtns.length; i++) {
            if (radBtns[i].checked) {
                checkedNum = i;
            }
        }

        if (checkedNum === undefined) {
            throw "Пожалуйста, выберите ответ!";
        }

        var inputFormula = document.getElementById("formula").value;

        correctAnswer = validate(inputFormula);
        checkedAnswer = (checkedNum === 0);

        if (checkedAnswer === correctAnswer) {
            result = "Ответ верный";
        } else {
            result = "Ответ неверный";
        }

        document.getElementById("answer").innerHTML = result;
    } catch (e) {
        alert(e);
    }
}

function next() {
    try {

        if (testNum + 1 > testMas.length - 1) {
            throw "Вы достигли конца теста!";
        }

        document.getElementById("answer").innerHTML = "";

        testNum++;
        showTest();
    } catch (e) {
        alert(e);
    }
}

function previous() {
    try {

        if (testNum - 1 < 0) {
            throw "Это первая формула теста!";
        }

        document.getElementById("answer").innerHTML = "";

        testNum--;
        showTest();
    } catch (e) {
        alert(e);
    }
}
