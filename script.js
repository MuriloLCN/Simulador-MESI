var log_trace = "";

var cache_nova_iorque = [1,2,3,4,5,6,7,8,9,1,5,8,8];
var cache_berlim = [1];
var cache_toquio = [1,23,4,12];

var ram = [];

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
        
    gui_atualizar_cache(1);
    gui_atualizar_cache(2);
    gui_atualizar_cache(3);
    // gui_atualizar_ram();

    log_trace += "<br> Local de operação: " + local;
    log_trace += "<br> Operação: " + operacao;
    log_trace += "<br> ID: " + id;
    log_trace += "<br> Valor: " + valor;
    // Ir realizando as operações com base nos parâmetros...
    // Cada operação vai dando append ao log_trace com as decisões que foram tomadas e por quais motivos
    // No final, esse log_trace vai ser colocado no cartão de log

    document.getElementById("log-trace").innerHTML = log_trace;
}

function gui_atualizar_cache(cache)
{
    /*
        Atualiza por completo uma view da cache de um dos locais com base na nova tabela
        cache: O valor inteiro representando a cache a ser atualizada
    */

    let cache_usada;
    let elemento_pai;

    if (cache == 1)
    {
        cache_usada = cache_nova_iorque;
        elemento_pai = document.getElementById("lista-ny");
    }
    else if (cache == 2)
    {
        cache_usada = cache_berlim;
        elemento_pai = document.getElementById("lista-be");
    }
    else
    {
        cache_usada = cache_toquio;
        elemento_pai = document.getElementById("lista-tk");
    }

    elemento_pai.innerHTML = "";

    
    for (let i = 0; i < cache_usada.length; i++)
    {
        let novo_filho = document.createElement("tr");
        let texto = "";
        texto += "<td>"+ i +"</td>";  // aqui vem o ID
        texto += "<td>"+ i +"</td>";  // aqui vem o valor
        texto += "<td>"+ i +"</td>";  // aqui vem o status
        novo_filho.innerHTML = texto; 
        elemento_pai.appendChild(novo_filho);      
    }
}