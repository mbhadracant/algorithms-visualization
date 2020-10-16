import React, { useState } from 'react';
import NavBar from '../NavBar';
import Algorithms from '../../constants/Algorithms';
import BubbleSort from '../Algorithms/BubbleSort';

const ComponentMap = {
  [Algorithms.BUBBLE_SORT]: <BubbleSort/>
}

const App : React.FC = () => {

  const [selectedAlgorithm] = useState<Algorithms>(Algorithms.BUBBLE_SORT);

  const AlgorithmComponent = ComponentMap[selectedAlgorithm];

  return (
    <>
      <NavBar/>
      {AlgorithmComponent}
    </>
  )
};

export default App;
