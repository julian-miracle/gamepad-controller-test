import { ControllerMappings } from "../types/gamepad";

export const CONTROLLER_MAPPINGS: ControllerMappings = {
  xbox: {
    buttons: [
      'A', 'B', 'X', 'Y', 'LB', 'RB', 'LT', 'RT',
      'Back', 'Start', 'LS', 'RS', 'D-Up', 'D-Down',
      'D-Left', 'D-Right', 'Xbox'
    ],
    axes: [
      'Left Stick X', 'Left Stick Y',
      'Right Stick X', 'Right Stick Y'
    ],
    validation: {
      minButtons: 16,
      minAxes: 4,
      idPatterns: [
        /xbox/i,
        /microsoft/i,
        /x-input/i
      ]
    }
  },
  playstation: {
    buttons: [
      'Cross', 'Circle', 'Square', 'Triangle',
      'L1', 'R1', 'L2', 'R2',
      'Share', 'Options', 'L3', 'R3',
      'D-Up', 'D-Down', 'D-Left', 'D-Right',
      'PS'
    ],
    axes: [
      'Left Stick X', 'Left Stick Y',
      'Right Stick X', 'Right Stick Y'
    ],
    validation: {
      minButtons: 16,
      minAxes: 4,
      idPatterns: [
        /playstation/i,
        /dualsense/i,
        /dualshock/i,
        /ps3/i,
        /ps4/i,
        /ps5/i
      ]
    }
  },
  nintendo: {
    buttons: [
      'B', 'A', 'Y', 'X', 'L', 'R', 'ZL', 'ZR',
      'Minus', 'Plus', 'L3', 'R3',
      'D-Up', 'D-Down', 'D-Left', 'D-Right',
      'Home', 'Capture'
    ],
    axes: [
      'Left Stick X', 'Left Stick Y',
      'Right Stick X', 'Right Stick Y'
    ],
    validation: {
      minButtons: 16,
      minAxes: 4,
      idPatterns: [
        /nintendo/i,
        /switch/i,
        /pro controller/i
      ]
    }
  },
  unknown: {
    buttons: Array(17).fill(0).map((_, i) => `Button ${i}`),
    axes: Array(4).fill(0).map((_, i) => `Axis ${i}`),
    validation: {
      minButtons: 4,
      minAxes: 2
    }
  }
}; 