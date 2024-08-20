/*

*/

const tamanho_bloco_memoria = 16;
const tamanho_max_cache = 16;
const tamanho_max_ram = 256;

var log_trace = "";

// Cache:
//    Bloco | Offset | Estado | Valor
//    Bloco = 0 até (tamanho_max_ram / tamanho_bloco_memoria) - 1
//    Offset = Endereço - Bloco * tamanho_bloco_memoria
//    Estado = MESI
//    Valor = Dinheiro envolvido no lance

// RAM:
//    Endereço | Valor | Nome
//    Endereço = 0 até tamanho_max_ram - 1
//    Valor = Dinheiro envolvido no lance
//    Nome = Nome aleatório gerado

var cache_nova_iorque = [1,2,3,4,5,6,7,8,9,1,5,8,8];
var cache_berlim = [1];
var cache_toquio = [1,23,4,12];

var ram = [];

function dar_lance(local, endereco, valor)
{

}

function buscar_preco(local, endereco)
{

}

function entrada_mesi(operacao, valor, endereco, local)
{
    if (operacao == 1)
    {
        log_trace += "<br> Iniciando operação: Dar lance (escrita) no item de endereço " + endereco + " com o valor de " + valor + " reais por meio do local " + local;
        dar_lance(local, endereco, valor);
    }
    else if (operacao == 2)
    {
        log_trace += "<br> Iniciando operação: Buscar preço (leitura) no item de endereço " + endereco + " por meio do local " + local;
        buscar_preco(local, endereco);
    }
}

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
    
    if ((valor == "" && operacao == 1)|| valor == undefined)
    {
        alert("Insira um valor");
        return;
    }

    // Verificar se o ID é um valor numérico válido

    // Verificar se o valor é um número válido

    // Realizar MESI
    entrada_mesi(operacao, valor, id, local);
        
    gui_atualizar_cache(1);
    gui_atualizar_cache(2);
    gui_atualizar_cache(3);
    gui_atualizar_ram();

    log_trace += "<br> Local de operação: " + local;
    log_trace += "<br> Operação: " + operacao;
    log_trace += "<br> ID: " + id;
    log_trace += "<br> Valor: " + valor;
    log_trace += "<br> " + geradorItemAleatorio();
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

        texto += "<td>"+ i +"</td>";  // aqui vem o Bloco
        texto += "<td>"+ i +"</td>";  // aqui vem o Offset
        texto += "<td>"+ i +"</td>";  // aqui vem o Estado
        texto += "<td>"+ i +"</td>";  // aqui vem o valor
        novo_filho.innerHTML = texto; 
        elemento_pai.appendChild(novo_filho);      
    }
}

function gui_atualizar_ram()
{
    /*
        Atualiza a RAM na tela do navegador com os dados armazenados nela
    */
    let elemento_pai = document.getElementById("lista-ram");

    elemento_pai.innerHTML = "";

    for (let i = 0; i < ram.length; i++)
    {
        let novo_filho = document.createElement("tr");
        let texto = "";
        texto += "<td>" + ram[i].endereco + "</td>"; // Id 
        texto += "<td>" + ram[i].valor + "</td>"; // Valor
        texto += "<td>" + ram[i].nome + "</td>"; // Nome
        novo_filho.innerHTML = texto;
        elemento_pai.appendChild(novo_filho);
    }
}

function preencher_ram()
{
    for (let i = 0; i < tamanho_max_ram; i++)
    {
        let obj = {endereco: i, valor: 1, nome: geradorItemAleatorio()};
        ram.push(obj);
    }
}

function inicializar_pagina()
{
    preencher_ram();
    gui_atualizar_ram();
}

function geradorItemAleatorio()
{
    let items = [
        "caixa de marcadores",
        "brócolis",
        "brilho labial",
        "saco de pipoca",
        "pena",
        "grudar",
        "veleiro",
        "ponteiro laser",
        "remoto",
        "fita adesiva",
        "televisão",
        "canudo",
        "bola de futebol",
        "telefone",
        "par de brincos",
        "garrafa de especiarias",
        "leão",
        "poucas baterias",
        "caixa de chocolates",
        "meias",
        "par de óculos de água",
        "lata de refrigerante",
        "dinossauro de pelúcia",
        "árvore",
        "beisebol",
        "taco de piscina",
        "pônei de pelúcia",
        "renda",
        "tesoura",
        "vela",
        "par de pinças",
        "faca",
        "livro de partidas",
        "janela",
        "cubo de gelo",
        "chave",
        "caixa de sorvete",
        "bandeira",
        "faca de manteiga",
        "chocolate",
        "laranja",
        "espelho de mão",
        "tubo de papel higiênico",
        "cenoura",
        "secador de cabelo",
        "casa",
        "saco de elásticos",
        "martelo",
        "estatueta",
        "CD de música",
        "pulseira",
        "frasco de protetor solar",
        "colher de pau",
        "Desodorante",
        "sapo de pelúcia",
        "sino",
        "controle sem fio",
        "vaca",
        "taco de beisebol",
        "pote de picles",
        "cristal de quartzo",
        "rádio",
        "par de óculos de sol",
        "cartucho de jogo",
        "pão",
        "pulseira",
        "chão",
        "caneca de café",
        "garrafa vazia",
        "limão",
        "balão",
        "bolsa pequena",
        "porta",
        "blusa",
        "carro",
        "chave de fenda",
        "pote de biscoitos",
        "recipiente de pudim",
        "garrafa de óleo",
        "anel",
        "carretel de linha",
        "unha",
        "escova de dentes",
        "carteira",
        "rinoceronte",
        "capacete",
        "baleia",
        "frasco de comprimidos",
        "anel de dedo do pé",
        "tampa de garrafa",
        "comida",
        "aliança de casamento",
        "avião de brinquedo",
        "giz",
        "monitor",
        "par de binóculos",
        "câmera",
        "garrafa de água",
        "teclado",
        "lista de compras",
        "tubo de protetor labial",
        "espelho",
        "tomate",
        "bloco de desenho",
        "espada",
        "loção",
        "porta-incenso",
        "fivela",
        "mármore",
        "frango",
        "pau de chenille",
        "assobiar",
        "frasco de esmalte",
        "ocarina",
        "luzes de rua",
        "assistir",
        "tornado",
        "nota adesiva",
        "chaveiro",
        "botão de camisa",
        "rolo de adesivos",
        "porta-retratos",
        "copo de vinho",
        "pacote de cartas",
        "bandana",
        "afiado",
        "carimbo de borracha",
        "soldado de brinquedo",
        "livro de adesivos",
        "cenouras",
        "bolsa",
        "corda",
        "banheiro",
        "lata de biscoitos",
        "livro infantil",
        "rolo de gaze",
        "iPod",
        "par de algemas",
        "caixa de giz de cera",
        "faca de bife",
        "panda",
        "polvo de pelúcia",
        "garrafa de mel",
        "caneta",
        "computador",
        "hamster",
        "CD do jogo",
        "carne bovina",
        "frigideira",
        "anzol de pesca",
        "saco de bolas de algodão",
        "copo de martíni",
        "busca de palavras",
        "pedaço de goma",
        "panela de barro",
        "jogos de vídeo",
        "história em quadrinhos",
        "revista",
        "geladeira",
        "chaveiro",
        "futebol",
        "travesseiro",
        "cafeteira",
        "aquecedores de pernas",
        "máquina de lavar",
        "livro de capítulo",
        "ursinhos",
        "livro de cheques",
        "cabo de extensão",
        "lixador de unhas",
        "quebra-cabeça",
        "barra de sabonete",
        "microfone",
        "rolo de papel higiênico",
        "pedra de cimento",
        "placa",
        "laço de cabelo",
        "pano",
        "cadarço de sapato",
        "pasta de dente",
        "poça",
        "garrafa de xarope",
        "saleiro",
        "lâmpada elétrica",
        "cesta de mão",
        "par de óculos",
        "parafuso",
        "concha de vieira",
        "pato de borracha",
        "bolsa",
        "sandália",
        "lupa",
        "urso de pelúcia",
        "cinto",
        "telefone celular",
        "espátula",
        "lata de pimenta",
        "bolsa/bolsa",
        "bule de chá",
        "pacote de comestíveis crocantes e crocantes",
        "folha de papel",
        "lata de ervilhas",
        "palito",
        "caixa de giz",
        "garrafa de tinta",
        "relógio",
        "temporizador de ovo",
        "cortiça",
        "rolo de fita adesiva",
        "garrafa de tinta",
        "pomba",
        "papel",
        "saco de lixo",
        "branco",
        "agulha",
        "coelho",
        "tigre",
        "furadeira",
        "pá de jardim",
        "concha de caracol",
        "pote de geléia",
        "palito de sorvete",
        "elástico",
        "roupas",
        "bastão de doces",
        "pacote de sementes",
        "boné de beisebol",
        "bastão luminoso",
        "modelo de carro",
        "par de agulhas de tricô",
        "prendedor de roupa",
        "esquilo",
        "tapete",
        "catálogo",
        "bloco de notas",
        "lenço",
        "rolo",
        "mata-moscas",
        "relógio de pulso",
        "óculos de sol",
        "tigela",
        "ovo",
        "balde",
        "cortador de unhas",
        "cartão",
        "novelo de lã",
        "colar de pérolas",
        "bolota",
        "álbum de fotos",
        "girafa",
        "meias",
        "coelho de pelúcia",
        "fúrcula",
        "tartaruga",
        "chapéu de cowboy",
        "espanador"
    ];

    return items[Math.floor(Math.random() * items.length)];
}