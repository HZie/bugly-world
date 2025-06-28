import "./buttons.css";
import mouseClick from "../assets/sounds/mouse_click.ogg";

function Buttons({ parentRef, title, children, onClick }) {
  const buttonSound = new Audio(mouseClick);
  return (
    <button
      className="window-button"
      onClick={() => {
        buttonSound.play();
        onClick();
      }}
    >
      {children}
    </button>
  );
}

export default Buttons;
