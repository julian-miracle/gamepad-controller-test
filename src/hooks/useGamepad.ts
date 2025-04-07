import { useState, useEffect } from "react";

const useGamepad = () => {
  const [gamepad, setGamepad] = useState<Gamepad | null>(null);
  const [buttonPressed, setButtonPressed] = useState<string | null>(null);
  const [axisMoved, setAxisMoved] = useState<string | null>(null);

  useEffect(() => {
    const handleGamepadConnected = (event: GamepadEvent) => {
      if (!event.gamepad) return;
      setGamepad(event.gamepad);
    };

    const handleGamepadDisconnected = () => {
      setGamepad(null);
    };

    const updateGamepadState = () => {
      const gamepads = navigator.getGamepads();
      if (gamepads[0]) {
        const gamePadInUse = gamepads[0];
        setGamepad(gamePadInUse);

        const buttons = gamePadInUse.buttons.map((button, index) => ({
          pressed: button.pressed,
          index,
        }));
        const pressedButton = buttons.find((button) => button.pressed);
        if (pressedButton) {
          setButtonPressed(`Button ${pressedButton.index}`);
          if (
            [0, 1, 2, 3, 12, 13, 14, 15].includes(pressedButton.index) &&
            gamePadInUse.vibrationActuator
          ) {
            gamePadInUse.vibrationActuator.playEffect("dual-rumble", {
              duration: 100,
              strongMagnitude: 0.2,
              weakMagnitude: 0.2,
              leftTrigger: 0.2,
              rightTrigger: 0.2,
            });
          }
        } else {
          setButtonPressed(null);
        }

        const axes = gamePadInUse.axes.map((axis, index) => ({
          value: axis,
          index,
        }));
        const movedAxis = axes.find((axis) => Math.abs(axis.value) > 0.1);
        if (movedAxis) {
          setAxisMoved(`Axis ${movedAxis.index}`);
          if (gamePadInUse.vibrationActuator) {
            gamePadInUse.vibrationActuator.playEffect("dual-rumble", {
              duration: 100,
              strongMagnitude: 0.1,
              weakMagnitude: 0.1,
              leftTrigger: 0.1,
              rightTrigger: 0.1,
            });
          }
        } else {
          setAxisMoved(null);
        }
      }
    };

    window.addEventListener("gamepadconnected", handleGamepadConnected);
    window.addEventListener("gamepaddisconnected", handleGamepadDisconnected);

    const interval = setInterval(updateGamepadState, 100);
    return () => {
      window.removeEventListener("gamepadconnected", handleGamepadConnected);
      window.removeEventListener("gamepaddisconnected", handleGamepadDisconnected);
      clearInterval(interval);
    };
  }, []);

  return { gamepad, buttonPressed, axisMoved };
};

export default useGamepad;