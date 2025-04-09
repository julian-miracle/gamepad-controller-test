import { useEffect, useRef, useState } from "react";
import { isValidGamepad, applyDeadzone } from "../utils/gamepadUtils";
import { detectControllerType } from "../utils/controllerDetection";
import { getButtonName, getAxisName } from "../utils/controllerMappingUtils";
import { GamepadState, GamepadConfig } from "../types/gamepad";

const DEFAULT_CONFIG: GamepadConfig = {
  deadzone: 0.1,
  pollingInterval: 16, // ~60fps
  buttonCombinations: {
    // Add your button combinations here
    // Example: "menu": [0, 1] // A + B buttons
  },
  vibrationEnabled: true,
  vibrationIntensity: 0.5
};

const useGamepad = (config: GamepadConfig = DEFAULT_CONFIG) => {
  const [state, setState] = useState<GamepadState>({
    gamepad: null,
    buttonPressed: null,
    axisMoved: null,
    connected: false,
    buttons: {},
    axes: {},
    lastButtonPressed: null,
    controllerType: 'unknown',
    lastUpdate: Date.now()
  });
  const animationFrameRef = useRef<number | undefined>(undefined);
  const buttonHistoryRef = useRef<string[]>([]);
  const configRef = useRef<GamepadConfig>({ ...DEFAULT_CONFIG, ...config });

  useEffect(() => {
    const handleGamepadConnected = (event: GamepadEvent) => {
      const gamepad = event.gamepad;
      if (!isValidGamepad(gamepad)) {
        console.warn('Invalid gamepad connected:', gamepad.id);
        return;
      }

      const controllerType = detectControllerType(gamepad);
      console.log('Gamepad connected:', gamepad.id, 'Type:', controllerType);
      setState(prev => ({ ...prev, gamepad, connected: true, controllerType }));
    };

    const handleGamepadDisconnected = () => {
      setState(prev => ({ ...prev, gamepad: null, connected: false, controllerType: 'unknown' }));
    };

    const updateGamepadState = () => {
      const gamepads = navigator.getGamepads();
      const gamepad = Array.from(gamepads).find(g => g !== null && isValidGamepad(g));
      
      if (gamepad) {
        const controllerType = detectControllerType(gamepad);
        
        // Update buttons state
        const buttons: Record<string, boolean> = {};
        gamepad.buttons.forEach((button, index) => {
          const buttonName = getButtonName(index, controllerType);
          buttons[buttonName] = button.pressed;
        });

        // Update axes state with deadzone
        const axes: Record<string, number> = {};
        gamepad.axes.forEach((axis, index) => {
          const axisName = getAxisName(index, controllerType);
          axes[axisName] = applyDeadzone(axis, configRef.current.deadzone!);
        });

        setState(prev => ({ ...prev, gamepad, buttons, axes, controllerType }));

        // Check for button presses
        const pressedButton = gamepad.buttons.findIndex(button => button.pressed);
        if (pressedButton !== -1) {
          const buttonName = getButtonName(pressedButton, controllerType);
          setState(prev => ({ ...prev, buttonPressed: buttonName, lastButtonPressed: buttonName }));
          
          // Update button history
          buttonHistoryRef.current = [buttonName, ...buttonHistoryRef.current].slice(0, 5);

          // Trigger haptic feedback
          if (configRef.current.vibrationEnabled && gamepad.vibrationActuator) {
            try {
              gamepad.vibrationActuator.playEffect("dual-rumble", {
                duration: 100,
                strongMagnitude: configRef.current.vibrationIntensity,
                weakMagnitude: configRef.current.vibrationIntensity,
              });
            } catch (error) {
              console.warn('Failed to trigger vibration:', error);
            }
          }
        } else {
          setState(prev => ({ ...prev, buttonPressed: null }));
        }

        // Check for axis movement
        const movedAxis = gamepad.axes.findIndex(axis => 
          Math.abs(applyDeadzone(axis, configRef.current.deadzone!)) > 0
        );
        if (movedAxis !== -1) {
          const axisName = getAxisName(movedAxis, controllerType);
          setState(prev => ({ ...prev, axisMoved: axisName }));
        } else {
          setState(prev => ({ ...prev, axisMoved: null }));
        }
      }

      // Request next frame
      animationFrameRef.current = requestAnimationFrame(updateGamepadState);
    };

    window.addEventListener("gamepadconnected", handleGamepadConnected);
    window.addEventListener("gamepaddisconnected", handleGamepadDisconnected);

    // Start the animation frame loop
    animationFrameRef.current = requestAnimationFrame(updateGamepadState);

    return () => {
      window.removeEventListener("gamepadconnected", handleGamepadConnected);
      window.removeEventListener("gamepaddisconnected", handleGamepadDisconnected);
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Helper function to check if a button combination was pressed
  const wasButtonCombinationPressed = (combination: string[]): boolean => {
    return combination.every(button => buttonHistoryRef.current.includes(button));
  };

  return {
    ...state,
    wasButtonCombinationPressed,
  };
};

export default useGamepad;