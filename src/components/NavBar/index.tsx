import React from 'react';
import styled from 'styled-components';
import NavBarItem from './NavBarItem';
import NavigationData from '../../constants/NavigationData';

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

type NavBarProps = {
    setAlgo: Function
}

const NavBar : React.FC<NavBarProps> = ({ setAlgo }) => (
  <Container>
      <Title>Algorithms Visualization</Title>
      {
          NavigationData.map(data => <NavBarItem key={data.name} setAlgo={setAlgo} title={data.name} subTitles={data.children}/>)
      }
  </Container>
);

export default NavBar;