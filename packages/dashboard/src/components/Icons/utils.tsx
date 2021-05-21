import { SvgIcon, SvgIconProps } from '@material-ui/core';
import React from 'react';

export const generateIcon = (path: string) => (props: SvgIconProps) => (
    <SvgIcon {...props}>
        <path d={path} />
    </SvgIcon>
);
