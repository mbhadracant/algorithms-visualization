import { select, BaseType } from "d3-selection";
import * as d3 from 'd3';
import { barCompareColor, barCompareSecondaryColor, barDefaultColor } from "../../../constants/Color";
import { SVG_WIDTH } from "../../../constants/Values";
export default (svg: SVGSVGElement, setIsRunning: Function, duration: number, dataset: number[]) => {
  let currDuration = 0;

  setIsRunning(true);
  const bars = select(svg).selectAll('rect').nodes().sort((a, b) => parseFloat(select(a).attr('x')) - parseFloat(select(b).attr('x')));
  
  function mergeSort (arr : BaseType[]) : BaseType[]{
    if(arr.length === 1){
      return arr;
    }
    let mid = Math.floor(arr.length / 2);
  
    const L = arr.slice(0, mid);
    const R = arr.slice(mid, arr.length);
  
  
    for (let i = 0; i < mid; i++) {
      const curr = select(arr[i]);
      d3.timeout(() => curr.attr('fill', barCompareSecondaryColor), currDuration);
    }
  
    for (let i = mid; i < arr.length; i++) {
      const curr = select(arr[i]);
      d3.timeout(() => curr.attr('fill', barCompareSecondaryColor), currDuration);
    }
  
    currDuration += (duration);
  
    for (let i = 0; i < mid; i++) {
      const curr = select(arr[i]);
      d3.timeout(() => curr.attr('fill', barDefaultColor), currDuration);
    }
  
    for (let i = mid; i < arr.length; i++) {
      const curr = select(arr[i]);
      d3.timeout(() => curr.attr('fill', barDefaultColor), currDuration);
    }
  
    currDuration += (duration);
  
    const left = mergeSort(L);
    const right = mergeSort(R);
  
    let mergeArr = [];
    let i = 0,j = 0;
  
  
    const old = [...left, ...right];
  
    while (i < left.length && j < right.length) {
      const leftH = parseFloat(select(left[i]).attr('height'));
      const rightH = parseFloat(select(right[j]).attr('height'));
  
      if(leftH < rightH){
        mergeArr.push(left[i++])
    
      }else {
        mergeArr.push(right[j++])
      }
    }
  
    const result = mergeArr.concat(left.slice(i)).concat(right.slice(j));
  
    const changeMap = new Map();
  
    for (let z = 0; z < result.length; z++) {
      const prev = select(old[z]);
      const curr = select(result[z]);
      const value = prev.attr('id') === curr.attr('id') ? curr.attr('id') : prev.attr('id');
      changeMap.set(curr, value);
      d3.timeout(() => curr.attr('fill', barCompareColor), currDuration);
    }
  
    currDuration += (duration);
    
    Array.from(changeMap, ([k, v]) => {
      const bar: d3.Selection<any, unknown, null, undefined> = k;
      
      bar.attr('id', v);
      const barPos = v.substring(4);

      bar
          .transition()
          .duration(duration)
          .delay(currDuration)
          .attr('x', ((parseInt(barPos)) * ((SVG_WIDTH / dataset.length))))
          .on('end', function () {
            select(this).attr('fill', barDefaultColor);
          });
    });
    currDuration += (duration);
    return result;
  } 

  
  const result = mergeSort(bars);
  d3.timeout(() => setIsRunning(false), currDuration);
}