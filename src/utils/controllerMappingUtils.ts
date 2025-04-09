import { CONTROLLER_MAPPINGS } from "../config/controllerMappings";

export const getButtonName = (index: number, controllerType: keyof typeof CONTROLLER_MAPPINGS): string => {
  const mapping = CONTROLLER_MAPPINGS[controllerType];
  return mapping.buttons[index] || `Button ${index}`;
};

export const getAxisName = (index: number, controllerType: keyof typeof CONTROLLER_MAPPINGS): string => {
  const mapping = CONTROLLER_MAPPINGS[controllerType];
  return mapping.axes[index] || `Axis ${index}`;
}; 