import { useState, useCallback } from 'react';
import { Popover, PopoverProps, Typography } from '@material-ui/core';

export const usePopover = ({ content, ...props }: Partial<PopoverProps> & { content: string }) => {
  const [anchorEl, setAnchorEl] = useState<Element | null | undefined>(null);
  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    setAnchorEl(event.currentTarget);
  };
  const handlePopoverClose = useCallback(() => void setAnchorEl(null), []);

  const Pop = (
    <Popover {...props} open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={handlePopoverClose}>
      <Typography>{content}</Typography>
    </Popover>
  );

  return { handlePopoverOpen, handlePopoverClose, Pop };
};
