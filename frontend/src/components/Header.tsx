// src/components/Header.tsx

import React from "react";
import ThemeToggle from "./ThemeToggle";

const Header: React.FC = () => {
  return (
    <header className="flex justify-between items-center p-4">
      <div className="flex items-center">
        {/* Small Logo: Visible on small screens, hidden on medium and larger screens */}
        <img
          src="https://www.cinemacalc.com/user/themes/cinema-calc-marketing-website-theme/assets/logo-small.svg"
          alt="Cinema Calc Logo"
          className="block md:hidden h-8 w-auto"
        />

        {/* Big Logo: Hidden on small screens, visible on medium and larger screens */}
        <img
          src="https://www.cinemacalc.com/user/themes/cinema-calc-marketing-website-theme/assets/logo-big.svg"
          alt="Cinema Calc Logo"
          className="hidden md:block h-12 w-auto"
        />
      </div>
      <ThemeToggle />
    </header>
  );
};

export default Header;
