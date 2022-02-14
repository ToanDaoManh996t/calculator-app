import { ACTION } from "./App";

export default function DeleteButton({ dispatch }) {
  return (
    <button onClick={() => dispatch({ type: ACTION.DELETE_DIGIT })}>DEL</button>
  );
}
