export type ControllerType = 'xbox' | 'playstation' | 'nintendo' | 'unknown';

export interface ControllerMapping {
  buttons: string[];
  axes: string[];
  validation?: {
    minButtons?: number;
    minAxes?: number;
    idPatterns?: RegExp[];
  };
}

export interface ControllerMappings {
  xbox: ControllerMapping;
  playstation: ControllerMapping;
  nintendo: ControllerMapping;
  unknown: ControllerMapping;
}

export interface GamepadState {
  gamepad: globalThis.Gamepad | null;
  buttonPressed: string | null;
  axisMoved: string | null;
  connected: boolean;
  buttons: Record<string, boolean>;
  axes: Record<string, number>;
  lastButtonPressed: string | null;
  controllerType: ControllerType;
  lastUpdate: number;
}

export interface GamepadConfig {
  deadzone: number;
  vibrationEnabled: boolean;
  vibrationIntensity: number;
  pollingInterval: number;
  buttonCombinations: Record<string, number[]>;
} 