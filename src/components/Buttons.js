import "./buttons.css";

function Buttons({ parentRef, title, children, onClick }) {
  return (
    <button className="window-button" onClick={onClick}>
      {children}
    </button>
  );
}

export default Buttons;
