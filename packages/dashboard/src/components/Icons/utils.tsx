import { SvgIcon, SvgIconProps } from '@material-ui/core';
import React, { FC } from 'react';

export const generateIcon = (path: string): FC<SvgIconProps> => (props) => {
    return (
        <SvgIcon {...props}>
            <path d={path} />
        </SvgIcon>
    );
};
