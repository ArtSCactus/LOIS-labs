
function check(expression) {
    var temp = expression;
    var replacementSymbol = 'A';
    var negative = /\(![A-Z]\)/g;
    var konj = /\([A-Z]\&[A-Z]\)/g; // замена со скобками /\([A-Z]\&[A-Z]\)/g
    var dns = /^\(*(!?\(?[A-Z][0-9]*\)?|!?\([A-Z][0-9]*[&][A-Z][0-9]*\))((\||\&)(!?\(?[A-Z][0-9]*\)?|!?\([A-Z][0-9]*[&][A-Z][0-9]*\)))*\)*$/;
    var konjWithoutBracket = /([A-Z]|\([A-Z][0-9]*[&][A-Z][0-9*]\))\&([A-Z][0-9]*|\([A-Z][0-9]*[&][A-Z][0-9]*\))/g;
    if (temp.match(/(![&|]|[&|]!)/) !== null) {
        return false;
    }
    while (temp.match(negative) !== null) {
        //   simpleConjunctionsNotFound = false;
        temp = temp.replace(negative, replacementSymbol);
    }
    if (temp.match(/\(!\([A-Z](\&[A-Z])\)+\)/) !== null) {
        return false;
    }
    if (temp.match(/^\([A-Z](&[A-Z])*\)$/) !== null) {
        return true;
    }
    while (temp.match(konj/*konjWithoutBracket*/) !== null) {
        //  temp = temp.replace(konjWithoutBracket, replacementSymbol);
        temp = temp.replace(konj, replacementSymbol);
    }
    if (temp.match(dns) !== null) {
        if (temp.match(/^\([A-Z][0-9]*(\|[A-Z][0-9]*)\)$/)) { // old: \(\(*[A-Z][0-9]*\)*(\|\(?[A-Z][0-9]*\)?)*\)$
            return true;
        }
        return false;
    }
    return false;
}

function checkDoubleSymbol(expression) {
    var dnsExpression = expression;
    dnsExpression = dnsExpression.substring(1, dnsExpression.length - 1);
    var subFormula = /\(([[A-Z]|&|\(|\!|\))+\)/;
    while (dnsExpression.match(subFormula) !== null) {
        var sub = dnsExpression.match(subFormula)[0];
        var negative = [];
        var positive = [];
        dnsExpression = dnsExpression.replace(subFormula, '');

        while (sub.match(/\(\![A-Z]\)/) !== null) {
            var symbol = sub.match(/\(\![A-Z]\)/)[0].match(/[A-Z]/)[0];
            negative.push(symbol);
            sub = sub.replace(/\(\![A-Z]\)/, '');
        }

        while (sub.match(/[A-Z]/) !== null) {
            var symbol = sub.match(/[A-Z]/)[0];
            positive.push(symbol);
            sub = sub.replace(/[A-Z]/, '');
        }

        while (negative.length > 0) {
            if (positive.indexOf(negative.pop()) !== -1) {
                return false;
            }
        }
    }
    return true;
}

function checkDisjunction(formula) {
    var result = false;
    if (formula.charAt(0) === '!') {
        return false;
    }
    //if (bracketsRegExp.test(formula)) {
    formula = cutBrackets(formula);

    var operatorIndex = findOperatorIndex(formula, '|');
    var subforms = getSubforms(formula, operatorIndex);

    for (var i = 0; i < subforms.length; i++) {
        result = checkAtom(subforms[i])
            || checkNegation(subforms[i])
            || checkConjunction(subforms[i])
            || isSimpleDnf(subforms[i])
            || checkDisjunction(subforms[i]);

        if (result === false) {
            break;
        }

    }

    return result;
}

function checkConjunction(formula) {
    var result = false;
    if (formula.charAt(0) === '!' || formula.charAt(1) === '!') {
        return false;
    }
    //   var bracketsRegExp = /^(\((\(.+\))+\)|\([A-Z][&|!][A-Z]\))$/;
    var bracketsRegExp = /^\(\(?[A-z]\)?&\(?[A-z]\)?\)$/;
    // if (bracketsRegExp.test(formula)) {
    //   formula = cutBrackets(formula);
    //  }
    if (bracketsRegExp.test(formula)) {
        return true;
    } else {
        return false;
    }

    /* var operatorIndex = findOperatorIndex(formula, '&');
     var subforms = getSubforms(formula, operatorIndex);

     for (var i = 0; i < subforms.length; i++) {
         result = checkAtom(subforms[i])
             || checkNegation(subforms[i])
             || checkDisjunction(subforms[i])
             || isSimpleDnf(subforms[i])
             || checkConjunction(subforms[i]);

         if (result === false) {
             break;
         }
     }*/

    return result;
}

function findOperatorIndex(formula, operator) {
    var i = 0;
    var unclosedBrackets = 0;

    while (i < formula.length) {
        if (formula[i] === '(') {
            unclosedBrackets++;
        } else if (formula[i] === ')') {
            unclosedBrackets--;
        } else if (formula[i] === operator && unclosedBrackets === 0) {
            break;
        }

        i++;
    }

    return i;
}

function checkNegation(formula) {
    var unaryComplexPat = /^(\(!([A-Z])+\)\d*|!\([A-Z][&|][A-Z]\))$/;
    var negationKNF = /!\([A-Z][&|][A-Z]\)/;
    var result = unaryComplexPat.test(formula);
    if (negationKNF.test(formula)) {
        return false;
    }
    return result;
}

function checkAtom(formula) {
    var unaryComplexPat = /^\(?[A-z]+\)?\d*$/;
    var negatiation = /^\(?![A-z]\)?/;
    if (negatiation.test(formula)) {
        return true;
    }
    var result = unaryComplexPat.test(formula);
    return result;
}

function cutBrackets(formula) {
    var second = 1;
    var newLength = formula.length - 2;
    var openBrackets = 0;
    var cleanFormula = formula.substr(second, newLength);
    var closedBrackets = 0;
    if (isBracketsBalanced(cleanFormula)) {
        return cleanFormula;
    } else {
        return formula;
    }
}

function getSubforms(formula, operatorIndex) {
    var subforms = [];
    var leftPart = formula.slice(0, operatorIndex);
    if (!isEmpty(leftPart)) {
        subforms.push(leftPart);
    }
    var rightPart = formula.slice(operatorIndex + 1, formula.length);
    if (!isEmpty(rightPart)) {
        subforms.push(rightPart);
    }

    return subforms;
}

function isEmpty(str) {
    return str.trim() === '';
}

function isSimpleDnf(expression) {
    var regexp = /(\|?\((&?[A-Z]&?)+\)\|\((&?[A-Z]&?)+\)?)+/;
    return regexp.test(expression);
}

/*    var konjRegExp = /([A-Z][1-9]&[A-Z][1-9])/;
    var dnfRegExp = /^\(?(\(?[A-Z][1-9]*\)?)(\|\(?[A-Z][1-9]*\)?)*\)?$/;
    var postKonjRegExp = /\(?\([A-Z][1-9]*\)\)?((\|\(?\([A-Z][1-9]*\)\)?)+)?/;
    var notGrammarDNF = /\(?[A-z]((\|\(?[A-z]\)?)+)?\)/;*/