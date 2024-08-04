var log_trace = "";

function realizar_operacao()
{
    // Limpando o log da operação antiga
    log_trace = "";

    let local = document.getElementById("inputLocal").value;
    let operacao = document.getElementById("inputOperacao").value;
    let id = document.getElementById("inputIdValor").value;
    let valor = document.getElementById("inputValorValor").value;

    if (id == undefined || id == "")
    {
        alert("Insira um id");
        return;
    }
    
    if (valor == undefined || valor == "")
    {
        alert("Insira um valor");
        return;
    }

    // Verificar se o ID é um valor numérico válido

    // Verificar se o valor é um número válido
        

    log_trace += "\nLocal de operação: " + local;
    log_trace += "\nOperação: " + operacao;
    log_trace += "\nID: " + id;
    log_trace += "\nValor: " + valor;
    // Ir realizando as operações com base nos parâmetros...
    // Cada operação vai dando append ao log_trace com as decisões que foram tomadas e por quais motivos
    // No final, esse log_trace vai ser colocado no cartão de log

    document.getElementById("log-trace").innerHTML = log_trace;
}