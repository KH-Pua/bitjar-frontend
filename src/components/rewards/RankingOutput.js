import React from "react";

export const RankingOutput = ({ index }) => {
  return (
    <>
      <div className="absolute bottom-0 z-[2] text-[1.2rem]">
        {`${index}` == 1 ? <>🥇</> : null}
        {`${index}` == 2 ? <>🥈</> : null}
        {`${index}` == 3 ? <>🥉</> : null}
      </div>
    </>
  );
};
