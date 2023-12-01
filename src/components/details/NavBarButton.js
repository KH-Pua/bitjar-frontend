//-----------Libraries-----------//
import React from "react";
import { NavLink } from "react-router-dom";

//-----------Components-----------//

const NavBarButton = ({ logo, title, nav }) => {
  return (
    <NavLink to={nav}>
      <div className=" my-1 flex w-full flex-row rounded-md  p-1 py-2 hover:bg-yellow-200">
        <img src={logo} alt="" className="h-6" />
        <p className="ml-4">{title}</p>
      </div>
    </NavLink>
  );
};

export default NavBarButton;
