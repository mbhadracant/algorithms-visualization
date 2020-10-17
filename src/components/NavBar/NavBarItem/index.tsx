import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { ChevronDown } from 'react-feather';
import Algorithms from '../../../constants/Algorithms';

interface NavBarItemProps {
    title: String,
    subTitles: Array<Algorithms>
    setAlgo: Function
}

const Container = styled.div`
    color: white;
    width:100px;
    text-align: center;
    border:1px solid rgba(122, 122, 122, 0.1);
    font-size:12px;
    &:hover {
        background: rgba(0, 0, 0, 0.3);
    }
`;

const UnorderedList = styled.ul`
    list-style: none;
    padding: 10px;
    margin: 0;
`;

const ParentListItem = styled.li`
    list-style: none;
`;

interface ChildListItemProps {
    show: boolean,
    index: number
};

const ChildListItem = styled.li<ChildListItemProps>`
    position: absolute;
    list-style: none;
    display: none;
    white-space: nowrap;

    &:hover {
        background:rgba(255, 255, 255, 0.1);
        cursor: pointer;
    }
    ${({ show }) => show &&
    css`
      display: inline;
      background:#03191C;
    `}

  ${({ index }) =>
    css`
      width: 80px;
      padding:10px;
      top: ${index * 35 + 14}px;
      left:-12px;
    `}
`;

const Chevron = styled(ChevronDown)`
    position:relative;
    top: 3px;
    margin-left: 5px;
`;

const ChildUnorderedList = styled.ul`
    position: relative;
`;

const NavBarItem : React.FC<NavBarItemProps> = ({ title ,subTitles, setAlgo}) => {
    
    const [isHovered, setHovered] = useState(false);

    return (
        <Container
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <UnorderedList>
                <ParentListItem>
                    {title}
                    <Chevron size={12}/>
                    <ChildUnorderedList>
                        {
                            subTitles.map((subtitle : Algorithms, index) => 
                        <ChildListItem 
                            key={index}
                            index={index}
                            show={isHovered}
                            onClick={() => setAlgo(subtitle)}
                        >
                            {subtitle.toString()}
                        </ChildListItem>)
                        }
                    </ChildUnorderedList>
                </ParentListItem>
            </UnorderedList>
        </Container>
    );
};

export default NavBarItem;