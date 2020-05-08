/*
  Лабораторная работа 2 по дисциплине ЛОИС
  гр.: 721702
  студент: Сурунтович Артём Андреевич
  Вычисление значения формулы по частично заданной интерпретации формулы .
*/
var testMas;
var testNum;
var tests = ['(1|0)',
    '(1&1)',
'((1|0)|(0|1))',
'(((0|0)&((0~0)&(0->0))))',
' ((1->1)~(0~1))',
'((1->0)|(0~((1&1)->0)))'];

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

function validateUserAnswer() {
    var radBtns = document.getElementsByName("radio_button");
    var checkedValue;
    var correctAnswer;
    var checkedAnswer;
    var result;

    try {

        for (var i = 0; i < radBtns.length; i++) {
            if (radBtns[i].checked) {
                checkedValue = radBtns[i].value;
                break;
            }
        }

        if (checkedValue === undefined) {
            throw "Пожалуйста, выберите ответ!";
        }

        var inputFormula = document.getElementById("formula").value;

        correctAnswer =calculateSingleExp(inputFormula);
        checkedAnswer = checkedValue;

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


function calculateSingleExp(exp) {
        buildStackOfElements(exp)
    var stackAnswer = [];

    while(stackOfElements.length != 0)
    {
        if (stackOfElements[stackOfElements.length-1].match(/[01]/g)){
            stackAnswer.push(stackOfElements.pop());
        }
        else if (stackOfElements[stackOfElements.length-1].match(/[~>&|]/g)) {

            var one = stackAnswer.pop();
            var two = stackAnswer.pop();

            switch(stackOfElements[stackOfElements.length-1]) {
                case '~': {
                    stackAnswer.push(equivalence(two, one));
                    break;
                }
                case '>':
                {
                    stackAnswer.push(implication(two, one));
                    break;
                }
                case '&':
                {
                    stackAnswer.push(conjunction(two, one));
                    break;
                }
                case '|':
                {
                    stackAnswer.push(disjunction(two, one));
                    break;
                }
            }

            stackOfElements.pop();
        }
        else if(isUnaryOperation(stackOfElements[stackOfElements.length-1]))
        {
            var one = stackAnswer.pop();
            stackAnswer.push(negation(one));
            stackOfElements.pop();
        }
    }
    deleteAll();
    return stackAnswer[0];
}