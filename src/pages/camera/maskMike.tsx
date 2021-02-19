import React from "react";
import * as Svg from "react-native-svg";
import utils from "@/utils";

export default function(props){
  return (
    <Svg.Svg width={1024} height={1024} viewBox="0 0 1024 1024" fill="transparent"  {...props}>
      <Svg.Defs>
        <Svg.Rect id="rect1" x="0" y="0" width={1024} height={1024} fill="rgba(0,0,0,0.1)"  />
        <Svg.Mask id="mask1" width={1024} height={1024} >
          <Svg.Rect  x="0" y="0" width={1024} height={1024} fill="#fff" />
          <Svg.Path d="M737.882 512V391.53a30.118 30.118 0 0 0-60.235 0V512a165.647 165.647 0 0 1-331.294 0V391.53a30.118 30.118 0 0 0-60.235 0V512a226.184 226.184 0 0 0 195.764 223.774v122.579h-120.47a30.118 30.118 0 0 0 0 60.235h301.176a30.118 30.118 0 0 0 0-60.235h-120.47V735.774A226.184 226.184 0 0 0 737.882 512z" fill="#000"></Svg.Path>
          <Svg.Path d="M512 617.412a120.47 120.47 0 0 0 120.47-120.47v-271.06a120.47 120.47 0 0 0-240.94 0v271.06A120.47 120.47 0 0 0 512 617.411z" fill="#000"></Svg.Path>
        </Svg.Mask>
      </Svg.Defs>
      <Svg.Use href="#rect1" mask="url(#mask1)"></Svg.Use>
    </Svg.Svg>
  )
}