import React from "react";
import { Composition, Still } from "remotion";
import { Reel } from "./Reel";
import { Cover } from "./Cover";
import "./theme";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition id="SublimIA" component={Reel} durationInFrames={1980} fps={30} width={1080} height={1920} />
      <Still id="Cover" component={Cover} width={1080} height={1920} />
    </>
  );
};
