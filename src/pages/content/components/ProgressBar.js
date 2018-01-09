import React, {Component, Fragment} from "react";

export default ({total, current}) => {
  const bar_width = 100 / (!!total ? total : 2) * (!!current ? current : 0);

  return (
      <div class="ease-progress-bar">
        <div class="ease-progress-bar-filler" style={{width: `${bar_width}%`}}/>
      </div>
  )
};