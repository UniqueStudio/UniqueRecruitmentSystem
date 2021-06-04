import { Color } from '@material-ui/core';
import { amber, blue, cyan, green, indigo, orange, purple, red, yellow } from '@material-ui/core/colors';

export const getRainbow = (variant: keyof Color) =>
    [red, purple, indigo, blue, cyan, green, yellow, amber, orange].map((color) => color[variant]);

export const drawerWidth = 200;
