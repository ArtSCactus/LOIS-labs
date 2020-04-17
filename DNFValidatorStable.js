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

    if (!isBracketsBalanced(inputFormula)) {
        text = "Неверно расставлены скобки!";
    } else {
        var answer = valid(inputFormula);

        if (answer) {
            text = "Данная формула является ДНФ!";
        } else {
            text = "Данная формула не является ДНФ!";
        }
    }

    document.getElementById("answer").innerHTML = "Ответ: " + text;
}

function valid(expression) {
    let replacementSymbol = 'A';
    let simplified_exp =/\(?[A-Z]\)?/g;
    let negative = /\(![A-Z]\)/g;
    let modifiable_exp = expression;
    let simple_konj = /\([A-Z]&[A-Z](&[A-Z])*\)/;
    let disjunc = /\(?[A-Z]\|[A-Z](\|[A-Z])*\)?/;
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
