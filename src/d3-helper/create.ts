import { SVG_WIDTH, SVG_HEIGHT } from "../constants/Values";
import { select } from 'd3-selection';
import { barDefaultColor } from "../constants/Color";
import * as d3 from 'd3';

const createBars = (svg: SVGSVGElement | null, dataset: number[]) => {
    const offset = ((SVG_WIDTH / dataset.length)) * 0.25;
        
        select(svg)
            .selectAll('rect')
            .data(dataset)
            .enter()
            .append('rect')
            .attr('id', (d, i) => `bar-${i.toString()}`)
            .attr('width', (SVG_WIDTH / dataset.length) - offset)
            .attr('height', (d) => d)
            .attr('x', (d, i) => (i * ((SVG_WIDTH / dataset.length))))
            .attr('y', (d) => SVG_HEIGHT - d)
            .attr('fill', barDefaultColor);
}

const createScaledDatasetFromHeight = (n : number) => {

    const data = [];

    function getRandomInt(max : number) {
        return Math.floor(Math.random() * Math.floor(max));
    }
    
    for(let i = 0; i < n; i++) {
        data.push(getRandomInt(100));
    }

    const scale = d3.scaleLinear()
        .domain([0, Math.max(...data)])
        .range([10, SVG_HEIGHT-100]);

    return data.map(x => scale(x)!);
}



const testDataset = () => {
    const data = [173, 337, 119, 500];
    
    const scale = d3.scaleLinear()
    .domain([0, Math.max(...data)])
    .range([10, SVG_HEIGHT]);

    return data.map(x => scale(x)!);
}
    
export { createBars, createScaledDatasetFromHeight, testDataset };