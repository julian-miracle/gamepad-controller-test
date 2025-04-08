import React, { useEffect, useState } from "react";

import "./App.css";
import useGamepadController from "./hooks/useGamepad";

const FACE_1_INDEX = 0; // Índice de FACE_1 (X en PS, A en Xbox)

const App: React.FC = () => {
  const gamepads = useGamepadController();
  const [buttonPressed, setButtonPressed] = useState(false);

  //Button press detection for reaction
  useEffect(() => {
    Object.entries(gamepads).forEach(([index, gamepad]) => {
      if (gamepad.buttons[FACE_1_INDEX] && !buttonPressed) {
        console.log(`FACE_1 pressed with index - ${index}`);
        setButtonPressed(true);
      } else if (!gamepad.buttons[FACE_1_INDEX] && buttonPressed) {
        setButtonPressed(false);
      }
    });
  }, [gamepads, buttonPressed]);

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
