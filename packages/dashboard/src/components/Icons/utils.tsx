import { SvgIcon, SvgIconProps } from '@mui/material';
import React from 'react';

export const generateIcon = (path: string) => (props: SvgIconProps) =>
    (
        <SvgIcon {...props}>
            <path d={path} />
        </SvgIcon>
    );
