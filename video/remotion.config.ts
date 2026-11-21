import {Config} from '@remotion/cli/config';
Config.setEntryPoint('src/index.ts');
// Dans le cloud Claude : utiliser le Chromium préinstallé (ignoré s'il n'existe pas)
import fs from 'fs';
if (fs.existsSync('/opt/pw-browsers/chromium')) {
  Config.setBrowserExecutable('/opt/pw-browsers/chromium');
}
