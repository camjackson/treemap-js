import { Reducer } from 'react';
import { ClocMap, TreeNode } from './buildTreeData';
import reactRouterData from './exampleData/react-router.json';
import batectData from './exampleData/batect.json';
import mortgageData from './exampleData/whatif.mortgage.json';

type State = {
  name: string;
  filter: string;
  inputData: ClocMap;
  currentRootNode: TreeNode;
  currentDepth: number;
};

export type Action =
  | { type: 'setFilter'; filter: string }
  | { type: 'uploadFile'; name: string; inputData: ClocMap }
  | { type: 'selectNode'; node: TreeNode; depth: number }
  | { type: 'selectExample'; name: string };

export const reducer: Reducer<State, Action> = (
  state: State,
  action: Action,
): State => {
  switch (action.type) {
    case 'setFilter': {
      return {
        ...state,
        filter: action.filter,
        currentRootNode: null,
        currentDepth: 0,
      };
    }
    case 'uploadFile': {
      return {
        name: action.name,
        filter: state.filter,
        inputData: action.inputData,
        currentRootNode: null,
        currentDepth: 0,
      };
    }
    case 'selectNode': {
      return {
        ...state,
        currentRootNode: action.node,
        currentDepth: action.depth,
      };
    }
    case 'selectExample': {
      return {
        name: action.name,
        filter: state.filter,
        inputData: exampleInputs[action.name],
        currentRootNode: null,
        currentDepth: 0,
      };
    }
  }
};

const exampleInputs: Record<string, ClocMap> = {
  'react-router': (reactRouterData as any) as ClocMap,
  batect: (batectData as any) as ClocMap,
  mortgage: (mortgageData as any) as ClocMap,
};
export const examples = Object.keys(exampleInputs);
const initialExample = 'react-router';
const initialInput = exampleInputs[initialExample];
const initialFilter = 'package-lock.json';

export const initialState: State = {
  name: initialExample,
  filter: initialFilter,
  inputData: initialInput,
  currentRootNode: null,
  currentDepth: 0,
};
