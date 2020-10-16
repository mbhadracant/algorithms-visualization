import React from 'react';
import styled from 'styled-components';
import NavBarItem from './NavBarItem';

const Container = styled.div`
    background-color: rgba(0,0,0, 0.2);
    display: flex;
    flex-direction: row;
`;

const Title = styled.span`
    color: white;
    display:block;
    padding: 10px;
    font-weight: bold;
    margin-left:30px;
    letter-spacing: 1px;
    text-transform: uppercase;
`;

const NavBar : React.FC = () => (
  <Container>
      <Title>Algorithms Visualization</Title>
      <NavBarItem title="Sorting" subTitles={['Bubble Sort', 'Selection Sort']}/>
      <NavBarItem title="Recursive" subTitles={['Binary Search']}/>
  </Container>
);

export default NavBar;