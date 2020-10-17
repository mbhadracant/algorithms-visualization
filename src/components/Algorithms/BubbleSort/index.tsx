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

const BubbleSort: React.FC = () => {

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
        const duration = 20 / (speedPercent/100);
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
            <Title>Bubble Sort</Title>
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

export default BubbleSort;