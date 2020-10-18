import Algorithms from "./Algorithms";

const NavigationData = [
    { name: 'Sorting', children: [
        Algorithms.BUBBLE_SORT,
        Algorithms.SELECTION_SORT,
        Algorithms.INSERTION_SORT,
        Algorithms.MERGE_SORT
    ]},
    { name: 'Recursive', children: [Algorithms.BINARY_SEARCH]}
]

export default NavigationData;