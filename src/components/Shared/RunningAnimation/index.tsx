import React, { useRef, useEffect } from 'react';
import styled from'styled-components';
import { select } from 'd3-selection';
import { easeSinInOut } from 'd3';

const height = 50;
const width = 200;

const Container = styled.div`

`;

const Svg = styled.svg`
    height:${height}px;
    width:${width}px;
`;

const RunningAnimation: React.FC = () => {

    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        const svg = svgRef.current;

        select(svg)
            .append('text')
            .attr('fill', 'white')
            .style('font-size', '24px')
            .style('text-transform', 'uppercase')
            .style('font-family', 'Roboto')
            .style('letter-spacing', '1.5px')
            .attr('x', (width/2) - 60)
            .attr('y', height/2)
            .text('Running')
            

        const square = select(svg)
            .append('rect')
            .attr('x', (width/2) - 60)
            .attr('y', (height/2) + 10)
            .attr('width', 20)
            .attr('height', 2)
            .attr('fill', 'white');
        
        const randomColor = () => '#' + Math.floor(Math.random()*16777215).toString(16);
        
        const animate = () => {
            square
            .transition()
            .ease(easeSinInOut)
            .attr('x', (width/2) + 35)
            .attr('fill', randomColor())
            .duration(1000)
            .transition()
            .ease(easeSinInOut)
            .attr('x', (width/2) - 60)
            .attr('fill', randomColor())
            .duration(1000)
            .on('end', animate)
        };
        
        animate();
        

    });

    return (
        <Container>
            <Svg ref={svgRef}></Svg>
        </Container>
    )

}

export default RunningAnimation;