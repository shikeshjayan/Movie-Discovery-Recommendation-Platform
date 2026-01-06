import { useReducer } from "react";

const initialState = {
  isOpen: false,
  pendingId: null,
  type: null,
};

function confirmationReducer(state, action) {
  switch (action.type) {
    case "OPEN_SINGLE":
      return {
        isOpen: true,
        pendingId: action.payload,
        type: "single",
      };
    case "OPEN_CLEAR":
      return {
        isOpen: true,
        pendingId: null,
        type: "clear",
      };
    case "CLOSE":
      return initialState;

    default:
      return state;
  }
}

export function useConfirmation() {
  const [state, dispatch] = useReducer(confirmationReducer, initialState);

  const openSingle = (id) => dispatch({ type: "OPEN_SINGLE", payload: id });
  const openClear = () => dispatch({ type: "OPEN_CLEAR" });
  const close = () => dispatch({ type: "CLOSE" });

  return {
    isOpen: state.isOpen,
    pendingId: state.pendingId,
    type: state.type,
    openSingle,
    openClear,
    close,
  };
}
