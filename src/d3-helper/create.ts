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

function shuffle(array : number[]) {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
}
  
const createScaledDatasetFromHeight = (n : number) => {

    const data = [];
    
    for(let i = 0; i < n; i++) {
        data.push(i);
    }

    const randomData = shuffle(data);

    const scale = d3.scaleLinear()
        .domain([0, Math.max(...data)])
        .range([10, SVG_HEIGHT]);

    return randomData.map(x => scale(x)!);
}



const testDataset = () => {
    const data = [173, 337, 119, 500];
    
    const scale = d3.scaleLinear()
    .domain([0, Math.max(...data)])
    .range([10, SVG_HEIGHT]);

    return data.map(x => scale(x)!);
}
    
export { createBars, createScaledDatasetFromHeight, testDataset };