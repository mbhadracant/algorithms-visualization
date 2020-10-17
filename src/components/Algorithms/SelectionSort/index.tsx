import React, { useRef, useEffect, useState } from 'react';
import { select, BaseType } from 'd3-selection';
import * as d3 from 'd3';
import styled from 'styled-components';
import { SVG_WIDTH, SVG_HEIGHT } from '../../../constants/Dimensions';
import RunButton from '../../Shared/RunButton';
import NumberInput from '../../Shared/NumberInput';
import RefreshDataButton from '../../Shared/RefreshDataButton';
import SpeedSlider from '../../Shared/SpeedSlider';
import RunningAnimation from '../../Shared/RunningAnimation';
import Svg from '../../Shared/Svg';
import Title from '../../Shared/Title';
import MainContent from '../../Shared/MainContent';
import SidePanel from '../../Shared/SidePanel';
import { barCompareColor, barDefaultColor } from '../../../constants/Color';

const Container = styled.div`
    margin: 30px;
`;

const SelectionSort: React.FC = () => {

    const data : number[] = [];

    const [dataLength, setDataLength] = useState(50);
    const [speedPercent, setSpeedPercent] = useState(50);
    const [isRunning, setIsRunning] = useState(false);

    function getRandomInt(max : number) {
        return Math.floor(Math.random() * Math.floor(max));
    }
    
    for(let i = 0; i < dataLength; i++) {
        data.push(getRandomInt(100));
    }


    const scale = d3.scaleLinear()
        .domain([0, Math.max(...data)])
        .range([10, SVG_HEIGHT]);

    const dataset = data.map(x => scale(x)!);

    const svgRef = useRef<SVGSVGElement>(null);
    const inputFieldRef = useRef(null);

    const onRefresh = () => {
        const svg = svgRef.current;
        const n = select(inputFieldRef.current).property('value');
        
        if(n !== '') {
            select(svg).selectAll("*").remove();
            setDataLength(parseInt(n));
        }
    }

    const onRun = () => {
        setIsRunning(true);
        const svg = svgRef.current;
        const delay = 20 / (speedPercent/100);
        const duration = 20 / (speedPercent/100);
        const bars = select(svg).selectAll('rect').nodes().sort((a, b) => parseInt(select(a).attr('x')) - parseInt(select(b).attr('x')));      
      
        for(let j = 0; j < bars.length - 1; j++) {
            let totalDurationCycle = (((delay * bars.length - j) + duration) * j);
            let min = Number.MAX_VALUE;
            let minIndex = -1;
            
            d3.timeout(() => console.log('starting'), totalDurationCycle);
            for (let i = j; i < bars.length; i++) {
                const curr = select(bars[i]);
                const minBar = select(bars[minIndex]);
                
                d3.timeout(() => curr.attr('fill', barCompareColor), (delay * i) + totalDurationCycle);
                const height = parseFloat(curr.attr('height'));
                
                if (height < min) {
                    minIndex = i;
                    min = height;
                    d3.timeout(() => curr.attr('fill', 'red'), (delay * i) + totalDurationCycle);
                    d3.timeout(() => minBar.attr('fill', barDefaultColor), (delay * i) + totalDurationCycle);
                } else {
                    d3.timeout(() => curr.attr('fill', barDefaultColor), ((delay * i) + delay) + totalDurationCycle);
                }
            }
            
            d3.timeout(() => console.log('swapping now'), ((delay * bars.length - j)) + totalDurationCycle);
            
        
            const first = select(bars[minIndex]);
            const second = select(bars[j]);

            first
                .transition("swap2")
                .duration(duration)
                .delay((delay * bars.length - j) + delay + totalDurationCycle)
                .attr('x', ((j) * SVG_WIDTH / dataset.length))
                .on('end', function () {
                    select(this).attr('fill', barDefaultColor);
                });

            second
                .transition("swap1")
                .duration(duration)
                .delay((delay * bars.length - j) + delay + totalDurationCycle)
                .attr('x', ((minIndex) * SVG_WIDTH / dataset.length))
                .on('end', function () {
                    select(this).attr('fill', barDefaultColor);
                });
                

                const temp = bars[minIndex];
                bars[minIndex] = bars[j];
                bars[j] = temp;

                d3.timeout(() => console.log('swapping done'), ((delay * bars.length - j) + delay + duration) + totalDurationCycle);
        }
    }

    useEffect(() => {
        const svg = svgRef.current;

        const offset = 5;

        select(svg)
            .selectAll('rect')
            .data(dataset)
            .enter()
            .append('rect')
            .attr('width', (SVG_WIDTH / dataset.length) - offset)
            .attr('height', (d) => d)
            .attr('x', (d, i) => (i * ((SVG_WIDTH / dataset.length))))
            .attr('y', (d) => SVG_HEIGHT - d)
            .attr('fill', barDefaultColor);
    });

    const sliderOnChange = function(event : React.ChangeEvent<HTMLInputElement>) {
        setSpeedPercent(parseInt(event.target.value));
    };

    return (
        <Container>
            <Title>Selection Sort</Title>
            <MainContent>
                <Svg ref={svgRef}></Svg>
                <SidePanel>
                    { 
                        isRunning 
                        ? <RunningAnimation></RunningAnimation>
                        : 
                            <>
                                <NumberInput label="Number of elements: " ref={inputFieldRef} placeholder="Default (50)"/>
                                <RefreshDataButton onClick={() => onRefresh()}>Refresh Data</RefreshDataButton>
                                <SpeedSlider value={speedPercent} type="range" min={1} max={500} defaultValue={speedPercent} onChange={sliderOnChange}/>
                                <RunButton onClick={() => onRun()}>Sort</RunButton>
                            </>
                    }
                </SidePanel>
            </MainContent>
        </Container>
    )
};

export default SelectionSort;