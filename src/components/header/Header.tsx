import React from "react";

const Header = () => {
    return (
        <header className="header">
            <div className="header-logo">
                <a href="/">
                <img src="logo.webp" alt="UD Logo" />
                </a>
            </div>
            <ul className="header-top-menu">
                <li>
                  <a href="#">Home</a>  
                </li>
                <div className="header-cta">
                    <a className="team-button" href="#">
                        Team
                    </a>
                </div>
            </ul>
        </header>
    );
};

export default Header; 