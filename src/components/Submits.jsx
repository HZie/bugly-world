import "./buttons.css";
import mouseClick from "../assets/sounds/mouse_click.ogg";

function Submits({ value }) {
  return <input className="window-button" type="submit" value={`${value}`} />;
}

export default Submits;
