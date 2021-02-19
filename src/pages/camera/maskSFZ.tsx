import React from "react";
import * as Svg from "react-native-svg";
import utils from "@/utils";

export default function MaskSFZ(props){
  return (
    <Svg.Svg color="#000" width={utils.window.screenW} height={utils.window.screenH}>
      <Svg.Defs>
        <Svg.Rect id="rect1" x="0" y="0" width={utils.window.screenW} height={utils.window.screenH} fill="#000" />
        <Svg.Mask id="mask1" width={utils.window.screenW} height={utils.window.screenH}  maskUnits="userSpaceOnUse" x="0" y="0">
          <Svg.Rect  x="0" y="0" width={utils.window.screenW} height={utils.window.screenH} fill="#fff" />
          <Svg.Rect  x={utils.window.screenW*0.1} y={(utils.window.screenH-utils.window.screenW*0.8/1.6)/2} tr width={utils.window.screenW*0.8} height={utils.window.screenW*0.8/1.6} fill="#000" />
        </Svg.Mask>
      </Svg.Defs>
      <Svg.Use href="#rect1" mask="url(#mask1)"></Svg.Use>
      <Svg.Text dx="50%" dy="80%" fill="#fff" textAnchor="middle" fontSize="16" >{props.text}</Svg.Text>
    </Svg.Svg>
  )
}