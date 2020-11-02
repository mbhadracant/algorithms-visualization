import React, { useRef, useEffect, useState } from 'react';
import { select } from 'd3-selection';
import styled from 'styled-components';
import RunButton from '../../Shared/RunButton';
import NumberInput from '../../Shared/NumberInput';
import RefreshDataButton from '../../Shared/RefreshDataButton';
import SpeedSlider from '../../Shared/SpeedSlider';
import RunningAnimation from '../../Shared/RunningAnimation';
import Svg from '../../Shared/Svg';
import Title from '../../Shared/Title';
import MainContent from '../../Shared/MainContent';
import SidePanel from '../../Shared/SidePanel';
import { createBars, createScaledDatasetFromHeight } from '../../../d3-helper/create';
import { DELAY } from '../../../constants/Values';

const Container = styled.div`
    margin: 30px;
`;

type SortingProps = {
    title: string,
    onRun: Function
}

const Sorting: React.FC<SortingProps> = ({ title, onRun }) => {

    const [dataset, setDataSet] = useState(createScaledDatasetFromHeight(50));
    const [speedPercent, setSpeedPercent] = useState(50);
    const [isRunning, setIsRunning] = useState(false);
    const duration = DELAY / (speedPercent/100);

    const svgRef = useRef<SVGSVGElement>(null);
    const inputFieldRef = useRef(null);

    function onRefresh() {
        const textValue = select(inputFieldRef.current).property('value');
        const n = textValue === '' ? dataset.length : parseInt(textValue);
        setDataSet(createScaledDatasetFromHeight(n));        
    }

    useEffect(() => {
        setDataSet(createScaledDatasetFromHeight(dataset.length));
        const svg = svgRef.current;
        select(svg).selectAll("*").remove();
        createBars(svg, dataset);
    },[title]);

    useEffect(() => {
        const svg = svgRef.current;
        select(svg).selectAll("*").remove();
        createBars(svg, dataset);
    }, [dataset]);

    const sliderOnChange = function(event : React.ChangeEvent<HTMLInputElement>) {
        setSpeedPercent(parseInt(event.target.value));
    };


    return (
        <Container>
            <Title>{title}</Title>
            <MainContent>
                <Svg ref={svgRef}></Svg>
                <SidePanel>
                    { 
                        isRunning 
                        ? <RunningAnimation></RunningAnimation>
                        : 
                            <>
                                <NumberInput label="Number of elements: " ref={inputFieldRef} placeholder="Default (50)"/>
                                <RefreshDataButton onClick={e => { onRefresh();}}>Refresh Data</RefreshDataButton>
                                
                                <SpeedSlider value={speedPercent} type="range" min={1} max={500} defaultValue={speedPercent} onChange={sliderOnChange}/>
                                <RunButton onClick={() => onRun(svgRef.current, setIsRunning, duration, dataset)}>Sort</RunButton>
                            </>
                    }
                </SidePanel>
            </MainContent>
        </Container>
    )
};

export default Sorting;