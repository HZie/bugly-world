import "./vaccineScreen.css";
import "../../styles/layout.css";

function VaccineScreen({ onNext }) {
  const handleClick = () => {
    onNext();
  };

  return (
    <div className="mobile vaccineScreen" onClick={handleClick}>
      <div>vaccineScreen</div>
    </div>
  );
}

export default VaccineScreen;
