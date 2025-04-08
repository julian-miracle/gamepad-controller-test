import { useState, useEffect } from "react";

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

function useGamepadController(): Record<number, GamepadState> {
  const [gamepads, setGamepads] = useState<Record<number, GamepadState>>({});

  useEffect(() => {
    const updateGamepads = () => {
      const gamepadList = navigator.getGamepads();
      const newGamepads: Record<number, GamepadState> = {};

      for (let i = 0; i < gamepadList.length; i++) {
        if (
          gamepadList[i] &&
          allowedGamepads.some((name) => gamepadList[i]!.id.includes(name))
        ) {
          newGamepads[i] = {
            id: gamepadList[i]!.id,
            buttons: gamepadList[i]!.buttons.map((btn) => btn.pressed),
            axes: [...gamepadList[i]!.axes],
          };
        }
      }
      setGamepads(newGamepads);
    };

    const handleConnect = () => {
      updateGamepads();
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

    const interval = setInterval(updateGamepads, 100);

    return () => {
      window.removeEventListener("gamepadconnected", handleConnect);
      window.removeEventListener("gamepaddisconnected", handleDisconnect);
      clearInterval(interval);
    };
  }, []);

  return gamepads;
}

export default useGamepadController;
