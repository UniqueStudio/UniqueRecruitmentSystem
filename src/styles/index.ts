import { Color } from '@material-ui/core';
import { amber, blue, cyan, green, indigo, orange, purple, red, yellow } from '@material-ui/core/colors';

export const getRainbow = (variant: keyof Color) =>
    [red, purple, indigo, blue, cyan, green, yellow, amber, orange].map((color) => color[variant]);

export const warningColor = amber[700];
export const dangerColor = red[700];
export const successColor = green[600];
export const infoColor = blue[700];

export const drawerWidth = 200;

export const colorToAlpha = (hex: string, alpha: number) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex) || ['', '', ''];
    const r = parseInt(result[1], 16);
    const g = parseInt(result[2], 16);
    const b = parseInt(result[3], 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const colorToShadow = (hex: string) =>
    `0 12px 20px -10px ${colorToAlpha(hex, 0.28)}, 0 4px 20px 0px rgba(0, 0, 0, 0.12), 0 7px 8px -5px ${colorToAlpha(
        hex,
        0.2,
    )}`;
