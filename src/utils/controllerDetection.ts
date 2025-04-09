import { CONTROLLER_MAPPINGS } from "../config/controllerMappings";
import { ControllerType } from "../types/gamepad";
import { isValidGamepad } from "./gamepadUtils";

export const detectControllerType = (gamepad: globalThis.Gamepad): ControllerType => {
  if (!isValidGamepad(gamepad)) {
    return 'unknown';
  }

  const id = gamepad.id.toLowerCase();
  const buttons = gamepad.buttons.length;
  const axes = gamepad.axes.length;

  // Check Xbox controller
  if (CONTROLLER_MAPPINGS.xbox.validation?.idPatterns?.some(pattern => pattern.test(id)) &&
      buttons >= (CONTROLLER_MAPPINGS.xbox.validation?.minButtons ?? 0) &&
      axes >= (CONTROLLER_MAPPINGS.xbox.validation?.minAxes ?? 0)) {
    return 'xbox';
  }

  // Check PlayStation controller
  if (CONTROLLER_MAPPINGS.playstation.validation?.idPatterns?.some(pattern => pattern.test(id)) &&
      buttons >= (CONTROLLER_MAPPINGS.playstation.validation?.minButtons ?? 0) &&
      axes >= (CONTROLLER_MAPPINGS.playstation.validation?.minAxes ?? 0)) {
    return 'playstation';
  }

  // Check if it meets minimum requirements for unknown controller
  if (buttons >= (CONTROLLER_MAPPINGS.unknown.validation?.minButtons ?? 0) &&
      axes >= (CONTROLLER_MAPPINGS.unknown.validation?.minAxes ?? 0)) {
    return 'unknown';
  }

  return 'unknown';
}; 