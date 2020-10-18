import { select } from 'd3-selection';
import * as d3 from 'd3';
import { barCompareColor, barDefaultColor } from '../../../constants/Color';
import { SVG_WIDTH } from '../../../constants/Values';

export default (svg: SVGSVGElement,  setIsRunning : Function, duration: number, dataset: number[]) : void => {
    setIsRunning(true);
    const bars = select(svg).selectAll('rect').nodes().sort((a, b) => parseInt(select(a).attr('x')) - parseInt(select(b).attr('x')));
    let currDuration = 0;
  
    for(let j = 0; j < bars.length - 1; j++) {
        let swaps = false;
        for (let i = 0; i < bars.length - 1 - j; i++) {
            
            const first = select(bars[i]);
            const second = select(bars[i+1]);
            d3.timeout(() => first.attr('fill', barCompareColor), currDuration);
            d3.timeout(() => second.attr('fill', barCompareColor), currDuration);
            
            currDuration += duration;

            if (parseFloat(first.attr('height')) > parseFloat(second.attr('height'))) {
                first
                    .transition("swap1")
                    .duration(duration)
                    .delay(currDuration)
                    .attr('x', ((i+1) * SVG_WIDTH / dataset.length))
                    .on('end', function () {
                        select(this).attr('fill', barDefaultColor);
                    });

                second
                    .transition("swap2")
                    .duration(duration)
                    .delay(currDuration)
                    .attr('x', (i * SVG_WIDTH / dataset.length))
                    .on('end', function () {
                        select(this).attr('fill', barDefaultColor)
                    });

                    swaps = true;
                    const temp = bars[i];
                    bars[i] = bars[i+1];
                    bars[i+1] = temp;
                    currDuration += duration;
            } else {
                d3.timeout(() => first.attr('fill',barDefaultColor), currDuration);
                d3.timeout(() => second.attr('fill',barDefaultColor), currDuration);
            }

        }
        if(!swaps) {
            d3.timeout(() => setIsRunning(false), currDuration);
            return;
        }
    }
}