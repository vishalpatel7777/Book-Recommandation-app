import React, { useEffect } from "react";
import "../../assets/styles/pages/welcome.css"; // Path relative to src/pages/user/
import WelcomeVideo from "../../assets/images/video/banner.mp4"; // Path relative to src/pages/user/
import { useNavigate } from "react-router-dom";

function Welcome() {
  const navigate = useNavigate();
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <main className="welcome-page">
      <video autoPlay muted className="bg-welcome">
        <source src={WelcomeVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <button className="go-button" onClick={() => navigate("/home")}>
        Here you go
      </button>
    </main>
  );
}

export default Welcome;