import { Reducer } from 'react';
import { ClocMap, TreeNode } from './buildTreeData';
import mortgageClocData from './exampleData/mortgage-cloc.json';
import reactRouterClocData from './exampleData/react-router-cloc.json';

type State = {
  filter: string;
  inputData: ClocMap;
  currentRootNode: TreeNode;
  currentDepth: number;
};

export type Action =
  | { type: 'setFilter'; filter: string }
  | { type: 'uploadFile'; inputData: ClocMap }
  | { type: 'selectNode'; node: TreeNode; depth: number };

export const reducer: Reducer<State, Action> = (
  state: State,
  action: Action,
): State => {
  switch (action.type) {
    case 'setFilter': {
      return {
        filter: action.filter,
        inputData: state.inputData,
        currentRootNode: null,
        currentDepth: 0,
      };
    }
    case 'uploadFile': {
      return {
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
  }
};

const exampleInputs: Record<string, ClocMap> = {
  mortgage: (mortgageClocData as any) as ClocMap,
  reactRouter: (reactRouterClocData as any) as ClocMap,
};
const initialInput = exampleInputs.reactRouter;
const initialFilter = 'package-lock.json';

export const initialState: State = {
  filter: initialFilter,
  inputData: initialInput,
  currentRootNode: null,
  currentDepth: 0,
};
