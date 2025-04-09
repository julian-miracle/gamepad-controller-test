export const isValidGamepad = (gamepad: globalThis.Gamepad): boolean => {
  return (
    gamepad &&
    gamepad.connected &&
    gamepad.buttons.length > 0 &&
    gamepad.axes.length > 0
  );
};

export const applyDeadzone = (value: number, deadzone: number): number => {
  if (Math.abs(value) < deadzone) return 0;
  return value;
}; 