/*
  Лабораторная работа 2 по дисциплине ЛОИС
  гр.: 721702
  студент: Сурунтович Артём Андреевич
  Вычисление значения формулы по частично заданной интерпретации формулы .
*/
var array = new Array();
var firstRow = [];
var stackFormationTable = [];
var stackOperation = [];
var stackOfElements = [];
var stackResult = [];
var stackString = [];
var myString;
var arrayNumbers = new Array();
var table = document.getElementById("table");


function goToFormulaResultTest() {
    document.location.href = "FormulaResultTest.html";
}

function clearTable() {
    table.innerHTML = '';
    table.createCaption().innerHTML = 'Таблица истинности для всех комбинаций';
    let customParamTable = document.getElementById("lab-task-table");
    customParamTable.innerHTML = '';
    customParamTable.createCaption().innerHTML='Таблица истинности для заданных параметров';
}

function calculate() {
    clearTable();
    let formula = document.getElementById("logFormula").value;
    test(formula);
}


function pull() {
    for (i = 0; i < stackString.length; i++) {
        arrayNumbers.push(i);
    }
}


function refresh() {
    if (arrayNumbers.length != 0) {
        myString = stackString[arrayNumbers.pop()];
        document.getElementById('logic').innerHTML = myString;
    } else
        pull();
}


function newRefresh() {
    if (document.getElementById('text').value != '') {
        myString = document.getElementById('text').value;
        document.getElementById('logic').innerHTML = myString;
    }
}


function isUnaryOperation(operation) {
    if (operation == '!')
        return true;
    else
        return false;
}


function equivalence(one, two) {
    var result;

    if ((one == '1' && two == '1') || (one == '0' && two == '0')) {
        result = '1';
    } else if ((one == '1' && two == '0') || (one == '0' && two == '1')) {
        result = '0'
    }

    return result;
}


function implication(one, two) {
    var result;

    if ((one == '1' && two == '1') || (one == '0' && two == '0') || (one == '0' && two == '1')) {
        result = '1';
    } else if ((one == '1' && two == '0')) {
        result = '0'
    }

    return result;
}


function conjunction(one, two) {
    var result;

    if ((one == '1' && two == '1')) {
        result = '1';
    } else if ((one == '1' && two == '0') || (one == '0' && two == '0') || (one == '0' && two == '1')) {
        result = '0'
    }

    return result;
}


function disjunction(one, two) {
    var result;

    if ((one == '1' && two == '1') || (one == '1' && two == '0') || (one == '0' && two == '1')) {
        result = '1';
    } else if ((one == '0' && two == '0')) {
        result = '0'
    }

    return result;
}


function negation(one) {
    var result;

    if (one == '0') {
        result = '1';
    } else if (one == '1') {
        result = '0';
    }

    return result;
}


function showAnswer() {
    var stackAnswer = [];

    while (stackOfElements.length != 0) {
        if (stackOfElements[stackOfElements.length - 1].match(/[01]/g)) {
            stackAnswer.push(stackOfElements.pop());
        } else if (stackOfElements[stackOfElements.length - 1].match(/[~>&|]/g)) {

            var one = stackAnswer.pop();
            var two = stackAnswer.pop();

            switch (stackOfElements[stackOfElements.length - 1]) {
                case '~': {
                    stackAnswer.push(equivalence(two, one));
                    break;
                }
                case '>': {
                    stackAnswer.push(implication(two, one));
                    break;
                }
                case '&': {
                    stackAnswer.push(conjunction(two, one));
                    break;
                }
                case '|': {
                    stackAnswer.push(disjunction(two, one));
                    break;
                }
            }

            stackOfElements.pop();
        } else if (isUnaryOperation(stackOfElements[stackOfElements.length - 1])) {
            var one = stackAnswer.pop();
            stackAnswer.push(negation(one));
            stackOfElements.pop();
        }
    }

    return stackAnswer[0];
}


function findSymbols(element, massiv) {
    if (massiv.length == 0) {
        massiv.push(element);
    } else {
        if (massiv.indexOf(element) == -1) {
            massiv.push(element);
        }
    }
}


function doBinary(number, numElements, stackValue) {
    while (Math.floor(number / 2) != 0) {
        stackValue.push(number % 2);
        number = Math.floor(number / 2);
    }

    stackValue.push(number % 2);

    while (stackValue.length < numElements) {
        stackValue.push(0);
    }

    return stackValue;
}


function doClearStack(stack) {
    while (stack.length != 0) {
        stack.pop()
    }
}


function buildStackOfElements(newStr) {
    for (i = 0; i < newStr.length; i++) {

        if (newStr[i] == '(') {
            stackOperation.push(newStr[i]);
        } else if (newStr[i] == ')') {
            while (stackOperation[stackOperation.length - 1] != '(') {
                stackOfElements.push(stackOperation.pop());
            }
            stackOperation.pop();
        } else if (newStr[i].match(/[A-Z]/g) || newStr[i].match(/[01]/g)) {

            if (!newStr[i].match(/[01]/g))
                findSymbols(newStr[i], array);

            stackOfElements.push(newStr[i]);
        } else if (newStr[i].match(/[~>&|]/g)) {
            stackOperation.push(newStr[i]);
        } else if (isUnaryOperation(newStr[i])) {
            stackOperation.push(newStr[i]);
        }
    }

    stackOfElements.reverse();
}


function createTable(numRows, numCol) {
    firstRow.push(document.getElementById("logFormula").value);

    for (i = array.length - 1; i >= 0; i--) {
        firstRow.push(array[i]);
    }

    for (var i = 0; i <= numRows; i++) {

        var newRow = table.insertRow(i);

        for (var j = 0; j <= numCol; j++) {

            var newCell = newRow.insertCell(j);

            if (i == 0 && j >= 0) {
                if (j == numCol) {
                    newCell.className = 'yellow';
                }
                newCell.innerHTML = firstRow.pop();
                newCell.width = 50;
            } else {
                var number = stackFormationTable.pop();
                newCell.innerHTML = number;
                if (j == numCol) {
                    newCell.className = 'yellow';
                    stackResult.push(number);
                }
            }
        }
    }
    document.body.appendChild(table);
}


function main(newStr) {
    buildStackOfElements(newStr);
    var commonStack = [];

    for (i = 0; i < Math.pow(2, array.length); i++) {
        var stackValue = [];
        commonStack.push(doBinary(i, array.length, stackValue));
    }
    commonStack.reverse();

    for (k = 0; k < Math.pow(2, array.length); k++) {

        var oneSetOfValues = commonStack.pop();

        for (i = 0; i < array.length; i++) {

            var oneValue = oneSetOfValues.pop().toString();
            stackFormationTable.push(oneValue);

            for (j = stackOfElements.length - 1; j >= 0; j--) {
                if (array[i] == stackOfElements[j]) {
                    stackOfElements[j] = oneValue;
                }
            }
        }
        stackFormationTable.push(showAnswer());
        buildStackOfElements(newStr);
    }

    stackFormationTable.reverse();
    createTable(Math.pow(2, array.length), array.length);
}


function deleteAll() {
    doClearStack(stackOfElements);
    doClearStack(stackOperation);
    doClearStack(stackResult);
    doClearStack(stackFormationTable);
    doClearStack(array);
}


function test(formula) {
    var str = formula;
    var unary_formula = /\(\!([01]|[A-Z])\)/g;
    var binary_formula = /\(([01]|[A-Z])([\&\|\~]|(\-\>))([01]|[A-Z])\)/g;
    var messageField = document.getElementById("error-message");
    messageField.innerHTML = "";
    while (str.match(unary_formula) || str.match(binary_formula)) {

        if (str.match(unary_formula))
            str = str.replace(unary_formula, "1");
        else
            str = str.replace(binary_formula, "1");
    }

    table.innerHTML = '';
    table.createCaption().innerHTML = 'Таблица истинности для всех комбинаций';

    if (str.length == 1 && str.match(/[01]|[A-Z]/g)) {
        var replaceStr = formula.replace(/(\-\>)/g, ">");
        var newStr = replaceStr.split('');
        main(newStr);
    } else {
        messageField.innerHTML += 'Ошибка, выражение <strong>' + formula + '</strong> не является формулой логики высказываний.';
    }

    deleteAll();
}

function generateReplacementFields() {
    document.getElementById("input-fields").innerHTML = "";
    let expression = document.getElementById("logFormula").value;
    if (expression === null | expression.length === 0) {
        return;
    }
    let atomsArray = new Array();
    let symbolRegExp = /[A-Z]/;
    for (index = 0; index < expression.length; index++) {
        let char = expression.charAt(index);
        if (expression.charAt(index).match(symbolRegExp) !== null & !atomsArray.includes(expression.charAt(index))) {
            atomsArray.push(expression.charAt(index));
        }
    }
    let inputBlock = document.getElementById("input-fields");
    for (index = 0; index < atomsArray.length; index++) {
        let inputFieldLabel = document.createElement("label");
        inputFieldLabel.textContent = atomsArray[index] + ": ";
        let selectField = document.createElement("select");
        selectField.setAttribute("id", atomsArray[index])
        selectField.setAttribute("class", "formula-atoms-values")
        let trueOption = document.createElement("option");
        let falseOption = document.createElement("option");
        let undefinedOption = document.createElement("option");
        undefinedOption.textContent = "не выбрано";
        trueOption.textContent = "1";
        falseOption.textContent = "0";
        selectField.append(trueOption, falseOption, undefinedOption);
        inputFieldLabel.append(selectField);
        inputBlock.append(inputFieldLabel);
        inputBlock.append(document.createElement("br"));
    }
    let launchButton = document.createElement("button");
    launchButton.setAttribute("onclick", "generateTruthTableWithCustomParams()");
    launchButton.textContent = "Вычислить с заданными параметрами";
    inputBlock.append(launchButton)
}

function generateTruthTableWithCustomParams() {
    let formula = document.getElementById("logFormula").value;
    var str = formula;
    var unary_formula = /\(\!([01]|[A-Z])\)/g;
    var binary_formula = /\(([01]|[A-Z])([\&\|\~]|(\-\>))([01]|[A-Z])\)/g;
    var messageField = document.getElementById("error-message");
    messageField.innerHTML = "";
    while (str.match(unary_formula) || str.match(binary_formula)) {

        if (str.match(unary_formula))
            str = str.replace(unary_formula, "1");
        else
            str = str.replace(binary_formula, "1");
    }
    let map = collectInputValuesAsMap();
    let table = document.getElementById("lab-task-table");
    for (const [key, value] of map.entries()) {
        formula = formula.split(key).join(value);
    }
    if (str.length === 1 && str.match(/[01]|[A-Z]/g)) {
        var replaceStr = formula.replace(/(\-\>)/g, ">");
        var newStr = replaceStr.split('');
        mainWithParams(formula, newStr, table);
    } else {
        messageField.innerHTML += 'Ошибка, выражение <strong>' + formula + '</strong> не является формулой логики высказываний.';
    }

    deleteAll();
}

function collectInputValuesAsMap() {
    let selectFields = document.getElementsByClassName("formula-atoms-values");
    let map = new Map();
    for (index = 0; index < selectFields.length; index++) {
        let optionValue = selectFields[index].options[selectFields[index].selectedIndex].text;
        if (optionValue !== "не выбрано") {
            map.set(selectFields[index].getAttribute("id"), selectFields[index].value);
        }
    }
    return map;
}

function mainWithParams(parametrizedFormula, newStr, table) {
    buildStackOfElements(newStr);
    var commonStack = [];

    for (i = 0; i < Math.pow(2, array.length); i++) {
        var stackValue = [];
        commonStack.push(doBinary(i, array.length, stackValue));
    }
    commonStack.reverse();

    for (k = 0; k < Math.pow(2, array.length); k++) {

        var oneSetOfValues = commonStack.pop();

        for (i = 0; i < array.length; i++) {

            var oneValue = oneSetOfValues.pop().toString();
            stackFormationTable.push(oneValue);

            for (j = stackOfElements.length - 1; j >= 0; j--) {
                if (array[i] == stackOfElements[j]) {
                    stackOfElements[j] = oneValue;
                }
            }
        }
        stackFormationTable.push(showAnswer());
        buildStackOfElements(newStr);
    }

    stackFormationTable.reverse();
    fillTableForParametrizedFormula(parametrizedFormula, table, Math.pow(2, array.length), array.length);
}

function fillTableForParametrizedFormula(formula, table, numRows, numCol) {
    table.innerHTML = '';
    table.createCaption().innerHTML='Таблица истинности для заданных параметров';
    let firstRow = [];
    firstRow.push(formula);

    for (i = array.length - 1; i >= 0; i--) {
        firstRow.push(array[i]);
    }

    for (var i = 0; i <= numRows; i++) {

        var newRow = table.insertRow(i);

        for (var j = 0; j <= numCol; j++) {

            var newCell = newRow.insertCell(j);

            if (i == 0 && j >= 0) {
                if (j == numCol) {
                    newCell.className = 'yellow';
                }
                newCell.innerHTML = firstRow.pop();
                newCell.width = 50;
            } else {
                var number = stackFormationTable.pop();
                newCell.innerHTML = number;
                if (j == numCol) {
                    newCell.className = 'yellow';
                    stackResult.push(number);
                }
            }
        }
    }
    document.body.appendChild(table);
}
