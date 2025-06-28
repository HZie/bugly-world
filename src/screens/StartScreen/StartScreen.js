import { useState } from "react";
import logo from "../../assets/images/uglyworld_logo.png";
import "./startScreen.css";
import "../../styles/transition.css";
import bgm from "../../assets/sounds/opening bgm.ogg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
//import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import { faEnvelope, faHouse } from "@fortawesome/free-solid-svg-icons";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";

function StartScreen({ onNext, audioRef }) {
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    if (clicked) return; // 중복 클릭 방지

    if (!audioRef.current) {
      audioRef.current = new Audio(bgm);
      audioRef.current.loop = true;
      audioRef.current.play();
    }
    setClicked(true);
    console.log(clicked);
    setTimeout(() => {
      onNext();
    }, 600); // 애니메이션 끝난 뒤 전환
  };

  return (
    <div className={`mobile start-screen ${clicked ? "fade-out" : ""}`}>
      <div className={`logo-wrapper ${clicked ? "glitch-out" : ""}`}>
        <img
          src={logo}
          className="logo"
          alt="uglyworld logo"
          onClick={handleClick}
        />
      </div>
      <div className={"contact"}>
        <a>
          <FontAwesomeIcon className="fa" icon={faEnvelope} />{" "}
          <span>juieeuglyworld@gmail.com</span>
        </a>
        <a
          href="https://juieeuglyworld.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FontAwesomeIcon className="fa" icon={faHouse} />{" "}
          <span>juieeuglyworld.com</span>
        </a>
        <a
          href="https://www.instagram.com/juieeuglyworld_official?igsh=c3lldDhlNml2dWxr"
          className="instagram-link"
        >
          <FontAwesomeIcon className="fa instagram" icon={faInstagram} />{" "}
          <span>@juieeuglyworld_official</span>
        </a>
      </div>
    </div>
  );
}

export default StartScreen;
