import { Popover, PopoverProps, Typography } from '@material-ui/core';
import { MouseEvent, useState, useCallback } from 'react';

export const usePopover = ({ content, ...props }: Partial<PopoverProps> & { content: string }) => {
    const [anchorEl, setAnchorEl] = useState<Element | null | undefined>(null);
    const handlePopoverOpen = (event: MouseEvent<HTMLElement, MouseEvent>) => {
        setAnchorEl(event.currentTarget);
    };
    const handlePopoverClose = useCallback(() => setAnchorEl(null), []);

    const Pop = (
        <Popover {...props} open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={handlePopoverClose}>
            <Typography>{content}</Typography>
        </Popover>
    );

    return { handlePopoverOpen, handlePopoverClose, Pop };
};
