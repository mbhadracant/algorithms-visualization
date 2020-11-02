import React, { useState } from 'react';
import NavBar from '../NavBar';
import Algorithms from '../../constants/Algorithms';
import Sorting from '../Category/Sorting';
import RunBubbleSort from './../../d3-helper/Animation/BubbleSort';
import RunInsertionSort from './../../d3-helper/Animation/InsertionSort';
import RunSelectionSort from './../../d3-helper/Animation/SelectionSort';
import RunMergeSort from './../../d3-helper/Animation/MergeSort';


const ComponentMap = {
  [Algorithms.BUBBLE_SORT]: <Sorting title={Algorithms.BUBBLE_SORT} onRun={RunBubbleSort} />,
  [Algorithms.SELECTION_SORT]: <Sorting title={Algorithms.SELECTION_SORT} onRun={RunSelectionSort} />,
  [Algorithms.INSERTION_SORT]: <Sorting title={Algorithms.INSERTION_SORT} onRun={RunInsertionSort} />,
  [Algorithms.MERGE_SORT]: <Sorting title={Algorithms.MERGE_SORT} onRun={RunMergeSort} />,
  [Algorithms.BINARY_SEARCH]: <Sorting title={Algorithms.BUBBLE_SORT} onRun={RunBubbleSort} />,
}

const App : React.FC = () => {

  const [selectedAlgorithm, setSelectedAlgorithm] = useState<Algorithms>(Algorithms.MERGE_SORT);
  const AlgorithmComponent = ComponentMap[selectedAlgorithm];

  return (
    <>
      <NavBar setAlgo={setSelectedAlgorithm}/>
      {AlgorithmComponent}
    </>
  )
};

export default App;
