
import useGamepad from './hooks/useGamepad'
import './App.css'

function App() {
  const { gamepad, buttonPressed, axisMoved } = useGamepad();

  return (
    <div>
      <h1>Gamepad Detector</h1>
      {gamepad ? (
        <div>
          <p>Controller: {gamepad.id}</p>
          <p>{buttonPressed ? `Button Pressed: ${buttonPressed}` : 'No button pressed'}</p>
          <p>{axisMoved ? `Axis Moved: ${axisMoved}` : 'No axis moved'}</p>
        </div>
      ) : (
        <p>No gamepad connected</p>
      )}
    </div>
  );
};

export default App
