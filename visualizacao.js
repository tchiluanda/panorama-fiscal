const $grafico = d3.select('.grafico-d3');
const $grafico_container = d3.select('.grafico-d3-container');
const $svg     = $grafico.select('.grafico-d3-svg');

const PAD = 20;

console.log("Estou aqui.")

d3.csv("dados.csv", function(d) {
    return {
        periodo: d3.timeParse("%Y-%m-%d")(d.Periodo),
        tipo_despesa: d.tipo_despesa,
        vlr_var: +d.valor_variacao,
        vlr_dif: +d.valor_diferenca,
        vlr_acu: +d.valor_acumulado
    }
}).then(function(dados) {
    // testes para entender a estrutura dos dados

    //console.log(dados);
    console.log(Object.keys(dados[1]));
    console.table(dados);
    //console.table(dados[1]);
    //console.log(dados[1].Periodo);
    //console.log(d3.extent(dados, d => d.Periodo));

    // constantes gerais dos dados
    const PERIODO = d3.extent(dados, d => d.periodo);
    const AMPLITUDE_VLR_ABSOLUTO = d3.extent(dados, d => d.vlr_acu);
    const AMPLITUDE_VLR_VARIACAO = d3.extent(dados, d => d.vlr_var);
    const AMPLITUDE_VLR_DIF      = d3.extent(dados, d => d.vlr_dif);

    const w = $grafico_container.node().offsetWidth;
    console.log("Largura do container: ", w);

    const h = 400;

    const LAST_DATE = d3.max(dados, d => d.periodo);
    console.log("Última data: ", LAST_DATE);

    console.log("Amplitude período: ",         PERIODO);
    console.log("Amplitude valor absoluto: ",  AMPLITUDE_VLR_ABSOLUTO);
    console.log("Amplitude valor relativo: ",  AMPLITUDE_VLR_VARIACAO);
    console.log("Amplitude valor diferença: ", AMPLITUDE_VLR_DIF);

    const scale_Y_PERIODO = d3
        .scaleTime()
        .domain(PERIODO)
        .range([PAD, w - PAD])

    const scale_DIFERENCA = d3
        .scalePow()
        .exponent(0.5)
        .range([0, 80])
        .domain(AMPLITUDE_VLR_DIF);

    const scale_ABSOLUTO = d3
        .scaleLinear()
        .range([h - PAD, PAD])
        .domain(AMPLITUDE_VLR_ABSOLUTO);

    const scale_VARIACAO = d3
        .scaleLinear()
        .range([h - PAD, PAD])
        .domain(AMPLITUDE_VLR_VARIACAO);
    
    console.log("Teste escala absoluta: ", 
                dados[1].vlr_acu,
                "corresponde a: ",
                scale_ABSOLUTO(dados[1].vlr_acu),
                "pixels.");

    // grab svg reference
    const $SVG = d3.select(".grafico-d3-svg")
                   .attr("width", w)
                   .attr("height", h);

    // create line
    const line = d3.line()
                   .x(d => scale_Y_PERIODO(d.periodo))
                   .y(d => scale_ABSOLUTO(d.vlr_acu));
    
    const dados_obrig = dados.filter(d => d.tipo_despesa == "obrigatoria");
    const dados_discr = dados.filter(d => d.tipo_despesa == "discricionaria");

    console.table(dados_obrig);
    console.table(dados_discr);

    const t_linhas = 4000;

    const linha_obrig = $SVG.append("path")
                            .datum(dados_obrig)
                            .attr("class", "line obrig")
                            .attr("d", line)
                            .attr('stroke', "steelblue")
                            .attr('stroke-width', 3)
                            .attr('fill', 'none');

    let comprimento_linha_obrig = linha_obrig.node().getTotalLength();
    console.log("Comprimento linha:", comprimento_linha_obrig);

    linha_obrig
            .attr("stroke-dasharray", comprimento_linha_obrig + " " + comprimento_linha_obrig)
            .attr("stroke-dashoffset", comprimento_linha_obrig)
            .transition()
            .duration(t_linhas)
            .ease(d3.easeLinear)
            .attr("stroke-dashoffset", 0);

    const linha_discr = $SVG.append("path")
                            .datum(dados_discr)
                            .attr("class", "line discr")
                            .attr("d", line)
                            .attr('stroke', "lightcoral")
                            .attr('stroke-width', 3)
                            .attr('fill', 'none');

    let comprimento_linha_discr = linha_obrig.node().getTotalLength();
    console.log("Comprimento linha:", comprimento_linha_discr);

    linha_discr
            .attr("stroke-dasharray", comprimento_linha_discr + " " + comprimento_linha_obrig)
            .attr("stroke-dashoffset", comprimento_linha_discr)
            .transition()
            .duration(t_linhas)
            .ease(d3.easeLinear)
            .attr("stroke-dashoffset", 0);

    // console.log(AMPLITUDE_VLR_ABSOLUTO, 
    //     d3.max(dados, d => d.vlr_acu),
    //     scale_ABSOLUTO.domain(),
    //     scale_ABSOLUTO.range());








    

    
})

/*

// Define uma função que vai recalcular a largura disponível para o gráfico conforme o tamanho do div de container.

function resize() {

    console.log('estou em resize'); // só para mostrar que está funcionando.

    // captura largura do div que envolve o svg
    const w = $grafico_container.node().offsetWidth;

    // agora chama o render toda vez que mudar o tamanho, passando a largura:
    render(w);

}

// Define a função que vai fazer o desenho propriamente dito

function render(w) {

} */