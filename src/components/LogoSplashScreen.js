import React from "react";
import "./../Css/LogoLoaderAnimated.css";

const LogoSplashScreen = () => {
  return (
    <div className="logo-animated-wrapper">
      <div className="spinner-dots">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className={`dot dot-${i}`} />
        ))}
      </div>
      <h1 className="logo-text">Sắc</h1>
    </div>
  );
};

export default LogoSplashScreen;
