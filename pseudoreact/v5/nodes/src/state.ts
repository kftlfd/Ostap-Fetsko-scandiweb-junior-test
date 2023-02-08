import type { State, RecursivePartial } from "./types";
import { render } from "./rendering";

const state: State = {};

function setState<S extends State>(newState: S) {
  Object.keys(newState).forEach((stateName) => {
    state[stateName] = {
      ...state[stateName],
      ...newState[stateName],
    };
  });
}

export function configureState<S extends State>(initialState: S) {
  setState(initialState);

  const dispatch = (newState: RecursivePartial<S>) => {
    setState(newState);
    render();
  };

  return { state: state as S, dispatch };
}
