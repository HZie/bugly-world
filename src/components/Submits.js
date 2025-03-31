import "./buttons.css";

function Submits({ value }) {
  return <input className="window-button" type="submit" value={`${value}`} />;
}

export default Submits;
