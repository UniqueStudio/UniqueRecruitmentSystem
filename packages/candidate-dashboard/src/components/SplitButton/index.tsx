import { Button, ButtonGroup, ClickAwayListener, Grow, Paper, Popper, MenuItem, MenuList } from '@material-ui/core';
import { ExpandLess } from '@material-ui/icons';
import React, { FC, useState, useRef } from 'react';

interface Props {
    options: string[];
    onSelect: (index: number) => void;
}

export const SplitButton: FC<Props> = ({ options, children, onSelect }) => {
    const [open, setOpen] = useState(false);
    const anchorRef = useRef<HTMLDivElement>(null);

    const handleMenuItemClick = (index: number) => {
        onSelect(index);
        setOpen(false);
    };

    const handleToggle = () => setOpen((prevOpen) => !prevOpen);

    return (
        <>
            <ButtonGroup ref={anchorRef}>
                {children}
                <Button size='small' onClick={handleToggle}>
                    <ExpandLess />
                </Button>
            </ButtonGroup>
            <Popper open={open} anchorEl={anchorRef.current} transition disablePortal>
                {({ TransitionProps, placement }) => (
                    <Grow
                        {...TransitionProps}
                        style={{ transformOrigin: `center ${placement === 'bottom' ? 'top' : 'bottom'}` }}
                    >
                        <Paper>
                            <ClickAwayListener onClickAway={() => setOpen(false)}>
                                <MenuList>
                                    {options.map((option, index) => (
                                        <MenuItem key={index} onClick={() => handleMenuItemClick(index)}>
                                            {option}
                                        </MenuItem>
                                    ))}
                                </MenuList>
                            </ClickAwayListener>
                        </Paper>
                    </Grow>
                )}
            </Popper>
        </>
    );
};
