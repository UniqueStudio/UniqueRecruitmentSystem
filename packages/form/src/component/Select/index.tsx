import React, { PureComponent } from 'react';

import { InputBase, MenuItem, Select } from '@material-ui/core';
import classNames from 'classnames';
import arrow from '../../asset/img/arrow.svg';

import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import styles from '../../style/Select';

interface Props extends WithStyles<typeof styles> {
    selections: string[];
    value: string;
    defaultValue: string;
    handleSelect: (value: string | number) => () => void;
}

class CustomSelect extends PureComponent<Props> {
    state = {
        open: false
    };

    onOpen = () => {
        this.setState({ open: true });
    };

    onClose = () => {
        this.setState({ open: false });
    };

    renderIcon = () => {
        const { svg, rotateSvg } = this.props.classes;
        return <img src={arrow} className={classNames('MuiSvgIcon-root', svg, { [rotateSvg]: this.state.open })} />;
    };

    renderValue = (value: any) => {
        if (!value) return this.props.defaultValue;
        return value;
    };

    render() {
        const { selections, value, handleSelect, classes } = this.props;
        return (
            <Select
                value={value}
                IconComponent={this.renderIcon}
                onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
                    handleSelect(event.target.value as string | number)();
                }}
                displayEmpty
                renderValue={this.renderValue}
                open={this.state.open}
                onOpen={this.onOpen}
                onClose={this.onClose}
                classes={{
                    select: classes.select
                }}
                className={classNames(classes.border, classes.root)}
                variant='standard'
                input={<InputBase classes={{ input: classes.input }} />}
                MenuProps={{ classes: { paper: classNames(classes.menu, classes.border) } }}
            >
                {selections.map((v, i) => (
                    <MenuItem dense key={i} value={i} classes={{ root: classes.menuItem }}>
                        {v}
                    </MenuItem>
                ))}
            </Select>
        );
    }
}

export default withStyles(styles)(CustomSelect);
