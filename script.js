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
const tamanho_max_cache = 8;
const tamanho_bloco_memoria = 4;

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

var linhas_1 = [];
var linhas_2 = [];
var linhas_3 = [];

function item_aleatorio(arr)
{
    /*
        Remove um item aleatório de um vetor e remove-o dele
    */
    let idx = Math.ceil(Math.random() * arr.length - 1);

    let element = arr[idx];
    arr.splice(idx, 1);
    return element;
}

function calcula_inicio_bloco(endereco)
{
    /*
        Calcula o endereço onde um bloco começa
    */
    return Math.floor(endereco / tamanho_bloco_memoria);
}

function buscar_bloco_na_ram(bloco)
{
    /*
        Busca um bloco de dados da RAM com base em um endereço
    */
    let resultado = [];

    for (let n = 0; n < tamanho_bloco_memoria; n++)
    {
        resultado.push(ram[bloco * tamanho_bloco_memoria + n].valor);
    }

    return resultado;
}

function inserir_na_ram(endereco, valor)
{
    /*
        Insere/Altera um endereço da RAM para ter um novo valor
    */
    ram[endereco].valor = valor;
}

function inserir_bloco_na_ram(bloco, lista_valores)
{
    /*
        Insere um bloco de valores na RAM
    */
    for (let n = 0; n < tamanho_bloco_memoria; n++)
    {
        inserir_na_ram(bloco * tamanho_bloco_memoria + n, lista_valores[n]);
    }
}

function buscar_bloco_na_cache(local, bloco, aceita_invalida)
{
    /*
        Busca um bloco da uma cache
        Entradas:
            local: Qual cache utilizar (0: NY, 1: Berlim, 2: Tóquio)
            bloco: Qual bloco a ser procurado
            aceita_invalida: Booleano que indica se a função deve retornar a linha mesmo caso ela seja inválida
        Retorna um vetor de objetos da forma:
        {
            [
                dados_linha: Objeto com um vetor contendo os dados da linha
                indice: Indice inicial do vetor que ela está armazenada (uso interno)
            ]
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

    let resultado = [];

    for (let i = 0; i < cache_usada.length; i++)
    {
        if ((cache_usada[i].bloco) == bloco)
        {
            if (cache_usada[i].estado !== "INVALIDO" || aceita_invalida == true)
            {
                resultado.push({dados_linha: cache_usada[i], indice: i})
            }
        }
    }

    if (resultado.length == 0)
    {
        return null;
    }

    return resultado;
}

function inserir_bloco_na_cache(local, bloco_ins, estado_ins, valores)
{
    /*
        Insere dados em uma cache. Se a linha já existe, ela é sobreescrita
        Entradas:
            local: Qual cache utilizar (0: NY, 1: Berlim, 2: Tóquio)
            bloco: O bloco a ser inserido/modificado
            estado: O estado da linha a ser armazenada
            valores: Um vetor contendo os valores a serem armazenados
    */
    let resultado_busca = buscar_bloco_na_cache(local, bloco_ins, true);
    // Se a linha já existe, apenas altere ela
    if (resultado_busca !== null)
    {
        if (local == 1)
        {
            for (let n = 0; n < tamanho_bloco_memoria; n++)
            {
                cache_nova_iorque[resultado_busca[n].indice].valor = valores[n];
                cache_nova_iorque[resultado_busca[n].indice].estado = estado_ins;
            }
        }
        else if (local == 2)
        {
            for (let n = 0; n < tamanho_bloco_memoria; n++)
            {
                cache_berlim[resultado_busca[n].indice].valor = valores[n];
                cache_berlim[resultado_busca[n].indice].estado = estado_ins;
            }
        }
        else
        {
            for (let n = 0; n < tamanho_bloco_memoria; n++)
            {
                cache_toquio[resultado_busca[n].indice].valor = valores[n];
                cache_toquio[resultado_busca[n].indice].estado = estado_ins;
            }
        }
        return;
    }
                
    // Se não, insira a linha nova
    // Se o tamanho extrapolar o limite, apague o primeiro valor (FIFO) e jogue-o para a RAM (write-back)

    if (local == 1)
    {
        if ((cache_nova_iorque.length + 1) / tamanho_bloco_memoria > tamanho_max_cache)
        {
            linhas_1.push(cache_nova_iorque[0].linha);
            for (let n = 0; n < tamanho_bloco_memoria; n++)
            {
                if (cache_nova_iorque[0].estado !== "INVALIDO")
                {
                    inserir_na_ram(cache_nova_iorque[0].bloco * tamanho_bloco_memoria + cache_nova_iorque[0].offset, cache_nova_iorque[0].valor);
                }
                cache_nova_iorque.shift();
            }
        }
        let linha_aleatoria = item_aleatorio(linhas_1);
        for (let n = 0; n < tamanho_bloco_memoria; n++)
        {
            cache_nova_iorque.push({bloco: bloco_ins, offset: n, estado: estado_ins, valor: valores[n], linha: linha_aleatoria});
        }
    }
    else if (local == 2)
    {
        if ((cache_berlim.length + 1) / tamanho_bloco_memoria > tamanho_max_cache)
        {
            linhas_2.push(cache_berlim[0].linha);
            for (let n = 0; n < tamanho_bloco_memoria; n++)
            {
                if (cache_berlim[0].estado !== "INVALIDO")
                {
                    inserir_na_ram(cache_berlim[0].bloco * tamanho_bloco_memoria + cache_berlim[0].offset, cache_berlim[0].valor);
                }
                cache_berlim.shift();
            }
        }
        let linha_aleatoria = item_aleatorio(linhas_2);
        for (let n = 0; n < tamanho_bloco_memoria; n++)
        {
            cache_berlim.push({bloco: bloco_ins, offset: n, estado: estado_ins, valor: valores[n], linha: linha_aleatoria});
        }
    }
    else
    {
        if ((cache_toquio.length + 1) / tamanho_bloco_memoria > tamanho_max_cache)
        {
            linhas_3.push(cache_toquio[0].linha);
            for (let n = 0; n < tamanho_bloco_memoria; n++)
            {
                if (cache_toquio[0].estado !== "INVALIDO")
                {
                    inserir_na_ram(cache_toquio[0].bloco * tamanho_bloco_memoria + cache_toquio[0].offset, cache_toquio[0].valor);
                }
                cache_toquio.shift();
            }
        }
        let linha_aleatoria = item_aleatorio(linhas_3);
        for (let n = 0; n < tamanho_bloco_memoria; n++)
        {
            cache_toquio.push({bloco: bloco_ins, offset: n, estado: estado_ins, valor: valores[n], linha: linha_aleatoria});
        }
    }
}

function broadcast_invalidar(bloco)
{
    /*
        Invalida todas as linhas cache que possuem um determinado bloco
    */
    for (let i = 0; i < cache_nova_iorque.length; i++)
    {
        if ((cache_nova_iorque[i].bloco) == bloco)
        {
            cache_nova_iorque[i].estado = "INVALIDO";
        }
    }
    for (let i = 0; i < cache_berlim.length; i++)
    {
        if ((cache_berlim[i].bloco) == bloco)
        {
            cache_berlim[i].estado = "INVALIDO";
        }
    }
    for (let i = 0; i < cache_toquio.length; i++)
    {
        if ((cache_toquio[i].bloco) == bloco)
        {
            cache_toquio[i].estado = "INVALIDO";
        }
    }
}

function dar_lance(local, endereco, valor_ins)
{
    /*
        Parte de escrita do protocolo MESI
        OBS: Um lance só pode ser dado caso ele tenha valor maior que os demais lances existentes e/ou o valor atual do item
    */
    let bloco = calcula_inicio_bloco(endereco);
    let offset = endereco % tamanho_bloco_memoria;

    let resultado_busca = buscar_bloco_na_cache(local, bloco, false);

    // Se CACHE MISS
    if (resultado_busca == null)
    {
        log_trace += "<hr>&#x2022; Cache Miss: Emitindo Read With Intention to Modify (RWITM)";
        // Read with intention to modify

        // Alguma outra cache tem a cópia?
        let c_1, c_2;
        let outra_1, outra_2;

        if (local == 1)
        {
            c_1 = 2;
            c_2 = 3;
        }
        else if (local == 2)
        {
            c_1 = 1;
            c_2 = 3;
        }
        else 
        {
            c_1 = 1;
            c_2 = 2;
        }
        outra_1 = buscar_bloco_na_cache(c_1, bloco, false);
        outra_2 = buscar_bloco_na_cache(c_2, bloco, false);
        
        // Se não, busque o valor da memória principal (regra de negócio), armazene caso necessário e coloque o estado MODIFICADO
        if (outra_1 === null && outra_2 === null)
        {
            log_trace += "<hr>&#x2022; Nenhuma outra cache tem a cópia dos dados, buscando na memória";
            let valores_ram = buscar_bloco_na_ram(bloco);
            if (valores_ram[offset] >= valor_ins)
            {
                log_trace += "<hr>&#x2022; <span style=\"color: red\">Erro: Valor do lance é menor ou igual o valor atual do item, aumente o lance e tente novamente</span>";
                return;
            }
            log_trace += "<hr>&#x2022; Inserindo o valor na cache atual com o estado Modificado";
            valores_ram[offset] = valor_ins;
            inserir_bloco_na_cache(local, bloco, "MODIFICADO", valores_ram);
        }
        // Se sim:
        // Qual é o estado delas?

        // Se MODIFICADO:
        //    A cache que possui a cópia manda ela para a RAM e coloca ela como INVÁLIDA
        //    A cache local busca o valor da memória e coloca o estado como MODIFICADO

        // Se EXCLUSIVO ou COMPARTILHADO:
        //    Outros cores colocam estado como INVÁLIDO
        //    Core local busca valor da RAM e coloca como MODIFICADO
        if (outra_1 !== null && outra_2 === null)
        {
            log_trace += "<hr>&#x2022; Outra cache tem a cópia do item, analisando o estado...";
            
            if (outra_1[offset].dados_linha.valor >= valor_ins)
            {
                log_trace += "<hr>&#x2022; <span style=\"color: red\"> Erro: Valor do lance é menor ou igual o valor atual do item em outra cache, aumente o lance e tente novamente</span>";
                return;
            }

            if (outra_1[offset].dados_linha.estado === "MODIFICADO")
            {
                let temp = [];

                for (let p = 0; p < tamanho_bloco_memoria; p++)
                {
                    temp.push(outra_1[p].dados_linha.valor);
                }
                inserir_bloco_na_ram(bloco, temp);
            }

            broadcast_invalidar(bloco);

            let bloco_memoria = buscar_bloco_na_ram(bloco);
            bloco_memoria[offset] = valor_ins;
            inserir_bloco_na_cache(local, bloco, "MODIFICADO", bloco_memoria);
        }
        if (outra_1 === null && outra_2 !== null)
        {
            log_trace += "<hr>&#x2022; Outra cache tem a cópia do item, analisando o estado...";
            
            if (outra_2[offset].dados_linha.valor >= valor_ins)
            {
                log_trace += "<hr>&#x2022; <span style=\"color: red\"> Erro: Valor do lance é menor ou igual o valor atual do item em outra cache, aumente o lance e tente novamente</span>";
                return;
            }

            if (outra_2[offset].dados_linha.estado === "MODIFICADO")
            {
                let temp = [];

                for (let p = 0; p < tamanho_bloco_memoria; p++)
                {
                    temp.push(outra_2[p].dados_linha.valor);
                }
                inserir_bloco_na_ram(bloco, temp);
            }

            broadcast_invalidar(bloco);

            let bloco_memoria = buscar_bloco_na_ram(bloco);
            bloco_memoria[offset] = valor_ins;
            inserir_bloco_na_cache(local, bloco, "MODIFICADO", bloco_memoria);
        } 
        if (outra_1 !== null && outra_2 !== null)
        {
            // Para chegar aqui, o dado deve estar compartilhado
            log_trace += "<hr>&#x2022; As outras duas caches têm cópias do dado, analisando...";

            if (outra_1[offset].dados_linha.valor >= valor_ins || outra_2[offset].dados_linha.valor >= valor_ins)
            {
                log_trace += "<hr>&#x2022; <span style=\"color: red\"> Erro: Valor do lance é menor ou igual o valor atual do item em outra cache, aumente o lance e tente novamente</span>";
                return;
            }

            broadcast_invalidar(bloco);

            let bloco_memoria = buscar_bloco_na_ram(bloco);
            bloco_memoria[offset] = valor_ins;
            inserir_bloco_na_cache(local, bloco, "MODIFICADO", bloco_memoria);
        }
    }
    // Se CACHE HIT
    else 
    {
        // Ver estado da cópia local
        let estado_local = resultado_busca[offset].dados_linha.estado;
        log_trace += "<hr>&#x2022; Cache Hit: Analisando estado atual da linha na cache local";
        // Se MODIFICADO, apenas alterar o valor
        // Se EXCLUSIVO, alterar o valor e mudar o estado para MODIFIED
        if (estado_local === "MODIFICADO" || estado_local === "EXCLUSIVO")
        {
            if (valor_ins <= resultado_busca[offset].dados_linha.valor)
            {
                log_trace += "<hr>&#x2022; <span style=\"color: red\"> Erro: Valor do lance é menor ou igual o valor de um lance existente, aumente o lance e tente novamente</span>";
                return;
            }
            log_trace += "<hr>&#x2022; Estado era modificado ou exclusivo, alterou-se o valor e o estado foi para Modificado";
            resultado_busca[offset].dados_linha.valor = valor_ins;
            let temp = [];
            for (let p = 0; p < tamanho_bloco_memoria; p++)
            {
                temp.push(resultado_busca[p].dados_linha.valor);
            }
            inserir_bloco_na_cache(local, bloco, "MODIFICADO", temp);
        }

        // Se COMPARTILHADO:
        //    Mude o estado da linha nas outras caches para INVALIDO
        //    Atualize a linha local
        //    Mude o estado para MODIFICADO
        if (estado_local === "COMPARTILHADO")
        {
            if (valor_ins <= resultado_busca[offset].dados_linha.valor)
            {
                log_trace += "<hr>&#x2022; <span style=\"color: red\"> Erro: Valor do lance é menor ou igual o valor de um lance existente, aumente o lance e tente novamente </span>";
                return;
            }
            log_trace += "<hr>&#x2022; Estado era compartilhado, alterou-se o valor, invalidou-se as cópias dos outros locais e mudou-se o estado para Modificado";
            broadcast_invalidar(bloco);
            resultado_busca[offset].dados_linha.valor = valor_ins;
            let temp = [];
            for (let p = 0; p < tamanho_bloco_memoria; p++)
            {
                temp.push(resultado_busca[p].dados_linha.valor);
            }
            inserir_bloco_na_cache(local, bloco, "MODIFICADO", temp);
        }
    }
}

function buscar_preco(local, endereco)
{
    let bloco = calcula_inicio_bloco(endereco);
    let offset = endereco % tamanho_bloco_memoria;
    let resultado_busca = buscar_bloco_na_cache(local, bloco, false);
    
    // Se CACHE HIT, apenas retornar o valor
    if (resultado_busca !== null)
    {
        log_trace += "<hr>&#x2022; Cache hit! Retornando o valor";
        log_trace += "<hr>Valor encontrado: R$" + resultado_busca[offset].dados_linha.valor;
        // return resultado_busca.dados_linha.valor;
    }
    else
    {
        // Se CACHE MISS:
        log_trace += "<hr>&#x2022; Cache miss, verificando se outras caches tem uma cópia...";
        // Alguma outra cache tem a cópia?
        let c_1, c_2;
        let outra_1, outra_2;

        if (local == 1)
        {
            c_1 = 2;
            c_2 = 3;
        }
        else if (local == 2)
        {
            c_1 = 1;
            c_2 = 3;
        }
        else 
        {
            c_1 = 1;
            c_2 = 2;
        }
        outra_1 = buscar_bloco_na_cache(c_1, bloco, false);
        outra_2 = buscar_bloco_na_cache(c_2, bloco, false);
        
        if (outra_1 === null && outra_2 === null)
        {
            log_trace += "<hr>&#x2022; Nenhuma cache tem a cópia, buscando na memória";
            // Se nenhum tem cópia:
            //    Pegar dado da memória
            //    Guardar na cache adequada (do local) com o estado EXCLUSIVO
            let dados_bloco = buscar_bloco_na_ram(bloco);
            inserir_bloco_na_cache(local, bloco, "EXCLUSIVO", dados_bloco);
            log_trace += "<hr>Valor encontrado: R$" + dados_bloco[offset];
        }
        else
        {
            // Se 1 cache tem a cópia:
            //    Se a cópia está no estado EXCLUSIVO
            //       Copie o valor para a cache local com o estado SHARED
            //       Troque o estado da cache de origem para SHARED
            //    Se a cópia está no estado MODIFICADO
            //       Coloque o valor da cópia na RAM
            //       Copie o valor para a cache local com o estado SHARED
            //       Altere o estado da cache de origem para SHARED
            if (outra_1 !== null && outra_2 === null)
            {
                log_trace += "<hr>&#x2022; Uma cache tem o valor, compartilhando...";

                let temp = [];
                for (let p = 0; p < tamanho_bloco_memoria; p++)
                {
                    temp.push(outra_1[p].dados_linha.valor);
                }

                if (outra_1[offset].dados_linha.estado === "MODIFICADO")
                {
                    log_trace += "<hr>&#x2022; Dado estava modificado, armazenando ele...";
                    
                    inserir_bloco_na_ram(bloco, temp);
                }
                inserir_bloco_na_cache(c_1, bloco, "COMPARTILHADO", temp);
                inserir_bloco_na_cache(local, bloco, "COMPARTILHADO", temp);
                log_trace += "<hr>Valor encontrado: R$" + outra_1[offset].dados_linha.valor;
            }
            if (outra_1 === null && outra_2 !== null)
            {
                log_trace += "<hr>&#x2022; Uma cache tem o valor, compartilhando...";

                let temp = [];
                for (let p = 0; p < tamanho_bloco_memoria; p++)
                {
                    temp.push(outra_2[p].dados_linha.valor);
                }

                if (outra_2[offset].dados_linha.estado === "MODIFICADO")
                {
                    log_trace += "<hr>&#x2022; Dado estava modificado, armazenando ele...";
                    
                    inserir_bloco_na_ram(bloco, temp);
                }
                inserir_bloco_na_cache(c_2, bloco, "COMPARTILHADO", temp);
                inserir_bloco_na_cache(local, bloco, "COMPARTILHADO", temp);
                log_trace += "<hr>Valor encontrado: R$" + outra_2[offset].dados_linha.valor;
            }
            if (outra_1 !== null && outra_2 !== null)
            {
                log_trace += "<hr>&#x2022; As duas caches têm cópias, compartilhando...";
                // Mais de uma tem a cópia - está em estado shared
                // Se mais de um tem a cópia:   
                //    Recebe o valor de qualquer cache
                //    Altere o estado da cache local para SHARED
                let temp = [];
                for (let p = 0; p < tamanho_bloco_memoria; p++)
                {
                    temp.push(outra_2[p].dados_linha.valor);
                }

                inserir_bloco_na_cache(local, bloco, "COMPARTILHADO", temp);
                log_trace += "<hr>Valor encontrado: R$" + outra_2[offset].dados_linha.valor;
            }
        }
    }
}

function entrada_mesi(operacao, valor, endereco, local)
{
    /*
        Ponto de entrada do protocolo MESI
    */

    // Se endereço deu OVERFLOW, calcular rotação
    endereco = endereco % tamanho_max_ram;
    
    if (operacao == 1)
    {
        log_trace += "<hr>&#x2022; Iniciando operação: Dar lance (escrita) no item de endereço " + endereco + " com o valor de " + valor + " reais por meio do local " + local;
        dar_lance(local, endereco, valor);
    }
    else if (operacao == 2)
    {
        log_trace += "<hr>&#x2022; Iniciando operação: Buscar preço (leitura) no item de endereço " + endereco + " por meio do local " + local;
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
    log_trace = "Log";

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

    if (id < 0)
    {
        alert("Id deve ser positivo");
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

        if (valor < 0)
        {
            alert("Valor deve ser positivo");
            return;
        }
    }

    // Realizar MESI
    entrada_mesi(operacao, valor, id, local);
    
    log_trace += "<hr><br>&#x2022; Nº linhas ocupadas das caches: " + cache_nova_iorque.length / tamanho_bloco_memoria + " | " + cache_berlim.length / tamanho_bloco_memoria + " | " + cache_toquio.length / tamanho_bloco_memoria;
    
    gui_atualizar_cache(1);
    gui_atualizar_cache(2);
    gui_atualizar_cache(3);
    gui_atualizar_ram();

    // Ir realizando as operações com base nos parâmetros...
    // Cada operação vai dando append ao log_trace com as decisões que foram tomadas e por quais motivos
    // No final, esse log_trace vai ser colocado no cartão de log

    document.getElementById("log-trace").innerHTML = log_trace;
}

let cores_blocos = [];

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

        texto += "<td "+cores_blocos[cache_usada[i].bloco]+">"+ cache_usada[i].linha + "</td>";
        texto += "<td "+cores_blocos[cache_usada[i].bloco]+">"+ cache_usada[i].bloco +"</td>";  // aqui vem o Bloco
        texto += "<td "+cores_blocos[cache_usada[i].bloco]+">"+ cache_usada[i].offset +"</td>";  // aqui vem o Offset
        texto += "<td "+cores_blocos[cache_usada[i].bloco]+">"+ cache_usada[i].estado +"</td>";  // aqui vem o Estado
        texto += "<td "+cores_blocos[cache_usada[i].bloco]+">"+ cache_usada[i].valor +"</td>";  // aqui vem o valor
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

    for (let i = 0; i < tamanho_max_ram / tamanho_bloco_memoria; i++)
    {
        let r = Math.floor(Math.random() * 255);
        let g = Math.floor(Math.random() * 255);
        let b = Math.floor(Math.random() * 255);
        cores_blocos.push("style=\"background: rgba(" + r + "," + g + "," + b + ",.1);\"");
    }

    for (let i = 0; i < tamanho_max_cache; i++)
    {
        linhas_1.push(i);
        linhas_2.push(i);
        linhas_3.push(i);
    }
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
        "veleiro",
        "ponteiro laser",
        "fita adesiva",
        "televisão",
        "canudo",
        "bola de futebol",
        "telefone",
        "par de brincos",
        "garrafa de especiarias",
        "leão",
        "baterias",
        "caixa de chocolates",
        "meias",
        "par de óculos de água",
        "lata de refrigerante",
        "dinossauro de pelúcia",
        "árvore",
        "taco de piscina",
        "pônei de pelúcia",
        "tesoura",
        "vela",
        "par de pinças",
        "faca",
        "livro de partidas",
        "janela",
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
        "saco de elásticos",
        "martelo",
        "estatueta",
        "CD de música",
        "pulseira",
        "frasco de protetor solar",
        "colher de pau",
        "desodorante",
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
        "frasco de esmalte",
        "ocarina",
        "luzes de rua",
        "nota adesiva",
        "chaveiro",
        "botão de camisa",
        "rolo de adesivos",
        "porta-retratos",
        "copo de vinho",
        "pacote de cartas",
        "bandana",
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
        "CD de jogo",
        "carne bovina",
        "frigideira",
        "anzol de pesca",
        "saco de bolas de algodão",
        "copo de martíni",
        "busca de palavras",
        "pedaço de goma",
        "panela de barro",
        "jogos",
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
        "bule de chá",
        "pacote de doces crocantes",
        "folha de papel",
        "lata de ervilhas",
        "palito",
        "caixa de giz",
        "garrafa de tinta",
        "relógio",
        "rolo de fita adesiva",
        "garrafa de tinta",
        "pomba",
        "papel",
        "saco de lixo",
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
        "tartaruga",
        "chapéu de cowboy",
        "espanador",
        "pôster vintage de filme",
        "câmera fotográfica antiga",
        "relógio de bolso de prata",
        "moedas raras",
        "vinis de edição limitada",
        "espada de samurai",
        "estátua de bronze",
        "tapete persa antigo",
        "quadro a óleo",
        "livro autografado",
        "máquina de escrever antiga",
        "jogo de chá de porcelana",
        "joias de ouro",
        "selo postal raro",
        "guitarra assinada",
        "fato de astronauta",
        "revista em quadrinhos rara",
        "lâmpada Tiffany",
        "caneta de luxo",
        "sabre de luz de colecionador",
        "carteira de couro vintage",
        "caixa de música antiga",
        "coleção de cartas de tarô",
        "relógio de parede de madeira",
        "máquina de costura vintage",
        "joias de prata",
        "espelho vitoriano",
        "gravuras emolduradas",
        "cadeira de balanço antiga",
        "cofre de ferro",
        "câmera de filme 16mm",
        "escultura de mármore",
        "binóculos antigos",
        "globo terrestre vintage",
        "mapa antigo",
        "violino artesanal",
        "abajur de cristal",
        "livro de receitas antigo",
        "pintura em aquarela",
        "coleção de selos",
        "miniatura de carro",
        "caixa de joias de marfim",
        "vitrola antiga",
        "relógio de sol",
        "caneca de porcelana",
        "álbum de fotos vintage",
        "caderno de notas antigo",
        "capacete de guerra",
        "bússola antiga",
        "máquina de calcular mecânica",
        "leque de seda",
        "porta-cigarros de prata",
        "medalhas de guerra",
        "rolo de filme de cinema",
        "chave antiga",
        "busto de mármore",
        "canivete suíço antigo",
        "brinquedo de lata",
        "pinball vintage",
        "boneca de porcelana",
        "estribo de cavalo",
        "porta-retratos de prata",
        "moeda de ouro",
        "banco de madeira esculpida",
        "lâmpada de lava",
        "espada medieval",
        "candelabro de prata",
        "faca de caça",
        "maquete de navio",
        "relógio de mesa",
        "tapete Kilim",
        "álbum de moedas",
        "porta-copos de madeira",
        "bengala com cabo esculpido",
        "caderno de desenho",
        "piano de cauda antigo",
        "gravura de paisagem",
        "coroa de flores de metal",
        "pingente de âmbar",
        "cachimbo de madeira",
        "compasso de navegação",
        "colete à prova de balas antigo",
        "medalhão de ouro",
        "prato de prata",
        "telefone de disco",
        "quimono antigo",
        "cabideiro de ferro forjado",
        "manta de lã feita à mão",
        "modelo de avião",
        "joias de esmeralda",
        "espelho de mão",
        "anéis de diamante",
        "coleção de selos internacionais",
        "tabuleiro de xadrez de mármore",
        "pingente de safira",
        "jarro de cerâmica",
        "medalhas olímpicas",
        "armadura de cavaleiro",
        "guarda-chuva de seda",
        "relógio de ouro",
        "colar de pérolas",
        "espátula de cozinha vintage",
        "coleção de vinhos",
        "ferramenta de relojoeiro",
        "cartola vintage",
        "leque japonês",
        "quadros renascentistas",
        "cantil militar",
        "anéis de prata",
        "castiçal de bronze",
        "filtro de água vintage",
        "foice antiga",
        "brinco de rubi",
        "flâmula de time",
        "coleção de canetas tinteiro",
        "abajur art déco",
        "sabre de cavalaria",
        "pulseira de ouro",
        "colcha de retalhos antiga",
        "bomba de ar manual",
        "carruagem de brinquedo",
        "espelho com moldura dourada",
        "bule de chá de prata",
        "baralho de tarô",
        "medalha de honra",
        "globo de neve vintage",
        "cartão postal raro",
        "cofre de banco",
        "porta-velas de ferro",
        "armário de madeira",
        "miniatura de soldado",
        "cachimbo de cerâmica",
        "busto de bronze",
        "joias de topázio",
        "relógio de corrente",
        "cartaz de circo",
        "bibelô de cristal",
        "pente de madrepérola",
        "máscara africana",
        "modelos de trem",
        "caixa de charutos",
        "gaiola de pássaro antiga",
        "pingente de rubi",
        "quadro renascentista",
        "espelho de bolso vintage",
        "moringa de cerâmica",
        "escultura de madeira",
        "flâmula militar",
        "livro de fotografia",
        "móvel art déco",
        "cachimbo de marfim",
        "pulseira de diamante",
        "tabuleiro de gamão",
        "cartas de amor antigas",
        "vitral colorido",
        "porta-jóias de prata",
        "ventilador antigo",
        "busto de gesso",
        "escultura de pedra",
        "flâmula esportiva",
        "cálice de prata",
        "relógio de parede vintage",
        "máquina de costura manual",
        "globo terrestre iluminado",
        "modelo de barco",
        "vaso chinês antigo",
        "brinco de pérola",
        "tapete oriental",
        "compasso de desenho",
        "quadro de flores secas",
        "porta-velas de vidro",
        "joias de turquesa",
        "relógio de pulso vintage",
        "penteadeira antiga",
        "coleção de isqueiros",
        "lente de câmera vintage",
        "caixa de rapé",
        "cristaleira de madeira",
        "porta-cartões de prata",
        "bengala de prata",
        "brinco de diamante",
        "busto de cerâmica",
        "ventilador de mesa vintage",
        "cofre de ferro fundido",
        "globo de neve",
        "escultura de metal",
        "anel de safira",
        "caneta tinteiro",
        "pente de prata",
        "máscara de carnaval",
        "flâmula de time de futebol",
        "boneca de madeira",
        "jogo de chá de prata",
        "colar de esmeraldas",
        "medalhão de ouro",
        "trompete antigo",
        "coroa de metal",
        "relógio de pêndulo",
        "abajur de cristal",
        "espátula de prata",
        "coleção de moedas",
        "porta-joias de cristal",
        "ventilador de ferro",
        "banco de couro",
        "busto de mármore",
        "compasso de madeira",
        "caixa de música",
        "joias de ametista",
        "penteadeira vintage",
        "relógio de bolso de ouro",
        "pingente de rubi",
        "bule de prata",
        "caixa de fósforos vintage",
        "quadro de natureza morta",
        "espelho de moldura prata",
        "joias de granada",
        "estatueta de cerâmica",
        "cartão postal vintage",
        "bengala de marfim",
        "flâmula de equipe",
        "globo de cristal",
        "máscara veneziana",
        "boneca de porcelana",
        "busto de bronze",
        "relógio de bolso vintage",
        "cálice de cristal",
        "joias de opala",
        "relógio de mesa de bronze",
        "pingente de esmeralda",
        "coleção de selos",
        "quadro abstrato",
        "escultura de metal",
        "flâmula de equipe",
        "joias de citrino",
        "medalha militar",
        "globo terrestre",
        "ventilador de ferro",
        "brinco de opala",
        "compasso de navegação vintage",
        "estatueta de bronze",
        "pingente de ametista",
        "cálice de prata",
        "tabuleiro de xadrez vintage",
        "tapete de lã",
        "escultura de madeira",
        "relógio de bolso de ouro",
        "espelho de moldura antiga",
        "coleção de moedas de prata",
        "busto de bronze",
        "pente de marfim",
        "ventilador de mesa",
        "caixa de música vintage",
        "compasso de desenho vintage",
        "quadro de flores",
        "relógio de bolso de prata"
    ];

    return items[Math.floor(Math.random() * items.length)];
}