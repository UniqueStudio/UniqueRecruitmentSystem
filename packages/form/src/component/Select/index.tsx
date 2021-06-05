import { InputBase, MenuItem, Select } from '@material-ui/core';
import classNames from 'classnames';
import React, { ChangeEvent, FC, memo, useState } from 'react';

import arrow from '../../asset/img/arrow.svg';
import useStyles from '../../style/Select';

interface SelectProps {
    selections: string[];
    value: string;
    defaultValue: string;
    handleSelect: (value: number) => void;
}

const CustomSelect: FC<SelectProps> = memo(({ selections, value, defaultValue, handleSelect }) => {
    const [open, setOpen] = useState<boolean>(false);
    const classes = useStyles() as any;

    const renderIcon = () => {
        const { svg, rotateSvg } = classes;
        return <img src={arrow} className={classNames('MuiSvgIcon-root', svg, { [rotateSvg]: open })} />;
    };

    const renderValue = (v: any) => {
        if (!v) return defaultValue;
        return v;
    };

    return (
        <Select
            value={value}
            IconComponent={renderIcon}
            onChange={(event: ChangeEvent<{ value: unknown }>) => {
                handleSelect(event.target.value as number);
            }}
            displayEmpty
            renderValue={renderValue}
            open={open}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            classes={{ select: classes.select }}
            className={classNames(classes.border, classes.root, classes.height)}
            variant='standard'
            input={<InputBase classes={{ input: classNames(classes.input, classes.font) }} />}
            MenuProps={{ classes: { paper: classNames(classes.menu, classes.border) } }}
        >
            {selections.map((v, i) => (
                <MenuItem dense key={i} value={i} classes={{ root: classNames(classes.menuItem, classes.font) }}>
                    {v}
                </MenuItem>
            ))}
        </Select>
    );
});

export default CustomSelect;
