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

const Svg = styled.svg`
    height:${SVG_HEIGHT}px;
    width:${SVG_WIDTH}px;
    background:rgba(255,255,255, 0.1);
`;

const Container = styled.div`
    margin: 30px;
`;

const Title = styled.span`
    display: block;
    font-size:26px;
    font-weight: 400;
    color: white;
    text-align: center;
    text-transform: uppercase;
    letter-spacing: 2px;
    font-weight: 500;
`;

const Canvas = styled.div`
`;

const SidePanel = styled.div`
    text-align: center;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    margin: 20px;
    padding: 20px 50px;
    background: rgba(0, 0, 0, 0.2);
    align-items: center;
    justify-content: center;
`;

const MainContent = styled.div`
    margin-top:20px;
    display: flex;
    flex-direction: row;
`;

const barDefaultColor = '#6be6ff';
const barCompareColor = 'yellow';

const BubbleSort: React.FC = () => {

    const data : number[] = [];

    const [dataLength, setDataLength] = useState(50);
    const [speedPercent, setSpeedPercent] = useState(100);
    const [isRunning, setIsRunning] = useState(false);

    function getRandomInt(max : number) {
        return Math.floor(Math.random() * Math.floor(max));
    }
    
    for(let i = 0; i < dataLength; i++) {
        data.push(getRandomInt(100));
    }


    const scale = d3.scaleLinear()
        .domain([0, Math.max(...data)])
        .range([0, SVG_HEIGHT]);

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
        const totalDurationCycle = (duration + delay) * (bars.length/2);
      
        for(let j = 0; j < bars.length - 1; j++) {
            let swaps = false;
            for (let i = 0; i < bars.length - 1 - j; i++) {
                
                const first = select(bars[i]);
                const second = select(bars[i+1]);
             
                d3.timeout(() => first.attr('fill', barCompareColor), (delay * i) + (totalDurationCycle * j));
                d3.timeout(() => second.attr('fill', barCompareColor), (delay * i) + (totalDurationCycle * j));
    
                if (parseFloat(first.attr('height')) > parseFloat(second.attr('height'))) {
                    first
                        .transition("swap1")
                        .duration(duration)
                        .delay((delay * i) + (totalDurationCycle * j))
                        .attr('x', ((i+1) * SVG_WIDTH / dataset.length) + 20)
                        .on('end', function () {
                            select(this).attr('fill', barDefaultColor);
                        });

                    second
                        .transition("swap2")
                        .duration(duration)
                        .delay((delay * i) + (totalDurationCycle * j))
                        .attr('x', (i * SVG_WIDTH / dataset.length) + 20)
                        .on('end', function () {
                            select(this).attr('fill', barDefaultColor)
                        });

                        swaps = true;
                        const temp = bars[i];
                        bars[i] = bars[i+1];
                        bars[i+1] = temp;
                } else {
                    d3.timeout(() => first.attr('fill',barDefaultColor), ((delay * i) + (totalDurationCycle * j)) + duration);
                    d3.timeout(() => second.attr('fill',barDefaultColor), ((delay * i) + (totalDurationCycle * j)) + duration);
                }
                
            }
            if(!swaps) {
                d3.timeout(() => setIsRunning(false), (delay * dataset.length) + ((totalDurationCycle * j)) + duration);
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
                <Canvas>
                    <Svg ref={svgRef}></Svg>
                </Canvas>
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