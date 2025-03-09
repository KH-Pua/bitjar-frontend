// ------NOT IN USE ----//

import React from "react";

export const TokenCard = ({ imagesrc }) => {
  return (
    <div className="h-[3rem] w-[3rem] scale-100 overflow-hidden rounded-[50%] border border-slate-200">
      <img
        src={imagesrc}
        alt="logo"
        className="h-[100%] w-[100%] object-cover"
      />
    </div>
  );
};
