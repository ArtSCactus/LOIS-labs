/*
 * Лабораторная работа 1 по дисциплине ЛОИС
 * гр.: 721702
 * студент: Сурунтович Артём Андреевич
 * Проверка на соответствие высказывания ДНФ.
 * 
*/
function goToInteractiveTest() {
    document.location.href = "test.html";
}

function checkFormulaWithPrinting() {
    var inputFormula = document.getElementById("formula").value;
    var text;
    if (inputFormula === '' | inputFormula === null){
        text = "Вы не ввели формулу."
    }else{
        if (!isBracketsBalanced(inputFormula)) {
            text = "Неверно расставлены скобки!";
        } else {
            var answer = validate(inputFormula);

            if (answer) {
                text = "Данная формула является ДНФ!";
            } else {
                text = "Данная формула не является ДНФ!";
            }
        }
    }
    document.getElementById("answer").innerHTML = "Ответ: " + text;
}

function validate(expression) {
    let replacementSymbol = 'A';
    let negative = /\(![A-Z]\)/g;
    let modifiable_exp = expression;
    let simple_konj = /\([A-Z]&[A-Z](&[A-Z])*\)/;
    let disjunc = /[A-Z]\|[A-Z](\|[A-Z])*/;
    if (modifiable_exp.match(/\(!\([A-Z](\&[A-Z])+\)\)/) !== null) {
        return false;
    }
    while (modifiable_exp.match(negative) !== null) {
        modifiable_exp = modifiable_exp.replace(negative, replacementSymbol);
    }
    while (modifiable_exp.match(simple_konj) !== null) {
        modifiable_exp = modifiable_exp.replace(simple_konj, replacementSymbol);
    }
    while (modifiable_exp.match(disjunc) !== null) {
        modifiable_exp = modifiable_exp.replace(disjunc, replacementSymbol);
    }
    if (modifiable_exp === replacementSymbol) {
        return true;
    } else {
        return false;
    }
}

function isBracketsBalanced(str) {
    var closedBrackets = 0;
    var openBrackets = 0;
    for (var index = 0; index < str.length; index++) {
        var char = str.charAt(index);
        if (char === '(') {
            openBrackets++;
        }
        if (char === ')') {
            closedBrackets++;
        }

    }
    return openBrackets === closedBrackets;
}
