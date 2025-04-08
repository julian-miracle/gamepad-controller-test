import { useState, useEffect, useRef } from "react";

interface GamepadState {
  id: string;
  buttons: boolean[];
  axes: number[];
}

const allowedGamepads = [
  "Wireless Controller", // PlayStation
  "Xbox Controller", // Xbox
  "Xbox One Wired Controller", // Xbox One
  "2In1 USB Joystick", // Genérico
];

const vibrationDuration = 50;
const vibrationIntensity = 0.3;
const axisThreshold = 0.5;

function useGamepadController(): Record<number, GamepadState> {
  const [gamepads, setGamepads] = useState<Record<number, GamepadState>>({});
  const requestRef = useRef<number | null>(null);
  const prevState = useRef<Record<number, GamepadState>>({});

  const hapticFeedback = (gamepad: Gamepad) => {
    if (gamepad.vibrationActuator) {
      gamepad.vibrationActuator.playEffect("dual-rumble", {
        duration: vibrationDuration,
        strongMagnitude: vibrationIntensity,
        weakMagnitude: vibrationIntensity,
      });
    }
  };

  useEffect(() => {
    const updateGamepads = () => {
      const gamepadList = navigator.getGamepads();
      const newGamepads: Record<number, GamepadState> = {};

      for (let i = 0; i < gamepadList.length; i++) {
        const gamepad = gamepadList[i];
        if (
          gamepad &&
          allowedGamepads.some((name) => gamepad.id.includes(name))
        ) {
          newGamepads[i] = {
            id: gamepad.id,
            buttons: gamepad.buttons.map((btn) => btn.pressed),
            axes: [...gamepad.axes],
          };

          const prev = prevState.current[i];

          if (prev) {
            const faceButtons = [0, 1, 2, 3];
            const dpadButtons = [12, 13, 14, 15];

            const buttonChanged = [...faceButtons, ...dpadButtons].some(
              (index) => prev.buttons[index] !== newGamepads[i].buttons[index]
            );

            const axesChanged = newGamepads[i].axes.some(
              (value, index) =>
                (Math.abs(value) > axisThreshold ||
                  Math.abs(value) > -axisThreshold) &&
                Math.abs(value - prev.axes[index]) > 0.1
            );

            if (buttonChanged || axesChanged) {
              hapticFeedback(gamepad);
            }
          }
        }
      }

      setGamepads(newGamepads);
      prevState.current = newGamepads;
      requestRef.current = requestAnimationFrame(updateGamepads);
    };

    const handleConnect = () => {
      if (!requestRef.current) {
        requestRef.current = requestAnimationFrame(updateGamepads);
      }
    };

    const handleDisconnect = (event: GamepadEvent) => {
      setGamepads((prev) => {
        const updated = { ...prev };
        delete updated[event.gamepad.index];
        return updated;
      });
    };

    window.addEventListener("gamepadconnected", handleConnect);
    window.addEventListener("gamepaddisconnected", handleDisconnect);

    requestRef.current = requestAnimationFrame(updateGamepads);

    return () => {
      window.removeEventListener("gamepadconnected", handleConnect);
      window.removeEventListener("gamepaddisconnected", handleDisconnect);
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  return gamepads;
}

export default useGamepadController;
