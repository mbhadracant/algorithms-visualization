import React, { useState } from 'react';
import NavBar from '../NavBar';
import Algorithms from '../../constants/Algorithms';
import BubbleSort from '../Algorithms/BubbleSort';
import SelectionSort from '../Algorithms/SelectionSort';

const ComponentMap = {
  [Algorithms.BUBBLE_SORT]: <BubbleSort />,
  [Algorithms.SELECTION_SORT]: <SelectionSort />,
  [Algorithms.BINARY_SEARCH]: <SelectionSort />,
}

const App : React.FC = () => {

  const [selectedAlgorithm, setSelectedAlgorithm] = useState<Algorithms>(Algorithms.SELECTION_SORT);
  const AlgorithmComponent = ComponentMap[selectedAlgorithm];
  console.log(selectedAlgorithm)

  return (
    <>
      <NavBar setAlgo={setSelectedAlgorithm}/>
      {AlgorithmComponent}
    </>
  )
};

export default App;
