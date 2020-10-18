import { select } from 'd3-selection';
import * as d3 from 'd3';
import { barCompareColor, barDefaultColor, barFocusColor } from '../../../constants/Color';
import { SVG_WIDTH } from '../../../constants/Values';

export default (svg: SVGSVGElement,  setIsRunning : Function, duration: number, dataset: number[]) => {
    setIsRunning(true);
    const bars = select(svg).selectAll('rect').nodes().sort((a, b) => parseInt(select(a).attr('x')) - parseInt(select(b).attr('x')));
    let currDuration = 0;
  
    for(let j = 0; j < bars.length - 1; j++) {
        let min = Number.MAX_VALUE;
        let minIndex = -1;
        
        d3.timeout(() => console.log(`starting`), currDuration);
        for (let i = j; i < bars.length; i++) {
            const curr = select(bars[i]);
            const minBar = select(bars[minIndex]);
            
            d3.timeout(() => curr.attr('fill', barCompareColor), currDuration);
            currDuration += duration;
            const height = parseFloat(curr.attr('height'));
            
            if (height < min) {
                minIndex = i;
                min = height;
                d3.timeout(() => curr.attr('fill', barFocusColor), currDuration);
                d3.timeout(() => minBar.attr('fill', barDefaultColor), currDuration);
                
            } else {
                d3.timeout(() => curr.attr('fill', barDefaultColor), currDuration);
            }
        }
        
        const first = select(bars[minIndex]);
        const second = select(bars[j]);

        first
            .transition("swap2")
            .duration(duration)
            .delay(currDuration)
            .attr('x', ((j) * SVG_WIDTH / dataset.length))
            .on('end', function () {
                select(this).attr('fill', barDefaultColor);
            });

        second
            .transition("swap1")
            .duration(duration)
            .delay(currDuration)
            .attr('x', ((minIndex) * SVG_WIDTH / dataset.length))
            .on('end', function () {
                select(this).attr('fill', barDefaultColor);
            });
            
            currDuration += duration;

            const temp = bars[minIndex];
            bars[minIndex] = bars[j];
            bars[j] = temp;
    }

    d3.timeout(() => setIsRunning(false), currDuration);
}