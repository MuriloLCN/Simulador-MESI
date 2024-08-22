/*
    Trabalho Prático 1 – Simulador Protocolo MESI em uma aplicação
    Disciplina: Arquitetura e Organização de Computadores II Código: 6895
    Curso: Ciência da Computação Turma: 01
    Professora: Sandra Cossul
    Semestre: 2024/1

    Alunos:
        Murilo Luis Calvo Neves | RA 129037
        Leandro Silva Novakosky | RA 129849
*/

const tamanho_max_ram = 256;
const tamanho_max_cache = 16;
const tamanho_bloco_memoria = 16;

var log_trace = "";

// Detalhes de estruturação

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

function buscar_na_ram(endereco)
{
    /*
        Busca um valor armazenado em um endereço na RAM
    */
    return ram[endereco].valor;
}

function inserir_na_ram(endereco, valor)
{
    /*
        Insere/Altera um endereço da RAM para ter um novo valor
    */
    ram[endereco].valor = valor;
}

function buscar_na_cache(local, endereco, aceita_invalida)
{
    /*
        Busca uma linha de cache em um determinado local
        Entradas:
            local: Qual cache utilizar (0: NY, 1: Berlim, 2: Tóquio)
            endereço: O endereço de memória a ser procurado
            aceita_invalida: Booleano que indica se a função deve retornar a linha mesmo caso ela seja inválida
        Retorna um objeto da forma:
            {
                dados_linha: Objeto de linha de cache
                indice: Indice do vetor que ela está armazenada (uso interno)
            }
    */
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
            if (cache_usada[i].estado !== "INVALIDO" || aceita_invalida == true)
            {
                return {dados_linha: cache_usada[i], indice: i};
            }
        }
    }

    return null;
}

function inserir_na_cache(local, endereco, valor_ins, estado_ins)
{
    /*
        Insere dados em uma cache. Se já existe essa linha, ela é sobreescrita
        Entradas:
            local: Qual cache utilizar (0: NY, 1: Berlim, 2: Tóquio)
            endereco: O endereço a qual o valor pertence
            valor_ins: O valor a ser armazenado
            estado_ins: O estado da linha a ser armazenada
    */
    let bloco_ins = Math.floor(endereco / tamanho_bloco_memoria);
    let offset_ins = endereco - bloco_ins * tamanho_bloco_memoria;

    
    // Se linha da cache já existir, sobreescreva
    let resultado_busca = buscar_na_cache(local, endereco, true);
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

    // Se, após inserir, o tamanho extrapolar o limite, apague o primeiro valor (FIFO) e jogue-o para a RAM (write-back)

    if (local == 1)
    {
        // cache_usada = cache_nova_iorque
        cache_nova_iorque.push(novo_obj);
        if (cache_nova_iorque.length > tamanho_max_cache)
        {
            if (cache_nova_iorque[0].estado !== "INVALIDO")
            {
                inserir_na_ram(cache_nova_iorque[0].bloco * tamanho_bloco_memoria + cache_nova_iorque[0].offset, cache_nova_iorque[0].valor);
            }
            cache_nova_iorque.shift();
        }
    }
    else if (local == 2)
    {
        // cache_usada = cache_berlim
        cache_berlim.push(novo_obj);
        if (cache_berlim.length > tamanho_max_cache)
        {
            if (cache_berlim[0].estado !== "INVALIDO")
            {
                inserir_na_ram(cache_berlim[0].bloco * tamanho_bloco_memoria + cache_berlim[0].offset, cache_berlim[0].valor);
            }
            cache_berlim.shift();
        }
    }
    else
    {
        // cache_usada = cache_toquio
        cache_toquio.push(novo_obj);
        if (cache_toquio.length > tamanho_max_cache)
        {
            if (cache_toquio[0].estado !== "INVALIDO")
            {
                inserir_na_ram(cache_toquio[0].bloco * tamanho_bloco_memoria + cache_toquio[0].offset, cache_toquio[0].valor);
            }
            cache_toquio.shift();
        }
    }
}

function broadcast_invalidar(endereco)
{
    /*
        Invalida todas as linhas de todas as caches que possuem um determinado endereço
    */
    for (let i = 0; i < cache_nova_iorque.length; i++)
    {
        if ((cache_nova_iorque[i].bloco * tamanho_bloco_memoria + cache_nova_iorque[i].offset) == endereco)
        {
            cache_nova_iorque[i].estado = "INVALIDO";
        }
    }
    for (let i = 0; i < cache_berlim.length; i++)
    {
        if ((cache_berlim[i].bloco * tamanho_bloco_memoria + cache_berlim[i].offset) == endereco)
        {
            cache_berlim[i].estado = "INVALIDO";
        }
    }
    for (let i = 0; i < cache_toquio.length; i++)
    {
        if ((cache_toquio[i].bloco * tamanho_bloco_memoria + cache_toquio[i].offset) == endereco)
        {
            cache_toquio[i].estado = "INVALIDO";
        }
    }
}

function dar_lance(local, endereco, valor)
{
    /*
        Parte de escrita do protocolo MESI
        OBS: Um lance só pode ser dado caso ele tenha valor maior que os demais lances existentes e/ou o valor atual do item
    */

    let resultado_busca = buscar_na_cache(local, endereco, false);

    // Se CACHE MISS
    if (resultado_busca == null)
    {
        log_trace += "<br>&#x2022; Cache Miss: Emitindo Read With Intention to Modify";
        // Read with intention to modify

        // Alguma outra cache tem a cópia?
        let outra_1, outra_2;

        if (local == 1)
        {
            outra_1 = buscar_na_cache(2, endereco, false);
            outra_2 = buscar_na_cache(3, endereco, false);
        }
        else if (local == 2)
        {
            outra_1 = buscar_na_cache(1, endereco, false);
            outra_2 = buscar_na_cache(3, endereco, false);   
        }
        else 
        {
            outra_1 = buscar_na_cache(1, endereco, false);
            outra_2 = buscar_na_cache(2, endereco, false);
        }

        // Se não, busque o valor da memória principal (regra de negócio), armazene caso necessário e coloque o estado MODIFICADO
        if (outra_1 == null && outra_2 == null)
        {
            log_trace += "<br>&#x2022; Nenhuma outra cache tem a cópia dos dados, buscando na memória";
            let mem = buscar_na_ram(endereco);
            if (mem >= valor)
            {
                log_trace += "<br>&#x2022; <span style=\"color: red\">Erro: Valor do lance é menor ou igual o valor atual do item, aumente o lance e tente novamente</span>";
                return;
            }
            log_trace += "<br>&#x2022; Inserindo o valor na cache atual com o estado Modificado";
            inserir_na_cache(local, endereco, valor, "MODIFICADO");
        }
        else
        {
            log_trace += "<br>&#x2022; Outra(s) cache(s) tem a cópia do item, analisando o estado";
            // Se sim:
            // Qual é o estado delas?
            let estado_delas;

            // Se MODIFICADO:
            //    A cache que possui a cópia manda ela para a RAM e coloca ela como INVÁLIDA
            //    A cache local busca o valor da memória e coloca o estado como MODIFICADO

            // Se EXCLUSIVO ou COMPARTILHADO:
            //    Outros cores colocam estado como INVÁLIDO
            //    Core local busca valor da RAM e coloca como MODIFICADO
            
            // null, normal
            if (outra_1 == null)
            {
                estado_delas = outra_2.dados_linha.estado;

                if (estado_delas === "MODIFICADO")
                {
                    if (outra_2.dados_linha.valor >= valor)
                    {
                        log_trace += "<br>&#x2022; <span style=\"color: red\"> Erro: Valor do lance é menor ou igual o valor atual do item em outra cache, aumente o lance e tente novamente</span>";
                        return;
                    }

                    inserir_na_ram(outra_2.dados_linha.bloco * tamanho_bloco_memoria + outra_2.dados_linha.offset, outra_2.dados_linha.valor);
                    broadcast_invalidar(endereco);

                    let mem = buscar_na_ram(endereco);
                    if (mem >= valor)
                    {
                        log_trace += "<br>&#x2022; <span style=\"color: red\"> Erro: Valor do lance é menor ou igual o valor atual do item, aumente o lance e tente novamente</span>";
                        return;
                    }
                    inserir_na_cache(local, endereco, valor, "MODIFICADO");
                }
                else if (estado_delas === "EXCLUSIVO" || estado_delas === "COMPARTILHADO")
                {
                    if (outra_2.dados_linha.valor >= valor)
                    {
                        log_trace += "<br>&#x2022; <span style=\"color: red\"> Erro: Valor do lance é menor ou igual o valor atual do item em outra cache, aumente o lance e tente novamente </span>";
                        return;
                    }
                    broadcast_invalidar(endereco);

                    let mem = buscar_na_ram(endereco);
                    if (mem >= valor)
                    {
                        log_trace += "<br>&#x2022; <span style=\"color: red\"> Erro: Valor do lance é menor ou igual o valor atual do item, aumente o lance e tente novamente</span>";
                        return;
                    }
                    inserir_na_cache(local, endereco, valor, "MODIFICADO");
                }
            }
            // normal, null
            else if (outra_2 == null)
            {
                estado_delas = outra_1.dados_linha.estado;

                if (estado_delas === "MODIFICADO")
                {
                    if (outra_1.dados_linha.valor >= valor)
                    {
                        log_trace += "<br> <span style=\"color: red\"> Erro: Valor do lance é menor ou igual o valor atual do item em outra cache, aumente o lance e tente novamente</span>";
                        return;
                    }

                    inserir_na_ram(outra_1.dados_linha.bloco * tamanho_bloco_memoria + outra_1.dados_linha.offset, outra_1.dados_linha.valor);
                    broadcast_invalidar(endereco);

                    let mem = buscar_na_ram(endereco);
                    if (mem >= valor)
                    {
                        log_trace += "<br> <span style=\"color: red\"> Erro: Valor do lance é menor ou igual o valor atual do item, aumente o lance e tente novamente</span>";
                        return;
                    }
                    inserir_na_cache(local, endereco, valor, "MODIFICADO");
                }
                else if (estado_delas === "EXCLUSIVO" || estado_delas === "COMPARTILHADO")
                {
                    if (outra_1.dados_linha.valor >= valor)
                    {
                        log_trace += "<br> <span style=\"color: red\"> Erro: Valor do lance é menor ou igual o valor atual do item em outra cache, aumente o lance e tente novamente</span>";
                        return;
                    }
                    broadcast_invalidar(endereco);

                    let mem = buscar_na_ram(endereco);
                    if (mem >= valor)
                    {
                        log_trace += "<br> <span style=\"color: red\"> Erro: Valor do lance é menor ou igual o valor atual do item, aumente o lance e tente novamente</span>";
                        return;
                    }
                    inserir_na_cache(local, endereco, valor, "MODIFICADO");
                }
            }
            // normal, normal - se duas tem cópias, deve ser shared
            else
            {
                if (outra_1.dados_linha.valor >= valor)
                {
                    log_trace += "<br>&#x2022; <span style=\"color: red\"> Erro: Valor do lance é menor ou igual o valor atual do item em outra cache, aumente o lance e tente novamente</span>";
                    return;
                }
                log_trace += "<br>&#x2022; Invalidando endereço nas outras caches";
                broadcast_invalidar(endereco);

                let mem = buscar_na_ram(endereco);
                if (mem >= valor)
                {
                    log_trace += "<br>&#x2022; <span style=\"color: red\"> Erro: Valor do lance é menor ou igual o valor atual do item, aumente o lance e tente novamente</span>";
                    return;
                }

                log_trace += "<br>&#x2022; Inserindo o valor na cache atual com o estado Modificado";
                inserir_na_cache(local, endereco, valor, "MODIFICADO")
            }

        }
    }
    // Se CACHE HIT
    else 
    {
        // Ver estado da cópia local
        let estado_local = resultado_busca.dados_linha.estado;
        log_trace += "<br>&#x2022; Cache Hit: Analisando estado atual da linha na cache local";
        // Se MODIFICADO, apenas alterar o valor
        // Se EXCLUSIVO, alterar o valor e mudar o estado para MODIFIED
        if (estado_local === "MODIFICADO" || estado_local === "EXCLUSIVO")
        {
            if (valor <= resultado_busca.dados_linha.valor)
            {
                log_trace += "<br>&#x2022; <span style=\"color: red\"> Erro: Valor do lance é menor ou igual o valor de um lance existente, aumente o lance e tente novamente</span>";
                return;
            }
            log_trace += "<br>&#x2022; Estado era ou exclusivo, alterou-se o valor e o estado foi para Modificado";
            inserir_na_cache(local, endereco, valor, "MODIFICADO");
        }

        // Se COMPARTILHADO:
        //    Mude o estado da linha nas outras caches para INVALIDO
        //    Atualize a linha local
        //    Mude o estado para MODIFICADO
        if (estado_local === "COMPARTILHADO")
        {
            if (valor <= resultado_busca.dados_linha.valor)
            {
                log_trace += "<br>&#x2022; <span style=\"color: red\"> Erro: Valor do lance é menor ou igual o valor de um lance existente, aumente o lance e tente novamente </span>";
                return;
            }
            log_trace += "<br>&#x2022; Estado era compartilhado, alterou-se o valor, invalidou-se as cópias dos outros locais e mudou-se o estado para Modificado";
            broadcast_invalidar(endereco);
            inserir_na_cache(local, endereco, valor, "MODIFICADO");
        }
    }
}

function buscar_preco(local, endereco)
{
    log_trace += "<br> " + buscar_na_cache(local, endereco).dados_linha.valor;
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
    /*
        Ponto de entrada do protocolo MESI
    */

    // Se endereço deu OVERFLOW, calcular rotação
    if (endereco > tamanho_max_ram)
    {
        endereco = endereco % tamanho_max_ram;
    }

    if (operacao == 1)
    {
        log_trace += "<br>&#x2022; Iniciando operação: Dar lance (escrita) no item de endereço " + endereco + " com o valor de " + valor + " reais por meio do local " + local;
        dar_lance(local, endereco, valor);
    }
    else if (operacao == 2)
    {
        log_trace += "<br>&#x2022; Iniciando operação: Buscar preço (leitura) no item de endereço " + endereco + " por meio do local " + local;
        buscar_preco(local, endereco);
    }
}

function realizar_operacao()
{
    /*
        Ponto de entrada e de parse dos dados de input

        Realiza as operações e escreve os resultados nos elementos gráficos
    */
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
    id = parseInt(id);

    if (Number.isNaN(id))
    {
        alert("Id deve ser um número");
        return;
    }

    // Verificar se o valor é um número válido
    if (operacao == 1)
    {
        valor = parseInt(valor);

        if (Number.isNaN(valor))
        {
            alert("Valor deve ser um número");
            return;
        }
    }

    // Realizar MESI
    entrada_mesi(operacao, valor, id, local);
    
    log_trace += "<br>&#x2022; Nº linhas ocupadas das caches: " + cache_nova_iorque.length + " | " + cache_berlim.length + " | " + cache_toquio.length;
    
    gui_atualizar_cache(1);
    gui_atualizar_cache(2);
    gui_atualizar_cache(3);
    gui_atualizar_ram();

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
    /*
        Preenche a RAM com valores aleatórios. Todos os itens começam com o preço de R$1,00. Os nomes são aleatórios.
    */
    for (let i = 0; i < tamanho_max_ram; i++)
    {
        let obj = {endereco: i, valor: 1, nome: geradorItemAleatorio()};
        ram.push(obj);
    }
}

function inicializar_pagina()
{
    /*
        Função chamada ao se abrir a página para se carregar os elementos da RAM
    */
    preencher_ram();
    gui_atualizar_ram();
}

function geradorItemAleatorio()
{
    /*
        Gera itens aleatórios
    */
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