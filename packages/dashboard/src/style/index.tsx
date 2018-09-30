export const warningColor = '#ff9800';
export const dangerColor = '#f44336';
export const successColor = '#4caf50';
export const infoColor = '#00acc1';

export const drawerWidth = 200;

export const colorToAlpha = (hex: string, alpha: number) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex) || ['', '', ''];
    const r = parseInt(result[1], 16);
    const g = parseInt(result[2], 16);
    const b = parseInt(result[3], 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const colorToShadow = (hex: string) =>
    `0 12px 20px -10px ${colorToAlpha(hex, 0.28)}, 0 4px 20px 0px rgba(0, 0, 0, 0.12), 0 7px 8px -5px ${colorToAlpha(hex, 0.2)}`;
