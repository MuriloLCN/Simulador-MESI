/*

*/

const tamanho_max_ram = 256;
const tamanho_max_cache = 16;
const tamanho_bloco_memoria = 16;

var log_trace = "";

// Cache:
//    Bloco | Offset | Estado | Valor
//    Bloco = 0 até (tamanho_max_ram / tamanho_bloco_memoria) - 1
//    Offset = Endereço - Bloco * tamanho_bloco_memoria
//    Estado = MESI
//    Valor = Dinheiro envolvido no lance
//    let obj = {bloco: int, offset: int, estado: str, valor: int}

// RAM:
//    Endereço | Valor | Nome
//    Endereço = 0 até tamanho_max_ram - 1
//    Valor = Dinheiro envolvido no lance
//    Nome = Nome aleatório gerado
//    let obj = {endereco: int, valor: int, nome: str};

var cache_nova_iorque = [];
var cache_berlim = [];
var cache_toquio = [];

var ram = [];

function buscar_na_cache(local, endereco)
{
    let cache_usada;
    if (local == 1)
    {
        cache_usada = cache_nova_iorque;
    }
    else if (local == 2)
    {
        cache_usada = cache_berlim;
    }
    else
    {
        cache_usada = cache_toquio;
    }

    for (let i = 0; i < cache_usada.length; i++)
    {
        if ((cache_usada[i].bloco * tamanho_bloco_memoria + cache_usada[i].offset) == endereco)
        {
            return {dados_linha: cache_usada[i], indice: i};
        }
    }

    return null;
}

function inserir_na_cache(local, endereco, valor_ins, estado_ins)
{
    let bloco_ins = Math.floor(endereco / tamanho_bloco_memoria);
    let offset_ins = endereco - bloco_ins * tamanho_bloco_memoria;

    
    // Se linha da cache já existir, sobreescreva
    let resultado_busca = buscar_na_cache(local, endereco);
    if (resultado_busca !== null)
    {
        if (local == 1)
        {
            cache_nova_iorque[resultado_busca.indice].valor = valor_ins;
            cache_nova_iorque[resultado_busca.indice].estado = estado_ins;
        }
        else if (local == 2)
        {
            cache_berlim[resultado_busca.indice].valor = valor_ins;
            cache_berlim[resultado_busca.indice].estado = estado_ins;
        }
        else
        {
            cache_toquio[resultado_busca.indice].valor = valor_ins;
            cache_toquio[resultado_busca.indice].estado = estado_ins;
        }
        return;
    }
                
    // Se não, crie uma nova
    let novo_obj = {bloco: bloco_ins, offset: offset_ins, estado: estado_ins, valor: valor_ins};

    // Se, após inserir, o tamanho extrapolar o limite, apague o primeiro valor (FIFO)

    if (local == 1)
    {
        // cache_usada = cache_nova_iorque
        cache_nova_iorque.push(novo_obj);
        if (cache_nova_iorque.length > tamanho_max_cache)
        {
            cache_nova_iorque = cache_nova_iorque.shift();
        }
    }
    else if (local == 2)
    {
        // cache_usada = cache_berlim
        cache_berlim.push(novo_obj);
        if (cache_berlim > tamanho_max_cache)
        {
            cache_berlim = cache_berlim.shift();
        }
    }
    else
    {
        // cache_usada = cache_toquio
        cache_toquio.push(novo_obj);
        if (cache_toquio.length > tamanho_max_cache)
        {
            cache_toquio = cache_toquio.shift();
        }
    }
}

function dar_lance(local, endereco, valor)
{
    inserir_na_cache(local, endereco, valor, "TESTE");
    // Se CACHE HIT
    
    // Ver estado da cópia local

    // Se MODIFICADO, apenas alterar o valor

    // Se EXCLUSIVO, alterar o valor e mudar o estado para MODIFIED

    // Se COMPARTILHADO:
    //    Mude o estado da linha nas outras caches para INVALIDO
    //    Atualize a linha local
    //    Mude o estado para MODIFICADO

    // Se CACHE MISS

    // Read with intention to modify

    // Alguma outra cache tem a cópia?
    // Se não, busque o valor da memória principal e coloque o estado MODIFICADO

    // Se sim:
    // Qual é o estado delas?

    // Se MODIFICADO:
    //    A cache que possui a cópia manda ela para a RAM e coloca ela como INVÁLIDA
    //    A cache local busca o valor da memória e coloca o estado como MODIFICADO

    // Se EXCLUSIVO ou COMPARTILHADO:
    //    Outros cores colocam estado como INVÁLIDO
    //    Core local busca valor da RAM e coloca como MODIFICADO
}

function buscar_preco(local, endereco)
{
    // Se CACHE HIT, apenas retornar o valor

    // Se CACHE MISS:

    // Verificar o número de cores com a cópia

    // Se nenhum tem cópia:
    //    Pegar dado da memória
    //    Guardar na cache adequada (do local) com o estado EXCLUSIVO

    // Se 1 cache tem a cópia:
    //    Se a cópia está no estado EXCLUSIVO
    //       Copie o valor para a cache local com o estado SHARED
    //       Troque o estado da cache de origem para SHARED
    //    Se a cópia está no estado MODIFICADO
    //       Coloque o valor da cópia na RAM
    //       Copie o valor para a cache local com o estado SHARED
    //       Altere o estado da cache de origem para SHARED

    // Se mais de um tem a cópia:
    //    Recebe o valor de qualquer cache
    //    Altere o estado da cache local para SHARED
}

function entrada_mesi(operacao, valor, endereco, local)
{
    // Se endereço deu OVERFLOW, calcular rotação
    if (endereco > tamanho_max_ram)
    {
        endereco = endereco % tamanho_max_ram;
    }

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

        texto += "<td>"+ cache_usada[i].bloco +"</td>";  // aqui vem o Bloco
        texto += "<td>"+ cache_usada[i].offset +"</td>";  // aqui vem o Offset
        texto += "<td>"+ cache_usada[i].estado +"</td>";  // aqui vem o Estado
        texto += "<td>"+ cache_usada[i].valor +"</td>";  // aqui vem o valor
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