import React, { useEffect, useState } from "react";

import "./App.css";
import useGamepadController from "./hooks/useGamepad";

const BUTTON_ACTIONS: Record<number, () => void> = {
  0: () => console.log("FACE_1 (X/A) pressed"),
  1: () => console.log("FACE_2 (O/B) pressed"),
  2: () => console.log("FACE_3 (square/X) pressed"),
  3: () => console.log("FACE_4 (triangle/Y) pressed"),
  12: () => console.log("DPAD UP pressed"),
  13: () => console.log("DPAD DOWN pressed"),
};

const App: React.FC = () => {
  const gamepads = useGamepadController();
  const [pressedButtons, setPressedButtons] = useState<Record<number, boolean>>(
    {}
  );

  //Button press detection for reaction
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Object.entries(gamepads).forEach(([index, gamepad]) => {
      gamepad.buttons.forEach((pressed, buttonIndex) => {
        if (pressed && !pressedButtons[buttonIndex]) {
          BUTTON_ACTIONS[buttonIndex]?.();
          setPressedButtons((prev) => ({ ...prev, [buttonIndex]: true }));
        } else if (!pressed && pressedButtons[buttonIndex]) {
          setPressedButtons((prev) => ({ ...prev, [buttonIndex]: false }));
        }
      });
    });
  }, [gamepads, pressedButtons]);

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
