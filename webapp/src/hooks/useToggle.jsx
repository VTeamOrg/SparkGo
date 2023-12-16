import { useSignal } from "@preact/signals-react";

const useToggle = (initialState = false) => {
  const state = useSignal(initialState);

  const toggle = () => {
    state.value = !state.peek()
  };

  return [state, toggle];
};

export default useToggle;
