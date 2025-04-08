import React from "react";

import "./App.css";
import useGamepadController from "./hooks/useGamepad";

const App: React.FC = () => {
  const gamepads = useGamepadController();

  return (
    <div>
      {Object.entries(gamepads).map(([index, gamepad]) => (
        <div key={index}>
          <h3>{gamepad.id}</h3>
          <p>
            Botones:{" "}
            {gamepad.buttons.map((b, i) => (b ? `B${i} ` : "")).join("")}
          </p>
          <p>Ejes: {gamepad.axes.map((a, i) => `A${i}: ${a.toFixed(2)} `)}</p>
        </div>
      ))}
    </div>
  );
};

export default App;
