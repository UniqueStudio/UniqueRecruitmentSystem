import { resolve } from 'path';

// eslint-disable-next-line import/no-extraneous-dependencies
import { replaceTscAliasPaths } from 'tsc-alias';

const rootPath = resolve(__dirname, '../');

replaceTscAliasPaths({
    configFile: resolve(rootPath, 'tsconfig.json'),
});