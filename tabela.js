function build() {
    let i, j;
    let placeholder = document.getElementById("table-placeholder");
    let text = (document.getElementById("expression")).value;
    if (text == "") {
        placeholder.innerHTML = "<div></div>";
        return;
    }
    if (text.match(/[^ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz01=!&|() ]/g) != null) {
        placeholder.innerHTML = "<p>Caractere inválido inserido.</p>";
        return;
    }
    text = text.replace(/ /g, '');
    text = text.toUpperCase();

    // Se tem mais parenteses abrindo do que fechando
    while (numOf(text, '(') > numOf(text, ')'))
        text += ")";
    let variables = [];

    // Constrói o array de variáveis
    for (i = 0; i < text.length; i++) {
        if ((text[i] >= 'A' && text[i] <= 'Z')) {
            if (text.indexOf(text[i]) == i) {
                variables.push(text[i]);
            }
        }
    }
    variables.sort();
    if (variables.length > 8) {
        placeholder.innerHTML = "<p>O número máximo de variáveis é 8.</p>";
        return;
    }
    let string = "";
    string += "<tr>";

    /*
     * Gera a tabela verdade (html)
     * Variável: string
     */

    for (i = 0; i < variables.length; i++) {
        string += "<th>" + variables[i] + "</th>";
    }
    string += "<th>" + text + "</th></tr>";
    // Para cada variável, preciso de 2^n valores, onde n = número de variáveis
    for (i = 0; i < Math.pow(2, variables.length); i++) {
        string += "<tr>";
        let data = [];
        for (j = 0; j < variables.length; j++) {
            console.log(Math.floor(i / Math.pow(2, variables.length - j - 1)));
            data[j] = Math.floor(i / Math.pow(2, variables.length - j - 1)) % 2;
            if (data[j] == 0)
                string += "<td>F</td>";
            else
                string += "<td>V</td>";
        }
        let equation = text;
        for (j = 0; j < variables.length; j++) {
            equation = equation.replace(new RegExp(variables[j], 'g'), data[j]);
        }
        string += "<td>" + solve(equation) + "</td></tr>";
    }
    string = "<table align='center' id>" + string + "</table>";

    /*
     * Caso os testes falhem e não existem nenhuma coluna (<td>), imprimir erro
     */

    if (string.indexOf("<td></td>") == -1)
        placeholder.innerHTML = string;
    else
        placeholder.innerHTML = "<p>Expressão inválida.</p>";

    function numOf(text, search) {
        let count = 0;
        for (let i = 0; i < text.length; i++)
            if (text[i] == search)
                count++;
        return count;
    }

    /*
     * Resolve a expressão, realizando os cálculos uma coluna por vez (<td></td)
     */

    function solve(equation) {
        while (equation.indexOf("(") != -1) {
            let start = equation.lastIndexOf("(");
            let end = equation.indexOf(")", start);
            if (start != -1)
                equation = equation.substring(0, start)
                    + solve(equation.substring(start + 1, end))
                    + equation.substring(end + 1);
        }
        equation = equation.replace(/''/g, '');
        // Caso a variável possua ' (not), inverte os valores
        equation = equation.replace(/0'/g, '1');
        equation = equation.replace(/1'/g, '0');

        // Caso a equação das variáveis sejam AB (seguidas), adiciona um & entre elas
        // para fazer a avaliação da expressão
        for (let i = 0; i < equation.length - 1; i++)
            if ((equation[i] == '0' || equation[i] == '1') && (equation[i + 1] == '0' || equation[i + 1] == '1'))
                equation = equation.substring(0, i + 1) + '&' + equation.substring(i + 1, equation.length);

        // Calcula o valor da expressão passada, utilizando o eval
        try {
            let safeEval = eval;
            let answer = safeEval(equation);
            if (answer == 0)
                return 0;
            if (answer > 0)
                return 1;
            return '';
        } catch (e) {
            return '';
        }
    }
}
