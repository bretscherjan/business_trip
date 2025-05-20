import React, { useState } from "react";
import "./App.css";

function App() {
  //const App = () => {
  // State
  const [isToggled, setToggled] = useState(true);
  const [counterState, setCounterState] = useState(0);
  const [inputText, setInputText] = useState("");
  const [historyList, setHistoryList] = useState([]);
  // Functions as constants-style
  const toggleTrueFalse = () => setToggled(!isToggled);
  const incrementCounter = () => setCounterState(counterState + 1);
  //const decrementCounter = () => setCounterState(counterState - 1);
  //function style
  function decrementCounter() {
    setCounterState(counterState - 1);
  }

  return (
    <div className="App">
      <h3>Button Examples</ h3>

      <button
        className="App-button"
        onClick={() => toggleTrueFalse()}
        //onClick={ function() {console.log("hello from function");}}
      >
        {isToggled ? "an" : "aus"}
      </button>
      <p />
      <button onClick={incrementCounter}>{"+ " + counterState}</button>
      <button /* onClick={(e) => {
          decrementCounter();
        }} */
        onClick={decrementCounter}
      >
        {"- " + counterState}
      </button>
      <p />
      <form>
        <label>
          Name:
          <input
            type="text"
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);

              setHistoryList([...historyList, e.target.value]);
              console.log(inputText);
            }}
          />
          <p>{inputText}</p>
          <ul>
            { historyList.map((rec) => {
              return <div key={rec}>{rec}</div>;
            }) }
          </ul>
        </label>
        <input
          type="submit"
          value="Submit"
          /*  onClick={function(event) {
             console.log("function expression " + event.target.value);
           }} */
          onClick={() => console.log("Arrow function ")}
        />
      </form>
      <button>counter</button>
    </div>
  );
}
export default App;
