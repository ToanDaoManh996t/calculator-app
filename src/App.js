import { useReducer } from "react";
import DigitButton from "./button";
import OperationButton from "./operation";
import DeleteButton from "./delete";
import "./App.css";

export const ACTION = {
  ADD_DIGIT: "add-digit",
  CHOOSE_OPERATION: "choose-operation",
  CLEAR: "clear",
  DELETE_DIGIT: "delete-digit",
  EVALUATE: "evaluate",
};

const INTERGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
});

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTION.ADD_DIGIT:
      if (state.overwrite === true) {
        return {
          ...state,
          currentValue: payload.digit,
          overwrite: false,
        };
      }
      if (payload.digit === "0" && state.currentValue === "0") {
        return state;
      }
      if (payload.digit === "." && state.currentValue.includes(".")) {
        return state;
      }
      return {
        ...state,
        currentValue: `${state.currentValue || ""}${payload.digit}`,
      };
    case ACTION.CHOOSE_OPERATION:
      if (state.currentValue == null && state.previousValue === null) {
        return state;
      }

      if (state.currentValue == null) {
        return {
          ...state,
          operation: payload.operation,
        };
      }
      if (state.previousValue == null) {
        return {
          ...state,
          operation: payload.operation,
          previousValue: state.currentValue,
          currentValue: null,
        };
      }

      return {
        ...state,
        previousValue: evaluate(state),
        operation: payload.operation,
        currentValue: null,
      };
    case ACTION.CLEAR:
      return {};

    case ACTION.DELETE_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currentValue: null,
          overwrite: false,
        };
      }
      if (state.currentValue == null) {
        return state;
      }
      if (state.currentValue.length === 1) {
        return {
          ...state,
          currentValue: null,
        };
      }

      return {
        ...state,
        currentValue: state.currentValue.slice(0, -1),
      };

    case ACTION.EVALUATE:
      if (
        state.operation == null ||
        state.currentValue == null ||
        state.previousValue == null
      ) {
        return state;
      }
      return {
        ...state,
        overwrite: true,
        previousValue: null,
        currentValue: evaluate(state),
        operation: null,
      };
  }
}

function evaluate({ currentValue, previousValue, operation }) {
  const previous = parseFloat(previousValue);
  const current = parseFloat(currentValue);
  if (isNaN(current) || isNaN(previous)) {
    return "";
  }
  let computation = "";
  switch (operation) {
    case "+":
      computation = previous + current;
      break;
    case "-":
      computation = previous - current;
      break;
    case "*":
      computation = previous * current;
      break;
    case "/":
      computation = previous / current;
      break;
  }

  return computation.toString();
}

function formatValue(value) {
  if (value == null) {
    return;
  }
  const [integer, decimal] = value.split(".");
  if (decimal == null) {
    return INTERGER_FORMATTER.format(integer);
  }
  return `${INTERGER_FORMATTER.format(integer)}.${decimal}`;
}

function App() {
  const [{ currentValue, previousValue, operation }, dispatch] = useReducer(
    reducer,
    {}
  );

  return (
    <div className='App'>
      <div className='container'>
        <div className='output'>
          <span className='previous-output'>
            {formatValue(previousValue)} {operation}
          </span>
          <span className='current-output'>{formatValue(currentValue)}</span>
        </div>
        <div className='row'>
          <button
            className='span-2'
            onClick={() => dispatch({ type: ACTION.CLEAR })}
          >
            AC
          </button>
          <DeleteButton dispatch={dispatch} />
          <OperationButton operation='/' dispatch={dispatch} />
        </div>
        <div className='row'>
          <DigitButton digit='1' dispatch={dispatch} />
          <DigitButton digit='2' dispatch={dispatch} />
          <DigitButton digit='3' dispatch={dispatch} />
          <OperationButton operation='*' dispatch={dispatch} />
        </div>
        <div className='row'>
          <DigitButton digit='4' dispatch={dispatch} />
          <DigitButton digit='5' dispatch={dispatch} />
          <DigitButton digit='6' dispatch={dispatch} />
          <OperationButton operation='+' dispatch={dispatch} />
        </div>
        <div className='row'>
          <DigitButton digit='7' dispatch={dispatch} />
          <DigitButton digit='8' dispatch={dispatch} />
          <DigitButton digit='9' dispatch={dispatch} />
          <OperationButton operation='-' dispatch={dispatch} />
        </div>
        <div className='row'>
          <DigitButton digit='.' dispatch={dispatch} />
          <DigitButton digit='0' dispatch={dispatch} />
          <button
            className='span-2'
            onClick={() => dispatch({ type: ACTION.EVALUATE })}
          >
            =
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
