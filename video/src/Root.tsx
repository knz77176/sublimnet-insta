import React from 'react';
import {Composition} from 'remotion';
import {ReelTest} from './ReelTest';

export const RemotionRoot: React.FC = () => (
  <Composition
    id="ReelTest"
    component={ReelTest}
    durationInFrames={90}
    fps={30}
    width={1080}
    height={1920}
    defaultProps={{titre: 'Sublimnet'}}
  />
);
